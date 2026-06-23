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

  // Resolve a skill display name (from wiki) to a skill key
  function nameToKey(displayName) {
    const norm = normSkillName(displayName);
    const map = skillNameMap();
    if (map[norm]) return map[norm];
    // Partial match fallback
    for (const [n, k] of Object.entries(map)) {
      if (n.startsWith(norm) || norm.startsWith(n)) return k;
    }
    return null;
  }

  function getSpecies(key)  { return SW.species.find(s => s.key === key); }
  function getCareer(key)   { return SW.careers.find(c => c.key === key); }
  function getSpec(key)     { return SW.specializations.find(s => s.key === key); }
  function getSkill(key)    { return SW.skills.find(s => s.key === key); }
  function getTalent(name)  { return SW.talents.find(t => t.name.toLowerCase() === name.toLowerCase()); }

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

    const startingXp = species.starting_xp || 100;
    const xpSpent    = totalCharXp(species, chars);
    const xpRemaining = startingXp - xpSpent;

    const careerSkillKeys = career ? (career.career_skill_keys || []) : [];
    const bonusSkillKeys  = specBonusSkillKeys(spec);
    const freePickKeys    = state.freeCareerSkillPicks || [];

    // Compute skill ranks
    const skillRanks = {};
    for (const key of freePickKeys) {
      skillRanks[key] = (skillRanks[key] || 0) + 1;
    }
    for (const key of bonusSkillKeys) {
      skillRanks[key] = Math.min(2, (skillRanks[key] || 0) + 1);
    }

    return {
      wound_threshold:  (species.wound_threshold  || 10) + (chars[wtStat]  || 2),
      strain_threshold: (species.strain_threshold || 10) + (chars[stStat] || 2),
      soak:             chars.brawn || 1,
      defense_ranged:   0,
      defense_melee:    0,
      starting_xp:      startingXp,
      xp_spent:         xpSpent,
      xp_remaining:     xpRemaining,
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
    specBonusSkillKeys,
    derive,
  };
})();
