// Official crafting templates and result options for the FFG Star Wars RPG.
//
// Crafting is one framework everywhere: pick a template, buy its materials,
// then make a single construction check. Success yields the template's profile;
// failure loses the materials. Successes past the first cut 2 hours off the
// build (floor 1 hour); the crafter spends advantage and triumph on the
// improvement list, and the GM spends threat and despair on the flaw list.
//
// difficulty: 1 Easy, 2 Average, 3 Hard, 4 Daunting, 5 Formidable.
// Option costs are counts of the symbol named by the list (adv or thr), where
// a triumph substitutes for the whole advantage cost and a despair for the
// whole threat cost, exactly as the printed tables read.
//
// Sources: weapons, gadgets, and cybernetics from Special Modifications;
// armor from Keeping the Peace; lightsabers from Endless Vigil. Nothing here
// is homebrew. Vehicles, droids, alchemy, and fortifications are not yet
// covered; their result shapes do not map onto this app's inventory yet.
window.SW = window.SW || {};

window.SW.crafting = {
  // Shared across every category (Special Modifications, Step 3: Construction).
  universal: {
    timePerSuccess: 2,      // hours saved per success beyond the first
    minHours: 1,
  },

  categories: [

    // ── Brawl and melee weapons ──────────────────────────────────────────
    {
      key: 'melee', label: 'Melee', produces: 'weapon',
      source: 'Special Modifications, p. 76-77',
      intro: 'Clubs, blades, shields, and the powered weapons that carry a charge. The simplest things you can build, and the only templates a survivalist can manage without a workshop.',
      templates: [
        { key: 'CRAFT_FIST', name: 'Fist Weapon', price: 10, rarity: 0, difficulty: 2, skills: ['Mechanics', 'Survival'], hours: 4,
          examples: 'Brass knuckles, punch dagger',
          profile: { skillKey: 'BRAWL', skill: 'Brawl', damage: 1, damageType: 'add', crit: 4, range: 'Engaged', encumbrance: 1, hp: 0, hands: 'One-handed',
                     qualities: [{ key: 'DISORIENT', name: 'Disorient', count: 3 }] } },
        { key: 'CRAFT_BLUNT', name: 'Blunt Weapon', price: 5, rarity: 0, difficulty: 1, skills: ['Mechanics', 'Survival'], hours: 6,
          examples: 'Club, staff',
          profile: { skillKey: 'MELEE', skill: 'Melee', damage: 2, damageType: 'add', crit: 5, range: 'Engaged', encumbrance: 3, hp: 1, hands: 'One-handed',
                     qualities: [{ key: 'DISORIENT', name: 'Disorient', count: 2 }] } },
        { key: 'CRAFT_SHIELD', name: 'Shield', price: 10, rarity: 0, difficulty: 2, skills: ['Mechanics', 'Survival'], hours: 8,
          examples: 'Buckler, riot shield',
          profile: { skillKey: 'MELEE', skill: 'Melee', damage: 0, damageType: 'add', crit: 5, range: 'Engaged', encumbrance: 1, hp: 4, hands: 'One-handed',
                     qualities: [{ key: 'DEFENSIVE', name: 'Defensive', count: 1 }] } },
        { key: 'CRAFT_BLADE', name: 'Bladed Weapon', price: 10, rarity: 0, difficulty: 2, skills: ['Mechanics', 'Survival'], hours: 16,
          examples: 'Axe, knife, sword',
          profile: { skillKey: 'MELEE', skill: 'Melee', damage: 1, damageType: 'add', crit: 3, range: 'Engaged', encumbrance: 2, hp: 1, hands: 'One-handed', qualities: [] } },
        { key: 'CRAFT_VIBRO', name: 'Vibro-weapon', price: 200, rarity: 3, difficulty: 3, skills: ['Mechanics'], hours: 24,
          examples: 'Vibro-ax, vibroknife, vibrosword',
          profile: { skillKey: 'MELEE', skill: 'Melee', damage: 1, damageType: 'add', crit: 2, range: 'Engaged', encumbrance: 2, hp: 3, hands: 'One-handed',
                     qualities: [{ key: 'PIERCE', name: 'Pierce', count: 2 }, { key: 'VICIOUS', name: 'Vicious', count: 1 }] } },
        { key: 'CRAFT_POWERED', name: 'Powered Melee Weapon', price: 400, rarity: 4, difficulty: 4, skills: ['Mechanics'], hours: 48,
          examples: 'Electrostaff, force pike',
          profile: { skillKey: 'MELEE', skill: 'Melee', damage: 2, damageType: 'add', crit: 3, range: 'Engaged', encumbrance: 3, hp: 5, hands: 'One-handed',
                     qualities: [{ key: 'STUN', name: 'Stun', count: 3 }] } },
      ],
      improvements: [
        { adv: 1, options: [
          { name: 'Practice Makes Perfect', text: 'Boost die on your next check with this skill this session.' },
          { name: 'Two-Handed', text: '+1 damage and +2 encumbrance; the weapon becomes two-handed. Once.' },
          { name: 'Lightweight', text: 'Encumbrance -1, to a minimum of 1.' },
          { name: 'Knockdown', text: 'Gains Knockdown. Once.' } ] },
        { adv: 2, options: [
          { name: 'Lessons Learned', text: 'Your next crafting check is 1 difficulty easier.' },
          { name: 'Defensive', text: 'Gains Defensive 1, or +1 to it, to a maximum of 3.' },
          { name: 'Customizable', text: '+1 hard point. Once.' },
          { name: 'Pierce', text: 'Gains Pierce 1, or +1 to it.' },
          { name: 'Vicious', text: 'Gains Vicious 1, or +1 to it, to a maximum of 5.' },
          { name: 'Stun', text: 'Gains Stun 1, or +1 to it.' } ] },
        { adv: 3, options: [
          { name: 'Efficient Construction', text: 'Keep supplies worth half the material price. Once.' },
          { name: 'Ensnare', text: 'Gains Ensnare 1, or +1 to it.' },
          { name: 'Deflection', text: 'Gains Deflection 1, or +1 to it, to a maximum of 3.' },
          { name: 'Destructive', text: '+1 damage. Once.' } ] },
        { adv: 4, options: [
          { name: 'Accurate', text: 'Gains Accurate 1, or +1 to it, to a maximum of 3.' },
          { name: 'Lethal', text: 'Critical rating -1, to a minimum of 1. Once.' },
          { name: 'Sunder', text: 'Gains Sunder. Once.' },
          { name: 'Schematic', text: 'Permanently reduce this template’s difficulty by 1, to a minimum of Simple.' } ] },
        { tri: 2, options: [
          { name: 'Concussive', text: 'Gains Concussive 1. Once.' },
          { name: 'Integral Attachment', text: '+1 hard point, then install a 1-hard-point attachment free, with no check.' } ] },
      ],
      flaws: [
        { thr: 1, options: [
          { name: 'Exhausting Effort', text: 'You suffer 3 strain when construction finishes.' },
          { name: 'Heavy', text: 'Encumbrance +1.' } ] },
        { thr: 2, options: [
          { name: 'Cumbersome', text: 'Gains Cumbersome 1, or +1 to it.' },
          { name: 'Hard to Modify', text: 'Attachment mod checks on this weapon are 1 difficulty harder.' } ] },
        { thr: 3, options: [
          { name: 'Wear and Tear', text: 'Your tools are damaged one step.' },
          { name: 'Difficult to Repair', text: 'Repair checks on this weapon are 1 difficulty harder.' },
          { name: 'Inaccurate', text: 'Gains Inaccurate 1, or +1 to it.' } ] },
        { thr: 4, options: [
          { name: 'Brittle', text: 'A despair on any combat check with it damages the weapon one level.' } ] },
        { des: 2, options: [
          { name: 'Hidden Flaw', text: 'The GM may later flip a Destiny Point to break it: major damage until repaired, once only.' } ] },
      ],
    },

    // ── Ranged weapons ───────────────────────────────────────────────────
    {
      key: 'ranged', label: 'Ranged', produces: 'weapon',
      source: 'Special Modifications, p. 78-79',
      intro: 'Everything from a hand-carved bow to a missile launcher. Anything built with Limited Ammo arrives loaded to that rating and no further.',
      templates: [
        { key: 'CRAFT_SIMPLEPROJ', name: 'Simple Projectile Weapon', price: 10, rarity: 0, difficulty: 2, skills: ['Mechanics', 'Survival'], hours: 4,
          examples: 'Bow, sling, blowgun, javelin',
          profile: { skillKey: 'RANGLT', skill: 'Ranged - Light', damage: 4, damageType: 'base', crit: 5, range: 'Short', encumbrance: 3, hp: 0,
                     qualities: [{ key: 'LIMITEDAMMO', name: 'Limited Ammo', count: 1 }] } },
        { key: 'CRAFT_SOLIDPIS', name: 'Solid Projectile Pistol', price: 50, rarity: 2, difficulty: 2, skills: ['Mechanics'], hours: 8,
          examples: 'Slugthrower pistol, flechette pistol',
          profile: { skillKey: 'RANGLT', skill: 'Ranged - Light', damage: 4, damageType: 'base', crit: 5, range: 'Short', encumbrance: 1, hp: 0, qualities: [] } },
        { key: 'CRAFT_SOLIDRIF', name: 'Solid Projectile Rifle', price: 125, rarity: 2, difficulty: 3, skills: ['Mechanics'], hours: 8,
          examples: 'Slugthrower rifle, rail gun',
          profile: { skillKey: 'RANGHVY', skill: 'Ranged - Heavy', damage: 7, damageType: 'base', crit: 5, range: 'Medium', encumbrance: 5, hp: 1,
                     qualities: [{ key: 'CUMBERSOME', name: 'Cumbersome', count: 2 }] } },
        { key: 'CRAFT_ENERGYPIS', name: 'Energy Pistol', price: 200, rarity: 3, difficulty: 3, skills: ['Mechanics'], hours: 12,
          examples: 'Blaster pistol',
          profile: { skillKey: 'RANGLT', skill: 'Ranged - Light', damage: 6, damageType: 'base', crit: 3, range: 'Medium', encumbrance: 1, hp: 3, qualities: [] } },
        { key: 'CRAFT_ENERGYRIF', name: 'Energy Rifle', price: 450, rarity: 4, difficulty: 3, skills: ['Mechanics'], hours: 16,
          examples: 'Blaster rifle',
          profile: { skillKey: 'RANGHVY', skill: 'Ranged - Heavy', damage: 9, damageType: 'base', crit: 3, range: 'Long', encumbrance: 4, hp: 4, qualities: [] } },
        { key: 'CRAFT_HVYENERGYRIF', name: 'Heavy Energy Rifle', price: 1000, rarity: 6, restricted: true, difficulty: 4, skills: ['Mechanics'], hours: 24,
          examples: 'Heavy blaster rifle, disruptor rifle',
          profile: { skillKey: 'GUNN', skill: 'Gunnery', damage: 10, damageType: 'base', crit: 3, range: 'Long', encumbrance: 6, hp: 4,
                     qualities: [{ key: 'CUMBERSOME', name: 'Cumbersome', count: 3 }] } },
        { key: 'CRAFT_MISSLAUNCH', name: 'Missile Launcher', price: 4000, rarity: 7, restricted: true, difficulty: 4, skills: ['Mechanics'], hours: 16,
          examples: 'Missile launcher, torpedo launcher',
          note: 'The launcher has no profile of its own; it fires with the profile of whatever missile is loaded.',
          profile: { skillKey: 'GUNN', skill: 'Gunnery', damage: null, damageType: 'base', crit: null, range: '—', encumbrance: 7, hp: 4, qualities: [] } },
        { key: 'CRAFT_MISSILE', name: 'Missile', price: 100, rarity: 3, restricted: true, difficulty: 3, skills: ['Mechanics'], hours: 4,
          examples: 'Missile, micro-torpedo',
          profile: { skillKey: 'GUNN', skill: 'Gunnery', damage: 20, damageType: 'base', crit: 2, range: 'Extreme', encumbrance: 7, hp: 4,
                     qualities: [{ key: 'BLAST', name: 'Blast', count: 10 }, { key: 'BREACH', name: 'Breach', count: 1 },
                                 { key: 'CUMBERSOME', name: 'Cumbersome', count: 3 }, { key: 'GUIDED', name: 'Guided', count: 3 },
                                 { key: 'PREPARE', name: 'Prepare', count: 1 }, { key: 'LIMITEDAMMO', name: 'Limited Ammo', count: 1 }] } },
        { key: 'CRAFT_GRENADE', name: 'Grenade', price: 35, rarity: 4, difficulty: 3, skills: ['Mechanics'], hours: 2,
          examples: 'Frag grenade, stun grenade',
          profile: { skillKey: 'RANGLT', skill: 'Ranged - Light', damage: 8, damageType: 'base', crit: 4, range: 'Short', encumbrance: 1, hp: 0,
                     qualities: [{ key: 'BLAST', name: 'Blast', count: 6 }, { key: 'LIMITEDAMMO', name: 'Limited Ammo', count: 1 }] } },
        { key: 'CRAFT_MINE', name: 'Mine', price: 425, rarity: 5, restricted: true, difficulty: 3, skills: ['Mechanics'], hours: 4,
          examples: 'Anti-personnel mine, ion mine',
          profile: { skillKey: 'MECH', skill: 'Mechanics', damage: 12, damageType: 'base', crit: 3, range: 'Engaged', encumbrance: 3, hp: 0,
                     qualities: [{ key: 'BLAST', name: 'Blast', count: 4 }, { key: 'LIMITEDAMMO', name: 'Limited Ammo', count: 1 }] } },
      ],
      improvements: [
        { adv: 1, options: [
          { name: 'Practice Makes Perfect', text: 'Boost die on your next check with this skill this session.' },
          { name: 'Ion', text: 'Gains Ion. Once.' },
          { name: 'Lightweight', text: 'Encumbrance -1, to a minimum of 1.' },
          { name: 'Disorient', text: 'Gains Disorient, or +1 to it.' } ] },
        { adv: 2, options: [
          { name: 'Lessons Learned', text: 'Your next crafting check is 1 difficulty easier.' },
          { name: 'Customizable', text: '+1 hard point. Once.' },
          { name: 'Increased Range', text: '+1 range band, to a maximum of Extreme. Once.' },
          { name: 'Knockdown', text: 'Gains Knockdown. Once.' },
          { name: 'Vicious', text: 'Gains Vicious 1, or +1 to it, to a maximum of 5.' },
          { name: 'Stun Setting', text: 'Gains Stun Setting. Once.' } ] },
        { adv: 3, options: [
          { name: 'Efficient Construction', text: 'Keep supplies worth half the material price. Once.' },
          { name: 'Destructive', text: '+1 damage. Once.' },
          { name: 'Ensnare', text: 'Gains Ensnare 1, or +1 to it.' },
          { name: 'Stun', text: 'Gains Stun 3, or +1 to it.' },
          { name: 'Pierce', text: 'Gains Pierce 1, or +1 to it.' } ] },
        { adv: 4, options: [
          { name: 'Auto-fire', text: 'Gains Auto-fire. Once.' },
          { name: 'Burn', text: 'Gains Burn 1, or +1 to it.' },
          { name: 'Lethal', text: 'Critical rating -1, to a minimum of 1. Once.' },
          { name: 'Accurate', text: 'Gains Accurate 1, or +1 to it, to a maximum of 3.' },
          { name: 'Schematic', text: 'Permanently reduce this template’s difficulty by 1, to a minimum of Simple.' } ] },
        { tri: 2, options: [
          { name: 'Blast', text: 'Gains Blast 5, or +2 to it.' },
          { name: 'Concussive', text: 'Gains Concussive 1. Once.' },
          { name: 'Integral Attachment', text: '+1 hard point, then install a 1-hard-point attachment free, with no check.' } ] },
      ],
      flaws: [
        { thr: 1, options: [
          { name: 'Exhausting Effort', text: 'You suffer 3 strain when construction finishes.' },
          { name: 'Heavy', text: 'Encumbrance +1.' },
          { name: 'Cumbersome', text: 'Gains Cumbersome 1, or +1 to it.' } ] },
        { thr: 2, options: [
          { name: 'Expensive', text: 'Repair costs are doubled. Once.' },
          { name: 'Hard to Modify', text: 'Attachment mod checks on this weapon are 1 difficulty harder.' },
          { name: 'Difficult to Repair', text: 'Repair checks on this weapon are 1 difficulty harder.' } ] },
        { thr: 3, options: [
          { name: 'Wear and Tear', text: 'Your tools are damaged one step.' },
          { name: 'Prepare', text: 'Gains Prepare 1, or +1 to it.' },
          { name: 'Ammunition-Inefficient', text: 'The GM may also empty it by spending 3 threat, not just a despair. Once.' },
          { name: 'Inaccurate', text: 'Gains Inaccurate 1, or +1 to it.' } ] },
        { thr: 4, options: [
          { name: 'Limited Ammo', text: 'Gains Limited Ammo 3, or -1 to it, to a minimum of 1.' },
          { name: 'Slow-Firing', text: 'Gains Slow-Firing 1, or +1 to it.' } ] },
        { des: 2, options: [
          { name: 'Dangerously Volatile', text: 'The GM may spend a despair from any combat check to destroy it, dealing 10 damage to the wielder and everyone engaged. Once.' } ] },
      ],
    },

    // ── Lightsabers ──────────────────────────────────────────────────────
    {
      key: 'lightsaber', label: 'Lightsabers', produces: 'weapon',
      source: 'Endless Vigil, p. 84-86',
      intro: 'What you build at the bench is the hilt. The material price and the check cover the housing alone, so it leaves your workshop inert until you fit a crystal.',
      note: 'These are HILT profiles: no damage, and no Breach or Sunder. The crystal you install supplies all three, plus whatever it carries of its own. A standard crystal in a standard hilt makes a damage 6, crit 2 lightsaber.',
      templates: [
        { key: 'CRAFT_LS_STD', name: 'Standard Lightsaber Hilt', price: 100, rarity: 4, difficulty: 2, skills: ['Mechanics'], hours: 6,
          examples: 'Lightsaber',
          profile: { skillKey: 'LTSABER', skill: 'Lightsaber', damage: 0, damageType: 'base', crit: null, range: 'Engaged', encumbrance: 1, hp: 5, hands: 'One-handed',
                     qualities: [] } },
        { key: 'CRAFT_LS_PREC', name: 'Precision Lightsaber Hilt', price: 150, rarity: 5, difficulty: 2, skills: ['Mechanics'], hours: 12,
          examples: 'Shoto, dagger lightsaber, lightfoil',
          note: 'Crystals installed in this hilt deal 1 less damage.',
          profile: { skillKey: 'LTSABER', skill: 'Lightsaber', damage: 0, damageType: 'base', crit: null, range: 'Engaged', encumbrance: 1, hp: 3, hands: 'One-handed',
                     qualities: [{ key: 'ACCURATE', name: 'Accurate', count: 1 }] } },
        { key: 'CRAFT_LS_DEF', name: 'Defensive Lightsaber Hilt', price: 300, rarity: 6, difficulty: 3, skills: ['Mechanics'], hours: 12,
          examples: 'Guard shoto',
          note: 'Crystals installed in this hilt deal 1 less damage.',
          profile: { skillKey: 'LTSABER', skill: 'Lightsaber', damage: 0, damageType: 'base', crit: null, range: 'Engaged', encumbrance: 1, hp: 3, hands: 'One-handed',
                     qualities: [{ key: 'DEFENSIVE', name: 'Defensive', count: 1 }] } },
        { key: 'CRAFT_LS_DBL', name: 'Double-Bladed Lightsaber Hilt', price: 300, rarity: 5, difficulty: 3, skills: ['Mechanics'], hours: 12,
          examples: 'Double-bladed lightsaber, Temple Guard lightsaber pike',
          note: 'Attachments and crystals for this hilt cost double.',
          profile: { skillKey: 'LTSABER', skill: 'Lightsaber', damage: 0, damageType: 'base', crit: null, range: 'Engaged', encumbrance: 2, hp: 4, hands: 'Two-handed',
                     qualities: [{ key: 'LINKED', name: 'Linked', count: 1 }, { key: 'UNWIELDY', name: 'Unwieldy', count: 3 }] } },
        { key: 'CRAFT_LS_POLE', name: 'Pole Lightsaber Hilt', price: 150, rarity: 5, difficulty: 3, skills: ['Mechanics'], hours: 12,
          examples: 'Lightsaber pike, long-handle lightsaber',
          profile: { skillKey: 'LTSABER', skill: 'Lightsaber', damage: 0, damageType: 'base', crit: null, range: 'Engaged', encumbrance: 2, hp: 4, hands: 'Two-handed',
                     qualities: [{ key: 'CUMBERSOME', name: 'Cumbersome', count: 3 }, { key: 'DEFENSIVE', name: 'Defensive', count: 1 }] } },
      ],
      improvements: [
        { adv: 1, options: [
          { name: 'Lightweight', text: 'Encumbrance -1, to a minimum of 1.' },
          { name: 'Two-Handed', text: 'Becomes two-handed and gains a damage increase.' } ] },
        { adv: 2, options: [
          { name: 'Disguised', text: 'The hilt reads as something else; setback dice to spot it for what it is.' },
          { name: 'Counterweight', text: 'Better balance in the hand.' } ] },
        { adv: 3, options: [
          { name: 'Crossguard', text: 'A guarded emitter shape.' },
          { name: 'Customizable', text: '+1 hard point.' },
          { name: 'Delicate Balance', text: 'Refined weighting.' },
          { name: 'Personalized Design', text: 'Built to your hand alone.' } ] },
        { adv: 4, options: [
          { name: 'Inbuilt', text: 'Conceal a small device inside the hilt.' },
          { name: 'Energy Bleed', text: 'Tuned energy channelling.' } ] },
        { tri: 1, options: [
          { name: 'Fine-Tuned Emitter', text: 'A markedly better emitter.' },
          { name: 'Personalized Inlay', text: 'Distinctive personal ornament.' } ] },
        { tri: 2, options: [
          { name: 'Integral Attachment', text: '+1 hard point, then install a 1-hard-point attachment free, with no check.' } ] },
      ],
      flaws: [
        { thr: 1, options: [
          { name: 'Heavy', text: 'Encumbrance +1.' },
          { name: 'Exhausting Effort', text: 'You suffer 3 strain when construction finishes.' } ] },
        { thr: 2, options: [
          { name: 'Oddly Weighted', text: 'The balance is off.' },
          { name: 'Fragile Casing', text: 'The housing damages easily.' } ] },
        { thr: 3, options: [
          { name: 'Awkward Grip', text: 'Uncomfortable in the hand.' },
          { name: 'Misaligned Emitter', text: 'The blade sits slightly wrong.' } ] },
        { thr: 4, options: [
          { name: 'Erratic', text: 'The blade flickers unpredictably.' },
          { name: 'Poor Focusing Lens', text: 'A weaker focused blade.' } ] },
        { des: 1, options: [
          { name: 'Faulty Inlay', text: 'The ornament is flawed.' },
          { name: 'Tragic Accident', text: 'Something goes badly wrong during the build.' } ] },
        { des: 2, options: [
          { name: 'Unstable', text: 'The weapon cannot be trusted to hold together.' } ] },
      ],
    },

    // ── Armor ────────────────────────────────────────────────────────────
    {
      key: 'armor', label: 'Armor', produces: 'armor',
      source: 'Keeping the Peace, p. 90-91',
      intro: 'Padded cloth through powered plate. The heavier templates want a real workshop and a real budget, but a survivalist can stitch reinforced clothing anywhere.',
      templates: [
        { key: 'CRAFT_ARM_REINF', name: 'Reinforced Clothing', price: 25, rarity: 0, difficulty: 2, skills: ['Mechanics', 'Survival'], hours: 6,
          profile: { soak: 1, defense: 0, encumbrance: 1, hp: 0 } },
        { key: 'CRAFT_ARM_LIGHT', name: 'Light Armor', price: 250, rarity: 0, difficulty: 2, skills: ['Mechanics', 'Survival'], hours: 12,
          profile: { soak: 2, defense: 0, encumbrance: 2, hp: 0 } },
        { key: 'CRAFT_ARM_CUSTOM', name: 'Customizable Armor', price: 500, rarity: 4, difficulty: 2, skills: ['Mechanics'], hours: 16,
          profile: { soak: 1, defense: 0, encumbrance: 4, hp: 4 } },
        { key: 'CRAFT_ARM_DEFL', name: 'Deflective Armor', price: 500, rarity: 5, difficulty: 2, skills: ['Mechanics'], hours: 24,
          profile: { soak: 1, defense: 1, encumbrance: 2, hp: 1 } },
        { key: 'CRAFT_ARM_COMBAT', name: 'Combat Armor', price: 1250, rarity: 4, difficulty: 3, skills: ['Mechanics'], hours: 48,
          profile: { soak: 2, defense: 0, encumbrance: 4, hp: 3 } },
        { key: 'CRAFT_ARM_SEG', name: 'Segmented Armor', price: 2500, rarity: 6, restricted: true, difficulty: 4, skills: ['Mechanics'], hours: 72,
          profile: { soak: 2, defense: 1, encumbrance: 6, hp: 4 } },
        { key: 'CRAFT_ARM_AUG', name: 'Augmentative Armor', price: 4500, rarity: 8, restricted: true, difficulty: 5, skills: ['Mechanics'], hours: 120,
          profile: { soak: 2, defense: 2, encumbrance: 6, hp: 6 } },
      ],
      improvements: [
        { adv: 1, options: [
          { name: 'Practice Makes Perfect', text: 'Boost die on your next check with this skill this session.' },
          { name: 'Lightweight', text: 'Encumbrance -1, to a minimum of 1.' },
          { name: 'Sealable', text: 'Covers the whole body and can take the Vacuum Sealed attachment. Once.' } ] },
        { adv: 2, options: [
          { name: 'Lessons Learned', text: 'Your next crafting check is 1 difficulty easier.' },
          { name: 'Extra Melee Defense', text: '+1 melee defense. Once.' },
          { name: 'Special Embellishment', text: 'Automatic advantage on one of Charm, Coercion, Negotiation, Leadership, Resilience, or Stealth. Once.' } ] },
        { adv: 3, options: [
          { name: 'Efficient Construction', text: 'Keep supplies worth half the material price. Once.' },
          { name: 'Extra Ranged Defense', text: '+1 ranged defense. Once.' },
          { name: 'Extra Hard Point', text: '+1 hard point, up to 2 extra in total.' } ] },
        { adv: 4, options: [
          { name: 'Extra Soak', text: '+1 soak. Once.' },
          { name: 'Duplicate', text: 'A second identical suit at no extra cost, flaws and all.' },
          { name: 'Armor Schematic', text: 'Permanently reduce this template’s difficulty by 1, to a minimum of Simple. Once.' } ] },
        { tri: 2, options: [
          { name: 'Integral Attachment', text: '+1 hard point, then install a 1-hard-point attachment free, with no check.' } ] },
      ],
      flaws: [
        { thr: 1, options: [
          { name: 'Exhausting Effort', text: 'You suffer 3 strain when construction finishes.' },
          { name: 'Heavy', text: 'Encumbrance +1.' },
          { name: 'Poor Fit', text: 'Donning or removing it takes 1 extra action. Once.' } ] },
        { thr: 2, options: [
          { name: 'Complex', text: 'Repair checks on this armor are 1 difficulty harder.' },
          { name: 'Difficult to Customize', text: 'Attachment mod checks on this armor are 1 difficulty harder.' },
          { name: 'Restrictive', text: 'Automatic threat on one of Athletics, Coordination, Perception, Skulduggery, or Vigilance. Once.' } ] },
        { thr: 3, options: [
          { name: 'Wear and Tear', text: 'Your tools are damaged one step.' },
          { name: 'Fragile', text: 'Damage to this armor always counts as at least moderate. Once.' } ] },
        { thr: 4, options: [
          { name: 'Expensive', text: 'Repair costs are doubled.' },
          { name: 'Supply Shortage', text: 'You run short mid-build; spend another quarter of the material price to finish. Once.' } ] },
        { des: 2, options: [
          { name: 'Unexpected Flaw', text: 'The GM may later spend a Destiny Point to make it fail: major damage until repaired, once only.' } ] },
      ],
    },

    // ── Gadgets ──────────────────────────────────────────────────────────
    {
      key: 'gadget', label: 'Gadgets', produces: 'gear',
      source: 'Special Modifications, p. 84',
      intro: 'Tools built for one job. Pick the General skill it serves when you build it.',
      templates: [
        { key: 'CRAFT_TOOL_SIMPLE', name: 'Simple Tool', price: 50, rarity: 1, difficulty: 1, skills: ['Mechanics'], hours: 2,
          examples: 'Climbing gear, datapad, hand scanner, emergency medpac, toolkit, slicer gear',
          profile: { encumbrance: 4, effect: 'Choose a General skill. The tool lets you make checks with that skill, and counts as the right tool for the job at the GM’s discretion.' } },
        { key: 'CRAFT_TOOL_SPEC', name: 'Specialist Tool', price: 400, rarity: 4, difficulty: 2, skills: ['Mechanics'], hours: 10,
          examples: 'Bacta tank, scanner dish, table saw, welding gear',
          profile: { encumbrance: 8, effect: 'Choose a General skill. Add an automatic success to checks with that skill.' } },
        { key: 'CRAFT_TOOL_PREC', name: 'Precision Instrument', price: 150, rarity: 5, difficulty: 3, skills: ['Mechanics'], hours: 16,
          examples: 'Microscope, thermal cloak, scanner goggles',
          profile: { encumbrance: 5, effect: 'Choose a General skill. Remove two setback dice from checks with that skill.' } },
      ],
      improvements: [
        { adv: 1, options: [
          { name: 'Lightweight', text: 'Encumbrance -1, to a minimum of 1.' },
          { name: 'Practice Makes Perfect', text: 'Boost die on your next check with this skill this session.' } ] },
        { adv: 2, options: [
          { name: 'Compact', text: 'At encumbrance 3 or less, searchers add a setback die to find it on you, up to three.' },
          { name: 'Lessons Learned', text: 'Your next crafting check is 1 difficulty easier.' } ] },
        { adv: 3, options: [
          { name: 'Efficient Construction', text: 'Keep supplies worth half the material price. Once.' },
          { name: 'Safety Features', text: 'Automatic advantage on checks with the tool’s chosen skill. Once.' } ] },
        { adv: 4, options: [
          { name: 'Inbuilt Weapon', text: 'Build in a weapon of encumbrance 2 or less that you own; setback die to notice it. Once.' } ] },
        { tri: 2, options: [
          { name: 'Supreme Craftsmanship', text: 'Upgrade checks made with this tool once.' } ] },
      ],
      flaws: [
        { thr: 1, options: [
          { name: 'Exhausting Effort', text: 'You suffer 3 strain when construction finishes.' },
          { name: 'Heavy', text: 'Encumbrance +1.' } ] },
        { thr: 2, options: [
          { name: 'Difficult to Repair', text: 'Repair checks on this gadget are 1 difficulty harder.' },
          { name: 'Delicate', text: 'The GM may spend 2 threat or a despair from any check to damage it one step. Once.' } ] },
        { thr: 3, options: [
          { name: 'Unpresentable', text: 'Its resale value is halved. Once.' } ] },
        { thr: 4, options: [
          { name: 'Fragile', text: 'Any damage to it counts as two steps instead of one. Once.' } ] },
        { des: 2, options: [
          { name: 'Faulty', text: 'Upgrade the difficulty of any check made with this tool once.' } ] },
      ],
    },

    // ── Cybernetics ──────────────────────────────────────────────────────
    {
      key: 'cybernetic', label: 'Cybernetics', produces: 'gear',
      source: 'Special Modifications, p. 85',
      intro: 'Replacement limbs and implants. Expensive, slow, and the hardest checks outside powered armor.',
      templates: [
        { key: 'CRAFT_CYB_PROS', name: 'Prosthetic Appendage', price: 1000, rarity: 3, difficulty: 3, skills: ['Mechanics'], hours: 12,
          profile: { encumbrance: 0, effect: 'Restores the function of a lost limb or organ.' } },
        { key: 'CRAFT_CYB_APP', name: 'Cybernetic Appendage', price: 5000, rarity: 5, difficulty: 4, skills: ['Mechanics'], hours: 48,
          profile: { encumbrance: 0, charModChoice: ['brawn', 'agility'],
                     effect: 'Replaces an arm or leg and raises Brawn or Agility by 1. Only one arm and one leg cybernetic can benefit a character this way.' } },
        { key: 'CRAFT_CYB_IMP', name: 'Cybernetic Implant', price: 1500, rarity: 6, difficulty: 4, skills: ['Mechanics'], hours: 48,
          profile: { encumbrance: 0, effect: 'Choose one General skill. The implant grants one rank in it.' } },
      ],
      improvements: [
        { adv: 1, options: [
          { name: 'Practice Makes Perfect', text: 'Boost die on your next check with this skill this session.' } ] },
        { adv: 2, options: [
          { name: 'Integrated Tool', text: 'Choose a General skill; the cybernetic lets you make checks with it, and counts as the right tool at the GM’s discretion.' },
          { name: 'Unobtrusive', text: 'Setback die to checks made to notice the cybernetic.' } ] },
        { adv: 3, options: [
          { name: 'Tailored', text: 'Built for one specific person, it needs no check to install in them.' } ] },
        { adv: 4, options: [
          { name: 'Inbuilt Weapon', text: 'Build in a weapon of encumbrance 2 or less that you own; setback die to notice it. Once.' } ] },
        { tri: 2, options: [
          { name: 'Ion-Shielded', text: 'It does not shut down when hit by Ion weapons.' } ] },
      ],
      flaws: [
        { thr: 1, options: [
          { name: 'Exhausting Effort', text: 'You suffer 3 strain when construction finishes.' } ] },
        { thr: 2, options: [
          { name: 'Difficult to Install', text: 'Installation checks are 1 difficulty harder.' } ] },
        { thr: 3, options: [
          { name: 'Wear and Tear', text: 'Your tools are damaged one step.' } ] },
        { des: 2, options: [
          { name: 'Severe Feedback', text: 'Every check made with the cybernetic costs the user 1 strain.' } ] },
      ],
    },

  ],
};
