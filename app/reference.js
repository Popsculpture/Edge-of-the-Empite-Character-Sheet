'use strict';

// Reference tab: the basic rules of the game, rendered with the EotE symbol
// font. The letter -> symbol mapping and die colors come from the game's own
// symbol font (see .es / @font-face in the stylesheet). Exposed as a top-level
// const (like Sheet / Engine) so wizard.js can call Reference.render().
const Reference = (() => {

  // A single glyph from the EotE Symbol font, in the given color.
  function es(letter, color, cls) {
    return `<span class="es ${cls || ''}" style="color:${color}">${letter}</span>`;
  }

  // Result symbols (letter mapping fixed by the font; colors match the roller).
  const SUC = c => es('s', '#e9c84a', c);   // Success  (gold)
  const FAI = c => es('f', '#e0674f', c);   // Failure  (salmon)
  const ADV = c => es('a', '#4fc0e8', c);   // Advantage (cyan)
  const THR = c => es('t', '#e0952f', c);   // Threat   (orange)
  const TRI = c => es('x', '#ffd24a', c);   // Triumph  (bright gold)
  const DES = c => es('y', '#d6493a', c);   // Despair  (red)
  // inline versions for use inside sentences
  const i = f => f('es-inline');

  // Token processor: @SUCCESS@, @BOOST@, @DIFFICULTY@, etc. become an inline
  // colored glyph. Lets the rules sections below be written as plain HTML with
  // symbol tokens instead of hand-built spans.
  const TOKENS = {
    SUCCESS: ['s', '#e9c84a'], FAILURE: ['f', '#e0674f'], ADVANTAGE: ['a', '#4fc0e8'],
    THREAT:  ['t', '#e0952f'], TRIUMPH: ['x', '#ffd24a'], DESPAIR:   ['y', '#d6493a'],
    BOOST: ['b', '#90D5FF'], ABILITY: ['d', '#0BDA51'], PROFICIENCY: ['c', '#FBEC5D'],
    SETBACK: ['b', '#353839'], DIFFICULTY: ['d', '#51158C'], CHALLENGE: ['c', '#FA5053'],
    FORCE: ['c', '#FAFAFA'], LIGHT: ['z', '#FAFAFA'], DARK: ['z', '#3a3a3a'],
    // A Force point is the pip you spend, as opposed to FORCE, the die you
    // commit. The books draw it as the white pip, the same as a light side
    // result, so the two deliberately render alike.
    FORCEPOINT: ['z', '#FAFAFA'],
  };
  function fmt(html) {
    return String(html).replace(/@([A-Z]+)@/g, (m, k) =>
      TOKENS[k] ? `<span class="es es-inline" style="color:${TOKENS[k][1]}">${TOKENS[k][0]}</span>` : m);
  }

  // Public token converter shared with the rest of the app. Turns dice/result
  // symbol tokens in EITHER notation into inline glyphs: the reference content
  // uses @BOOST@, while the weapon-quality data uses [BOOST]. Unknown tokens are
  // left untouched so a typo stays visible instead of vanishing.
  function symbols(text) {
    return String(text || '').replace(/@([A-Z]+)@|\[([A-Z]+)\]/g, (m, a, b) => {
      const k = a || b;
      return TOKENS[k] ? `<span class="es es-inline" style="color:${TOKENS[k][1]}">${TOKENS[k][0]}</span>` : m;
    });
  }

  // The seven dice. Boost/Setback share a shape (b), Ability/Difficulty share
  // one (d), and Proficiency/Challenge/Force share one (c); color tells them
  // apart, exactly as the physical dice do.
  const DICE_POS = [
    { name: 'Boost',       letter: 'b', color: '#90D5FF', role: 'A bonus die for favorable circumstances: aiming, cover, or a helping hand.' },
    { name: 'Ability',     letter: 'd', color: '#0BDA51', role: 'Your raw capability, set by a characteristic or a trained skill.' },
    { name: 'Proficiency', letter: 'c', color: '#FBEC5D', role: 'Skill mastery. The only positive die that can roll a Triumph.' },
  ];
  const DICE_NEG = [
    { name: 'Setback',    letter: 'b', color: '#353839', role: 'A minor hindrance: poor light, bad footing, a small distraction.' },
    { name: 'Difficulty', letter: 'd', color: '#51158C', role: 'How hard the task itself is (see the difficulty ladder).' },
    { name: 'Challenge',  letter: 'c', color: '#FA5053', role: 'Serious, skilled opposition. The only die that can roll a Despair.' },
  ];
  const DIE_FORCE = { name: 'Force', letter: 'c', color: '#FAFAFA', role: 'Powers Force abilities, rolling light and dark side pips.' };

  // Rules sections (authored content; symbols written as @TOKENS@, run
  // through fmt() at render time). Order sets the reading flow.
  const SECTIONS = [
  {
    "title": "Making a Check",
    "body": "<ol class=\"ref-steps\"><li>Pick the <strong>skill</strong> and its linked <strong>characteristic</strong>. <small>Ranged Light uses Agility; Charm uses Presence; Computers uses Intellect.</small></li><li>Build positive dice. Compare the characteristic value and the skill ranks: the <strong>higher</strong> number is your total green @ABILITY@ Ability dice, and the <strong>lower</strong> number upgrades that many of them into yellow @PROFICIENCY@ Proficiency dice. <small>Agility 4, Ranged Light 2 = 2 @PROFICIENCY@ + 2 @ABILITY@.</small></li><li>Set the difficulty: add purple @DIFFICULTY@ Difficulty dice for the task or the opposition.</li><li>Upgrade difficulty if needed: a purple @DIFFICULTY@ Difficulty becomes a red @CHALLENGE@ Challenge.</li><li>Add @BOOST@ Boost dice for helpful circumstances and @SETBACK@ Setback dice for hindering ones.</li></ol><p class=\"ref-lead\">Roll the whole pool and cancel opposing symbols. You <strong>succeed</strong> with at least one net @SUCCESS@ Success; leftover @ADVANTAGE@, @THREAT@, @TRIUMPH@, and @DESPAIR@ then add side effects.</p>"
  },
  {
    "title": "Difficulty",
    "body": "<table class=\"ref-table\"><tr><th>Difficulty</th><th>Dice</th><th>Use For</th></tr><tr><td>Simple (0)</td><td>-</td><td>Trivial; usually no roll</td></tr><tr><td>Easy</td><td>@DIFFICULTY@</td><td>Minor obstacle, little pressure</td></tr><tr><td>Average</td><td>@DIFFICULTY@@DIFFICULTY@</td><td>Standard task with real stakes</td></tr><tr><td>Hard</td><td>@DIFFICULTY@@DIFFICULTY@@DIFFICULTY@</td><td>Demanding; needs genuine skill</td></tr><tr><td>Daunting</td><td>@DIFFICULTY@@DIFFICULTY@@DIFFICULTY@@DIFFICULTY@</td><td>Very tough; few succeed</td></tr><tr><td>Formidable</td><td>@DIFFICULTY@@DIFFICULTY@@DIFFICULTY@@DIFFICULTY@@DIFFICULTY@</td><td>Near the limit of ability</td></tr><tr><td>Impossible</td><td>@DIFFICULTY@@DIFFICULTY@@DIFFICULTY@@DIFFICULTY@@DIFFICULTY@ + Destiny flip</td><td>Only with a flipped Destiny Point</td></tr></table><div class=\"ref-sub\">Common Examples</div><table class=\"ref-table\"><tr><th>Task</th><th>Difficulty</th></tr><tr><td>Ranged attack, short range</td><td>Easy @DIFFICULTY@</td></tr><tr><td>Ranged attack, medium range</td><td>Average @DIFFICULTY@@DIFFICULTY@</td></tr><tr><td>Ranged attack, long range</td><td>Hard @DIFFICULTY@@DIFFICULTY@@DIFFICULTY@</td></tr><tr><td>Melee, Brawl, or Lightsaber attack</td><td>Average @DIFFICULTY@@DIFFICULTY@</td></tr><tr><td>Routine social check vs neutral NPC</td><td>Average @DIFFICULTY@@DIFFICULTY@</td></tr><tr><td>Climbing under pressure</td><td>Average to Hard @DIFFICULTY@@DIFFICULTY@ to @DIFFICULTY@@DIFFICULTY@@DIFFICULTY@</td></tr><tr><td>Picking a secure lock</td><td>Hard @DIFFICULTY@@DIFFICULTY@@DIFFICULTY@</td></tr><tr><td>Repairing gear in combat</td><td>Hard @DIFFICULTY@@DIFFICULTY@@DIFFICULTY@</td></tr><tr><td>Slicing a military system</td><td>Hard to Daunting @DIFFICULTY@@DIFFICULTY@@DIFFICULTY@ to @DIFFICULTY@@DIFFICULTY@@DIFFICULTY@@DIFFICULTY@</td></tr></table>"
  },
  {
    "title": "Upgrading & Downgrading Dice",
    "body": "<p class=\"ref-lead\"><strong>Upgrading</strong> improves the quality of a die, not just the quantity. <strong>Downgrading</strong> does the reverse.</p><div class=\"ref-sub\">Upgrading Positive Dice</div><p class=\"ref-p\">Turn a green @ABILITY@ into a yellow @PROFICIENCY@. If every Ability die is already a @PROFICIENCY@, add another green @ABILITY@ instead.</p><div class=\"ref-sub\">Upgrading Difficulty</div><p class=\"ref-p\">Turn a purple @DIFFICULTY@ into a red @CHALLENGE@. If every Difficulty die is already a @CHALLENGE@, add another purple @DIFFICULTY@ instead.</p><div class=\"ref-sub\">Downgrading</div><p class=\"ref-p\">A @PROFICIENCY@ drops back to an @ABILITY@ (or is removed if none remain), and a @CHALLENGE@ drops back to a @DIFFICULTY@ (or is removed). Downgrading positive dice weakens your pool; downgrading difficulty eases the check.</p><div class=\"ref-sub\">When It Happens</div><table class=\"ref-table\"><tr><th>Situation</th><th>Effect</th></tr><tr><td>Destiny Point spent</td><td>Upgrade one side of the pool</td></tr><tr><td>Skilled opponent</td><td>Check may become opposed</td></tr><tr><td>Dangerous action</td><td>Upgrade the difficulty</td></tr><tr><td>Adversary talent</td><td>Upgrade incoming combat checks</td></tr><tr><td>Shooting into engaged allies</td><td>Usually upgrade the difficulty</td></tr><tr><td>Powerful talent or gear</td><td>Upgrade positive dice</td></tr></table>"
  },
  {
    "title": "Destiny Points",
    "body": "<p class=\"ref-lead\">At the start of a session, each player rolls one @FORCE@ Force die to build the shared <strong>Destiny Pool</strong>. Each @LIGHT@ becomes a Light Side point; each @DARK@ becomes a Dark Side point.</p><table class=\"ref-table\"><tr><th>Point</th><th>Used By</th><th>Uses</th></tr><tr><td>Light Side</td><td>Players</td><td>Upgrade a check, activate talents, add a helpful narrative fact</td></tr><tr><td>Dark Side</td><td>GM</td><td>Upgrade difficulty, activate NPC abilities, add complications</td></tr></table><p class=\"ref-p\">Spending a point <strong>flips it to the other side</strong> of the pool, handing that resource to the opposition for later.</p><div class=\"ref-sub\">Good Uses</div><ol class=\"ref-steps\"><li>Upgrade a crucial roll.</li><li>Make a useful fact true <small>(\"good thing we brought breath masks\")</small>.</li><li>Introduce a contact, escape route, or advantage.</li></ol>"
  },
  {
    "title": "Spending Advantage & Triumph",
    "body": "<p class=\"ref-lead\">Symbols left over on a successful or failed check. Spend <strong>@ADVANTAGE@</strong> on positive side effects; a single <strong>@TRIUMPH@</strong> is a mini-jackpot that can also be spent like @ADVANTAGE@.</p><table class=\"ref-table\"><tr><th>Cost</th><th>Effect</th></tr><tr><td>@ADVANTAGE@</td><td>Recover 1 strain</td></tr><tr><td>@ADVANTAGE@</td><td>Add @BOOST@ to the next allied check</td></tr><tr><td>@ADVANTAGE@</td><td>Notice a useful detail in the scene</td></tr><tr><td>@ADVANTAGE@@ADVANTAGE@</td><td>Perform an immediate free maneuver <small>(still max 2 maneuvers per turn)</small></td></tr><tr><td>@ADVANTAGE@@ADVANTAGE@</td><td>Add @SETBACK@ to an enemy's next check</td></tr><tr><td>@ADVANTAGE@@ADVANTAGE@@ADVANTAGE@</td><td>Trigger some weapon qualities</td></tr><tr><td>@ADVANTAGE@ equal to Crit rating</td><td>Inflict a Critical Injury if damage got through soak</td></tr><tr><td>@TRIUMPH@</td><td>Trigger a Critical Injury, or anything @ADVANTAGE@ can do but bigger / scene-changing</td></tr></table>"
  },
  {
    "title": "Spending Threat & Despair",
    "body": "<p class=\"ref-lead\">The GM spends <strong>@THREAT@</strong> on negative side effects, win or lose; a single <strong>@DESPAIR@</strong> is a major setback that can also be spent like @THREAT@.</p><table class=\"ref-table\"><tr><th>Cost</th><th>Effect</th></tr><tr><td>@THREAT@</td><td>Suffer 1 strain</td></tr><tr><td>@THREAT@</td><td>Add @BOOST@ to an enemy's next check</td></tr><tr><td>@THREAT@@THREAT@</td><td>Add @SETBACK@ to an ally's next check, or lose position / drop prone</td></tr><tr><td>@THREAT@@THREAT@@THREAT@</td><td>Weapon jams, lose cover, a bigger complication</td></tr><tr><td>@DESPAIR@</td><td>Weapon breaks, reinforcements arrive, a major bad turn</td></tr></table><p class=\"ref-lead\">Success @SUCCESS@ and Failure @FAILURE@ answer <strong>\"did it work?\"</strong> Advantage @ADVANTAGE@, Threat @THREAT@, Triumph @TRIUMPH@ and Despair @DESPAIR@ answer <strong>\"what else happened?\"</strong></p>"
  },
  {
    "title": "The Turn",
    "body": "<p class=\"ref-lead\">On your turn you get <strong>one action</strong>, <strong>one free maneuver</strong>, and <strong>a few incidentals</strong>.</p><table class=\"ref-table\"><tr><th>Type</th><th>Amount</th><th>Examples</th></tr><tr><td>Action</td><td>1</td><td>Attack, use a skill, use a Force power</td></tr><tr><td>Maneuver</td><td>1 free</td><td>Move, aim, draw an item, take cover</td></tr><tr><td>Incidental</td><td>A few</td><td>Speak, drop an item, small interactions</td></tr></table><p class=\"ref-p\">A <strong>second maneuver</strong> costs 2 strain, or you may downgrade your action into a maneuver instead. You may never take more than <strong>2 maneuvers</strong> in a turn.</p>"
  },
  {
    "title": "Initiative",
    "body": "<p class=\"ref-lead\">Roll <strong>Cool</strong> if you are prepared, or <strong>Vigilance</strong> if you are reacting to a surprise.</p><p class=\"ref-p\">The results set the order of play, filling in <strong>PC slots</strong> and <strong>NPC slots</strong> for the round.</p><p class=\"ref-p\"><strong>Important:</strong> initiative belongs to the <strong>team slot</strong>, not to a fixed character. Each round the players decide who acts in each PC slot, so the best-suited hero can step into the moment.</p>"
  },
  {
    "title": "Range & Movement",
    "body": "<p class=\"ref-lead\">Range is measured in <strong>abstract bands</strong>, not exact meters.</p><div class=\"ref-tables-2\"><table class=\"ref-table\"><tr><th>Band</th><th>Meaning</th></tr><tr><td>Engaged</td><td>Touching / melee</td></tr><tr><td>Short</td><td>Same room</td></tr><tr><td>Medium</td><td>Across a room or street</td></tr><tr><td>Long</td><td>Down the block</td></tr><tr><td>Extreme</td><td>Sniper distance</td></tr></table><table class=\"ref-table\"><tr><th>Move</th><th>Cost</th></tr><tr><td>Engage or disengage</td><td>1 maneuver</td></tr><tr><td>Short to Medium</td><td>1 maneuver</td></tr><tr><td>Medium to Long</td><td>2 maneuvers</td></tr><tr><td>Long to Extreme</td><td>2 maneuvers</td></tr></table></div>"
  },
  {
    "title": "Combat Checks",
    "body": "<div class=\"ref-tables-2\"><table class=\"ref-table\"><tr><th colspan=\"3\">Melee</th></tr><tr><th>Attack</th><th>Skill</th><th>Difficulty</th></tr><tr><td>Unarmed / grapple / natural</td><td>Brawl</td><td>@DIFFICULTY@@DIFFICULTY@</td></tr><tr><td>Knives, clubs, vibroweapons</td><td>Melee</td><td>@DIFFICULTY@@DIFFICULTY@</td></tr><tr><td>Lightsabers</td><td>Lightsaber</td><td>@DIFFICULTY@@DIFFICULTY@</td></tr></table><table class=\"ref-table\"><tr><th colspan=\"2\">Ranged</th></tr><tr><th>Range</th><th>Difficulty</th></tr><tr><td>Engaged (Ranged Light)</td><td>usually @DIFFICULTY@@DIFFICULTY@</td></tr><tr><td>Engaged (Ranged Heavy)</td><td>usually @DIFFICULTY@@DIFFICULTY@@DIFFICULTY@</td></tr><tr><td>Short</td><td>@DIFFICULTY@</td></tr><tr><td>Medium</td><td>@DIFFICULTY@@DIFFICULTY@</td></tr><tr><td>Long</td><td>@DIFFICULTY@@DIFFICULTY@@DIFFICULTY@</td></tr><tr><td>Extreme</td><td>@DIFFICULTY@@DIFFICULTY@@DIFFICULTY@@DIFFICULTY@</td></tr></table></div><p class=\"ref-p\">Shooting a target <strong>engaged with an ally</strong> usually upgrades the difficulty once.</p><p class=\"ref-p\"><strong>Cover</strong> usually adds @SETBACK@ to incoming ranged attacks; darkness, smoke, and weather add more.</p>"
  },
  {
    "title": "Damage, Soak, Wounds & Strain",
    "body": "<p class=\"ref-lead\"><strong>Damage</strong> = the weapon's base damage + each uncanceled @SUCCESS@. Subtract the target's <strong>Soak</strong>; whatever remains is dealt as <strong>Wounds</strong>.</p><div class=\"ref-sub\">Worked Example</div><ol class=\"ref-steps\"><li>Blaster pistol base damage <strong>6</strong>.</li><li>The roll nets <strong>2</strong> @SUCCESS@, so total damage is <strong>8</strong>.</li><li>Target Soak <strong>3</strong>: 8 - 3 = <strong>5 Wounds</strong>.</li></ol><div class=\"ref-sub\">Soak</div><p class=\"ref-p\">Reduces every incoming hit before Wounds are dealt. Comes from <strong>Brawn</strong>, plus armor, talents, and some gear or species traits.</p><div class=\"ref-sub\">Wounds vs Strain</div><table class=\"ref-table\"><tr><th>Track</th><th>What it is</th><th>Exceed the threshold</th></tr><tr><td>Wounds</td><td>Physical harm</td><td>Incapacitated and suffer a Critical Injury</td></tr><tr><td>Strain</td><td>Stress &amp; fatigue</td><td>Knocked out, but recovers quickly</td></tr></table>"
  },
  {
    "title": "Healing & Recovery",
    "body": "<p class=\"ref-lead\">Recover <strong>strain</strong> at the end of an encounter with a Simple <strong>Discipline</strong> or <strong>Cool</strong> check, healing strain equal to net @SUCCESS@. A full rest clears all strain.</p><p class=\"ref-p\">Heal <strong>wounds</strong> through stimpacks, <strong>Medicine</strong> checks, rest, or bacta.</p><div class=\"ref-sub\">Stimpacks</div><p class=\"ref-p\">Each stimpack used on the same day heals less; the count resets after a full rest. <small>Droids use emergency repair patches instead.</small></p><table class=\"ref-table\"><tr><th>Use That Day</th><th>Wounds Healed</th></tr><tr><td>1st</td><td>5</td></tr><tr><td>2nd</td><td>4</td></tr><tr><td>3rd</td><td>3</td></tr><tr><td>4th</td><td>2</td></tr><tr><td>5th</td><td>1</td></tr><tr><td>6th+</td><td>0</td></tr></table>"
  },
  {
    "title": "Critical Injuries",
    "body": "<p class=\"ref-lead\">A <strong>Critical Injury</strong> lands when an attack succeeds, at least 1 wound gets past soak, and the attacker spends @ADVANTAGE@ equal to the weapon's <strong>Crit rating</strong> (or resolves a @TRIUMPH@). Then roll on the Critical Injury table.</p><p class=\"ref-p\">Criticals persist until healed, even after wounds have recovered.</p><div class=\"ref-sub\">Roll Modifiers</div><table class=\"ref-table\"><tr><th>Cause</th><th>Modifier</th></tr><tr><td>Each existing Critical Injury</td><td>+10</td></tr><tr><td>Vicious quality</td><td>+10 per rank</td></tr></table>"
  },
  {
    "title": "Adversary Types",
    "body": "<p class=\"ref-lead\">Enemies come in three grades of toughness, from cannon fodder to signature villains.</p><table class=\"ref-table\"><tr><th>Type</th><th>How They Work</th></tr><tr><td>Minions</td><td>Stormtroopers, thugs, droids. Act as a group on one initiative slot and share a single wound pool. The group's skill ranks equal the number of minions minus 1. A Critical usually drops one minion; strain becomes wounds.</td></tr><tr><td>Rivals</td><td>Named lesser enemies. Have a wound threshold but no separate strain track (strain becomes wounds).</td></tr><tr><td>Nemeses</td><td>Major villains. Have both wounds and strain, use talents and Adversary ranks, and play like PCs.</td></tr></table>"
  },
  {
    "title": "Conditions",
    "body": "<table class=\"ref-table\"><tr><th>State</th><th>Effect</th></tr><tr><td>Prone</td><td>Harder to hit with ranged attacks, easier to hit in melee.</td></tr><tr><td>Immobilized</td><td>Cannot take maneuvers.</td></tr><tr><td>Disoriented</td><td>Adds @SETBACK@ to its checks.</td></tr><tr><td>Staggered</td><td>Cannot take actions.</td></tr><tr><td>Ensnared</td><td>Cannot move.</td></tr><tr><td>Knocked down</td><td>Falls prone.</td></tr><tr><td>Concealed / Cover</td><td>Adds @SETBACK@ to attacks made against it.</td></tr><tr><td>Guarded stance</td><td>Gains a defensive benefit but hinders its own attacks.</td></tr></table>"
  },
  {
    "title": "Weapon Qualities",
    "body": "<p class=\"ref-lead\">Weapon <strong>qualities</strong> are special traits that add effects to attacks or gear. Each has a rating or an activation cost.</p><table class=\"ref-table\"><tr><th>Quality</th><th>Meaning</th></tr><tr><td>Accurate</td><td>Adds @BOOST@ per rating to the combat check.</td></tr><tr><td>Inaccurate</td><td>Adds @SETBACK@ per rating to the combat check.</td></tr><tr><td>Pierce</td><td>Ignores soak equal to the rating.</td></tr><tr><td>Breach</td><td>Ignores heavy soak and vehicle armor (1 rating = 10 armor); can hit vehicles.</td></tr><tr><td>Vicious</td><td>Adds +10 per rating to any Critical Injury roll the hit triggers.</td></tr><tr><td>Auto-fire</td><td>Spend @ADVANTAGE@@ADVANTAGE@ per extra hit; raises the check by @DIFFICULTY@.</td></tr><tr><td>Blast</td><td>On a hit, spend @ADVANTAGE@ to also damage targets near the target.</td></tr><tr><td>Burn</td><td>Target keeps taking fire damage for rounds equal to the rating.</td></tr><tr><td>Stun Damage</td><td>Deals its damage as strain instead of wounds.</td></tr><tr><td>Stun Setting</td><td>Can be switched to deal nonlethal strain damage.</td></tr><tr><td>Linked</td><td>Spend @ADVANTAGE@@ADVANTAGE@ per rating to score one extra hit.</td></tr><tr><td>Sunder</td><td>Spend @ADVANTAGE@ to damage or destroy the target's gear.</td></tr><tr><td>Knockdown</td><td>Spend @ADVANTAGE@ to knock the target prone.</td></tr><tr><td>Disorient</td><td>Spend @ADVANTAGE@ to leave the target Disoriented for rounds equal to the rating.</td></tr><tr><td>Ensnare</td><td>Spend @ADVANTAGE@ to immobilize / restrict the target's movement.</td></tr><tr><td>Concussive</td><td>Spend @ADVANTAGE@ to stagger the target (no actions next turn).</td></tr><tr><td>Cumbersome</td><td>Needs Brawn equal to the rating; add @SETBACK@ per point short.</td></tr><tr><td>Unwieldy</td><td>Needs Agility equal to the rating; add @SETBACK@ per point short.</td></tr><tr><td>Defensive</td><td>Improves melee defense by the rating.</td></tr><tr><td>Deflection</td><td>Improves ranged defense by the rating.</td></tr><tr><td>Cortosis</td><td>Resists lightsabers and cannot be affected by Sunder.</td></tr><tr><td>Ion</td><td>Extra effective against droids and vehicles.</td></tr><tr><td>Limited Ammo</td><td>Can only be fired a number of times equal to the rating per encounter.</td></tr></table><p class=\"ref-p\"><small>Most qualities must be activated by spending @ADVANTAGE@ or @TRIUMPH@ from the check, unless stated otherwise.</small></p>"
  },
  {
    "title": "Skills",
    "body": "<div class=\"ref-sub\">Combat Skills</div><table class=\"ref-table\"><tr><th>Skill</th><th>Used For</th></tr><tr><td>Brawl</td><td>Unarmed strikes and improvised close weapons.</td></tr><tr><td>Melee</td><td>Hand weapons such as knives, clubs, and vibro-axes.</td></tr><tr><td>Lightsaber</td><td>Wielding lightsabers (governed by a chosen characteristic).</td></tr><tr><td>Ranged (Light)</td><td>Pistols and one-handed ranged weapons.</td></tr><tr><td>Ranged (Heavy)</td><td>Rifles and two-handed ranged weapons.</td></tr><tr><td>Gunnery</td><td>Vehicle-mounted weapons and heavy repeaters.</td></tr></table><div class=\"ref-sub\">General Skills</div><table class=\"ref-table\"><tr><th>Skill</th><th>Used For</th></tr><tr><td>Astrogation</td><td>Plotting hyperspace jumps and navigation.</td></tr><tr><td>Athletics</td><td>Climbing, swimming, jumping, and running.</td></tr><tr><td>Charm</td><td>Friendly persuasion and likability.</td></tr><tr><td>Coercion</td><td>Threats and intimidation.</td></tr><tr><td>Computers</td><td>Slicing, programming, and data systems.</td></tr><tr><td>Cool</td><td>Composure and prepared initiative.</td></tr><tr><td>Coordination</td><td>Balance, tumbling, and escaping bonds.</td></tr><tr><td>Deception</td><td>Lies, bluffs, and disguises.</td></tr><tr><td>Discipline</td><td>Mental fortitude; resisting fear and the Force.</td></tr><tr><td>Leadership</td><td>Directing and inspiring allies.</td></tr><tr><td>Mechanics</td><td>Repairs, modifications, and building gear.</td></tr><tr><td>Medicine</td><td>Healing wounds and treating Critical Injuries.</td></tr><tr><td>Negotiation</td><td>Deals, bargaining, and commerce.</td></tr><tr><td>Perception</td><td>Spotting and noticing details.</td></tr><tr><td>Piloting (Planetary)</td><td>Ground and atmospheric craft.</td></tr><tr><td>Piloting (Space)</td><td>Starships and space vehicles.</td></tr><tr><td>Resilience</td><td>Endurance, stamina, and resisting the elements.</td></tr><tr><td>Skulduggery</td><td>Locks, traps, and pickpocketing.</td></tr><tr><td>Stealth</td><td>Hiding and moving unseen.</td></tr><tr><td>Streetwise</td><td>Navigating the underworld and gathering rumors.</td></tr><tr><td>Survival</td><td>Wilderness travel, foraging, and handling beasts.</td></tr><tr><td>Vigilance</td><td>Alertness and surprise initiative.</td></tr></table><div class=\"ref-sub\">Knowledge Skills</div><table class=\"ref-table\"><tr><th>Skill</th><th>Used For</th></tr><tr><td>Core Worlds</td><td>The galaxy's central, wealthy, and civilized systems.</td></tr><tr><td>Education</td><td>Academics, history, science, and politics.</td></tr><tr><td>Lore</td><td>Myths, legends, and the Force and Jedi.</td></tr><tr><td>Outer Rim</td><td>Frontier worlds and lawless regions.</td></tr><tr><td>Underworld</td><td>Crime syndicates, black markets, and gangs.</td></tr><tr><td>Warfare</td><td>Tactics, militaries, and fortifications.</td></tr><tr><td>Xenology</td><td>Alien species, biology, and cultures.</td></tr></table>"
  },
  {
    "title": "Social Checks",
    "body": "<p class=\"ref-lead\">Pick the <strong>skill</strong> that matches your approach; the GM sets difficulty from the target's opposing skill or the situation.</p>\n<table class=\"ref-table\">\n<tr><th>Approach</th><th>Skill</th><th>Opposed by</th></tr>\n<tr><td>Friendly persuasion</td><td>Charm</td><td>Cool / Discipline</td></tr>\n<tr><td>Threats</td><td>Coercion</td><td>Discipline</td></tr>\n<tr><td>Lying</td><td>Deception</td><td>Discipline</td></tr>\n<tr><td>Bargaining</td><td>Negotiation</td><td>Negotiation / Cool</td></tr>\n<tr><td>Commanding</td><td>Leadership</td><td>Discipline / Cool</td></tr>\n<tr><td>Reading motives</td><td>Perception</td><td>Deception / Cool</td></tr>\n</table>\n<div class=\"ref-sub\">Outcomes</div>\n<table class=\"ref-table\">\n<tr><th>Result</th><th>Meaning</th></tr>\n<tr><td>@SUCCESS@ + @ADVANTAGE@</td><td>They agree and like you; extra leverage.</td></tr>\n<tr><td>@SUCCESS@ + @THREAT@</td><td>They agree, but at a cost.</td></tr>\n<tr><td>@FAILURE@ + @ADVANTAGE@</td><td>They refuse, but reveal something useful.</td></tr>\n<tr><td>@FAILURE@ + @THREAT@</td><td>They refuse and the situation worsens.</td></tr>\n<tr><td>@TRIUMPH@</td><td>Major concession or a new ally.</td></tr>\n<tr><td>@DESPAIR@</td><td>Betrayal, insult, or a trap.</td></tr>\n</table>"
  },
  {
    "title": "Obligation, Duty & Morality",
    "body": "<p class=\"ref-lead\">Each game line adds a <strong>character-defining mechanic</strong> that ties your hero to the wider story.</p>\n<div class=\"ref-sub\">Obligation (Edge of the Empire)</div>\n<p class=\"ref-p\">Debts hanging over you: bounties, addictions, family, favors, and oaths. At the start of a session the GM may roll to see if an Obligation triggers; when it does it usually lowers your strain threshold for that session.</p>\n<div class=\"ref-sub\">Duty (Age of Rebellion)</div>\n<p class=\"ref-p\">Your contribution to the Rebellion, such as Combat Victory, Intelligence, Sabotage, or Support. Rising Duty earns recognition, resources, and rank.</p>\n<div class=\"ref-sub\">Morality (Force and Destiny)</div>\n<p class=\"ref-p\">Your emotional strengths and weaknesses, tracked through Conflict. Conflict comes from cruelty, fear, anger, spending dark side pips, or selfish choices, and pushes you toward the light or dark side.</p>"
  },
  {
    "title": "The Force",
    "body": "<p class=\"ref-lead\">Your <strong>Force Rating</strong> sets how many @FORCE@ Force dice you roll.</p>\n<p class=\"ref-p\">Force dice generate @LIGHT@ light side and @DARK@ dark side pips. Light side users spend @LIGHT@ pips freely, and may use @DARK@ pips only by suffering strain, which also generates Conflict.</p>\n<div class=\"ref-sub\">Power Upgrades</div>\n<table class=\"ref-table\">\n<tr><th>Component</th><th>Effect</th></tr>\n<tr><td>Control</td><td>Changes how a power works.</td></tr>\n<tr><td>Range</td><td>Increases the power's range.</td></tr>\n<tr><td>Magnitude</td><td>Affects more targets.</td></tr>\n<tr><td>Strength</td><td>Increases the power's effect.</td></tr>\n<tr><td>Duration</td><td>Extends how long it lasts.</td></tr>\n</table>\n<div class=\"ref-sub\">Common Powers</div>\n<p class=\"ref-p\">Move, Sense, Influence, Enhance, Foresee, Heal/Harm, Protect/Unleash, Bind, and Misdirect.</p>"
  },
  {
    "title": "Starships & Vehicles",
    "body": "<p class=\"ref-lead\">Vehicles use the same dice, but on a much larger <strong>scale</strong>. Personal weapons rarely scratch a vehicle without the <strong>Breach</strong> quality or explosives.</p><table class=\"ref-table\"><tr><th>Stat</th><th>Meaning</th></tr><tr><td>Silhouette</td><td>Physical size of the craft</td></tr><tr><td>Speed</td><td>Maximum speed</td></tr><tr><td>Handling</td><td>@BOOST@ (positive) or @SETBACK@ (negative) to piloting checks</td></tr><tr><td>Defense</td><td>Shields, by zone</td></tr><tr><td>Armor</td><td>Vehicle-scale soak</td></tr><tr><td>Hull Trauma</td><td>Vehicle wounds</td></tr><tr><td>System Strain</td><td>Vehicle strain</td></tr><tr><td>Hard Points</td><td>Capacity for modifications and weapons</td></tr></table><div class=\"ref-tables-2\"><table class=\"ref-table\"><tr><th>Maneuvers</th></tr><tr><td>Accelerate / Decelerate</td></tr><tr><td>Fly / Drive</td></tr><tr><td>Evasive Maneuvers <small>harder to hit, but harder to attack from</small></td></tr><tr><td>Stay on Target <small>easier to attack, but easier to be hit</small></td></tr><tr><td>Punch It</td></tr><tr><td>Angle Deflector Shields</td></tr></table><table class=\"ref-table\"><tr><th>Actions</th></tr><tr><td>Attack with Gunnery</td></tr><tr><td>Gain the Advantage</td></tr><tr><td>Damage Control</td></tr><tr><td>Plot Course</td></tr><tr><td>Copilot</td></tr><tr><td>Slice Enemy Systems</td></tr><tr><td>Scan the Enemy</td></tr></table></div><p class=\"ref-p\">Because vehicle scale dwarfs personal scale, a blaster does almost nothing to a starship. Use vehicle-scale weapons, or gear with <strong>Breach</strong> or the <strong>Blast</strong> of explosives, to threaten a hull.</p>"
  },
  {
    "title": "Gear & Advancement",
    "body": "<div class=\"ref-sub\">Encumbrance</div><p class=\"ref-p\">You can carry gear up to your <strong>encumbrance threshold</strong> (based on Brawn, adjusted by gear and talents). Exceed it and you suffer @SETBACK@ to physical checks or take strain to keep moving.</p><div class=\"ref-sub\">Buying Gear</div><p class=\"ref-p\">Every item has a <strong>Price</strong>, a <strong>Rarity</strong>, and may be <strong>Restricted</strong> (illegal to own). Tracking down rare or restricted gear calls for <strong>Streetwise</strong>, <strong>Negotiation</strong>, <strong>Knowledge (Underworld)</strong>, or the right contacts.</p><div class=\"ref-sub\">Spending XP</div><table class=\"ref-table\"><tr><th>Purchase</th><th>Notes</th></tr><tr><td>Skill Ranks</td><td>Cheaper for career skills</td></tr><tr><td>Talents</td><td>Bought in order through a specialization tree</td></tr><tr><td>New Specialization</td><td>Costs extra to enter the tree</td></tr><tr><td>Force Powers</td><td>Requires a Force rating</td></tr><tr><td>Characteristics</td><td>Usually raised only at character creation</td></tr></table><p class=\"ref-p\">Your <strong>career</strong> sets your career skills; each <strong>specialization</strong> grants a talent tree. A character can own more than one specialization.</p>"
  },
  {
    "title": "GM Quick Tools",
    "body": "<p class=\"ref-lead\">Fast rulings for setting a check on the fly. Tune the pool with <strong>@BOOST@</strong> and <strong>@SETBACK@</strong>, upgrade for stakes, then let the symbols narrate.</p><div class=\"ref-sub\">Dial the Pool</div><table class=\"ref-table\"><tr><th>Adjust</th><th>When</th></tr><tr><td>Add @BOOST@</td><td>good tools or plan, help from an ally, distracted target, favorable environment, prior @ADVANTAGE@ set it up</td></tr><tr><td>Add @SETBACK@</td><td>darkness/smoke/rain, poor footing, bad tools, injury or fear, loud or rushed conditions, target has cover, missing key info</td></tr><tr><td>Upgrade difficulty</td><td>failure would be dangerous, a highly trained or Adversary foe, a reckless attempt, a Destiny Point is spent, a @DESPAIR@-worthy consequence is possible</td></tr></table><div class=\"ref-sub\">Table Rulings</div><p class=\"ref-p\">To resolve any action, set five things: <strong>Skill</strong>, <strong>Characteristic</strong>, <strong>Difficulty</strong>, @BOOST@/@SETBACK@, and consequences for @THREAT@/@DESPAIR@.</p><p class=\"ref-p\"><strong>Helping.</strong> Skilled assistance combines one character's better characteristic with the other's better skill ranks. Unskilled assistance simply adds a @BOOST@.</p><p class=\"ref-p\"><strong>Advantage.</strong> @ADVANTAGE@ can make small facts true (\"there's a control panel nearby\", \"the crate gives cover\") but not solve the plot (\"the villain dies\"). Save big effects for @TRIUMPH@ or Destiny.</p><div class=\"ref-sub\">Guiding Principle</div><p class=\"ref-p\">A success with @THREAT@ still succeeds, with a complication; a failure with @ADVANTAGE@ still fails, with a consolation. Every roll should move the scene.</p>"
  }
];

  function dieItem(d) {
    return `<div class="ref-item"><span class="es" style="color:${d.color}">${d.letter}</span>
      <div><div class="ref-item-name">${d.name}</div><div class="ref-item-desc">${d.role}</div></div></div>`;
  }
  function symItem(glyph, name, desc) {
    return `<div class="ref-item">${glyph}
      <div><div class="ref-item-name">${name}</div><div class="ref-item-desc">${desc}</div></div></div>`;
  }
  function panel(title, inner) {
    return `<div class="sheet-panel"><div class="sheet-panel-title">${title}</div>${inner}</div>`;
  }

  function render(container) {
    const dice = panel('The Narrative Dice', `
      <p class="ref-lead">A check mixes <strong>positive</strong> dice (your side) with <strong>negative</strong> dice (the opposition). Roll them all together, cancel matching symbols, and read what is left.</p>
      <div class="ref-sub">Positive Dice &ndash; Your Side</div>
      <div class="ref-legend">${DICE_POS.map(dieItem).join('')}</div>
      <div class="ref-sub">Negative Dice &ndash; The Opposition</div>
      <div class="ref-legend">${DICE_NEG.map(dieItem).join('')}</div>
      <div class="ref-sub">Special</div>
      <div class="ref-legend">${dieItem(DIE_FORCE)}</div>`);

    const symbols = panel('Reading the Symbols', `
      <p class="ref-lead">Every positive symbol cancels one of its negative twin. Whatever survives is the outcome.</p>
      <div class="ref-legend">
        ${symItem(SUC(), 'Success', 'Cancels Failure. One or more left over means the check succeeds.')}
        ${symItem(FAI(), 'Failure', 'Cancels Success. If Failures win out, the check fails.')}
        ${symItem(ADV(), 'Advantage', 'Cancels Threat. Spend it on good side effects, win or lose.')}
        ${symItem(THR(), 'Threat', 'Cancels Advantage. The GM spends it on complications.')}
        ${symItem(TRI(), 'Triumph', 'Counts as a Success and triggers something great. Never cancelled.')}
        ${symItem(DES(), 'Despair', 'Counts as a Failure and triggers something terrible. Never cancelled.')}
      </div>
      <p class="ref-p"><strong>Success</strong> ${i(SUC)} and <strong>Failure</strong> ${i(FAI)} decide whether you do the thing. <strong>Advantage</strong> ${i(ADV)} and <strong>Threat</strong> ${i(THR)} are side effects that land either way. A single <strong>Triumph</strong> ${i(TRI)} or <strong>Despair</strong> ${i(DES)} can turn a scene on its own.</p>`);

    const extra = SECTIONS.map(s => panel(s.title, fmt(s.body))).join('');

    container.innerHTML = `
      <div class="step-header"><h2>Quick Reference</h2>
        <p>The basic rules at a glance. Symbols use the Edge of the Empire dice font.</p></div>
      <div class="ref-root">${dice}${symbols}${extra}</div>`;
  }

  return { render, symbols };
})();
