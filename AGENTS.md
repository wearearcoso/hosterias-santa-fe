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

## Sprint 2026-10-02 — SEO architecture and manual rate workflow (append-only)

- Defined intent, title, H1, internal links and next evidence for the home page and all five approved property pages in `docs/seo-architecture.md`. Updated page content and the detail generator; sitemap remains six URLs and staging stays `noindex`.
- Checked five currently available EMD `.com` candidates through Hostinger and recommended `hosteriassantafedeantioquia.com` for clarity, pending registration and final canonical setup.
- Replaced automated Booking extraction for this scope with an offline, manual observation workflow. No Booking API access or written scraping permission exists; raw observations stay under ignored `.local/booking-prices/`.
- Added a gated, optional rate module: publication requires matching evidence, four comparable recent stays and written authorization; the browser rechecks open pages and hides expired/incomplete ranges; `sync` removes revoked prices from the publication JSON. No public rate JSON or numeric rate ships now.
- Verified `npm test` (12/12), mobile QA at 320/390 px and desktop/tablet/detail QA at 768/1440/390 px; public launch is still blocked by photo rights, domain and real CRM delivery.
- See `docs/booking-estimates.md`, `docs/domain-shortlist-2026-10-02.md` and `docs/launch-review-2026-10-02.md`.

## Sprint 2026-10-02 — page headings and conditional landing briefs (append-only)

- Applied property-specific H2 headings to all five approved detail pages through `scripts/generate-approved-details.mjs`; kept unique H1, metadata, six-URL sitemap and staging `noindex`.
- Corrected Florida Tropical's location to near Santa Fe de Antioquia, between Sopetrán and Santa Fe, using its official FAQ; updated catalog, home, title/H1, detail copy and source record.
- Prepared nine unpublished SEO landing briefs and a day-of-sun editorial draft with primary-source evidence and explicit publication gates. No legacy redirect, sitemap, navigation or public landing was opened.
- Official day-of-sun pages for Florida Tropical and Los Fundadores exist, but operating days/hours and current conditions need direct confirmation before a commercial landing; other hotels lack sufficient offer detail.
- Verified `npm test` 12/12, mobile QA 320/390, desktop/tablet QA 768/1440 and all five details at 390/1440; hero CTA remains visible at 320/390. Public launch remains blocked by photo rights, final domain and real CRM delivery.
- See `docs/seo-architecture.md`, `docs/seo-landing-briefs.md` and `docs/launch-review-2026-10-02.md`.
