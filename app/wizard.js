'use strict';

const Wizard = (() => {
  // ── State ─────────────────────────────────────────────────────────────────
  function defaultState() {
    return {
      step: 0,
      game: null,
      speciesKey: null,
      careerKey: null,
      specKey: null,
      characteristics: null,
      freeCareerSkillPicks: [],
      name: '',
      player: '',
      background: '',
      motivation: '',
      obligation: { type: '', magnitude: 10 },
      duty:       { type: '', magnitude: 10 },
      morality:   { strength: '', weakness: '', score: 50 },
    };
  }

  let state = defaultState();

  // UI-only filter state for the species step (persists across re-renders)
  let _spBook       = '';
  let _spArchetypes = new Set();

  function saveState() {
    try { localStorage.setItem('sw_char_v1', JSON.stringify(state)); } catch(e) {}
  }

  function loadState() {
    try {
      const s = localStorage.getItem('sw_char_v1');
      if (s) state = Object.assign(defaultState(), JSON.parse(s));
    } catch(e) {}
  }

  // ── Game definitions ───────────────────────────────────────────────────────
  const GAMES = {
    eote: {
      name: 'Edge of the Empire',
      desc: 'Scoundrels, bounty hunters, and smugglers surviving on the galactic fringe.',
      color: 'eote',
      careers: ['Ace','Bounty Hunter','Colonist','Explorer','Hired Gun','Smuggler','Technician'],
      mechanic: 'Obligation',
    },
    aor: {
      name: 'Age of Rebellion',
      desc: 'Rebel soldiers and spies fighting the tyranny of the Galactic Empire.',
      color: 'aor',
      careers: ['Commander','Diplomat','Engineer','Soldier','Spy'],
      mechanic: 'Duty',
    },
    fad: {
      name: 'Force and Destiny',
      desc: 'Force-sensitives seeking purpose and balance in a dark galaxy.',
      color: 'fad',
      careers: ['Consular','Guardian','Mystic','Seeker','Sentinel','Warrior'],
      mechanic: 'Morality',
    },
  };

  // ── Specialization flavor blurbs ──────────────────────────────────────────
  const SPEC_BLURBS = {
    // Ace
    beast_rider:      'Bond with and ride exotic creatures as mounts and weapons, turning the living world into an arsenal.',
    driver:           'Master ground vehicles and airspeeders, turning any craft into a high-speed tactical weapon.',
    gunner:           'Operate vehicle weapons with devastating accuracy, maximizing damage output from any gun platform.',
    hotshot:          'Push ships and vehicles past their rated limits, pulling off maneuvers no sane pilot would attempt.',
    pilot:            'Exceptional starship pilots who handle any spacefaring challenge with ease and pure instinctive skill.',
    rigger:           'Jury-rig and heavily modify vehicles on the fly, squeezing impossible performance out of any craft.',
    // Bounty Hunter
    assassin:         'Silent and precise killers who strike from shadows, specializing in ending targets cleanly and quietly.',
    gadgeteer:        'Trap-layers and gear junkies who solve problems with custom gadgets and prepared surprises.',
    martial_artist:   'Unarmed combat masters who hit harder than blasters and move faster than most eyes can follow.',
    operator:         'Vehicle-mounted hunters who specialize in chasing, intercepting, and apprehending moving targets.',
    skip_tracer:      'Investigators who find anyone anywhere using connections, pressure, and relentless resourcefulness.',
    survivalist:      'Hardened survivors who endure punishment that would kill others and outlast opponents over time.',
    // Clone Soldier
    arc_trooper:      'Elite Clone commandos trained for the most dangerous solo and small-team special operations missions.',
    clone_commander:  'Field commanders who lead Clone units with tactical precision and unwavering battlefield authority.',
    clone_officer:    'Officers who direct Clone forces with leadership and strategic sense across the engagement.',
    clone_pilot:      'Clone-trained starfighter and gunship pilots who dominate aerospace and atmospheric combat.',
    clone_trooper:    'The backbone of the Republic army -- bred from birth for disciplined combined-arms warfare.',
    clone_veteran:    'Battle-hardened Clones whose campaign experience has forged unique instincts and hard-won skills.',
    // Colonist
    doctor:           'Skilled physicians who keep allies alive under fire and patch wounds that would end most careers.',
    entrepreneur:     'Savvy operators who deal in information, favors, and credits -- always knowing who to call.',
    marshal:          'Frontier lawkeepers who enforce order in lawless places through authority and a very quick draw.',
    performer:        'Entertainers who use performance and charm as tools just as dangerous as any blaster.',
    politico:         'Political operators who leverage social networks and careful words to get exactly what they want.',
    scholar:          'Experts who turn deep knowledge into tactical advantage -- the right fact at the right moment changes everything.',
    // Commander
    commodore:        'Naval commanders who control fleet engagements and turn battles through superior positioning.',
    figurehead:       'Inspiring leaders whose presence alone lifts ally performance and shapes morale under pressure.',
    instructor:       'Trainers who make everyone around them better by sharing skills and lifting the whole group.',
    squadron_leader:  'Fighter wing leaders who coordinate starfighter groups and dominate dogfights through teamwork.',
    strategist:       'Big-picture planners who outthink opponents before the battle starts by controlling information and timing.',
    tactician:        'On-the-ground combat directors who adapt mid-battle and exploit every opportunity as it emerges.',
    // Consular
    arbiter:          'Conflict resolvers who mediate disputes and turn enemies into reluctant allies through Force-aided insight.',
    ascetic:          'Minimalists who shed worldly attachments to develop extraordinary mental and Force discipline.',
    healer:           'Force-sensitive healers who mend wounds, clear minds, and keep companions fighting at full strength.',
    niman_disciple:   'Balanced Force users who blend lightsaber combat with Force powers into a fluid, adaptable style.',
    sage:             'Seekers of Force wisdom who use deep knowledge of the Force to see clearly and act with precision.',
    teacher:          'Mentors who accelerate the growth of allies and help build the next generation of Force talent.',
    // Diplomat
    advocate:         'Legal and moral champions who win arguments, protect allies, and turn opinion with the right words.',
    agitator:         'Rabble-rousers who inspire resistance movements, sow dissent, and ignite rebellion from the ground up.',
    ambassador:       'Formal diplomatic representatives who navigate high-stakes negotiations and forge critical alliances.',
    analyst:          'Intelligence specialists who gather, process, and weaponize information against their opponents.',
    propagandist:     'Master storytellers who shape narratives, control perception, and turn public opinion into a weapon.',
    quartermaster:    'Supply experts who ensure allies are always equipped, resourced, and ready for the next operation.',
    // Engineer
    droid_specialist: 'Command squads of droids as tactical assets, keeping them operational under any condition.',
    mechanic:         'Field engineers who keep ships and vehicles running against all odds through improvisation and raw skill.',
    saboteur:         'Demolitions and sabotage experts who dismantle enemy infrastructure silently from the inside out.',
    sapper:           'Combat engineers who use explosives, traps, and environmental destruction to control the battlefield.',
    scientist:        'Researchers who apply theoretical knowledge to create new solutions, devices, and tactical options.',
    shipwright:       'Starship designers and modifiers who push vessel performance far beyond factory specifications.',
    // Explorer
    archaeologist:    'Academic adventurers who unearth ancient secrets and artifacts that could change the galaxy.',
    big_game_hunter:  'Trophy hunters who track, trap, and take down the most dangerous creatures in the known galaxy.',
    fringer:          'Adaptable survivors who thrive on the frontier by knowing everyone, finding anything, and fearing nothing.',
    scout:            'Forward observers who gather intelligence, survive in the wild, and always find the fastest route through.',
    trader:           'Deal-making merchants who turn commercial connections and trade routes into real operational advantages.',
    // Guardian
    armorer:          'Craftspeople who forge and modify armor and weapons, turning equipment into a decisive tactical edge.',
    peacekeeper:      'Force-sensitive officers who maintain order, deescalate conflict, and project authority with the Force.',
    protector:        'Dedicated shields who absorb punishment for others and ensure those in their care survive anything.',
    soresu_defender:  'Masters of Soresu -- the ultimate defensive lightsaber form, nearly impossible to break through.',
    warden:           'Guardians who control environments and restrain opponents, turning terrain itself into a weapon.',
    warleader:        'Battlefield commanders who direct allies with Force-enhanced leadership and tactical precision.',
    // Hired Gun
    bodyguard:        'Personal protection specialists who keep clients alive through anticipation and controlled aggression.',
    demolitionist:    'Explosives experts who never met a problem that couldn\'t be solved with the right shaped charge.',
    enforcer:         'Intimidating operatives who get results through physical presence, pain, and the threat of more.',
    heavy:            'Weapon platforms who carry and operate the biggest, most destructive firearms credits can buy.',
    marauder:         'Melee fighters who wade into chaos and turn close-quarters carnage into their natural advantage.',
    mercenary_soldier:'Professional fighters who apply military training to freelance work -- flexible, lethal, and for hire.',
    // Jedi
    general:          'Jedi who lead armies and coordinate large-scale battles, blending Force ability with military command.',
    knight:           'Versatile Jedi who balance combat skill with Force ability -- the well-rounded core of the old Order.',
    master:           'The pinnacle of Jedi development -- wisdom, power, and control earned over a lifetime of service.',
    padawan:          'Force-sensitive students taking first steps down the path, raw with potential and hungry to grow.',
    temple_guardian:  'Warrior Jedi who defended the Temple itself, combining combat power with absolute dedication.',
    // Mystic
    advisor:          'Force-sensitive counselors who sense deception, read currents of fate, and guide others with wisdom.',
    alchemist:        'Dark practitioners who channel the Force into physical substances, creating effects no lab could replicate.',
    magus:            'Force mystics who project power outward dramatically, bending reality through focused will.',
    makashi_duelist:  'Elegant lightsaber duelists who use the precise Makashi form to dismantle opponents cut by cut.',
    prophet:          'Seers who peer into the currents of the future, turning foresight into tactical and personal advantage.',
    seer:             'Force-sensitives who read the present and near-future with uncanny clarity, always one step ahead.',
    // Seeker
    ataru_striker:    'Acrobatic lightsaber fighters who use kinetic Ataru speed and power to overwhelm opponents.',
    executioner:      'Force-guided hunters who eliminate high-value targets with cold precision and lethal efficiency.',
    hermit:           'Isolated Force mystics whose detachment from society has deepened their link to the living Force.',
    hunter:           'Predatory Force-users who stalk prey through wild places with tracking skill and Force-enhanced senses.',
    navigator:        'Force-sensitive pathfinders who chart impossible routes and find safe passage through any danger.',
    pathfinder:       'Trail-blazers who lead expeditions into the unknown, surviving any terrain and outlasting any challenge.',
    // Sentinel
    artisan:          'Force-sensitive crafters who channel the Force into building and modifying items with remarkable results.',
    investigator:     'Detectives who combine Force senses with sharp intellect to expose lies and catch culprits.',
    racer:            'Speed-focused pilots who push vehicles to the absolute edge through Force-honed reflexes.',
    sentry:           'Vigilant guardians who never miss a threat and make infiltrating their protected area nearly impossible.',
    shadow:           'Covert Force operatives who blend Jedi ability with infiltration and assassination in service of balance.',
    shien_expert:     'Masters of Shien -- the lightsaber form designed to redirect blaster fire and punish ranged attackers.',
    // Smuggler
    blockade_runner:  'Daredevils who specialize in slipping through Imperial blockades with contraband and nerve.',
    charmer:          'Silver-tongued operators who talk their way into and out of anything with irresistible charisma.',
    gambler:          'Odds-readers who apply risk calculation to every situation -- they always know when to fold or go all in.',
    gunslinger:       'Quick-draw artists who end fights in seconds with speed and accuracy most blasters can\'t match.',
    scoundrel:        'Jack-of-all-trades criminals who combine dirty tricks, cunning, and adaptability to survive anything.',
    thief:            'Expert burglars and pickpockets who can steal anything from anyone without leaving a trace.',
    // Soldier
    commando:         'Special forces operatives who execute high-risk missions deep behind enemy lines with brutal efficiency.',
    medic:            'Combat medics who patch wounds mid-firefight and keep the squad operational against all odds.',
    sharpshooter:     'Precision marksmen who eliminate threats from extreme range before enemies know they\'re targeted.',
    trailblazer:      'Advance scouts who find paths through any terrain and set conditions for everyone who follows.',
    vanguard:         'Shock troops who punch through enemy lines and establish footholds in the most dangerous situations.',
    // Spy
    courier:          'Information brokers who move sensitive data and personnel through hostile territory undetected.',
    infiltrator:      'Deep-cover agents who slip into enemy organizations and extract intelligence from the inside.',
    interrogator:     'Specialists at breaking down resistance and extracting truth from subjects who refuse to talk.',
    sleeper_agent:    'Long-term embedded operatives who maintain covers for years, activated only for a decisive moment.',
    slicer:           'Hackers who breach any system, steal any data, and can bring entire networks crashing down.',
    // Technician
    cyber_tech:       'Cybernetics experts who enhance themselves and allies with implants that push past biological limits.',
    droid_tech:       'Droid mechanics who build, repair, and optimize automations as loyal and lethal companions.',
    modder:           'Weapons and gear modifiers who upgrade equipment to peak performance and well beyond factory specs.',
    outlaw_tech:      'Black-market engineers who build custom illegal tech and find creative solutions to any problem.',
    // Warrior
    aggressor:        'Relentless Force-enhanced combatants who overwhelm opponents through raw power and sustained pressure.',
    colossus:         'Force-powered juggernauts who absorb enormous punishment and dish it back with devastating force.',
    juyo_berserker:   'Masters of the ferocious Juyo form who channel pure aggression into overwhelming offensive fury.',
    shii_cho_knight:  'Practitioners of the oldest lightsaber form -- deceptively simple and brutally effective.',
    starfighter_ace:  'Force-sensitive pilots who blend exceptional flying instincts with Force-enhanced reflexes.',
    steel_hand_adept: 'Unarmed Force fighters who channel power through their body for devastating, weapon-free strikes.',
    // Careerless / Cross-game
    acolyte:              'Dark side initiates taking first steps down a dangerous path -- raw in power but lacking control.',
    blademaster:          'Devoted melee experts who have mastered multiple combat forms beyond any single tradition.',
    cartel_dealer:        'Criminal fixers who trade in favors, contraband, and connections across the underworld.',
    dark_side_cultist:    'Devotees of the dark side who pursue power through fear, rage, and forbidden Force practices.',
    death_watch_warrior:  'Mandalorian zealots who honor warrior traditions through skill, armor, and unwavering violence.',
    force_adherent:       'Non-Jedi Force-sensitives who follow their own path outside any established Order or tradition.',
    force_sensitive_exile:'Force-users in hiding who have suppressed their abilities to survive Imperial persecution.',
    force_sensitive_emergent: 'Newly awakened Force-sensitives only beginning to understand what they are capable of.',
    force_sensitive_outcast:  'Untrained Force-users who have developed raw, unguided abilities through instinct and necessity.',
    gladiator:            'Arena fighters who turned combat performance into an art form and a career built on spectacle.',
    imperial_academy_cadet:   'Imperial military trainees who embrace discipline, hierarchy, and the Emperor\'s ideals.',
    imperial_loyalist:    'True believers in the Empire who have internalized its ideology and act as its most effective instrument.',
    jedi_archivist:       'Keepers of Jedi knowledge who protect and expand the Order\'s records, history, and teachings.',
    jedi_explorer:        'Wandering Jedi who explored the Unknown Regions, recording species, relics, and Force phenomena.',
    jedi_wayseeker:       'Independent Jedi who operate without Master or Padawan, guided solely by the Force\'s will.',
    lord:                 'Dark side aristocrats who dominate others through fear, power, and the absolute authority of the Sith.',
    mandalorian_crusader: 'Ancient-tradition Mandalorians who fight to preserve their culture and prove their warrior heritage.',
    nightsister:          'Force witches of Dathomir who wield dark-side magick as a birthright passed through generations.',
    padawan_survivor:     'Jedi students who survived Order 66 and are quietly rebuilding their connection to the Force.',
    pirate:               'Raiders of the spacelanes who board, plunder, and vanish before any authority can respond.',
    recruit:              'Fresh volunteers just beginning their service with everything still to prove.',
    republic_diplomat:    'Representatives of the Republic who pursue diplomacy and law on behalf of the Galactic Senate.',
    scavenger:            'Scrap hunters who make a living picking through wreckage, finding value where others see only ruin.',
    seasoned_adventurer:  'Veterans of countless scrapes whose broad experience gives a practical edge in any situation.',
    senator:              'Political leaders who shape galactic policy and fight institutional battles from the halls of the Senate.',
    separatist_commander: 'CIS commanders who led Separatist forces and still believe in the ideals of independence.',
    ship_captain:         'Veteran starship commanders who know their vessels intimately and lead crews through anything.',
    sorcerer:             'Dark side practitioners who wield ancient and terrible Force powers that few alive can understand.',
  };

  // ── Career flavor blurbs ─────────────────────────────────────────────────
  const CAREER_BLURBS = {
    THEACE:      'Pilots, hot-shot drivers, and expert operators who live for the thrill of the cockpit. If it flies, rolls, or shoots, this is their domain.',
    BOUNT:       'Relentless trackers who make their living finding people who don\'t want to be found. Adaptable, dangerous, and they always get their mark.',
    CLONE:       'Bred for battle and unwavering in discipline, carrying the legacy of the Republic\'s clone armies. Warriors of identical origin, each forging a unique path.',
    COLO:        'Merchants, doctors, diplomats, and scholars who built civilization at the edge of known space. When fists fall short, words and credits do the work.',
    COMMANDER:   'Military leaders who win battles through strategy, inspiration, and sheer force of will. They shape the outcome before the first shot is ever fired.',
    CONSULAR:    'Force-sensitive peacekeepers who trust wisdom and the light side over conflict. Their greatest weapon is understanding.',
    DIPLOMAT:    'Advocates and negotiators who fight tyranny with words, alliances, and precisely applied pressure. The pen is mightier than the blaster.',
    ENGINEER:    'Technical wizards who keep the Rebellion running by fixing ships, building weapons, and jury-rigging solutions under impossible conditions.',
    EXPLORER:    'Scouts and wanderers driven to chart the galaxy\'s unexplored reaches. They go where others won\'t and come back with something priceless.',
    GUARD:       'Force-sensitive protectors devoted to shielding the innocent and confronting evil head-on. They stand between danger and those who cannot defend themselves.',
    HIREDGUN:    'Mercenaries and bodyguards who fight for credits rather than causes. Hard to kill, dangerous to cross, and always expensive to hire.',
    JEDI:        'Ancient defenders of peace and justice who wield the Force and a lightsaber with discipline and purpose. Even in exile, the Order endures.',
    MYSTIC:      'Force-sensitives drawn to the galaxy\'s deeper mysteries, seeking truth through ancient lore, visions, and inner reflection.',
    SEEKER:      'Force-sensitive wanderers guided by instinct and the living Force rather than maps or orders, most at home in the galaxy\'s wild places.',
    SENTINEL:    'Covert Force-users who operate in the shadows, blending martial training with slicing, subterfuge, and precisely applied Force abilities.',
    SMUG:        'Scoundrels who navigate the gray market with charm and cunning, and have a talent for being somewhere else when trouble finally arrives.',
    SOLDIER:     'The backbone of the Alliance\'s ground forces. Disciplined fighters who master weapons, tactics, and survival when the blasters start flying.',
    SPY:         'Intelligence operatives who gather secrets, plant misinformation, and vanish without a trace. The Rebellion knows what it knows because of them.',
    TECHNICIAN:  'Slicers, mechanics, and inventors who bend technology to their will. No lock is too secure, no machine too broken, no gadget too exotic.',
    WAR:         'Force-sensitives who channel their power directly into combat, achieving a perfect synthesis of physical prowess and Force-driven martial excellence.',
  };

  // ── Archetypes ────────────────────────────────────────────────────────────
  const ARCHETYPES = [
    { key: 'balanced',  label: 'Jack of All Trades',      abbr: '' },
    { key: 'brawn',     label: 'Strong & Burly',          abbr: 'BR' },
    { key: 'agility',   label: 'Dexterous & Swift',       abbr: 'AG' },
    { key: 'intellect', label: 'Knowledgeable & Bright',  abbr: 'INT' },
    { key: 'cunning',   label: 'Clever & Underhanded',    abbr: 'CUN' },
    { key: 'willpower', label: 'Confident & Stubborn',    abbr: 'WIL' },
    { key: 'presence',  label: 'Inspiring & In-Touch',    abbr: 'PR' },
  ];

  // ── Tooltip data ──────────────────────────────────────────────────────────
  const SKILL_DESCS = {
    'Astrogation':           'Plan hyperspace jumps and navigate between star systems.',
    'Athletics':             'Run, jump, climb, swim, and perform feats of physical endurance.',
    'Brawl':                 'Unarmed combat: punches, kicks, grappling, and improvised strikes.',
    'Charm':                 'Persuade through likability, flattery, and personal appeal.',
    'Coercion':              'Intimidate, threaten, and force compliance through fear or pain.',
    'Computers':             'Slice systems, hack networks, and interface with computers.',
    'Cool':                  'Stay calm under pressure and act first in social conflicts.',
    'Coordination':          'Acrobatics, balance, contortion, and nimble physical maneuvers.',
    'Core Worlds':           'Politics, culture, history, and geography of the inner galaxy.',
    'Deception':             'Lie convincingly, bluff, and create false impressions.',
    'Discipline':            'Resist fear, mental coercion, and stay focused under stress.',
    'Education':             'Broad formal academic knowledge across scholarly fields.',
    'Gunnery':               'Operate vehicle-mounted and starship weapon systems.',
    'Leadership':            'Inspire, direct, and command allies and groups effectively.',
    'Lightsaber':            'Wield a lightsaber in combat. Uses Brawn as its characteristic.',
    'Lore':                  'Ancient history, legends, Force lore, and obscure knowledge.',
    'Mechanics':             'Repair, modify, and build mechanical and electronic devices.',
    'Medicine':              'Treat wounds, diagnose illness, and perform surgery.',
    'Melee':                 'Armed close-quarters combat with hand-held weapons.',
    'Negotiation':           'Strike deals, barter prices, and reach mutually beneficial agreements.',
    'Outer Rim':             'Fringe worlds, criminal territories, and outer-rim geography.',
    'Perception':            'Notice hidden things, detect ambushes, and spot important details.',
    'Piloting - Planetary':  'Pilot landspeeders, airspeeders, and atmospheric craft.',
    'Piloting - Space':      'Pilot starships and space vessels through the void.',
    'Ranged - Heavy':        'Fire large blasters, rifles, and heavy ranged weapons.',
    'Ranged - Light':        'Fire pistols, hold-outs, and light ranged weapons.',
    'Resilience':            'Endure physical hardship, resist toxins, and shake off strain.',
    'Skulduggery':           'Pick locks, pickpocket, palm objects, and defeat security systems.',
    'Stealth':               'Move silently, hide in shadows, and avoid detection.',
    'Streetwise':            'Navigate city underworlds, find contacts, and gather street intel.',
    'Survival':              'Forage, track, navigate wilderness, and endure harsh environments.',
    'Underworld':            'Criminal organizations, black markets, and illegal operations.',
    'Vigilance':             'Stay alert, detect danger, and act first in ambushes.',
    'Xenology':              'Knowledge of alien species, cultures, biology, and history.',
    'Warfare':               'Military history, strategy, tactics, and organizational doctrine.',
  };

  const TALENT_DESCS = {
    'Black Market Contacts':   'Remove up to 2 setback dice per rank from checks to acquire illegal or restricted goods.',
    'Bypass Security':         'Remove 1 setback die per rank from checks to disable security devices or open locks.',
    'Confidence':              'Reduce the difficulty of fear checks by 1 per rank; may ignore fear checks entirely at rank 5.',
    'Convincing Demeanor':     'Remove 1 setback die per rank from Deception and Skulduggery checks.',
    'Durable':                 'Reduce the result of Critical Injury rolls by 10 per rank (minimum 1).',
    'Enduring':                'Permanently increase Soak Value by 1 per rank.',
    'Expert Tracker':          'Remove 1 setback die per rank from Survival checks when tracking; halve time required per rank.',
    'Eye for Detail':          'On a Triumph in Mechanics or Computers, gain 1 free maneuver without strain cost.',
    'Inventor':                'Gain 1 advantage per rank on crafting checks; reduce crafted item rarity by 1 per rank.',
    'Iron Body':               'Upgrade the ability of unarmed Brawl checks once per rank.',
    'Kill With Kindness':      'Remove 1 setback die per rank from Charm and Leadership checks.',
    'Kill with Kindness':      'Remove 1 setback die per rank from Charm and Leadership checks.',
    'Knowledge Specialization':'Choose a Knowledge skill; reduce its difficulty by 1 per rank (minimum 0).',
    'Physical Training':       'Add 1 rank per rank to Athletics and Resilience, even beyond normal limits.',
    'Researcher':              'Remove 1 setback die per rank from Knowledge checks; halve research time per rank.',
  };

  // ── Tooltip engine ────────────────────────────────────────────────────────
  let _tooltipEl = null;
  let _tooltipHideTimer = null;

  function ensureTooltip() {
    if (_tooltipEl) return _tooltipEl;
    _tooltipEl = document.createElement('div');
    _tooltipEl.id = 'sw-tooltip';
    _tooltipEl.className = 'sw-tooltip';
    _tooltipEl.style.display = 'none';
    document.body.appendChild(_tooltipEl);
    _tooltipEl.addEventListener('mouseenter', () => clearTimeout(_tooltipHideTimer));
    _tooltipEl.addEventListener('mouseleave', hideTooltip);
    return _tooltipEl;
  }

  function showTooltip(anchor, html) {
    clearTimeout(_tooltipHideTimer);
    const tt = ensureTooltip();
    tt.innerHTML = html;
    tt.style.display = 'block';
    tt.style.opacity = '0';
    // Position after paint so we know tt dimensions
    requestAnimationFrame(() => {
      const ar = anchor.getBoundingClientRect();
      const tw = tt.offsetWidth, th = tt.offsetHeight;
      const vw = window.innerWidth, vh = window.innerHeight;
      let top  = ar.bottom + window.scrollY + 6;
      let left = ar.left   + window.scrollX;
      if (left + tw > vw - 10) left = vw - tw - 10;
      if (top  + th > vh + window.scrollY - 10) top = ar.top + window.scrollY - th - 6;
      tt.style.top  = top  + 'px';
      tt.style.left = left + 'px';
      tt.style.opacity = '1';
    });
  }

  function hideTooltip() {
    _tooltipHideTimer = setTimeout(() => {
      if (_tooltipEl) _tooltipEl.style.display = 'none';
    }, 120);
  }

  function tooltipContent(type, name, spKey) {
    if (type === 'skill') {
      const sk = SW.skills.find(s => s.name.toLowerCase() === name.toLowerCase()) ||
                 SW.skills.find(s => Engine.normSkillName(s.name) === Engine.normSkillName(name));
      const char = sk ? sk.characteristic : '';
      const skType = sk ? sk.type : '';
      const desc  = SKILL_DESCS[sk ? sk.name : name] || SKILL_DESCS[name] || '';
      return `<div class="tt-title">${name}</div>
              <div class="tt-meta">${char} &bull; ${skType} Skill</div>
              ${desc ? `<div class="tt-body">${desc}</div>` : ''}`;
    }
    if (type === 'talent') {
      const tal = SW.talents.find(t => t.name.toLowerCase() === name.toLowerCase());
      const meta = tal ? `${tal.activation} &bull; ${tal.ranked ? 'Ranked' : 'Not Ranked'}` : '';
      const desc = tal ? tal.description || '' : '';
      const isPageRef = desc.toLowerCase().startsWith('please see page');
      return `<div class="tt-title">${name}</div>
              ${meta ? `<div class="tt-meta">${meta}</div>` : ''}
              ${desc && !isPageRef ? `<div class="tt-body">${desc}</div>` : ''}
              ${desc && isPageRef ? `<div class="tt-body tt-ref">${desc}</div>` : ''}`;
    }
    if (type === 'ability') {
      const sp = SW.species.find(s => s.key === spKey);
      if (!sp) return `<div class="tt-title">${name}</div>`;
      const full = sp.special_abilities.find(a => {
        const colon = a.indexOf(':');
        return colon > 0 && a.slice(0, colon).trim().toLowerCase() === name.toLowerCase();
      });
      const body = full ? full.slice(full.indexOf(':') + 1).trim() : '';
      return `<div class="tt-title">${name}</div>
              ${body ? `<div class="tt-body">${body}</div>` : ''}`;
    }
    return `<div class="tt-title">${name}</div>`;
  }

  function initTipListeners(container) {
    container.addEventListener('mouseenter', e => {
      const link = e.target.closest('[data-tip-type]');
      if (!link) return;
      showTooltip(link, tooltipContent(link.dataset.tipType, link.dataset.tipName, link.dataset.tipSp));
    }, true);
    container.addEventListener('mouseleave', e => {
      if (e.target.closest('[data-tip-type]')) hideTooltip();
    }, true);
    container.addEventListener('click', e => {
      const link = e.target.closest('[data-tip-type]');
      if (!link) return;
      const tt = ensureTooltip();
      if (tt.style.display !== 'none') { hideTooltip(); return; }
      showTooltip(link, tooltipContent(link.dataset.tipType, link.dataset.tipName, link.dataset.tipSp));
    });
  }

  function tipLink(type, name, spKey, label) {
    const sp = spKey ? ` data-tip-sp="${spKey}"` : '';
    return `<span class="tip-link" data-tip-type="${type}" data-tip-name="${name}"${sp}>${label || name}</span>`;
  }

  function getArchetype(sp) {
    const vals = Engine.CHAR_STATS.map(st => sp[st] || 0);
    const max = Math.max(...vals), min = Math.min(...vals);
    if (max - min <= 1) return 'balanced';
    for (let i = 0; i < Engine.CHAR_STATS.length; i++) {
      if (vals[i] === max) return Engine.CHAR_STATS[i];
    }
    return 'balanced';
  }

  function sourceBookName(raw) {
    const s = raw.replace(/\s*\(Page[^)]*\)/g, '').trim();
    const core = s.match(/Star Wars (.+?) Roleplaying Game: Core Rulebook/);
    if (core) return core[1] + ' Core Rulebook';
    const colon = s.indexOf(':');
    return colon > 0 ? s.slice(0, colon).trim() : s;
  }

  function getAllBooks() {
    const seen = new Set();
    const books = [];
    for (const sp of SW.species) {
      for (const src of (sp.sources || [])) {
        const name = sourceBookName(src);
        if (!seen.has(name)) { seen.add(name); books.push(name); }
      }
    }
    return books.sort();
  }

  // ── Steps ──────────────────────────────────────────────────────────────────
  const STEPS = [
    { id: 'game',    label: 'Game',            valid: () => !!state.game },
    { id: 'species', label: 'Species',         valid: () => !!state.speciesKey },
    { id: 'career',  label: 'Career',          valid: () => !!state.careerKey },
    { id: 'spec',    label: 'Specialization',  valid: () => !!state.specKey },
    { id: 'chars',   label: 'Characteristics', valid: () => true },
    { id: 'skills',  label: 'Skills',          valid: () => (state.freeCareerSkillPicks || []).length === 4 },
    { id: 'details', label: 'Details',         valid: () => (state.name || '').trim().length > 0 },
    { id: 'sheet',   label: 'Sheet',           valid: () => true },
  ];

  // ── DOM helpers ────────────────────────────────────────────────────────────
  const $ = sel => document.querySelector(sel);

  function skillName(key) { const s = Engine.getSkill(key); return s ? s.name : key; }
  function skillChar(key) { const s = Engine.getSkill(key); return s ? s.characteristic.slice(0,3).toUpperCase() : ''; }

  // ── Main render ────────────────────────────────────────────────────────────
  function render() {
    renderProgress();
    renderStep();
    renderNav();
    renderHeaderXp();
  }

  function renderProgress() {
    const container = $('#progress-steps');
    container.innerHTML = STEPS.map((step, i) => {
      const cls = i < state.step ? 'done' : i === state.step ? 'active' : '';
      return `<div class="progress-step ${cls}">${step.label}</div>`;
    }).join('');
  }

  function renderNav() {
    const btnBack = $('#btn-back');
    const btnNext = $('#btn-next');
    const status  = $('#nav-status');
    const isLast  = state.step === STEPS.length - 1;

    btnBack.disabled = state.step === 0;
    btnNext.innerHTML = isLast ? '+ New Character' : 'Next &#8594;';
    btnNext.disabled  = !isLast && !STEPS[state.step].valid();
    status.textContent = `Step ${state.step + 1} of ${STEPS.length}`;
  }

  function renderHeaderXp() {
    const bar = $('#header-xp');
    if (!state.speciesKey || state.step < 4) { bar.classList.add('hidden'); return; }
    const d = Engine.derive(state);
    if (!d) return;
    bar.classList.remove('hidden');
    bar.className = 'header-xp' + (d.xp_remaining < 0 ? ' xp-warn' : '');
    bar.innerHTML = `
      <span>Starting XP: <strong>${d.starting_xp}</strong></span>
      <span>Spent: <strong>${d.xp_spent}</strong></span>
      <span>Remaining: <strong>${d.xp_remaining}</strong></span>`;
  }

  function renderStep() {
    const content = $('#step-content');
    content.innerHTML = '';
    const fns = { game: renderGame, species: renderSpecies, career: renderCareer,
                  spec: renderSpec, chars: renderChars, skills: renderSkills,
                  details: renderDetails, sheet: renderSheet };
    fns[STEPS[state.step].id]();
  }

  // ── Step: Game ─────────────────────────────────────────────────────────────
  function renderGame() {
    const c = $('#step-content');
    c.innerHTML = `
      <div class="step-header"><h2>Choose Your Game</h2>
        <p>Select which Star Wars RPG system you are playing.</p></div>
      <div class="game-cards" id="game-cards"></div>`;

    for (const [id, g] of Object.entries(GAMES)) {
      const sel = state.game === id;
      const card = document.createElement('div');
      card.className = `game-card ${g.color}${sel ? ' selected' : ''}`;
      card.innerHTML = `
        <h2>${g.name}</h2>
        <p>${g.desc}</p>
        <div class="career-list">${g.careers.map(c => `<span>${c}</span>`).join('')}</div>
        <div style="margin-top:12px;font-size:0.75rem;color:var(--muted)">
          Mechanic: <strong style="color:var(--text)">${g.mechanic}</strong></div>`;
      card.addEventListener('click', () => {
        if (state.game !== id) {
          state.game = id; state.careerKey = null;
          state.specKey = null; state.freeCareerSkillPicks = [];
        }
        saveState(); render();
      });
      $('#game-cards').appendChild(card);
    }
  }

  // ── Species ability parser ────────────────────────────────────────────────
  function parseSpeciesCard(sp) {
    const skills = [], talents = [], named = [];

    // Talents: "one rank in the X talent" -- search ALL entries
    for (const ab of sp.special_abilities) {
      const re = /one rank[s]? in the ([\w ]+?) talent/gi;
      let m;
      while ((m = re.exec(ab)) !== null) {
        const t = m[1].trim();
        if (!talents.includes(t)) talents.push(t);
      }
    }

    // Skills: "one rank in X" from first entry only, X starts uppercase, not a talent ref
    const firstText = (sp.special_abilities[0] || '').replace(/^Special Abilities:\s*/i, '');
    const skRe = /one rank[s]? in (?:either )?((?!the )[A-Z][\w ()]+?)(?=\s+or\s+one|\s*[.,]|\s+[Tt]hey|\s+[Cc]haracters|\s+[Dd]uring|\s+at\s+|$)/g;
    let m;
    while ((m = skRe.exec(firstText)) !== null) {
      let sk = m[1].trim();
      // Absorb "or Y" alternative if it follows and is NOT "or one rank in"
      const after = firstText.slice(m.index + m[0].length);
      const orAlt = after.match(/^\s+or\s+((?!one\s)[A-Z][\w ()]+?)(?=\s*[.,]|\s+[Tt]hey|\s+[Cc]haracters|$)/);
      if (orAlt) sk += ' or ' + orAlt[1].trim();
      if (!/talent/i.test(sk) && !skills.includes(sk)) skills.push(sk);
    }

    // Named abilities: entries 2+ use "Name: description" format
    for (let i = 1; i < sp.special_abilities.length; i++) {
      const ab = sp.special_abilities[i];
      const colon = ab.indexOf(':');
      if (colon > 0 && colon < 60) named.push(ab.slice(0, colon).trim());
    }

    return { skills, talents, named };
  }

  // ── Step: Species ─────────────────────────────────────────────────────────
  function renderSpecies() {
    const c = $('#step-content');
    const bookOptions = getAllBooks().map(b =>
      `<option value="${b}"${_spBook === b ? ' selected' : ''}>${b}</option>`
    ).join('');
    const archPills = ARCHETYPES.map(a =>
      `<button class="arch-pill${_spArchetypes.has(a.key) ? ' active' : ''}" data-arch="${a.key}">
        ${a.label}${a.abbr ? ` <span class="arch-abbr">[${a.abbr}]</span>` : ''}
      </button>`
    ).join('');

    c.innerHTML = `
      <div class="step-header"><h2>Choose Your Species</h2>
        <p>Your species determines your starting characteristics, XP, and special abilities.</p></div>
      <div class="filter-bar">
        <input type="search" id="sp-search" placeholder="Search species..." value="${($('#sp-search') || {value:''}).value || ''}">
        <select id="sp-book">
          <option value="">All Books</option>
          ${bookOptions}
        </select>
        <label style="display:flex;align-items:center;gap:6px;font-size:0.82rem;color:var(--muted);white-space:nowrap;cursor:pointer">
          <input type="checkbox" id="sp-show-homebrew"> Show homebrew
        </label>
      </div>
      <div class="arch-pills" id="sp-arch">${archPills}</div>
      <div class="species-grid" id="sp-grid"></div>`;

    function draw() {
      const grid = $('#sp-grid');
      const search = ($('#sp-search').value || '').toLowerCase();
      grid.innerHTML = '';

      const showSpHomebrew = $('#sp-show-homebrew').checked;
      const list = SW.species.filter(sp => {
        if (sp.homebrew && !showSpHomebrew) return false;
        if (search && !sp.name.toLowerCase().includes(search)) return false;
        if (_spBook) {
          const spBooks = (sp.sources || []).map(sourceBookName);
          if (!spBooks.includes(_spBook)) return false;
        }
        if (_spArchetypes.size > 0 && !_spArchetypes.has(getArchetype(sp))) return false;
        return true;
      });

      if (!list.length) { grid.innerHTML = '<div class="empty-state">No species match these filters.</div>'; return; }

      for (const sp of list) {
        const sel = state.speciesKey === sp.key;
        const card = document.createElement('div');
        card.className = `species-card${sel ? ' selected' : ''}`;
        const pips = Engine.CHAR_STATS.map(st =>
          `<div class="char-pip"><abbr title="${st}">${Engine.CHAR_ABBR[st]}</abbr><strong>${sp[st] ?? '?'}</strong></div>`
        ).join('');
        const { skills, talents, named } = parseSpeciesCard(sp);
        // Skills may be "Coordination or Negotiation" — make each word a tip-link
        function skillTips(skillStr) {
          return skillStr.split(/\s+or\s+/).map(s => tipLink('skill', s.trim())).join(' or ') + ' 1';
        }
        const statRows = [
          `<div><span class="sp-key">Wound Threshold</span><span class="sp-val">${sp.wound_threshold} + ${sp.wound_threshold_stat || 'Brawn'}</span></div>`,
          `<div><span class="sp-key">Strain Threshold</span><span class="sp-val">${sp.strain_threshold} + ${sp.strain_threshold_stat || 'Willpower'}</span></div>`,
          `<div><span class="sp-key">Starting XP</span><span class="sp-val">${sp.starting_xp}</span></div>`,
          skills.length  ? `<div><span class="sp-key">Skills</span><span class="sp-val">${skills.map(skillTips).join(', ')}</span></div>` : '',
          talents.length ? `<div><span class="sp-key">Talents</span><span class="sp-val">${talents.map(t => tipLink('talent', t) + ' 1').join(', ')}</span></div>` : '',
          named.length   ? `<div><span class="sp-key">Abilities</span><span class="sp-val">${named.map(n => tipLink('ability', n, sp.key)).join(', ')}</span></div>` : '',
        ].join('');
        card.innerHTML = `
          <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:4px">
            <h3 style="margin:0">${sp.name}</h3>
            ${sp.homebrew ? `<span class="homebrew-badge" title="${sp.homebrew_source}">Homebrew</span>` : ''}
          </div>
          <div class="char-pips">${pips}</div>
          <div class="sp-stats">${statRows}</div>`;
        card.addEventListener('click', () => {
          const prev = state.speciesKey;
          state.speciesKey = sp.key;
          if (prev !== sp.key) {
            state.characteristics = {
              brawn: sp.brawn, agility: sp.agility, intellect: sp.intellect,
              cunning: sp.cunning, willpower: sp.willpower, presence: sp.presence,
            };
          }
          saveState();
          draw();
          renderNav(); renderHeaderXp();
        });
        grid.appendChild(card);
      }
    }

    draw();
    $('#sp-search').addEventListener('input', draw);
    $('#sp-book').addEventListener('change', e => { _spBook = e.target.value; draw(); });
    $('#sp-show-homebrew').addEventListener('change', draw);
    $('#sp-arch').addEventListener('click', e => {
      const pill = e.target.closest('[data-arch]');
      if (!pill) return;
      const key = pill.dataset.arch;
      if (_spArchetypes.has(key)) _spArchetypes.delete(key);
      else _spArchetypes.add(key);
      pill.classList.toggle('active', _spArchetypes.has(key));
      draw();
    });
    initTipListeners($('#sp-grid'));
  }

  // ── Step: Career ──────────────────────────────────────────────────────────
  function renderCareer() {
    const c  = $('#step-content');
    const g  = GAMES[state.game];
    c.innerHTML = `
      <div class="step-header"><h2>Choose Your Career</h2>
        <p>Your career defines your role and grants 8 career skills (pick 4 to start with rank 1).</p></div>
      <div class="career-grid" id="career-grid"></div>`;

    const grid = $('#career-grid');
    const list = SW.careers.filter(ca => g && g.careers.includes(ca.name));

    for (const ca of list) {
      const sel = state.careerKey === ca.key;
      const card = document.createElement('div');
      card.className = `career-card${sel ? ' selected' : ''}`;
      const tags = (ca.career_skill_keys || []).map(k => {
        const name = skillName(k);
        return `<span class="skill-tag" data-tip-type="skill" data-tip-name="${name}">${name}</span>`;
      }).join('');
      const blurb = CAREER_BLURBS[ca.key] || '';
      card.innerHTML = `
        <span class="game-badge badge-${state.game}">${g ? g.name : ''}</span>
        <h3>${ca.name}</h3>
        ${blurb ? `<p class="career-blurb">${blurb}</p>` : ''}
        <div class="skill-tags">${tags}</div>`;
      card.addEventListener('click', () => {
        if (state.careerKey !== ca.key) {
          state.careerKey = ca.key; state.specKey = null; state.freeCareerSkillPicks = [];
        }
        saveState(); renderStep(); renderNav();
      });
      grid.appendChild(card);
    }
    initTipListeners(grid);
  }

  // ── Step: Specialization ──────────────────────────────────────────────────
  function renderSpec() {
    const c      = $('#step-content');
    const career = Engine.getCareer(state.careerKey);
    c.innerHTML = `
      <div class="step-header"><h2>Choose Your Starting Specialization</h2>
        <p>Your specialization grants 4 bonus career skills and a talent tree to purchase from.</p></div>
      <div class="filter-bar">
        <input type="search" id="spec-search" placeholder="Filter specializations...">
        <label style="display:flex;align-items:center;gap:6px;font-size:0.82rem;color:var(--muted);white-space:nowrap;cursor:pointer">
          <input type="checkbox" id="career-only" checked> Career only
        </label>
        <label style="display:flex;align-items:center;gap:6px;font-size:0.82rem;color:var(--muted);white-space:nowrap;cursor:pointer">
          <input type="checkbox" id="show-homebrew"> Show homebrew
        </label>
      </div>
      <div class="spec-grid" id="spec-grid"></div>`;

    function draw() {
      const grid = $('#spec-grid');
      const filter     = ($('#spec-search').value || '').toLowerCase();
      const careerOnly = $('#career-only').checked;
      const cName      = career ? career.name : '';
      grid.innerHTML   = '';

      const showHomebrew = $('#show-homebrew').checked;
      const list = SW.specializations.filter(s => {
        if (s.homebrew && !showHomebrew) return false;
        if (filter && !s.name.toLowerCase().includes(filter)) return false;
        if (careerOnly && !s.careers.includes(cName)) return false;
        return true;
      });

      if (!list.length) { grid.innerHTML = '<div class="empty-state">No specializations found.</div>'; return; }

      for (const sp of list) {
        const sel      = state.specKey === sp.key;
        const inCareer = sp.careers.includes(cName);
        const card = document.createElement('div');
        card.className = `spec-card${sel ? ' selected' : ''}`;

        const bonusTags = (sp.bonus_career_skills || []).map(s => {
          // bonus_career_skills uses display names like "Knowledge (Education)"
          const canonical = Engine.nameToKey(s) ? Engine.getSkill(Engine.nameToKey(s))?.name || s : s;
          return `<span class="skill-tag bonus" data-tip-type="skill" data-tip-name="${canonical}">${s}</span>`;
        }).join('');

        const treeHtml = (sp.talent_tree || []).map(row =>
          `<div class="tree-row"><div class="tree-cost">${row.cost}</div>${
            (row.talents || []).map(t =>
              t ? `<div class="tree-cell" data-tip-type="talent" data-tip-name="${t}">${t}</div>`
                : `<div class="tree-cell empty">—</div>`
            ).join('')}</div>`
        ).join('');

        const blurb = SPEC_BLURBS[sp.key] || '';
        card.innerHTML = `
          <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:${blurb ? '4px' : '8px'}">
            <h3>${sp.name}</h3>
            ${!inCareer ? '<span style="font-size:0.68rem;color:var(--muted);border:1px solid var(--border);padding:1px 5px;border-radius:3px">Out-of-career</span>' : ''}
            ${sp.homebrew ? `<span class="homebrew-badge" title="${sp.homebrew_source}">Homebrew</span>` : ''}
          </div>
          ${blurb ? `<p class="career-blurb" style="margin-bottom:10px">${blurb}</p>` : ''}
          <div class="skill-tags" style="margin-bottom:10px">${bonusTags}</div>
          <div class="talent-tree">${treeHtml}</div>`;

        card.addEventListener('click', () => {
          if (state.specKey !== sp.key) { state.specKey = sp.key; state.freeCareerSkillPicks = []; }
          saveState(); draw(); renderNav();
        });
        grid.appendChild(card);
      }
    }

    draw();
    $('#spec-search').addEventListener('input', draw);
    $('#career-only').addEventListener('change', draw);
    $('#show-homebrew').addEventListener('change', draw);
    initTipListeners($('#spec-grid'));
  }

  // ── Step: Characteristics ─────────────────────────────────────────────────
  function renderChars() {
    const c       = $('#step-content');
    const species = Engine.getSpecies(state.speciesKey);
    if (!species || !state.characteristics) {
      c.innerHTML = '<div class="empty-state">Please select a species first.</div>'; return;
    }

    c.innerHTML = `
      <div class="step-header"><h2>Assign Characteristics</h2>
        <p>Spend your starting XP to raise characteristics. Characteristics can <strong>only</strong> be raised during character creation.</p></div>
      <div class="chars-layout">
        <div>
          <div class="xp-bar" id="xp-bar"></div>
          <div class="char-adjusters" id="char-adj"></div>
        </div>
        <div class="derived-panel" id="der-panel"></div>
      </div>`;

    function refresh() {
      const d = Engine.derive(state);

      $('#xp-bar').innerHTML = `
        <div class="xp-item"><label>Starting XP</label><strong>${d.starting_xp}</strong></div>
        <div class="xp-item spent"><label>Spent on Chars</label><strong>${d.xp_spent}</strong></div>
        <div class="xp-item remaining${d.xp_remaining < 0 ? ' warn' : ''}"><label>Remaining</label><strong>${d.xp_remaining}</strong></div>`;

      const adj = $('#char-adj');
      adj.innerHTML = '';
      for (const stat of Engine.CHAR_STATS) {
        const base    = species[stat] || 1;
        const cur     = state.characteristics[stat] || base;
        const costUp  = Engine.xpToRaise(cur);
        const canUp   = cur < 5 && costUp <= d.xp_remaining;
        const canDown = cur > base;
        const row = document.createElement('div');
        row.className = 'char-row-adj';
        row.innerHTML = `
          <label>${stat.charAt(0).toUpperCase() + stat.slice(1)}</label>
          <button class="char-adj-btn" id="dn-${stat}" ${canDown ? '' : 'disabled'}>−</button>
          <div class="char-value-display">${cur}</div>
          <button class="char-adj-btn" id="up-${stat}" ${canUp ? '' : 'disabled'}>+</button>
          <div class="char-cost-hint">${cur < 5 ? `${costUp} XP to raise` : 'Maximum'}</div>`;
        row.querySelector(`#dn-${stat}`).addEventListener('click', () => {
          if (cur > base) { state.characteristics[stat]--; saveState(); refresh(); renderHeaderXp(); renderNav(); }
        });
        row.querySelector(`#up-${stat}`).addEventListener('click', () => {
          if (canUp) { state.characteristics[stat]++; saveState(); refresh(); renderHeaderXp(); renderNav(); }
        });
        adj.appendChild(row);
      }

      $('#der-panel').innerHTML = `
        <h4>Derived Stats Preview</h4>
        <div class="derived-stat"><span class="ds-label">Wound Threshold</span><span class="ds-value">${d.wound_threshold}</span></div>
        <div class="derived-stat"><span class="ds-label">Strain Threshold</span><span class="ds-value">${d.strain_threshold}</span></div>
        <div class="derived-stat"><span class="ds-label">Soak Value</span><span class="ds-value">${d.soak}</span></div>
        <div class="derived-stat"><span class="ds-label">Defense (Ranged)</span><span class="ds-value">${d.defense_ranged}</span></div>
        <div class="derived-stat"><span class="ds-label">Defense (Melee)</span><span class="ds-value">${d.defense_melee}</span></div>`;
    }

    refresh();
  }

  // ── Step: Skills ──────────────────────────────────────────────────────────
  function renderSkills() {
    const c      = $('#step-content');
    const career = Engine.getCareer(state.careerKey);
    const spec   = Engine.getSpec(state.specKey);
    if (!career || !spec) {
      c.innerHTML = '<div class="empty-state">Please complete earlier steps first.</div>'; return;
    }

    const careerKeys = career.career_skill_keys || [];
    const bonusKeys  = Engine.specBonusSkillKeys(spec);

    c.innerHTML = `
      <div class="step-header"><h2>Starting Skills</h2>
        <p>Pick 4 of 8 career skills to receive rank 1 for free. Specialization bonus skills are automatically granted.</p></div>
      <div class="skills-layout">
        <div class="skills-section">
          <h3>Career Skills &mdash; <span id="pick-counter">0 / 4 chosen</span></h3>
          <div id="career-picks"></div>
        </div>
        <div class="skills-section">
          <h3>${spec.name} Bonus Skills</h3>
          <div id="bonus-list"></div>
          <p style="margin-top:14px;font-size:0.78rem;color:var(--muted)">
            Skills marked <span style="color:var(--accent)">★</span> appear in both lists and start at Rank 2.</p>
        </div>
      </div>`;

    function refresh() {
      const picks = state.freeCareerSkillPicks || [];
      $('#pick-counter').textContent = `${picks.length} / 4 chosen`;

      const pickList = $('#career-picks');
      pickList.innerHTML = '';
      for (const key of careerKeys) {
        const picked  = picks.includes(key);
        const overlap = bonusKeys.includes(key);
        const isR2    = picked && overlap;
        let cls = 'skill-pick-row' + (isR2 ? ' rank2' : picked ? ' selected' : '');
        const row = document.createElement('div');
        row.className = cls;
        row.innerHTML = `
          <div class="skill-pick-check">${picked ? '✓' : ''}</div>
          <span class="skill-pick-name">${skillName(key)}${overlap ? ' <span style="color:var(--accent)">★</span>' : ''}</span>
          <span class="skill-pick-char">${skillChar(key)}</span>
          <span class="skill-pick-rank">${picked ? (isR2 ? 'Rank 2' : 'Rank 1') : ''}</span>`;
        row.addEventListener('click', () => {
          const idx = picks.indexOf(key);
          if (idx !== -1) picks.splice(idx, 1);
          else if (picks.length < 4) picks.push(key);
          state.freeCareerSkillPicks = picks;
          saveState(); refresh(); renderNav();
        });
        pickList.appendChild(row);
      }

      const bonusList = $('#bonus-list');
      bonusList.innerHTML = '';
      for (let i = 0; i < (spec.bonus_career_skills || []).length; i++) {
        const name    = spec.bonus_career_skills[i];
        const key     = bonusKeys[i];
        const inCar   = key && careerKeys.includes(key);
        const isPicked= key && picks.includes(key);
        const rank    = inCar && isPicked ? 2 : 1;
        const row = document.createElement('div');
        row.className = `skill-pick-row granted${rank === 2 ? ' rank2' : ''}`;
        row.innerHTML = `
          <div class="skill-pick-check" style="background:var(--success);border-color:var(--success);color:#fff">✓</div>
          <span class="skill-pick-name">${name}${inCar ? ' <span style="color:var(--accent)">★</span>' : ''}</span>
          <span class="skill-pick-rank" style="color:var(--success)">Rank ${rank}</span>`;
        bonusList.appendChild(row);
      }
    }

    refresh();
  }

  // ── Step: Details ─────────────────────────────────────────────────────────
  const OBLIGATIONS = ['Addiction','Betrayal','Blackmail','Bounty','Criminal','Debt',
    'Dutybound','Family','Favor','Oath','Obsession','Responsibility','Revenge','Superstition'];
  const DUTIES = ['Combat Victory','Counter-intelligence','Espionage','Internal Affairs',
    'Political Influence','Recruiting','Sabotage','Space Superiority','Tech Procurement'];
  const STRENGTHS = ['Bravery','Caution','Compassion','Creativity','Curiosity','Devotion',
    'Enthusiasm','Forgiveness','Grit','Heroism','Honesty','Inspiration','Justice',
    'Kindness','Loyalty','Mercy','Patience','Pride','Righteousness','Wisdom'];
  const WEAKNESSES = ['Anger','Apathy','Arrogance','Cowardice','Cruelty','Deceit',
    'Fear','Greed','Hate','Hubris','Impatience','Impulsiveness','Jealousy','Laziness',
    'Obsession','Recklessness','Ruthlessness','Selfishness','Vanity','Violence'];

  function renderDetails() {
    const c = $('#step-content');
    const g = state.game;
    const mechLabel = g === 'eote' ? 'Obligation' : g === 'aor' ? 'Duty' : 'Morality';

    c.innerHTML = `
      <div class="step-header"><h2>Character Details</h2>
        <p>Name your character and fill in their background.</p></div>
      <div class="details-layout">
        <div>
          <div class="form-section-title">Identity</div>
          <div class="form-group"><label>Character Name *</label>
            <input type="text" id="f-name" placeholder="Enter name..." value="${esc(state.name)}"></div>
          <div class="form-group"><label>Player Name</label>
            <input type="text" id="f-player" placeholder="Your name..." value="${esc(state.player)}"></div>
          <div class="form-group"><label>Motivation / Goal</label>
            <input type="text" id="f-motiv" placeholder="What drives your character?" value="${esc(state.motivation)}"></div>
          <div class="form-group"><label>Background</label>
            <textarea id="f-bg" placeholder="History, personality, appearance...">${esc(state.background)}</textarea></div>
        </div>
        <div>
          <div class="form-section-title">${mechLabel}</div>
          ${mechFields(g)}
        </div>
      </div>`;

    $('#f-name').addEventListener('input', e => { state.name = e.target.value; saveState(); renderNav(); });
    $('#f-player').addEventListener('input', e => { state.player = e.target.value; saveState(); });
    $('#f-motiv').addEventListener('input', e => { state.motivation = e.target.value; saveState(); });
    $('#f-bg').addEventListener('input', e => { state.background = e.target.value; saveState(); });
    bindMech(g);
  }

  function esc(s) { return (s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/"/g,'&quot;'); }

  function mechFields(g) {
    if (g === 'eote') return `
      <div class="form-group"><label>Obligation Type</label>
        <select id="f-obl-type">
          <option value="">Select type...</option>
          ${OBLIGATIONS.map(o => `<option value="${o}"${state.obligation.type===o?' selected':''}>${o}</option>`).join('')}
        </select></div>
      <div class="form-group"><label>Magnitude</label>
        <input type="number" id="f-obl-mag" min="5" max="30" step="5" value="${state.obligation.magnitude||10}"></div>
      <p style="font-size:0.8rem;color:var(--muted)">Starting group obligation pool is typically 40 XP worth for a 4-player group.</p>`;
    if (g === 'aor') return `
      <div class="form-group"><label>Duty Type</label>
        <select id="f-duty-type">
          <option value="">Select type...</option>
          ${DUTIES.map(d => `<option value="${d}"${state.duty.type===d?' selected':''}>${d}</option>`).join('')}
        </select></div>
      <div class="form-group"><label>Duty Value</label>
        <input type="number" id="f-duty-mag" min="0" max="100" value="${state.duty.magnitude||10}"></div>
      <p style="font-size:0.8rem;color:var(--muted)">Reaching 100 Duty triggers a major reward for the character and the Rebellion.</p>`;
    if (g === 'fad') return `
      <div class="form-group"><label>Emotional Strength</label>
        <select id="f-str">
          <option value="">Select...</option>
          ${STRENGTHS.map(s => `<option value="${s}"${state.morality.strength===s?' selected':''}>${s}</option>`).join('')}
        </select></div>
      <div class="form-group"><label>Emotional Weakness</label>
        <select id="f-weak">
          <option value="">Select...</option>
          ${WEAKNESSES.map(s => `<option value="${s}"${state.morality.weakness===s?' selected':''}>${s}</option>`).join('')}
        </select></div>
      <div class="form-group"><label>Starting Morality (default 50)</label>
        <input type="number" id="f-mor" min="1" max="100" value="${state.morality.score||50}"></div>
      <p style="font-size:0.8rem;color:var(--muted)">Higher = more light side. Lower = more dark side. Triggers at 30 (dark) or 70 (light).</p>`;
    return '';
  }

  function bindMech(g) {
    if (g === 'eote') {
      $('#f-obl-type').addEventListener('change', e => { state.obligation.type = e.target.value; saveState(); });
      $('#f-obl-mag').addEventListener('input', e => { state.obligation.magnitude = +e.target.value; saveState(); });
    }
    if (g === 'aor') {
      $('#f-duty-type').addEventListener('change', e => { state.duty.type = e.target.value; saveState(); });
      $('#f-duty-mag').addEventListener('input', e => { state.duty.magnitude = +e.target.value; saveState(); });
    }
    if (g === 'fad') {
      $('#f-str').addEventListener('change', e => { state.morality.strength = e.target.value; saveState(); });
      $('#f-weak').addEventListener('change', e => { state.morality.weakness = e.target.value; saveState(); });
      $('#f-mor').addEventListener('input', e => { state.morality.score = +e.target.value; saveState(); });
    }
  }

  // ── Step: Sheet ───────────────────────────────────────────────────────────
  function renderSheet() {
    const c = $('#step-content');
    const d = Engine.derive(state);
    if (!d) { c.innerHTML = '<div class="empty-state">Complete all steps to view the sheet.</div>'; return; }
    Sheet.render(c, state, d);
  }

  // ── Navigation ────────────────────────────────────────────────────────────
  function next() {
    if (state.step === STEPS.length - 1) {
      if (confirm('Start a new character? Current character will be cleared.')) {
        state = defaultState(); saveState(); render();
      }
      return;
    }
    if (!STEPS[state.step].valid()) return;
    state.step++;
    saveState(); render();
    window.scrollTo(0, 0);
  }

  function back() {
    if (state.step === 0) return;
    state.step--;
    saveState(); render();
    window.scrollTo(0, 0);
  }

  // ── Init ──────────────────────────────────────────────────────────────────
  function init() {
    loadState();
    $('#btn-next').addEventListener('click', next);
    $('#btn-back').addEventListener('click', back);
    render();
  }

  return { init };
})();

document.addEventListener('DOMContentLoaded', Wizard.init);
