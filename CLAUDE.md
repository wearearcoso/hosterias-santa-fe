# Hosterías Santa Fe — staging MVP

## Scope

Static Cloudflare Pages site. Keep staging `noindex` until image permissions, production lead credentials, custom domain, and launch approval are complete.

## Commands

- `npm test`: data, catalog, sitemap, image-rights and fail-closed API tests.
- `python3 -m http.server 4173`: local static server.
- `npm run qa:mobile`: Playwright QA at 390×844 and 320×844; writes screenshots to `artifacts/qa/`.

## Non-negotiable rules

- Public catalog contains only the five approved MVP properties.
- Never claim image rights without documentary evidence in `src/data/image-rights.json`.
- Never add unsupported prices, ratings, superlatives, availability, or amenities.
- All consultation CTAs open the on-site wizard until a real WhatsApp number is approved.
- Lead submission is fail-closed: only `GESTIONALEADS_MODE=real` may return success and a real CRM lead ID.
- Do not enable indexing or deploy from a feature branch.
