'use strict';

// Play-mode owned-goods tabs: Gear (equipment management), Fleet (ship
// management), and Companions (droid and beast management). These render the
// MERGED inventory (creation purchases overlaid with play-mode commerce) and
// never sell anything themselves: every mutation goes through the api
// callbacks the wizard passes in, so state, saving, and re-rendering stay in
// one place. Purchasing lives on the Market tab.
const Play = (() => {

  function esc(s) {
    return String(s ?? '').replace(/[&<>"']/g, c =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }
  function fmtCr(n) {
    const neg = n < 0;
    const s = Math.abs(Math.round(n)).toLocaleString('en-US');
    return (neg ? '-' : '') + s;
  }
  function priceNum(item) { return typeof item.price === 'number' ? item.price : null; }
  function halfPrice(item) {
    const p = priceNum(item);
    return p === null ? 0 : Math.floor(p / 2);
  }
  function statChip(label, val) {
    return `<span class="eq-stat"><i>${label}</i>${val}</span>`;
  }
  function dmgDisplay(w) {
    if (w.damage === '' || w.damage === null || w.damage === undefined) return '—';
    return w.damageType === 'add' ? '+' + w.damage : '' + w.damage;
  }

  // Weapons and armor are always equippable; gear only when flagged (worn
  // carrying gear). Mirrors the wizard's creation-cart rule.
  function equippable(cat, item) {
    if (cat === 'weapon' || cat === 'armor') return true;
    return cat === 'gear' && !!(item && item.equippable);
  }

  function flagBoxes(cat, key, line, it) {
    const flag = (act, label, title, on) =>
      `<label class="cart-flag" title="${esc(title)}"><input type="checkbox" data-pg-act="${act}" data-cat="${cat}" data-key="${esc(key)}"${on ? ' checked' : ''}><span>${label}</span></label>`;
    return `
      ${equippable(cat, it)
        ? flag('equip', 'E', 'Equipped (wielded / worn)', !!line.equip)
        : '<span class="cart-flag cart-flag-na">&nbsp;</span>'}
      ${flag('carry', 'C', 'Carried (counts toward encumbrance)', line.carry !== false)}
      ${flag('show', 'S', 'Show on character sheet', line.show !== false)}`;
  }

  function itemStats(cat, it) {
    if (cat === 'weapon') {
      const quals = (it.qualities || []).map(q =>
        `<span class="qual-chip" data-tip-type="quality" data-tip-name="${esc(q.key)}">${esc(q.name)}${q.count ? ' ' + q.count : ''}</span>`).join('');
      return `
        ${statChip('Dmg', dmgDisplay(it))}
        ${statChip('Crit', it.crit ?? '—')}
        ${statChip('Range', it.range || '—')}
        ${statChip('Enc', it.encumbrance ?? '—')}
        <span class="eq-skill">${esc(it.skill || '')}</span>
        ${quals ? `<div class="eq-quals">${quals}</div>` : ''}`;
    }
    if (cat === 'armor') {
      return `
        ${statChip('Soak', '+' + (it.soak ?? 0))}
        ${statChip('Def', '+' + (it.defense ?? 0))}
        ${statChip('Enc', it.encumbrance ?? '—')}`;
    }
    return `
      ${statChip('Enc', it.encumbrance ?? '—')}
      ${it.type ? `<span class="eq-skill">${esc(it.type)}</span>` : ''}`;
  }

  function gearRow(cat, key, line, it) {
    const half = halfPrice(it);
    const sellLabel = priceNum(it) === null ? 'Sell' : `Sell +${fmtCr(half)}`;
    const nick = cat === 'weapon'
      ? `<input class="pg-nickname" data-pg-nick data-cat="weapon" data-key="${esc(key)}"
           value="${esc(line.nickname || '')}" placeholder="${esc(it.name)}" maxlength="60" spellcheck="false">`
      : `<span class="pg-name">${esc(it.name)}</span>`;
    return `
      <div class="pg-row">
        <div class="pg-row-main">
          <div class="pg-row-head">
            ${nick}
            ${cat === 'weapon' && line.nickname ? `<span class="pg-realname">${esc(it.name)}</span>` : ''}
            ${it.restricted ? '<span class="r-badge" title="Restricted - normally requires GM approval">R</span>' : ''}
            ${line.qty > 1 ? `<span class="eq-owned">&times;${line.qty}</span>` : ''}
            ${line.free ? '<span class="cart-free">FREE</span>' : ''}
            ${it.juryRig ? `<span class="pf-tag" title="${esc(it.juryRig)}">Jury Rigged</span>` : ''}
            ${it.crafted ? '<span class="pf-tag">Crafted</span>' : ''}
          </div>
          <div class="eq-stats">${itemStats(cat, it)}</div>
        </div>
        <div class="pg-row-ctl">
          <div class="cart-flags">${flagBoxes(cat, key, line, it)}</div>
          <button class="btn btn-secondary btn-sm pg-sell" data-pg-act="sell" data-cat="${cat}" data-key="${esc(key)}"
            title="Sell one at half the listed price">${sellLabel}<i>cr</i></button>
        </div>
      </div>`;
  }

  function twoWeaponSection(state, ownedWeapons) {
    const sets = (state.equipment && state.equipment.weaponSets) || [];
    const keys = Object.keys(ownedWeapons);
    const canPair = keys.length >= 2 || keys.some(k => ownedWeapons[k].qty >= 2);
    if (!canPair && !sets.length) return '';
    const setRows = sets.map((s, i) => {
      const a = Engine.getWeapon(s.a), b = Engine.getWeapon(s.b);
      return `<div class="tws-row"><span>${esc(a ? a.name : '?')} <i>+</i> ${esc(b ? b.name : '?')}</span>
        <button class="cart-x" data-pg-set="del" data-set-i="${i}" title="Remove set">&times;</button></div>`;
    }).join('');
    const opts = keys.map(k => `<option value="${esc(k)}">${esc(Engine.getWeapon(k)?.name || k)}</option>`).join('');
    return `
      <div class="cart-section">
        <div class="cart-section-title">Two-Weapon Sets</div>
        ${setRows || '<div class="tws-empty">Pair two weapons to dual-wield (pick the same weapon twice if you own 2+).</div>'}
        ${canPair ? `<div class="tws-add">
          <select id="pg-tws-a">${opts}</select><span class="tws-plus">+</span><select id="pg-tws-b">${opts}</select>
          <button class="btn btn-secondary btn-sm" data-pg-set="add">Pair</button>
        </div>` : ''}
      </div>`;
  }

  function renderGear(container, ctx) {
    const { state, d, api } = ctx;
    const owned = Engine.mergedEquipment(state);
    // Companions manage their own kind; the Gear tab is inanimate goods only.
    const gearBag = {};
    for (const k of Object.keys(owned.gear)) {
      const it = Engine.getGear(k);
      if (it && Engine.isCompanionItem('gear', it)) continue;
      gearBag[k] = owned.gear[k];
    }

    const section = (title, cat, bag) => {
      const keys = Object.keys(bag);
      if (!keys.length) return '';
      const rows = keys.map(k => {
        const it = Engine.getItem(cat, k);
        return it ? gearRow(cat, k, bag[k], it) : '';
      }).join('');
      return `<div class="cart-section pg-section"><div class="cart-section-title">${title}</div>${rows}</div>`;
    };

    const sections =
      section('Weapons', 'weapon', owned.weapon) +
      section('Armor', 'armor', owned.armor) +
      section('Gear', 'gear', gearBag);

    const encOver = d && d.encumbrance > d.encumbrance_threshold;
    const encExcess = encOver ? d.encumbrance - d.encumbrance_threshold : 0;
    const encBrawn = (d && d.characteristics && d.characteristics.brawn) || 0;

    container.innerHTML = `
      <div class="step-header"><h2>My Gear</h2>
        <p>Everything you own, ready for the table. Equip what you wield and wear, drop what
        you stash, and sell what you no longer need at half the listed price. New goods come
        from the <a href="#" data-pg-goto="market">Market</a>.</p></div>
      <div class="play-inv">
        ${sections || `<div class="cart-empty">You own no equipment yet. Visit the
          <a href="#" data-pg-goto="market">Market</a> to change that.</div>`}
        <div class="cart-totals">
          <div class="cart-total-row${encOver ? ' cart-warn' : ''}"><span>Encumbrance</span><strong>${d ? d.encumbrance : 0} / ${d ? d.encumbrance_threshold : 5}</strong></div>
        </div>
        ${encOver ? `<div class="cart-note cart-note-warn">Encumbered: +${encExcess} setback to all Brawn &amp; Agility checks${encExcess >= encBrawn && encBrawn > 0 ? '; you also lose your free maneuver each turn (maneuvers cost 2 strain).' : '.'}</div>` : ''}
        ${twoWeaponSection(state, owned.weapon)}
      </div>`;

    const root = container.querySelector('.play-inv');
    root.addEventListener('click', e => {
      const setEl = e.target.closest('[data-pg-set]');
      if (setEl) {
        if (setEl.dataset.pgSet === 'add') {
          const a = container.querySelector('#pg-tws-a');
          const b = container.querySelector('#pg-tws-b');
          if (a && b) api.pairSet(a.value, b.value);
        } else {
          api.deleteSet(+setEl.dataset.setI);
        }
        return;
      }
      const el = e.target.closest('[data-pg-act]');
      if (!el) return;
      const { pgAct, cat, key } = el.dataset;
      if (pgAct === 'sell') api.sell(cat, key);
      else api.toggleFlag(cat, key, pgAct);
    });
    root.addEventListener('input', e => {
      const el = e.target.closest('[data-pg-nick]');
      if (el) api.setNickname(el.dataset.cat, el.dataset.key, el.value);
    });
    container.querySelectorAll('[data-pg-goto]').forEach(a =>
      a.addEventListener('click', e => { e.preventDefault(); api.gotoMarket(); }));
  }

  function renderFleet(container, ctx) {
    const { state, d, api } = ctx;
    const fleet = Engine.mergedFleet(state).filter(e => e.key);
    const chars = (d && d.characteristics) || state.characteristics || {};
    const ranks = (d && d.skill_ranks) || {};

    const cards = fleet.map(entry => {
      const v = Engine.getVehicle(entry.key);
      if (!v) return '';
      const half = halfPrice(v);
      const isPlay = entry.source === 'play';
      const borrowed = !isPlay && !entry.purchased;
      const ref = isPlay ? `data-pf-id="${esc(entry.id)}"` : `data-pf-key="${esc(entry.key)}"`;
      const sourceTag = borrowed
        ? '<span class="pf-tag pf-tag-borrowed" title="Loaned, party-owned, or mission-assigned; it is not yours to sell">Borrowed</span>'
        : (isPlay ? '<span class="pf-tag">Bought in play</span>' : '<span class="pf-tag">Owned</span>');
      const action = borrowed
        ? `<button class="btn btn-secondary btn-sm" data-pf-act="release" ${ref}
             title="Hand the craft back; borrowed rides bring in nothing">Release</button>`
        : `<button class="btn btn-secondary btn-sm" data-pf-act="sell" ${ref}
             title="Sell at half the listed price">Sell +${fmtCr(half)}<i>cr</i></button>`;
      return `
        <div class="pf-card">
          <div class="pf-card-bar">
            <input class="pg-nickname" data-pf-nick ${ref} value="${esc(entry.nickname || '')}"
              placeholder="${esc(v.name)}" maxlength="60" spellcheck="false">
            ${sourceTag}
            ${action}
          </div>
          ${Sheet.vehicleCardHtml(entry, v, chars, ranks)}
          <textarea class="veh-notes" placeholder="Ship name, backstory, modifications..." rows="2"
            data-pf-notes ${ref}>${esc(entry.notes || '')}</textarea>
        </div>`;
    }).join('');

    container.innerHTML = `
      <div class="step-header"><h2>My Fleet</h2>
        <p>The ships and vehicles at your disposal. Name them, log their history, and sell
        what you own at half the listed price; borrowed craft go back to whoever lent them.
        New hulls come from the <a href="#" data-pg-goto="market">Market</a>.</p></div>
      <div class="play-inv play-fleet">
        ${cards || `<div class="cart-empty">No ships or vehicles yet. Visit the
          <a href="#" data-pg-goto="market">Market</a> to buy your first hull.</div>`}
      </div>`;

    const root = container.querySelector('.play-fleet');
    root.addEventListener('click', e => {
      const el = e.target.closest('[data-pf-act]');
      if (!el) return;
      const target = { id: el.dataset.pfId || null, key: el.dataset.pfKey || null };
      if (el.dataset.pfAct === 'sell') api.sellVehicle(target);
      else api.releaseVehicle(target);
    });
    root.addEventListener('input', e => {
      const nick = e.target.closest('[data-pf-nick]');
      if (nick) { api.setVehicleField({ id: nick.dataset.pfId || null, key: nick.dataset.pfKey || null }, 'nickname', nick.value); return; }
      const notes = e.target.closest('[data-pf-notes]');
      if (notes) api.setVehicleField({ id: notes.dataset.pfId || null, key: notes.dataset.pfKey || null }, 'notes', notes.value);
    });
    container.querySelectorAll('[data-pg-goto]').forEach(a =>
      a.addEventListener('click', e => { e.preventDefault(); api.gotoMarket(); }));
  }

  const TYPE_SINGULAR = { 'Droids': 'Droid', 'Riding Beasts': 'Riding Beast', 'Trainable Beasts': 'Trainable Beast' };

  function renderCompanions(container, ctx) {
    const { state, api } = ctx;
    const companions = state.companions || [];

    const cards = companions.map(rec => {
      const it = Engine.getGear(rec.itemKey);
      if (!it) return '';
      const half = halfPrice(it);
      const sellLabel = priceNum(it) === null ? 'Sell' : `Sell +${fmtCr(half)}`;
      const desc = (it.description || '').trim();
      return `
        <div class="comp-card" data-comp-id="${esc(rec.id)}">
          <div class="pf-card-bar">
            <span class="pf-tag">${esc(TYPE_SINGULAR[it.type] || it.type || '')}</span>
            <input class="pg-nickname" data-comp-field="nickname" value="${esc(rec.nickname || '')}"
              placeholder="${esc(it.name)}" maxlength="60" spellcheck="false">
            ${it.restricted ? '<span class="r-badge" title="Restricted - normally requires GM approval">R</span>' : ''}
            <button class="btn btn-secondary btn-sm" data-comp-act="sell"
              title="Sell at half the listed price">${sellLabel}<i>cr</i></button>
          </div>
          <div class="comp-model">${esc(it.name)} &middot; ${fmtCr(priceNum(it) || 0)} cr</div>
          ${desc
            ? `<details class="comp-desc"><summary>Details &amp; stats</summary><div class="comp-desc-body">${esc(desc)}</div></details>`
            : '<div class="comp-desc-none">No description on file.</div>'}
          <textarea class="veh-notes" data-comp-field="notes" rows="2"
            placeholder="Name, quirks, training, standing orders...">${esc(rec.notes || '')}</textarea>
        </div>`;
    }).join('');

    container.innerHTML = `
      <div class="step-header"><h2>Companions</h2>
        <p>The droids and beasts that travel with you. Name them, keep their story, and part
        with them at half the listed price when the time comes. New companions come from the
        <a href="#" data-pg-goto="market">Market</a>.</p></div>
      <div class="play-inv play-comp">
        ${cards || `<div class="cart-empty">No companions yet. The
          <a href="#" data-pg-goto="market">Market</a> sells droids, riding beasts, and
          trainable beasts alike.</div>`}
      </div>`;

    const root = container.querySelector('.play-comp');
    root.addEventListener('click', e => {
      const el = e.target.closest('[data-comp-act]');
      if (!el) return;
      api.sellCompanion(el.closest('[data-comp-id]').dataset.compId);
    });
    root.addEventListener('input', e => {
      const el = e.target.closest('[data-comp-field]');
      if (!el) return;
      api.setCompanionField(el.closest('[data-comp-id]').dataset.compId, el.dataset.compField, el.value);
    });
    container.querySelectorAll('[data-pg-goto]').forEach(a =>
      a.addEventListener('click', e => { e.preventDefault(); api.gotoMarket(); }));
  }

  return { renderGear, renderFleet, renderCompanions };
})();
