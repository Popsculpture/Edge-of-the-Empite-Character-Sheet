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
    const vBlock  = vehicleBlock(state, derived);

    container.innerHTML = `
      <div class="sheet-root">
        ${headerBlock(state, species, career, spec)}
        ${charsBlock(chars, derived)}
        ${derivedBlock(derived, state)}
        ${skillsBlock(derived, chars)}
        ${talentsBlock(derived, species)}
        ${backgroundBlock(state)}
        ${weaponBlock(state, derived)}
        ${equipmentBlock(state, derived)}
        ${vBlock}
        ${spec ? treeBlock(spec, state, derived) : ''}
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

  function charsBlock(chars, derived) {
    const cb = (derived && derived.characteristic_bonuses) || {};
    const cbsrc = (derived && derived.characteristic_bonus_src) || {};
    const rows = Engine.CHAR_STATS.map(stat => {
      const bonus = cb[stat] || 0;
      const valHtml = bonus
        ? `<span class="enh" data-enhance>${chars[stat] ?? '—'}</span>`
        : `${chars[stat] ?? '—'}`;
      const note = bonus ? `<div class="enhance-note">+${bonus} from ${cbsrc[stat] || 'talents'}</div>` : '';
      return `
      <div class="strip-cell">
        <div class="strip-cell-abbr">${Engine.CHAR_ABBR[stat]}</div>
        <div class="strip-cell-char">${valHtml}</div>
        <div class="strip-cell-name">${stat.charAt(0).toUpperCase() + stat.slice(1)}</div>
        ${note}
      </div>`;
    }).join('');

    return `
      <div class="sheet-panel char-strip" style="grid-column:1/-1;display:grid;grid-template-columns:auto repeat(6,1fr);padding:0;overflow:hidden">
        <div class="derived-strip-label"><span>Characteristics</span></div>
        ${rows}
      </div>`;
  }

  // Derived Stats rendered as a horizontal strip mirroring the Characteristics
  // panel: a vertical label column + one cell per stat. Order: Soak, Wounds,
  // Strain, Defenses, and Force Pool (only when the character has a Force rating).
  function derivedBlock(d, state) {
    const tb = d.talent_stat_bonuses || {};
    // Hidden "+N from talents" note, revealed when the enhanced value is tapped.
    const note = n => (n ? `<div class="enhance-note">+${n} from talents</div>` : '');
    // Mark a value (HTML) as talent-enhanced: green + tappable to toggle the note.
    const enh = (html, n) => n ? `<span class="enh" data-enhance>${html}</span>` : html;

    const cell = (label, body, extra) => `
      <div class="derived-cell">
        <div class="derived-cell-label">${label}</div>
        ${body}
        ${extra || ''}
      </div>`;
    const bigVal = v => `<div class="derived-cell-val">${v}</div>`;
    const sub    = t => `<div class="derived-cell-sub">${t}</div>`;

    // Wounds / Strain trackers; the max (threshold) is the talent-enhanced part.
    const tracker = (cur, max, color, key, bonus) => {
      const c = Math.max(0, Math.min(max, cur));
      const remain = max > 0 ? Math.max(0, Math.min(100, (max - c) / max * 100)) : 100;
      const barColor = (c >= max && max > 0) ? '#d6493a' : color;
      return `
        <div class="derived-cell-val">${c} <span class="track-max">/ ${enh(max, bonus)}</span></div>
        <div class="track-bar"><div class="track-fill" style="width:${remain}%;background:${barColor}"></div></div>
        <div class="track-row">
          <button class="track-btn" data-track="${key}" data-d="-1" aria-label="${key} down">&minus;</button>
          <button class="track-btn" data-track="${key}" data-d="1" aria-label="${key} up">+</button>
        </div>`;
    };

    const soakParts = [`Brawn ${d.soak_brawn}`, `Armor ${d.armor_soak || 0}`];
    if (tb.soak) soakParts.push(`Enduring ${tb.soak}`);
    if (d.cyber_soak) soakParts.push(`Implant ${d.cyber_soak}`);
    const soakEnh = (tb.soak || 0) + (d.cyber_soak || 0);

    // Defense sources: armor (both), Superior Reflexes (melee), Sixth Sense (ranged),
    // and wielded-weapon Defensive (melee) / Deflection (ranged).
    const defParts = [];
    if (d.armor_defense)         defParts.push(`Armor ${d.armor_defense}`);
    if (tb.defenseMelee)         defParts.push(`Superior Reflexes ${tb.defenseMelee} (M)`);
    if (tb.defenseRanged)        defParts.push(`Sixth Sense ${tb.defenseRanged} (R)`);
    if (d.defense_weapon_melee)  defParts.push(`Defensive ${d.defense_weapon_melee} (M)`);
    if (d.defense_weapon_ranged) defParts.push(`Deflection ${d.defense_weapon_ranged} (R)`);
    const defBonus = (tb.defenseMelee || 0) + (tb.defenseRanged || 0)
                   + (d.defense_weapon_melee || 0) + (d.defense_weapon_ranged || 0);

    const cells = [
      cell('Soak',   bigVal(enh(d.soak, soakEnh)), sub(soakParts.join(' + '))),
      cell('Wounds', tracker((state && state.woundCur) || 0, d.wound_threshold, '#d6493a', 'woundCur', tb.wound), note(tb.wound)),
      cell('Strain', tracker((state && state.strainCur) || 0, d.strain_threshold, '#e0a93a', 'strainCur', tb.strain), note(tb.strain)),
      cell('Defense', bigVal(enh(`${d.defense_melee} / ${d.defense_ranged}`, defBonus)), sub('melee / ranged') + (defParts.length ? sub(defParts.join(' + ')) : '')),
    ];
    if (d.force_rating > 0) cells.push(cell('Force Pool', bigVal(enh(d.force_rating, tb.forceRating)), note(tb.forceRating)));

    // Column count is exposed as --cells so the phone breakpoint can reflow the
    // strip (the base grid lives in .derived-strip in the stylesheet).
    return `
      <div class="sheet-panel derived-strip" style="grid-column:1/-1;--cells:${cells.length}">
        <div class="derived-strip-label"><span>Derived Stats</span></div>
        ${cells.join('')}
      </div>`;
  }

  // Species abilities are folded into the Talents panel (see talentsBlock); this
  // panel now only carries the character's written background, when present.
  function backgroundBlock(state) {
    if (!state.background) return '';
    return `
      <div class="sheet-panel">
        <div class="sheet-panel-title">Background</div>
        <div class="sheet-abilities" style="font-size:0.85rem;color:var(--muted)">${esc(state.background)}</div>
      </div>`;
  }

  // Parse a species special-ability string into {name, desc}. "Sense the Force:
  // ..." -> name "Sense the Force"; otherwise a generic label.
  function speciesAbilityCards(species) {
    const list = (species && species.special_abilities) || [];
    return list.map(raw => {
      const a = raw.replace(/^\s*Special Abilities:\s*/i, '');   // drop the generic prefix
      const colon = a.indexOf(':');
      let name = (species ? species.name + ' Ability' : 'Species Ability'), desc = a;
      if (colon > 0 && colon < 40) { name = a.slice(0, colon).trim(); desc = a.slice(colon + 1).trim(); }
      return `
        <div class="talent-card talent-card-species">
          <div class="talent-name">${esc(name)}</div>
          <div class="talent-chips"><span class="talent-source">Species</span><span class="talent-type passive">Innate</span></div>
          <div class="talent-desc">${esc(desc)}</div>
        </div>`;
    }).join('');
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
        const c = Math.max(0, charVal), r = Math.max(0, rank);
        const prof = Math.min(c, r), abil = Math.max(c, r) - prof;   // dice pool for the roller
        html += `
          <div class="sheet-skill-row${zebra}">
            <span class="sheet-skill-name" style="${nameCol}">${skill.name}<span class="sheet-skill-char">${skill.characteristic.slice(0,3).toUpperCase()}</span></span>
            <div class="skill-dice">${dicePool(charVal, rank, setbackOut[skill.key])}</div>
            <button class="skill-roll" data-dice-ability="${abil}" data-dice-prof="${prof}" data-dice-label="${esc(skill.name)} check" title="Send ${abil} ability + ${prof} proficiency to the dice pool">&#127922;</button>
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

  // Panel listing species abilities + every purchased talent (rank, type, effect, text).
  function talentsBlock(d, species) {
    const list = (d && d.talents) || [];
    const speciesCards = speciesAbilityCards(species);
    if (!list.length && !speciesCards) return '';

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
          <div class="talent-name">${esc(t.name)}</div>
          <div class="talent-chips">${rankTag}${srcTag}${effectBadge(t.effect)}${setbackBadge(t.setback)}${typeTag}</div>
          ${desc}
        </div>`;
    }).join('');

    return `
      <div class="sheet-panel" style="grid-column:1/-1">
        <div class="sheet-panel-title">Talents &amp; Abilities ${list.length ? `<span style="font-size:0.7em;font-weight:400;color:var(--muted)">(${list.length} talent${list.length === 1 ? '' : 's'})</span>` : ''}</div>
        <div class="talent-cards">${speciesCards}${cards}</div>
      </div>`;
  }

  function treeBlock(spec, state, derived) {
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

    const d = derived || {};
    const xpItem = (label, val, cls) =>
      `<span class="tree-xp-item"><span class="tree-xp-label">${label}</span><strong class="${cls || ''}">${val}</strong></span>`;
    const xpHeader = derived
      ? `<span class="tree-xp">
          ${xpItem('Starting XP', d.starting_xp)}
          ${xpItem('Spent', d.xp_spent)}
          ${xpItem('Remaining', d.xp_remaining, d.xp_remaining < 0 ? 'xp-neg' : '')}
        </span>` : '';

    return `
      <div class="sheet-panel" style="grid-column:1/-1">
        <div class="sheet-panel-title tree-title-row"><span>Talent Tree — ${esc(spec.name)}</span>${xpHeader}</div>
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

    // Weapons (and two-weapon sets) render as their own cards panel (weaponBlock);
    // the inventory list here covers armor and gear.
    if (!aRows && !gRows) return '';

    const sub = (title, rows) => rows
      ? `<div class="sheet-eq-group"><div class="sheet-eq-group-title">${title}</div>${rows}</div>` : '';

    const remain = derived ? derived.credits_remaining : 0;
    return `
      <div class="sheet-panel" style="grid-column:1/-1">
        <div class="sheet-panel-title">Equipment
          <span style="font-size:0.7em;font-weight:400;color:var(--muted)">(${cr(remain)} cr unspent)</span></div>
        <div class="sheet-eq-cols">
          ${sub('Armor', aRows)}
          ${sub('Gear', gRows)}
        </div>
      </div>`;
  }

  // Weapon cards (the old "weapon window"): read-only stats pulled from the gear
  // tab, an editable nickname, and an attack button that builds the dice pool from
  // the weapon's combat skill (characteristic + rank).
  function weaponBlock(state, derived) {
    const eq = state.equipment || {};
    const bag = eq.weapon || {};
    const chars = (derived && derived.characteristics) || state.characteristics || {};
    const ranks = (derived && derived.skill_ranks) || {};
    const dmg = w => (w.damage === '' || w.damage == null) ? '—' : (w.damageType === 'add' ? '+' + w.damage : '' + w.damage);

    const keys = Object.keys(bag).filter(k => bag[k] && bag[k].qty && bag[k].show !== false);
    const cards = keys.map(k => {
      const w = Engine.getWeapon(k);
      if (!w) return '';
      const line = bag[k];
      const nick = (line.nickname != null && line.nickname !== '') ? line.nickname : w.name;
      // Resolve the weapon's skill -> characteristic + rank -> ability/proficiency dice.
      let sk = Engine.getSkill(w.skillKey);
      if (!sk && w.skill) sk = (SW.skills || []).find(s => s.name === w.skill);
      const charVal = sk ? (chars[sk.characteristic.toLowerCase()] || 0) : 0;
      const rk = sk ? (ranks[sk.key] || 0) : 0;
      const prof = Math.min(charVal, rk), abil = Math.max(charVal, rk) - prof;
      const quals = (w.qualities || []).map(q => esc(q.name) + (q.count ? ' ' + q.count : '')).join(', ') || '—';
      const renamed = nick !== w.name ? `<span class="wpn-realname">${esc(w.name)}</span>` : '';
      return `
        <div class="wpn-card">
          <div class="wpn-head">
            <input class="wpn-name" data-wpn-key="${k}" value="${esc(nick)}" placeholder="${esc(w.name)}" title="Rename this weapon" spellcheck="false">
            <button class="wpn-attack" data-dice-ability="${abil}" data-dice-prof="${prof}" data-dice-label="Attack: ${esc(w.name)}" title="Send ${abil} ability + ${prof} proficiency (${esc(sk ? sk.name : w.skill || '?')}) to the dice pool">&#127922; attack</button>
          </div>
          ${renamed}
          <div class="wpn-grid">
            <div class="wpn-field"><label>Skill</label><div class="wpn-val">${esc(w.skill || '—')}</div></div>
            <div class="wpn-field"><label>Damage</label><div class="wpn-val">${dmg(w)}</div></div>
            <div class="wpn-field"><label>Crit</label><div class="wpn-val">${w.crit ?? '—'}</div></div>
            <div class="wpn-field"><label>Range</label><div class="wpn-val">${esc(w.range || '—')}</div></div>
          </div>
          <div class="wpn-grid wpn-grid2">
            <div class="wpn-field"><label>Encum</label><div class="wpn-val">${w.encumbrance ?? '—'}</div></div>
            <div class="wpn-field"><label>Special Qualities</label><div class="wpn-val">${quals}</div></div>
          </div>
        </div>`;
    }).join('');

    // ── Two-Weapon (dual-wield) sets: the combined-attack rules (EotE Core p.210) ──
    const wInfo = w => {
      let sk = Engine.getSkill(w.skillKey);
      if (!sk && w.skill) sk = (SW.skills || []).find(s => s.name === w.skill);
      return { sk, charVal: sk ? (chars[sk.characteristic.toLowerCase()] || 0) : 0, rk: sk ? (ranks[sk.key] || 0) : 0 };
    };
    const qualsOf = w => (w.qualities || []).map(q => esc(q.name) + (q.count ? ' ' + q.count : '')).join(', ') || '—';
    const validSet = s => s.a === s.b
      ? (bag[s.a] && bag[s.a].qty >= 2)
      : (bag[s.a] && bag[s.a].qty && bag[s.b] && bag[s.b].qty);

    const dualCards = (eq.weaponSets || []).filter(validSet).map(s => {
      const wa = Engine.getWeapon(s.a), wb = Engine.getWeapon(s.b);
      if (!wa || !wb) return '';
      const ia = wInfo(wa), ib = wInfo(wb);
      // Pool: lower skill rank + lower characteristic of the two weapons.
      const lowRank = Math.min(ia.rk, ib.rk), lowChar = Math.min(ia.charVal, ib.charVal);
      const prof = Math.min(lowChar, lowRank), abil = Math.max(lowChar, lowRank) - prof;
      const sameSkill = ia.sk && ib.sk && ia.sk.key === ib.sk.key;
      const penalty = sameSkill ? 1 : 2;   // +1 difficulty if same skill, +2 if different
      const usedSkill = (ia.rk <= ib.rk ? ia.sk : ib.sk) || ia.sk || ib.sk;
      const wMeta = w => `${esc(w.skill || '—')} &middot; Dmg ${dmg(w)} &middot; Crit ${w.crit ?? '—'} &middot; ${esc(w.range || '—')}${qualsOf(w) !== '—' ? ' &middot; ' + qualsOf(w) : ''}`;
      return `
        <div class="wpn-card wpn-card-dual">
          <div class="wpn-head">
            <span class="wpn-name-static dual-toggle" data-dual-toggle title="Tap to show / hide the two-weapon rules">&#9876; ${esc(wa.name)} + ${esc(wb.name)} <span class="dual-chevron">&#9662;</span></span>
            <button class="wpn-attack" data-dice-ability="${abil}" data-dice-prof="${prof}" data-dice-difficulty="${penalty}" data-dice-label="Two-Weapon: ${esc(wa.name)} + ${esc(wb.name)}" title="Combined check: ${abil} ability + ${prof} proficiency + ${penalty} difficulty">&#127922; combined</button>
          </div>
          <div class="dual-rules">
            <p>Single combined check using your <b>lower</b> skill &amp; characteristic (<b>${esc(usedSkill ? usedSkill.name : '?')}</b>), at <b>+${penalty} difficulty</b> (${sameSkill ? 'same skill' : 'different skills'}). Set the target's range difficulty as usual.</p>
            <p>On a hit you strike with <b>${esc(wa.name)}</b>. Spend <span class="dual-cost">2 advantage</span> or a <span class="dual-cost">triumph</span> to also hit with <b>${esc(wb.name)}</b>. Each hit deals base damage <b>+1 per success</b>.</p>
          </div>
          <div class="dual-weapons">
            <div class="dual-w"><div class="dual-w-label">Primary</div><div class="dual-w-name">${esc(wa.name)}</div><div class="dual-w-meta">${wMeta(wa)}</div></div>
            <div class="dual-w"><div class="dual-w-label">Secondary</div><div class="dual-w-name">${esc(wb.name)}</div><div class="dual-w-meta">${wMeta(wb)}</div></div>
          </div>
        </div>`;
    }).join('');

    if (!cards && !dualCards) return '';
    return `
      <div class="sheet-panel" style="grid-column:1/-1">
        <div class="sheet-panel-title">Weapons</div>
        ${cards ? `<div class="wpn-cards">${cards}</div>` : ''}
        ${dualCards ? `<div class="wpn-dual-section"><div class="wpn-dual-title">Two-Weapon Sets</div><div class="wpn-cards">${dualCards}</div></div>` : ''}
      </div>`;
  }

  function vehicleBlock(state, derived) {
    const fleet = (state.vehicles || []).filter(e => e.key);
    if (!fleet.length) return '';

    const cr = n => typeof n === 'number' ? n.toLocaleString('en-US') : '—';
    const vwMap = (SW.vehicleWeapons || []).reduce((m, w) => { m[w.key] = w; return m; }, {});
    const chars = (derived && derived.characteristics) || state.characteristics || {};
    const ranks = (derived && derived.skill_ranks) || {};
    const ARC_LABELS = { fore: 'Fore', aft: 'Aft', port: 'Port', starboard: 'Starboard', dorsal: 'Dorsal', ventral: 'Ventral' };

    const cards = fleet.map(entry => {
      const v = Engine.getVehicle(entry.key);
      if (!v) return '';
      const displayName = entry.nickname && entry.nickname !== v.name ? entry.nickname : v.name;
      const arcVal = (val, lbl, cls) =>
        `<div class="sveh-arc-cell ${cls}"><div class="sveh-arc-val">${val ?? 0}</div><div class="sveh-arc-lbl">${lbl}</div></div>`;

      // Vehicle weapons render as full cards (read-only) with a Gunnery attack button.
      const wRows = (v.weapons || []).map(w => {
        const wd = vwMap[w.key] || { name: w.key, damage: '?', crit: '?', range: '?', skill: 'GUNN' };
        const allQ = [...(wd.qualities || []), ...(w.qualities || [])];
        const quals = allQ.map(q => {
          const qd = (SW.weaponQualities || {})[q.key];
          return esc(qd ? qd.name : q.key) + (q.count ? ' ' + q.count : '');
        }).join(', ') || '—';
        const count = w.count > 1 ? ` &times;${w.count}` : '';
        const arcs = w.turret
          ? 'All arcs (turret)'
          : (Object.keys(w.firingArcs || {}).filter(a => w.firingArcs[a]).map(a => ARC_LABELS[a] || a).join(', ') || '—');
        const loc = [w.location, w.turret ? 'turret' : ''].filter(Boolean).join(', ');
        const sk = Engine.getSkill(wd.skill) || Engine.getSkill('GUNN');
        const cv = sk ? (chars[sk.characteristic.toLowerCase()] || 0) : 0;
        const rk = sk ? (ranks[sk.key] || 0) : 0;
        const prof = Math.min(cv, rk), abil = Math.max(cv, rk) - prof;
        return `
          <div class="wpn-card wpn-card-veh">
            <div class="wpn-head">
              <span class="wpn-name-static">${esc(wd.name)}${count}</span>
              <button class="wpn-attack" data-dice-ability="${abil}" data-dice-prof="${prof}" data-dice-label="${esc(wd.name)} (${esc(v.name)})" title="Send ${abil} ability + ${prof} proficiency (${esc(sk ? sk.name : 'Gunnery')}) to the dice pool">&#127922; attack</button>
            </div>
            <div class="wpn-grid">
              <div class="wpn-field"><label>Skill</label><div class="wpn-val">${esc(sk ? sk.name : 'Gunnery')}</div></div>
              <div class="wpn-field"><label>Damage</label><div class="wpn-val">${wd.damage ?? '—'}</div></div>
              <div class="wpn-field"><label>Crit</label><div class="wpn-val">${wd.crit ?? '—'}</div></div>
              <div class="wpn-field"><label>Range</label><div class="wpn-val">${esc(wd.range || '—')}</div></div>
            </div>
            <div class="wpn-grid wpn-grid-veh2">
              <div class="wpn-field"><label>Firing Arc</label><div class="wpn-val">${esc(arcs)}</div></div>
              <div class="wpn-field"><label>Mount</label><div class="wpn-val">${esc(loc || '—')}</div></div>
              <div class="wpn-field"><label>Qualities</label><div class="wpn-val">${quals}</div></div>
            </div>
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
          ${wRows ? `<div class="sveh-weapons"><div class="sveh-weapons-title">Weapons</div><div class="wpn-cards">${wRows}</div></div>` : ''}
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
    const mech = Engine.activeMechanic(state);
    const parts = [];
    if (mech === 'obligation' && state.obligation.type) {
      parts.push(`Obligation: <strong>${esc(state.obligation.type)} (${state.obligation.magnitude})</strong>`);
    } else if (mech === 'duty' && state.duty.type) {
      const def = state.duty.deficit || 0;
      parts.push(`Duty: <strong>${esc(state.duty.type)}${def ? ` (deficit: ${def})` : ''}</strong>`);
    } else if (mech === 'morality') {
      if (state.morality.strength) parts.push(`Strength: <strong>${esc(state.morality.strength)}</strong>`);
      if (state.morality.weakness) parts.push(`Weakness: <strong>${esc(state.morality.weakness)}</strong>`);
      parts.push(`Morality: <strong>${state.morality.score}</strong>`);
    }
    // A Force and Destiny character on a non-Morality mechanic still tracks Morality.
    if (state.game === 'fad' && mech !== 'morality' && (state.morality.strength || state.morality.weakness)) {
      parts.push(`Morality: <strong>${state.morality.score}</strong> (${esc(state.morality.strength || '?')} / ${esc(state.morality.weakness || '?')})`);
    }
    return parts.join('<br>');
  }

  function esc(s) {
    return (s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  return { render };
})();
