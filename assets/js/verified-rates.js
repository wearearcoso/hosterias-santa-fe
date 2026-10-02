const bogotaDay = now => new Intl.DateTimeFormat('sv-SE', { timeZone: 'America/Bogota' }).format(now);
const validDay = value => {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T12:00:00Z`);
  return Number.isFinite(date.valueOf()) && date.toISOString().slice(0, 10) === value;
};
const elapsedDays = (earlier, later) => (Date.parse(`${later}T12:00:00Z`) - Date.parse(`${earlier}T12:00:00Z`)) / 86400000;

export function usableRate(data, propertyId, slug, now = new Date()) {
  if (!data || !Array.isArray(data.prices) || !Number.isFinite(Date.parse(data.generatedAt))) return null;
  const age = now.valueOf() - Date.parse(data.generatedAt);
  if (age < -300000 || age > 7 * 86400000) return null;
  const today = bogotaDay(now);
  const matching = data.prices.filter(item => item.propertyId === propertyId && item.slug === slug);
  if (matching.length !== 1) return null;
  const item = matching[0];
  const range = item.range;
  if (item.status !== 'ready' || !['hotel-confirmed', 'booking-licensed'].includes(item.verificationBasis)) return null;
  if (!validDay(item.expiresAt) || item.expiresAt <= today || !range) return null;
  if (!Number.isSafeInteger(range.min) || !Number.isSafeInteger(range.max) || range.min <= 0 || range.max < range.min) return null;
  if (range.currency !== 'COP' || range.sampleCount < 4 || range.adults !== 2 || range.rooms !== 1 || range.nights !== 1 || range.mandatoryChargesIncluded !== true) return null;
  if (!validDay(range.observedAt) || elapsedDays(range.observedAt, today) < 0 || elapsedDays(range.observedAt, today) > 7) return null;
  if (!Array.isArray(range.checkIns) || new Set(range.checkIns).size < 4 || !range.checkIns.every(day => validDay(day) && day > today)) return null;
  if (typeof range.roomType !== 'string' || !range.roomType.trim() || typeof range.mealPlan !== 'string' || !range.mealPlan.trim()) return null;
  return item;
}

function render() {
  const section = document.querySelector('.verified-rate[data-property-id][data-property-slug]');
  if (!section) return;
  let requestVersion = 0;
  const refresh = async () => {
    const version = ++requestVersion;
    try {
      const response = await fetch('/src/data/verified-rate-ranges.json', { cache: 'no-store' });
      const data = response.ok ? await response.json() : null;
      if (version !== requestVersion) return;
      const item = usableRate(data, section.dataset.propertyId, section.dataset.propertySlug);
      if (!item) { section.hidden = true; return; }
      const range = item.range;
      const money = amount => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(amount);
      const sampleDates = range.checkIns.map(day => new Date(`${day}T12:00:00Z`).toLocaleDateString('es-CO', { day: 'numeric', month: 'short', timeZone: 'UTC' })).join(', ');
      section.querySelector('.rate-amount').textContent = `${money(range.min)}–${money(range.max)} COP`;
      section.querySelector('.rate-context').textContent = `Por una noche, dos adultos y una habitación (${range.roomType}; ${range.mealPlan}). Fechas consultadas: ${sampleDates}. Impuestos y cargos obligatorios incluidos.`;
      section.querySelector('.rate-note').textContent = `${item.verificationBasis === 'hotel-confirmed' ? 'Rango confirmado por el alojamiento' : 'Referencia de Booking.com publicada con autorización'}. Revisado el ${range.observedAt}; válido hasta el ${item.expiresAt}. Sujeto a disponibilidad y condiciones. Confirma la tarifa vigente antes de reservar.`;
      section.hidden = false;
    } catch {
      if (version === requestVersion) section.hidden = true;
    }
  };
  refresh();
  setInterval(refresh, 60_000);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) refresh(); });
}

if (typeof document !== 'undefined') render();
