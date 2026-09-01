/**
 * Reemplaza el modal de 7 pasos (leadWizardModal) por el nuevo formulario de 2 pasos
 * en todos los archivos HTML del proyecto.
 *
 * También reemplaza la referencia al script lead-wizard.js → lead-form.js.
 *
 * Ejecutar: node scripts/fix-modal.js
 */

const fs   = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

/* ─── Nuevo modal HTML ─────────────────────────────────────── */
const NEW_MODAL = `<!-- Lead Form -->
<dialog id="leadModal" class="lf-modal" aria-labelledby="lf-title">
  <div class="lf-inner">
    <!-- Pantalla 1: Datos básicos -->
    <div class="lf-screen" id="lf-screen-1">
      <div class="lf-header">
        <div class="lf-context-badge" id="lf-context-badge" hidden></div>
        <button type="button" class="lf-close-btn" data-lf-close aria-label="Cerrar">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" width="20" height="20"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>
      <h2 class="lf-title" id="lf-title">Encuentra tu plan ideal</h2>
      <p class="lf-subtitle">Cuéntanos qué buscas y un asesor te enviará las mejores opciones disponibles.</p>
      <input type="text" id="lf-hp" name="_hp" tabindex="-1" autocomplete="off" aria-hidden="true" style="position:absolute;left:-9999px;width:1px;height:1px;opacity:0;">
      <div class="lf-field">
        <label for="lf-nombre">Nombre completo <span class="lf-req" aria-hidden="true">*</span></label>
        <input type="text" id="lf-nombre" autocomplete="name" maxlength="100">
        <span class="lf-ferr" id="lf-err-nombre" hidden></span>
      </div>
      <div class="lf-field">
        <label for="lf-tel">WhatsApp o teléfono <span class="lf-req" aria-hidden="true">*</span></label>
        <input type="tel" id="lf-tel" autocomplete="tel" placeholder="300 123 4567" inputmode="numeric">
        <span class="lf-ferr" id="lf-err-tel" hidden></span>
      </div>
      <div class="lf-field">
        <label class="lf-chk-row" for="lf-flexible">
          <input type="checkbox" id="lf-flexible">
          <span>Fechas flexibles / aún no sé cuándo voy</span>
        </label>
        <div id="lf-date-wrap">
          <input type="date" id="lf-fecha" aria-label="Fecha de entrada o visita">
        </div>
      </div>
      <div class="lf-counters">
        <div class="lf-counter-row" role="group" aria-label="Adultos">
          <span class="lf-counter-lbl">Adultos</span>
          <div class="lf-counter">
            <button type="button" class="lf-ctr-btn" data-counter="adults" data-action="minus" aria-label="Menos adultos" disabled>−</button>
            <span class="lf-ctr-val" id="lf-adults-val" aria-live="polite">2</span>
            <button type="button" class="lf-ctr-btn" data-counter="adults" data-action="plus" aria-label="Más adultos">+</button>
          </div>
        </div>
        <div class="lf-counter-row" role="group" aria-label="Niños">
          <span class="lf-counter-lbl">Niños</span>
          <div class="lf-counter">
            <button type="button" class="lf-ctr-btn" data-counter="children" data-action="minus" aria-label="Menos niños" disabled>−</button>
            <span class="lf-ctr-val" id="lf-children-val" aria-live="polite">0</span>
            <button type="button" class="lf-ctr-btn" data-counter="children" data-action="plus" aria-label="Más niños">+</button>
          </div>
        </div>
      </div>
      <div id="lf-plantype-wrap">
        <p class="lf-field-lbl">¿Qué tipo de plan buscas?</p>
        <div class="lf-plan-chips" role="group" aria-label="Tipo de plan">
          <button type="button" class="lf-plan-chip" data-val="hospedaje" aria-pressed="false">Hospedaje</button>
          <button type="button" class="lf-plan-chip" data-val="dia-de-sol" aria-pressed="false">Día de sol</button>
          <button type="button" class="lf-plan-chip" data-val="celebracion" aria-pressed="false">Celebración</button>
          <button type="button" class="lf-plan-chip" data-val="no-se" aria-pressed="false">Todavía no sé</button>
        </div>
      </div>
      <label class="lf-chk-row lf-consent" for="lf-habeas">
        <input type="checkbox" id="lf-habeas">
        <span>Acepto el <a href="/politica-privacidad" target="_blank" rel="noopener">tratamiento de mis datos personales</a> para ser contactado con opciones.</span>
      </label>
      <div class="lf-err-zone" id="lf-err-zone" hidden></div>
      <div class="lf-actions">
        <button type="button" id="lf-btn-next" class="lf-btn-primary">Ver opciones y recibir asesoría →</button>
        <button type="button" id="lf-btn-wa1" class="lf-btn-wa">Continuar por WhatsApp</button>
      </div>
    </div>
    <!-- Pantalla 2: Preferencias -->
    <div class="lf-screen" id="lf-screen-2" hidden>
      <div class="lf-header">
        <button type="button" class="lf-back-btn" id="lf-btn-back" aria-label="Volver al paso anterior">← Paso 1</button>
        <button type="button" class="lf-close-btn" data-lf-close aria-label="Cerrar">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" width="20" height="20"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>
      <h2 class="lf-title">¿Qué sería ideal para tu plan?</h2>
      <p class="lf-subtitle">Selecciona lo más importante. Puedes elegir varias opciones.</p>
      <div class="lf-pref-chips" role="group" aria-label="Preferencias">
        <button type="button" class="lf-pref-chip" data-val="Piscina" aria-pressed="false">Piscina</button>
        <button type="button" class="lf-pref-chip" data-val="Alimentación incluida" aria-pressed="false">Alimentación incluida</button>
        <button type="button" class="lf-pref-chip" data-val="Cerca del parque" aria-pressed="false">Cerca del parque</button>
        <button type="button" class="lf-pref-chip" data-val="Ambiente tranquilo" aria-pressed="false">Ambiente tranquilo</button>
        <button type="button" class="lf-pref-chip" data-val="Plan romántico" aria-pressed="false">Plan romántico</button>
        <button type="button" class="lf-pref-chip" data-val="Ideal para niños" aria-pressed="false">Ideal para niños</button>
        <button type="button" class="lf-pref-chip" data-val="Celebración" aria-pressed="false">Celebración</button>
        <button type="button" class="lf-pref-chip" data-val="Evento o matrimonio" aria-pressed="false">Evento o matrimonio</button>
        <button type="button" class="lf-pref-chip" data-val="Económico" aria-pressed="false">Económico</button>
        <button type="button" class="lf-pref-chip" data-val="Colonial" aria-pressed="false">Hotel colonial</button>
      </div>
      <div class="lf-field">
        <label for="lf-notas">¿Quieres contarnos algo más? <span class="lf-opt">(opcional)</span></label>
        <textarea id="lf-notas" rows="3" maxlength="500" placeholder="Ej: viajamos con bebé, buscamos piscina..."></textarea>
      </div>
      <div class="lf-err-zone" id="lf-err-zone-2" hidden></div>
      <div class="lf-actions">
        <button type="button" id="lf-btn-submit" class="lf-btn-primary">Solicitar opciones y precios</button>
      </div>
    </div>
    <!-- Confirmación -->
    <div class="lf-screen lf-screen-confirm" id="lf-screen-confirm" hidden>
      <div class="lf-success-icon" aria-hidden="true">
        <svg viewBox="0 0 48 48" fill="none" width="56" height="56"><circle cx="24" cy="24" r="24" fill="#F5C800"/><polyline points="13,24 21,32 35,16" stroke="#000" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </div>
      <h2 class="lf-title">¡Recibimos tu solicitud!</h2>
      <p class="lf-body" id="lf-confirm-body">Un asesor revisará las opciones disponibles y te contactará para confirmar precios y disponibilidad.</p>
      <p class="lf-ref-row" id="lf-ref-row" hidden>Referencia: <code id="lf-ref-code"></code></p>
      <div class="lf-actions" style="margin-top:.75rem">
        <button type="button" id="lf-btn-wa-confirm" class="lf-btn-wa" hidden>Enviar también por WhatsApp</button>
        <button type="button" id="lf-btn-done" class="lf-btn-secondary">Listo, esperaré el contacto</button>
      </div>
    </div>
    <!-- Error -->
    <div class="lf-screen lf-screen-error" id="lf-screen-error" hidden>
      <div class="lf-error-icon" aria-hidden="true">!</div>
      <h2 class="lf-title">No pudimos registrar tu solicitud</h2>
      <p class="lf-body">Puedes escribirnos directamente por WhatsApp y con gusto te ayudamos a encontrar tu plan ideal.</p>
      <div class="lf-actions" style="margin-top:.75rem">
        <button type="button" id="lf-btn-wa-error" class="lf-btn-wa">Continuar por WhatsApp</button>
        <button type="button" id="lf-btn-retry" class="lf-btn-secondary">Volver a intentar</button>
      </div>
    </div>
  </div>
</dialog>`;

