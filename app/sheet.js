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
    // Effective characteristics include always-on talent bonuses (e.g. Dedication).
    const chars   = (derived && derived.characteristics) || state.characteristics || {};
    const vBlock  = vehicleBlock(state);

    container.innerHTML = `
      <div class="sheet-root">
        ${headerBlock(state, species, career, spec)}
        ${charsBlock(chars)}
        ${derivedBlock(derived)}
        ${abilitiesBlock(species, state)}
        ${skillsBlock(derived, chars)}
        ${talentsBlock(derived)}
        ${equipmentBlock(state, derived)}
        ${vBlock}
        ${spec ? treeBlock(spec, state) : ''}
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
    const tb = d.talent_stat_bonuses || {};
    // Small "+N" note when a talent boosts the stat, so the source is visible.
    const note = n => (n ? `<div class="derived-box-note">+${n} from talents</div>` : '');
    const boxes = [
      ['Wound Threshold',  d.wound_threshold,  note(tb.wound)],
      ['Strain Threshold', d.strain_threshold, note(tb.strain)],
      ['Soak Value',       d.soak,             note(tb.soak)],
      ['Defense (Rng)',    d.defense_ranged,    note(tb.defenseRanged)],
      ['Defense (Mel)',    d.defense_melee,     note(tb.defenseMelee)],
      ['XP Remaining',     d.xp_remaining,      ''],
    ];
    if (d.force_rating > 0) boxes.push(['Force Rating', d.force_rating, note(tb.forceRating)]);
    const html = boxes.map(([label, val, n]) => `
      <div class="derived-box">
        <div class="derived-box-label">${label}</div>
        <div class="derived-box-value">${val}</div>
        ${n}
      </div>`).join('');

    return `
      <div class="sheet-panel">
        <div class="sheet-panel-title">Derived Stats</div>
        <div class="derived-grid">${html}</div>
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

  // FFG narrative dice glyphs (Edge of the Empire Core, p.102):
  // a skill check rolls max(characteristic, rank) dice, with min(characteristic,
  // rank) of them upgraded from green Ability (d8) to yellow Proficiency (d12).
  const DIE_ABILITY = '<svg class="die die-ability" viewBox="0 0 20 20" aria-hidden="true"><polygon points="10,1 19,10 10,19 1,10"/></svg>';
  const DIE_PROF    = '<svg class="die die-prof" viewBox="0 0 20 20" aria-hidden="true"><polygon points="19,10 14.5,2.2 5.5,2.2 1,10 5.5,17.8 14.5,17.8"/></svg>';
  // A black Setback die (d6) struck out in red = "remove one setback" from a talent.
  const DIE_SETBACK_OUT = '<svg class="die die-setback-out" viewBox="0 0 20 20" aria-hidden="true"><rect x="3.5" y="3.5" width="13" height="13" rx="2.5"/><line x1="2.6" y1="10" x2="17.4" y2="10"/></svg>';

  // Build the dice-pool glyphs for a characteristic value + skill rank.
  // removedSetback appends that many struck-out setback dice (talent benefit).
  function dicePool(charVal, rank, removedSetback) {
    const c = Math.max(0, Number(charVal) || 0);
    const r = Math.max(0, Number(rank)    || 0);
    const rsb = Math.max(0, Number(removedSetback) || 0);
    const total = Math.max(c, r);
    const setbackGlyphs = rsb
      ? `<span class="skill-setback-set" title="Talent removes ${rsb} setback ${rsb === 1 ? 'die' : 'dice'} from this skill">${DIE_SETBACK_OUT.repeat(rsb)}</span>`
      : '';
    if (total <= 0) return `<span class="skill-dice-none">&mdash;</span>${setbackGlyphs}`;
    const yellow = Math.min(c, r);      // Proficiency dice
    const green  = total - yellow;      // Ability dice
    const parts = [];
    if (yellow) parts.push(`${yellow} Proficiency`);
    if (green)  parts.push(`${green} Ability`);
    const glyphs = DIE_PROF.repeat(yellow) + DIE_ABILITY.repeat(green);
    return `<span class="skill-dice-set" title="${parts.join(', ')}">${glyphs}</span>${setbackGlyphs}`;
  }

  function skillsBlock(derived, chars) {
    chars = chars || {};
    const careerKeys = derived.career_skill_keys || [];
    const bonusKeys  = derived.bonus_skill_keys  || [];
    const ranks      = derived.skill_ranks        || {};
    const setbackOut = derived.skill_setback_removed || {};

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
      let zi = 0;
      for (const skill of list) {
        const rank     = ranks[skill.key] || 0;
        const charVal  = chars[skill.characteristic.toLowerCase()] || 0;
        const isCareer = careerKeys.includes(skill.key);
        const isBonus  = bonusKeys.includes(skill.key);
        const nameCol  = (isCareer || isBonus) ? 'color:var(--accent)' : '';
        const zebra    = (zi++ % 2 === 1) ? ' zebra' : '';
        html += `
          <div class="sheet-skill-row${zebra}">
            <span class="sheet-skill-name" style="${nameCol}">${skill.name}</span>
            <span class="sheet-skill-char">${skill.characteristic.slice(0,3).toUpperCase()}</span>
            <div class="skill-dice">${dicePool(charVal, rank, setbackOut[skill.key])}</div>
          </div>`;
      }
    }

    return `
      <div class="sheet-panel" style="grid-column:1/-1">
        <div class="sheet-panel-title">Skills <span style="font-size:0.7em;font-weight:400;color:var(--muted)">(highlighted = career/spec skill)</span></div>
        <div class="skill-dice-legend">
          <span>${DIE_PROF} Proficiency (d12)</span>
          <span>${DIE_ABILITY} Ability (d8)</span>
          ${Object.keys(setbackOut).length ? `<span>${DIE_SETBACK_OUT} Setback removed by talent</span>` : ''}
          <span class="skill-dice-legend-note">pool = higher of characteristic or rank; ranks upgrade green to yellow</span>
        </div>
        <div class="sheet-skills-list">${html}</div>
      </div>`;
  }

  // Human-readable summary of a flat talent effect, e.g. "+4 Wound Threshold".
  const STAT_LABELS = {
    wound: 'Wound Threshold', strain: 'Strain Threshold', soak: 'Soak',
    defenseMelee: 'Melee Defense', defenseRanged: 'Ranged Defense',
    forceRating: 'Force Rating', characteristic: 'Characteristic',
  };
  function effectBadge(effect) {
    if (!effect) return '';
    const label = STAT_LABELS[effect.stat] || effect.stat;
    const suffix = effect.needsChoice ? ' (your choice)' : '';
    return `<span class="talent-effect">+${effect.total} ${label}${suffix}</span>`;
  }
  // Badge for whole-skill setback removal, e.g. "−1 setback: Deception, Skulduggery".
  function setbackBadge(setback) {
    if (!setback) return '';
    const skills = setback.skills.map(s => s === 'ALL_KNOWLEDGE' ? 'Knowledge' : s).join(', ');
    return `<span class="talent-effect setback">&minus;${setback.total} setback: ${esc(skills)}</span>`;
  }

  // Panel listing every purchased talent with its rank, type, effect, and rules text.
  function talentsBlock(d) {
    const list = (d && d.talents) || [];
    if (!list.length) return '';

    const cards = list.map(t => {
      const isActive = t.activation && !t.activation.toLowerCase().includes('passive');
      const typeTag  = `<span class="talent-type ${isActive ? 'active' : 'passive'}">${esc(t.activation || (isActive ? 'Active' : 'Passive'))}</span>`;
      const rankTag  = t.ranked ? `<span class="talent-rank">Rank ${t.rank}</span>` : '';
      const srcTag   = (t.source === 'species' || t.source === 'both')
        ? '<span class="talent-source">Species</span>' : '';
      const desc     = t.description
        ? `<div class="talent-desc">${esc(t.description)}</div>`
        : `<div class="talent-desc talent-desc-empty">No description on file.</div>`;
      return `
        <div class="talent-card">
          <div class="talent-card-head">
            <span class="talent-name">${esc(t.name)}</span>
            ${rankTag}${srcTag}${effectBadge(t.effect)}${setbackBadge(t.setback)}${typeTag}
          </div>
          ${desc}
        </div>`;
    }).join('');

    return `
      <div class="sheet-panel" style="grid-column:1/-1">
        <div class="sheet-panel-title">Talents <span style="font-size:0.7em;font-weight:400;color:var(--muted)">(${list.length} purchased)</span></div>
        <div class="talent-cards">${cards}</div>
      </div>`;
  }

  function treeBlock(spec, state) {
    // Map each tree position to whether it was purchased (row-major, 5×4).
    const bought = (state && state.talentPurchases && state.talentPurchases[state.specKey]) || [];
    let idx = 0;
    const rows = (spec.talent_tree || []).map(row => `
      <div class="tree-row">
        <div class="tree-cost">${row.cost}</div>
        ${(row.talents || []).map(t => {
          const owned = !!bought[idx++];
          return `<div class="tree-cell${t ? '' : ' empty'}${owned ? ' owned' : ''}">${esc(t) || '—'}${owned ? '<span class="tree-cell-check">&#10003;</span>' : ''}</div>`;
        }).join('')}
      </div>`).join('');

    return `
      <div class="sheet-panel" style="grid-column:1/-1">
        <div class="sheet-panel-title">Talent Tree — ${esc(spec.name)}</div>
        <div style="font-size:0.75rem;color:var(--muted);margin-bottom:10px">
          Bonus career skills: <strong style="color:var(--text)">${(spec.bonus_career_skills||[]).join(', ')}</strong></div>
        <div class="sheet-tree-display">${rows}</div>
        <p style="margin-top:10px;font-size:0.75rem;color:var(--muted)">Highlighted cells are purchased. Tier cost shown at left of each row.</p>
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

  function vehicleBlock(state) {
    const fleet = (state.vehicles || []).filter(e => e.key);
    if (!fleet.length) return '';

    const cr = n => typeof n === 'number' ? n.toLocaleString('en-US') : '—';
    const vwMap = (SW.vehicleWeapons || []).reduce((m, w) => { m[w.key] = w; return m; }, {});

    const cards = fleet.map(entry => {
      const v = Engine.getVehicle(entry.key);
      if (!v) return '';
      const displayName = entry.nickname && entry.nickname !== v.name ? entry.nickname : v.name;
      const arcVal = (val, lbl, cls) =>
        `<div class="sveh-arc-cell ${cls}"><div class="sveh-arc-val">${val ?? 0}</div><div class="sveh-arc-lbl">${lbl}</div></div>`;

      const wRows = (v.weapons || []).map(w => {
        const wd = vwMap[w.key] || { name: w.key, damage: '?', crit: '?', range: '?' };
        const quals = (w.qualities || []).map(q => {
          const qd = (SW.weaponQualities || {})[q.key];
          return (qd ? qd.name : q.key) + (q.count ? ' ' + q.count : '');
        }).join(', ');
        const count = w.count > 1 ? ` ×${w.count}` : '';
        const loc = [w.location, w.turret ? 'turret' : ''].filter(Boolean).join(', ');
        return `<div class="sveh-weapon-row">
          <span>${esc(wd.name)}${count}</span>
          <span class="sveh-meta">Dmg ${wd.damage ?? '?'} &middot; Crit ${wd.crit ?? '—'} &middot; ${esc(wd.range || '—')}${loc ? ' &middot; ' + esc(loc) : ''}${quals ? ' &middot; ' + esc(quals) : ''}</span>
        </div>`;
      }).join('');

      const hyper = v.hyperdrivePrimary
        ? `Class ${v.hyperdrivePrimary}${v.hyperdriveBackup ? '/Backup ' + v.hyperdriveBackup : ''}`
        : 'None';

      return `
        <div class="sveh-card">
          <div class="sveh-card-head">
            <div>
              <span class="sveh-card-name">${esc(displayName)}</span>
              ${displayName !== v.name ? `<span class="sveh-card-model">${esc(v.name)}</span>` : ''}
            </div>
            <span class="sveh-card-type">${esc(v.type || '')}</span>
            ${entry.purchased ? '' : '<span class="sheet-eq-free">(not purchased)</span>'}
          </div>
          <div class="sveh-primary-stats">
            <div class="sveh-stat"><span>Sil</span><strong>${v.silhouette ?? '—'}</strong></div>
            <div class="sveh-stat"><span>Spd</span><strong>${v.speed ?? '—'}</strong></div>
            <div class="sveh-stat"><span>Hdl</span><strong>${v.handling ?? '—'}</strong></div>
            <div class="sveh-stat"><span>Armor</span><strong>${v.armor ?? '—'}</strong></div>
            <div class="sveh-stat"><span>HT</span><strong>${v.hullTrauma ?? '—'}</strong></div>
            <div class="sveh-stat"><span>SS</span><strong>${v.systemStrain ?? '—'}</strong></div>
          </div>
          <div class="sveh-lower">
            <div class="sveh-arc">
              ${arcVal(v.defFore, 'Fore', 'arc-fore')}
              ${arcVal(v.defPort, 'Port', 'arc-port')}
              <div class="sveh-arc-ship">&#128640;</div>
              ${arcVal(v.defStarboard, 'Stbd', 'arc-stbd')}
              ${arcVal(v.defAft, 'Aft', 'arc-aft')}
            </div>
            <div class="sveh-details">
              ${v.hyperdrivePrimary ? `<div class="sveh-detail-row"><span>Hyperdrive</span><strong>${esc(hyper)}</strong></div>` : ''}
              ${v.navicomputer ? '<div class="sveh-detail-row"><span>NaviComp</span><strong>Yes</strong></div>' : ''}
              <div class="sveh-detail-row"><span>Sensors</span><strong>${esc(v.sensorRange || '—')}</strong></div>
              <div class="sveh-detail-row"><span>Crew</span><strong>${esc(v.crew || '—')}</strong></div>
              ${v.passengers ? `<div class="sveh-detail-row"><span>Passengers</span><strong>${v.passengers}</strong></div>` : ''}
              <div class="sveh-detail-row"><span>Cargo</span><strong>${v.encumbranceCapacity} enc.</strong></div>
              ${v.consumables ? `<div class="sveh-detail-row"><span>Consumables</span><strong>${esc(v.consumables)}</strong></div>` : ''}
              <div class="sveh-detail-row"><span>HP</span><strong>${v.hp ?? 0}</strong></div>
              <div class="sveh-detail-row"><span>Price</span><strong>${cr(v.price)} cr</strong></div>
            </div>
          </div>
          ${(v.baseMods || []).length ? `<div class="sveh-mods">${v.baseMods.map(m => `<p>${esc(m)}</p>`).join('')}</div>` : ''}
          ${wRows ? `<div class="sveh-weapons"><div class="sveh-weapons-title">Weapons</div>${wRows}</div>` : ''}
          ${entry.notes ? `<div class="sveh-notes">${esc(entry.notes)}</div>` : ''}
        </div>`;
    }).join('');

    return `
      <div class="sheet-panel" style="grid-column:1/-1">
        <div class="sheet-panel-title">Fleet</div>
        <div class="sveh-cards">${cards}</div>
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
