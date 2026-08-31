/**
 * Lead Wizard — 7 pasos de captación de leads.
 *
 * Flujo:
 * 1. Tipo de plan
 * 2. Fechas
 * 3. Viajeros + presupuesto
 * 4. Ocasión
 * 5. Preferencias + notas
 * 6. Resultado preliminar
 * 7. Datos de contacto + envío
 *
 * El estado de pasos 1-6 se guarda en sessionStorage (sin PII).
 * Nombre, teléfono y correo NUNCA se guardan en almacenamiento del navegador.
 * El estado se limpia al finalizar con éxito.
 */
(function () {
  'use strict';

  var MODAL_ID  = 'leadWizardModal';
  var FORM_KEY  = 'hsfa_wiz_v1';
  var CONSENT_V = 'preview-1';

  /* ─── Estado del wizard ────────────────────────────────────── */
  var state = {
    step: 1,
    totalSteps: 7,
    // Paso 1
    planType: '',
    // Paso 2
    checkIn: '', checkOut: '', flexibleDates: false,
    // Paso 3
    adults: 2, children: 0, childrenAges: [], budgetRange: '',
    // Paso 4
    occasion: '',
    // Paso 5
    preferences: [], notes: '',
    // Paso 7 (PII — nunca a sessionStorage)
    fullName: '', phoneRaw: '', email: '', contactPreference: 'undecided',
    // Contexto
    selectedPropertyId: '', selectedPropertyName: '',
    // Resultado
    leadId: null,
  };

  /* ─── Helpers ────────────────────────────────────────────── */
  function saveProgress() {
    try {
      sessionStorage.setItem(FORM_KEY, JSON.stringify({
        step: state.step,
        planType: state.planType,
        checkIn: state.checkIn, checkOut: state.checkOut, flexibleDates: state.flexibleDates,
        adults: state.adults, children: state.children, budgetRange: state.budgetRange,
        occasion: state.occasion, preferences: state.preferences,
        selectedPropertyId: state.selectedPropertyId,
        selectedPropertyName: state.selectedPropertyName,
      }));
    } catch (_) {}
  }

  function loadProgress() {
    try {
      var raw = sessionStorage.getItem(FORM_KEY);
      if (!raw) return;
      var saved = JSON.parse(raw);
      Object.assign(state, saved);
    } catch (_) {}
  }

  function clearProgress() {
    try { sessionStorage.removeItem(FORM_KEY); } catch (_) {}
  }

  function normalizePhone(raw) {
    if (!raw) return null;
    var digits = raw.replace(/\D/g, '');
    if (digits.startsWith('57') && digits.length === 12) return '+' + digits;
    if (digits.length === 10 && digits.startsWith('3')) return '+57' + digits;
    if (digits.length >= 7) return '+' + digits;
    return null;
  }

  /* ─── Modal DOM ──────────────────────────────────────────── */
  var modal, overlay, stepsContainer, progressDots, progressBar;

  function getModal() {
    return document.getElementById(MODAL_ID);
  }

  /* ─── Abrir / cerrar ─────────────────────────────────────── */
  function openWizard(opts) {
    opts = opts || {};
    state.selectedPropertyId   = opts.propertyId   || '';
    state.selectedPropertyName = opts.propertyName || '';

    // Restaurar progreso si existe (sin PII)
    loadProgress();

    modal = getModal();
    if (!modal) { console.warn('[LeadWizard] Modal no encontrado'); return; }

    modal.removeAttribute('hidden');
    requestAnimationFrame(function () { modal.classList.add('lw-open'); });
    document.body.style.overflow = 'hidden';
    focusTrap(modal, true);

    // Mostrar nombre de propiedad en el header si viene de una tarjeta
    var propCtx = document.getElementById('lwPropertyContext');
    if (propCtx) {
      if (state.selectedPropertyName) {
        propCtx.textContent = 'Consultando: ' + state.selectedPropertyName;
        propCtx.removeAttribute('hidden');
      } else {
        propCtx.setAttribute('hidden', '');
      }
    }

    renderStep(state.step);
    window.HSFA && window.HSFA.track('lead_form_start', {
      property: state.selectedPropertyId,
      planType: state.planType,
    });
  }

  function closeWizard() {
    modal = getModal();
    if (!modal) return;
    modal.classList.remove('lw-open');
    document.body.style.overflow = '';
    focusTrap(modal, false);
    setTimeout(function () { modal.setAttribute('hidden', ''); }, 320);
  }

  /* ─── Focus trap ─────────────────────────────────────────── */
  function focusTrap(el, enable) {
    if (enable) {
      var first = el.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
      if (first) first.focus();
    }
  }

  /* ─── Renderizado de pasos ───────────────────────────────── */
  function renderStep(n) {
    state.step = n;
    saveProgress();

    var container = document.getElementById('lwStepsContainer');
    if (!container) return;

    container.querySelectorAll('.lw-step').forEach(function (s) {
      s.classList.remove('lw-active');
      s.setAttribute('aria-hidden', 'true');
    });

    var stepEl = container.querySelector('[data-lwstep="' + n + '"]');
    if (stepEl) {
      stepEl.classList.add('lw-active');
      stepEl.removeAttribute('aria-hidden');
    }

    updateProgress(n);
    updateNavButtons(n);

    if (n === 6) renderPreliminary();
    if (n === 7) prefillContact();
  }

  function updateProgress(n) {
    var fill = document.getElementById('lwProgressFill');
    if (fill) fill.style.width = Math.round((n / state.totalSteps) * 100) + '%';

    document.querySelectorAll('.lw-dot').forEach(function (d) {
      var dn = +d.dataset.dot;
      d.classList.toggle('lw-dot--active', dn === n);
      d.classList.toggle('lw-dot--done',   dn < n);
    });

    var label = document.getElementById('lwStepLabel');
    if (label) label.textContent = 'Paso ' + n + ' de ' + state.totalSteps;
  }

  function updateNavButtons(n) {
    var foot = document.getElementById('lwFooter');
    if (!foot) return;

    foot.style.display = n >= 7 ? 'none' : '';

    var back   = document.getElementById('lwBtnBack');
    var next   = document.getElementById('lwBtnNext');
    var submit = document.getElementById('lwBtnSubmit');

    if (back)   back.style.display   = n > 1 ? '' : 'none';
    if (next)   next.style.display   = n < 7 ? '' : 'none';
    if (submit) submit.style.display = n === 7 ? '' : 'none';
  }

  /* ─── Resultado preliminar (paso 6) ─────────────────────── */
  function renderPreliminary() {
    var el = document.getElementById('lwPrelimResult');
    if (!el) return;

    var lines = [];
    if (state.planType)   lines.push('<strong>Plan:</strong> ' + escHtml(planLabel(state.planType)));
    if (state.adults)     lines.push('<strong>Viajeros:</strong> ' + state.adults + ' adulto' + (state.adults !== 1 ? 's' : '') + (state.children ? ', ' + state.children + ' niño' + (state.children !== 1 ? 's' : '') : ''));
    if (state.occasion)   lines.push('<strong>Ocasión:</strong> ' + escHtml(state.occasion));
    if (state.budgetRange) lines.push('<strong>Presupuesto:</strong> ' + escHtml(state.budgetRange));
    if (state.preferences.length) lines.push('<strong>Preferencias:</strong> ' + state.preferences.map(escHtml).join(', '));

    el.innerHTML = lines.join('<br>');
  }

  function planLabel(v) {
    var labels = { 'alojamiento': 'Alojamiento', 'dia-de-sol': 'Día de sol', 'todo-incluido': 'Todo incluido', 'celebracion': 'Celebración', 'evento': 'Evento' };
    return labels[v] || v;
  }

  function prefillContact() {
    var nameEl = document.getElementById('lwNombre');
    var telEl  = document.getElementById('lwTelefono');
    if (nameEl && state.fullName) nameEl.value = state.fullName;
    if (telEl  && state.phoneRaw) telEl.value  = state.phoneRaw;
  }

  /* ─── Validación por paso ────────────────────────────────── */
  function validateStep(n) {
    if (n === 1 && !state.planType) {
      return showFieldError('Selecciona el tipo de plan que buscas');
    }
    if (n === 3 && state.adults < 1) {
      return showFieldError('Debe haber al menos 1 adulto');
    }
    return true;
  }

  function validateContact() {
    var name  = (document.getElementById('lwNombre')?.value || '').trim();
    var tel   = (document.getElementById('lwTelefono')?.value || '').trim();
    var habeas = document.getElementById('lwHabeas')?.checked;

    if (!name)    return showFieldError('Ingresa tu nombre completo', 'lwNombre');
    if (name.length > 100) return showFieldError('El nombre no puede superar 100 caracteres', 'lwNombre');
    if (!tel)     return showFieldError('Ingresa tu número de WhatsApp o teléfono', 'lwTelefono');
    if (!normalizePhone(tel)) return showFieldError('Número inválido. Usa formato colombiano: 300 123 4567', 'lwTelefono');
    if (!habeas)  return showFieldError('Debes aceptar la política de tratamiento de datos');

    state.fullName = name;
    state.phoneRaw = tel;
    state.email    = (document.getElementById('lwCorreo')?.value || '').trim();
    state.contactPreference = document.querySelector('input[name="lwContactPref"]:checked')?.value || 'undecided';
    return true;
  }

  function showFieldError(msg, fieldId) {
    var zone = document.getElementById('lwErrorZone');
    if (zone) {
      zone.textContent = msg;
      zone.removeAttribute('hidden');
    }
    if (fieldId) {
      var el = document.getElementById(fieldId);
      if (el) { el.focus(); el.setAttribute('aria-invalid', 'true'); }
    }
    return false;
  }

  function clearError() {
    var zone = document.getElementById('lwErrorZone');
    if (zone) { zone.textContent = ''; zone.setAttribute('hidden', ''); }
    document.querySelectorAll('[aria-invalid="true"]').forEach(function (el) {
      el.removeAttribute('aria-invalid');
    });
  }

  /* ─── Envío del lead ─────────────────────────────────────── */
  function buildPayload() {
    var phone = normalizePhone(state.phoneRaw);
    var attr  = (window.HSFA && window.HSFA.getAttribution) ? window.HSFA.getAttribution() : {};
    return {
      schemaVersion: '1.0',
      sourceSite: window.location.origin,
      pageUrl: window.location.href,
      landingPage: window.location.pathname,
      referrer: document.referrer || '',
      attribution: attr,
      request: {
        planType:              state.planType,
        checkIn:               state.checkIn || undefined,
        checkOut:              state.checkOut || undefined,
        flexibleDates:         state.flexibleDates,
        adults:                state.adults,
        children:              state.children,
        childrenAges:          state.childrenAges.length ? state.childrenAges : undefined,
        budgetRange:           state.budgetRange || undefined,
        occasion:              state.occasion || undefined,
        preferences:           state.preferences,
        selectedPropertyId:    state.selectedPropertyId || undefined,
        selectedPropertyName:  state.selectedPropertyName || undefined,
        notes:                 state.notes || undefined,
      },
      contact: {
        fullName:              state.fullName,
        phoneE164:             phone,
        email:                 state.email || undefined,
        initialContactPreference: state.contactPreference,
      },
      consent: {
        accepted:   true,
        version:    CONSENT_V,
        timestamp:  new Date().toISOString(),
      },
      technical: {
        locale:    navigator.language || '',
        userAgent: navigator.userAgent || '',
      },
      _hp: document.getElementById('lwHoneypot')?.value || '',
    };
  }

  async function submitLead() {
    clearError();
    if (!validateContact()) return;

    var btn = document.getElementById('lwBtnSubmit');
    if (btn) { btn.disabled = true; btn.textContent = 'Enviando...'; }

    window.HSFA && window.HSFA.track('lead_submit', { planType: state.planType, occasion: state.occasion });

    var payload = buildPayload();

    try {
      var res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      var data = await res.json().catch(function () { return {}; });

      if (!res.ok || !data.ok) {
        throw new Error(data.error || 'Error al enviar la solicitud');
      }

      state.leadId = data.leadId;
      clearProgress();

      window.HSFA && window.HSFA.track('lead_success', { planType: state.planType });

      showSuccess(data.leadId);

    } catch (err) {
      if (btn) { btn.disabled = false; btn.textContent = 'Enviar solicitud'; }
      showFieldError(err.message || 'No pudimos enviar tu solicitud. Por favor, intenta de nuevo.');
      window.HSFA && window.HSFA.track('lead_error', { planType: state.planType });
    }
  }

  /* ─── Pantalla de éxito ──────────────────────────────────── */
  function showSuccess(leadId) {
    var container = document.getElementById('lwStepsContainer');
    var success   = document.getElementById('lwSuccess');
    var footer    = document.getElementById('lwFooter');

    if (container) container.style.display = 'none';
    if (footer)    footer.style.display = 'none';
    if (success) {
      success.removeAttribute('hidden');
      var refEl = success.querySelector('.lw-success-ref');
      if (refEl) refEl.textContent = leadId || '';
    }
  }

  /* ─── Actualizar preferencia de contacto ─────────────────── */
  async function updatePreference(preference) {
    if (!state.leadId) return;
    window.HSFA && window.HSFA.track('contact_preference_selected', { preference: preference });
    try {
      await fetch('/api/leads/contact-preference', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ leadId: state.leadId, preference: preference }),
      });
    } catch (_) {}
  }

  /* ─── Botón de WhatsApp post-éxito ──────────────────────── */
  function openWhatsApp() {
    updatePreference('whatsapp');
    window.HSFA && window.HSFA.track('whatsapp_after_lead', {});
    var number  = document.getElementById('lwSuccess')?.dataset?.waNumber || '';
    var enabled = document.getElementById('lwSuccess')?.dataset?.waEnabled === 'true';
    if (!enabled || !number) return;
    var msg = 'Hola. Acabo de enviar una solicitud en el sitio. Mi referencia es ' + (state.leadId || '') + ' y quiero continuar por WhatsApp.';
    window.open('https://wa.me/' + number.replace(/\D/g, '') + '?text=' + encodeURIComponent(msg), '_blank', 'noopener');
  }

  /* ─── Inicialización ─────────────────────────────────────── */
  function init() {
    var modal = getModal();
    if (!modal) return;

    // Cerrar con Escape
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && modal.classList.contains('lw-open')) closeWizard();
    });

    // Overlay click
    modal.querySelector('.lw-overlay')?.addEventListener('click', closeWizard);

    // Botones de cierre
    modal.querySelectorAll('[data-lw-close]').forEach(function (el) {
      el.addEventListener('click', closeWizard);
    });

    // Navegación
    document.getElementById('lwBtnBack')?.addEventListener('click', function () {
      clearError();
      renderStep(Math.max(state.step - 1, 1));
    });

    document.getElementById('lwBtnNext')?.addEventListener('click', function () {
      clearError();
      if (!validateStep(state.step)) return;
      var next = Math.min(state.step + 1, state.totalSteps);
      renderStep(next);
      window.HSFA && window.HSFA.track('lead_step_complete', { step: state.step, planType: state.planType });
    });

    document.getElementById('lwBtnSubmit')?.addEventListener('click', submitLead);

    // Selección de tipo de plan (paso 1)
    modal.querySelectorAll('.lw-plan-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        modal.querySelectorAll('.lw-plan-btn').forEach(function (b) { b.classList.remove('lw-selected'); b.setAttribute('aria-pressed', 'false'); });
        btn.classList.add('lw-selected');
        btn.setAttribute('aria-pressed', 'true');
        state.planType = btn.dataset.val;
      });
    });

    // Fechas flexibles (paso 2)
    document.getElementById('lwFechasFlexibles')?.addEventListener('change', function () {
      state.flexibleDates = this.checked;
      var dateFields = document.getElementById('lwDateFields');
      if (dateFields) dateFields.style.display = this.checked ? 'none' : '';
    });

    // Counter adultos / niños (paso 3)
    modal.querySelectorAll('.lw-counter-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var type   = btn.dataset.counter;
        var action = btn.dataset.action;
        var key    = type === 'adults' ? 'adults' : 'children';
        var min    = type === 'adults' ? 1 : 0;
        var max    = type === 'adults' ? 20 : 15;
        state[key] = Math.max(min, Math.min(max, state[key] + (action === 'plus' ? 1 : -1)));
        var valEl = document.getElementById('lw' + (type === 'adults' ? 'Adults' : 'Children') + 'Val');
        if (valEl) valEl.textContent = state[key];
        updateCounterButtons(btn.closest('.lw-counter-row'), state[key], min, max);
      });
    });

    // Selección de ocasión (paso 4)
    modal.querySelectorAll('.lw-occasion-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        modal.querySelectorAll('.lw-occasion-btn').forEach(function (b) { b.classList.remove('lw-selected'); b.setAttribute('aria-pressed', 'false'); });
        btn.classList.add('lw-selected');
        btn.setAttribute('aria-pressed', 'true');
        state.occasion = btn.dataset.val;
      });
    });

    // Preferencias múltiples (paso 5)
    modal.querySelectorAll('.lw-pref-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var val = btn.dataset.val;
        var idx = state.preferences.indexOf(val);
        if (idx === -1) { state.preferences.push(val); btn.classList.add('lw-selected'); btn.setAttribute('aria-pressed', 'true'); }
        else { state.preferences.splice(idx, 1); btn.classList.remove('lw-selected'); btn.setAttribute('aria-pressed', 'false'); }
      });
    });

    // Notas (paso 5)
    document.getElementById('lwNotas')?.addEventListener('input', function () {
      state.notes = this.value.slice(0, 500);
    });

    // Post-éxito: esperar asesor
    document.getElementById('lwBtnWaitAgent')?.addEventListener('click', function () {
      updatePreference('wait_for_agent');
      window.HSFA && window.HSFA.track('wait_for_agent_selected', {});
    });

    // Post-éxito: WhatsApp
    document.getElementById('lwBtnWhatsapp')?.addEventListener('click', openWhatsApp);

    // Presupuesto (paso 3)
    document.getElementById('lwPresupuesto')?.addEventListener('change', function () {
      state.budgetRange = this.value;
    });
  }

  function updateCounterButtons(row, val, min, max) {
    if (!row) return;
    row.querySelector('[data-action="minus"]').disabled = val <= min;
    row.querySelector('[data-action="plus"]').disabled  = val >= max;
  }

  function escHtml(s) {
    return String(s || '').replace(/[&<>"']/g, function (c) {
      return { '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c];
    });
  }

  /* ─── API global ─────────────────────────────────────────── */
  window.HSFA = window.HSFA || {};
  window.HSFA.openWizard = openWizard;
  window.HSFA.closeWizard = closeWizard;

  /* ─── Triggers globales ──────────────────────────────────── */
  document.addEventListener('click', function (e) {
    var trigger = e.target.closest('[data-lw-open]');
    if (!trigger) return;
    e.preventDefault();
    openWizard({
      propertyId:   trigger.dataset.lwPropertyId   || '',
      propertyName: trigger.dataset.lwPropertyName || '',
      step:         parseInt(trigger.dataset.lwStep || '1', 10),
    });
  });

  /* ─── Init on DOMContentLoaded ───────────────────────────── */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
