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
