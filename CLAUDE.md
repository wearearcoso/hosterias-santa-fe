# Hosterías Santa Fe — staging MVP

## Scope

Static Cloudflare Pages site. Keep staging `noindex` until image permissions, production lead credentials, custom domain, and launch approval are complete.

## Commands

- `npm test`: data, catalog, sitemap, image-rights and fail-closed API tests.
- `python3 -m http.server 4173 --bind 127.0.0.1`: local static server.
- `npm run qa:desktop`: Playwright QA at 1440×900 and 768×1024, plus all five detail pages at 390 and 1440; writes screenshots to `docs/screenshots/`.
- `npm run qa:mobile`: Playwright QA at 390×844 and 320×844; writes screenshots to `docs/screenshots/`.
- `node scripts/booking-estimates.mjs init|report|public|sync`: offline manual-rate workflow; see `docs/booking-estimates.md`. Public output requires written approval and is absent by default. Regenerate detail pages after approved output.

## Non-negotiable rules

- Public catalog contains only the five approved MVP properties.
- Never claim image rights without documentary evidence in `src/data/image-rights.json`.
- Never add unsupported prices, ratings, superlatives, availability, or amenities.
- All consultation CTAs open the on-site wizard until a real WhatsApp number is approved.
- Lead submission is fail-closed: only `GESTIONALEADS_MODE=real` may return success and a real CRM lead ID.
- Do not enable indexing or deploy from a feature branch.

## Release review (2026-10-02)

Read `docs/launch-review-2026-10-02.md` before any launch work. The public launch remains blocked until `node scripts/audit-photos.mjs --launch-gate` passes, a final domain is configured, and real CRM delivery is verified. Legacy routes receive temporary redirects through `functions/_middleware.js`; verify them on Cloudflare before indexing.
