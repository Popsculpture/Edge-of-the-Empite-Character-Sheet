'use strict';

const Engine = (() => {
  const CHAR_STATS = ['brawn', 'agility', 'intellect', 'cunning', 'willpower', 'presence'];

  const CHAR_ABBR = {
    brawn: 'BR', agility: 'AG', intellect: 'INT',
    cunning: 'CUN', willpower: 'WIL', presence: 'PR',
  };

  // Cost to raise a characteristic from currentRank to currentRank+1
  function xpToRaise(currentRank) {
    return (currentRank + 1) * 10;
  }

  // Total XP spent raising characteristics from species base to current values
  function totalCharXp(speciesChars, currentChars) {
    let total = 0;
    for (const stat of CHAR_STATS) {
      const base = speciesChars[stat] || 1;
      const cur  = currentChars[stat]  || base;
      for (let rank = base + 1; rank <= cur; rank++) {
        total += rank * 10;
      }
    }
    return total;
  }

  // Normalize a skill name for fuzzy matching
  // "Ranged (Light)" / "Ranged - Light" / "ranged light" -> "rangedlight"
  function normSkillName(name) {
    return name.toLowerCase().replace(/[^a-z0-9]/g, '');
  }

  // Build a map: normalized name -> skill key
  function buildSkillNameMap() {
    const map = {};
    for (const skill of SW.skills) {
      map[normSkillName(skill.name)] = skill.key;
    }
    return map;
  }

  let _skillNameMap = null;
  function skillNameMap() {
    if (!_skillNameMap) _skillNameMap = buildSkillNameMap();
    return _skillNameMap;
  }

  // Resolve a skill display name (from wiki) to a skill key.
  // Handles "Knowledge (Underworld)" -> Underworld and scraped wiki markup
  // like "and [[Vigilance (Will)|Vigilance]]".
  function nameToKey(displayName) {
    if (!displayName) return null;
    const map = skillNameMap();
    const clean = String(displayName)
      .replace(/\[\[[^\]|]*\|/g, '')   // drop "[[target|" from wiki links
      .replace(/[\[\]]/g, '')          // drop remaining brackets
      .replace(/^\s*and\s+/i, '')      // drop a leading "and "
      .trim();

    function resolve(s) {
      const norm = normSkillName(s);
      if (!norm) return null;
      if (map[norm]) return map[norm];
      for (const [n, k] of Object.entries(map)) {
        if (n.startsWith(norm) || norm.startsWith(n)) return k;
      }
      return null;
    }

    let key = resolve(clean);
    if (key) return key;
    // "Knowledge (Education)" -> "Education"
    const m = clean.match(/Knowledge\s*\(([^)]+)\)/i);
    if (m) { key = resolve(m[1]); if (key) return key; }
    // generic leading "Knowledge" prefix
    const norm = normSkillName(clean);
    if (norm.startsWith('knowledge') && norm.length > 9) {
      key = resolve(norm.slice(9));
      if (key) return key;
    }
    return null;
  }

  function getSpecies(key)  { return SW.species.find(s => s.key === key); }
  function getCareer(key)   { return SW.careers.find(c => c.key === key); }
  function getSpec(key)     { return SW.specializations.find(s => s.key === key); }
  function getSkill(key)    { return SW.skills.find(s => s.key === key); }
  function getTalent(name)  { return SW.talents.find(t => t.name.toLowerCase() === name.toLowerCase()); }

  // Equipment lookups (lazy key maps for speed across ~1,100 items)
  let _eqMaps = null;
  function eqMaps() {
    if (!_eqMaps) {
      const idx = list => { const m = {}; for (const it of (list || [])) m[it.key] = it; return m; };
      _eqMaps = { weapon: idx(SW.weapons), armor: idx(SW.armor), gear: idx(SW.gear) };
    }
    return _eqMaps;
  }
  function getWeapon(key) { return eqMaps().weapon[key] || null; }
  function getArmor(key)  { return eqMaps().armor[key]  || null; }
  function getGear(key)   { return eqMaps().gear[key]   || null; }
  function getItem(cat, key) {
    return cat === 'weapon' ? getWeapon(key) : cat === 'armor' ? getArmor(key) : getGear(key);
  }

  // Additional starting credits granted by extra Obligation / Duty (core rulebooks)
  function creditBonusFor(extra) {
    if (extra >= 10) return 2500;
    if (extra >= 5)  return 1000;
    return 0;
  }
  const BASE_STARTING_CREDITS = 500;

  // Get spec bonus skill keys (converting display names to keys)
  function specBonusSkillKeys(spec) {
    if (!spec) return [];
    return (spec.bonus_career_skills || [])
      .map(name => nameToKey(name))
      .filter(Boolean);
  }

  // Compute all derived values for a character state
  function derive(state) {
    const species = getSpecies(state.speciesKey);
    if (!species) return null;

    const chars  = state.characteristics || {};
    const career = getCareer(state.careerKey);
    const spec   = getSpec(state.specKey);

    const wtStat = (species.wound_threshold_stat  || 'Brawn').toLowerCase();
    const stStat = (species.strain_threshold_stat || 'Willpower').toLowerCase();

    let omsXpBonus = 0;
    if (state.game === 'eote') {
      const obl = state.obligation || {};
      if (obl.bonusType === 'xp') omsXpBonus = (obl.magnitude || 10) - 10;
    } else if (state.game === 'aor') {
      const duty = state.duty || {};
      if (duty.bonusType === 'xp') omsXpBonus = duty.deficit || 0;
    } else if (state.game === 'fad') {
      const score = (state.morality || {}).score || 50;
      if (score <= 30) omsXpBonus = 10;
      else if (score >= 70) omsXpBonus = -10;
    }
    const startingXp = (species.starting_xp || 100) + omsXpBonus;

    let talentXp = 0;
    const tp = (state.talentPurchases || {})[state.specKey];
    if (tp) tp.forEach((p, i) => { if (p) talentXp += (Math.floor(i / 4) + 1) * 5; });

    const xpSpent     = totalCharXp(species, chars) + talentXp;
    const xpRemaining = startingXp - xpSpent;

    // ── Starting credits + equipment spend ───────────────────────────────
    let omsCreditBonus = 0;
    if (state.game === 'eote') {
      const obl = state.obligation || {};
      if (obl.bonusType === 'credits') omsCreditBonus = creditBonusFor((obl.magnitude || 10) - 10);
    } else if (state.game === 'aor') {
      const duty = state.duty || {};
      if (duty.bonusType === 'credits') omsCreditBonus = creditBonusFor(duty.deficit || 0);
    }
    const startingCredits = BASE_STARTING_CREDITS + omsCreditBonus;

    const eq = state.equipment || {};
    let creditsSpent = 0, encumbrance = 0, wornArmor = null;
    for (const cat of ['weapon', 'armor', 'gear']) {
      const bag = eq[cat] || {};
      for (const key of Object.keys(bag)) {
        const line = bag[key];
        if (!line || !line.qty) continue;
        const item = getItem(cat, key);
        if (!item) continue;
        const price = typeof item.price === 'number' ? item.price : 0;
        const enc   = typeof item.encumbrance === 'number' ? item.encumbrance : 0;
        if (!line.free) creditsSpent += price * line.qty;
        if (line.carry !== false) encumbrance += enc * line.qty;   // carried items count toward encumbrance
        // Only equipped armor contributes Soak / Defense; tie goes to highest Soak
        if (cat === 'armor' && line.equip && (!wornArmor || (item.soak || 0) > (wornArmor.soak || 0))) wornArmor = item;
      }
    }
    const creditsRemaining = startingCredits - creditsSpent;
    const armorSoak    = wornArmor ? (wornArmor.soak    || 0) : 0;
    const armorDefense = wornArmor ? (wornArmor.defense || 0) : 0;

    const careerSkillKeys = career ? (career.career_skill_keys || []) : [];
    const bonusSkillKeys  = specBonusSkillKeys(spec);     // all 4 are career skills (cheaper to raise)
    const freePickKeys    = state.freeCareerSkillPicks || [];
    const bonusPickKeys   = state.specBonusSkillPicks  || [];  // the 2 chosen for a free rank

    // Compute skill ranks: one free rank per chosen career pick and per chosen
    // specialization pick; a skill chosen in both lists starts at Rank 2.
    const skillRanks = {};
    for (const key of freePickKeys) {
      skillRanks[key] = (skillRanks[key] || 0) + 1;
    }
    for (const key of bonusPickKeys) {
      skillRanks[key] = Math.min(2, (skillRanks[key] || 0) + 1);
    }

    return {
      wound_threshold:  (species.wound_threshold  || 10) + (chars[wtStat]  || 2),
      strain_threshold: (species.strain_threshold || 10) + (chars[stStat] || 2),
      soak:             (chars.brawn || 1) + armorSoak,
      defense_ranged:   armorDefense,
      defense_melee:    armorDefense,
      starting_xp:      startingXp,
      xp_spent:         xpSpent,
      xp_remaining:     xpRemaining,
      starting_credits:  startingCredits,
      credits_spent:     creditsSpent,
      credits_remaining: creditsRemaining,
      encumbrance:           encumbrance,
      encumbrance_threshold: (chars.brawn || 0) + 5,
      worn_armor:        wornArmor ? wornArmor.key : null,
      career_skill_keys: careerSkillKeys,
      bonus_skill_keys:  bonusSkillKeys,
      skill_ranks:       skillRanks,
    };
  }

  return {
    CHAR_STATS, CHAR_ABBR,
    xpToRaise, totalCharXp,
    nameToKey, skillNameMap,
    getSpecies, getCareer, getSpec, getSkill, getTalent,
    getWeapon, getArmor, getGear, getItem,
    creditBonusFor,
    specBonusSkillKeys,
    derive,
  };
})();
