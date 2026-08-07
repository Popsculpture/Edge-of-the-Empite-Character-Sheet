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
  // What kind of check seeded the pool: 'combat' (attack buttons), 'skill'
  // (sheet skill dice, with the skill name), or 'generic' (pool built by hand
  // in the tray). Drives which spend-your-results tips a roll offers.
  let ctxType = 'generic';
  let ctxSkill = '';
  let ctxCraft = '';   // crafting template key, when the pool came from a build

  // What leftover symbols can buy, compressed from the EotE Core Rulebook
  // (combat: Tables 6-2 and 6-3, p.206-207; general play: the dice symbol
  // rules, p.12-24 and p.23-24; skills: the Chapter 3 skill entries). The
  // Reference tab carries the full rules text; these are prompts at the
  // table, not an exhaustive list, and the GM narrates Threat and Despair.
  const SPEND = {
    combat: {
      a: [
        { c: 1, t: 'Recover 1 strain (repeatable)' },
        { c: 1, t: 'Add a boost die to the next allied character\'s check' },
        { c: 1, t: 'Notice an important point in the conflict: a control panel, a weak spot' },
        { c: 1, t: 'On a damaging hit: activate a weapon quality, or a Critical Injury for the weapon\'s Crit rating' },
        { c: 2, t: 'Perform an immediate free maneuver (two-maneuver limit still applies)' },
        { c: 2, t: 'Add a setback die to the target\'s next check' },
        { c: 2, t: 'Add a boost die to any ally\'s next check, including your own' },
        { c: 3, t: 'Negate the target\'s defense (cover, equipment, Guarded Stance) this round' },
        { c: 3, t: 'Ignore penalizing environmental effects until the end of your next turn' },
        { c: 3, t: 'Disable the opponent or one piece of their gear instead of dealing wounds' },
        { c: 3, t: 'Gain +1 melee or ranged defense until the end of your next turn' },
        { c: 3, t: 'Force the target to drop a wielded weapon' },
      ],
      tr: [
        { c: 1, t: 'On a damaging hit: inflict a Critical Injury or activate any weapon quality, whatever its cost' },
        { c: 1, t: 'Upgrade the difficulty of the target\'s next check' },
        { c: 1, t: 'Upgrade any ally\'s next check, including your own' },
        { c: 1, t: 'Do something vital: shoot the blast door controls shut' },
        { c: 2, t: 'Destroy a piece of equipment the target is using' },
      ],
      h: [
        { c: 1, t: 'You suffer 1 strain (repeatable)' },
        { c: 1, t: 'You lose the benefit of a prior maneuver (cover, Guarded Stance) until repeated' },
        { c: 2, t: 'An opponent performs an immediate free maneuver' },
        { c: 2, t: 'Add a boost die to the target\'s next check' },
        { c: 2, t: 'You or an ally suffer a setback die on the next action' },
        { c: 3, t: 'You fall prone' },
        { c: 3, t: 'You hand the enemy a significant advantage in the encounter' },
      ],
      de: [
        { c: 1, t: 'Your ranged weapon runs out of ammo for the encounter' },
        { c: 1, t: 'Your tool or melee weapon is damaged' },
        { c: 1, t: 'Upgrade the difficulty of an ally\'s next check' },
      ],
    },
    generic: {
      a: [
        { c: 1, t: 'Recover 1 strain (repeatable)' },
        { c: 1, t: 'Add a boost die to an ally\'s next check' },
        { c: 1, t: 'Notice a useful detail, shortcut, or opening others missed' },
        { c: 2, t: 'Finish the task faster, quieter, or better than expected' },
        { c: 2, t: 'Create an opportunity: an extra maneuver, a foothold for the next check' },
      ],
      tr: [
        { c: 1, t: 'A potent boon: trigger a powerful effect, or even recover a wound' },
        { c: 1, t: 'Upgrade an ally\'s next check, or do something vital to the scene' },
      ],
      h: [
        { c: 1, t: 'You suffer 1 strain (repeatable)' },
        { c: 1, t: 'The task takes longer than expected' },
        { c: 2, t: 'An opponent gains an opening or a boost die' },
        { c: 2, t: 'You lose the benefit of a prior maneuver or of your position' },
        { c: 3, t: 'A real complication: fall prone, an alarm, an environmental effect' },
      ],
      de: [
        { c: 1, t: 'A potent setback: gear breaks or jams, wounds instead of strain, the plan leaks' },
        { c: 1, t: 'Upgrade the difficulty of an ally\'s next check' },
      ],
    },
    // Skill-specific color from the Chapter 3 entries, shown above the
    // general options when that skill seeded the pool.
    skills: {
      'Charm':       { a: 'Sway bystanders beyond your original target', tr: 'The target becomes a recurring ally predisposed to help', h: 'Fewer people influenced, or some turn against you', de: 'One NPC becomes a minor recurring adversary' },
      'Coercion':    { a: '2: Cow onlookers who witnessed the attempt', tr: 'Break the subject\'s will; their allegiance shifts to you', h: 'The subject grows to despise you', de: 'You reveal your own goals and motives to the target' },
      'Deception':   { a: 'Increase the value of the goods or services gained', tr: 'The target now trusts you; future lies to them are unopposed', h: 'Part of the lie slips; the target grows suspicious', de: 'Word of the deceit spreads; your reputation suffers' },
      'Leadership':  { a: 'Bystanders follow the order too', tr: 'The target becomes a faithful recurring follower', h: 'Orders are carried out slowly or poorly', de: 'Your authority is undermined; the target may turn others against you' },
      'Negotiation': { a: 'Earn an unrelated concession or boon from the other side', tr: 'The other party becomes a regular client or vendor', h: 'Worse prices, shorter terms', de: 'The deal is sabotaged: counterfeit goods, poisoned terms' },
      'Computers':   { a: 'Uncover extra information in the system', tr: 'Cover your tracks: each Triumph adds a success against later trace attempts', h: 'Security is alerted; hunters get boost dice on your trail', de: 'You leave traces that expose your own system' },
      'Cool':        { a: 'Spot a complication early, or something you can exploit', tr: 'Recover 3 strain per Triumph', h: 'You miss a vital detail or event', de: 'Staggered for a round, overwhelmed by the chaos' },
    },
  };

  // Result symbols drawn with the Edge of the Empire symbol font (see .es /
  // @font-face in the stylesheet). Each entry is [glyph letter, canonical
  // colour]. The letters are fixed by the font: s Success, a Advantage,
  // f Failure, t Threat, x Triumph, y Despair, z Force pip.
  const GLYPH = {
    s:  ['s', '#e9c84a'], a:  ['a', '#4fc0e8'], f:  ['f', '#e0674f'],
    h:  ['t', '#e0952f'], tr: ['x', '#ffd24a'], de: ['y', '#d6493a'],
    lt: ['z', '#f4f7fa'], dk: ['z', '#3a3a3a'],
  };

  // One result glyph. Size is set in CSS by context (.dc-tchip vs .dc-perdie).
  // Totals chips sit on a neutral background, so each glyph is coloured by symbol.
  // Per-die boxes ('die' mode) sit on the die's own colour, so the glyph inherits
  // a contrasting monochrome set per die in CSS. Force pips carry a marker class
  // (dc-lt / dc-dk) in both modes so light and dark stay distinct: on the white
  // die and on the dark totals chip alike.
  function sym(t, mode) {
    const g = GLYPH[t];
    if (!g) return '';
    const pip = t === 'lt' ? ' dc-lt' : t === 'dk' ? ' dc-dk' : '';
    if (mode === 'die') return `<span class="es dc-sym${pip}">${g[0]}</span>`;
    return `<span class="es dc-sym${pip}" style="color:${g[1]}">${g[0]}</span>`;
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

  function setPoolFromUpgrade(label, ability, prof, difficulty, context, skill) {
    labelText = label || '';
    // Remember what kind of check this is so the results can offer the right
    // spend options. A hand-built pool (no seeding button) stays generic.
    ctxCraft = '';
    if (context && context.slice(0, 6) === 'craft:') { ctxType = 'craft'; ctxCraft = context.slice(6); }
    else ctxType = context === 'combat' || context === 'skill' ? context : 'generic';
    ctxSkill = skill || '';
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
    ctxType = 'generic';
    ctxSkill = '';
    ctxCraft = '';
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
    return `<span class="dc-tchip">${sym(type)} <span class="dc-c">${count}</span> ${label}</span>`;
  }

  // A crafting check spends its results on that template's own lists: the
  // crafter takes improvements with advantage and triumph, the GM imposes
  // flaws with threat and despair. A triumph pays any advantage cost outright,
  // and a despair any threat cost, exactly as the printed tables read.
  function craftTipsHtml(t, netA) {
    // Engine is a top-level const, not a window property, so probe it by name.
    const found = typeof Engine !== 'undefined' && Engine.craftTemplate
      ? Engine.craftTemplate(ctxCraft) : null;
    if (!found) return '';
    const netH = -netA;
    const groups = (list, kind) => (list || []).filter(g => {
      if (kind === 'imp') return (g.adv && (netA >= g.adv || t.tr >= 1)) || (g.tri && t.tr >= g.tri);
      return (g.thr && (netH >= g.thr || t.de >= 1)) || (g.des && t.de >= g.des);
    }).map(g => {
      const n = g.adv || g.tri || g.thr || g.des;
      const noun = g.tri ? 'Triumph' : g.des ? 'Despair' : kind === 'imp' ? 'Advantage' : 'Threat';
      const own = `${n} ${noun}${n > 1 ? 's' : ''}`;
      return `<div class="dc-tip-sec"><div class="dc-tip-h">${sym(kind === 'imp' ? (g.tri ? 'tr' : 'a') : (g.des ? 'de' : 'h'))} ${own}</div>
        <ul class="dc-tip-list">${g.options.map(o =>
          `<li><i class="dc-tip-cost">${kind === 'imp' ? '+' : '!'}</i><strong>${o.name}.</strong>&nbsp;${o.text}</li>`).join('')}</ul></div>`;
    }).join('');

    const imp = groups(found.category.improvements, 'imp');
    const flaw = groups(found.category.flaws, 'flaw');
    if (!imp && !flaw) return '';
    return `<div class="dc-tips">
      <div class="dc-tip-note">Building: ${found.template.name}</div>
      ${imp}${flaw}
      <div class="dc-tip-note">Each success past the first cuts 2 hours off the build, to a minimum of 1.</div>
    </div>`;
  }

  // Spend-your-results tips: only the options this roll can actually afford,
  // colored by what seeded the pool (combat, a specific skill, or generic).
  // The player narrates Advantage and Triumph; the GM narrates Threat and
  // Despair, so those sections are framed as what the GM may do.
  function tipsHtml(t, netA) {
    if (ctxType === 'craft') return craftTipsHtml(t, netA);
    const lib = ctxType === 'combat' ? SPEND.combat : SPEND.generic;
    const skill = ctxType === 'skill' ? SPEND.skills[ctxSkill] : null;
    const netH = -netA;

    const list = (opts, budget, skillTip) => {
      const rows = opts.filter(o => o.c <= budget)
        .map(o => `<li><i class="dc-tip-cost">${o.c}</i>${o.t}</li>`);
      if (skillTip) rows.unshift(`<li class="dc-tip-skill"><i class="dc-tip-cost">&#9733;</i>${skillTip}</li>`);
      return rows.length ? `<ul class="dc-tip-list">${rows.join('')}</ul>` : '';
    };
    const section = (type, title, body, note) => body
      ? `<div class="dc-tip-sec"><div class="dc-tip-h">${sym(type)} ${title}</div>${body}${note ? `<div class="dc-tip-note">${note}</div>` : ''}</div>`
      : '';

    const out = [];
    if (netA > 0) {
      out.push(section('a', `Spend ${netA} Advantage`,
        list(lib.a, netA, skill && skill.a ? `${ctxSkill}: ${skill.a}` : '')));
    }
    if (t.tr > 0) {
      out.push(section('tr', `Spend ${t.tr} Triumph`,
        list(lib.tr, t.tr, skill && skill.tr ? `${ctxSkill}: ${skill.tr}` : ''),
        ctxType === 'combat' ? 'A Triumph can also buy any Advantage option, whatever its cost.' : ''));
    }
    if (netH > 0) {
      out.push(section('h', `${netH} Threat (the GM spends)`,
        list(lib.h, netH, skill && skill.h ? `${ctxSkill}: ${skill.h}` : '')));
    }
    if (t.de > 0) {
      out.push(section('de', `${t.de} Despair (the GM spends)`,
        list(lib.de, t.de, skill && skill.de ? `${ctxSkill}: ${skill.de}` : '')));
    }
    const body = out.filter(Boolean).join('');
    if (!body) return '';
    return `<div class="dc-tips">${body}<div class="dc-tip-note">Prompts, not limits: invent other spends with the GM. Full rules on the Reference tab.</div></div>`;
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
      const inner = keys.map(k => { let o = ''; for (let i = 0; i < p.f[k]; i++) o += sym(k, 'die'); return o; }).join('');
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
      <div class="dc-hint">Successes ${t.s + t.tr} · Advantages ${t.a} · Failures ${t.f + t.de} · Threats ${t.h}${(t.lt || t.dk) ? ` · Force ${t.lt} light / ${t.dk} dark` : ''}</div>
      ${tipsHtml(t, netA)}`;
    res.classList.add('show');
  }

  // Click delegation for the console + any [data-dice-ability] roll buttons on the sheet.
  function wire() {
    document.addEventListener('click', e => {
      const roller = e.target.closest('[data-dice-ability]');
      if (roller) {
        setPoolFromUpgrade(roller.dataset.diceLabel || '', +roller.dataset.diceAbility || 0, +roller.dataset.diceProf || 0, +roller.dataset.diceDifficulty || 0,
                           roller.dataset.diceContext || '', roller.dataset.diceSkill || '');
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
