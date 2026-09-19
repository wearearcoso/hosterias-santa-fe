import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { onRequestPost } from '../functions/api/leads.js';
import { createLead } from '../functions/lib/gestionaleads.js';

const root = new URL('../', import.meta.url);
const read = p => fs.readFileSync(new URL(p, root), 'utf8');
const approvedSlugs = ['hosteria-florida-tropical','hosteria-fundadores','hotel-mariscal-robledo','hotel-porton-del-sol','hotel-la-iguana'];

test('home exposes exactly the five approved properties and every CTA opens wizard', () => {
  const html = read('index.html');
  const cards = [...html.matchAll(/<article class="property-card"[\s\S]*?data-property-slug="([^"]+)"/g)].map(m => m[1]);
  assert.deepEqual(cards, approvedSlugs);
  assert.equal((html.match(/data-lw-open/g) || []).length >= 7, true);
  assert.equal(/573170000000|wa\.me\//.test(html), false);
  assert.match(html, /Hostería Los Fundadores/);
  assert.match(html, /Hotel Iguana/);
});

test('sitemap contains only approved property detail URLs', () => {
  const xml = read('sitemap.xml');
  const propertyUrls = [...xml.matchAll(/<loc>[^<]+\/(hosteria-[^<]+|hotel-(?:mariscal|porton|la-iguana)[^<]*)<\/loc>/g)].map(m => m[1]);
  assert.deepEqual(propertyUrls, approvedSlugs);
});

test('image manifest covers every home image and does not claim approval', () => {
  const html = read('index.html');
  const manifest = JSON.parse(read('src/data/image-rights.json'));
  const used = [...html.matchAll(/<img[^>]+src="\/assets\/images\/([^"]+)"/g)].map(m => m[1]);
  for (const image of used) assert.ok(manifest.images.some(x => x.file === `assets/images/${image}`), image);
  assert.ok(manifest.images.every(x => ['pending','approved'].includes(x.status)));
  assert.ok(manifest.images.every(x => x.status !== 'approved' || x.evidenceDocument));
});

test('catalog data is frozen to five and has no unsupported prices or licensed claims', async () => {
  const source = read('src/data/properties.js');
  assert.equal(/rightsStatus:\s*['"]licensed/.test(source), false);
  assert.equal(/price:\s*\{/.test(source), false);
  const mod = await import('../src/data/properties.js');
  assert.equal(mod.verifiedProperties.length, 5);
  assert.deepEqual(mod.verifiedProperties.map(x => x.slug), approvedSlugs);
});

test('GestionaLeads defaults fail closed and mock is never accepted', async () => {
  await assert.rejects(() => createLead({}, {}), /mode.*real/i);
  await assert.rejects(() => createLead({}, { GESTIONALEADS_MODE: 'mock' }), /mock.*deshabilitado/i);
});

test('pages.dev host is treated as production and cannot return fictitious success', async () => {
  const body = { schemaVersion:'1.0', sourceSite:'https://hosterias-santa-fe.pages.dev', pageUrl:'https://hosterias-santa-fe.pages.dev/', landingPage:'/', request:{planType:'alojamiento',adults:2,children:0,preferences:[]}, contact:{fullName:'Prueba QA',phoneE164:'+573001234567'}, consent:{accepted:true,version:'test',timestamp:new Date().toISOString()} };
  const request = new Request('https://hosterias-santa-fe.pages.dev/api/leads', { method:'POST', headers:{Origin:'https://hosterias-santa-fe.pages.dev','Content-Type':'application/json'}, body:JSON.stringify(body) });
  const response = await onRequestPost({ request, env:{} });
  const json = await response.json();
  assert.equal(response.status, 503);
  assert.equal(json.ok, false);
  assert.equal('leadId' in json, false);
});
