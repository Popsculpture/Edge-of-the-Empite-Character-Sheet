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

  // Talents that flatly, always-on modify a printed character-sheet stat per rank.
  // Verified against EotE/AoR/FaD rules; conditional/active talents are deliberately
  // excluded (they are resolved at the table, not baked into the sheet).
  const TALENT_EFFECTS = {
    'Toughened':         { stat: 'wound',         delta: 2 },
    'Grit':              { stat: 'strain',        delta: 1 },
    'Enduring':          { stat: 'soak',          delta: 1 },
    'Superior Reflexes': { stat: 'defenseMelee',  delta: 1 },
    'Sixth Sense':       { stat: 'defenseRanged', delta: 1 },
    'Force Rating':      { stat: 'forceRating',   delta: 1 },
    'Witchcraft':        { stat: 'forceRating',   delta: 1 },
    'Dedication':        { stat: 'characteristic', delta: 1, needsChoice: true },
  };
  function talentEffect(name) { return TALENT_EFFECTS[name] || null; }

  // Talents that remove setback dice from EVERY check of a named skill, per rank
  // (verified whole-skill removers; conditional-subset removers are excluded so
  // they do not paint a blanket glyph). 'ALL_KNOWLEDGE' = every Knowledge skill.
  const SETBACK_SKILL_TALENTS = {
    'Commanding Presence':   ['Leadership', 'Cool'],
    'Conditioned':           ['Athletics', 'Coordination'],
    'Convincing Demeanor':   ['Deception', 'Skulduggery'],
    'Galaxy Mapper':         ['Astrogation'],
    'Gearhead':              ['Mechanics'],
    'Iron Body':             ['Coordination', 'Resilience'],
    'Keen Eyed':             ['Perception', 'Vigilance'],
    'Kill With Kindness':    ['Charm', 'Leadership'],
    'Leverage':              ['Cool', 'Negotiation'],
    'Plausible Deniability': ['Coercion', 'Deception'],
    'Researcher':            ['ALL_KNOWLEDGE'],
    'Savvy Negotiator':      ['Negotiation', 'Streetwise'],
    'Secret Lore':           ['Lore'],
    'Skilled Jockey':        ['Piloting - Planetary', 'Piloting - Space'],
    'Steady Nerves':         ['Cool', 'Skulduggery'],
    'Street Smarts':         ['Streetwise', 'Underworld'],
  };

  // Count purchased ranks per talent name in the current specialization tree.
  // Scoped to state.specKey to match how talent XP is counted (single active spec).
  function purchasedTalentCounts(state) {
    const counts = {};
    const spec   = getSpec(state.specKey);
    const bought = (state.talentPurchases || {})[state.specKey];
    if (!spec || !spec.talent_tree || !bought) return counts;
    const names = [];
    for (const row of spec.talent_tree) for (const n of (row.talents || [])) names.push(n);
    for (let i = 0; i < names.length; i++) {
      if (bought[i] && names[i]) counts[names[i]] = (counts[names[i]] || 0) + 1;
    }
    return counts;
  }

  // Talent ranks a species grants for free, parsed from its special-abilities text
  // (e.g. "one rank in the Convincing Demeanor talent"). Names are canonicalized
  // to match talents.js. These are free (no XP) but still apply their effects.
  const NUM_WORDS = { one: 1, two: 2, three: 3, four: 4, five: 5, six: 6 };
  function speciesTalentGrants(species) {
    const out = {};
    if (!species) return out;
    const re = /(\w+)\s+ranks?\s+(?:of|in)\s+(?:the\s+)?(.+?)\s+talent\b/i;
    for (const ab of (species.special_abilities || [])) {
      for (const sentence of String(ab).split('.')) {
        const m = sentence.match(re);
        if (!m) continue;
        const n = NUM_WORDS[m[1].toLowerCase()] || parseInt(m[1], 10) || 1;
        const t = getTalent(m[2].trim());
        const name = t ? t.name : m[2].trim();
        out[name] = (out[name] || 0) + n;
      }
    }
    return out;
  }

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

  // Vehicle lookups (lazy key maps)
  let _vehMaps = null;
  function vehMaps() {
    if (!_vehMaps) {
      const idx = list => { const m = {}; for (const it of (list || [])) m[it.key] = it; return m; };
      _vehMaps = { vehicle: idx(SW.vehicles), vehWeapon: idx(SW.vehicleWeapons) };
    }
    return _vehMaps;
  }
  function getVehicle(key)        { return vehMaps().vehicle[key]    || null; }
  function getVehicleWeapon(key)  { return vehMaps().vehWeapon[key]  || null; }
  function getVehicleWeaponMap()  { return vehMaps().vehWeapon; }

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
        if (line.carry !== false) encumbrance += enc * line.qty;
        if (cat === 'armor' && line.equip && (!wornArmor || (item.soak || 0) > (wornArmor.soak || 0))) wornArmor = item;
      }
    }
    for (const entry of (state.vehicles || [])) {
      if (!entry.purchased) continue;
      const vd = getVehicle(entry.key);
      if (vd && typeof vd.price === 'number') creditsSpent += vd.price;
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

    // ── Talent stat bonuses (always-on passive talents) ───────────────────
    // Character's talents = specialization-tree purchases + species-granted ranks.
    const treeCounts  = purchasedTalentCounts(state);
    const grantCounts = speciesTalentGrants(species);
    const talentCounts = {};
    for (const [n, r] of Object.entries(treeCounts))  talentCounts[n] = (talentCounts[n] || 0) + r;
    for (const [n, r] of Object.entries(grantCounts)) talentCounts[n] = (talentCounts[n] || 0) + r;
    const rk = name => talentCounts[name] || 0;

    // Dedication: +1 to a chosen characteristic per rank (capped at 6). Applied
    // to an effective copy so it flows into thresholds, soak, and skill dice.
    const effChars = Object.assign({}, chars);
    const dedTotal  = rk('Dedication');
    const dedChoices = (state.dedicationChoices || []).slice(0, dedTotal);
    const charBonuses = {};   // characteristic -> Dedication bonus (for the sheet to flag)
    for (const ck of dedChoices) {
      if (ck) { effChars[ck] = Math.min(6, (effChars[ck] || 0) + 1); charBonuses[ck] = (charBonuses[ck] || 0) + 1; }
    }

    const woundBonus  = rk('Toughened') * 2;
    const strainBonus = rk('Grit');
    const soakBonus   = rk('Enduring');
    const defMBonus   = rk('Superior Reflexes');
    const defRBonus   = rk('Sixth Sense');
    const forceRating = rk('Force Rating') + rk('Witchcraft');

    // Per-skill setback dice removed by always-on whole-skill talents. Resolved
    // to skill keys so the sheet can draw a "removed setback" glyph on each row.
    const skillSetbackRemoved = {};
    const knowledgeKeys = (SW.skills || []).filter(s => (s.type || '') === 'Knowledge').map(s => s.key);
    for (const [tname, skillNames] of Object.entries(SETBACK_SKILL_TALENTS)) {
      const amount = rk(tname);   // perRank is 1 for every confirmed talent
      if (!amount) continue;
      for (const sn of skillNames) {
        const keys = sn === 'ALL_KNOWLEDGE' ? knowledgeKeys : [nameToKey(sn)].filter(Boolean);
        for (const k of keys) skillSetbackRemoved[k] = (skillSetbackRemoved[k] || 0) + amount;
      }
    }

    // Talent list for the sheet (name, rank, source, activation, effect, setback).
    const talentList = Object.keys(talentCounts).sort().map(name => {
      const t    = getTalent(name);
      const eff  = TALENT_EFFECTS[name];
      const rank = talentCounts[name];
      const fromTree    = !!treeCounts[name];
      const fromSpecies = !!grantCounts[name];
      const setbackSkills = SETBACK_SKILL_TALENTS[name] || null;
      return {
        name, rank,
        ranked:      t ? !!t.ranked : false,
        activation:  t ? (t.activation  || '') : '',
        description: t ? (t.description || '') : '',
        source:      fromTree && fromSpecies ? 'both' : fromSpecies ? 'species' : 'tree',
        effect: eff ? { stat: eff.stat, delta: eff.delta, total: eff.delta * rank, needsChoice: !!eff.needsChoice } : null,
        setback: setbackSkills ? { skills: setbackSkills, perRank: 1, total: rank } : null,
      };
    });

    return {
      wound_threshold:  (species.wound_threshold  || 10) + (effChars[wtStat]  || 2) + woundBonus,
      strain_threshold: (species.strain_threshold || 10) + (effChars[stStat] || 2) + strainBonus,
      soak:             (effChars.brawn || 1) + armorSoak + soakBonus,
      defense_ranged:   armorDefense + defRBonus,
      defense_melee:    armorDefense + defMBonus,
      force_rating:     forceRating,
      armor_soak:       armorSoak,
      soak_brawn:       (effChars.brawn || 1),
      starting_xp:      startingXp,
      xp_spent:         xpSpent,
      xp_remaining:     xpRemaining,
      starting_credits:  startingCredits,
      credits_spent:     creditsSpent,
      credits_remaining: creditsRemaining,
      encumbrance:           encumbrance,
      encumbrance_threshold: (effChars.brawn || 0) + 5,
      worn_armor:        wornArmor ? wornArmor.key : null,
      career_skill_keys: careerSkillKeys,
      bonus_skill_keys:  bonusSkillKeys,
      skill_ranks:       skillRanks,
      skill_setback_removed: skillSetbackRemoved,
      characteristics:   effChars,
      talents:           talentList,
      talent_stat_bonuses: { wound: woundBonus, strain: strainBonus, soak: soakBonus,
                             defenseRanged: defRBonus, defenseMelee: defMBonus, forceRating: forceRating },
      characteristic_bonuses: charBonuses,
      dedication_total:  dedTotal,
    };
  }

  return {
    CHAR_STATS, CHAR_ABBR,
    xpToRaise, totalCharXp,
    nameToKey, skillNameMap,
    getSpecies, getCareer, getSpec, getSkill, getTalent,
    getWeapon, getArmor, getGear, getItem,
    getVehicle, getVehicleWeapon, getVehicleWeaponMap,
    talentEffect, purchasedTalentCounts,
    creditBonusFor,
    specBonusSkillKeys,
    derive,
  };
})();