/* ─── Script ref replacement ───────────────────────────────── */
const OLD_SCRIPT = '<script src="assets/js/lead-wizard.js"></script>';
const NEW_SCRIPT = '<script src="assets/js/lead-form.js"></script>';

/* ─── Find and replace the wizard modal block ──────────────── */
function replaceWizardBlock(html) {
  const START_COMMENT = '<!-- Lead Wizard Modal -->';
  const startIdx = html.indexOf(START_COMMENT);
  if (startIdx === -1) return null; // not found

  // Also consume the optional INCLUDE comment line if present
  // Find the <div id="leadWizardModal"
  const divOpenTag = '<div id="leadWizardModal"';
  const divStart = html.indexOf(divOpenTag, startIdx);
  if (divStart === -1) return null;

  // Count div nesting from divStart to find the matching </div>
  let depth   = 0;
  let i       = divStart;
  let endIdx  = -1;

  while (i < html.length) {
    const nextOpen  = html.indexOf('<div', i);
    const nextClose = html.indexOf('</div>', i);

    if (nextClose === -1) break;

    if (nextOpen !== -1 && nextOpen < nextClose) {
      // Make sure it's actually an opening tag (not <div-something>)
      const afterDiv = html[nextOpen + 4];
      if (afterDiv === ' ' || afterDiv === '\n' || afterDiv === '\r' || afterDiv === '>') {
        depth++;
        i = nextOpen + 4;
        continue;
      }
      // Not a real <div — advance past this character
      i = nextOpen + 1;
      continue;
    }

    // nextClose comes first (or nextOpen is -1)
    depth--;
    if (depth === 0) {
      endIdx = nextClose + '</div>'.length;
      break;
    }
    i = nextClose + '</div>'.length;
  }

  if (endIdx === -1) return null;

  // Replace from START_COMMENT to end of </div>
  return html.slice(0, startIdx) + NEW_MODAL + html.slice(endIdx);
}

