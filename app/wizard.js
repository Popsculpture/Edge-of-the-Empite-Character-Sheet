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
    rogueone: { title:'Rogue One',     sub:'A Star Wars Story',       bg:'#0c1215', surface:'#141e25', surface2:'#1c2c35', border:'#2C4E61', text:'#DFDDD4', muted:'#73A9C7', accent:'#5FC2EC', accentBg:'rgba(95,194,236,0.12)',  accentBorder:'rgba(95,194,236,0.5)'   },
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

  // ── View mode (mobile / desktop layout) ─────────────────────────────────────
  // The mobile layout is driven by the vp-mobile / vp-xnarrow classes on <html>
  // rather than raw media queries, so the user can force a mode. 'auto' (default)
  // tracks the viewport. An inline <head> script applies this before first paint
  // to avoid a flash; this keeps it in sync on resize and when the user toggles.
  const VIEW_KEY = 'sw_viewmode';
  function getViewMode() { return localStorage.getItem(VIEW_KEY) || 'auto'; }
  function applyViewMode() {
    const mode = getViewMode();
    let mobile, xnarrow;
    if (mode === 'mobile')       { mobile = true;  xnarrow = true; }
    else if (mode === 'desktop') { mobile = false; xnarrow = false; }
    else { // auto: follow the viewport
      mobile  = window.matchMedia('(max-width: 600px)').matches;
      xnarrow = window.matchMedia('(max-width: 400px)').matches;
    }
    const c = document.documentElement.classList;
    c.toggle('vp-mobile', mobile);
    c.toggle('vp-xnarrow', xnarrow);
  }
  function setViewMode(mode) {
    localStorage.setItem(VIEW_KEY, mode);
    applyViewMode();
  }
  function initViewMode() {
    applyViewMode();
    // Keep 'auto' in sync as the window resizes; a no-op when a mode is forced.
    window.addEventListener('resize', () => { if (getViewMode() === 'auto') applyViewMode(); });
  }

  // Play mode trims the tab strip and hides the wizard nav so a completed
  // character reads as a play aid (Sheet, Talents, Gear, Fleet, Reference)
  // instead of a linear build wizard. A global preference like Display/Theme,
  // not tied to any one character, so switching characters keeps it.
  const PLAY_KEY = 'sw_playmode';
  const PLAY_TAB_IDS = ['sheet', 'talents', 'equip', 'vehicle', 'reference'];
  function getPlayMode() { return localStorage.getItem(PLAY_KEY) || 'creation'; }
  function setPlayMode(mode) {
    localStorage.setItem(PLAY_KEY, mode);
    if (mode === 'play') {
      const sheetIx = STEPS.findIndex(s => s.id === 'sheet');
      if (sheetIx >= 0) state.step = sheetIx;
      saveState();
    }
    render();
  }
  // Whenever Play mode is active, state.step must be one of PLAY_TAB_IDS: that
  // trimmed strip is the only navigation (the nav bar is hidden), so landing
  // outside it leaves no tab marked active and no way back in. setPlayMode()
  // keeps this true when the toggle itself is flipped; loading a different
  // character wholesale (roster load / import) replaces state.step from
  // outside that invariant, so re-check it wherever that happens too.
  function ensurePlayStepValid() {
    if (getPlayMode() !== 'play') return;
    const step = STEPS[state.step];
    if (step && PLAY_TAB_IDS.includes(step.id)) return;
    const sheetIx = STEPS.findIndex(s => s.id === 'sheet');
    if (sheetIx >= 0) state.step = sheetIx;
  }

  // Play mode's mobile swipe: move dir (+1/-1) within the play tab order.
  // Clamped at either end rather than wrapping, matching the old Back/Next.
  function swipeChangeTab(dir) {
    const curId = STEPS[state.step] && STEPS[state.step].id;
    const idx = PLAY_TAB_IDS.indexOf(curId);
    if (idx < 0) return;
    const nextIdx = idx + dir;
    if (nextIdx < 0 || nextIdx >= PLAY_TAB_IDS.length) return;
    const target = STEPS.findIndex(s => s.id === PLAY_TAB_IDS[nextIdx]);
    if (target < 0) return;
    state.step = target;
    saveState(); render();
    window.scrollTo(0, 0);
  }
  // The neighboring-tab step in the play order, dir away from the current one
  // (or null at an edge). Used both to gate the swipe gesture and to label
  // the pre-commit indicator with the tab actually being approached.
  function playNeighborStep(dir) {
    const curId = STEPS[state.step] && STEPS[state.step].id;
    const idx = PLAY_TAB_IDS.indexOf(curId);
    if (idx < 0) return null;
    const nextIdx = idx + dir;
    if (nextIdx < 0 || nextIdx >= PLAY_TAB_IDS.length) return null;
    return STEPS.find(s => s.id === PLAY_TAB_IDS[nextIdx]) || null;
  }

  // The floating pill that previews the neighboring tab mid-drag. A single
  // fixed-position element reused across gestures (not a child of the
  // translating #step-content, so it stays anchored to the screen edge while
  // the content slides under/past it).
  let _swipeIndicatorEl = null;
  function ensureSwipeIndicator() {
    if (_swipeIndicatorEl) return _swipeIndicatorEl;
    const el = document.createElement('div');
    el.className = 'swipe-indicator';
    el.innerHTML = '<span class="swipe-indicator-arrow"></span><span class="swipe-indicator-label"></span>';
    document.body.appendChild(el);
    _swipeIndicatorEl = el;
    return el;
  }
  function showSwipeIndicator(dir) {
    const step = playNeighborStep(dir);
    if (!step) return;
    const label = typeof step.tab === 'function' ? step.tab() : step.tab;
    const el = ensureSwipeIndicator();
    el.querySelector('.swipe-indicator-label').textContent = label;
    el.querySelector('.swipe-indicator-arrow').innerHTML = dir === 1 ? '&#8594;' : '&#8592;';
    el.classList.toggle('swipe-indicator-right', dir === 1);
    el.classList.toggle('swipe-indicator-left', dir === -1);
    el.classList.remove('committed');
    el.classList.add('visible');
  }
  // progress: 0 at drag start, 1 at (or past) the commit threshold.
  function updateSwipeIndicator(progress) {
    if (!_swipeIndicatorEl) return;
    const p = Math.max(0, Math.min(1, progress));
    _swipeIndicatorEl.style.opacity = String(0.15 + p * 0.85);
    _swipeIndicatorEl.style.setProperty('--swipe-scale', String(0.85 + p * 0.15));
    _swipeIndicatorEl.classList.toggle('committed', p >= 1);
  }
  function hideSwipeIndicator() {
    if (_swipeIndicatorEl) _swipeIndicatorEl.classList.remove('visible', 'committed');
  }

  function openThemePanel() {
    const modal = $('#theme-modal');
    // Drop any handler from a previous open so re-opening never stacks listeners.
    if (modal._settingsHandler) { modal.removeEventListener('click', modal._settingsHandler); modal._settingsHandler = null; }
    const current = localStorage.getItem('sw_theme') || 'crawl';
    const viewMode = getViewMode();
    const playMode = getPlayMode();
    modal.innerHTML = `
      <div class="theme-modal-inner">
        <div class="theme-modal-header">
          <h3>Settings</h3>
          <button class="theme-close-btn" id="theme-close">&#x2715;</button>
        </div>
        <div class="settings-section-label">Characters</div>
        <div class="roster-bar">
          <select class="roster-select" id="roster-select">${rosterOptionsHtml()}</select>
          <button class="btn btn-secondary btn-sm" data-settings-act="load">Load</button>
          <button class="btn btn-secondary btn-sm" data-settings-act="new">New</button>
          <button class="btn btn-primary btn-sm" data-settings-act="save">Save</button>
          <button class="btn btn-secondary btn-sm" data-settings-act="del">Delete</button>
          <button class="btn btn-secondary btn-sm" data-settings-act="export">Export</button>
          <button class="btn btn-secondary btn-sm" data-settings-act="import">Import</button>
        </div>
        <div class="settings-section-label">Mode</div>
        <div class="view-toggle" id="mode-toggle">
          <button class="view-mode-btn${playMode === 'creation' ? ' active' : ''}" data-mode="creation">Creation</button>
          <button class="view-mode-btn${playMode === 'play' ? ' active' : ''}" data-mode="play">Play</button>
        </div>
        <div class="view-toggle-note">Creation walks through building a character, tab by tab. Play trims the tabs to Sheet, Talents, Gear, Fleet, and Reference for running the character at the table.</div>
        <div class="settings-section-label">Display</div>
        <div class="view-toggle" id="view-toggle">
          <button class="view-mode-btn${viewMode === 'auto' ? ' active' : ''}" data-view="auto">Auto</button>
          <button class="view-mode-btn${viewMode === 'mobile' ? ' active' : ''}" data-view="mobile">Mobile</button>
          <button class="view-mode-btn${viewMode === 'desktop' ? ' active' : ''}" data-view="desktop">Desktop</button>
        </div>
        <div class="view-toggle-note">Auto follows your screen size. Mobile or Desktop forces that layout everywhere.</div>
        <div class="settings-section-label">Color Theme</div>
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
    function close() { modal.classList.add('hidden'); modal.removeEventListener('click', handler); modal._settingsHandler = null; }
    function handler(e) {
      const sw = e.target.closest('[data-theme]');
      if (sw) {
        applyTheme(sw.dataset.theme);
        modal.querySelectorAll('.theme-swatch').forEach(el =>
          el.classList.toggle('ts-active', el.dataset.theme === sw.dataset.theme));
      }
      const vb = e.target.closest('[data-view]');
      if (vb) {
        setViewMode(vb.dataset.view);
        modal.querySelectorAll('#view-toggle .view-mode-btn').forEach(el =>
          el.classList.toggle('active', el.dataset.view === vb.dataset.view));
        return;
      }
      const mb = e.target.closest('[data-mode]');
      if (mb) {
        setPlayMode(mb.dataset.mode);
        modal.querySelectorAll('#mode-toggle .view-mode-btn').forEach(el =>
          el.classList.toggle('active', el.dataset.mode === mb.dataset.mode));
        return;
      }
      const act = e.target.closest('[data-settings-act]');
      if (act) {
        const which = act.dataset.settingsAct;
        if (which === 'load')   { rosterLoad(modal, close); return; }
        if (which === 'new')    { close(); newCharacter(); return; }
        if (which === 'save')   { if (saveToRoster()) { refreshRosterSelect(); flashBtn(act, 'Saved ✓'); } return; }
        if (which === 'del')    { rosterDelete(modal); return; }
        if (which === 'export') { close(); exportCharacterJson(); return; }
        if (which === 'import') { close(); importCharacterJson(); return; }
      }
      if (e.target === modal || e.target.closest('#theme-close')) close();
    }
    modal.classList.remove('hidden');
    modal._settingsHandler = handler;
    modal.addEventListener('click', handler);
  }

  // ── State ─────────────────────────────────────────────────────────────────
  function defaultState() {
    return {
      id: genId(),
      step: 0,
      game: null,
      mechanic: null,          // null = use the game line's native mechanic; or 'obligation' | 'duty' | 'morality'
      speciesKey: null,
      careerKey: null,
      specKey: null,
      characteristics: null,
      freeCareerSkillPicks: [],
      specBonusSkillPicks: [],
      name: '',
      player: '',
      background: '',
      motivation: '',
      obligation:         { type: '', magnitude: 10, bonusType: '', detail: '' },
      duty:               { type: '', deficit: 0, bonusType: '' },
      morality:           { strength: '', weakness: '', score: 50 },
      talentPurchases:    {},
      dedicationChoices:  [],
      woundCur:           0,
      strainCur:          0,
      beginnings:         '',
      forceAttitude:      '',
      reasonForAdventure: '',
      motivationType:     '',
      motivationSpecific: '',
      beginningsText:     '',
      forceAttitudeText:  '',
      reasonText:         '',
      motivationText:     '',
      equipment:          { weapon: {}, armor: {}, gear: {}, weaponSets: [] },
      vehicles:           [],
      creditsAdjustment:  0,   // net credits gained/spent during play, on top of the starting allotment
      xpAdjustment:       0,   // net XP awarded during play, on top of the starting allotment
      notes:              '', // freeform session notes (Play mode)
      contacts:           [], // [{id, name, note}] (Play mode)
    };
  }

  let state = defaultState();

  // UI-only filter state for the species step (persists across re-renders)
  let _spBook       = '';
  let _spArchetypes = new Set();

  // UI-only state for the Vehicle step (persists across re-renders)
  let _vehSelected = null;
  const _vehFilter = { q: '', group: '', sil: '', core: false, afford: false };
  const _VEH_CAP = 150;

  // UI-only state for the Equipment step (persists across re-renders)
  let _eqCat  = 'weapon';   // active storefront: weapon | armor | gear
  let _eqMode = false;      // acquisition mode: false = Purchase, true = Acquire Free
  let _eqSelected = null;   // { cat, key } shown in the detail panel
  const _eqFilter = {
    weapon: { q: '', type: '', skill: '', rarity: '', core: false, afford: false, hideR: false },
    armor:  { q: '', type: '', skill: '', rarity: '', core: false, afford: false, hideR: false },
    gear:   { q: '', type: '', skill: '', rarity: '', core: false, afford: false, hideR: false },
  };
  const _EQ_CAP = 200;      // max rows rendered per storefront (perf guard)

  // Older saves stored an adventure hook in the "beginnings" field. Beginnings now
  // holds a social background, so move a hook value to Reason for Adventure, keeping
  // any prior free-text reason in the background notes. Idempotent and safe to
  // re-run: it only fires when "beginnings" still holds a hook key.
  function migrateDetails(s) {
    if (!s) return;
    const hookKeys = new Set((SW.hooks || []).map(h => h.key));
    const begKeys  = new Set((SW.beginnings || []).map(b => b.key));
    if (s.beginnings && hookKeys.has(s.beginnings) && !begKeys.has(s.beginnings)) {
      if (s.reasonForAdventure && !hookKeys.has(s.reasonForAdventure)) {
        const note = 'Reason for adventure: ' + s.reasonForAdventure;
        s.background = s.background ? (s.background + '\n\n' + note) : note;
      }
      s.reasonForAdventure = s.beginnings;
      s.reasonText = s.beginningsText || '';
      s.beginnings = '';
      s.beginningsText = '';
    }
  }

  function saveState() {
    try { localStorage.setItem('sw_char_v1', JSON.stringify(state)); } catch(e) {}
  }

  function loadState() {
    try {
      const s = localStorage.getItem('sw_char_v1');
      if (s) { state = Object.assign(defaultState(), JSON.parse(s)); migrateDetails(state); saveState(); }
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
    'Astrogation':           'Calculating hyperspace routes and plotting jumps. Use it to program a navicomputer, find faster or safer routes, avoid hazards like gravity wells and mass shadows, and recover when a jump goes wrong. Good rolls shave travel time; a bad one can strand you light-years off course.',
    'Athletics':             'Raw physical exertion: running, jumping, climbing, swimming, and lifting. Use it to scale a wall, leap a gap, sprint from danger, or hold on when the deck pitches. The catch-all for feats of strength and stamina that are not a straight fight.',
    'Brawl':                 'Unarmed and improvised close combat: punches, kicks, grapples, and hitting someone with whatever is in reach. Also covers knuckle plates and similar simple weapons. Your fallback when you are disarmed or want to take a target alive.',
    'Charm':                 'Winning people over with warmth, friendliness, and likability. Use it to make a good first impression, coax a favor, calm a tense room, or get a stranger to open up. It persuades rather than pressures, and works best when the target has no strong reason to distrust you.',
    'Coercion':              'Getting your way through fear, threats, and intimidation. Use it to interrogate a prisoner, back down a crowd, or force cooperation when charm will not do. Fast and effective, but it breeds resentment and can escalate a situation.',
    'Computers':             'Operating, programming, and slicing computer systems and networks. Use it to bypass security, pull or plant data, disable alarms, control droids and building systems remotely, and cover your digital tracks. The core skill for hacking and information warfare.',
    'Cool':                  'Staying composed and ready when you saw trouble coming. It sets your initiative when you are prepared for a fight or expecting a confrontation, and helps you resist attempts to rattle or provoke you. Its counterpart, Vigilance, covers being caught by surprise.',
    'Coordination':          'Balance, agility, and fine full-body control: tumbling, contortion, tightrope walking, and landing safely. Use it to slip free of bonds, squeeze through tight spaces, keep your feet on unstable ground, or reduce damage from a fall.',
    'Core Worlds':           'Knowledge of the wealthy, densely settled heart of the galaxy: its politics, high society, corporations, history, and customs. Use it to recall who holds power on a Core world, navigate elite circles, or judge the weight of a noble house or trade guild.',
    'Deception':             'Lying, misdirection, disguise, and trickery. Use it to bluff past a checkpoint, feint in conversation, plant a false idea, or run a con. Where Charm makes people like you, Deception makes them believe something untrue.',
    'Discipline':            'Mental toughness and self-control. Use it to resist fear, shake off intimidation and mind tricks, push through pain or exhaustion, and master your own darker impulses. Also governs staying focused under psychological pressure.',
    'Education':             'Formal book learning: science, mathematics, law, history, and the knowledge taught in academies and universities. Use it to recall established facts, analyze data, or reason about how the wider, official galaxy works.',
    'Gunnery':               'Firing heavy, mounted, and vehicle-scale weapons: starship cannons, turrets, vehicle guns, and emplaced heavy weapons. This is what you roll from the gunner\'s chair or behind a heavy blaster, as opposed to personal firearms.',
    'Leadership':            'Directing, inspiring, and coordinating other people. Use it to rally allies, give orders that stick, keep a group calm and organized under fire, or command followers. The skill of getting people to act together and follow your lead.',
    'Lightsaber':            'Fighting with a lightsaber or similar energy blade, including strikes, parries, and deflecting blaster bolts. It defaults to Brawn, but certain talents let you swap in a different characteristic to attack with it.',
    'Lore':                  'The obscure and the hidden: myth, legend, ancient history, secret societies, and Force traditions. Use it to recognize an old symbol, recall a forgotten tale, or know something about the Jedi, the Sith, or mysteries most dismiss as superstition.',
    'Mechanics':             'Building, repairing, and modifying machinery, vehicles, droids, weapons, and gear. Use it to patch a hull breach, jury-rig a fix, install upgrades and attachments, disable a device, or keep a battered ship flying. The engineer\'s core skill.',
    'Medicine':              'Diagnosing and treating injury and illness: first aid, surgery, stabilizing the dying, curing poison and disease, and using stimpacks and medical gear. Use it to heal wounds and strain and to keep a badly hurt ally alive.',
    'Melee':                 'Fighting with hand-held weapons: vibroblades, clubs, staves, swords, and improvised gear. Covers armed close-quarters combat other than lightsabers, and rewards both strength and a good weapon.',
    'Negotiation':           'Bargaining, dealmaking, and diplomacy. Use it to haggle a price, broker an agreement, mediate a dispute, or trade concessions. Unlike Charm or Coercion, both sides expect to walk away with something; it is about finding terms.',
    'Outer Rim':             'Knowledge of the lawless frontier: its worlds, spaceports, smuggling routes, local powers, and how things really work far from the Core. Use it to recall a backwater\'s dangers, know who runs a fringe settlement, or find the unofficial channels.',
    'Perception':            'Actively noticing things: spotting a hidden object, catching a faint sound, reading a room, or searching for what is out of place. Use it whenever you are deliberately looking or listening for detail.',
    'Piloting - Planetary':  'Operating atmospheric and ground vehicles: landspeeders, airspeeders, swoops, walkers, and watercraft. Use it for chases, evasive flying, and hard maneuvers within a planet\'s atmosphere or on its surface.',
    'Piloting - Space':      'Flying starships and spacecraft in the void: dogfights, docking, evasive action, and pushing a ship to its limits. The skill for everything from a quiet freighter run to a starfighter duel.',
    'Ranged - Heavy':        'Firing large personal ranged weapons: blaster rifles, bowcasters, disruptors, and other long-arms carried by hand. Your main combat skill at range with a rifle-class weapon.',
    'Ranged - Light':        'Firing small personal ranged weapons: blaster pistols, hold-outs, and thrown weapons like grenades and knives. The skill for sidearms and anything you can throw.',
    'Resilience':            'Physical endurance and toughness: resisting fatigue, hunger, thirst, harsh environments, toxins, and the strain of hard exertion. Use it to keep going when your body wants to quit and to shrug off environmental hardship.',
    'Skulduggery':           'The hands-on side of crime: picking locks, disabling mechanical security, pickpocketing, palming objects, and sleight of hand. Use it to break in the physical way or lift something without being noticed.',
    'Stealth':               'Moving unseen and unheard: hiding, sneaking, tailing a target, and staying out of sight. Use it to avoid detection, slip past guards, or set up an ambush. It is opposed by an observer\'s Perception or Vigilance.',
    'Streetwise':            'Knowing how to operate in the urban underbelly: finding contacts, reading the mood of a district, locating black-market goods and services, and picking up rumors. Use it to get the lay of a rough neighborhood and know who to ask.',
    'Survival':              'Handling the wilderness and the untamed: foraging, tracking, finding shelter and water, handling animals, and enduring the elements. Use it to stay alive off the grid and read the natural world.',
    'Underworld':            'Knowledge of organized crime and the criminal galaxy: syndicates, gangs, black markets, bounty networks, and how illicit business is done. Use it to recall who runs a cartel, understand criminal etiquette, or know the going rate for illegal work.',
    'Vigilance':             'Baseline alertness to danger you did not see coming. It sets your initiative when a fight breaks out by surprise, and reflects how quickly you react to an ambush. Its counterpart, Cool, covers the times you were ready and waiting.',
    'Xenology':              'Knowledge of alien species and life: their biology, cultures, languages, customs, and history. Use it to recall how a species thinks, avoid a cultural blunder, or exploit a creature\'s weakness.',
    'Warfare':               'Military knowledge: strategy, tactics, doctrine, chains of command, fortifications, and the history of armed conflict. Use it to plan an operation, anticipate an enemy\'s moves, or understand how a fighting force is organized.',
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
  // Pop-outs are tap-to-open / tap-to-close, with no hover anywhere. showTooltip
  // records the anchor so re-tapping the same trigger toggles it shut; tapping
  // the pop-out itself or anywhere outside a trigger dismisses it (see the global
  // handler wired up by initTooltipDismiss in init()).
  let _tooltipEl = null;
  let _tipAnchor = null;

  function ensureTooltip() {
    if (_tooltipEl) return _tooltipEl;
    _tooltipEl = document.createElement('div');
    _tooltipEl.id = 'sw-tooltip';
    _tooltipEl.className = 'sw-tooltip';
    _tooltipEl.style.display = 'none';
    document.body.appendChild(_tooltipEl);
    return _tooltipEl;
  }

  function showTooltip(anchor, html) {
    const tt = ensureTooltip();
    _tipAnchor = anchor;
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
    if (_tooltipEl) _tooltipEl.style.display = 'none';
    _tipAnchor = null;
  }

  // Dismiss the open pop-out on any tap that is not on a tip trigger or a talent
  // node (those manage their own pop-out). Bound once. Because triggers
  // stopPropagation their own taps, opening a pop-out never reaches this handler,
  // so the pop-out stays open while you move between triggers.
  function initTooltipDismiss() {
    document.addEventListener('click', e => {
      if (!_tooltipEl || _tooltipEl.style.display === 'none') return;
      if (e.target.closest('[data-tip-type]') || e.target.closest('.tt-node')) return;
      hideTooltip();
    });
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
    if (type === 'quality') {
      // data-tip-name carries the quality key (e.g. "ACCURATE"); fall back to a
      // name match so a display name still resolves.
      const q = (SW.weaponQualities || {})[name] ||
        Object.values(SW.weaponQualities || {}).find(x => x.name.toLowerCase() === name.toLowerCase());
      if (!q) return `<div class="tt-title">${esc(name)}</div>`;
      const glyph = (typeof Reference !== 'undefined' && Reference.symbols)
        ? Reference.symbols(q.desc || '') : glyphify(q.desc || '');
      return `<div class="tt-title">${q.name}</div>
              <div class="tt-meta">Weapon Quality &bull; ${q.ranked ? 'Ranked' : 'Not Ranked'}</div>
              ${glyph ? `<div class="tt-body">${glyph}</div>` : ''}`;
    }
    return `<div class="tt-title">${name}</div>`;
  }

  // Tap a tip element (skill tag, talent cell, tip-link, etc.) to toggle its
  // pop-out. No hover. Capture phase + stopPropagation so the tap opens the
  // description without also triggering the surrounding card/row selection;
  // re-tapping the same trigger closes it. Used for every tip container,
  // including ones whose elements are themselves selection targets.
  function initTipListeners(container) {
    container.addEventListener('click', e => {
      const link = e.target.closest('[data-tip-type]');
      if (!link) return;
      e.stopPropagation();
      const tt = ensureTooltip();
      if (tt.style.display !== 'none' && _tipAnchor === link) { hideTooltip(); return; }
      showTooltip(link, tooltipContent(link.dataset.tipType, link.dataset.tipName, link.dataset.tipSp));
    }, true);
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
    { id: 'skills',  label: 'Skills',          tab: 'Skills',
                     valid: () => {
                       const spec = Engine.getSpec(state.specKey);
                       const need = spec ? Math.min(2, Engine.specBonusSkillKeys(spec).length) : 2;
                       return (state.freeCareerSkillPicks || []).length === 4
                           && (state.specBonusSkillPicks || []).length === need;
                     } },
    { id: 'oms',     label: () => ({ obligation: 'Obligation', duty: 'Duty', morality: 'Morality' })[Engine.activeMechanic(state)],
                     tab:   () => ({ obligation: 'Oblig.',     duty: 'Duty', morality: 'Morality' })[Engine.activeMechanic(state)],
                     valid: () => true },
    { id: 'chars',   label: 'Characteristics', tab: 'Attrs',    valid: () => true },
    { id: 'talents', label: 'Talents',         tab: 'Talents',  valid: () => true },
    { id: 'equip',   label: 'Equipment',       tab: 'Gear',     valid: () => true },
    { id: 'vehicle', label: 'Fleet',           tab: 'Fleet',    valid: () => true },
    { id: 'sheet',   label: 'Sheet',           tab: 'Sheet',    valid: () => true },
    { id: 'reference', label: 'Reference',     tab: 'Ref.',     valid: () => true },
  ];

  // ── DOM helpers ────────────────────────────────────────────────────────────
  const $ = sel => document.querySelector(sel);

  function skillName(key) { const s = Engine.getSkill(key); return s ? s.name : key; }
  function skillChar(key) { const s = Engine.getSkill(key); return s ? s.characteristic.slice(0,3).toUpperCase() : ''; }

  // Strip scraped wiki markup / leading "and " from a skill display name
  function cleanSkillName(name) {
    return String(name || '')
      .replace(/\[\[[^\]|]*\|/g, '')
      .replace(/[\[\]]/g, '')
      .replace(/^\s*and\s+/i, '')
      .trim();
  }

  // ── Main render ────────────────────────────────────────────────────────────
  function render() {
    // Set body classes before rendering the step: Sheet.render() reads
    // body.play-mode (via document.body.classList) to decide whether to show
    // the Play-mode-only Notes & Contacts panel, so it must already be current.
    document.body.classList.toggle('on-sheet', STEPS[state.step].id === 'sheet');
    document.body.classList.toggle('play-mode', getPlayMode() === 'play');
    renderProgress();
    renderStep();
    renderNav();
    renderHeaderXp();
    renderHeaderCredits();
  }

  // A step is reachable by clicking if it is the current/earlier step (going back
  // is always allowed) or every gate between here and there passes (same rule as
  // pressing Next repeatedly), so a jump never lands on an unmet-prerequisite screen.
  function canJumpTo(target) {
    if (target <= state.step) return true;
    // The Reference tab is static rules with no prerequisites, so it is always
    // reachable (you should be able to check the rules at any point).
    if (STEPS[target] && STEPS[target].id === 'reference') return true;
    // In Play mode the tab strip only ever renders the play tabs (Sheet, Talents,
    // Gear, Fleet, Reference), which are all valid()=>true already; skip the gate
    // walk so an incomplete build step hidden behind them can never lock one out.
    if (getPlayMode() === 'play') return true;
    for (let k = state.step; k < target; k++) {
      if (!STEPS[k].valid()) return false;
    }
    return true;
  }

  function renderProgress() {
    const container = $('#progress-steps');
    const inPlay = getPlayMode() === 'play';
    // Play mode shows only the play tabs, in their own fixed order, rather than
    // every build step; "done" (an earlier-step checkmark) only means something
    // for the linear creation order, so Play mode marks just the active tab.
    const indices = inPlay
      ? PLAY_TAB_IDS.map(id => STEPS.findIndex(s => s.id === id)).filter(i => i >= 0)
      : STEPS.map((_, i) => i);
    container.innerHTML = indices.map(i => {
      const step = STEPS[i];
      // Require valid() too, not just position: Play mode's forced jump to Sheet
      // (setPlayMode) can leave state.step past build steps that were never
      // actually filled in, and "done" should never contradict "not valid yet".
      const cls = i === state.step ? 'active' : inPlay ? '' : (i < state.step && step.valid() ? 'done' : '');
      const reach = i === state.step ? '' : canJumpTo(i) ? 'clickable' : 'locked';
      const tab = typeof step.tab === 'function' ? step.tab() : step.tab;
      return `<div class="progress-step ${cls} ${reach}" data-step="${i}">${tab}</div>`;
    }).join('');
    // On narrow screens the tab strip scrolls horizontally; keep the active
    // tab centered in view so the user never loses their place after Next/Back.
    const act = container.querySelector('.progress-step.active');
    if (act && act.scrollIntoView) {
      requestAnimationFrame(() => act.scrollIntoView({ inline: 'center', block: 'nearest' }));
    }
  }

  function renderNav() {
    const btnBack = $('#btn-back');
    const btnNext = $('#btn-next');
    const status  = $('#nav-status');
    const isLast  = state.step === STEPS.length - 1;

    btnBack.classList.toggle('hidden', state.step === 0);
    // The last step (Sheet) has no Next; "New Character" lives in the settings panel.
    btnNext.classList.toggle('hidden', isLast);
    if (!isLast) { btnNext.innerHTML = 'Next &#8594;'; btnNext.disabled = !STEPS[state.step].valid(); }
    status.textContent = `Step ${state.step + 1} of ${STEPS.length}`;
    renderProgress();   // keep tab reachability (clickable/locked) in sync with validity
  }

  function renderHeaderXp() {
    const bar = $('#header-xp');
    const XP_STEPS = new Set(['oms', 'chars', 'talents']);
    if (!state.speciesKey || !XP_STEPS.has(STEPS[state.step].id)) { bar.classList.add('hidden'); return; }
    const d = Engine.derive(state);
    if (!d) return;
    bar.className = 'header-xp' + (d.xp_remaining < 0 ? ' xp-warn' : '');
    if (getPlayMode() === 'play') {
      // Play mode drops the starting/breakdown framing: just the spendable
      // balance, lifetime spend, and a spot to bank a session's XP award.
      bar.innerHTML = `
        <span class="xp-remain">Balance <strong>${d.xp_remaining}</strong></span>
        <span>Spent <strong>${d.xp_spent}</strong></span>
        <span class="hdr-adjust">
          <input type="number" id="xp-adjust-amt" class="hdr-adjust-amt" placeholder="Amount" inputmode="numeric">
          <button class="hdr-adjust-btn" data-xp-act="add">+ Add XP</button>
        </span>`;
      return;
    }
    bar.innerHTML = `
      <span>Starting XP <strong>${d.starting_xp}</strong></span>
      <span>Spent <strong>${d.xp_spent}</strong></span>
      <span class="xp-remain">Remaining <strong>${d.xp_remaining}</strong></span>`;
  }

  function renderHeaderCredits() {
    const bar = $('#header-credits');
    if (!bar) return;
    const stepId = STEPS[state.step].id;
    if (!state.speciesKey || (stepId !== 'equip' && stepId !== 'vehicle')) { bar.classList.add('hidden'); return; }
    const d = Engine.derive(state);
    if (!d) { bar.classList.add('hidden'); return; }
    bar.className = 'header-credits' + (d.credits_remaining < 0 ? ' cr-warn' : '');
    if (getPlayMode() === 'play') {
      // Play mode drops the starting/breakdown framing: just the spendable
      // balance and a spot to deposit loot or withdraw for an off-sheet spend.
      bar.innerHTML = `
        <span class="cr-remain">Balance <strong>${fmtCr(d.credits_remaining)}</strong></span>
        <span class="hdr-adjust">
          <input type="number" id="credits-adjust-amt" class="hdr-adjust-amt" placeholder="Amount" inputmode="numeric">
          <button class="hdr-adjust-btn" data-credits-act="deposit">+ Deposit</button>
          <button class="hdr-adjust-btn" data-credits-act="withdraw">&minus; Withdraw</button>
        </span>`;
      return;
    }
    bar.innerHTML = `
      <span>Starting Credits <strong>${fmtCr(d.starting_credits)}</strong></span>
      <span>Spent <strong>${fmtCr(d.credits_spent)}</strong></span>
      <span class="cr-remain">Remaining <strong>${fmtCr(d.credits_remaining)}</strong></span>`;
  }

  // Play mode: bank a session's credits or XP against the running balance.
  // The amount input is cleared for free by the header re-render that follows.
  function applyCreditsAdjust(sign) {
    const input = $('#credits-adjust-amt');
    let amt = Math.abs(Math.round(parseFloat(input && input.value) || 0));
    if (!amt) return;
    // Real currency: a withdrawal can only take out what is actually there.
    // (This control only renders in Play mode, so no separate mode check.)
    if (sign < 0) {
      const d = Engine.derive(state);
      const remaining = d ? d.credits_remaining : 0;
      amt = Math.min(amt, Math.max(0, remaining));
      if (!amt) return;
    }
    state.creditsAdjustment = (state.creditsAdjustment || 0) + sign * amt;
    saveState(); render();
  }
  function applyXpAdjust() {
    const input = $('#xp-adjust-amt');
    const amt = Math.abs(Math.round(parseFloat(input && input.value) || 0));
    if (!amt) return;
    state.xpAdjustment = (state.xpAdjustment || 0) + amt;
    saveState(); render();
  }

  // Play mode's Contacts list on the sheet. Add/remove change the row count,
  // so they re-render; typing a name/note is handled by the delegated input
  // listener below (no re-render, so focus is kept while typing).
  function addContact() {
    if (!state.contacts) state.contacts = [];
    state.contacts.push({ id: genId(), name: '', note: '' });
    saveState(); render();
  }
  function removeContact(id) {
    state.contacts = (state.contacts || []).filter(c => c.id !== id);
    saveState(); render();
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
                  vehicle: renderVehicle, sheet: renderSheet, reference: renderReference };
    fns[STEPS[state.step].id]();
  }

  // ── Step: Game ─────────────────────────────────────────────────────────────
  const MECH_META = {
    obligation: { label: 'Obligation' },
    duty:       { label: 'Duty' },
    morality:   { label: 'Morality' },
  };
  const NATIVE_MECH = { eote: 'obligation', aor: 'duty', fad: 'morality' };

  function renderGame() {
    const c = $('#step-content');
    c.innerHTML = `
      <div class="step-header"><h2>Choose Your Game</h2>
        <p>Select which Star Wars RPG system you are playing.</p></div>
      <div class="game-cards" id="game-cards"></div>
      <div id="mechanic-override"></div>`;

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
          state.game = id; state.mechanic = null; state.careerKey = null;
          state.specKey = null; state.freeCareerSkillPicks = []; state.specBonusSkillPicks = [];
        }
        saveState(); render();
      });
      $('#game-cards').appendChild(card);
    }
    renderMechanicOverride();
  }

  // A mixed-line party can agree to share one campaign mechanic instead of running all
  // three at once (an officially supported option). This selector lets a character run on
  // a mechanic other than its game line's default, e.g. a Force and Destiny PC on Obligation.
  function renderMechanicOverride() {
    const host = $('#mechanic-override');
    if (!host) return;
    if (!state.game) { host.innerHTML = ''; return; }
    const native = NATIVE_MECH[state.game];
    const active = Engine.activeMechanic(state);
    const pills = Object.keys(MECH_META).map(m =>
      `<span class="arch-pill${m === active ? ' active' : ''}" data-mech="${m}">${MECH_META[m].label}${m === native ? ' <em style="font-style:normal;opacity:0.65">(default)</em>' : ''}</span>`
    ).join('');
    host.innerHTML = `
      <div class="form-group" style="margin-top:8px;max-width:760px">
        <div class="form-section-title">Campaign Mechanic</div>
        <p style="margin:4px 0 12px;font-size:0.82rem;color:var(--muted)">Your line uses <strong>${MECH_META[native].label}</strong> by default. For a mixed-line party that wants everyone on one mechanic, choose a different one here.${active !== native ? ` This character will use the <strong>${MECH_META[active].label}</strong> rules for session events and the starting-resource tradeoff.` : ''}</p>
        <div class="arch-pills" id="mech-pills">${pills}</div>
        ${state.game === 'fad' && active !== 'morality'
          ? `<p style="margin:10px 0 0;font-size:0.78rem;color:var(--muted)">As a Force and Destiny character you can still record a Morality (light/dark and Conflict) on the next step; it just will not drive your starting XP.</p>`
          : ''}
      </div>`;
    $('#mech-pills').addEventListener('click', e => {
      const pill = e.target.closest('.arch-pill');
      if (!pill) return;
      state.mechanic = pill.dataset.mech === native ? null : pill.dataset.mech;   // store null when it matches native
      saveState(); render();
    });
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
      </div>
      <div class="arch-pills" id="sp-arch">${archPills}</div>
      <div class="species-grid" id="sp-grid"></div>`;

    function draw() {
      const grid = $('#sp-grid');
      const search = ($('#sp-search').value || '').toLowerCase();
      grid.innerHTML = '';

      const list = SW.species.filter(sp => {
        if (sp.homebrew) return false;
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
          state.careerKey = ca.key; state.specKey = null; state.freeCareerSkillPicks = []; state.specBonusSkillPicks = [];
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
      </div>
      <div class="spec-grid" id="spec-grid"></div>`;

    function draw() {
      const grid = $('#spec-grid');
      const filter     = ($('#spec-search').value || '').toLowerCase();
      const careerOnly = $('#career-only').checked;
      const cName      = career ? career.name : '';
      grid.innerHTML   = '';

      const list = SW.specializations.filter(s => {
        if (s.homebrew) return false;
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
          </div>
          ${blurb ? `<p class="career-blurb" style="margin-bottom:10px">${blurb}</p>` : ''}
          <div class="skill-tags" style="margin-bottom:10px">${bonusTags}</div>
          <div class="talent-tree">${treeHtml}</div>`;

        card.addEventListener('click', () => {
          if (state.specKey !== sp.key) { state.specKey = sp.key; state.freeCareerSkillPicks = []; state.specBonusSkillPicks = []; }
          saveState(); draw(); renderNav();
        });
        grid.appendChild(card);
      }
    }

    draw();
    $('#spec-search').addEventListener('input', draw);
    $('#career-only').addEventListener('change', draw);
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

    const careerKeys   = career.career_skill_keys || [];
    const bonusNames   = spec.bonus_career_skills || [];
    const bonusResolved= bonusNames.map(n => Engine.nameToKey(n));  // aligned to bonusNames; null if unresolvable
    const bonusKeySet  = new Set(bonusResolved.filter(Boolean));
    const bonusNeeded  = Math.min(2, bonusKeySet.size);

    c.innerHTML = `
      <div class="step-header"><h2>Starting Skills</h2>
        <p>Pick <strong>4 of 8</strong> career skills and <strong>2 of 4</strong> specialization skills to gain one free rank in each. A skill chosen in both lists starts at Rank 2.</p></div>
      <div class="skills-layout">
        <div class="skills-section">
          <h3>Career Skills &mdash; <span id="career-counter">0 / 4 chosen</span></h3>
          <div id="career-picks"></div>
        </div>
        <div class="skills-section">
          <h3>${spec.name} Bonus Skills${bonusNeeded ? ` &mdash; <span id="bonus-counter">0 / ${bonusNeeded} chosen</span>` : ''}</h3>
          <div id="bonus-list"></div>
          ${bonusNeeded ? `<p style="margin-top:14px;font-size:0.78rem;color:var(--muted)">
            All four are career skills (cheaper to raise later); choose <strong>two</strong> for a free rank.
            Skills marked <span style="color:var(--accent)">★</span> also appear in the career list and start at Rank 2 if chosen in both.</p>`
          : `<p style="margin-top:14px;font-size:0.78rem;color:var(--muted)">
            This specialization grants no bonus career skills; it provides a Force rating and Force powers instead.</p>`}
        </div>
      </div>`;

    function rankOf(key) {
      const cP = state.freeCareerSkillPicks || [];
      const bP = state.specBonusSkillPicks  || [];
      return (cP.includes(key) ? 1 : 0) + (bP.includes(key) ? 1 : 0);
    }

    function refresh() {
      const cPicks = state.freeCareerSkillPicks || [];
      const bPicks = state.specBonusSkillPicks  || [];
      $('#career-counter').textContent = `${cPicks.length} / 4 chosen`;
      const bonusCounterEl = $('#bonus-counter');
      if (bonusCounterEl) bonusCounterEl.textContent = `${bPicks.length} / ${bonusNeeded} chosen`;

      // Career skills: pick 4 of 8
      const pickList = $('#career-picks');
      pickList.innerHTML = '';
      for (const key of careerKeys) {
        const picked  = cPicks.includes(key);
        const overlap = bonusKeySet.has(key);
        const isR2    = picked && rankOf(key) === 2;
        const cls = 'skill-pick-row' + (isR2 ? ' rank2' : picked ? ' selected' : '');
        const row = document.createElement('div');
        row.className = cls;
        row.innerHTML = `
          <div class="skill-pick-check">${picked ? '✓' : ''}</div>
          <span class="skill-pick-name" data-tip-type="skill" data-tip-name="${skillName(key).replace(/"/g,'&quot;')}">${skillName(key)}${overlap ? ' <span style="color:var(--accent)">★</span>' : ''}</span>
          <span class="skill-pick-char">${skillChar(key)}</span>
          <span class="skill-pick-rank">${picked ? (isR2 ? 'Rank 2' : 'Rank 1') : ''}</span>`;
        row.addEventListener('click', () => {
          const idx = cPicks.indexOf(key);
          if (idx !== -1) cPicks.splice(idx, 1);
          else if (cPicks.length < 4) cPicks.push(key);
          state.freeCareerSkillPicks = cPicks;
          saveState(); refresh(); renderNav(); hideTooltip();
        });
        pickList.appendChild(row);
      }

      // Specialization bonus skills: pick 2 of 4
      const bonusList = $('#bonus-list');
      bonusList.innerHTML = '';
      for (let i = 0; i < bonusNames.length; i++) {
        const key     = bonusResolved[i];
        const display = cleanSkillName(bonusNames[i]);
        const inCar   = key && careerKeys.includes(key);
        const picked  = key && bPicks.includes(key);
        const isR2    = picked && rankOf(key) === 2;
        const cls = 'skill-pick-row' + (isR2 ? ' rank2' : picked ? ' selected' : '') + (key ? '' : ' disabled');
        const tipAttr = key ? ` data-tip-type="skill" data-tip-name="${skillName(key).replace(/"/g,'&quot;')}"` : '';
        const row = document.createElement('div');
        row.className = cls;
        row.innerHTML = `
          <div class="skill-pick-check">${picked ? '✓' : ''}</div>
          <span class="skill-pick-name"${tipAttr}>${esc(display)}${inCar ? ' <span style="color:var(--accent)">★</span>' : ''}</span>
          <span class="skill-pick-rank">${picked ? (isR2 ? 'Rank 2' : 'Rank 1') : ''}</span>`;
        if (key) row.addEventListener('click', () => {
          const idx = bPicks.indexOf(key);
          if (idx !== -1) bPicks.splice(idx, 1);
          else if (bPicks.length < bonusNeeded) bPicks.push(key);
          state.specBonusSkillPicks = bPicks;
          saveState(); refresh(); renderNav(); hideTooltip();
        });
        bonusList.appendChild(row);
      }
    }

    refresh();
    initTipListeners($('.skills-layout'));
  }

  // ── Step: OMS (Obligation / Duty / Morality) ──────────────────────────────
  const OBLIGATIONS = ['Addiction','Betrayal','Blackmail','Bounty','Criminal','Debt',
    'Dutybound','Family','Favor','Oath','Obsession','Responsibility','Revenge','Superstition'];

  // Thematic placeholder prompts shown in the Obligation detail field
  const OBLIGATION_BLURBS = {
    Addiction:      'A craving you cannot shake has its hooks in you. What is the vice, who supplies it, and what do you risk to feed it?',
    Betrayal:       'A trust was broken, by you or against you. Who was betrayed, why, and what reckoning still hangs over you?',
    Blackmail:      'Someone holds a secret over your head. What do they know, who are they, and what do they demand for their silence?',
    Bounty:         'There is a price on your head. Who posted it, what did you do to earn it, and who comes hunting?',
    Criminal:       'The law remembers your crimes. What did you do, which authority wants you, and what happens if they catch you?',
    Debt:           'You owe more than you can easily repay. Who is the creditor, how much is owed, and what do they do when you fall behind?',
    Dutybound:      'You are sworn to a cause or an organization. Who commands your loyalty, and what do they ask of you in return?',
    Family:         'Blood binds you to others. Who is your kin, what do they expect of you, and what would you sacrifice for them?',
    Favor:          'You owe a debt that credits cannot settle. Who came through for you once, and what might they call in one day?',
    Oath:           'You swore a binding promise. What is the vow, to whom did you make it, and what does breaking it cost you?',
    Obsession:      'A fixation drives you past reason. What consumes your thoughts, and how far will you go to satisfy it?',
    Responsibility: 'Others depend on you to survive. Who relies on your protection or support, and what do you risk to provide it?',
    Revenge:        'A wrong demands an answer. Who hurt you, what did they take, and how do you intend to settle the score?',
    Superstition:   'Omens and rituals govern your choices. What signs do you heed, and what will you do to stay in their favor?',
  };
  function obligationPrompt(type) {
    return OBLIGATION_BLURBS[type] || 'Choose an Obligation type above, then describe its specifics in your own words.';
  }
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
    const mech = Engine.activeMechanic(state);

    if (mech === 'obligation') {
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
          <select id="obl-type" class="oms-select">
            <option value="">-- Select an Obligation --</option>
            ${OBLIGATIONS.map(o => `<option value="${o}"${state.obligation.type === o ? ' selected' : ''}>${o}</option>`).join('')}
          </select>
          <textarea id="obl-detail" class="blurb-textarea" rows="3"
            placeholder="${esc(obligationPrompt(state.obligation.type))}">${esc(state.obligation.detail || '')}</textarea>
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

      $('#obl-type').addEventListener('change', e => {
        state.obligation.type = e.target.value;
        $('#obl-detail').setAttribute('placeholder', obligationPrompt(state.obligation.type));
        saveState();
      });
      $('#obl-detail').addEventListener('input', e => {
        state.obligation.detail = e.target.value;
        saveState();
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

    } else if (mech === 'duty') {
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
      renderMorality(c, true);
    }

    // A Force and Destiny character running a different campaign mechanic can still
    // track Morality (light/dark standing + Conflict); it does not affect starting XP.
    if (state.game === 'fad' && mech !== 'morality') {
      const extra = document.createElement('div');
      c.appendChild(extra);
      renderMorality(extra, false);
    }
  }

  // primary=true: Morality is the active campaign mechanic (full step, with the XP tradeoff).
  // primary=false: a secondary Force-side tracker for a FaD PC running another mechanic; the
  // score is recorded for play (light/dark, Conflict) but does not change starting XP.
  function renderMorality(host, primary) {
    const strength = state.morality.strength || '';
    const weakness = state.morality.weakness || '';
    const score    = state.morality.score || 50;
    const otherMech = ({ obligation: 'Obligation', duty: 'Duty' })[Engine.activeMechanic(state)] || 'chosen';
    const header = primary
      ? `<div class="step-header">
          <h2>Choose Your Morality</h2>
          <p>Every Force and Destiny character has a Morality score reflecting their emotional balance between light and dark. It starts at 50 and shifts based on actions and Conflict throughout play.</p>
        </div>`
      : `<div class="form-section-title" style="margin-top:28px;padding-top:18px;border-top:1px solid var(--border)">Force Morality <span style="font-weight:400;color:var(--muted);font-size:0.85em">(optional)</span></div>
         <p style="margin:4px 0 14px;font-size:0.82rem;color:var(--muted)">You are running on the ${otherMech} mechanic, but as a Force user you can still track light/dark standing and Conflict here. This does not change your starting XP.</p>`;
    const scoreTiles = primary
      ? `<div class="oms-tile${score >= 70 ? ' selected' : ''}" data-mscore="70">
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
            </div>`
      : `<div class="oms-tile${score >= 70 ? ' selected' : ''}" data-mscore="70">
              <div class="oms-tile-title">Morality 70</div>
              <div class="oms-tile-sub">Light-aligned</div>
            </div>
            <div class="oms-tile${score > 30 && score < 70 ? ' selected' : ''}" data-mscore="50">
              <div class="oms-tile-title">Morality 50</div>
              <div class="oms-tile-sub">Balanced</div>
            </div>
            <div class="oms-tile${score <= 30 ? ' selected' : ''}" data-mscore="30">
              <div class="oms-tile-title">Morality 30</div>
              <div class="oms-tile-sub">Dark-aligned</div>
            </div>`;
    host.innerHTML = `
        ${header}
        <div class="form-group">
          <div class="form-section-title">Emotional Strength &amp; Weakness</div>
          <p style="margin:4px 0 12px;font-size:0.82rem;color:var(--muted)">Select the emotional pair that defines your character's inner nature. The strength guides your highest moments; the weakness pulls at you under pressure.</p>
          <div class="morality-pairs">
            ${MORALITY_PAIRS.map(([str, wk]) => `
              <div class="morality-pair-card${strength === str && weakness === wk ? ' selected' : ''}" data-str="${str}" data-wk="${wk}">
                <div class="morality-pair-strength">${str}</div>
                <div class="morality-pair-weakness">/ ${wk}</div>
              </div>`).join('')}
          </div>
        </div>
        <div class="form-group" style="margin-top:20px">
          <div class="form-section-title">Starting Score</div>
          <p style="margin:4px 0 12px;font-size:0.82rem;color:var(--muted)">Morality thresholds trigger at 30 (dark side) and 70 (light side).${primary ? ' Adjust your starting position for an XP tradeoff.' : ''}</p>
          <div class="oms-bonus-tiles">
            ${scoreTiles}
          </div>
        </div>`;

    host.querySelector('.morality-pairs').addEventListener('click', e => {
      const card = e.target.closest('.morality-pair-card');
      if (!card) return;
      const same = state.morality.strength === card.dataset.str && state.morality.weakness === card.dataset.wk;
      state.morality.strength = same ? '' : card.dataset.str;
      state.morality.weakness = same ? '' : card.dataset.wk;
      saveState();
      host.querySelectorAll('.morality-pair-card').forEach(cd =>
        cd.classList.toggle('selected', cd.dataset.str === state.morality.strength && cd.dataset.wk === state.morality.weakness));
    });
    host.querySelectorAll('.oms-tile[data-mscore]').forEach(tile => {
      tile.addEventListener('click', () => {
        state.morality.score = +tile.dataset.mscore;
        saveState(); renderOMS(); renderHeaderXp();
      });
    });
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
    migrateDetails(state);   // move any legacy hook out of Beginnings before render

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
      state.beginningsText = (SW.blurbs && SW.blurbs.beginnings && SW.blurbs.beginnings[state.beginnings]) || '';
    if (!state.reasonText && state.reasonForAdventure)
      state.reasonText = (SW.blurbs && SW.blurbs.hooks && SW.blurbs.hooks[state.reasonForAdventure]) || '';
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
          <select id="f-beginnings">${opts(SW.beginnings||[], state.beginnings)}</select>
          <textarea id="f-beginnings-text" class="blurb-textarea" placeholder="Auto-fills from your Beginnings choice -- edit freely">${esc(state.beginningsText)}</textarea></div>
        <div class="form-group"><label>Attitude Toward the Force</label>
          <select id="f-attitude">${opts(SW.attitudes||[], state.forceAttitude)}</select>
          <textarea id="f-attitude-text" class="blurb-textarea" placeholder="Auto-fills from your Force Attitude choice -- edit freely">${esc(state.forceAttitudeText)}</textarea></div>
        <div class="form-group"><label>Reason for Adventure</label>
          <select id="f-reason">${opts(SW.hooks||[], state.reasonForAdventure)}</select>
          <textarea id="f-reason-text" class="blurb-textarea" placeholder="Auto-fills from your Reason for Adventure choice -- edit freely">${esc(state.reasonText)}</textarea></div>
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
      const oldBlurb = (SW.blurbs && SW.blurbs.beginnings && SW.blurbs.beginnings[state.beginnings]) || '';
      state.beginnings = e.target.value;
      if (!state.beginningsText || state.beginningsText === oldBlurb) {
        state.beginningsText = (SW.blurbs && SW.blurbs.beginnings && SW.blurbs.beginnings[state.beginnings]) || '';
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

    $('#f-reason').addEventListener('change', e => {
      const oldBlurb = (SW.blurbs && SW.blurbs.hooks && SW.blurbs.hooks[state.reasonForAdventure]) || '';
      state.reasonForAdventure = e.target.value;
      if (!state.reasonText || state.reasonText === oldBlurb) {
        state.reasonText = (SW.blurbs && SW.blurbs.hooks && SW.blurbs.hooks[state.reasonForAdventure]) || '';
        $('#f-reason-text').value = state.reasonText;
      }
      saveState();
    });
    $('#f-reason-text').addEventListener('input', e => { state.reasonText = e.target.value; saveState(); });

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

    // Dedication grants +1 to a characteristic of the player's choice per rank.
    // Surface a picker for each purchased rank so the bonus has a target.
    let dedCount = 0;
    for (let i = 0; i < 20; i++) if (purchases[i] && names[i] === 'Dedication') dedCount++;
    if (!Array.isArray(state.dedicationChoices)) state.dedicationChoices = [];
    if (state.dedicationChoices.length !== dedCount) {
      state.dedicationChoices = state.dedicationChoices.slice(0, dedCount);
      while (state.dedicationChoices.length < dedCount) state.dedicationChoices.push('');
      saveState();
    }
    let dedSection = '';
    if (dedCount > 0) {
      const opt = (sel) => Engine.CHAR_STATS.map(st =>
        `<option value="${st}"${sel === st ? ' selected' : ''}>${st.charAt(0).toUpperCase() + st.slice(1)}</option>`).join('');
      const rows = [];
      for (let k = 0; k < dedCount; k++) {
        rows.push(`<label class="ded-choice-row">
          <span>Dedication rank ${k + 1}: +1 to</span>
          <select class="ded-choice" data-k="${k}"><option value="">— choose —</option>${opt(state.dedicationChoices[k])}</select>
        </label>`);
      }
      dedSection = `
        <div class="ded-choices">
          <div class="ded-choices-title">Dedication: characteristic increase</div>
          ${rows.join('')}
          <p class="ded-choices-note">Each rank permanently raises the chosen characteristic by one (max 6). This flows into your thresholds, soak, and dice pools on the sheet.</p>
        </div>`;
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
      </div>
      ${dedSection}`;

    // Dedication characteristic pickers
    c.querySelectorAll('.ded-choice').forEach(sel => {
      sel.addEventListener('change', () => {
        const k = +sel.dataset.k;
        state.dedicationChoices[k] = sel.value;
        saveState();
      });
    });

    // No hover: the first tap of a node previews it (shows its rules text and
    // arms it, marked by the tt-armed outline); a second tap on the same node
    // commits the buy/refund. Tapping a different node previews that one; tapping
    // the pop-out or anywhere outside dismisses it. This exposes descriptions
    // without hover and prevents accidental purchases, on every pointer.
    const grid = $('#talent-tree-grid');
    let armed = null;
    grid.addEventListener('click', e => {
      const node = e.target.closest('.tt-node');
      if (!node) { hideTooltip(); armed = null; return; }
      const r = +node.dataset.r, col = +node.dataset.c, idx = r*4+col;
      if (node.dataset.tipName && armed !== node.dataset.tipName) {
        armed = node.dataset.tipName;
        grid.querySelectorAll('.tt-armed').forEach(n => n.classList.remove('tt-armed'));
        node.classList.add('tt-armed');
        showTooltip(node, tooltipContent('talent', node.dataset.tipName));
        return;
      }
      armed = null;
      hideTooltip();
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
        ${getPlayMode() === 'play'
          ? `<p>What you carry into a job can be the difference between a payday and a body bag.
             Restricted <span class="r-badge">R</span> items still need the GM's approval before they're yours.</p>`
          : `<p>Spend your starting credits on weapons, armor, and gear. Each character begins with
           <strong>500 credits</strong> (plus any granted by Obligation or Duty). Restricted
           <span class="r-badge">R</span> items normally require GM approval &mdash; use
           <strong>Acquire Free</strong> to add anything without spending credits.</p>`}</div>
      <div class="equip-tabs">${tabs}</div>
      <div class="equip-main">
        <div class="equip-shop">
          <div class="equip-toolbar" id="eq-toolbar"></div>
          <div class="equip-results" id="eq-results"></div>
          <div class="equip-list" id="eq-list"></div>
        </div>
        <aside class="equip-cart" id="eq-cart"></aside>
      </div>
      <div class="equip-detail" id="eq-detail"></div>`;

    drawToolbar();
    drawList();
    drawCart();
    drawDetail();

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
      if (btn) { addItem(btn.dataset.addCat || _eqCat, btn.dataset.add); return; }
      const row = e.target.closest('[data-sel-key]');
      if (row) selectItem(row.dataset.selCat, row.dataset.selKey);
    });

    $('#eq-detail').addEventListener('click', e => {
      const btn = e.target.closest('[data-add]');
      if (btn) addItem(btn.dataset.addCat || _eqCat, btn.dataset.add);
    });

    // Tap a weapon-quality chip to pop out its description. Bound once on the
    // persistent list/detail containers so it survives their inner re-renders;
    // the capture-phase handler stops the tap before row selection fires.
    initTipListeners($('#eq-list'));
    initTipListeners($('#eq-detail'));

    $('#eq-cart').addEventListener('click', e => {
      const setEl = e.target.closest('[data-set-act]');
      if (setEl) { handleSetAction(setEl.dataset.setAct, setEl.dataset.setI); return; }
      const el = e.target.closest('[data-act]');
      if (!el) return;
      const { act, cat, key } = el.dataset;
      if (act === 'inc')       setQty(cat, key, ownedQty(cat, key) + 1);
      else if (act === 'dec')  setQty(cat, key, ownedQty(cat, key) - 1);
      else if (act === 'rm')   setQty(cat, key, 0);
      else if (act === 'free') toggleFree(cat, key);
      else if (act === 'equip' || act === 'carry' || act === 'show') toggleFlag(cat, key, act);
      else if (act === 'select') selectItem(cat, key);
    });
  }

  function drawToolbar() {
    // Play mode is real currency: no declaring new purchases free. Forcing
    // this here (render time, every visit) means every downstream read of
    // _eqMode - the button label, the mode caption, addItem's free flag -
    // is already correct without special-casing each one.
    if (getPlayMode() === 'play') _eqMode = false;
    const f = _eqFilter[_eqCat];
    const typeOpts = typeOptionsFor(_eqCat).map(t =>
      `<option value="${esc(t)}"${f.type === t ? ' selected' : ''}>${esc(t)}</option>`).join('');
    const rarOpts = ['', 0,1,2,3,4,5,6,7,8,9,10].map(r =>
      `<option value="${r}"${String(f.rarity) === String(r) ? ' selected' : ''}>${r === '' ? 'Any rarity' : '≤ ' + r}</option>`).join('');

    const skillSel = _eqCat === 'weapon'
      ? `<select id="eq-skill"><option value="">All combat skills</option>${
          weaponSkillOptions().map(s => `<option value="${esc(s)}"${f.skill === s ? ' selected' : ''}>${esc(s)}</option>`).join('')
        }</select>`
      : '';

    $('#eq-toolbar').innerHTML = `
      <input type="search" id="eq-q" placeholder="Search ${EQ_STORE[_eqCat].label.toLowerCase()}..." value="${esc(f.q)}">
      ${skillSel}
      <select id="eq-type"><option value="">All types</option>${typeOpts}</select>
      <select id="eq-rarity">${rarOpts}</select>
      <label class="eq-check"><input type="checkbox" id="eq-core"${f.core ? ' checked' : ''}> Core only</label>
      <label class="eq-check"><input type="checkbox" id="eq-afford"${f.afford ? ' checked' : ''}> Affordable</label>
      <label class="eq-check"><input type="checkbox" id="eq-hideR"${f.hideR ? ' checked' : ''}> Hide <span class="r-badge">R</span></label>
      ${getPlayMode() === 'play' ? '' : `
      <div class="eq-mode">
        <button class="eq-mode-btn${!_eqMode ? ' active' : ''}" id="eq-mode-buy">Purchase</button>
        <button class="eq-mode-btn${_eqMode ? ' active' : ''}" id="eq-mode-free">Acquire Free</button>
      </div>`}`;

    $('#eq-q').addEventListener('input', e => { f.q = e.target.value; drawList(); });
    if (_eqCat === 'weapon') $('#eq-skill').addEventListener('change', e => { f.skill = e.target.value; drawList(); });
    $('#eq-type').addEventListener('change', e => { f.type = e.target.value; drawList(); });
    $('#eq-rarity').addEventListener('change', e => { f.rarity = e.target.value; drawList(); });
    $('#eq-core').addEventListener('change', e => { f.core = e.target.checked; drawList(); });
    $('#eq-afford').addEventListener('change', e => { f.afford = e.target.checked; drawList(); });
    $('#eq-hideR').addEventListener('change', e => { f.hideR = e.target.checked; drawList(); });
    if ($('#eq-mode-buy')) $('#eq-mode-buy').addEventListener('click', () => { _eqMode = false; syncMode(); });
    if ($('#eq-mode-free')) $('#eq-mode-free').addEventListener('click', () => { _eqMode = true; syncMode(); });
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
      if (cat === 'weapon' && f.skill && it.skill !== f.skill) return false;
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
    applySelHighlight();
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
        `<span class="qual-chip" data-tip-type="quality" data-tip-name="${esc(q.key)}">${esc(q.name)}${q.count ? ' ' + q.count : ''}</span>`).join('');
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
      <div class="eq-row${owned ? ' owned' : ''}" data-sel-cat="${cat}" data-sel-key="${it.key}">
        <div class="eq-row-main">
          <div class="eq-row-head"><span class="eq-name">${esc(it.name)}</span>${rBadge}${ownedBadge}</div>
          <div class="eq-stats">${stats}</div>
        </div>
        <div class="eq-row-buy">
          <div class="eq-price">${priceLabel(it)}<i>cr</i></div>
          <button class="btn btn-primary btn-sm" data-add="${it.key}" data-add-cat="${cat}">${_eqMode ? '+ Free' : '+ Buy'}</button>
        </div>
      </div>`;
  }

  // Weapons and armor are always equippable. Gear items are equippable only
  // when flagged (the worn carrying gear: Utility Belt, Backpack, etc.) -
  // most gear (a comlink, a stimpack) has nothing to "wear".
  function equippableCat(cat, item) {
    if (cat === 'weapon' || cat === 'armor') return true;
    return cat === 'gear' && !!(item && item.equippable);
  }

  function weaponSkillOptions() {
    const set = new Set();
    for (const w of (SW.weapons || [])) if (w.skill) set.add(w.skill);
    return [...set].sort();
  }

  function weaponSetsArr() {
    if (!state.equipment) eqBag('weapon');
    if (!Array.isArray(state.equipment.weaponSets)) state.equipment.weaponSets = [];
    return state.equipment.weaponSets;
  }
  function pruneSets() {
    const bag = eqBag('weapon');
    const owned = k => !!(bag[k] && bag[k].qty);
    // A same-weapon pair needs 2 copies; a mixed pair needs one of each.
    state.equipment.weaponSets = weaponSetsArr().filter(s =>
      s.a === s.b ? (bag[s.a] && bag[s.a].qty >= 2) : (owned(s.a) && owned(s.b)));
  }

  function drawCart() {
    pruneSets();
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
        const carry = line.carry !== false, show = line.show !== false, equip = !!line.equip;
        const sel = _eqSelected && _eqSelected.cat === cat && _eqSelected.key === key ? ' eq-sel' : '';
        const flags = `
          ${equippableCat(cat, it)
            ? `<label class="cart-flag" title="Equipped (wielded / worn)"><input type="checkbox" data-act="equip" data-cat="${cat}" data-key="${key}"${equip ? ' checked' : ''}><span>E</span></label>`
            : '<span class="cart-flag cart-flag-na">&nbsp;</span>'}
          <label class="cart-flag" title="Carried (counts toward encumbrance)"><input type="checkbox" data-act="carry" data-cat="${cat}" data-key="${key}"${carry ? ' checked' : ''}><span>C</span></label>
          <label class="cart-flag" title="Show on character sheet"><input type="checkbox" data-act="show" data-cat="${cat}" data-key="${key}"${show ? ' checked' : ''}><span>S</span></label>`;
        return `
          <div class="cart-row${sel}" data-sel-cat="${cat}" data-sel-key="${key}">
            <div class="cart-row-top">
              <span class="cart-name" data-act="select" data-cat="${cat}" data-key="${key}">${esc(it.name)}</span>
              <button class="cart-x" data-act="rm" data-cat="${cat}" data-key="${key}" title="Remove">&times;</button>
            </div>
            <div class="cart-row-ctl">
              <div class="cart-qty">
                <button data-act="dec" data-cat="${cat}" data-key="${key}">&minus;</button>
                <span>${line.qty}</span>
                <button data-act="inc" data-cat="${cat}" data-key="${key}">+</button>
              </div>
              <div class="cart-flags">${flags}</div>
              ${getPlayMode() === 'play' ? '' : `<label class="cart-freebox" title="Acquire free (no credits)"><input type="checkbox" data-act="free" data-cat="${cat}" data-key="${key}"${line.free ? ' checked' : ''}><span>$0</span></label>`}
              <span class="cart-cost">${lineCost}</span>
            </div>
          </div>`;
      }).join('');
      sections += `<div class="cart-section"><div class="cart-section-title">${EQ_STORE[cat].label}</div>${rows}</div>`;
    }

    // Two-weapon sets
    const wbag = eqBag('weapon');
    const wKeys = Object.keys(wbag).filter(k => wbag[k] && wbag[k].qty);
    const sets = weaponSetsArr();
    // You can pair two weapons if you own 2+ distinct weapons, or 2+ of the same one.
    const canPair = wKeys.length >= 2 || wKeys.some(k => wbag[k].qty >= 2);
    if (canPair || sets.length) {
      const setRows = sets.map((s, i) => {
        const a = Engine.getWeapon(s.a), b = Engine.getWeapon(s.b);
        return `<div class="tws-row"><span>${esc(a ? a.name : '?')} <i>+</i> ${esc(b ? b.name : '?')}</span>
          <button class="cart-x" data-set-act="del" data-set-i="${i}" title="Remove set">&times;</button></div>`;
      }).join('');
      const opts = wKeys.map(k => `<option value="${k}">${esc(Engine.getWeapon(k)?.name || k)}</option>`).join('');
      sections += `
        <div class="cart-section">
          <div class="cart-section-title">Two-Weapon Sets</div>
          ${setRows || '<div class="tws-empty">Pair two weapons to dual-wield (pick the same weapon twice if you own 2+).</div>'}
          ${canPair ? `<div class="tws-add">
            <select id="tws-a">${opts}</select><span class="tws-plus">+</span><select id="tws-b">${opts}</select>
            <button class="btn btn-secondary btn-sm" data-set-act="add">Pair</button>
          </div>` : ''}
        </div>`;
    }

    const encOver = d && d.encumbrance > d.encumbrance_threshold;
    const encExcess = encOver ? d.encumbrance - d.encumbrance_threshold : 0;
    const encBrawn = (d && d.characteristics && d.characteristics.brawn) || 0;
    el.innerHTML = `
      <div class="cart-head">Loadout <span class="cart-legend">E=equip &middot; C=carry &middot; S=show</span></div>
      ${sections || '<div class="cart-empty">Nothing acquired yet.<br>Add items from the shop to build your loadout.</div>'}
      <div class="cart-totals">
        <div class="cart-total-row"><span>Spent</span><strong>${d ? fmtCr(d.credits_spent) : 0} cr</strong></div>
        <div class="cart-total-row${d && d.credits_remaining < 0 ? ' cart-neg' : ''}"><span>Remaining</span><strong>${d ? fmtCr(d.credits_remaining) : 0} cr</strong></div>
        <div class="cart-total-row${encOver ? ' cart-warn' : ''}"><span>Encumbrance</span><strong>${d ? d.encumbrance : 0} / ${d ? d.encumbrance_threshold : 5}</strong></div>
      </div>
      ${restrictedOwned ? `<div class="cart-note">${restrictedOwned} restricted item${restrictedOwned > 1 ? 's' : ''} purchased &mdash; normally needs GM approval.</div>` : ''}
      ${encOver ? `<div class="cart-note cart-note-warn">Encumbered: +${encExcess} setback to all Brawn &amp; Agility checks${encExcess >= encBrawn && encBrawn > 0 ? '; you also lose your free maneuver each turn (maneuvers cost 2 strain).' : '.'}</div>` : ''}
      ${d && d.credits_remaining < 0 ? '<div class="cart-note cart-note-warn">You are over budget. Remove items or mark some as free.</div>' : ''}`;
  }

  function drawDetail() {
    const el = $('#eq-detail');
    if (!el) return;
    if (!_eqSelected) {
      el.innerHTML = '<div class="eq-detail-empty">Select an item from the shop or loadout to see its full details.</div>';
      return;
    }
    const { cat, key } = _eqSelected;
    const it = Engine.getItem(cat, key);
    if (!it) { el.innerHTML = ''; return; }

    const stats = [];
    stats.push(['Encumbrance', it.encumbrance ?? '—']);
    stats.push(['Hard Points', it.hp ?? '—']);
    stats.push(['Rarity', rarityLabel(it)]);
    stats.push(['Price', priceLabel(it) + (it.restricted ? ' (R)' : '') + ' cr']);
    if (cat === 'weapon') {
      stats.push(['Skill', it.skill || '—']);
      stats.push(['Damage', dmgDisplay(it)]);
      stats.push(['Critical', it.crit ?? '—']);
      stats.push(['Range', it.range || '—']);
    }
    if (cat === 'armor') {
      stats.push(['Soak', '+' + (it.soak ?? 0)]);
      stats.push(['Defense', '+' + (it.defense ?? 0)]);
    }
    if (it.type) stats.push(['Type', it.type]);
    if (it.categories && it.categories.length) stats.push(['Categories', it.categories.join(', ')]);

    const statHtml = stats.map(([k, v]) =>
      `<div class="eq-detail-stat"><span>${k}</span><strong>${esc(String(v))}</strong></div>`).join('');
    const quals = cat === 'weapon' && (it.qualities || []).length
      ? `<div class="eq-detail-quals">${it.qualities.map(q =>
          `<span class="qual-chip" data-tip-type="quality" data-tip-name="${esc(q.key)}">${esc(q.name)}${q.count ? ' ' + q.count : ''}</span>`).join('')}</div>`
      : '';
    const srcTxt = (it.sources || []).length
      ? 'Please see ' + it.sources.map(s => `page ${s.page} of the ${s.book}`).join(', ') + ' for details.'
      : '';
    const desc = it.description
      ? esc(it.description)
      : [it.short ? esc(glyphify(it.short)) : '', srcTxt ? esc(srcTxt) : '']
          .filter(Boolean).join('<br><br>');
    const owned = ownedQty(cat, key);

    el.innerHTML = `
      <div class="eq-detail-grid">
        <div class="eq-detail-col">
          <div class="eq-detail-title">${esc(it.name)}${it.restricted ? ' <span class="r-badge">R</span>' : ''}</div>
          <div class="eq-detail-stats">${statHtml}</div>
          ${quals}
          <div class="eq-detail-actions">
            <button class="btn btn-primary btn-sm" data-add="${key}" data-add-cat="${cat}">${_eqMode ? '+ Acquire Free' : '+ Purchase'}</button>
            ${owned ? `<span class="eq-owned">Owned &times;${owned}</span>` : ''}
          </div>
        </div>
        <div class="eq-detail-col eq-detail-desccol">
          <div class="eq-detail-title">Description</div>
          <div class="eq-detail-desc">${desc || '<span class="eq-detail-muted">No additional description recorded.</span>'}</div>
        </div>
      </div>`;
  }

  function applySelHighlight() {
    document.querySelectorAll('.eq-row.eq-sel, .cart-row.eq-sel').forEach(e => e.classList.remove('eq-sel'));
    if (!_eqSelected) return;
    document.querySelectorAll(`[data-sel-cat="${_eqSelected.cat}"][data-sel-key="${_eqSelected.key}"]`)
      .forEach(e => e.classList.add('eq-sel'));
  }

  function selectItem(cat, key) {
    _eqSelected = { cat, key };
    drawDetail();
    applySelHighlight();
  }

  function handleSetAction(act, idx) {
    if (act === 'add') {
      const a = $('#tws-a') && $('#tws-a').value;
      const b = $('#tws-b') && $('#tws-b').value;
      if (!a || !b) return;
      const bag = eqBag('weapon');
      if (a === b && (!bag[a] || bag[a].qty < 2)) return;   // need two copies to pair the same weapon
      if (weaponSetsArr().some(s => (s.a === a && s.b === b) || (s.a === b && s.b === a))) return;
      weaponSetsArr().push({ a, b });
      afterEquipChange();
    } else if (act === 'del') {
      weaponSetsArr().splice(+idx, 1);
      afterEquipChange();
    }
  }

  function afterEquipChange() {
    pruneSets();   // drop now-invalid weapon sets BEFORE persisting
    saveState();
    drawCart();
    drawDetail();
    renderHeaderCredits();
    drawList();   // refresh owned badges / affordability
  }
  function anyEquipped(cat) {
    const bag = eqBag(cat);
    return Object.keys(bag).some(k => bag[k] && bag[k].qty && bag[k].equip);
  }
  // Play mode is real currency: spending more than the balance holds is
  // blocked outright, rather than the over-budget warning Creation mode
  // allows (a build in progress is expected to go back and forth). Returns
  // true (and alerts) if this purchase should be blocked.
  function blockedByBudget(price) {
    if (getPlayMode() !== 'play' || typeof price !== 'number') return false;
    const d = Engine.derive(state);
    const remaining = d ? d.credits_remaining : 0;
    if (price > remaining) {
      alert(`Not enough credits. This costs ${fmtCr(price)} cr; you have ${fmtCr(remaining)} cr.`);
      return true;
    }
    return false;
  }
  function addItem(cat, key) {
    const bag = eqBag(cat);
    const it = Engine.getItem(cat, key);
    if (!_eqMode && blockedByBudget(it && priceNum(it))) return;
    if (bag[key] && bag[key].qty) bag[key].qty++;
    else bag[key] = { qty: 1, free: _eqMode, carry: true, show: true,
                      equip: equippableCat(cat, it) && !anyEquipped(cat) };
    afterEquipChange();
  }
  function setQty(cat, key, qty) {
    const bag = eqBag(cat);
    if (!bag[key]) return;
    if (qty > bag[key].qty && !bag[key].free) {
      const it = Engine.getItem(cat, key);
      if (blockedByBudget(it && priceNum(it))) return;
    }
    if (qty <= 0) delete bag[key];
    else bag[key].qty = qty;
    afterEquipChange();
  }
  function toggleFree(cat, key) {
    const bag = eqBag(cat);
    if (bag[key]) { bag[key].free = !bag[key].free; afterEquipChange(); }
  }
  function toggleFlag(cat, key, flag) {
    const bag = eqBag(cat);
    const line = bag[key];
    if (!line) return;
    const cur = flag === 'equip' ? !!line.equip : line[flag] !== false;  // carry/show default true
    line[flag] = !cur;
    if (flag === 'equip' && line.equip && cat === 'armor') {
      for (const k of Object.keys(bag)) if (k !== key && bag[k]) bag[k].equip = false;  // one suit worn
    }
    afterEquipChange();
  }

  // ── Step: Vehicle Fleet ────────────────────────────────────────────────────
  function vehicleGroup(v) {
    const cats = v.categories || [];
    const type = (v.type || '').toLowerCase();
    if (cats.includes('Starship')) return 'Starship';
    if (cats.includes('Land Vehicle') ||
        ['speeder', 'swoop', 'walker', 'groundcar', 'repulsor', 'landspeeder',
         'cloud car', 'airspeeder'].some(t => type.includes(t))) return 'Land';
    if (['aqua', 'submersible', 'watercraft'].some(t => type.includes(t))) return 'Aquatic';
    if (['jet pack', 'rocket boot', 'drop suit', 'foot speeder', 'jump boot'].some(t => type.includes(t))) return 'Personal';
    return 'Other';
  }

  function filteredVehicles() {
    const f = _vehFilter;
    const d = state.speciesKey ? Engine.derive(state) : null;
    const remain = d ? d.credits_remaining : Infinity;
    let list = SW.vehicles || [];
    if (f.q) {
      const q = f.q.toLowerCase();
      list = list.filter(v => v.name.toLowerCase().includes(q) || (v.type || '').toLowerCase().includes(q));
    }
    if (f.group) list = list.filter(v => vehicleGroup(v) === f.group);
    if (f.sil) {
      if (f.sil === '6+') list = list.filter(v => (v.silhouette || 0) >= 6);
      else { const s = parseInt(f.sil); list = list.filter(v => (v.silhouette || 0) === s); }
    }
    if (f.core) list = list.filter(v => v.core);
    if (f.afford) list = list.filter(v => typeof v.price === 'number' && v.price <= remain);
    return list;
  }

  function ownedVehicle(key) {
    return (state.vehicles || []).find(v => v.key === key) || null;
  }

  function addVehicle(key) {
    if (ownedVehicle(key)) return;
    const v = Engine.getVehicle(key);
    if (!v) return;
    if (!state.vehicles) state.vehicles = [];
    state.vehicles.push({ key, nickname: v.name, notes: '', purchased: false });
    saveState();
    drawVehicleList();
    drawVehicleStats();
    drawFleet();
    renderHeaderCredits();
  }

  function removeVehicle(key) {
    state.vehicles = (state.vehicles || []).filter(v => v.key !== key);
    saveState();
    drawVehicleList();
    drawVehicleStats();
    drawFleet();
    renderHeaderCredits();
  }

  function selectVehicle(key) {
    _vehSelected = key;
    applyVehicleSelHighlight();
    drawVehicleStats();
  }

  function applyVehicleSelHighlight() {
    const list = $('#veh-list');
    if (!list) return;
    list.querySelectorAll('.veh-row').forEach(row =>
      row.classList.toggle('veh-sel', row.dataset.vkey === _vehSelected));
  }

  function drawVehicleToolbar() {
    const f = _vehFilter;
    const groups = ['Starship', 'Land', 'Aquatic', 'Personal', 'Other'];
    const sils = ['1','2','3','4','5','6+'];
    $('#veh-toolbar').innerHTML = `
      <input type="search" id="veh-q" placeholder="Search vehicles..." value="${esc(f.q)}">
      <select id="veh-group">
        <option value="">All types</option>
        ${groups.map(g => `<option value="${esc(g)}"${f.group===g?' selected':''}>${esc(g)}</option>`).join('')}
      </select>
      <select id="veh-sil">
        <option value="">Any silhouette</option>
        ${sils.map(s => `<option value="${s}"${f.sil===s?' selected':''}>Sil ${s}</option>`).join('')}
      </select>
      <label class="eq-check"><input type="checkbox" id="veh-core"${f.core?' checked':''}> Core only</label>
      <label class="eq-check"><input type="checkbox" id="veh-afford"${f.afford?' checked':''}> Affordable</label>`;
    $('#veh-q').addEventListener('input', e => { f.q = e.target.value; drawVehicleList(); });
    $('#veh-group').addEventListener('change', e => { f.group = e.target.value; drawVehicleList(); });
    $('#veh-sil').addEventListener('change', e => { f.sil = e.target.value; drawVehicleList(); });
    $('#veh-core').addEventListener('change', e => { f.core = e.target.checked; drawVehicleList(); });
    $('#veh-afford').addEventListener('change', e => { f.afford = e.target.checked; drawVehicleList(); });
  }

  function drawVehicleList() {
    const list = filteredVehicles();
    const shown = list.slice(0, _VEH_CAP);
    const over = list.length - shown.length;
    $('#veh-results').innerHTML =
      `<span>${list.length} vehicle${list.length !== 1 ? 's' : ''}${over ? `, showing first ${_VEH_CAP}` : ''}</span>`;
    $('#veh-list').innerHTML = shown.map(vehicleRowHtml).join('') +
      (over ? `<div class="eq-row" style="text-align:center;color:var(--muted);font-size:0.82rem;padding:10px">+${over} more &mdash; narrow your search</div>` : '');
    applyVehicleSelHighlight();
  }

  function vehicleRowHtml(v) {
    const owned = ownedVehicle(v.key);
    const cr = n => typeof n === 'number' ? n.toLocaleString('en-US') : '—';
    const group = vehicleGroup(v);
    return `
      <div class="veh-row${owned ? ' owned' : ''}" data-vkey="${esc(v.key)}">
        <div class="veh-row-main">
          <div class="veh-row-head">
            <span class="veh-sil-badge" title="Silhouette ${v.silhouette ?? '?'}">${v.silhouette ?? '?'}</span>
            <span class="eq-name">${esc(v.name)}</span>
            ${v.restricted ? '<span class="r-badge">R</span>' : ''}
            ${owned ? '<span class="eq-owned">&#10003;</span>' : ''}
          </div>
          <div class="veh-row-stats">
            <span class="eq-stat"><span>Spd</span><strong>${v.speed ?? '—'}</strong></span>
            <span class="eq-stat"><span>Hdl</span><strong>${v.handling ?? '—'}</strong></span>
            <span class="eq-stat"><span>Armor</span><strong>${v.armor ?? '—'}</strong></span>
            <span class="eq-stat"><span>HT</span><strong>${v.hullTrauma ?? '—'}</strong></span>
            <span class="eq-stat"><span>SS</span><strong>${v.systemStrain ?? '—'}</strong></span>
            <span class="veh-type-tag veh-group-${group.toLowerCase()}">${esc(v.type || group)}</span>
          </div>
        </div>
        <div class="eq-row-buy">
          <div class="eq-price">${cr(v.price)}<i>cr</i></div>
          <button class="btn btn-sm btn-accent" data-vadd="${esc(v.key)}"${owned ? ' disabled' : ''}>${owned ? '&#10003;' : '+'}</button>
        </div>
      </div>`;
  }

  function drawVehicleStats() {
    const panel = $('#veh-stats');
    if (!panel) return;
    if (!_vehSelected) {
      panel.innerHTML = '<div class="veh-stats-empty">Select a vehicle to see its full stats.</div>';
      return;
    }
    const v = Engine.getVehicle(_vehSelected);
    if (!v) { panel.innerHTML = ''; return; }
    const owned = ownedVehicle(v.key);
    const cr = n => typeof n === 'number' ? n.toLocaleString('en-US') : '—';

    // Defense arc
    const arcCell = (val, lbl, cls) =>
      `<div class="veh-arc-cell ${cls}"><div class="veh-arc-val">${val ?? 0}</div><div class="veh-arc-lbl">${lbl}</div></div>`;

    // Vehicle weapons resolved to names
    const vwMap = Engine.getVehicleWeaponMap();
    const wepRows = (v.weapons || []).map(w => {
      const wd = vwMap[w.key] || { name: w.key, damage: '?', crit: '?', range: '?' };
      const quals = (w.qualities || []).map(q => {
        const qd = (SW.weaponQualities || {})[q.key];
        return (qd ? qd.name : q.key) + (q.count ? ' ' + q.count : '');
      }).join(', ');
      const arcs = Object.entries(w.firingArcs || {}).filter(([,on]) => on)
        .map(([k]) => k.charAt(0).toUpperCase() + k.slice(1)).join('/');
      return `<div class="veh-weapon-row">
        <span class="veh-weapon-name">${esc(wd.name)}${w.count > 1 ? ` &times;${w.count}` : ''}</span>
        <span class="veh-weapon-stats">Dmg ${wd.damage ?? '?'} &middot; Crit ${wd.crit ?? '—'} &middot; ${esc(wd.range || '—')}</span>
        <span class="veh-weapon-meta">${[w.location, w.turret ? 'turret' : '', w.retractable ? 'retractable' : '', arcs, quals].filter(Boolean).join(' &middot; ')}</span>
      </div>`;
    }).join('');

    const hyper = v.hyperdrivePrimary
      ? `Class ${v.hyperdrivePrimary}${v.hyperdriveBackup ? ' / Backup Class ' + v.hyperdriveBackup : ''}`
      : 'None';

    const modsHtml = (v.baseMods || []).length
      ? `<div class="veh-detail-section"><div class="veh-detail-lbl">Special Features</div>
         ${v.baseMods.map(m => `<p class="veh-detail-mod">${esc(m)}</p>`).join('')}</div>` : '';

    const src = (v.sources || []).map(s => s.page ? `${s.book} p.${s.page}` : s.book).join(', ');

    panel.innerHTML = `
      <div class="veh-stats-inner">
        <div class="veh-stats-head">
          <div>
            <div class="veh-stats-name">${esc(v.name)}</div>
            <div class="veh-stats-sub">${esc(v.type || '')} &middot; <span class="eq-detail-muted">${esc(src)}</span></div>
          </div>
          ${!owned
            ? `<button class="btn btn-sm btn-accent" data-vadd="${esc(v.key)}">+ Add to Fleet</button>`
            : `<span class="eq-owned" style="font-size:0.85rem">&#10003; In fleet</span>`}
        </div>

        <div class="veh-primary-stats">
          ${[['Silhouette',v.silhouette],['Speed',v.speed],['Handling',v.handling],
             ['Armor',v.armor],['Hull Trauma',v.hullTrauma],['Sys. Strain',v.systemStrain]]
            .map(([l,val]) => `<div class="veh-stat-big"><div class="veh-stat-big-val">${val ?? '—'}</div><div class="veh-stat-big-lbl">${l}</div></div>`).join('')}
        </div>

        <div class="veh-arc-grid">
          ${arcCell(v.defFore,      'Fore',  'arc-fore')}
          ${arcCell(v.defPort,      'Port',  'arc-port')}
          <div class="veh-arc-ship">&#9673;</div>
          ${arcCell(v.defStarboard, 'Stbd',  'arc-stbd')}
          ${arcCell(v.defAft,       'Aft',   'arc-aft')}
        </div>

        <div class="veh-detail-grid">
          ${v.hyperdrivePrimary ? `<div class="veh-detail-row"><span>Hyperdrive</span><strong>${esc(hyper)}</strong></div>` : ''}
          <div class="veh-detail-row"><span>NaviComputer</span><strong>${v.navicomputer ? 'Yes' : 'No'}</strong></div>
          <div class="veh-detail-row"><span>Sensors</span><strong>${esc(v.sensorRange || '—')}</strong></div>
          <div class="veh-detail-row"><span>Crew</span><strong>${esc(v.crew || '—')}</strong></div>
          ${(v.passengers ?? 0) > 0 ? `<div class="veh-detail-row"><span>Passengers</span><strong>${v.passengers}</strong></div>` : ''}
          <div class="veh-detail-row"><span>Cargo</span><strong>${v.encumbranceCapacity ?? 0} enc.</strong></div>
          ${v.consumables ? `<div class="veh-detail-row"><span>Consumables</span><strong>${esc(v.consumables)}</strong></div>` : ''}
          ${v.maxAltitude ? `<div class="veh-detail-row"><span>Max Altitude</span><strong>${esc(v.maxAltitude)}</strong></div>` : ''}
          <div class="veh-detail-row"><span>Hardpoints</span><strong>${v.hp ?? 0}</strong></div>
          <div class="veh-detail-row"><span>Price</span><strong>${cr(v.price)} cr${v.restricted ? ' <span class="r-badge">R</span>' : ''}</strong></div>
          <div class="veh-detail-row"><span>Rarity</span><strong>${v.rarity ?? '—'}</strong></div>
        </div>

        ${modsHtml}

        ${wepRows ? `<div class="veh-detail-section"><div class="veh-detail-lbl">Stock Weapons</div>${wepRows}</div>` : ''}

        ${v.description
          ? `<div class="veh-detail-section"><div class="veh-detail-lbl">Description</div>
             <p class="eq-detail-desc">${esc(v.description)}</p></div>`
          : ''}
      </div>`;
  }

  function drawFleet() {
    const fleet = $('#veh-fleet');
    if (!fleet) return;
    const d = state.speciesKey ? Engine.derive(state) : null;
    const cr = n => typeof n === 'number' ? n.toLocaleString('en-US') : '—';
    const vehicles = state.vehicles || [];

    const totalCost = vehicles.filter(e => e.purchased).reduce((sum, e) => {
      const vd = Engine.getVehicle(e.key);
      return sum + (vd && typeof vd.price === 'number' ? vd.price : 0);
    }, 0);
    const neg = d && d.credits_remaining < 0;

    const cards = vehicles.map(entry => {
      const vd = Engine.getVehicle(entry.key);
      if (!vd) return '';
      const group = vehicleGroup(vd);
      const price = typeof vd.price === 'number' ? vd.price : null;
      return `
        <div class="veh-fleet-card">
          <div class="veh-fleet-card-head">
            <span class="veh-type-tag veh-group-${group.toLowerCase()}">${esc(group)}</span>
            <input class="veh-nickname" type="text" value="${esc(entry.nickname)}"
              placeholder="${esc(vd.name)}" data-vfield="nickname" data-vkey="${esc(entry.key)}" maxlength="60">
            <button class="cart-x" data-vact="rm" data-vkey="${esc(entry.key)}" title="Remove">&#10005;</button>
          </div>
          <div class="veh-fleet-card-meta">
            ${[['Sil',vd.silhouette],['Spd',vd.speed],['Hdl',vd.handling],
               ['Armor',vd.armor],['HT',vd.hullTrauma],['SS',vd.systemStrain]]
              .map(([l,val]) => `<span class="eq-stat"><span>${l}</span><strong>${val ?? '—'}</strong></span>`).join('')}
          </div>
          <div class="veh-fleet-card-footer">
            <label class="cart-flag" style="gap:5px">
              <input type="checkbox" data-vact="toggle-purchased" data-vkey="${esc(entry.key)}"${entry.purchased?' checked':''}>
              Purchased
            </label>
            ${price !== null
              ? `<span class="cart-cost${entry.purchased ? (neg ? ' cart-neg' : '') : ' cart-free'}">${entry.purchased ? cr(price) + ' cr' : 'Not purchased'}</span>`
              : ''}
          </div>
          <textarea class="veh-notes" placeholder="Ship name, backstory, modifications..." rows="2"
            data-vfield="notes" data-vkey="${esc(entry.key)}">${esc(entry.notes)}</textarea>
        </div>`;
    }).join('');

    fleet.innerHTML = `
      <div class="veh-fleet-head">
        MY FLEET
        <span class="veh-fleet-count">${vehicles.length} vehicle${vehicles.length !== 1 ? 's' : ''}</span>
        ${totalCost ? `<span class="cart-cost${neg?' cart-neg':''}">${cr(totalCost)} cr total</span>` : ''}
      </div>
      ${vehicles.length
        ? `<div class="veh-fleet-cards">${cards}</div>`
        : `<div class="cart-empty">No vehicles added yet. Browse above and click <strong>+</strong> to add a vehicle to your fleet.</div>`}`;
  }

  function renderVehicle() {
    const c = $('#step-content');
    if (!SW.vehicles || !SW.vehicles.length) {
      c.innerHTML = '<div class="empty-state">Vehicle data failed to load.</div>'; return;
    }
    c.innerHTML = `
      <div class="step-header"><h2>Fleet</h2>
        ${getPlayMode() === 'play'
          ? `<p>A ship of your own answers only to you; one you haven't paid for is borrowed, shared with the crew,
             or handed to you for the job. Restricted <span class="r-badge">R</span> vessels still need the GM's approval.</p>`
          : `<p>Select a ship or vehicle for your character. Toggle <strong>Purchased</strong> to deduct the cost from
           your starting credits. Restricted <span class="r-badge">R</span> items require GM approval.
           Vehicles not purchased represent loaned, party-owned, or mission-assigned craft.</p>`}</div>
      <div class="veh-main">
        <div class="veh-shop">
          <div class="veh-toolbar" id="veh-toolbar"></div>
          <div class="equip-results" id="veh-results"></div>
          <div class="veh-list" id="veh-list"></div>
        </div>
        <aside class="veh-stats" id="veh-stats"></aside>
      </div>
      <div class="veh-fleet" id="veh-fleet"></div>`;

    drawVehicleToolbar();
    drawVehicleList();
    drawVehicleStats();
    drawFleet();

    $('#veh-list').addEventListener('click', e => {
      const btn = e.target.closest('[data-vadd]');
      if (btn) { addVehicle(btn.dataset.vadd); return; }
      const row = e.target.closest('[data-vkey]');
      if (row) selectVehicle(row.dataset.vkey);
    });
    $('#veh-stats').addEventListener('click', e => {
      const btn = e.target.closest('[data-vadd]');
      if (btn) addVehicle(btn.dataset.vadd);
    });
    $('#veh-fleet').addEventListener('click', e => {
      const el = e.target.closest('[data-vact]');
      if (!el) return;
      if (el.dataset.vact === 'rm') removeVehicle(el.dataset.vkey);
    });
    $('#veh-fleet').addEventListener('change', e => {
      const el = e.target;
      if (el.dataset.vact === 'toggle-purchased') {
        const entry = ownedVehicle(el.dataset.vkey);
        if (!entry) return;
        if (el.checked) {
          const vd = Engine.getVehicle(el.dataset.vkey);
          if (blockedByBudget(vd && typeof vd.price === 'number' ? vd.price : null)) { el.checked = false; return; }
        }
        entry.purchased = el.checked; saveState(); drawFleet(); renderHeaderCredits();
      }
    });
    $('#veh-fleet').addEventListener('input', e => {
      const el = e.target.closest('[data-vfield]');
      if (!el) return;
      const entry = ownedVehicle(el.dataset.vkey);
      if (entry) { entry[el.dataset.vfield] = el.value; saveState(); }
    });
  }

  // ── Step: Sheet ───────────────────────────────────────────────────────────
  function renderSheet() {
    const c = $('#step-content');
    const d = Engine.derive(state);
    if (!d) { c.innerHTML = '<div class="empty-state">Complete all steps to view the sheet.</div>'; return; }
    Sheet.render(c, state, d);
    // Tap a skill name (or any tip element on the sheet) to pop out its description.
    // Attach to the freshly rendered .sheet-root so listeners do not accumulate.
    const root = c.querySelector('.sheet-root');
    if (root) initTipListeners(root);
  }

  // Static rules reference (no character state needed).
  function renderReference() {
    Reference.render($('#step-content'));
  }

  // ── Navigation ────────────────────────────────────────────────────────────
  function newCharacter() {
    if (confirm('Start a new character? Current character will be cleared.')) {
      // A blank character has nothing to show in Play mode's trimmed tabs, so
      // drop back to Creation regardless of what the last character used.
      localStorage.setItem(PLAY_KEY, 'creation');
      state = defaultState(); saveState(); render(); window.scrollTo(0, 0);
    }
  }

  // ── Character roster (multiple saved characters) ───────────────────────────
  const ROSTER_KEY = 'sw_roster_v1';
  function genId() { return 'c' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7); }
  function getRoster() { try { return JSON.parse(localStorage.getItem(ROSTER_KEY)) || []; } catch (e) { return []; } }
  function setRoster(ix) { try { localStorage.setItem(ROSTER_KEY, JSON.stringify(ix)); } catch (e) {} }

  function rosterOptionsHtml() {
    const ix = getRoster();
    if (!ix.length) return '<option value="">No saved characters</option>';
    return ix.map(e => {
      const bits = [esc(e.name || 'Unnamed')];
      if (e.species) bits.push(esc(e.species));
      if (e.line) bits.push(String(e.line).toUpperCase());
      return `<option value="${esc(e.id)}"${e.id === state.id ? ' selected' : ''}>${bits.join(' · ')}</option>`;
    }).join('');
  }
  function refreshRosterSelect() {
    const sel = document.getElementById('roster-select');
    if (sel) sel.innerHTML = rosterOptionsHtml();
  }
  function flashBtn(btn, text) {
    if (!btn) return;
    const orig = btn.dataset._orig || btn.textContent;
    btn.dataset._orig = orig;
    btn.textContent = text;
    clearTimeout(btn._flashT);
    btn._flashT = setTimeout(() => { btn.textContent = btn.dataset._orig; }, 1300);
  }

  // Save the working character into the roster, creating or updating its slot.
  function saveToRoster() {
    if (!state.id) state.id = genId();
    try { localStorage.setItem('sw_saved_v1_' + state.id, JSON.stringify(state)); }
    catch (e) { alert('Could not save the character (browser storage may be full).'); return false; }
    const species = Engine.getSpecies(state.speciesKey);
    const entry = {
      id: state.id, name: (state.name || '').trim() || 'Unnamed',
      species: species ? species.name : '', line: state.game || '', savedAt: new Date().toISOString(),
    };
    setRoster([entry, ...getRoster().filter(e => e.id !== state.id)]);
    saveState();   // keep the autosaved working copy in sync (now carries the id)
    return true;
  }

  function loadFromRoster(id) {
    let saved;
    try { saved = JSON.parse(localStorage.getItem('sw_saved_v1_' + id)); } catch (e) {}
    if (!saved) { alert('That saved character could not be found.'); return; }
    state = Object.assign(defaultState(), saved);
    state.id = id;
    state.equipment = Object.assign({ weapon: {}, armor: {}, gear: {}, weaponSets: [] }, state.equipment || {});
    migrateDetails(state);
    state.step = Math.max(0, Math.min(state.step | 0, STEPS.length - 1));
    ensurePlayStepValid();
    saveState(); render(); window.scrollTo(0, 0);
  }

  function rosterLoad(modal, close) {
    const sel = modal.querySelector('#roster-select');
    const id = sel && sel.value;
    if (!id) { alert('Pick a saved character to load.'); return; }
    if (id === state.id) { close(); return; }   // already the working character
    if (!confirm('Load this character? Any unsaved changes to your current character will be lost.')) return;
    close(); loadFromRoster(id);
  }

  function rosterDelete(modal) {
    const sel = modal.querySelector('#roster-select');
    const id = sel && sel.value;
    if (!id) { alert('Pick a saved character to delete.'); return; }
    const ent = getRoster().find(e => e.id === id);
    if (!confirm('Delete the saved character "' + ((ent && ent.name) || 'Unnamed') + '"? This cannot be undone.')) return;
    try { localStorage.removeItem('sw_saved_v1_' + id); } catch (e) {}
    setRoster(getRoster().filter(e => e.id !== id));
    refreshRosterSelect();
  }

  // Download the current character as a JSON save file (backup / share / transfer).
  function exportCharacterJson() {
    try {
      const envelope = { app: 'eote-character-sheet', version: 1, savedAt: new Date().toISOString(), character: state };
      const blob = new Blob([JSON.stringify(envelope, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const base = (state.name || 'character').trim().replace(/[^\w]+/g, '_') || 'character';
      const a = document.createElement('a');
      a.href = url; a.download = base + '_character.json';
      document.body.appendChild(a); a.click();
      setTimeout(() => { URL.revokeObjectURL(url); a.remove(); }, 1000);
    } catch (err) {
      console.error(err);
      alert('Could not export the character: ' + ((err && err.message) || err));
    }
  }

  // Load a character from a JSON save file, replacing the current one.
  function importCharacterJson() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json,application/json';
    input.addEventListener('change', () => {
      const file = input.files && input.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        let incoming;
        try {
          const data = JSON.parse(reader.result);
          incoming = (data && typeof data === 'object' && data.character) ? data.character : data;
        } catch (e) {
          alert('That file is not valid JSON, so it cannot be imported.');
          return;
        }
        const SIG = ['game', 'characteristics', 'careerKey', 'speciesKey', 'equipment', 'talentPurchases'];
        if (!incoming || typeof incoming !== 'object' || !SIG.some(k => k in incoming)) {
          alert('That file does not look like a saved character.');
          return;
        }
        if (!confirm('Import this character? Your current character will be replaced.')) return;
        state = Object.assign(defaultState(), incoming);
        state.id = genId();   // treat an imported character as a new roster entry
        // Repair structures that may be missing from older save files.
        state.equipment = Object.assign({ weapon: {}, armor: {}, gear: {}, weaponSets: [] }, state.equipment || {});
        migrateDetails(state);
        state.step = Math.max(0, Math.min(state.step | 0, STEPS.length - 1));
        ensurePlayStepValid();
        saveState(); render(); window.scrollTo(0, 0);
      };
      reader.readAsText(file);
    });
    input.click();
  }

  function next() {
    if (state.step === STEPS.length - 1) { newCharacter(); return; }
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
    initViewMode();
    initTooltipDismiss();
    loadState();
    $('#btn-next').addEventListener('click', next);
    $('#btn-back').addEventListener('click', back);
    $('#btn-settings').addEventListener('click', openThemePanel);
    $('#progress-steps').addEventListener('click', e => {
      const el = e.target.closest('.progress-step');
      if (!el) return;
      const target = +el.dataset.step;
      if (target === state.step || !canJumpTo(target)) return;
      state.step = target;
      saveState(); render();
      window.scrollTo(0, 0);
    });
    // Play mode's mobile swipe: dragging the content area left/right previews
    // the neighboring play tab and commits once the drag crosses a threshold,
    // like a native swipeable pager. Sequence per gesture:
    //   1. touchstart arms tracking (gated on Play mode, and not starting in
    //      a text field, so text selection is never hijacked).
    //   2. The first move past a small deadzone decides the gesture's AXIS
    //      only: mostly-vertical, or aimed at a horizontally scrollable child
    //      (e.g. the Talent Tree) that still has room to scroll that way,
    //      defers to native scrolling untouched; mostly-horizontal locks
    //      into "swipe" and follows the finger 1:1 (transform, no
    //      transition) plus shows the indicator pill.
    //   3. Direction is NOT locked with the axis: which neighbor is being
    //      approached is recomputed from the live, signed drag distance on
    //      every move (matching how native swipeable pagers behave), so
    //      reversing past the start point re-targets the other neighbor
    //      instead of freezing the first direction chosen (which could
    //      otherwise commit to the wrong tab on a large reversal).
    //   4. touchend/touchcancel either finishes the slide and commits the
    //      real tab change (past threshold, in whichever direction the drag
    //      actually ended) or eases back to rest (short of it) - never a
    //      hard, instant snap either way.
    const stepContentEl = $('#step-content');
    let _touchActive = false, _touchStartX = 0, _touchStartY = 0;
    let _axisLocked = null;   // null | 'swipe' | 'scroll'
    let _shownDir = 0;        // -1 | 1 | 0; which neighbor the indicator currently names
    let _swipeThreshold = 0;
    // True from the moment a commit/snap-back settle animation starts until
    // its deferred swipeChangeTab (or cleanup) actually runs. The real tab
    // change only happens once that timeout fires, reading state.step fresh
    // at that moment - so a second gesture started (and released) *before*
    // it fires would compute its own direction against the still-stale
    // state.step and could resolve against the wrong tab once both delayed
    // callbacks eventually run. Block a new gesture from arming until the
    // previous one has actually settled, same as native swipeable pagers
    // ignore new touch input mid-page-transition.
    let _swipeAnimating = false;

    function armStepContent() {
      stepContentEl.style.willChange = 'transform';
      document.body.classList.add('swiping-tabs');
    }
    function disarmStepContent() {
      stepContentEl.style.willChange = '';
      document.body.classList.remove('swiping-tabs');
    }
    // dir/committed reflect the gesture's state AT RELEASE, not whatever was
    // last shown mid-drag, so a reversed gesture always settles correctly.
    // Also captures which tab was current at release time: the real state.step
    // change is deferred until this animation finishes, so if a direct tap on
    // the tab strip navigates elsewhere during that window, this gesture's
    // shift must not stomp it back to a tab the user didn't choose.
    function settleSwipe(dir, committed) {
      const fromId = STEPS[state.step] && STEPS[state.step].id;
      _swipeAnimating = true;
      const w = stepContentEl.clientWidth || 1;
      stepContentEl.style.transition = committed ? 'transform 0.18s ease-in' : 'transform 0.22s cubic-bezier(0.2,0.8,0.2,1)';
      stepContentEl.style.transform = committed ? `translateX(${dir === 1 ? -w : w}px)` : 'translateX(0)';
      hideSwipeIndicator();
      setTimeout(() => {
        stepContentEl.style.transition = '';
        stepContentEl.style.transform = '';
        disarmStepContent();
        _swipeAnimating = false;
        const stillOnFromTab = STEPS[state.step] && STEPS[state.step].id === fromId;
        if (committed && stillOnFromTab) swipeChangeTab(dir);
      }, committed ? 180 : 220);
    }

    stepContentEl.addEventListener('touchstart', e => {
      // A new touch arriving mid-swipe (e.g. a second finger touching down
      // before the first lifts) would otherwise strand the drag transform,
      // indicator, and body class with no cleanup and no commit - abandon
      // that gesture cleanly first.
      if (_axisLocked === 'swipe') settleSwipe(_shownDir || 1, false);
      _touchActive = !_swipeAnimating && getPlayMode() === 'play' && e.touches.length === 1 &&
        !e.target.closest('input, textarea, select');
      _axisLocked = null;
      _shownDir = 0;
      if (!_touchActive) return;
      _touchStartX = e.touches[0].clientX;
      _touchStartY = e.touches[0].clientY;
      _swipeThreshold = Math.max(90, stepContentEl.clientWidth * 0.3);
    }, { passive: true });

    stepContentEl.addEventListener('touchmove', e => {
      if (!_touchActive) return;
      const t = e.touches[0];
      const dx = t.clientX - _touchStartX;
      const dy = t.clientY - _touchStartY;
      if (_axisLocked === null) {
        // Deliberately generous: once this locks to 'swipe' the very same
        // move calls preventDefault(), which (per the touch-event spec)
        // suppresses the synthetic click for the whole gesture - so an
        // ordinary tap that jitters sideways must not cross this before its
        // touchend, or the tap's own click is silently eaten.
        if (Math.abs(dx) < 24 && Math.abs(dy) < 24) return;   // too small to call yet
        if (Math.abs(dy) > Math.abs(dx) * 1.2) { _axisLocked = 'scroll'; return; }
        const initialDir = dx < 0 ? 1 : -1;
        let blocked = false;
        for (let el = e.target; el && el !== stepContentEl; el = el.parentElement) {
          if (el.scrollWidth <= el.clientWidth) continue;
          const canScrollMore = initialDir === 1 ? el.scrollLeft < el.scrollWidth - el.clientWidth - 1 : el.scrollLeft > 1;
          if (canScrollMore) { blocked = true; break; }
        }
        if (blocked) { _axisLocked = 'scroll'; return; }
        _axisLocked = 'swipe';
        armStepContent();
        stepContentEl.style.transition = 'none';
      }
      if (_axisLocked !== 'swipe') return;
      e.preventDefault();   // claimed as a tab-swipe; stop the page scrolling under it
      // Live direction: whichever way the drag currently points, not whatever
      // it pointed at first. Falls through to a damped rubber-band with no
      // indicator when that direction has no neighbor (already at that edge).
      const dir = dx < 0 ? 1 : dx > 0 ? -1 : _shownDir;
      const neighbor = dir && playNeighborStep(dir);
      const w = stepContentEl.clientWidth || 1;
      if (neighbor) {
        if (dir !== _shownDir) { _shownDir = dir; showSwipeIndicator(dir); }
        const clamped = Math.max(-w, Math.min(w, dx));
        stepContentEl.style.transform = `translateX(${clamped}px)`;
        updateSwipeIndicator(Math.abs(dx) / _swipeThreshold);
      } else {
        if (_shownDir !== 0) { _shownDir = 0; hideSwipeIndicator(); }
        stepContentEl.style.transform = `translateX(${dx * 0.3}px)`;
      }
    }, { passive: false });

    stepContentEl.addEventListener('touchend', e => {
      if (!_touchActive) return;
      _touchActive = false;
      if (_axisLocked !== 'swipe') return;
      const t = e.changedTouches[0];
      const dx = t.clientX - _touchStartX;
      const dir = dx < 0 ? 1 : dx > 0 ? -1 : 0;
      const neighbor = dir && playNeighborStep(dir);
      settleSwipe(dir || 1, !!neighbor && Math.abs(dx) >= _swipeThreshold);
    }, { passive: true });

    stepContentEl.addEventListener('touchcancel', () => {
      _touchActive = false;
      if (_axisLocked === 'swipe') settleSwipe(1, false);
    }, { passive: true });
    // Play mode's deposit/withdraw (credits) and add-XP (talents) controls.
    // Bound once on the persistent header bars; renderHeaderCredits/Xp only
    // ever replace their innerHTML, so the delegated listener survives.
    $('#header-credits').addEventListener('click', e => {
      const btn = e.target.closest('[data-credits-act]');
      if (!btn) return;
      applyCreditsAdjust(btn.dataset.creditsAct === 'withdraw' ? -1 : 1);
    });
    // No Enter-key shortcut here: unlike XP (add-only), credits can go either
    // way, and there is no safe default direction to guess at on Enter.
    $('#header-xp').addEventListener('click', e => {
      if (e.target.closest('[data-xp-act]')) applyXpAdjust();
    });
    $('#header-xp').addEventListener('keydown', e => {
      if (e.key === 'Enter' && e.target.id === 'xp-adjust-amt') { e.preventDefault(); applyXpAdjust(); }
    });
    // Editable weapon nickname on the sheet (no re-render so focus is kept).
    $('#step-content').addEventListener('input', e => {
      const wpn = e.target.closest('[data-wpn-key]');
      if (wpn) {
        const key = wpn.dataset.wpnKey;
        const bag = state.equipment && state.equipment.weapon;
        if (!bag || !bag[key]) return;   // only annotate an existing owned weapon
        bag[key].nickname = wpn.value;
        saveState();
        return;
      }
      // The Obligation detail textarea on the sheet (Duty/Morality have no
      // equivalent freeform field to edit). No re-render, so focus is kept.
      const oms = e.target.closest('[data-oms-field="obligation-detail"]');
      if (oms) { state.obligation.detail = oms.value; saveState(); return; }
      // Play mode's Notes textarea.
      const notes = e.target.closest('[data-notes]');
      if (notes) { state.notes = notes.value; saveState(); return; }
      // Play mode's Contacts list: a name or note field within a contact row.
      const cf = e.target.closest('[data-contact-field]');
      if (cf) {
        const row = cf.closest('[data-contact-id]');
        const c = row && (state.contacts || []).find(x => x.id === row.dataset.contactId);
        if (c) { c[cf.dataset.contactField] = cf.value; saveState(); }
        return;
      }
    });
    // Wound / strain trackers on the sheet (clamped to 0..threshold).
    $('#step-content').addEventListener('click', e => {
      // Tap an enhanced (green) stat value to reveal its "+N from talents" note.
      const enh = e.target.closest('[data-enhance]');
      if (enh) {
        const cell = enh.closest('.derived-cell, .strip-cell');
        if (cell) cell.classList.toggle('reveal-enhance');
        return;
      }
      // Tap a two-weapon set's name to expand/collapse its rules + weapon details.
      const dualToggle = e.target.closest('[data-dual-toggle]');
      if (dualToggle) {
        const card = dualToggle.closest('.wpn-card-dual');
        if (card) card.classList.toggle('expanded');
        return;
      }
      // Play mode's Contacts list: add a row, or remove one by id.
      if (e.target.closest('[data-act="add-contact"]')) { addContact(); return; }
      const rm = e.target.closest('[data-act="remove-contact"]');
      if (rm) { removeContact(rm.closest('[data-contact-id]').dataset.contactId); return; }
      const t = e.target.closest('[data-track]');
      if (!t) return;
      const key = t.dataset.track;            // 'woundCur' | 'strainCur'
      const d = Engine.derive(state);
      const max = key === 'woundCur' ? (d ? d.wound_threshold : 0) : (d ? d.strain_threshold : 0);
      state[key] = Math.max(0, Math.min(max, (state[key] || 0) + (+t.dataset.d)));
      saveState();
      renderSheet();
    });
    render();
  }

  return { init };
})();

document.addEventListener('DOMContentLoaded', Wizard.init);
