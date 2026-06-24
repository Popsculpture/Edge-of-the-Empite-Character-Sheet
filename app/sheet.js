'use strict';

const Sheet = (() => {
  const GAME_NAMES = {
    eote: 'Edge of the Empire',
    aor:  'Age of Rebellion',
    fad:  'Force and Destiny',
  };

  function render(container, state, derived) {
    const species = Engine.getSpecies(state.speciesKey);
    const career  = Engine.getCareer(state.careerKey);
    const spec    = Engine.getSpec(state.specKey);
    const chars   = state.characteristics || {};

    container.innerHTML = `
      <div class="sheet-root">
        ${headerBlock(state, species, career, spec)}
        ${charsBlock(chars)}
        ${derivedBlock(derived)}
        ${abilitiesBlock(species, state)}
        ${skillsBlock(derived)}
        ${equipmentBlock(state, derived)}
        ${spec ? treeBlock(spec) : ''}
        <div class="print-btn">
          <button class="btn btn-secondary btn-sm" onclick="window.print()">Print / Save as PDF</button>
        </div>
      </div>`;
  }

  function headerBlock(state, species, career, spec) {
    const mech = mechanicLine(state);
    return `
      <div class="sheet-header">
        <div class="sheet-header-left">
          <h1>${esc(state.name) || 'Unnamed Character'}</h1>
          <p>
            ${species ? esc(species.name) : ''}
            ${career  ? ' &mdash; ' + esc(career.name) : ''}
            ${spec    ? ' / ' + esc(spec.name) : ''}
            ${state.game ? ' &mdash; <em>' + GAME_NAMES[state.game] + '</em>' : ''}
          </p>
        </div>
        <div class="sheet-header-right">
          ${state.player ? `Player: <strong>${esc(state.player)}</strong><br>` : ''}
          ${mech}
          ${state.motivation ? `<br>Motivation: <strong>${esc(state.motivation)}</strong>` : ''}
        </div>
      </div>`;
  }

  function charsBlock(chars) {
    const rows = Engine.CHAR_STATS.map(stat => `
      <div style="text-align:center;padding:14px 6px;border-right:1px solid var(--border)">
        <div style="font-size:0.62rem;text-transform:uppercase;letter-spacing:0.1em;color:var(--muted)">${Engine.CHAR_ABBR[stat]}</div>
        <div style="font-size:2.2rem;font-weight:800;color:var(--accent);line-height:1;margin:4px 0">${chars[stat] ?? '—'}</div>
        <div style="font-size:0.65rem;color:var(--muted)">${stat.charAt(0).toUpperCase() + stat.slice(1)}</div>
      </div>`).join('');

    return `
      <div class="sheet-panel" style="grid-column:1/-1;display:grid;grid-template-columns:auto repeat(6,1fr);padding:0;overflow:hidden">
        <div style="background:var(--surface2);display:flex;align-items:center;justify-content:center;padding:10px 14px;border-right:1px solid var(--border)">
          <span style="font-size:0.6rem;text-transform:uppercase;letter-spacing:0.12em;color:var(--muted);writing-mode:vertical-rl;transform:rotate(180deg)">Characteristics</span>
        </div>
        ${rows}
      </div>`;
  }

  function derivedBlock(d) {
    const boxes = [
      ['Wound Threshold',  d.wound_threshold],
      ['Strain Threshold', d.strain_threshold],
      ['Soak Value',       d.soak],
      ['Defense (Rng)',    d.defense_ranged],
      ['Defense (Mel)',    d.defense_melee],
      ['XP Remaining',     d.xp_remaining],
    ].map(([label, val]) => `
      <div class="derived-box">
        <div class="derived-box-label">${label}</div>
        <div class="derived-box-value">${val}</div>
      </div>`).join('');

    return `
      <div class="sheet-panel">
        <div class="sheet-panel-title">Derived Stats</div>
        <div class="derived-grid">${boxes}</div>
      </div>`;
  }

  function abilitiesBlock(species, state) {
    const abilities = (species ? species.special_abilities : []).map(a => {
      const colon = a.indexOf(':');
      if (colon > 0 && colon < 40) {
        return `<p><strong>${a.slice(0, colon)}:</strong>${a.slice(colon + 1)}</p>`;
      }
      return `<p>${a}</p>`;
    }).join('');

    const bgSection = state.background
      ? `<div style="margin-top:14px;padding-top:12px;border-top:1px solid var(--border);font-size:0.82rem;color:var(--muted)">
           <strong style="color:var(--text)">Background: </strong>${esc(state.background)}</div>`
      : '';

    return `
      <div class="sheet-panel">
        <div class="sheet-panel-title">Species Abilities${species ? ' — ' + esc(species.name) : ''}</div>
        <div class="sheet-abilities">${abilities || '<p style="color:var(--muted)">None listed.</p>'}</div>
        ${bgSection}
      </div>`;
  }

  function skillsBlock(derived) {
    const careerKeys = derived.career_skill_keys || [];
    const bonusKeys  = derived.bonus_skill_keys  || [];
    const ranks      = derived.skill_ranks        || {};

    const groups = {};
    for (const skill of SW.skills) {
      const g = skill.type || 'General';
      if (!groups[g]) groups[g] = [];
      groups[g].push(skill);
    }

    const ORDER = ['General', 'Combat', 'Knowledge'];
    let html = '';
    for (const gname of ORDER) {
      const list = groups[gname] || [];
      if (!list.length) continue;
      html += `<div style="font-size:0.65rem;text-transform:uppercase;letter-spacing:0.1em;color:var(--muted);margin:10px 0 4px;padding-top:6px;border-top:1px solid var(--border);break-inside:avoid">${gname} Skills</div>`;
      for (const skill of list) {
        const rank     = ranks[skill.key] || 0;
        const isCareer = careerKeys.includes(skill.key);
        const isBonus  = bonusKeys.includes(skill.key);
        const nameCol  = (isCareer || isBonus) ? 'color:var(--accent)' : '';
        const pips = Array.from({length: 5}, (_, i) => {
          const filled = i < rank;
          return `<div class="rank-pip${filled ? ' filled' : ''}${isCareer ? ' career' : ''}"></div>`;
        }).join('');
        html += `
          <div class="sheet-skill-row">
            <span class="sheet-skill-name" style="${nameCol}">${skill.name}</span>
            <span class="sheet-skill-char">${skill.characteristic.slice(0,3).toUpperCase()}</span>
            <div class="rank-pips">${pips}</div>
          </div>`;
      }
    }

    return `
      <div class="sheet-panel" style="grid-column:1/-1">
        <div class="sheet-panel-title">Skills <span style="font-size:0.7em;font-weight:400;color:var(--muted)">(highlighted = career/spec skill)</span></div>
        <div class="sheet-skills-list">${html}</div>
      </div>`;
  }

  function treeBlock(spec) {
    const rows = (spec.talent_tree || []).map(row => `
      <div class="tree-row">
        <div class="tree-cost">${row.cost}</div>
        ${(row.talents || []).map(t =>
          `<div class="tree-cell${t ? '' : ' empty'}">${esc(t) || '—'}</div>`
        ).join('')}
      </div>`).join('');

    return `
      <div class="sheet-panel" style="grid-column:1/-1">
        <div class="sheet-panel-title">Talent Tree — ${esc(spec.name)}</div>
        <div style="font-size:0.75rem;color:var(--muted);margin-bottom:10px">
          Bonus career skills: <strong style="color:var(--text)">${(spec.bonus_career_skills||[]).join(', ')}</strong></div>
        <div class="sheet-tree-display">${rows}</div>
        <p style="margin-top:10px;font-size:0.75rem;color:var(--muted)">Talent connection topology not yet encoded — purchase order shown by tier cost only.</p>
      </div>`;
  }

  function equipmentBlock(state, derived) {
    const eq = state.equipment || {};
    const dmg = w => (w.damage === '' || w.damage == null) ? '—' : (w.damageType === 'add' ? '+' + w.damage : '' + w.damage);
    const cr  = n => (typeof n === 'number' ? n.toLocaleString('en-US') : (n || '—'));

    // Only items flagged "show" appear on the sheet
    function lines(cat, fmt) {
      const bag = eq[cat] || {};
      const keys = Object.keys(bag).filter(k => bag[k] && bag[k].qty && bag[k].show !== false);
      return keys.map(k => {
        const it = Engine.getItem(cat, k);
        if (!it) return '';
        return fmt(it, bag[k]);
      }).join('');
    }

    const wRows = lines('weapon', (w, l) => `
      <div class="sheet-eq-row">
        <span class="sheet-eq-name">${esc(w.name)}${l.qty > 1 ? ` &times;${l.qty}` : ''}${l.equip ? ' <em class="sheet-eq-worn">(equipped)</em>' : ''}${l.free ? ' <em class="sheet-eq-free">(free)</em>' : ''}</span>
        <span class="sheet-eq-meta">${esc(w.skill || '')} &middot; Dmg ${dmg(w)} &middot; Crit ${w.crit ?? '—'} &middot; ${esc(w.range || '')}${(w.qualities||[]).length ? ' &middot; ' + w.qualities.map(q => esc(q.name) + (q.count ? ' ' + q.count : '')).join(', ') : ''}</span>
      </div>`);

    const aRows = lines('armor', (a, l) => `
      <div class="sheet-eq-row">
        <span class="sheet-eq-name">${esc(a.name)}${derived && derived.worn_armor === a.key ? ' <em class="sheet-eq-worn">(worn)</em>' : ''}${l.free ? ' <em class="sheet-eq-free">(free)</em>' : ''}</span>
        <span class="sheet-eq-meta">Soak +${a.soak ?? 0} &middot; Defense +${a.defense ?? 0} &middot; Enc ${a.encumbrance ?? '—'}</span>
      </div>`);

    const gRows = lines('gear', (g, l) => `
      <div class="sheet-eq-row">
        <span class="sheet-eq-name">${esc(g.name)}${l.qty > 1 ? ` &times;${l.qty}` : ''}${l.free ? ' <em class="sheet-eq-free">(free)</em>' : ''}</span>
        <span class="sheet-eq-meta">${esc(g.type || '')}${g.encumbrance ? ' &middot; Enc ' + g.encumbrance : ''}</span>
      </div>`);

    // Two-weapon sets
    const sets = (eq.weaponSets || []).filter(s => {
      const wb = eq.weapon || {};
      return wb[s.a] && wb[s.a].qty && wb[s.b] && wb[s.b].qty;
    });
    const setRows = sets.map(s => {
      const a = Engine.getWeapon(s.a), b = Engine.getWeapon(s.b);
      return `<div class="sheet-eq-row"><span class="sheet-eq-name">${esc(a ? a.name : '?')} + ${esc(b ? b.name : '?')}</span></div>`;
    }).join('');

    if (!wRows && !aRows && !gRows) return '';

    const sub = (title, rows) => rows
      ? `<div class="sheet-eq-group"><div class="sheet-eq-group-title">${title}</div>${rows}</div>` : '';

    const remain = derived ? derived.credits_remaining : 0;
    return `
      <div class="sheet-panel" style="grid-column:1/-1">
        <div class="sheet-panel-title">Equipment
          <span style="font-size:0.7em;font-weight:400;color:var(--muted)">(${cr(remain)} cr unspent)</span></div>
        <div class="sheet-eq-cols">
          ${sub('Weapons', wRows)}
          ${sub('Armor', aRows)}
          ${sub('Gear', gRows)}
          ${sub('Two-Weapon Sets', setRows)}
        </div>
      </div>`;
  }

  function mechanicLine(state) {
    if (state.game === 'eote' && state.obligation.type) {
      return `Obligation: <strong>${esc(state.obligation.type)} (${state.obligation.magnitude})</strong>`;
    }
    if (state.game === 'aor' && state.duty.type) {
      const def = state.duty.deficit || 0;
      return `Duty: <strong>${esc(state.duty.type)}${def ? ` (deficit: ${def})` : ''}</strong>`;
    }
    if (state.game === 'fad') {
      const parts = [];
      if (state.morality.strength) parts.push(`Strength: <strong>${esc(state.morality.strength)}</strong>`);
      if (state.morality.weakness) parts.push(`Weakness: <strong>${esc(state.morality.weakness)}</strong>`);
      parts.push(`Morality: <strong>${state.morality.score}</strong>`);
      return parts.join('<br>');
    }
    return '';
  }

  function esc(s) {
    return (s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/"/g,'&quot;');
  }

  return { render };
})();
