# P10X project checkpoint

Updated: 6 November 2026  
Work branch: `rebuild-20261106`

## Current state

All 30 routes are present: homepage, About Us, five service pages, Insights, FAQ, Contact Us and 20 articles. Keep this branch separate from `main` while the user reviews it. The existing live site has not been replaced.

The baseline is the latest saved design at `8236829571a9e04179a5c13d3a6639064ed9405e` and the later requests in “P10X Hardcoded”, not the first exported version.

The homepage retains the double-shell globe, smaller inner mark, drag/automatic rotation, ten exact value descriptions, hover/tap/keyboard reveals, hidden resting geometry, typewriter title and mobile scroll controls. Current content, Inter, turquoise, tight headings, original-colour footer mark and SVG controls are retained.

About and the service pages retain their authored content and layouts with native page controls. Timeline years, division tabs, wrapping finishes, detailing thumbnails/previous/next, window-film disclosure panels and photograph inspection work without the former page runtime.

The FAQ contains all 119 answers, category filtering, search, empty/reset state and Load More. Insights contains all 20 article cards, search and Load More. All article image/title links lead to the existing route paths.

## Images: explicit user instruction

Do not optimize images. Do not resize, compress, re-encode or convert them, and do not create responsive variants.

The working set contains 200 original raster images, the existing vector logo, four original local videos and two local font weights. Asset checksums are recorded in `docs/assets.json`. Source files were copied byte-for-byte and verified before saving.

Image width/height attributes describe the originals for layout; they do not alter image bytes. Google Maps and the existing Vimeo window-film background remain external service embeds, independent of the asset source host.

## Source layout

- `components/header.html` and `components/footer.html` are shared templates.
- `tools/sync-layout.mjs` applies them to all 30 static pages before development/export.
- `scripts/shell.js` handles common navigation, back-to-top and enquiries.
- `scripts/site.js` handles homepage sections; the custom globe scripts remain separate.
- `scripts/pages.js` handles page tabs, photographs, filters, search and Load More.
- `styles/pages.css` and `styles/editorial.css` contain interior layouts.
- `docs/routes.json` and `docs/article-index.json` record the current routes and articles.
- `npm run build` exports all 30 pages and local assets to `dist/`.

No dependency/package installation is needed.

## Verification completed

- Thirty-page source and export checks: titles, one H1, canonical URLs, duplicate IDs, same-page anchors, internal routes, local resources and JavaScript syntax.
- Exact editorial text comparison: all 20 articles and all five service-page bodies match the reference after whitespace/icon normalization.
- Original asset checksums and image-file integrity verified.
- Desktop browser checks: hero controls, common navigation, About tabs, wrapping tabs, detailing selection, window-film disclosure, FAQ filters/search/reset/Load More and article search/Load More.
- Mobile checks at 390 × 844: viewport bounds, About timeline, tinting hero/video, article layout and homepage scroll controls.
- Repository checks include PHP syntax. No live enquiry has been sent.

## Remaining review

Review appearance and motion across the completed pages before switching the deployed branch. Verify real enquiry delivery on the final host. Keep the existing product placeholders and legal labels until actual replacement content is provided.

Image optimization is excluded from remaining work unless the user explicitly changes that instruction.

## Resume

Read this checkpoint and the current branch first. Do not reconstruct the project from old chats or restart the asset transfer. Update the relevant component/page, run its checks, and record the resulting state here.
