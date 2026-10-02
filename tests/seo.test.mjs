import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { verifiedProperties } from '../src/data/properties.js';
import { onRequest } from '../functions/_middleware.js';

const root = new URL('../', import.meta.url);
const read = path => fs.readFileSync(new URL(path, root), 'utf8');
const base = 'https://hosterias-santa-fe.pages.dev';

test('every sitemap URL has a local page and a matching absolute canonical', () => {
  const sitemap = read('sitemap.xml');
  const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => match[1]);
  assert.deepEqual(urls, [base + '/', ...verifiedProperties.map(property => `${base}/${property.slug}`)]);
  for (const url of urls) {
    const path = new URL(url).pathname;
    const html = read(path === '/' ? 'index.html' : `${path.slice(1)}.html`);
    assert.ok(html.includes(`<link rel="canonical" href="${url}">`), url);
    assert.match(html, /<meta name="robots" content="noindex,nofollow">/);
    assert.equal((html.match(/<h1\b/g) || []).length, 1, url);
  }
});

test('the five approved detail pages omit unsupported commercial claims and structured data', () => {
  const titles = new Set();
  for (const property of verifiedProperties) {
    const html = read(`${property.slug}.html`);
    const expectedH1 = property.id === 'florida-tropical' ? `${property.name} cerca de Santa Fe de Antioquia` : `${property.name} en Santa Fe de Antioquia`;
    assert.ok(html.includes(`<h1>${expectedH1}</h1>`), property.slug);
    assert.ok(html.includes(`data-property="${property.name}"`));
    assert.ok(!/\$\s*\d|TripAdvisor|aggregateRating|application\/ld\+json|FAQPage|amenityFeature/i.test(html), property.slug);
    const title = html.match(/<title>([^<]+)<\/title>/)?.[1];
    assert.ok(title, property.slug);
    assert.ok(!titles.has(title), `duplicate title: ${title}`);
    titles.add(title);
  }
});


test('legacy content is redirected before its unverified HTML can be served', async () => {
  const paths = [
    '/dia-de-sol-santa-fe-de-antioquia', '/guia-santa-fe-de-antioquia',
    '/hosterias-para-parejas-santa-fe-de-antioquia', '/hoteles-boutique-santa-fe-de-antioquia',
    '/hoteles-cerca-parque-santa-fe-de-antioquia', '/hoteles-coloniales-santa-fe-de-antioquia',
    '/hoteles-con-piscina-santa-fe-de-antioquia', '/hoteles-economicos-santa-fe-de-antioquia',
    '/hoteles-para-eventos-santa-fe-de-antioquia', '/hoteles-para-familias-santa-fe-de-antioquia',
    '/hoteles-santa-fe-de-antioquia', '/hoteles-todo-incluido-santa-fe-de-antioquia'
  ];
  for (const path of paths) {
    for (const suffix of ['', '.html']) {
      let called = false;
      const response = await onRequest({
        request: new Request(`https://hosterias-santa-fe.pages.dev${path}${suffix}`),
        next: async () => { called = true; return new Response('legacy'); },
        env: {}
      });
      assert.equal(response.status, 302, path + suffix);
      assert.equal(response.headers.get('location'), 'https://hosterias-santa-fe.pages.dev/');
      assert.match(response.headers.get('x-robots-tag'), /noindex/);
      assert.equal(called, false);
    }
  }
});
