/**
 * Capa de analytics independiente del proveedor.
 * Nunca envía datos personales (nombre, teléfono, correo, notas, IDs sensibles).
 * Captura UTM y click IDs al cargar para incluirlos en el payload del lead.
 */
(function () {
  'use strict';

  /* ─── Captura de atribución ─────────────────────────────── */
  var _attr = (function () {
    var p = new URLSearchParams(window.location.search);
    return {
      utmSource:   p.get('utm_source')   || '',
      utmMedium:   p.get('utm_medium')   || '',
      utmCampaign: p.get('utm_campaign') || '',
      utmContent:  p.get('utm_content')  || '',
      utmTerm:     p.get('utm_term')     || '',
      gclid:       p.get('gclid')        || '',
      fbclid:      p.get('fbclid')       || '',
    };
  })();

  /* ─── API pública ────────────────────────────────────────── */
  window.HSFA = window.HSFA || {};

  window.HSFA.getAttribution = function () {
    return Object.assign({}, _attr);
  };

  window.HSFA.track = function (event, data) {
    // Guardia: nunca enviar PII
    var safe = Object.assign({}, data);
    ['name', 'fullName', 'phone', 'phoneE164', 'email', 'notes', 'leadId'].forEach(function (k) {
      delete safe[k];
    });

    // Google Tag Manager / dataLayer
    if (window.dataLayer) {
      window.dataLayer.push(Object.assign({ event: event }, safe));
    }

    // Consola en desarrollo
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      console.log('[HSFA track]', event, safe);
    }
  };

  /* ─── Evento de carga de página ─────────────────────────── */
  window.HSFA.track('page_view', {
    page: window.location.pathname,
    referrer: document.referrer || '',
  });
})();