/* ─── Process all HTML files ───────────────────────────────── */
const files = fs.readdirSync(ROOT).filter(f => f.endsWith('.html'));
let replaced = 0;
let scriptFixed = 0;

for (const file of files) {
  const filePath = path.join(ROOT, file);
  let html = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  // Replace wizard modal block
  const updated = replaceWizardBlock(html);
  if (updated !== null) {
    html = updated;
    changed = true;
    replaced++;
    console.log(`  ✓ Modal replaced: ${file}`);
  }

  // Replace script reference
  if (html.includes(OLD_SCRIPT)) {
    html = html.split(OLD_SCRIPT).join(NEW_SCRIPT);
    changed = true;
    scriptFixed++;
    console.log(`  ✓ Script updated: ${file}`);
  }

  if (changed) {
    fs.writeFileSync(filePath, html, 'utf8');
  }
}

console.log(`\nListo:`);
console.log(`  ${replaced} modal(es) reemplazado(s)`);
console.log(`  ${scriptFixed} referencia(s) de script actualizada(s)`);

// Verify
console.log('\n--- Verificación ---');
let issues = 0;
for (const file of files) {
  const html = fs.readFileSync(path.join(ROOT, file), 'utf8');
  if (html.includes('leadWizardModal')) {
    console.warn(`⚠️  ${file} aún contiene leadWizardModal`);
    issues++;
  }
  if (html.includes('lead-wizard.js')) {
    console.warn(`⚠️  ${file} aún referencia lead-wizard.js`);
    issues++;
  }
}
if (issues === 0) console.log('Sin problemas detectados.');
