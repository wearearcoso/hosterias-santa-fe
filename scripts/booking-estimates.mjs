#!/usr/bin/env node
/** Internal, offline Booking price observations. This script never contacts Booking.com. */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { verifiedProperties } from '../src/data/properties.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const localDir = path.join(root, '.local', 'booking-prices');
const defaultInput = path.join(localDir, 'observations.json');
const ids = new Set(verifiedProperties.map(p => p.id));
const byId = Object.fromEntries(verifiedProperties.map(p => [p.id, p]));
const candidates = {
  'florida-tropical': 'https://www.booking.com/hotel/co/hosteria-florida-tropical-santa-fe-de-antioquia.es.html',
  'fundadores': 'https://www.booking.com/hotel/co/hosteria-fundadores.es.html',
  'mariscal-robledo': 'https://www.booking.com/hotel/co/mariscal-robledo.es.html',
  'porton-del-sol': 'https://www.booking.com/hotel/co/porton-del-sol.es.html',
  'iguana': 'https://www.booking.com/hotel/co/ab-del-sol-campestre-santa-fe-de-antioquia.es.html'
};
const command = process.argv[2] || 'report';
const input = process.env.BOOKING_ESTIMATES_FILE || defaultInput;
const selection = process.argv.find(a => a.startsWith('--property='))?.split('=')[1];
const outputFile = process.argv.find(a => a.startsWith('--output='))?.slice('--output='.length);
const today = new Date();
const todayStr = new Intl.DateTimeFormat('sv-SE', { timeZone: 'America/Bogota' }).format(today);

