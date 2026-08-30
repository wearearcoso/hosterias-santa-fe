/**
 * Notificador de Telegram para nuevos leads.
 * Envía a TELEGRAM_CHAT_ID_PREVIEW en staging, TELEGRAM_CHAT_ID_PRODUCTION en producción.
 * Si falla después de 2 reintentos: devuelve { status: "failed" } sin lanzar.
 */

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function formatDate(isoDate) {
  if (!isoDate) return '—';
  try {
    return new Date(isoDate).toLocaleDateString('es-CO', {
      day: '2-digit', month: 'long', year: 'numeric', timeZone: 'America/Bogota',
    });
  } catch {
    return isoDate;
  }
}

export function buildTelegramMessage(lead, isPreview) {
  const prefix = isPreview ? '[TEST] ' : '';
  const r = lead.request || {};
  const c = lead.contact || {};
  const a = lead.attribution || {};

  const lines = [
    `${prefix}<b>Nuevo lead — Santa Fe de Antioquia</b>`,
    `ID: <code>${escapeHtml(lead.leadId)}</code>`,
    '',
    `Plan: ${escapeHtml(r.planType || '—')}`,
    r.selectedPropertyName ? `Propiedad: ${escapeHtml(r.selectedPropertyName)}` : null,
    r.checkIn ? `Fechas: ${formatDate(r.checkIn)}${r.checkOut ? ' → ' + formatDate(r.checkOut) : ''}` : (r.flexibleDates ? 'Fechas: Flexibles' : null),
    `Viajeros: ${r.adults || 0} adulto${(r.adults || 0) !== 1 ? 's' : ''}${r.children ? `, ${r.children} niño${r.children !== 1 ? 's' : ''}` : ''}`,
    r.budgetRange ? `Presupuesto: ${escapeHtml(r.budgetRange)}` : null,
    r.occasion ? `Ocasión: ${escapeHtml(r.occasion)}` : null,
    r.preferences?.length ? `Preferencias: ${r.preferences.map(escapeHtml).join(', ')}` : null,
    r.transportFromMedellin ? 'Transporte desde Medellín: Sí' : null,
    '',
    `Nombre: <b>${escapeHtml(c.fullName)}</b>`,
    `Teléfono: <code>${escapeHtml(c.phoneE164)}</code>`,
    c.email ? `Correo: ${escapeHtml(c.email)}` : null,
    c.initialContactPreference ? `Preferencia: ${escapeHtml(c.initialContactPreference)}` : null,
    '',
    a.utmSource ? `Origen: ${escapeHtml(a.utmSource)}${a.utmMedium ? ' / ' + escapeHtml(a.utmMedium) : ''}` : 'Origen: Directo',
    `Landing: ${escapeHtml(lead.landingPage || '/')}`,
    `Fecha UTC: ${new Date().toISOString()}`,
  ];

  return lines.filter(l => l !== null).join('\n');
}

async function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

export async function sendTelegramLeadNotification(lead, env) {
  const token = env?.TELEGRAM_BOT_TOKEN;
  if (!token) return { status: 'skipped', reason: 'no token' };

  const isPreview = (env?.ENVIRONMENT || 'preview') !== 'production';
  const chatId = isPreview
    ? env?.TELEGRAM_CHAT_ID_PREVIEW
    : env?.TELEGRAM_CHAT_ID_PRODUCTION;

  if (!chatId) return { status: 'skipped', reason: 'no chat id' };

  const text = buildTelegramMessage(lead, isPreview);
  const url = `https://api.telegram.org/bot${token}/sendMessage`;

  let lastError;
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML', disable_web_page_preview: true }),
      });
      if (res.ok) return { status: 'sent' };
      const data = await res.json().catch(() => ({}));
      lastError = new Error(`Telegram ${res.status}: ${data.description || ''}`);
    } catch (err) {
      lastError = err;
    }
    if (attempt < 2) await sleep(500);
  }

  console.error('[telegram] fallo al enviar notificación:', lastError?.message);
  return { status: 'failed', error: lastError?.message };
}
