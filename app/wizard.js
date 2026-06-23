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

  // ── Step: Species ─────────────────────────────────────────────────────────
  function renderSpecies() {
    const c = $('#step-content');
    c.innerHTML = `
      <div class="step-header"><h2>Choose Your Species</h2>
        <p>Your species determines your starting characteristics, XP, and special abilities.</p></div>
      <div class="filter-bar">
        <input type="search" id="sp-search" placeholder="Search species...">
      </div>
      <div class="species-grid" id="sp-grid"></div>`;

    function draw(filter) {
      const grid = $('#sp-grid');
      grid.innerHTML = '';
      const list = SW.species.filter(s => !filter || s.name.toLowerCase().includes(filter.toLowerCase()));
      if (!list.length) { grid.innerHTML = '<div class="empty-state">No species found.</div>'; return; }

      for (const sp of list) {
        const sel = state.speciesKey === sp.key;
        const card = document.createElement('div');
        card.className = `species-card${sel ? ' selected' : ''}`;
        const pips = Engine.CHAR_STATS.map(st =>
          `<div class="char-pip"><abbr title="${st}">${Engine.CHAR_ABBR[st]}</abbr><strong>${sp[st] ?? '?'}</strong></div>`
        ).join('');
        const ab0 = (sp.special_abilities[0] || '');
        const ab  = ab0.length > 90 ? ab0.slice(0, 90) + '…' : ab0;
        card.innerHTML = `
          <h3>${sp.name}</h3>
          <div class="char-pips">${pips}</div>
          <div class="species-meta">
            <span>${sp.starting_xp ?? '?'} XP</span>
            <span>WT ${sp.wound_threshold}+${(sp.wound_threshold_stat||'Brawn').slice(0,2).toUpperCase()}</span>
            <span>ST ${sp.strain_threshold}+${(sp.strain_threshold_stat||'Willpower').slice(0,2).toUpperCase()}</span>
          </div>
          ${ab ? `<div class="species-ability">${ab}</div>` : ''}`;
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
          draw($('#sp-search').value);
          renderNav(); renderHeaderXp();
        });
        grid.appendChild(card);
      }
    }

    draw('');
    $('#sp-search').addEventListener('input', e => draw(e.target.value));
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
      const tags = (ca.career_skill_keys || []).map(k => `<span class="skill-tag">${skillName(k)}</span>`).join('');
      card.innerHTML = `
        <span class="game-badge badge-${state.game}">${g ? g.name : ''}</span>
        <h3>${ca.name}</h3>
        <div class="skill-tags">${tags}</div>`;
      card.addEventListener('click', () => {
        if (state.careerKey !== ca.key) {
          state.careerKey = ca.key; state.specKey = null; state.freeCareerSkillPicks = [];
        }
        saveState(); renderStep(); renderNav();
      });
      grid.appendChild(card);
    }
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
        if (s.is_respec) return false;
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

        const bonusTags = (sp.bonus_career_skills || [])
          .map(s => `<span class="skill-tag bonus">${s}</span>`).join('');

        const treeHtml = (sp.talent_tree || []).map(row =>
          `<div class="tree-row"><div class="tree-cost">${row.cost}</div>${
            (row.talents || []).map(t =>
              `<div class="tree-cell${t ? '' : ' empty'}">${t || '—'}</div>`
            ).join('')}</div>`
        ).join('');

        card.innerHTML = `
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px">
            <h3>${sp.name}</h3>
            ${!inCareer ? '<span style="font-size:0.68rem;color:var(--muted);border:1px solid var(--border);padding:1px 5px;border-radius:3px">Out-of-career</span>' : ''}
          </div>
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
