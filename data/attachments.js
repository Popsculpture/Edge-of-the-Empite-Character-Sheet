// Weapon and armor attachments from the Edge of the Empire Core Rulebook
// (Chapter V, p. 187 to 195). All 30 printed entries, nothing homebrew.
//
// Attachments slot into an item's hard points. Installing one takes no check
// at all, just the purchase and a few minutes, and it grants its base
// modifiers straight away. The optional mods are the part that rolls dice:
// 100 credits and a Hard Mechanics check, with each further mod in that same
// attachment raising the difficulty by one and costing another 100. A failed
// mod can never be attempted again, and a failure showing despair destroys
// the attachment outright.
//
// apply: the parts of a base modifier the app can compute. Everything else
// lives in text and is resolved at the table.
//   damage / crit / encumbrance : numeric deltas (crit floors at 1)
//   range                       : shift in range bands
//   quality                     : add a quality, or raise it by count
//   qualityAdjust               : change an existing quality's rating
window.SW = window.SW || {};

window.SW.attachments = [

  // ── Weapon attachments ───────────────────────────────────────────────
  { key: 'ATT_SPINBARREL', name: 'Augmented Spin Barrel', cat: 'weapon',
    price: 1750, rarity: 4, hp: 2,
    fits: 'Blaster rifles and heavy blaster rifles',
    base: 'Damage +1. Adds 1 setback die to Mechanics checks maintaining this weapon.',
    apply: { damage: 1 },
    mods: [{ count: 2, text: 'Damage +1' }, { count: 1, text: 'Accurate +1' }, { count: 1, text: 'Pierce +1' }] },

  { key: 'ATT_BALANCEDHILT', name: 'Balanced Hilt', cat: 'weapon',
    price: 1500, rarity: 5, hp: 2,
    fits: 'Any melee weapon',
    base: 'Gains Accurate 1.',
    apply: { quality: ['ACCURATE', 'Accurate', 1] },
    mods: [{ count: 1, text: 'Accurate +1' }, { count: 1, text: 'Reduce encumbrance by 1, to a minimum of 1' }] },

  { key: 'ATT_ACTUATING', name: 'Blaster Actuating Module', cat: 'weapon',
    price: 500, rarity: 4, hp: 1,
    fits: 'Ranged (Light) blaster pistols',
    base: 'Damage +1. Adds 1 setback die to Ranged (Light) checks with this weapon.',
    apply: { damage: 1 },
    mods: [{ count: 2, text: 'Damage +1' }, { count: 2, text: 'Pierce +1' }] },

  { key: 'ATT_BIPOD', name: 'Bipod Mount', cat: 'weapon',
    price: 100, rarity: 1, hp: 1,
    fits: 'Rifles, carbines, and light repeating blasters',
    base: 'Cumbersome -2 while braced, prone, or crouched. Setting up costs one preparation maneuver.',
    mods: [] },

  { key: 'ATT_BOWRECOCK', name: 'Bowcaster Automatic Re-cocker', cat: 'weapon',
    price: 500, rarity: 3, hp: 1, buyable: false,
    fits: 'Wookiee bowcasters only',
    base: 'The bowcaster no longer needs a reloading maneuver.',
    installCheck: { difficulty: 2, skill: 'Mechanics' },
    note: 'Cannot be bought. It must be built by the bowcaster’s owner or its weaponsmith; the price is parts.',
    mods: [{ count: 1, text: 'Auto-fire' }] },

  { key: 'ATT_BOWACCEL', name: 'Bowcaster Accelerator Enhancement', cat: 'weapon',
    price: 250, rarity: 4, hp: 1, buyable: false,
    fits: 'Wookiee bowcasters only',
    base: 'Damage +1.',
    apply: { damage: 1 },
    installCheck: { difficulty: 2, skill: 'Mechanics' },
    note: 'Cannot be bought. It must be built by the bowcaster’s owner or its weaponsmith; the price is parts.',
    mods: [{ count: 2, text: 'Damage +1' }, { count: 2, text: 'Pierce +1' }] },

  { key: 'ATT_FILEDSIGHT', name: 'Filed Front Sight', cat: 'weapon',
    price: 25, rarity: 0, hp: 1,
    fits: 'Pistol-sized weapons',
    base: 'Grants Quick Draw with this weapon. Raises the difficulty of attacks beyond short range by one.',
    installCheck: { difficulty: 2, skill: 'Mechanics' },
    note: 'The price is paying someone else to do it. Filing it yourself needs the check.',
    mods: [{ count: 1, text: 'Reduce the difficulty of checks to conceal the weapon by 1' }] },

  { key: 'ATT_FOREARMGRIP', name: 'Forearm Grip', cat: 'weapon',
    price: 250, rarity: 1, hp: 1,
    fits: 'Rifles and carbines, but not heavy rifles',
    base: 'Firing while engaged adds only 1 difficulty die instead of 2.',
    mods: [{ count: 1, text: 'Point Blank +1' }, { count: 1, text: 'Accurate +1' }] },

  { key: 'ATT_MARKSMANBARREL', name: 'Marksman Barrel', cat: 'weapon',
    price: 1200, rarity: 4, hp: 2,
    fits: 'Blaster rifles',
    base: 'Range +1 band. The weapon gains Cumbersome 2.',
    apply: { range: 1, quality: ['CUMBERSOME', 'Cumbersome', 2] },
    mods: [{ count: 2, text: 'Accurate +1' }, { count: 1, text: 'Sniper Shot' }] },

  { key: 'ATT_MONOEDGE', name: 'Mono-molecular Edge', cat: 'weapon',
    price: 1000, rarity: 5, hp: 1,
    fits: 'Melee weapons with a cutting edge',
    base: 'Critical rating -1, to a minimum of 1.',
    apply: { crit: -1 },
    mods: [{ count: 2, text: 'Pierce +1' }] },

  { key: 'ATT_MULTIOPTIC', name: 'Multi-Optic Sight', cat: 'weapon',
    price: 2000, rarity: 3, hp: 1,
    fits: 'Any ranged weapon',
    base: 'Removes up to 2 setback dice from checks with this weapon caused by smoke, darkness, or anything else obscuring vision.',
    mods: [{ count: 2, text: 'Perception +1' }] },

  { key: 'ATT_SERRATED', name: 'Serrated Edge', cat: 'weapon',
    price: 50, rarity: 1, hp: 1,
    fits: 'Melee weapons with a cutting edge',
    base: 'Gains Vicious 1.',
    apply: { quality: ['VICIOUS', 'Vicious', 1] },
    mods: [] },

  { key: 'ATT_SHORTBARREL', name: 'Shortened Barrel', cat: 'weapon',
    price: 250, rarity: 4, hp: 1,
    fits: 'Ranged (Light) pistols',
    base: 'Concealing the weapon is 1 difficulty easier. Range -1 band, to a minimum of short; if already short, attacks add 1 setback die.',
    apply: { range: -1, rangeFloor: 'Short' },
    mods: [{ count: 1, text: 'Quick Draw' }] },

  { key: 'ATT_SPREADBARREL', name: 'Spread Barrel', cat: 'weapon',
    price: 1725, rarity: 4, hp: 2,
    fits: 'Blaster rifles and blaster carbines',
    base: 'Gains Blast 4. Range -1 band, to a minimum of engaged.',
    apply: { quality: ['BLAST', 'Blast', 4], range: -1 },
    mods: [{ count: 2, text: 'Blast +1' }] },

  { key: 'ATT_SUPWPNCUSTOM', name: 'Superior Weapon Customization', cat: 'weapon',
    price: 5000, rarity: 6, hp: 1,
    fits: 'Any weapon',
    base: 'Gains the Superior quality.',
    apply: { quality: ['SUPERIOR', 'Superior'] },
    mods: [] },

  { key: 'ATT_TELESCOPIC', name: 'Telescopic Optical Sight', cat: 'weapon',
    price: 250, rarity: 1, hp: 1,
    fits: 'Any ranged weapon that would sensibly take a sight',
    base: 'Ranged attacks at long and extreme range are 1 difficulty easier.',
    mods: [] },

  { key: 'ATT_TRIPOD', name: 'Tripod Mount', cat: 'weapon',
    price: 250, rarity: 3, hp: 2,
    fits: 'Light and heavy repeating blasters, and portable Gunnery weapons',
    base: 'Cumbersome -3 once set up, which costs two preparation maneuvers. The weapon cannot move afterward, only pivot.',
    mods: [{ count: 2, text: 'Cumbersome -1' }] },

  { key: 'ATT_UBGRENADE', name: 'Under-Barrel Grenade Launcher', cat: 'weapon',
    price: 2000, rarity: 5, hp: 2, restricted: true,
    fits: 'Rifle-sized Ranged (Heavy) weapons',
    base: 'The weapon can fire grenades, using the grenade’s profile at Medium range with Ranged (Heavy). Gains Cumbersome +1 and encumbrance +2. Grenades are Limited Ammo 1, so the launcher is too.',
    apply: { quality: ['CUMBERSOME', 'Cumbersome', 1], encumbrance: 2,
             quality2: ['LIMITEDAMMO', 'Limited Ammo', 1] },
    mods: [{ count: 5, text: 'Limited Ammo +1' }] },

  { key: 'ATT_UBFLAME', name: 'Under-Barrel Flame Projector', cat: 'weapon',
    price: 3000, rarity: 5, hp: 2, restricted: true,
    fits: 'Rifle-sized weapons',
    base: 'The weapon can instead fire as Ranged (Heavy), damage 10, crit 2, Short range, Burn 5, Blast 2. Gains Cumbersome +1.',
    apply: { quality: ['CUMBERSOME', 'Cumbersome', 1] },
    mods: [] },

  { key: 'ATT_WPNSLING', name: 'Weapon Sling', cat: 'weapon',
    price: 100, rarity: 0, hp: 1,
    fits: 'Ranged (Heavy) weapons',
    base: 'Cumbersome -1.',
    apply: { qualityAdjust: ['CUMBERSOME', -1] },
    mods: [{ count: 1, text: 'Quick Draw' }] },

  { key: 'ATT_WPNHARNESS', name: 'Weapon Harness', cat: 'weapon',
    price: 500, rarity: 2, hp: 2,
    fits: 'Ranged (Heavy) and Gunnery weapons',
    base: 'Cumbersome -2.',
    apply: { qualityAdjust: ['CUMBERSOME', -2] },
    mods: [{ count: 1, text: 'Brace' }] },

  { key: 'ATT_WEIGHTEDHEAD', name: 'Weighted Head', cat: 'weapon',
    price: 250, rarity: 3, hp: 2,
    fits: 'Bludgeoning Melee or Brawl weapons',
    base: 'Damage +1.',
    apply: { damage: 1 },
    mods: [{ count: 1, text: 'Damage +1' }, { count: 1, text: 'Concussive +1' }] },

  // ── Armor attachments ────────────────────────────────────────────────
  // Common sense caps apply: a suit holds one environmental system and one
  // helmet optic (EotE Core p.194).
  { key: 'ATT_CORTOSIS', name: 'Cortosis Weave', cat: 'armor',
    price: 10000, rarity: 8, hp: 2,
    fits: 'Any armor',
    base: 'The armor gains the Cortosis quality.',
    apply: { quality: ['CORTOSIS', 'Cortosis'] },
    mods: [] },

  { key: 'ATT_THERMSHIELD', name: 'Thermal Shielding System', cat: 'armor',
    price: 1000, rarity: 3, hp: 1,
    fits: 'Sealable full-body armor',
    base: 'Resilience checks against fire and extreme heat are 1 difficulty easier, and up to 2 setback dice from heat or fire are removed.',
    mods: [] },

  { key: 'ATT_HEATING', name: 'Heating System', cat: 'armor',
    price: 1000, rarity: 3, hp: 1,
    fits: 'Sealable full-body armor',
    base: 'Resilience checks against extreme cold are 1 difficulty easier, and up to 2 setback dice from cold are removed.',
    mods: [] },

  { key: 'ATT_OPTICSUITE', name: 'Enhanced Optics Suite', cat: 'armor',
    price: 1750, rarity: 3, hp: 1,
    fits: 'Any armor',
    base: 'Removes up to 2 setback dice from Perception, Surveillance, Vigilance, and combat checks caused by darkness, smoke, or anything else obscuring vision.',
    mods: [{ count: 1, text: 'Vigilance +1' }] },

  { key: 'ATT_STRENGTHSYS', name: 'Strength Enhancing System', cat: 'armor',
    price: 5500, rarity: 4, hp: 2,
    fits: 'Laminate armor and similar full-body hard suits',
    base: 'Brawn +1 while worn. This does NOT raise soak or wound threshold.',
    mods: [{ count: 2, text: 'Athletics +1' }, { count: 2, text: 'Brace' }] },

  { key: 'ATT_OPTICALCAMO', name: 'Optical Camouflage System', cat: 'armor',
    price: 5500, rarity: 6, hp: 2,
    fits: 'Any armor, though it works poorly on bulky laminate and plastoid heavy armor',
    base: 'Upgrades the ability of all Stealth checks twice while worn.',
    mods: [{ count: 1, text: 'Master of Shadows' }, { count: 1, text: 'Stealth +1' }] },

  { key: 'ATT_SUPARMCUSTOM', name: 'Superior Armor Customization', cat: 'armor',
    price: 5000, rarity: 6, hp: 1,
    fits: 'Any armor',
    base: 'Gains the Superior quality.',
    apply: { quality: ['SUPERIOR', 'Superior'] },
    mods: [] },

  { key: 'ATT_VACUUMSEAL', name: 'Vacuum Sealed', cat: 'armor',
    price: 1000, rarity: 3, hp: 1,
    fits: 'Laminate or battle armor',
    base: 'The wearer ignores vacuum and poisonous atmospheres for up to 10 minutes.',
    mods: [] },
];

// The mod bench: what installing a modification option costs and rolls.
window.SW.attachmentMods = {
  baseCredits: 100,
  baseDifficulty: 3,   // Hard
  skill: 'Mechanics',
  // Each mod already installed in that attachment adds one difficulty and
  // another 100 credits.
  stepDifficulty: 1,
  stepCredits: 100,
  vehicleCostMultiplier: 10,
};
