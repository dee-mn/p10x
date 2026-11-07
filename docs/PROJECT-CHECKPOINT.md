# P10X checkpoint

Updated 7 November 2026. Active branch: `main`.

The previous main is preserved on `backup-main-20261106` at `8236829571a9e04179a5c13d3a6639064ed9405e`.

## Current direction

Match the approved site's layout, content, typography, media placement, responsive rules and interactions. Keep the current homepage particle globe as the sole deliberate design exception. The earlier approximate homepage, redesigned article template and invented FAQ/Insights layouts have been replaced.

All 30 routes contain their reference structure. Shared header/footer, timeline, service galleries, finish controls, tabs, FAQ search/category controls, article cards, sidebar, contact layout and original section sequence are restored. The old secondary Car Care hero is removed from the lower homepage. The globe remains at the top.

## Files

- `components/`: shared header and footer, applied by `tools/sync-layout.mjs`.
- `styles/foundation.css`: the reference variable Inter, existing hero font weights, local Archivo and reference display dimensions for untouched original media.
- `styles/reference/`: local component, page and authored design rules, retaining their original cascade order.
- `styles/native.css`: independent control states and media wrappers.
- `scripts/native.js`: common controls, heading/scroll interactions, search, photo viewer, menus and local forms.
- `scripts/sections/`: named section controllers using native DOM APIs and locally bundled GSAP.
- `styles/hero.css`, `scripts/motion-hero.js`, `scripts/hero-values.js`: retained homepage hero.
- `contact.php`, `comment.php`: server-mail handlers. Comments are sent for review.
- `docs/assets.json`: media/font checksums. Images must not be optimized, resized, recompressed, converted or duplicated into responsive variants.

No CMS, jQuery, page-builder or theme JavaScript runtime is required. Media and fonts are local. The existing Google Maps and Vimeo service embeds remain external.

## Verified

Thirty-page checks cover titles, primary headings, canonical URLs, unique IDs, same-page anchors, internal destinations, local assets and JavaScript syntax. Original previously saved asset bytes are unchanged. New originals were copied without transformation and checksum verified.

Desktop reference measurements match the homepage story/pillars/expert/partners/video/services/CEO/news sections; the About timeline's 7,020 px pin span; PPF hero position, 360 px aside and 5,647 px gallery; the article's 930 px content column; and Contact's 1,300 × 700 px map placement. FAQ retains 119 questions; Insights initially displays twelve cards and expands to twenty.

Browser checks include desktop layouts, FAQ category/search, Insights Load More, and mobile About layout/menu at 390 × 844. Mobile page bounds do not overflow. Static editorial text matches on 29 routes; Insights additionally contains the eight cards revealed by Load More. The Insights masonry columns use the original shortest-column placement. Exact pixel equivalence on every viewport has not been exhaustively tested.

## Latest interaction fixes

CTA arrows and labels exchange positions on hover and keyboard focus, matching the reference. Product navigation has one controller for open/close, focus trapping and scroll restoration. Series reveal their child products on hover or keyboard selection; child hover updates the right-hand preview and caption. All placeholders reuse the same original image. Mobile navigation preserves the series/product levels.

The product reveal uses short transform/opacity transitions instead of a full-screen animated clipping mask. Close, Escape, backdrop dismissal, repeat opening, scroll restoration, hover/reset, series/product previews and both mobile product levels were exercised in the browser. The homepage Precision in motion play overlay stays removed; video behaviour is unchanged.

## Product menu closed state — 7 November

The complete panel must use the native hidden attribute and display:none while inactive. Visibility:hidden alone is insufficient: preview image layers and the Close control explicitly set visibility:visible and can escape that inherited state. This reproduced the photo appearing before any click and remaining after closing.

The preview now starts only inside the explicit opener. Close synchronously hides the full panel, cancels and invalidates pending previews, restores scrolling and returns focus; it does not wait for an exit animation promise. Browser checks verified initial load without a photo, click-to-open, product selection followed by Close, Escape, repeated reopening/closing and reload. Closed preview bounds are zero and initial image sources are unset.

CTA hover and keyboard focus use the shared turquoise (#03c4d5), including service-page overrides and the Product CTA. Arrow/label movement remains intact, with dark labels and a contrasting white arrow on a dark icon.

## Host verification

Verify appearance and enquiry/comment mail delivery on the final host after deployment. No real enquiry or comment was sent during development. Product placeholders and existing legal labels remain as supplied.

## Resume

Read this file and current Git state first. Work on the relevant page/component; do not restart a whole-site asset transfer. Keep the original images unchanged until the user explicitly authorizes image work.
