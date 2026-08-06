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

  // ── Specializations owned ────────────────────────────────────────────────
  // A character starts with one specialization (state.specKey, the only one that
  // ever grants free skill ranks) and may buy more (state.extraSpecKeys, in
  // purchase order). Everything talent-related reads the whole list.
  function ownedSpecKeys(state) {
    const out = [];
    for (const k of [state && state.specKey].concat((state && state.extraSpecKeys) || [])) {
      if (k && getSpec(k) && !out.includes(k)) out.push(k);
    }
    return out;
  }

  // Where a specialization sits relative to the character's career, which is
  // what its price depends on (EotE Core p.93, p.275):
  //   career    - one of your own career's specializations
  //   universal - belongs to no career (Force Sensitive Exile and the era-book
  //               specializations); priced like a career spec, no surcharge
  //   other     - another career's specialization; costs 10 XP extra
  function specStatus(state, specKey) {
    const spec = getSpec(specKey);
    if (!spec) return 'other';
    const careers = spec.careers || [];
    if (!careers.length) return 'universal';
    const career = getCareer(state && state.careerKey);
    return career && careers.includes(career.name) ? 'career' : 'other';
  }

  // Cost of the extra specialization at position i (0-based) in extraSpecKeys:
  // ten times the number of specializations owned once it is bought (the free
  // starting one counts), plus a flat 10 if it belongs to another career. The
  // surcharge is added after the multiply, never folded into the count, so a
  // universal specialization prices as 10 x N with nothing added.
  function specCost(state, specKey, i) {
    return 10 * (i + 2) + (specStatus(state, specKey) === 'other' ? 10 : 0);
  }
  // What buying one more specialization would cost right now.
  function nextSpecCost(state, specKey) {
    return specCost(state, specKey, ((state && state.extraSpecKeys) || []).length);
  }
  function specXpSpent(state) {
    const extras = (state && state.extraSpecKeys) || [];
    let xp = 0;
    for (let i = 0; i < extras.length; i++) if (getSpec(extras[i])) xp += specCost(state, extras[i], i);
    return xp;
  }

  // The 20 talent names of a tree, row-major (4 columns x 5 rows).
  function treeTalentNames(spec) {
    const names = [];
    if (spec && spec.talent_tree) for (const row of spec.talent_tree) for (const n of (row.talents || [])) names.push(n);
    return names;
  }
  function isRankedTalent(name) {
    const t = getTalent(name);
    return t ? !!t.ranked : false;
  }

  // An unranked talent you already own from another tree is acquired on this
  // tree automatically, for free, and still links further purchases below it
  // (EotE Core p.128). Ranked talents must be bought box by box.
  function talentAutoOwned(state, specKey, name) {
    if (!name || isRankedTalent(name)) return false;
    for (const k of ownedSpecKeys(state)) {
      if (k === specKey) continue;
      const bought = (state.talentPurchases || {})[k];
      if (!bought) continue;
      const names = treeTalentNames(getSpec(k));
      for (let i = 0; i < names.length; i++) if (bought[i] && names[i] === name) return true;
    }
    return false;
  }

  // XP sunk into talents across every owned tree. Row costs are 5/10/15/20/25
  // and apply independently in each tree; auto-acquired duplicates are never
  // flagged as purchased, so they cost nothing here.
  function talentXpSpent(state) {
    let xp = 0;
    for (const k of ownedSpecKeys(state)) {
      const bought = (state.talentPurchases || {})[k];
      if (!bought) continue;
      for (let i = 0; i < bought.length; i++) if (bought[i]) xp += (Math.floor(i / 4) + 1) * 5;
    }
    return xp;
  }

  // Every purchased Dedication box across the owned trees, in a stable order.
  // Each carries the characteristic the player picked for it, keyed by tree and
  // position so choices survive buying or dropping other specializations.
  function dedicationNodes(state) {
    const out = [];
    for (const k of ownedSpecKeys(state)) {
      const bought = (state.talentPurchases || {})[k];
      if (!bought) continue;
      const names = treeTalentNames(getSpec(k));
      for (let i = 0; i < names.length; i++) {
        if (bought[i] && names[i] === 'Dedication') out.push({ specKey: k, index: i, id: k + ':' + i });
      }
    }
    return out;
  }

  // Count purchased talent ranks across every owned specialization tree.
  // Ranked talents stack tree to tree; an unranked talent is one rank however
  // many trees carry it (EotE Core p.128).
  function purchasedTalentCounts(state) {
    const counts = {};
    for (const k of ownedSpecKeys(state)) {
      const bought = (state.talentPurchases || {})[k];
      if (!bought) continue;
      const names = treeTalentNames(getSpec(k));
      for (let i = 0; i < names.length; i++) {
        const n = names[i];
        if (!bought[i] || !n) continue;
        counts[n] = isRankedTalent(n) ? (counts[n] || 0) + 1 : 1;
      }
    }
    // Unranked talents inherited free from another tree still count as owned.
    for (const k of ownedSpecKeys(state)) {
      for (const n of treeTalentNames(getSpec(k))) {
        if (n && !counts[n] && talentAutoOwned(state, k, n)) counts[n] = 1;
      }
    }
    return counts;
  }

  // Universal Force specializations hand out a Force rating of 1 on purchase if
  // the character has none yet (EotE Core p.276 and its AoR/FaD counterparts).
  const FORCE_RATING_SPECS = new Set(['force_sensitive_exile', 'force_sensitive_emergent', 'force_sensitive_outcast']);

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

  // ── Play-layer merge ─────────────────────────────────────────────────
  // Creation purchases live in state.equipment and are priced against the
  // starting credits. Play-mode commerce lives in state.playEquipment as
  // deltas (qty may be negative: net sold out of the creation stock) and
  // settles into creditsAdjustment at transaction time. The merged view is
  // what the character actually owns right now.
  const COMPANION_TYPES = new Set(['Droids', 'Riding Beasts', 'Trainable Beasts']);
  function isCompanionItem(cat, item) {
    return cat === 'gear' && !!item && COMPANION_TYPES.has(item.type);
  }

  // Merge one item line across the two layers. Elections supersede PER
  // PROPERTY: a play-line flag wins only where the play line actually has
  // one, so buying more of an item during play never resets the flags the
  // player chose at creation.
  function mergedLine(state, cat, key) {
    const cLine = ((state.equipment     || {})[cat] || {})[key];
    const pLine = ((state.playEquipment || {})[cat] || {})[key];
    if (!cLine && !pLine) return null;
    const qty = Math.max(0, ((cLine && cLine.qty) || 0) + ((pLine && pLine.qty) || 0));
    const pick = (prop, dflt) => {
      if (pLine && prop in pLine) return pLine[prop];
      if (cLine && prop in cLine) return cLine[prop];
      return dflt;
    };
    return {
      qty,
      free:     !!(cLine && cLine.free),
      carry:    pick('carry', true),
      show:     pick('show', true),
      equip:    pick('equip', false),
      nickname: pick('nickname', ''),
    };
  }

  // The full owned inventory: union of both layers, lines with qty > 0 only.
  function mergedEquipment(state) {
    const out = { weapon: {}, armor: {}, gear: {} };
    for (const cat of ['weapon', 'armor', 'gear']) {
      const keys = new Set([
        ...Object.keys((state.equipment     || {})[cat] || {}),
        ...Object.keys((state.playEquipment || {})[cat] || {}),
      ]);
      for (const key of keys) {
        const line = mergedLine(state, cat, key);
        if (line && line.qty > 0) out[cat][key] = line;
      }
    }
    return out;
  }

  // The owned fleet: creation ships not sold during play, then play-bought
  // ships. Play ships are always owned outright (paid at purchase time).
  function mergedFleet(state) {
    const out = [];
    for (const e of (state.vehicles || [])) {
      if (!e.soldInPlay) out.push(Object.assign({ source: 'creation' }, e));
    }
    for (const e of (state.playVehicles || [])) {
      out.push(Object.assign({ source: 'play', purchased: true }, e));
    }
    return out;
  }

  // Additional starting credits granted by extra Obligation / Duty (core rulebooks)
  function creditBonusFor(extra) {
    if (extra >= 10) return 2500;
    if (extra >= 5)  return 1000;
    return 0;
  }
  const BASE_STARTING_CREDITS = 500;

  // The campaign mechanic a character actually uses. Defaults to the game line's
  // native mechanic, but a character may override it (e.g. a Force and Destiny PC
  // running on Obligation so a mixed-line party can share one mechanic).
  const NATIVE_MECHANIC = { eote: 'obligation', aor: 'duty', fad: 'morality' };
  function activeMechanic(state) {
    return (state && state.mechanic) || NATIVE_MECHANIC[state && state.game] || 'obligation';
  }

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

    const mech = activeMechanic(state);
    let omsXpBonus = 0;
    if (mech === 'obligation') {
      const obl = state.obligation || {};
      if (obl.bonusType === 'xp') omsXpBonus = (obl.magnitude || 10) - 10;
    } else if (mech === 'duty') {
      const duty = state.duty || {};
      if (duty.bonusType === 'xp') omsXpBonus = duty.deficit || 0;
    } else if (mech === 'morality') {
      const score = (state.morality || {}).score || 50;
      if (score <= 30) omsXpBonus = 10;
      else if (score >= 70) omsXpBonus = -10;
    }
    const startingXp = (species.starting_xp || 100) + omsXpBonus;

    // Talents across every owned tree, plus what the extra specializations
    // themselves cost to unlock.
    const talentXp = talentXpSpent(state);
    const specXp   = specXpSpent(state);

    const xpSpent     = totalCharXp(species, chars) + talentXp + specXp;
    // Play mode's "Add XP" control banks session awards here, on top of the
    // starting allotment; it is real spendable XP, not just a display figure.
    const xpRemaining = startingXp - xpSpent + (state.xpAdjustment || 0);

    // ── Starting credits + equipment spend ───────────────────────────────
    let omsCreditBonus = 0;
    if (mech === 'obligation') {
      const obl = state.obligation || {};
      if (obl.bonusType === 'credits') omsCreditBonus = creditBonusFor((obl.magnitude || 10) - 10);
    } else if (mech === 'duty') {
      const duty = state.duty || {};
      if (duty.bonusType === 'credits') omsCreditBonus = creditBonusFor(duty.deficit || 0);
    }
    const startingCredits = BASE_STARTING_CREDITS + omsCreditBonus;

    // Pricing walks the CREATION layer only: play-mode commerce settles into
    // creditsAdjustment at transaction time (buys at full price, sells at
    // half), so play quantity deltas must never be re-priced here.
    const eq = state.equipment || {};
    let creditsSpent = 0;
    for (const cat of ['weapon', 'armor', 'gear']) {
      const bag = eq[cat] || {};
      for (const key of Object.keys(bag)) {
        const line = bag[key];
        if (!line || !line.qty) continue;
        const item = getItem(cat, key);
        if (!item) continue;
        const price = typeof item.price === 'number' ? item.price : 0;
        if (!line.free) creditsSpent += price * line.qty;
      }
    }
    // Stats walk the MERGED inventory: what the character owns and carries
    // right now, including play-mode acquisitions and sales.
    const owned = mergedEquipment(state);
    let encumbrance = 0, wornArmor = null, wornArmorLine = null;
    let wpnDefMelee = 0, wpnDefRanged = 0, encThresholdBonus = 0, cyberSoak = 0;
    const cyberChar = {};   // characteristic -> flat bonus from installed cybernetics
    for (const cat of ['weapon', 'armor', 'gear']) {
      const bag = owned[cat];
      for (const key of Object.keys(bag)) {
        const line = bag[key];
        const item = getItem(cat, key);
        if (!item) continue;
        const enc = typeof item.encumbrance === 'number' ? item.encumbrance : 0;
        if (line.carry !== false) {
          encumbrance += enc * line.qty;
          // Worn carrying gear (utility belt, wizard pouch) raises the encumbrance threshold.
          if (cat === 'gear' && typeof item.encThreshold === 'number') encThresholdBonus += item.encThreshold * line.qty;
        }
        // Installed cybernetics grant always-on flat bonuses (EotE Core p.172-174): a soak
        // bonus and/or a characteristic bonus. Applied once per implant (bonuses never stack
        // from owning multiples), and cyberlegs only count when a full pair is installed.
        if (cat === 'gear') {
          if (typeof item.soakMod === 'number') cyberSoak += item.soakMod;
          if (item.charMod && (item.charModPair ? line.qty >= 2 : line.qty >= 1)) {
            for (const ck of Object.keys(item.charMod)) cyberChar[ck] = (cyberChar[ck] || 0) + item.charMod[ck];
          }
        }
        // A wielded weapon grants defense via its Defensive (melee) / Deflection (ranged)
        // qualities (EotE Core p.156). You benefit from the best of each, not the sum.
        if (cat === 'weapon' && line.equip) {
          for (const q of (item.qualities || [])) {
            if (q.key === 'DEFENSIVE')  wpnDefMelee  = Math.max(wpnDefMelee,  q.count || 1);
            if (q.key === 'DEFLECTION') wpnDefRanged = Math.max(wpnDefRanged, q.count || 1);
          }
        }
        if (cat === 'armor' && line.equip && (!wornArmor || (item.soak || 0) > (wornArmor.soak || 0))) { wornArmor = item; wornArmorLine = line; }
      }
    }
    // A worn suit of armor has its encumbrance reduced by 3, min 0 (EotE Core p.165).
    // The loop counted the worn suit in full above, so back out the reduction once.
    if (wornArmor && wornArmorLine && wornArmorLine.carry !== false) {
      const wornEnc = typeof wornArmor.encumbrance === 'number' ? wornArmor.encumbrance : 0;
      encumbrance -= Math.min(3, wornEnc);
    }
    for (const entry of (state.vehicles || [])) {
      if (!entry.purchased) continue;
      const vd = getVehicle(entry.key);
      if (vd && typeof vd.price === 'number') creditsSpent += vd.price;
    }
    // Play mode's deposit/withdraw control adjusts this on top of the starting
    // allotment, so looted or spent credits actually change what you can afford.
    const creditsRemaining = startingCredits - creditsSpent + (state.creditsAdjustment || 0);
    const armorSoak    = wornArmor ? (wornArmor.soak    || 0) : 0;
    const armorDefense = wornArmor ? (wornArmor.defense || 0) : 0;

    const careerSkillKeys = career ? (career.career_skill_keys || []) : [];
    // Every owned specialization marks its skills as career skills, but only the
    // starting one ever grants the two free ranks (EotE Core p.93, p.35).
    const bonusSkillKeys  = [];
    for (const k of ownedSpecKeys(state)) {
      for (const sk of specBonusSkillKeys(getSpec(k))) if (!bonusSkillKeys.includes(sk)) bonusSkillKeys.push(sk);
    }
    const primaryBonusSkillKeys = specBonusSkillKeys(spec);
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
    // Each purchased Dedication box carries its own characteristic pick, keyed
    // by tree and position. Any surplus rank (a species grant, in principle)
    // falls back to a positional id so it still gets a pick.
    const dedNodes  = dedicationNodes(state);
    const dedIds    = dedNodes.map(n => n.id);
    for (let i = dedIds.length; i < dedTotal; i++) dedIds.push('species:' + i);
    const dedMap    = state.dedicationChoices || {};
    const charBonuses = {};    // characteristic -> total flat bonus (for the sheet to flag)
    const charBonusSrc = {};   // characteristic -> label of the bonus source(s)
    for (const id of dedIds) {
      const ck = dedMap[id];
      if (ck) { effChars[ck] = Math.min(6, (effChars[ck] || 0) + 1); charBonuses[ck] = (charBonuses[ck] || 0) + 1; charBonusSrc[ck] = 'Dedication'; }
    }
    // Cybernetic characteristic enhancements apply after Dedication and may raise a
    // characteristic to a maximum of 7 (one above the normal cap; EotE Core p.172).
    for (const ck of Object.keys(cyberChar)) {
      const before = effChars[ck] || 0;
      effChars[ck] = Math.min(7, before + cyberChar[ck]);
      const applied = effChars[ck] - before;
      if (applied > 0) {
        charBonuses[ck] = (charBonuses[ck] || 0) + applied;
        charBonusSrc[ck] = charBonusSrc[ck] ? charBonusSrc[ck] + ' + Cybernetics' : 'Cybernetics';
      }
    }

    const woundBonus  = rk('Toughened') * 2;
    const strainBonus = rk('Grit');
    const soakBonus   = rk('Enduring');
    const defMBonus   = rk('Superior Reflexes');
    const defRBonus   = rk('Sixth Sense');
    let forceRating = rk('Force Rating') + rk('Witchcraft');
    // Buying a Force-sensitive universal specialization confers a Force rating
    // of 1 outright; it does not stack on top of a rating already held.
    if (forceRating < 1 && ownedSpecKeys(state).some(k => FORCE_RATING_SPECS.has(k))) forceRating = 1;

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
      soak:             (effChars.brawn || 1) + armorSoak + soakBonus + cyberSoak,
      defense_ranged:   armorDefense + defRBonus + wpnDefRanged,
      defense_melee:    armorDefense + defMBonus + wpnDefMelee,
      force_rating:     forceRating,
      armor_soak:       armorSoak,
      cyber_soak:       cyberSoak,
      armor_defense:    armorDefense,
      defense_weapon_melee:  wpnDefMelee,
      defense_weapon_ranged: wpnDefRanged,
      soak_brawn:       (effChars.brawn || 1),
      starting_xp:      startingXp,
      xp_spent:         xpSpent,
      xp_remaining:     xpRemaining,
      talent_xp:        talentXp,
      spec_xp:          specXp,
      spec_keys:        ownedSpecKeys(state),
      dedication_ids:   dedIds,
      starting_credits:  startingCredits,
      credits_spent:     creditsSpent,
      credits_remaining: creditsRemaining,
      encumbrance:           encumbrance,
      encumbrance_threshold: (effChars.brawn || 0) + 5 + encThresholdBonus,
      enc_threshold_bonus:   encThresholdBonus,
      worn_armor:        wornArmor ? wornArmor.key : null,
      career_skill_keys: careerSkillKeys,
      bonus_skill_keys:  bonusSkillKeys,
      primary_bonus_skill_keys: primaryBonusSkillKeys,
      skill_ranks:       skillRanks,
      skill_setback_removed: skillSetbackRemoved,
      characteristics:   effChars,
      talents:           talentList,
      talent_stat_bonuses: { wound: woundBonus, strain: strainBonus, soak: soakBonus,
                             defenseRanged: defRBonus, defenseMelee: defMBonus, forceRating: forceRating },
      characteristic_bonuses: charBonuses,
      characteristic_bonus_src: charBonusSrc,
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
    COMPANION_TYPES, isCompanionItem,
    mergedLine, mergedEquipment, mergedFleet,
    talentEffect, purchasedTalentCounts,
    creditBonusFor, activeMechanic,
    specBonusSkillKeys,
    ownedSpecKeys, specStatus, specCost, nextSpecCost, specXpSpent,
    treeTalentNames, isRankedTalent, talentAutoOwned, talentXpSpent, dedicationNodes,
    derive,
  };
})();
