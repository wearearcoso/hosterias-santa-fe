/**
 * Valida y normaliza el payload de un lead antes de enviarlo a GestionaLeads.
 * No lanza excepciones — retorna { ok, errors }.
 */

const MAX_NAME = 100;
const MAX_NOTES = 500;
const MAX_EMAIL = 200;

export function validateLead(body) {
  const errors = [];

  if (!body || typeof body !== 'object') {
    return { ok: false, errors: ['Payload inválido'] };
  }

  // Schema version
  if (body.schemaVersion !== '1.0') {
    errors.push('schemaVersion debe ser "1.0"');
  }

  // Consentimiento obligatorio
  if (!body.consent?.accepted) {
    errors.push('El consentimiento es obligatorio');
  }

  // Contacto
  const contact = body.contact || {};
  if (!contact.fullName?.trim()) {
    errors.push('El nombre completo es obligatorio');
  } else if (contact.fullName.trim().length > MAX_NAME) {
    errors.push(`El nombre no puede superar ${MAX_NAME} caracteres`);
  }

  if (!contact.phoneE164?.trim()) {
    errors.push('El teléfono es obligatorio');
  }

  if (contact.email && contact.email.length > MAX_EMAIL) {
    errors.push(`El correo no puede superar ${MAX_EMAIL} caracteres`);
  }

  // Notas
  if (body.request?.notes && body.request.notes.length > MAX_NOTES) {
    errors.push(`Las notas no pueden superar ${MAX_NOTES} caracteres`);
  }

  return { ok: errors.length === 0, errors };
}

/**
 * Normaliza un número de teléfono colombiano a formato E.164.
 * Acepta: 3001234567, 573001234567, +573001234567
 */
export function normalizePhone(raw) {
  if (!raw) return null;
  const digits = raw.replace(/\D/g, '');
  if (digits.startsWith('57') && digits.length === 12) return '+' + digits;
  if (digits.length === 10 && digits.startsWith('3')) return '+57' + digits;
  if (digits.length >= 7) return '+' + digits; // internacional desconocido
  return null;
}
