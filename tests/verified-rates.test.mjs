import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { usableRate } from '../assets/js/verified-rates.js';

const now = new Date('2026-10-02T16:00:00Z');
const sample = () => ({
  generatedAt: '2026-10-02T15:59:00Z',
  prices: [{
    propertyId: 'fundadores', slug: 'hosteria-fundadores', status: 'ready',
    verificationBasis: 'hotel-confirmed', expiresAt: '2026-10-09',
    range: { min: 200000, max: 260000, currency: 'COP', sampleCount: 4,
      checkIns: ['2026-10-12', '2026-10-13', '2026-10-16', '2026-10-17'],
      observedAt: '2026-10-02', roomType: 'doble', mealPlan: 'sin desayuno',
      adults: 2, rooms: 1, nights: 1, mandatoryChargesIncluded: true }
  }]
});

test('public rate appears only for the matching approved property and current conditions', () => {
  assert.equal(usableRate(sample(), 'fundadores', 'hosteria-fundadores', now)?.range.min, 200000);
  assert.equal(usableRate(sample(), 'iguana', 'hotel-la-iguana', now), null);
  const expired = sample(); expired.prices[0].expiresAt = '2026-10-02';
  assert.equal(usableRate(expired, 'fundadores', 'hosteria-fundadores', now), null);
  const altered = sample(); altered.prices[0].range.mandatoryChargesIncluded = false;
  assert.equal(usableRate(altered, 'fundadores', 'hosteria-fundadores', now), null);
  const malformed = sample(); malformed.prices[0].range.checkIns[0] = '2026-99-99';
  assert.equal(usableRate(malformed, 'fundadores', 'hosteria-fundadores', now), null);
});

test('detail module is present only when public rate data exists', () => {
  const hasData = fs.existsSync(new URL('../src/data/verified-rate-ranges.json', import.meta.url));
  const html = fs.readFileSync(new URL('../hosteria-fundadores.html', import.meta.url), 'utf8');
  assert.equal(html.includes('class="section verified-rate"'), hasData);
  assert.equal(html.includes('verified-rates.js'), hasData);
});