function fail(message) { console.error(message); process.exitCode = 2; }
function isDate(s) {
  if (typeof s !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(s)) return false;
  const parsed = new Date(`${s}T12:00:00Z`);
  return !Number.isNaN(parsed.valueOf()) && parsed.toISOString().slice(0, 10) === s;
}
function day(s) { return new Date(`${s}T12:00:00Z`); }
function daysBetween(a, b) { return Math.round((day(b) - day(a)) / 86400000); }
function localEvidence(p) {
  if (typeof p !== 'string' || !p.trim()) return false;
  const full = path.resolve(root, p);
  return full.startsWith(`${localDir}${path.sep}`) && fs.existsSync(full) && fs.statSync(full).isFile();
}
function bookingUrl(u) {
  try { const url = new URL(u); return url.protocol === 'https:' && url.hostname === 'www.booking.com' && url.pathname.startsWith('/hotel/co/'); }
  catch { return false; }
}
function template() {
  if (fs.existsSync(input)) return fail(`Ya existe ${input}; no se sobrescribe.`);
  fs.mkdirSync(path.dirname(input), { recursive: true, mode: 0o700 });
  const entries = verifiedProperties.map(p => ({
    propertyId: p.id, propertyName: p.name, bookingUrl: candidates[p.id],
    bookingMatchVerified: false, matchEvidence: '', observations: [],
    publication: { status: 'pending', basis: '', approvalEvidence: '', reviewer: '', reviewedAt: '', expiresAt: '' }
  }));
  fs.writeFileSync(input, `${JSON.stringify({ schemaVersion: 1, entries }, null, 2)}\n`, { mode: 0o600 });
  console.log(`Plantilla privada creada: ${input}`);
}
function validateEntry(entry) {
  const errors = [];
  if (!ids.has(entry.propertyId)) errors.push('propertyId fuera del catálogo aprobado');
  const property = byId[entry.propertyId];
  if (property && entry.propertyName !== property.name) errors.push('nombre distinto al catálogo');
  if (!bookingUrl(entry.bookingUrl)) errors.push('URL Booking inválida');
  if (entry.bookingMatchVerified !== true || !localEvidence(entry.matchEvidence)) errors.push('identidad de ficha sin evidencia local');
  if (!Array.isArray(entry.observations)) errors.push('observations debe ser una lista');
  const valid = [];
  for (const [i, o] of (Array.isArray(entry.observations) ? entry.observations : []).entries()) {
    const problems = [];
    if (o.source !== 'booking-manual') problems.push('source debe ser booking-manual');
    if (!isDate(o.observedAt) || daysBetween(o.observedAt, todayStr) > 7 || o.observedAt > todayStr) problems.push('observedAt fuera de los últimos 7 días');
    if (!isDate(o.checkIn) || !isDate(o.checkOut) || daysBetween(o.checkIn, o.checkOut) !== 1 || o.checkIn <= todayStr) problems.push('estancia futura de una noche requerida');
    if (o.adults !== 2 || o.rooms !== 1 || o.children !== 0) problems.push('solo 2 adultos, 0 niños, 1 habitación');
    if (o.currency !== 'COP' || !Number.isFinite(o.displayTotal) || o.displayTotal <= 0) problems.push('total mostrado positivo en COP requerido');
    if (o.mandatoryChargesIncluded !== true) problems.push('cargos obligatorios no confirmados');
    if (o.rateEligibility !== 'public') problems.push('solo tarifa pública sin login ni Genius');
    if (!o.roomType || !o.mealPlan) problems.push('tipo de habitación y alimentación requeridos');
    if (!localEvidence(o.evidence)) problems.push('evidencia local faltante');
    if (problems.length) errors.push(`observación ${i + 1}: ${problems.join('; ')}`);
    else valid.push(o);
  }
  const stays = new Set(valid.map(o => o.checkIn));
  if (valid.length < 4 || stays.size < 4) errors.push('se requieren 4 noches distintas con observaciones válidas');
  const weekday = [...stays].filter(checkIn => [1, 2, 3, 4].includes(day(checkIn).getUTCDay())).length;
  const weekend = [...stays].filter(checkIn => [5, 6].includes(day(checkIn).getUTCDay())).length;
  if (weekday < 2 || weekend < 2) errors.push('se requieren 2 noches lun–jue y 2 noches vie–sáb');
  if (new Set(valid.map(o => `${o.roomType}|${o.mealPlan}`)).size > 1) errors.push('habitación o plan de alimentación no comparables');
  const range = valid.length ? { min: Math.min(...valid.map(o => o.displayTotal)), max: Math.max(...valid.map(o => o.displayTotal)), currency: 'COP', sampleCount: stays.size, checkIns: [...stays].sort(), observedAt: valid.map(o => o.observedAt).sort().at(-1), roomType: valid[0].roomType, mealPlan: valid[0].mealPlan, adults: 2, rooms: 1, nights: 1, mandatoryChargesIncluded: true } : null;
  return { errors, range };
}
function validatePublication(entry, range) {
  const p = entry.publication || {};
  const errors = [];
  if (p.status !== 'approved') errors.push('publicación pendiente');
  if (!['hotel-written-approval', 'booking-written-license'].includes(p.basis)) errors.push('falta base documentada para publicar');
  if (!localEvidence(p.approvalEvidence)) errors.push('falta autorización escrita local');
  if (!p.reviewer || !isDate(p.reviewedAt) || !isDate(p.expiresAt)) errors.push('revisor y fechas de aprobación requeridos');
  else if (p.reviewedAt > todayStr || p.expiresAt <= todayStr || daysBetween(p.reviewedAt, p.expiresAt) > 7 || daysBetween(p.reviewedAt, todayStr) > 7 || (range && p.reviewedAt < range.observedAt)) errors.push('aprobación anterior a la muestra, futura, vencida o vigencia mayor a 7 días');
  if (range && p.approvedMin !== range.min) errors.push('mínimo no aprobado para esta muestra');
  if (range && p.approvedMax !== range.max) errors.push('máximo no aprobado para esta muestra');
  return errors;
}
function run() {
  if (!fs.existsSync(input)) return fail(`No existe ${input}. Ejecuta: node scripts/booking-estimates.mjs init`);
  let data;
  try { data = JSON.parse(fs.readFileSync(input, 'utf8')); } catch (e) { return fail(`JSON inválido: ${e.message}`); }
  if (data.schemaVersion !== 1 || !Array.isArray(data.entries)) return fail('Esquema inválido.');
  const counts = new Map();
  for (const entry of data.entries) counts.set(entry?.propertyId, (counts.get(entry?.propertyId) || 0) + 1);
  if (data.entries.length !== ids.size || [...ids].some(id => counts.get(id) !== 1)) return fail('El archivo debe contener exactamente las cinco propiedades aprobadas, una vez cada una.');
  if (selection && !ids.has(selection)) return fail(`Propiedad desconocida: ${selection}`);
  if (command === 'sync' && selection) return fail('sync reconstruye todo el catálogo; no admite --property.');
  const chosen = command === 'report' && selection ? data.entries.filter(e => e.propertyId === selection) : data.entries;
  const output = [];
  for (const entry of chosen) {
    const { errors, range } = validateEntry(entry);
    if (command === 'public' || command === 'sync') errors.push(...validatePublication(entry, range));
    output.push({ propertyId: entry.propertyId, propertyName: entry.propertyName, slug: byId[entry.propertyId]?.slug, status: errors.length ? 'blocked' : 'ready', errors, ...(errors.length ? {} : { range, ...(['public', 'sync'].includes(command) ? { expiresAt: entry.publication.expiresAt, verificationBasis: entry.publication.basis === 'hotel-written-approval' ? 'hotel-confirmed' : 'booking-licensed', disclaimer: `Rango orientativo para 1 noche, 2 adultos y 1 habitación en las fechas de muestra; incluye los impuestos y cargos obligatorios documentados. Sujeto a disponibilidad y condiciones; confirma la tarifa vigente.` } : {}) }) });
  }
  if (command === 'report') {
    for (const row of output) console.log(`${row.propertyName}: ${row.status}${row.range ? ` · COP ${row.range.min.toLocaleString('es-CO')}–${row.range.max.toLocaleString('es-CO')} · ${row.range.sampleCount} muestras` : ''}${row.errors.length ? `\n  - ${row.errors.join('\n  - ')}` : ''}`);
  } else if (command === 'public' || command === 'sync') {
    const selected = selection ? output.find(r => r.propertyId === selection) : null;
    const approved = output.filter(r => r.status === 'ready');
    if (command === 'public' && ((selected && selected.status !== 'ready') || approved.length === 0)) {
      const failures = selected && selected.status !== 'ready' ? [selected] : output;
      console.error(failures.map(r => `${r.propertyName}: ${r.errors.join('; ')}`).join('\n'));
      process.exitCode = 2;
    } else {
      const publicFile = path.join(root, 'src', 'data', 'verified-rate-ranges.json');
      const destination = outputFile ? path.resolve(root, outputFile) : publicFile;
      if (destination !== publicFile && !destination.startsWith(`${localDir}${path.sep}`)) return fail('La salida debe ser el JSON público previsto o un archivo de prueba bajo .local/booking-prices/.');
      if (command === 'sync' && approved.length === 0) {
        fs.rmSync(destination, { force: true });
        console.log(`Sin aprobaciones vigentes; JSON retirado: ${destination}`);
      } else {
        const json = `${JSON.stringify({ generatedAt: today.toISOString(), prices: approved }, null, 2)}\n`;
        if (outputFile || command === 'sync') {
          fs.mkdirSync(path.dirname(destination), { recursive: true });
          const temporary = `${destination}.${process.pid}.tmp`;
          fs.writeFileSync(temporary, json);
          fs.renameSync(temporary, destination);
          console.log(`JSON validado: ${destination}`);
        } else console.log(json);
      }
    }
  } else return fail(`Comando desconocido: ${command}. Usa init, report, public o sync.`);
  if (command === 'report' && output.some(r => r.status === 'blocked')) process.exitCode = 2;
}
if (command === 'init') template(); else run();
