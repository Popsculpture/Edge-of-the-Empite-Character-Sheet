'use strict';

// Fills the official 3-page FFG character sheet (bundled AcroForm templates) with
// the character's data and downloads a single merged PDF. pdf-lib and the template
// data are loaded lazily on first use so they do not weigh down normal page loads.
const PdfExport = (() => {

  const GAME_NAMES = { eote: 'Edge of the Empire', aor: 'Age of Rebellion', fad: 'Force and Destiny' };

  function loadScript(src) {
    return new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = src; s.onload = resolve; s.onerror = () => reject(new Error('Failed to load ' + src));
      document.head.appendChild(s);
    });
  }
  async function ensureLibs() {
    if (typeof PDFLib === 'undefined') await loadScript('app/lib/pdf-lib.min.js');
    if (!(window.SW && SW.pdfTemplates)) await loadScript('data/pdf-templates.js');
  }
  function b64ToBytes(b64) {
    const bin = atob(b64), a = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) a[i] = bin.charCodeAt(i);
    return a;
  }

  // ── Field value maps per template (page) ──────────────────────────────────
  // Built from the character state + Engine.derive(). Only mapped fields are
  // filled; everything else is left blank on the official sheet.
  function page1Values(state, d, species, career, spec) {
    const c = (d && d.characteristics) || state.characteristics || {};
    const notes = [state.background, state.motivation].filter(Boolean).join('\n\n');
    return {
      'CharacterName': state.name || '',
      'Player': state.player || '',
      'Species': species ? species.name : '',
      'Campaign': GAME_NAMES[state.game] || '',
      'Career': career ? career.name : '',
      'Specialization': spec ? spec.name : '',
      'Brawn': c.brawn, 'Agility': c.agility, 'Intellect': c.intellect,
      'Cunning': c.cunning, 'Willpower': c.willpower, 'Presence': c.presence,
      'Force Rank': d.force_rating || 0,
      'Text2.0':       d.soak,                                  // Soak
      'Text2.1.0.0':   d.wound_threshold,  'Text2.1.1.0': state.woundCur || 0,   // Wounds thr / cur
      'Text2.1.0.1':   d.strain_threshold, 'Text2.1.1.1': state.strainCur || 0,  // Strain thr / cur
      'Text2.1.0.2':   d.defense_melee,    'Text2.1.1.2': d.defense_ranged,      // Defense M / R
      'Text2.1.0.3':   d.encumbrance_threshold, 'Text2.1.1.3': d.encumbrance,    // Encumbrance thr / cur
      'Text2.1.0.4':   0,                  'Text2.1.1.4': d.force_rating || 0,   // Force committed / available
      'Morality': (state.game === 'fad' && state.morality && state.morality.score != null) ? state.morality.score : '',
      'Character Notes': notes,
    };
  }

  function page2Values(state, d) {
    const gearNames = [];
    const bag = (state.equipment && state.equipment.gear) || {};
    for (const k of Object.keys(bag)) {
      const line = bag[k]; if (!line || !line.qty) continue;
      const g = Engine.getGear(k);
      if (g) gearNames.push(g.name + (line.qty > 1 ? ' x' + line.qty : ''));
    }
    return {
      'Credits4': d.credits_remaining,
      'EncThresh4': d.encumbrance_threshold,
      'EncCurr4': d.encumbrance,
      'Gear Notes': gearNames.join(', '),
    };
  }

  function page3Values(state, d) {
    const bag = (state.equipment && state.equipment.weapon) || {};
    const keys = Object.keys(bag).filter(k => bag[k] && bag[k].qty);
    const vals = {};
    keys.slice(0, 4).forEach((k, i) => {
      const w = Engine.getWeapon(k); if (!w) return;
      const line = bag[k];
      const nick = (line.nickname != null && line.nickname !== '') ? line.nickname : w.name;
      const dmg = (w.damageType === 'add' ? '+' : '') + (w.damage ?? '');
      const special = (w.qualities || []).map(q => q.name + (q.count ? ' ' + q.count : '')).join(', ');
      vals['name - weapon' + (i + 1)] = nick;
      vals['Weapon_Skill.' + i] = w.skill || '';
      vals['damage.' + i] = dmg;
      vals['critical.' + i] = w.crit ?? '';
      vals['Weapon_Range.' + i] = w.range || '';
      vals['encumber.' + i] = w.encumbrance ?? '';
      vals['hard points - weapon.' + i] = w.hp ?? '';
      vals['special.' + i] = special;
    });
    return vals;
  }

  function fillForm(form, values) {
    for (const [name, value] of Object.entries(values)) {
      if (value == null || value === '') continue;
      try { form.getTextField(name).setText(String(value)); } catch (e) { /* field absent on this template */ }
    }
  }

  function triggerDownload(bytes, filename) {
    const blob = new Blob([bytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = filename;
    document.body.appendChild(a); a.click();
    setTimeout(() => { URL.revokeObjectURL(url); a.remove(); }, 1000);
  }

  // Public: fill + merge + download. Returns the merged bytes (also for testing).
  async function exportSheet(state) {
    await ensureLibs();
    const { PDFDocument } = PDFLib;
    const d = Engine.derive(state) || {};
    const species = Engine.getSpecies(state.speciesKey);
    const career  = Engine.getCareer(state.careerKey);
    const spec    = Engine.getSpec(state.specKey);

    const pages = [
      { key: 'p1', values: page1Values(state, d, species, career, spec) },
      { key: 'p2', values: page2Values(state, d) },
      { key: 'p3', values: page3Values(state, d) },
    ];

    const out = await PDFDocument.create();
    for (const { key, values } of pages) {
      const tpl = await PDFDocument.load(b64ToBytes(SW.pdfTemplates[key]));
      const form = tpl.getForm();
      fillForm(form, values);
      try { form.flatten(); } catch (e) { /* keep going if a field resists flattening */ }
      const copied = await out.copyPages(tpl, tpl.getPageIndices());
      copied.forEach(p => out.addPage(p));
    }
    const bytes = await out.save();
    const fname = (state.name || 'character').replace(/[^\w]+/g, '_') + '_sheet.pdf';
    triggerDownload(bytes, fname);
    return bytes;
  }

  return { exportSheet };
})();
