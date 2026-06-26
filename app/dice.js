'use strict';

// Narrative dice roller console, integrated with the character sheet.
// Builds a fixed bottom console that is shown only on the Sheet step (via the
// body.on-sheet class). Skill and weapon roll buttons feed Ability/Proficiency
// dice into the pool; the player sets difficulty and rolls. Dice face definitions
// are the canonical FFG Star Wars narrative dice.
const Dice = (() => {

  // s=success a=advantage f=failure h=threat tr=triumph de=despair lt=light dk=dark
  const DICE = {
    boost:       { label: 'Boost', faces: [{}, {}, { a: 2 }, { a: 1 }, { s: 1, a: 1 }, { s: 1 }] },
    ability:     { label: 'Ability', faces: [{}, { s: 1 }, { s: 1 }, { s: 2 }, { a: 1 }, { a: 1 }, { s: 1, a: 1 }, { a: 2 }] },
    proficiency: { label: 'Prof', faces: [{}, { s: 1 }, { s: 1 }, { s: 2 }, { s: 2 }, { a: 1 }, { s: 1, a: 1 }, { s: 1, a: 1 }, { s: 1, a: 1 }, { a: 2 }, { a: 2 }, { tr: 1 }] },
    setback:     { label: 'Setback', faces: [{}, {}, { f: 1 }, { f: 1 }, { h: 1 }, { h: 1 }] },
    difficulty:  { label: 'Diff', faces: [{}, { f: 1 }, { f: 2 }, { h: 1 }, { h: 1 }, { h: 1 }, { h: 2 }, { f: 1, h: 1 }] },
    challenge:   { label: 'Chal', faces: [{}, { f: 1 }, { f: 1 }, { f: 2 }, { f: 2 }, { h: 1 }, { h: 1 }, { f: 1, h: 1 }, { f: 1, h: 1 }, { h: 2 }, { h: 2 }, { de: 1 }] },
    force:       { label: 'Force', faces: [{ dk: 1 }, { dk: 1 }, { dk: 1 }, { dk: 1 }, { dk: 1 }, { dk: 1 }, { dk: 2 }, { lt: 1 }, { lt: 1 }, { lt: 2 }, { lt: 2 }, { lt: 2 }] },
  };
  const ORDER = ['boost', 'ability', 'proficiency', 'setback', 'difficulty', 'challenge', 'force'];
  const DIFFS = ['Simple', 'Easy', 'Average', 'Hard', 'Daunting', 'Formidable'];

  const pool = { boost: 0, ability: 0, proficiency: 0, setback: 0, difficulty: 0, challenge: 0, force: 0 };
  let labelText = '';

  const SYM_LABEL = { s: 'Success', a: 'Advantage', tr: 'Triumph', f: 'Failure', h: 'Threat', de: 'Despair', lt: 'Light', dk: 'Dark' };

  // Original glyphs (SVG), not the FFG symbol font.
  function sym(t, sz) {
    sz = sz || 13;
    const c = (p, f) => `<svg class="sym" width="${sz}" height="${sz}" viewBox="0 0 16 16">${p.replace(/FILL/g, f)}</svg>`;
    switch (t) {
      case 's':  return c('<path d="M8 1l1.6 4.7L14.5 6 10.6 9l1.4 5L8 11 4 14l1.4-5L1.5 6l4.9-.3z" fill="FILL"/>', '#e9c84a');
      case 'tr': return c('<path d="M8 0l1.9 4.4L14.7 5 11 8.1l1.3 4.9L8 10.3 3.7 13 5 8.1 1.3 5l4.8-.6z" fill="FILL"/><circle cx="8" cy="8" r="1.5" fill="#fff8e0"/>', '#ffd24a');
      case 'a':  return c('<path d="M8 2l6 11H2z" fill="FILL"/>', '#45c8d6');
      case 'f':  return c('<rect x="3.2" y="3.2" width="9.6" height="9.6" transform="rotate(45 8 8)" fill="none" stroke="FILL" stroke-width="2"/>', '#e06a55');
      case 'de': return c('<circle cx="8" cy="8" r="6.4" fill="FILL"/><path d="M5 5l6 6M11 5l-6 6" stroke="#2a0805" stroke-width="2" stroke-linecap="round"/>', '#d6493a');
      case 'h':  return c('<path d="M8 14L2 3h12z" fill="FILL"/>', '#e89a3c');
      case 'lt': return c('<circle cx="8" cy="8" r="6" fill="FILL" stroke="#9fb0c2" stroke-width="1"/>', '#f4f7fa');
      case 'dk': return c('<circle cx="8" cy="8" r="6" fill="FILL" stroke="#555" stroke-width="1"/>', '#1a1a1a');
    }
    return '';
  }

  function buildConsole() {
    if (document.getElementById('dc-console')) return;
    const el = document.createElement('div');
    el.className = 'dc-console';
    el.id = 'dc-console';
    el.innerHTML = `
      <button class="dc-collapse" data-dc="toggle">&#9662; Dice</button>
      <div class="dc-inner">
        <div class="dc-label" id="dc-label"></div>
        <div class="dc-top">
          <div class="dc-pool" id="dc-pool"></div>
          <div class="dc-diff" id="dc-diff">
            <span class="dc-diff-lab">Difficulty</span>
            ${DIFFS.map((d, i) => `<button data-dc-diff="${i}">${d}</button>`).join('')}
          </div>
          <div class="dc-actions">
            <button class="dc-btn" data-dc="clear">Clear</button>
            <button class="dc-btn dc-roll" data-dc="roll">ROLL</button>
          </div>
        </div>
        <div class="dc-results" id="dc-results"></div>
      </div>`;
    document.body.appendChild(el);
    // In mobile layout the tray starts collapsed so it does not cover the sheet;
    // tapping a skill or weapon die (setPoolFromUpgrade -> flash) expands it. The
    // vp-mobile class is set on <html> before this runs (inline head script).
    if (document.documentElement.classList.contains('vp-mobile')) {
      el.classList.add('min');
      const btn = el.querySelector('[data-dc="toggle"]');
      if (btn) btn.innerHTML = '&#9652; Dice';
    }
    renderPool();
  }

  function renderPool() {
    const el = document.getElementById('dc-pool');
    if (!el) return;
    const total = ORDER.reduce((a, d) => a + pool[d], 0);
    let h = ORDER.map(d => `
      <div class="dc-step">
        <div class="dc-chip" data-dc-die="${d}" data-add="1" title="Add ${DICE[d].label} (tap the minus to remove one)">
          <span class="dc-cnt">${pool[d]}</span>
          <span class="dc-mn" data-dc-die="${d}" data-add="-1">&minus;</span>
        </div>
        <span class="dc-die-lbl">${DICE[d].label}</span>
      </div>`).join('');
    if (total === 0) {
      h = `<span class="dc-empty">Hit the die on a skill or weapon to build a pool, or click a die to add it.</span>` + h;
    }
    el.innerHTML = h;
    const lbl = document.getElementById('dc-label');
    if (lbl) lbl.textContent = labelText;
  }

  function setPoolFromUpgrade(label, ability, prof, difficulty) {
    labelText = label || '';
    // Start a clean check: this skill/weapon's Ability + Proficiency, no leftover
    // context dice from a previous roll. The player then adds difficulty/boost/etc.
    // An optional starting difficulty seeds two-weapon penalty dice.
    pool.ability = Math.max(0, ability | 0);
    pool.proficiency = Math.max(0, prof | 0);
    pool.boost = pool.setback = pool.challenge = pool.force = 0;
    pool.difficulty = Math.max(0, difficulty | 0);
    renderPool();
    const r = document.getElementById('dc-results');
    if (r) r.classList.remove('show');
    flash();
  }

  function addDie(type, n) {
    if (!(type in pool)) return;
    pool[type] = Math.max(0, pool[type] + (n | 0));
    renderPool();
  }
  function setDifficulty(n) { pool.difficulty = Math.max(0, n | 0); renderPool(); }
  function clearPool() {
    for (const k in pool) pool[k] = 0;
    labelText = '';
    renderPool();
    const r = document.getElementById('dc-results');
    if (r) r.classList.remove('show');
  }

  function flash() {
    const c = document.getElementById('dc-console');
    if (!c) return;
    c.classList.remove('min');
    // Keep the collapse toggle's glyph in sync now that the tray is expanded.
    const tg = c.querySelector('[data-dc="toggle"]');
    if (tg) tg.innerHTML = '&#9662; Dice';
    c.classList.add('dc-flash');
    setTimeout(() => c.classList.remove('dc-flash'), 350);
  }

  function roll() {
    const total = ORDER.reduce((a, d) => a + pool[d], 0);
    if (total === 0) return;
    const tally = { s: 0, a: 0, f: 0, h: 0, tr: 0, de: 0, lt: 0, dk: 0 };
    const perDie = [];
    ORDER.forEach(d => {
      for (let i = 0; i < pool[d]; i++) {
        const f = DICE[d].faces[Math.floor(Math.random() * DICE[d].faces.length)];
        for (const k in f) tally[k] += f[k];
        perDie.push({ d, f });
      }
    });
    renderResults(tally, perDie);
  }

  function tchip(type, count, label) {
    return `<span class="dc-tchip">${sym(type, 14)} <span class="dc-c">${count}</span> ${label}</span>`;
  }

  function renderResults(t, perDie) {
    const succ = t.s + t.tr, fail = t.f + t.de;
    const netS = succ - fail, netA = t.a - t.h;

    let vmain, cls;
    if (netS > 0) { vmain = `Success (${netS})`; cls = 's'; }
    else if (netS < 0) { vmain = `Failure (${Math.abs(netS)})`; cls = 'f'; }
    else { vmain = 'No net successes'; cls = ''; }

    const extras = [];
    if (netA > 0) extras.push(`${netA} Advantage`);
    if (netA < 0) extras.push(`${Math.abs(netA)} Threat`);
    if (t.tr > 0) extras.push(`${t.tr} Triumph`);
    if (t.de > 0) extras.push(`${t.de} Despair`);

    const chips = [
      netS !== 0 && tchip(netS > 0 ? 's' : 'f', Math.abs(netS), netS > 0 ? 'Net success' : 'Net failure'),
      netA !== 0 && tchip(netA > 0 ? 'a' : 'h', Math.abs(netA), netA > 0 ? 'Net advantage' : 'Net threat'),
      t.tr > 0 && tchip('tr', t.tr, 'Triumph'),
      t.de > 0 && tchip('de', t.de, 'Despair'),
      t.lt > 0 && tchip('lt', t.lt, 'Light'),
      t.dk > 0 && tchip('dk', t.dk, 'Dark'),
    ].filter(Boolean).join('');

    const strip = perDie.map(p => {
      const keys = Object.keys(p.f);
      const inner = keys.map(k => { let o = ''; for (let i = 0; i < p.f[k]; i++) o += sym(k, 11); return o; }).join('');
      return `<div class="dc-pd ${keys.length ? '' : 'blank'}" data-dc-die="${p.d}">${inner}</div>`;
    }).join('');

    const res = document.getElementById('dc-results');
    res.innerHTML = `
      <div class="dc-verdict">
        <span class="dc-vmain ${cls}">${vmain}</span>
        ${extras.length ? `<span class="dc-vsub">with ${extras.join(' · ')}</span>` : ''}
      </div>
      ${chips ? `<div class="dc-totals">${chips}</div>` : '<div class="dc-totals"><span class="dc-tchip">Wash — nothing happens</span></div>'}
      <div class="dc-perdie">${strip}</div>
      <div class="dc-hint">Successes ${t.s + t.tr} · Advantages ${t.a} · Failures ${t.f + t.de} · Threats ${t.h}${(t.lt || t.dk) ? ` · Force ${t.lt} light / ${t.dk} dark` : ''}</div>`;
    res.classList.add('show');
  }

  // Click delegation for the console + any [data-dice-ability] roll buttons on the sheet.
  function wire() {
    document.addEventListener('click', e => {
      const roller = e.target.closest('[data-dice-ability]');
      if (roller) {
        setPoolFromUpgrade(roller.dataset.diceLabel || '', +roller.dataset.diceAbility || 0, +roller.dataset.diceProf || 0, +roller.dataset.diceDifficulty || 0);
        return;
      }
      const t = e.target.closest('[data-dc],[data-dc-die],[data-dc-diff]');
      if (!t) return;
      if (t.dataset.dc === 'roll') roll();
      else if (t.dataset.dc === 'clear') clearPool();
      else if (t.dataset.dc === 'toggle') {
        const c = document.getElementById('dc-console');
        c.classList.toggle('min');
        t.innerHTML = c.classList.contains('min') ? '&#9652; Dice' : '&#9662; Dice';
      } else if (t.dataset.dcDiff !== undefined) setDifficulty(+t.dataset.dcDiff);
      else if (t.dataset.dcDie !== undefined && t.classList.contains('dc-mn')) addDie(t.dataset.dcDie, t.dataset.add);
      else if (t.dataset.dcDie !== undefined && t.classList.contains('dc-chip')) addDie(t.dataset.dcDie, t.dataset.add);
    });
    document.addEventListener('contextmenu', e => {
      const c = e.target.closest('.dc-chip');
      if (c) { e.preventDefault(); addDie(c.dataset.dcDie, -1); }
    });
  }

  function init() { buildConsole(); wire(); }

  return { init, setPoolFromUpgrade, addDie, clearPool };
})();

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', Dice.init);
else Dice.init();
