# Agent guide

Read `CLAUDE.md` before editing. This repository is the source for the Cloudflare Pages project `hosterias-santa-fe`; deployment is handled separately.

## Working agreement

1. Keep the visible catalog and sitemap restricted to the five entries in `src/data/properties.js`.
2. Treat all image rights as `pending` unless written evidence is recorded in `src/data/image-rights.json`.
3. Do not invent prices, licenses, reviews, RNT records, contacts, or availability.
4. Keep `pages.dev` and staging builds `noindex`.
5. Never implement a mock-success lead path. Missing CRM configuration must produce a non-2xx response.
6. Run `npm test` and mobile Playwright QA at 390×844 and 320×844 before commit.
7. Do not deploy or change Cloudflare configuration from this repository task.

## Sprint 2026-10-02 — audit and staging redesign (append-only)

- Updated the home visual system against Tura Turizm's layout patterns and kept five approved properties.
- Rebuilt five detail pages from verified catalog data and mapped the local keyword research; kept staging noindex.
- Added reversible temporary redirects for 12 legacy content routes with unsupported claims.
- Added photo rights/identity audit and authorized-original preparation workflow; all seven active images remain pending.
- Added desktop/tablet QA and fixed lazy-image timing in mobile QA.
- Launch decision: staging ready for visual review; public launch blocked by image permissions, final domain/indexing setup, real CRM delivery test, and live route validation.
- See `docs/launch-review-2026-10-02.md`, `docs/seo-audit.md`, and `docs/photo-production.md`.
