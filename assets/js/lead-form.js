/**
 * Lead Form — 2 pasos + confirmación.
 *
 * Flujo:
 *   Paso 1: nombre, teléfono, fecha, personas (+ tipo de plan si no hay propiedad)
 *   Paso 2: chips de preferencias + notas
 *   Confirmación: referencia + CTA WhatsApp
 *   Error: fallback WhatsApp
 *
 * Abre con [data-lf-open] o [data-lw-open] (compatibilidad con wizard anterior).
 * Contexto: data-lf-property-id, data-lf-property-name, data-lf-source, data-lf-type
 *           data-lw-property-id, data-lw-property-name (legacy)
 * WhatsApp: window.HSFA.config.whatsappNumber + whatsappEnabled
 */
(function () {
  'use strict';

  var CONSENT_V = 'preview-1';
  var ikey = null;
  var lastTrigger = null;

  var state = {
    fullName: '', phoneRaw: '',
    adults: 2, children: 0,
    checkIn: '', flexibleDates: false,
    planType: '',
    habeasAccepted: false,
    preferences: [], notes: '',
    selectedPropertyId: '', selectedPropertyName: '',
    source: '', sourceType: '',
    leadId: null,
  };

  /* ─── Helpers ──────────────────────────────────────────────── */
  function genKey() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0;
      return (c === 'x' ? r : (r & 3 | 8)).toString(16);
    });
  }

  function normalizePhone(raw) {
    if (!raw) return null;
    var d = raw.replace(/\D/g, '');
    if (d.startsWith('57') && d.length === 12) return '+' + d;
    if (d.length === 10 && d.startsWith('3'))  return '+57' + d;
    if (d.length >= 7) return '+' + d;
    return null;
  }

  function esc(s) {
    return String(s || '').replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  /* ─── DOM refs (lazy) ───────────────────────────────────────── */
  function modal()   { return document.getElementById('leadModal'); }
  function screen(id) { return document.getElementById('lf-screen-' + id); }
  function el(id)    { return document.getElementById(id); }

  /* ─── Screens ───────────────────────────────────────────────── */
  function showScreen(id) {
    document.querySelectorAll('.lf-screen').forEach(function (s) {
      s.setAttribute('hidden', '');
    });
    var s = screen(id);
    if (!s) return;
    s.removeAttribute('hidden');
    requestAnimationFrame(function () {
      var first = s.querySelector('button:not([disabled]), input:not([type="text"][tabindex="-1"]), textarea');
      if (first) first.focus();
    });
  }

  /* ─── Open / close ──────────────────────────────────────────── */
  function openForm(opts) {
    opts = opts || {};
    lastTrigger = opts.trigger || null;

    state.selectedPropertyId   = opts.propertyId   || '';
    state.selectedPropertyName = opts.propertyName || '';
    state.source               = opts.source       || window.location.pathname;
    state.sourceType           = opts.sourceType   || 'cta';
    state.planType             = opts.planType     || '';
    state.preferences          = [];
    state.notes                = '';
    state.leadId               = null;
    ikey                       = genKey();

    // Context badge
    var badge = el('lf-context-badge');
    if (badge) {
      if (state.selectedPropertyName) {
        badge.textContent = 'Consultando: ' + state.selectedPropertyName;
        badge.removeAttribute('hidden');
      } else {
        badge.setAttribute('hidden', '');
      }
    }

    // Title
    var titleEl = el('lf-title');
    if (titleEl) {
      titleEl.textContent = state.selectedPropertyName
        ? 'Consultar disponibilidad'
        : 'Encuentra tu plan ideal';
    }

    // Plan type chips — hide when property already known
    var planWrap = el('lf-plantype-wrap');
    if (planWrap) {
      planWrap.toggleAttribute('hidden', !!(state.selectedPropertyId || state.selectedPropertyName));
    }

    // If opening from a specific plan-type CTA, pre-select it
    if (state.planType) {
      document.querySelectorAll('.lf-plan-chip').forEach(function (btn) {
        var active = btn.dataset.val === state.planType;
        btn.classList.toggle('lf-selected', active);
        btn.setAttribute('aria-pressed', String(active));
      });
    }

    // Reset pref chips
    document.querySelectorAll('.lf-pref-chip').forEach(function (btn) {
      btn.classList.remove('lf-selected');
      btn.setAttribute('aria-pressed', 'false');
    });

    // Reset counter display
    var av = el('lf-adults-val');
    var cv = el('lf-children-val');
    state.adults   = 2;
    state.children = 0;
    if (av) av.textContent = '2';
    if (cv) cv.textContent = '0';
    updateCtrBtns('adults',   2, 1, 20);
    updateCtrBtns('children', 0, 0, 15);

    // Clear inputs
    var nombreEl = el('lf-nombre');
    var telEl    = el('lf-tel');
    var fechaEl  = el('lf-fecha');
    var flexEl   = el('lf-flexible');
    var habeasEl = el('lf-habeas');
    var notasEl  = el('lf-notas');
    if (nombreEl) nombreEl.value = '';
    if (telEl)    telEl.value    = '';
    if (fechaEl)  fechaEl.value  = '';
    if (flexEl)   { flexEl.checked = false; toggleDateWrap(false); }
    if (habeasEl) habeasEl.checked = false;
    if (notasEl)  notasEl.value  = '';

    clearErrors();
    showScreen('1');

    var m = modal();
    if (!m) return;
    m.showModal();
    document.body.style.overflow = 'hidden';

    window.HSFA && window.HSFA.track && window.HSFA.track('lead_form_start', {
      property: state.selectedPropertyId,
    });
  }

  function closeForm() {
    var m = modal();
    if (m && m.open) m.close();
    document.body.style.overflow = '';
    if (lastTrigger) { try { lastTrigger.focus(); } catch (_) {} }
    lastTrigger = null;
  }

  /* ─── Date wrap toggle ───────────────────────────────────────── */
  function toggleDateWrap(flexible) {
    var wrap = el('lf-date-wrap');
    if (wrap) wrap.style.display = flexible ? 'none' : '';
  }

  /* ─── Counter ────────────────────────────────────────────────── */
  function updateCtrBtns(type, val, min, max) {
    document.querySelectorAll('[data-counter="' + type + '"]').forEach(function (btn) {
      if (btn.dataset.action === 'minus') btn.disabled = val <= min;
      if (btn.dataset.action === 'plus')  btn.disabled = val >= max;
    });
  }

  /* ─── Validation ─────────────────────────────────────────────── */
  function clearErrors() {
    document.querySelectorAll('.lf-ferr, .lf-err-zone').forEach(function (e) {
      e.setAttribute('hidden', '');
      e.textContent = '';
    });
    document.querySelectorAll('[aria-invalid]').forEach(function (e) {
      e.removeAttribute('aria-invalid');
    });
  }

  function showFieldErr(errId, inputId, msg) {
    var errEl = el(errId);
    if (errEl) { errEl.textContent = msg; errEl.removeAttribute('hidden'); }
    var inputEl = el(inputId);
    if (inputEl) { inputEl.setAttribute('aria-invalid', 'true'); inputEl.focus(); }
  }

  function showZoneErr(zoneId, msg) {
    var z = el(zoneId);
    if (z) { z.textContent = msg; z.removeAttribute('hidden'); }
  }

  function validateStep1() {
    clearErrors();
    var ok = true;

    var name  = (el('lf-nombre') ? el('lf-nombre').value : '').trim();
    var tel   = (el('lf-tel')    ? el('lf-tel').value    : '').trim();
    var habeas = el('lf-habeas') ? el('lf-habeas').checked : false;

    if (!name) {
      showFieldErr('lf-err-nombre', 'lf-nombre', 'Ingresa tu nombre completo');
      ok = false;
    } else if (name.length > 100) {
      showFieldErr('lf-err-nombre', 'lf-nombre', 'Máximo 100 caracteres');
      ok = false;
    }

    if (!tel) {
      if (ok) showFieldErr('lf-err-tel', 'lf-tel', 'Ingresa tu WhatsApp o teléfono');
      ok = false;
    } else if (!normalizePhone(tel)) {
      if (ok) showFieldErr('lf-err-tel', 'lf-tel', 'Número inválido. Usa formato: 300 123 4567');
      ok = false;
    }

    if (!habeas) {
      if (ok) showZoneErr('lf-err-zone', 'Debes aceptar el tratamiento de datos personales');
      ok = false;
    }

    if (ok) {
      state.fullName      = name;
      state.phoneRaw      = tel;
      state.habeasAccepted = true;
      var fechaEl = el('lf-fecha');
      var flexEl  = el('lf-flexible');
      state.checkIn      = fechaEl ? fechaEl.value : '';
      state.flexibleDates = flexEl ? flexEl.checked : false;
      state.adults   = parseInt((el('lf-adults-val')   || {}).textContent || '2', 10);
      state.children = parseInt((el('lf-children-val') || {}).textContent || '0', 10);
    }
    return ok;
  }

  /* ─── Payload ────────────────────────────────────────────────── */
  function buildPayload(contactRoute) {
    var phone = normalizePhone(state.phoneRaw);
    var attr  = (window.HSFA && window.HSFA.getAttribution) ? window.HSFA.getAttribution() : {};
    return {
      schemaVersion: '1.0',
      idempotencyKey: ikey,
      sourceSite:  window.location.origin,
      pageUrl:     window.location.href,
      landingPage: window.location.pathname,
      referrer:    document.referrer || '',
      attribution: attr,
      request: {
        planType:            state.planType             || undefined,
        checkIn:             (!state.flexibleDates && state.checkIn) ? state.checkIn : undefined,
        flexibleDates:       state.flexibleDates,
        adults:              state.adults,
        children:            state.children,
        preferences:         state.preferences,
        notes:               state.notes                || undefined,
        selectedPropertyId:  state.selectedPropertyId  || undefined,
        selectedPropertyName: state.selectedPropertyName || undefined,
        contactRoute:        contactRoute               || 'form',
      },
      contact: {
        fullName:  state.fullName,
        phoneE164: phone,
      },
      consent: {
        accepted:  true,
        version:   CONSENT_V,
        timestamp: new Date().toISOString(),
      },
      _honeypot: (el('lf-hp') || {}).value || '',
    };
  }

  async function postLead(contactRoute) {
    var res = await fetch('/api/leads', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(buildPayload(contactRoute)),
    });
    var data = await res.json().catch(function () { return {}; });
    if (!res.ok || !data.ok) throw new Error(data.error || 'Error al enviar');
    return data;
  }

  /* ─── WhatsApp ───────────────────────────────────────────────── */
  function waConfig() {
    return (window.HSFA && window.HSFA.config) ? window.HSFA.config : {};
  }

  function openWA() {
    var cfg = waConfig();
    if (!cfg.whatsappEnabled || !cfg.whatsappNumber) return;
    var number = cfg.whatsappNumber.replace(/\D/g, '');
    var lines  = ['Hola, quiero consultar opciones de alojamiento en Santa Fe de Antioquia.'];
    if (state.selectedPropertyName) lines.push('Me interesa: ' + state.selectedPropertyName + '.');
    if (state.planType && state.planType !== 'no-se') lines.push('Tipo de plan: ' + state.planType + '.');
    if (state.adults) {
      var travelers = state.adults + ' adulto' + (state.adults !== 1 ? 's' : '');
      if (state.children) travelers += ' y ' + state.children + ' niño' + (state.children !== 1 ? 's' : '');
      lines.push('Viajamos ' + travelers + '.');
    }
    if (!state.flexibleDates && state.checkIn) lines.push('Fecha: ' + state.checkIn + '.');
    else if (state.flexibleDates) lines.push('Fechas flexibles.');
    if (state.leadId) lines.push('Referencia de solicitud: ' + state.leadId + '.');
    window.open('https://wa.me/' + number + '?text=' + encodeURIComponent(lines.join(' ')), '_blank', 'noopener');
  }

  /* ─── Confirm screen helpers ─────────────────────────────────── */
  function showConfirm(viaWA) {
    showScreen('confirm');
    var cfg    = waConfig();
    var waAvail = cfg.whatsappEnabled && cfg.whatsappNumber;

    var bodyEl  = el('lf-confirm-body');
    if (bodyEl) {
      if (viaWA) {
        bodyEl.textContent = 'Tu solicitud fue enviada. Un asesor te responderá por WhatsApp.';
      } else if (state.selectedPropertyName) {
        bodyEl.textContent = 'Un asesor revisará la disponibilidad de ' + state.selectedPropertyName + ' y te contactará para confirmar precios y condiciones.';
      } else {
        bodyEl.textContent = 'Un asesor revisará las opciones disponibles y te contactará para confirmar precios y disponibilidad.';
      }
    }

    var refRow  = el('lf-ref-row');
    var refCode = el('lf-ref-code');
    if (refRow && state.leadId && refCode) {
      refCode.textContent = state.leadId;
      refRow.removeAttribute('hidden');
    }

    var waBtn = el('lf-btn-wa-confirm');
    if (waBtn) {
      if (waAvail) waBtn.removeAttribute('hidden');
      else waBtn.setAttribute('hidden', '');
    }
  }

  /* ─── Spinners ───────────────────────────────────────────────── */
  function setLoading(btnId, loading, label) {
    var btn = el(btnId);
    if (!btn) return;
    btn.disabled  = loading;
    btn.textContent = loading ? 'Enviando...' : label;
  }

  /* ─── Init ───────────────────────────────────────────────────── */
  function init() {
    var m = modal();
    if (!m) return;

    /* Close on Escape (native dialog `cancel` event) */
    m.addEventListener('cancel', function (e) {
      e.preventDefault();
      closeForm();
    });

    /* Click outside dialog area (backdrop click) */
    m.addEventListener('click', function (e) {
      if (e.target === m) closeForm();
    });

    /* Close buttons */
    m.addEventListener('click', function (e) {
      if (e.target.closest('[data-lf-close]')) closeForm();
    });

    /* Flexible dates toggle */
    var flexEl = el('lf-flexible');
    if (flexEl) {
      flexEl.addEventListener('change', function () {
        state.flexibleDates = this.checked;
        toggleDateWrap(this.checked);
      });
    }

    /* Counter buttons */
    m.addEventListener('click', function (e) {
      var btn = e.target.closest('.lf-ctr-btn');
      if (!btn) return;
      var type   = btn.dataset.counter;
      var action = btn.dataset.action;
      var key    = type === 'adults' ? 'adults' : 'children';
      var min    = type === 'adults' ? 1 : 0;
      var max    = type === 'adults' ? 20 : 15;
      state[key] = Math.max(min, Math.min(max, state[key] + (action === 'plus' ? 1 : -1)));
      var valEl  = el('lf-' + key.replace('children', 'children') + '-val');
      if (type === 'adults')   valEl = el('lf-adults-val');
      if (type === 'children') valEl = el('lf-children-val');
      if (valEl) valEl.textContent = state[key];
      updateCtrBtns(type, state[key], min, max);
    });

    /* Plan type chips (step 1) */
    m.addEventListener('click', function (e) {
      var btn = e.target.closest('.lf-plan-chip');
      if (!btn) return;
      m.querySelectorAll('.lf-plan-chip').forEach(function (b) {
        b.classList.remove('lf-selected');
        b.setAttribute('aria-pressed', 'false');
      });
      btn.classList.add('lf-selected');
      btn.setAttribute('aria-pressed', 'true');
      state.planType = btn.dataset.val;
    });

    /* Pref chips (step 2) */
    m.addEventListener('click', function (e) {
      var btn = e.target.closest('.lf-pref-chip');
      if (!btn) return;
      var val = btn.dataset.val;
      var idx = state.preferences.indexOf(val);
      if (idx === -1) {
        state.preferences.push(val);
        btn.classList.add('lf-selected');
        btn.setAttribute('aria-pressed', 'true');
      } else {
        state.preferences.splice(idx, 1);
        btn.classList.remove('lf-selected');
        btn.setAttribute('aria-pressed', 'false');
      }
    });

    /* Notes */
    var notasEl = el('lf-notas');
    if (notasEl) {
      notasEl.addEventListener('input', function () {
        state.notes = this.value.slice(0, 500);
      });
    }

    /* Step 1 → Step 2 */
    var btnNext = el('lf-btn-next');
    if (btnNext) {
      btnNext.addEventListener('click', function () {
        if (!validateStep1()) return;
        showScreen('2');
        window.HSFA && window.HSFA.track && window.HSFA.track('lead_step1_complete', {
          property: state.selectedPropertyId,
        });
      });
    }

    /* WhatsApp from Step 1 */
    var btnWA1 = el('lf-btn-wa1');
    if (btnWA1) {
      btnWA1.addEventListener('click', async function () {
        if (!validateStep1()) return;
        setLoading('lf-btn-wa1', true, 'Continuar por WhatsApp');
        try {
          var data = await postLead('whatsapp');
          state.leadId = data.leadId;
        } catch (_) {
          /* Silent — still open WA even if POST fails */
        }
        openWA();
        showConfirm(true);
        setLoading('lf-btn-wa1', false, 'Continuar por WhatsApp');
        window.HSFA && window.HSFA.track && window.HSFA.track('lead_wa_from_step1', {});
      });
    }

    /* Back (step 2 → step 1) */
    var btnBack = el('lf-btn-back');
    if (btnBack) {
      btnBack.addEventListener('click', function () { showScreen('1'); });
    }

    /* Submit (step 2) */
    var btnSubmit = el('lf-btn-submit');
    if (btnSubmit) {
      btnSubmit.addEventListener('click', async function () {
        state.notes = (el('lf-notas') ? el('lf-notas').value : '').trim().slice(0, 500);
        setLoading('lf-btn-submit', true, 'Solicitar opciones y precios');
        clearErrors();
        try {
          var data = await postLead('form');
          state.leadId = data.leadId;
          showConfirm(false);
          window.HSFA && window.HSFA.track && window.HSFA.track('lead_success', {
            planType: state.planType,
          });
        } catch (err) {
          showScreen('error');
          window.HSFA && window.HSFA.track && window.HSFA.track('lead_error', {});
        } finally {
          setLoading('lf-btn-submit', false, 'Solicitar opciones y precios');
        }
      });
    }

    /* WA buttons on confirm/error screens */
    var btnWAConfirm = el('lf-btn-wa-confirm');
    if (btnWAConfirm) btnWAConfirm.addEventListener('click', openWA);

    var btnWAError = el('lf-btn-wa-error');
    if (btnWAError)   btnWAError.addEventListener('click', openWA);

    /* Retry */
    var btnRetry = el('lf-btn-retry');
    if (btnRetry) btnRetry.addEventListener('click', function () { showScreen('1'); });

    /* Done */
    var btnDone = el('lf-btn-done');
    if (btnDone) btnDone.addEventListener('click', closeForm);
  }

  /* ─── Global API ─────────────────────────────────────────────── */
  window.HSFA = window.HSFA || {};
  window.HSFA.openLeadForm  = openForm;
  window.HSFA.closeLeadForm = closeForm;
  /* Keep legacy alias so any inline JS still works */
  window.HSFA.openWizard  = openForm;
  window.HSFA.closeWizard = closeForm;

  /* ─── Global click delegation (data-lf-open + data-lw-open) ──── */
  document.addEventListener('click', function (e) {
    var trigger = e.target.closest('[data-lf-open], [data-lw-open]');
    if (!trigger) return;
    e.preventDefault();
    lastTrigger = trigger;
    openForm({
      trigger:      trigger,
      propertyId:   trigger.dataset.lfPropertyId   || trigger.dataset.lwPropertyId   || '',
      propertyName: trigger.dataset.lfPropertyName || trigger.dataset.lwPropertyName || '',
      source:       trigger.dataset.lfSource        || window.location.pathname,
      sourceType:   trigger.dataset.lfType          || 'cta',
      planType:     trigger.dataset.lfPlan          || '',
    });
  });

  /* ─── Boot ───────────────────────────────────────────────────── */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
