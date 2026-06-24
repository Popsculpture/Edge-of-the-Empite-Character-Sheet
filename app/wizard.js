'use strict';

const Wizard = (() => {
  // ── Themes ────────────────────────────────────────────────────────────────
  const THEMES = {
    crawl:    { title:'Opening Crawl', sub:'(Default)',               bg:'#080b12', surface:'#111724', surface2:'#192030', border:'#263348', text:'#d8e4f0', muted:'#6a80a0', accent:'#ffe81f', accentBg:'rgba(255,232,31,0.08)',   accentBorder:'rgba(255,232,31,0.4)'   },
    phantom:  { title:'Episode I',     sub:'The Phantom Menace',      bg:'#060201', surface:'#1a0e09', surface2:'#271510', border:'#4a2318', text:'#E0BEA4', muted:'#7C5341', accent:'#E2422D', accentBg:'rgba(226,66,45,0.08)',    accentBorder:'rgba(226,66,45,0.4)'    },
    clones:   { title:'Episode II',    sub:'Attack of the Clones',    bg:'#0d0812', surface:'#1a1030', surface2:'#251848', border:'#133054', text:'#F9D98C', muted:'#5C85B3', accent:'#AD73B1', accentBg:'rgba(173,115,177,0.08)', accentBorder:'rgba(173,115,177,0.4)'  },
    sith:     { title:'Episode III',   sub:'Revenge of the Sith',     bg:'#0c0503', surface:'#1c0d06', surface2:'#2c1508', border:'#4E200E', text:'#D5BD85', muted:'#A4A27E', accent:'#F3934C', accentBg:'rgba(243,147,76,0.08)',  accentBorder:'rgba(243,147,76,0.4)'   },
    newhope:  { title:'Episode IV',    sub:'A New Hope',              bg:'#080810', surface:'#0e1020', surface2:'#151828', border:'#213165', text:'#ECE8D6', muted:'#1F72B8', accent:'#B99D31', accentBg:'rgba(185,157,49,0.08)',  accentBorder:'rgba(185,157,49,0.4)'   },
    empire:   { title:'Episode V',     sub:'The Empire Strikes Back', bg:'#0d1015', surface:'#171f28', surface2:'#202c38', border:'#495363', text:'#D9D2C9', muted:'#715A62', accent:'#F49D67', accentBg:'rgba(244,157,103,0.08)', accentBorder:'rgba(244,157,103,0.4)'  },
    jedi:     { title:'Episode VI',    sub:'Return of the Jedi',      bg:'#0c0e0b', surface:'#141e10', surface2:'#1c2c18', border:'#364A5C', text:'#DDD7D8', muted:'#418A45', accent:'#80B972', accentBg:'rgba(128,185,114,0.08)', accentBorder:'rgba(128,185,114,0.4)'  },
    force:    { title:'The Force Awakens', sub:'Episode VII',         bg:'#020202', surface:'#0e0808', surface2:'#180e0e', border:'#2d1010', text:'#EBE6E9', muted:'#ABA49E', accent:'#CC463C', accentBg:'rgba(204,70,60,0.08)',   accentBorder:'rgba(204,70,60,0.4)'    },
    lastjedi: { title:'The Last Jedi', sub:'Episode VIII',            bg:'#050405', surface:'#130808', surface2:'#1f0f0f', border:'#761F14', text:'#FFFFFF', muted:'#79808C', accent:'#C03927', accentBg:'rgba(192,57,39,0.08)',   accentBorder:'rgba(192,57,39,0.4)'    },
    rogueone: { title:'Rogue One',     sub:'A Star Wars Story',       bg:'#0c1215', surface:'#141e25', surface2:'#1c2c35', border:'#2C4E61', text:'#DFDDD4', muted:'#73A9C7', accent:'#4B7B92', accentBg:'rgba(75,123,146,0.08)',  accentBorder:'rgba(75,123,146,0.4)'   },
    solo:     { title:'Solo',          sub:'A Star Wars Story',       bg:'#0d0810', surface:'#180e20', surface2:'#221530', border:'#3d1a50', text:'#EFD34B', muted:'#DF7DAF', accent:'#783891', accentBg:'rgba(120,56,145,0.08)',  accentBorder:'rgba(120,56,145,0.4)'   },
  };

  function applyTheme(key) {
    const t = THEMES[key] || THEMES.crawl;
    const r = document.documentElement.style;
    r.setProperty('--bg',            t.bg);
    r.setProperty('--surface',       t.surface);
    r.setProperty('--surface2',      t.surface2);
    r.setProperty('--border',        t.border);
    r.setProperty('--text',          t.text);
    r.setProperty('--muted',         t.muted);
    r.setProperty('--accent',        t.accent);
    r.setProperty('--accent-bg',     t.accentBg);
    r.setProperty('--accent-border', t.accentBorder);
    localStorage.setItem('sw_theme', key);
  }

  function initTheme() {
    applyTheme(localStorage.getItem('sw_theme') || 'crawl');
  }

  function openThemePanel() {
    const modal = $('#theme-modal');
    const current = localStorage.getItem('sw_theme') || 'crawl';
    modal.innerHTML = `
      <div class="theme-modal-inner">
        <div class="theme-modal-header">
          <h3>Color Theme</h3>
          <button class="theme-close-btn" id="theme-close">&#x2715;</button>
        </div>
        <div class="theme-swatches">
          ${Object.entries(THEMES).map(([key, t]) => `
            <div class="theme-swatch${key === current ? ' ts-active' : ''}" data-theme="${key}">
              <div class="theme-swatch-colors">
                <div style="background:${t.bg};flex:3"></div>
                <div style="background:${t.surface};flex:2"></div>
                <div style="background:${t.accent};flex:2"></div>
                <div style="background:${t.text};flex:1"></div>
              </div>
              <div class="theme-swatch-label">
                <div class="theme-swatch-title">${t.title}</div>
                <div class="theme-swatch-sub">${t.sub}</div>
              </div>
            </div>`).join('')}
        </div>
      </div>`;
    modal.classList.remove('hidden');
    modal.addEventListener('click', function handler(e) {
      const sw = e.target.closest('[data-theme]');
      if (sw) {
        applyTheme(sw.dataset.theme);
        modal.querySelectorAll('.theme-swatch').forEach(el =>
          el.classList.toggle('ts-active', el.dataset.theme === sw.dataset.theme));
      }
      if (e.target === modal || e.target.closest('#theme-close')) {
        modal.classList.add('hidden');
        modal.removeEventListener('click', handler);
      }
    });
  }

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
      obligation:         { type: '', magnitude: 10, bonusType: '' },
      duty:               { type: '', deficit: 0, bonusType: '' },
      morality:           { strength: '', weakness: '', score: 50 },
      talentPurchases:    {},
      beginnings:         '',
      forceAttitude:      '',
      reasonForAdventure: '',
      motivationType:     '',
      motivationSpecific: '',
      beginningsText:     '',
      forceAttitudeText:  '',
      motivationText:     '',
      equipment:          { weapon: {}, armor: {}, gear: {} },
    };
  }

  let state = defaultState();

  // UI-only filter state for the species step (persists across re-renders)
  let _spBook       = '';
  let _spArchetypes = new Set();

  // UI-only state for the Equipment step (persists across re-renders)
  let _eqCat  = 'weapon';   // active storefront: weapon | armor | gear
  let _eqMode = false;      // acquisition mode: false = Purchase, true = Acquire Free
  const _eqFilter = {
    weapon: { q: '', type: '', rarity: '', core: false, afford: false, hideR: false },
    armor:  { q: '', type: '', rarity: '', core: false, afford: false, hideR: false },
    gear:   { q: '', type: '', rarity: '', core: false, afford: false, hideR: false },
  };
  const _EQ_CAP = 200;      // max rows rendered per storefront (perf guard)

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
    { id: 'details', label: 'Identity',        tab: 'Identity', valid: () => (state.name || '').trim().length > 0 },
    { id: 'game',    label: 'Game',            tab: 'Game',     valid: () => !!state.game },
    { id: 'species', label: 'Species',         tab: 'Species',  valid: () => !!state.speciesKey },
    { id: 'career',  label: 'Career',          tab: 'Career',   valid: () => !!state.careerKey },
    { id: 'spec',    label: 'Specialization',  tab: 'Spec.',    valid: () => !!state.specKey },
    { id: 'skills',  label: 'Skills',          tab: 'Skills',   valid: () => (state.freeCareerSkillPicks || []).length === 4 },
    { id: 'oms',     label: () => state.game === 'eote' ? 'Obligation' : state.game === 'aor' ? 'Duty' : 'Morality',
                     tab:   () => state.game === 'eote' ? 'Oblig.'     : state.game === 'aor' ? 'Duty' : 'Morality',
                     valid: () => true },
    { id: 'chars',   label: 'Characteristics', tab: 'Attrs',    valid: () => true },
    { id: 'talents', label: 'Talents',         tab: 'Talents',  valid: () => true },
    { id: 'equip',   label: 'Equipment',       tab: 'Gear',     valid: () => true },
    { id: 'sheet',   label: 'Sheet',           tab: 'Sheet',    valid: () => true },
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
    renderHeaderCredits();
    document.body.classList.toggle('on-sheet', STEPS[state.step].id === 'sheet');
  }

  function renderProgress() {
    const container = $('#progress-steps');
    container.innerHTML = STEPS.map((step, i) => {
      const cls = i < state.step ? 'done' : i === state.step ? 'active' : '';
      const tab = typeof step.tab === 'function' ? step.tab() : step.tab;
      return `<div class="progress-step ${cls}">${tab}</div>`;
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
    const XP_STEPS = new Set(['oms', 'chars', 'talents']);
    if (!state.speciesKey || !XP_STEPS.has(STEPS[state.step].id)) { bar.classList.add('hidden'); return; }
    const d = Engine.derive(state);
    if (!d) return;
    bar.className = 'header-xp' + (d.xp_remaining < 0 ? ' xp-warn' : '');
    bar.innerHTML = `
      <span>Starting XP <strong>${d.starting_xp}</strong></span>
      <span>Spent <strong>${d.xp_spent}</strong></span>
      <span class="xp-remain">Remaining <strong>${d.xp_remaining}</strong></span>`;
  }

  function renderHeaderCredits() {
    const bar = $('#header-credits');
    if (!bar) return;
    if (!state.speciesKey || STEPS[state.step].id !== 'equip') { bar.classList.add('hidden'); return; }
    const d = Engine.derive(state);
    if (!d) { bar.classList.add('hidden'); return; }
    bar.className = 'header-credits' + (d.credits_remaining < 0 ? ' cr-warn' : '');
    bar.innerHTML = `
      <span>Starting Credits <strong>${fmtCr(d.starting_credits)}</strong></span>
      <span>Spent <strong>${fmtCr(d.credits_spent)}</strong></span>
      <span class="cr-remain">Remaining <strong>${fmtCr(d.credits_remaining)}</strong></span>`;
  }

  function fmtCr(n) {
    const neg = n < 0;
    const s = Math.abs(Math.round(n)).toLocaleString('en-US');
    return (neg ? '-' : '') + s;
  }

  function renderStep() {
    const content = $('#step-content');
    content.innerHTML = '';
    const fns = { game: renderGame, species: renderSpecies, career: renderCareer,
                  spec: renderSpec, skills: renderSkills, oms: renderOMS, chars: renderChars,
                  talents: renderTalents, details: renderDetails, equip: renderEquip,
                  sheet: renderSheet };
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

  // ── Step: OMS (Obligation / Duty / Morality) ──────────────────────────────
  const OBLIGATIONS = ['Addiction','Betrayal','Blackmail','Bounty','Criminal','Debt',
    'Dutybound','Family','Favor','Oath','Obsession','Responsibility','Revenge','Superstition'];
  const DUTIES = ['Combat Victory','Counter-intelligence','Espionage','Internal Affairs',
    'Political Influence','Recruiting','Sabotage','Space Superiority','Tech Procurement'];
  const MORALITY_PAIRS = [
    ['Bravery','Fear'],        ['Brilliance','Obsession'],  ['Caution','Cowardice'],
    ['Charisma','Manipulation'],['Clarity','Coldness'],     ['Compassion','Pity'],
    ['Confidence','Arrogance'],['Creativity','Instability'],['Discipline','Rigidity'],
    ['Enthusiasm','Recklessness'],['Generosity','Wastefulness'],['Humanity','Sentimentality'],
    ['Ingenuity','Deception'], ['Kindness','Weakness'],     ['Loyalty','Betrayal'],
    ['Mercy','Passivity'],     ['Patience','Apathy'],       ['Resilience','Stubbornness'],
    ['Righteousness','Judgment'],['Selflessness','Martyrdom'],['Sensitivity','Vulnerability'],
    ['Serenity','Detachment'], ['Wisdom','Doubt'],          ['Zeal','Fanaticism'],
  ];

  function renderOMS() {
    const c = $('#step-content');
    const g = state.game;

    if (g === 'eote') {
      const mag   = state.obligation.magnitude || 10;
      const extra = mag - 10;
      const btype = state.obligation.bonusType || '';
      c.innerHTML = `
        <div class="step-header">
          <h2>Choose Your Obligation</h2>
          <p>Every Edge of the Empire character carries an Obligation -- a debt, crime, or responsibility that shadows their life. The GM rolls each session; when your Obligation comes up it creates complications for the group.</p>
        </div>
        <div class="form-group">
          <div class="form-section-title">Obligation Type</div>
          <div class="arch-pills" id="obl-pills">
            ${OBLIGATIONS.map(o => `<span class="arch-pill${state.obligation.type === o ? ' active' : ''}" data-val="${o}">${o}</span>`).join('')}
          </div>
        </div>
        <div class="form-group">
          <div class="form-section-title">Starting Obligation: 10</div>
          <p style="margin:4px 0 12px;font-size:0.82rem;color:var(--muted)">Take on additional Obligation in exchange for bonus resources at character creation.</p>
          <div class="oms-bonus-tiles">
            <div class="oms-tile${extra === 0 ? ' selected' : ''}" data-extra="0">
              <div class="oms-tile-title">No Extra</div>
              <div class="oms-tile-sub">Obligation: 10</div>
            </div>
            <div class="oms-tile${extra === 5 ? ' selected' : ''}" data-extra="5">
              <div class="oms-tile-title">+5 Obligation</div>
              <div class="oms-tile-sub">Total: 15</div>
              <div class="oms-tile-bonus">+5 XP or +1,000 Credits</div>
            </div>
            <div class="oms-tile${extra === 10 ? ' selected' : ''}" data-extra="10">
              <div class="oms-tile-title">+10 Obligation</div>
              <div class="oms-tile-sub">Total: 20</div>
              <div class="oms-tile-bonus">+10 XP or +2,500 Credits</div>
            </div>
          </div>
          ${extra > 0 ? `
          <div style="margin-top:16px;display:flex;gap:24px;flex-wrap:wrap">
            <label style="display:flex;align-items:center;gap:8px;cursor:pointer;font-size:0.88rem;white-space:nowrap">
              <input type="radio" name="obl-bonus" value="xp"${btype === 'xp' ? ' checked' : ''}> +${extra} Starting XP
            </label>
            <label style="display:flex;align-items:center;gap:8px;cursor:pointer;font-size:0.88rem;white-space:nowrap">
              <input type="radio" name="obl-bonus" value="credits"${btype === 'credits' ? ' checked' : ''}> +${extra === 5 ? '1,000' : '2,500'} Starting Credits
            </label>
          </div>` : ''}
        </div>`;

      $('#obl-pills').addEventListener('click', e => {
        const pill = e.target.closest('.arch-pill');
        if (!pill) return;
        state.obligation.type = pill.dataset.val === state.obligation.type ? '' : pill.dataset.val;
        saveState();
        $('#obl-pills').querySelectorAll('.arch-pill').forEach(p =>
          p.classList.toggle('active', p.dataset.val === state.obligation.type));
      });
      c.querySelectorAll('.oms-tile[data-extra]').forEach(tile => {
        tile.addEventListener('click', () => {
          const ex = +tile.dataset.extra;
          state.obligation.magnitude = 10 + ex;
          if (ex === 0) state.obligation.bonusType = '';
          else if (!state.obligation.bonusType) state.obligation.bonusType = 'xp';
          saveState(); renderOMS(); renderHeaderXp();
        });
      });
      if (extra > 0) {
        c.querySelectorAll('input[name="obl-bonus"]').forEach(r =>
          r.addEventListener('change', e => { state.obligation.bonusType = e.target.value; saveState(); renderHeaderXp(); }));
      }

    } else if (g === 'aor') {
      const deficit = state.duty.deficit || 0;
      const btype   = state.duty.bonusType || '';
      c.innerHTML = `
        <div class="step-header">
          <h2>Choose Your Duty</h2>
          <p>Every Age of Rebellion character has a Duty -- a specific responsibility to the Rebellion. When the group's combined Duty reaches 100, your Duty triggers and the Alliance rewards the effort.</p>
        </div>
        <div class="form-group">
          <div class="form-section-title">Duty Type</div>
          <div class="arch-pills" id="duty-pills">
            ${DUTIES.map(d => `<span class="arch-pill${state.duty.type === d ? ' active' : ''}" data-val="${d}">${d}</span>`).join('')}
          </div>
        </div>
        <div class="form-group">
          <div class="form-section-title">Starting Duty Adjustment</div>
          <p style="margin:4px 0 12px;font-size:0.82rem;color:var(--muted)">Start with a Duty deficit -- owing more to the Rebellion than you have earned -- in exchange for bonus resources.</p>
          <div class="oms-bonus-tiles">
            <div class="oms-tile${deficit === 0 ? ' selected' : ''}" data-deficit="0">
              <div class="oms-tile-title">No Adjustment</div>
              <div class="oms-tile-sub">Starting Duty: 0</div>
            </div>
            <div class="oms-tile${deficit === 5 ? ' selected' : ''}" data-deficit="5">
              <div class="oms-tile-title">-5 Duty</div>
              <div class="oms-tile-sub">Starting: -5</div>
              <div class="oms-tile-bonus">+5 XP or +1,000 Credits</div>
            </div>
            <div class="oms-tile${deficit === 10 ? ' selected' : ''}" data-deficit="10">
              <div class="oms-tile-title">-10 Duty</div>
              <div class="oms-tile-sub">Starting: -10</div>
              <div class="oms-tile-bonus">+10 XP or +2,500 Credits</div>
            </div>
          </div>
          ${deficit > 0 ? `
          <div style="margin-top:16px;display:flex;gap:24px;flex-wrap:wrap">
            <label style="display:flex;align-items:center;gap:8px;cursor:pointer;font-size:0.88rem;white-space:nowrap">
              <input type="radio" name="duty-bonus" value="xp"${btype === 'xp' ? ' checked' : ''}> +${deficit} Starting XP
            </label>
            <label style="display:flex;align-items:center;gap:8px;cursor:pointer;font-size:0.88rem;white-space:nowrap">
              <input type="radio" name="duty-bonus" value="credits"${btype === 'credits' ? ' checked' : ''}> +${deficit === 5 ? '1,000' : '2,500'} Starting Credits
            </label>
          </div>` : ''}
        </div>`;

      $('#duty-pills').addEventListener('click', e => {
        const pill = e.target.closest('.arch-pill');
        if (!pill) return;
        state.duty.type = pill.dataset.val === state.duty.type ? '' : pill.dataset.val;
        saveState();
        $('#duty-pills').querySelectorAll('.arch-pill').forEach(p =>
          p.classList.toggle('active', p.dataset.val === state.duty.type));
      });
      c.querySelectorAll('.oms-tile[data-deficit]').forEach(tile => {
        tile.addEventListener('click', () => {
          const def = +tile.dataset.deficit;
          state.duty.deficit = def;
          if (def === 0) state.duty.bonusType = '';
          else if (!state.duty.bonusType) state.duty.bonusType = 'xp';
          saveState(); renderOMS(); renderHeaderXp();
        });
      });
      if (deficit > 0) {
        c.querySelectorAll('input[name="duty-bonus"]').forEach(r =>
          r.addEventListener('change', e => { state.duty.bonusType = e.target.value; saveState(); renderHeaderXp(); }));
      }

    } else {
      const strength = state.morality.strength || '';
      const weakness = state.morality.weakness || '';
      const score    = state.morality.score || 50;
      c.innerHTML = `
        <div class="step-header">
          <h2>Choose Your Morality</h2>
          <p>Every Force and Destiny character has a Morality score reflecting their emotional balance between light and dark. It starts at 50 and shifts based on actions and Conflict throughout play.</p>
        </div>
        <div class="form-group">
          <div class="form-section-title">Emotional Strength &amp; Weakness</div>
          <p style="margin:4px 0 12px;font-size:0.82rem;color:var(--muted)">Select the emotional pair that defines your character's inner nature. The strength guides your highest moments; the weakness pulls at you under pressure.</p>
          <div class="morality-pairs" id="morality-pairs">
            ${MORALITY_PAIRS.map(([str, wk]) => `
              <div class="morality-pair-card${strength === str && weakness === wk ? ' selected' : ''}" data-str="${str}" data-wk="${wk}">
                <div class="morality-pair-strength">${str}</div>
                <div class="morality-pair-weakness">/ ${wk}</div>
              </div>`).join('')}
          </div>
        </div>
        <div class="form-group" style="margin-top:20px">
          <div class="form-section-title">Starting Score</div>
          <p style="margin:4px 0 12px;font-size:0.82rem;color:var(--muted)">Morality thresholds trigger at 30 (dark side) and 70 (light side). Adjust your starting position for an XP tradeoff.</p>
          <div class="oms-bonus-tiles">
            <div class="oms-tile${score >= 70 ? ' selected' : ''}" data-mscore="70">
              <div class="oms-tile-title">Morality 70</div>
              <div class="oms-tile-sub">Start light-aligned</div>
              <div class="oms-tile-bonus oms-tile-cost">-10 Starting XP</div>
            </div>
            <div class="oms-tile${score > 30 && score < 70 ? ' selected' : ''}" data-mscore="50">
              <div class="oms-tile-title">Morality 50</div>
              <div class="oms-tile-sub">Default</div>
            </div>
            <div class="oms-tile${score <= 30 ? ' selected' : ''}" data-mscore="30">
              <div class="oms-tile-title">Morality 30</div>
              <div class="oms-tile-sub">Start dark-aligned</div>
              <div class="oms-tile-bonus">+10 Starting XP</div>
            </div>
          </div>
        </div>`;

      $('#morality-pairs').addEventListener('click', e => {
        const card = e.target.closest('.morality-pair-card');
        if (!card) return;
        const same = state.morality.strength === card.dataset.str && state.morality.weakness === card.dataset.wk;
        state.morality.strength = same ? '' : card.dataset.str;
        state.morality.weakness = same ? '' : card.dataset.wk;
        saveState();
        document.querySelectorAll('.morality-pair-card').forEach(cd =>
          cd.classList.toggle('selected', cd.dataset.str === state.morality.strength && cd.dataset.wk === state.morality.weakness));
      });
      c.querySelectorAll('.oms-tile[data-mscore]').forEach(tile => {
        tile.addEventListener('click', () => {
          state.morality.score = +tile.dataset.mscore;
          saveState(); renderOMS(); renderHeaderXp();
        });
      });
    }
  }

  // ── Step: Details ─────────────────────────────────────────────────────────
  const STRENGTHS = ['Bravery','Caution','Compassion','Creativity','Curiosity','Devotion',
    'Enthusiasm','Forgiveness','Grit','Heroism','Honesty','Inspiration','Justice',
    'Kindness','Loyalty','Mercy','Patience','Pride','Righteousness','Wisdom'];
  const WEAKNESSES = ['Anger','Apathy','Arrogance','Cowardice','Cruelty','Deceit',
    'Fear','Greed','Hate','Hubris','Impatience','Impulsiveness','Jealousy','Laziness',
    'Obsession','Recklessness','Ruthlessness','Selfishness','Vanity','Violence'];

  function renderDetails() {
    const c = $('#step-content');

    function opts(items, selected, empty='-- Select --') {
      return `<option value="">${empty}</option>` +
        items.map(i => `<option value="${esc(i.key)}"${i.key===selected?' selected':''}>${esc(i.name)}</option>`).join('');
    }

    function specificOpts(parentName, selected) {
      const list = parentName ? (SW.specificMotivations||[]).filter(s => s.parent === parentName) : [];
      if (!list.length) return '<option value="">Select a type first</option>';
      return `<option value="">-- Select --</option>` +
        list.map(s => `<option value="${esc(s.key)}"${s.key===selected?' selected':''}>${esc(s.name)}</option>`).join('');
    }

    function getMotivBlurb() {
      const tKey = state.motivationType;
      const sKey = state.motivationSpecific;
      if (!tKey) return '';
      const tBlurb = (SW.blurbs && SW.blurbs.motivations && SW.blurbs.motivations[tKey]) || '';
      if (!sKey) return tBlurb;
      const sName = ((SW.specificMotivations||[]).find(s => s.key === sKey)||{}).name || '';
      return tBlurb + (sName ? '\n\nIn particular, you are driven by ' + sName + '.' : '');
    }

    // Pre-fill blurb text for pre-existing selections (first visit or state upgrade)
    if (!state.beginningsText && state.beginnings)
      state.beginningsText = (SW.blurbs && SW.blurbs.hooks && SW.blurbs.hooks[state.beginnings]) || '';
    if (!state.forceAttitudeText && state.forceAttitude)
      state.forceAttitudeText = (SW.blurbs && SW.blurbs.attitudes && SW.blurbs.attitudes[state.forceAttitude]) || '';
    if (!state.motivationText && state.motivationType)
      state.motivationText = getMotivBlurb();

    const motivName = state.motivationType
      ? ((SW.motivations||[]).find(m => m.key === state.motivationType)||{}).name : '';

    c.innerHTML = `
      <div class="step-header"><h2>Identity</h2>
        <p>Name your character and define their history and motivations.</p></div>
      <div>
        <div class="form-section-title">Identity</div>
        <div class="details-layout">
          <div class="form-group"><label>Character Name *</label>
            <input type="text" id="f-name" placeholder="Enter name..." value="${esc(state.name)}"></div>
          <div class="form-group"><label>Player Name</label>
            <input type="text" id="f-player" placeholder="Your name..." value="${esc(state.player)}"></div>
        </div>

        <div class="form-section-title">Game Mechanics</div>
        <div class="form-group"><label>Beginnings</label>
          <select id="f-beginnings">${opts(SW.hooks||[], state.beginnings)}</select>
          <textarea id="f-beginnings-text" class="blurb-textarea" placeholder="Auto-fills from your Beginnings choice -- edit freely">${esc(state.beginningsText)}</textarea></div>
        <div class="form-group"><label>Attitude Toward the Force</label>
          <select id="f-attitude">${opts(SW.attitudes||[], state.forceAttitude)}</select>
          <textarea id="f-attitude-text" class="blurb-textarea" placeholder="Auto-fills from your Force Attitude choice -- edit freely">${esc(state.forceAttitudeText)}</textarea></div>
        <div class="form-group"><label>Reason for Adventure</label>
          <input type="text" id="f-reason" placeholder="What draws your character into danger?"
            value="${esc(state.reasonForAdventure)}"></div>
        <div class="details-layout">
          <div class="form-group"><label>Motivation Type</label>
            <select id="f-motiv-type">${opts(SW.motivations||[], state.motivationType)}</select></div>
          <div class="form-group"><label>Motivation</label>
            <select id="f-motiv-specific">${specificOpts(motivName, state.motivationSpecific)}</select></div>
        </div>
        <div class="form-group">
          <textarea id="f-motiv-text" class="blurb-textarea" placeholder="Auto-fills from your Motivation choice -- edit freely">${esc(state.motivationText)}</textarea></div>

        <div class="form-section-title">Background</div>
        <div class="form-group">
          <textarea id="f-bg" placeholder="History, personality, appearance...">${esc(state.background)}</textarea></div>
      </div>`;

    $('#f-name').addEventListener('input', e => { state.name = e.target.value; saveState(); renderNav(); });
    $('#f-player').addEventListener('input', e => { state.player = e.target.value; saveState(); });

    $('#f-beginnings').addEventListener('change', e => {
      const oldBlurb = (SW.blurbs && SW.blurbs.hooks && SW.blurbs.hooks[state.beginnings]) || '';
      state.beginnings = e.target.value;
      if (!state.beginningsText || state.beginningsText === oldBlurb) {
        state.beginningsText = (SW.blurbs && SW.blurbs.hooks && SW.blurbs.hooks[state.beginnings]) || '';
        $('#f-beginnings-text').value = state.beginningsText;
      }
      saveState();
    });
    $('#f-beginnings-text').addEventListener('input', e => { state.beginningsText = e.target.value; saveState(); });

    $('#f-attitude').addEventListener('change', e => {
      const oldBlurb = (SW.blurbs && SW.blurbs.attitudes && SW.blurbs.attitudes[state.forceAttitude]) || '';
      state.forceAttitude = e.target.value;
      if (!state.forceAttitudeText || state.forceAttitudeText === oldBlurb) {
        state.forceAttitudeText = (SW.blurbs && SW.blurbs.attitudes && SW.blurbs.attitudes[state.forceAttitude]) || '';
        $('#f-attitude-text').value = state.forceAttitudeText;
      }
      saveState();
    });
    $('#f-attitude-text').addEventListener('input', e => { state.forceAttitudeText = e.target.value; saveState(); });

    $('#f-reason').addEventListener('input', e => { state.reasonForAdventure = e.target.value; saveState(); });

    $('#f-motiv-type').addEventListener('change', e => {
      const oldBlurb = getMotivBlurb();
      state.motivationType = e.target.value;
      state.motivationSpecific = '';
      const parentName = ((SW.motivations||[]).find(m => m.key === state.motivationType)||{}).name || '';
      $('#f-motiv-specific').innerHTML = specificOpts(parentName, '');
      const newBlurb = getMotivBlurb();
      if (!state.motivationText || state.motivationText === oldBlurb) {
        state.motivationText = newBlurb;
        $('#f-motiv-text').value = newBlurb;
      }
      saveState();
    });
    $('#f-motiv-specific').addEventListener('change', e => {
      const oldBlurb = getMotivBlurb();
      state.motivationSpecific = e.target.value;
      const newBlurb = getMotivBlurb();
      if (!state.motivationText || state.motivationText === oldBlurb) {
        state.motivationText = newBlurb;
        $('#f-motiv-text').value = newBlurb;
      }
      saveState();
    });
    $('#f-motiv-text').addEventListener('input', e => { state.motivationText = e.target.value; saveState(); });

    $('#f-bg').addEventListener('input', e => { state.background = e.target.value; saveState(); });
  }

  function esc(s) { return (s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/"/g,'&quot;'); }

  // ── Step: Talents ─────────────────────────────────────────────────────────
  function renderTalents() {
    const c = $('#step-content');
    const spec = Engine.getSpec(state.specKey);
    if (!spec || !spec.talent_tree || !spec.talent_tree.length) {
      c.innerHTML = '<div class="empty-state">Select a specialization first.</div>';
      return;
    }

    const specKey  = state.specKey;
    const conns    = spec.connections || null;   // array of 20 bitmasks, or null for homebrew
    if (!state.talentPurchases)          state.talentPurchases = {};
    if (!state.talentPurchases[specKey]) state.talentPurchases[specKey] = new Array(20).fill(false);
    const purchases = state.talentPurchases[specKey];

    // Flatten talent names to a 20-element array (row-major)
    const names = [];
    for (const row of spec.talent_tree) {
      for (const n of (row.talents || [])) names.push(n);
    }
    while (names.length < 20) names.push('');

    // Connection bitmask helpers (bit0=up, bit1=down, bit2=left, bit3=right)
    function getConn(r, col) {
      if (conns) return conns[r * 4 + col];
      return r === 0 ? 2 : r === 4 ? 1 : 3;  // fallback: vertical chains
    }
    function linked(r1, c1, r2, c2) {
      if (r1 === r2 && c2 === c1 + 1) return !!(getConn(r1,c1) & 8) || !!(getConn(r2,c2) & 4);
      if (r1 === r2 && c2 === c1 - 1) return !!(getConn(r1,c1) & 4) || !!(getConn(r2,c2) & 8);
      if (c1 === c2 && r2 === r1 + 1) return !!(getConn(r1,c1) & 2) || !!(getConn(r2,c2) & 1);
      if (c1 === c2 && r2 === r1 - 1) return !!(getConn(r1,c1) & 1) || !!(getConn(r2,c2) & 2);
      return false;
    }

    function adjacentPurchased(r, col) {
      return [[r-1,col],[r+1,col],[r,col-1],[r,col+1]].some(
        ([nr,nc]) => nr>=0&&nr<5&&nc>=0&&nc<4 && purchases[nr*4+nc] && linked(r,col,nr,nc));
    }
    function canBuy(r, col)   { return !purchases[r*4+col] && !!names[r*4+col] && (r===0 || adjacentPurchased(r,col)); }
    function canSell(r, col) {
      if (!purchases[r*4+col]) return false;
      const temp = [...purchases]; temp[r*4+col] = false;
      // BFS from all purchased row-0 nodes to confirm remaining purchased nodes stay connected
      const visited = new Set();
      const q = [];
      for (let cc=0; cc<4; cc++) { if (temp[cc]) { visited.add(cc); q.push([0,cc]); } }
      while (q.length) {
        const [cr,cc] = q.shift();
        for (const [nr,nc] of [[cr-1,cc],[cr+1,cc],[cr,cc-1],[cr,cc+1]]) {
          if (nr<0||nr>=5||nc<0||nc>=4) continue;
          const ni = nr*4+nc;
          if (visited.has(ni)||!temp[ni]||!linked(cr,cc,nr,nc)) continue;
          visited.add(ni); q.push([nr,nc]);
        }
      }
      return temp.every((p,i) => !p || visited.has(i));
    }

    const COSTS = [5,10,15,20,25];
    const talentXp = purchases.reduce((s,p,i) => p ? s + COSTS[Math.floor(i/4)] : s, 0);

    // Build 7-col × 9-row grid (talent cells on even indices, connectors on odd)
    let cells = '';
    for (let gr=0; gr<9; gr++) {
      for (let gc=0; gc<7; gc++) {
        const isTR = gr%2===0, isTC = gc%2===0;
        const r = gr>>1, col = gc>>1;
        const gRow = gr+1, gCol = gc+1;

        if (isTR && isTC) {
          const idx    = r*4+col;
          const name   = names[idx] || '';
          const bought = purchases[idx];
          const buyable = canBuy(r,col);
          const sellable = bought && canSell(r,col);
          const tal    = name ? Engine.getTalent(name) : null;
          const isActive = tal && tal.activation && !tal.activation.toLowerCase().includes('passive');
          let cls = 'tt-node';
          if (bought)       cls += ' tt-purchased';
          else if (buyable) cls += ' tt-buyable';
          else              cls += ' tt-locked';
          if (isActive)     cls += ' tt-active';
          cells += `<div class="${cls}" data-r="${r}" data-c="${col}"
            data-tip-type="talent" data-tip-name="${name.replace(/"/g,'&quot;')}"
            style="grid-row:${gRow};grid-column:${gCol}">
            <div class="tt-name">${name}</div>
            <div class="tt-meta">${isActive?'Active':'Passive'} &bull; ${COSTS[r]} XP</div>
            ${bought ? '<div class="tt-check">&#10003;</div>' : ''}
          </div>`;

        } else if (isTR && !isTC) {
          const has = linked(r,col,r,col+1);
          const act = has && purchases[r*4+col] && purchases[r*4+col+1];
          cells += `<div class="tt-hconn" style="grid-row:${gRow};grid-column:${gCol}">
            ${has ? `<div class="tt-hline${act?' tt-lit':''}"></div>` : ''}
          </div>`;

        } else if (!isTR && isTC) {
          const has = r<4 && linked(r,col,r+1,col);
          const act = has && purchases[r*4+col] && purchases[(r+1)*4+col];
          cells += `<div class="tt-vconn" style="grid-row:${gRow};grid-column:${gCol}">
            ${has ? `<div class="tt-vline${act?' tt-lit':''}"></div>` : ''}
          </div>`;

        } else {
          cells += `<div style="grid-row:${gRow};grid-column:${gCol}"></div>`;
        }
      }
    }

    c.innerHTML = `
      <div class="step-header">
        <h2>${spec.name}</h2>
        <p>Click a talent to purchase it. You must own an adjacent connected talent to unlock lower rows.
           Talents can be refunded as long as no other purchased talent depends on them as its only path.
           <strong class="tt-xp-spent">${talentXp} XP</strong> spent on talents.</p>
      </div>
      <div class="talent-tree-wrap">
        <div class="tt-grid" id="talent-tree-grid">${cells}</div>
      </div>`;

    // Tooltip on hover (mouseenter/leave only — click is reserved for purchase)
    const grid = $('#talent-tree-grid');
    grid.addEventListener('mouseenter', e => {
      const node = e.target.closest('.tt-node');
      if (!node || !node.dataset.tipName) return;
      showTooltip(node, tooltipContent('talent', node.dataset.tipName));
    }, true);
    grid.addEventListener('mouseleave', e => {
      if (e.target.closest('.tt-node')) hideTooltip();
    }, true);

    grid.addEventListener('click', e => {
      hideTooltip();
      const node = e.target.closest('.tt-node');
      if (!node) return;
      const r = +node.dataset.r, col = +node.dataset.c, idx = r*4+col;
      if (purchases[idx]) {
        if (canSell(r,col)) { purchases[idx]=false; saveState(); renderTalents(); renderHeaderXp(); }
      } else {
        if (canBuy(r,col))  { purchases[idx]=true;  saveState(); renderTalents(); renderHeaderXp(); }
      }
    });
  }

  // ── Step: Equipment ───────────────────────────────────────────────────────
  const EQ_GLYPHS = {
    '[BOOST]': 'boost', '[SETBACK]': 'setback', '[ADVANTAGE]': 'advantage',
    '[THREAT]': 'threat', '[DIFFICULTY]': 'difficulty', '[SUCCESS]': 'success',
    '[FAILURE]': 'failure', '[TRIUMPH]': 'triumph', '[DESPAIR]': 'despair',
    '[FORCE]': 'Force', '[RESTRICTED]': '(R)',
  };
  function glyphify(s) {
    if (!s) return '';
    return s.replace(/\[[A-Z]+\]/g, m => EQ_GLYPHS[m] !== undefined ? EQ_GLYPHS[m] : '');
  }

  const EQ_STORE = {
    weapon: { label: 'Weapons', list: () => SW.weapons || [] },
    armor:  { label: 'Armor',   list: () => SW.armor   || [] },
    gear:   { label: 'Gear',    list: () => SW.gear    || [] },
  };

  function eqBag(cat) {
    if (!state.equipment) state.equipment = { weapon: {}, armor: {}, gear: {} };
    if (!state.equipment[cat]) state.equipment[cat] = {};
    return state.equipment[cat];
  }
  function ownedQty(cat, key) { const l = eqBag(cat)[key]; return l ? l.qty : 0; }

  // The value(s) a given item exposes to the "type" filter
  function itemTypeValues(cat, item) {
    if (cat === 'armor') return item.categories || [];
    return item.type ? [item.type] : [];
  }
  function typeOptionsFor(cat) {
    const set = new Set();
    for (const it of EQ_STORE[cat].list()) for (const t of itemTypeValues(cat, it)) if (t) set.add(t);
    return [...set].sort();
  }

  function priceNum(item) { return typeof item.price === 'number' ? item.price : null; }
  function priceLabel(item) {
    const p = priceNum(item);
    return p === null ? (item.price || '—') : fmtCr(p);
  }
  function dmgDisplay(w) {
    if (w.damage === '' || w.damage === null || w.damage === undefined) return '—';
    return w.damageType === 'add' ? '+' + w.damage : '' + w.damage;
  }
  function rarityLabel(item) {
    const r = typeof item.rarity === 'number' ? item.rarity : null;
    return r === null ? '—' : String(r);
  }

  function renderEquip() {
    const c = $('#step-content');
    if (!state.speciesKey) { c.innerHTML = '<div class="empty-state">Please select a species first.</div>'; return; }
    if (!SW.weapons || !SW.armor || !SW.gear) {
      c.innerHTML = '<div class="empty-state">Equipment data failed to load.</div>'; return;
    }

    const tabs = Object.keys(EQ_STORE).map(cat =>
      `<button class="equip-tab${_eqCat === cat ? ' active' : ''}" data-cat="${cat}">
        ${EQ_STORE[cat].label}<span class="equip-tab-count">${EQ_STORE[cat].list().length}</span>
      </button>`).join('');

    c.innerHTML = `
      <div class="step-header"><h2>Equipment</h2>
        <p>Spend your starting credits on weapons, armor, and gear. Each character begins with
           <strong>500 credits</strong> (plus any granted by Obligation or Duty). Restricted
           <span class="r-badge">R</span> items normally require GM approval &mdash; use
           <strong>Acquire Free</strong> to add anything without spending credits.</p></div>
      <div class="equip-tabs">${tabs}</div>
      <div class="equip-layout">
        <div class="equip-shop">
          <div class="equip-toolbar" id="eq-toolbar"></div>
          <div class="equip-results" id="eq-results"></div>
          <div class="equip-list" id="eq-list"></div>
        </div>
        <aside class="equip-cart" id="eq-cart"></aside>
      </div>`;

    drawToolbar();
    drawList();
    drawCart();

    $('.equip-tabs').addEventListener('click', e => {
      const t = e.target.closest('[data-cat]');
      if (!t) return;
      _eqCat = t.dataset.cat;
      $('.equip-tabs').querySelectorAll('.equip-tab').forEach(b =>
        b.classList.toggle('active', b.dataset.cat === _eqCat));
      drawToolbar(); drawList();
    });

    $('#eq-list').addEventListener('click', e => {
      const btn = e.target.closest('[data-add]');
      if (!btn) return;
      addItem(_eqCat, btn.dataset.add);
    });

    $('#eq-cart').addEventListener('click', e => {
      const el = e.target.closest('[data-act]');
      if (!el) return;
      const { act, cat, key } = el.dataset;
      if (act === 'inc')  setQty(cat, key, ownedQty(cat, key) + 1);
      if (act === 'dec')  setQty(cat, key, ownedQty(cat, key) - 1);
      if (act === 'rm')   setQty(cat, key, 0);
      if (act === 'free') toggleFree(cat, key);
    });
  }

  function drawToolbar() {
    const f = _eqFilter[_eqCat];
    const typeOpts = typeOptionsFor(_eqCat).map(t =>
      `<option value="${esc(t)}"${f.type === t ? ' selected' : ''}>${esc(t)}</option>`).join('');
    const rarOpts = ['', 0,1,2,3,4,5,6,7,8,9,10].map(r =>
      `<option value="${r}"${String(f.rarity) === String(r) ? ' selected' : ''}>${r === '' ? 'Any rarity' : '≤ ' + r}</option>`).join('');

    $('#eq-toolbar').innerHTML = `
      <input type="search" id="eq-q" placeholder="Search ${EQ_STORE[_eqCat].label.toLowerCase()}..." value="${esc(f.q)}">
      <select id="eq-type"><option value="">All types</option>${typeOpts}</select>
      <select id="eq-rarity">${rarOpts}</select>
      <label class="eq-check"><input type="checkbox" id="eq-core"${f.core ? ' checked' : ''}> Core only</label>
      <label class="eq-check"><input type="checkbox" id="eq-afford"${f.afford ? ' checked' : ''}> Affordable</label>
      <label class="eq-check"><input type="checkbox" id="eq-hideR"${f.hideR ? ' checked' : ''}> Hide <span class="r-badge">R</span></label>
      <div class="eq-mode">
        <button class="eq-mode-btn${!_eqMode ? ' active' : ''}" id="eq-mode-buy">Purchase</button>
        <button class="eq-mode-btn${_eqMode ? ' active' : ''}" id="eq-mode-free">Acquire Free</button>
      </div>`;

    $('#eq-q').addEventListener('input', e => { f.q = e.target.value; drawList(); });
    $('#eq-type').addEventListener('change', e => { f.type = e.target.value; drawList(); });
    $('#eq-rarity').addEventListener('change', e => { f.rarity = e.target.value; drawList(); });
    $('#eq-core').addEventListener('change', e => { f.core = e.target.checked; drawList(); });
    $('#eq-afford').addEventListener('change', e => { f.afford = e.target.checked; drawList(); });
    $('#eq-hideR').addEventListener('change', e => { f.hideR = e.target.checked; drawList(); });
    $('#eq-mode-buy').addEventListener('click', () => { _eqMode = false; syncMode(); });
    $('#eq-mode-free').addEventListener('click', () => { _eqMode = true; syncMode(); });
  }

  function syncMode() {
    const buy = $('#eq-mode-buy'), free = $('#eq-mode-free');
    if (buy)  buy.classList.toggle('active', !_eqMode);
    if (free) free.classList.toggle('active', _eqMode);
  }

  function filteredList(cat) {
    const f = _eqFilter[cat];
    const d = Engine.derive(state);
    const rem = d ? d.credits_remaining : 0;
    const q = f.q.trim().toLowerCase();
    return EQ_STORE[cat].list().filter(it => {
      if (q && !it.name.toLowerCase().includes(q)) return false;
      if (f.type && !itemTypeValues(cat, it).includes(f.type)) return false;
      if (f.rarity !== '' && (typeof it.rarity !== 'number' || it.rarity > +f.rarity)) return false;
      if (f.core && !it.core) return false;
      if (f.hideR && it.restricted) return false;
      if (f.afford) { const p = priceNum(it); if (p !== null && p > rem) return false; }
      return true;
    });
  }

  function drawList() {
    const list = filteredList(_eqCat);
    const resEl = $('#eq-results');
    const shown = Math.min(list.length, _EQ_CAP);
    resEl.innerHTML = list.length
      ? `Showing <strong>${shown}</strong>${list.length > _EQ_CAP ? ` of ${list.length} (refine filters to see more)` : ''} &middot; mode: <strong>${_eqMode ? 'Acquire Free' : 'Purchase'}</strong>`
      : '';

    const el = $('#eq-list');
    if (!list.length) { el.innerHTML = '<div class="empty-state">No items match these filters.</div>'; return; }
    el.innerHTML = list.slice(0, _EQ_CAP).map(it => itemRowHtml(_eqCat, it)).join('');
  }

  function statChip(label, val) {
    return `<span class="eq-stat"><i>${label}</i>${val}</span>`;
  }

  function itemRowHtml(cat, it) {
    const owned = ownedQty(cat, it.key);
    const rBadge = it.restricted ? '<span class="r-badge" title="Restricted - normally requires GM approval">R</span>' : '';
    const ownedBadge = owned ? `<span class="eq-owned">Owned &times;${owned}</span>` : '';
    let stats = '';
    if (cat === 'weapon') {
      const quals = (it.qualities || []).map(q =>
        `<span class="eq-qual" title="${esc(glyphify((SW.weaponQualities[q.key]||{}).desc || ''))}">${esc(q.name)}${q.count ? ' ' + q.count : ''}</span>`).join('');
      stats = `
        ${statChip('Dmg', dmgDisplay(it))}
        ${statChip('Crit', it.crit ?? '—')}
        ${statChip('Range', it.range || '—')}
        ${statChip('Enc', it.encumbrance ?? '—')}
        ${statChip('HP', it.hp ?? '—')}
        ${statChip('Rarity', rarityLabel(it))}
        <span class="eq-skill">${esc(it.skill || '')}</span>
        <div class="eq-quals">${quals}</div>`;
    } else if (cat === 'armor') {
      stats = `
        ${statChip('Soak', '+' + (it.soak ?? 0))}
        ${statChip('Def', '+' + (it.defense ?? 0))}
        ${statChip('Enc', it.encumbrance ?? '—')}
        ${statChip('HP', it.hp ?? '—')}
        ${statChip('Rarity', rarityLabel(it))}`;
    } else {
      stats = `
        ${statChip('Enc', it.encumbrance ?? '—')}
        ${statChip('Rarity', rarityLabel(it))}
        ${it.type ? `<span class="eq-skill">${esc(it.type)}</span>` : ''}
        ${it.short ? `<div class="eq-short">${esc(glyphify(it.short))}</div>` : ''}`;
    }
    return `
      <div class="eq-row${owned ? ' owned' : ''}">
        <div class="eq-row-main">
          <div class="eq-row-head"><span class="eq-name">${esc(it.name)}</span>${rBadge}${ownedBadge}</div>
          <div class="eq-stats">${stats}</div>
        </div>
        <div class="eq-row-buy">
          <div class="eq-price">${priceLabel(it)}<i>cr</i></div>
          <button class="btn btn-primary btn-sm" data-add="${it.key}">${_eqMode ? '+ Free' : '+ Buy'}</button>
        </div>
      </div>`;
  }

  function drawCart() {
    const d = Engine.derive(state);
    const el = $('#eq-cart');
    let sections = '';
    let restrictedOwned = 0;
    for (const cat of ['weapon', 'armor', 'gear']) {
      const bag = eqBag(cat);
      const keys = Object.keys(bag).filter(k => bag[k] && bag[k].qty);
      if (!keys.length) continue;
      const rows = keys.map(key => {
        const line = bag[key];
        const it = Engine.getItem(cat, key);
        if (!it) return '';
        if (it.restricted && !line.free) restrictedOwned++;
        const p = priceNum(it);
        const lineCost = line.free ? '<span class="cart-free">FREE</span>'
                                   : (p === null ? '—' : fmtCr(p * line.qty));
        const worn = cat === 'armor' && d && d.worn_armor === key
          ? '<span class="cart-worn" title="Highest-Soak armor: counts toward Soak/Defense">worn</span>' : '';
        return `
          <div class="cart-row">
            <div class="cart-row-top">
              <span class="cart-name">${esc(it.name)}${worn}</span>
              <button class="cart-x" data-act="rm" data-cat="${cat}" data-key="${key}" title="Remove">&times;</button>
            </div>
            <div class="cart-row-ctl">
              <div class="cart-qty">
                <button data-act="dec" data-cat="${cat}" data-key="${key}">&minus;</button>
                <span>${line.qty}</span>
                <button data-act="inc" data-cat="${cat}" data-key="${key}">+</button>
              </div>
              <label class="cart-freebox"><input type="checkbox" data-act="free" data-cat="${cat}" data-key="${key}"${line.free ? ' checked' : ''}> free</label>
              <span class="cart-cost">${lineCost}</span>
            </div>
          </div>`;
      }).join('');
      sections += `<div class="cart-section"><div class="cart-section-title">${EQ_STORE[cat].label}</div>${rows}</div>`;
    }

    const encOver = d && d.encumbrance > d.encumbrance_threshold;
    el.innerHTML = `
      <div class="cart-head">Loadout</div>
      ${sections || '<div class="cart-empty">Nothing acquired yet.<br>Add items from the shop to build your loadout.</div>'}
      <div class="cart-totals">
        <div class="cart-total-row"><span>Spent</span><strong>${d ? fmtCr(d.credits_spent) : 0} cr</strong></div>
        <div class="cart-total-row${d && d.credits_remaining < 0 ? ' cart-neg' : ''}"><span>Remaining</span><strong>${d ? fmtCr(d.credits_remaining) : 0} cr</strong></div>
        <div class="cart-total-row${encOver ? ' cart-warn' : ''}"><span>Encumbrance</span><strong>${d ? d.encumbrance : 0} / ${d ? d.encumbrance_threshold : 5}</strong></div>
      </div>
      ${restrictedOwned ? `<div class="cart-note">${restrictedOwned} restricted item${restrictedOwned > 1 ? 's' : ''} purchased &mdash; normally needs GM approval.</div>` : ''}
      ${d && d.credits_remaining < 0 ? '<div class="cart-note cart-note-warn">You are over budget. Remove items or mark some as free.</div>' : ''}`;
  }

  function afterEquipChange() {
    saveState();
    drawCart();
    renderHeaderCredits();
    // refresh visible rows so owned badges / affordability reflect the new state
    drawList();
  }
  function addItem(cat, key) {
    const bag = eqBag(cat);
    if (bag[key] && bag[key].qty) bag[key].qty++;
    else bag[key] = { qty: 1, free: _eqMode };
    afterEquipChange();
  }
  function setQty(cat, key, qty) {
    const bag = eqBag(cat);
    if (!bag[key]) return;
    if (qty <= 0) delete bag[key];
    else bag[key].qty = qty;
    afterEquipChange();
  }
  function toggleFree(cat, key) {
    const bag = eqBag(cat);
    if (bag[key]) { bag[key].free = !bag[key].free; afterEquipChange(); }
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
    initTheme();
    loadState();
    $('#btn-next').addEventListener('click', next);
    $('#btn-back').addEventListener('click', back);
    $('#btn-settings').addEventListener('click', openThemePanel);
    render();
  }

  return { init };
})();

document.addEventListener('DOMContentLoaded', Wizard.init);
