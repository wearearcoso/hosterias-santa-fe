import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { verifiedProperties } from '../src/data/properties.js';

const root = fileURLToPath(new URL('../', import.meta.url));
const bogotaToday = new Intl.DateTimeFormat('sv-SE', { timeZone: 'America/Bogota' }).format(new Date());
const dateAt = offset => {
  const day = new Date(`${bogotaToday}T12:00:00Z`);
  day.setUTCDate(day.getUTCDate() + offset);
  return day.toISOString().slice(0, 10);
};

test('manual estimates need two distinct weekdays and two distinct weekend dates', () => {
  fs.mkdirSync(path.join(root, '.local', 'booking-prices'), { recursive: true });
  const dir = fs.mkdtempSync(path.join(root, '.local', 'booking-prices', 'test-'));
  try {
    const evidence = path.join(dir, 'evidence.txt');
    fs.writeFileSync(evidence, 'Synthetic test evidence only.');
    const relativeEvidence = path.relative(root, evidence);
    const future = Array.from({ length: 40 }, (_, i) => dateAt(i + 8));
    const weekday = future.find(day => [1, 2, 3, 4].includes(new Date(`${day}T12:00:00Z`).getUTCDay()));
    const weekend = future.find(day => [5, 6].includes(new Date(`${day}T12:00:00Z`).getUTCDay()));
    const sundays = future.filter(day => new Date(`${day}T12:00:00Z`).getUTCDay() === 0).slice(0, 2);
    const observations = [weekday, weekday, weekend, weekend, ...sundays].map((checkIn, i) => ({
      source: 'booking-manual', observedAt: bogotaToday, checkIn,
      checkOut: new Date(Date.parse(`${checkIn}T12:00:00Z`) + 86400000).toISOString().slice(0, 10),
      adults: 2, children: 0, rooms: 1, currency: 'COP', displayTotal: 200000 + i * 10000,
      mandatoryChargesIncluded: true, rateEligibility: 'public', roomType: 'doble',
      mealPlan: 'sin desayuno', evidence: relativeEvidence
    }));
    const entries = verifiedProperties.map(property => ({
      propertyId: property.id, propertyName: property.name,
      bookingUrl: 'https://www.booking.com/hotel/co/test-property.es.html',
      bookingMatchVerified: property.id === 'fundadores', matchEvidence: property.id === 'fundadores' ? relativeEvidence : '',
      observations: property.id === 'fundadores' ? observations : [], publication: { status: 'pending' }
    }));
    const input = path.join(dir, 'observations.json');
    fs.writeFileSync(input, JSON.stringify({ schemaVersion: 1, entries }));
    const result = spawnSync(process.execPath, ['scripts/booking-estimates.mjs', 'report', '--property=fundadores'], {
      cwd: root, env: { ...process.env, BOOKING_ESTIMATES_FILE: input }, encoding: 'utf8'
    });
    assert.equal(result.status, 2);
    assert.match(result.stdout, /se requieren 2 noches lun–jue y 2 noches vie–sáb/);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});
