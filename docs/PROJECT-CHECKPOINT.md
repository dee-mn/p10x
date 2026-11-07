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

## Five-pillar video and title — 7 November

The actual video now lives inside the first card panel's background layer. Its rendered frame is one viewport high on desktop and inherits the existing card-panel pin, instead of stretching across the 4,223 px cards/ecosystem wrapper. On mobile it matches the swipe-card panel. The original video bytes are untouched.

The heading's character reveal uses the stable outer section for its entry range (85% to 20% of viewport height), so it finishes before card rotation. The mobile trigger configuration preserves this reveal. Browser checks covered partial reveal on entrance, full title at the start of pinning, reverse scrolling, the rotating cards with a stationary video frame, the following panel covering the video, and the 390 px mobile frame. Local JavaScript syntax and the thirty-page build pass.

## Leadership names and order — 7 November

About Us leadership order: William.L, Max Yong, Salwani Nor, Nick Ng, Nadzmi Zahin, Abraham Chai, Fabian Ong. Nick and Fabian's complete cards were exchanged, retaining their own roles. Numbered navigation labels and positional anchors match that order; monograms reflect the corrected names.

## Tint navigation and terminology — 7 November

All three authored top-navigation variants group Automotive Window Tint (/tinting/) and Architecture Tint (/window-film/) under Services > Tinting. Footer lists the two services directly. Window film wording is replaced throughout visible copy, article/FAQ text, metadata and alt descriptions, including the split homepage service heading. Routes and original media filenames/bytes remain unchanged.

## Training service — 7 November

Training is available at /training/ and in all header variants, the footer, the homepage service gallery and the sitemap. The page uses the existing service-page shell and original Academy/workmanship images. It includes keyboard-accessible learning-area tabs, scroll-revealed type, stacked learning-process chapters, audience guidance, native FAQ disclosures and a training enquiry link that pre-fills the existing contact message. Desktop and 390 px browser checks covered tab clicks/keyboard changes, chapter transitions, FAQ open/close, mobile width, homepage/footer links and the contact handoff; no enquiry was submitted. Motion respects reduced-motion preferences; small screens use natural document flow. Course fees, intake dates, entry requirements and qualification details are left for the Academy to confirm.

## Homepage leadership entrances — 7 November

The decorative Archinic word is removed from the Partners background; an empty, inaccessible spacer preserves its original frame. Homepage entrance elements have visible CSS defaults. The new home-reveals controller adds short, one-time viewport animations for copy and images instead of leaving them in hidden entrance classes. Leadership, news and contact heading reveals are excluded from the generic per-line controller and use a whole-heading entry range that completes before the viewport centre. Reduced-motion visitors receive readable static content. Browser checks verified the complete CEO name/role/quote, early title completion, subsequent editorial/news/contact copy, an empty partner word frame, and a 390 px mobile page without horizontal overflow. No media bytes were changed.

## Automotive tint URL and menu indicators — 7 November

Automotive Window Tint now uses /automotive-window-tint/ across canonical/OG metadata, the route registry, sitemap, shared navigation/footer, service cards and content links. The former /tinting/ address has an Apache 301 rule, a preview-server redirect and a static redirect fallback; it is excluded from the sitemap. The build includes the redirect files.

Desktop Tinting uses a small inline SVG chevron only because it opens a child menu. Service destinations, including Training, have no trailing icons. Font-generated submenu glyphs are suppressed. The Product/mobile menu controls use inline SVG hamburger strokes; Product has no white icon box. Existing product open/close behaviour is retained. Browser checks covered desktop/mobile service navigation, new page URL/canonical, old URL redirection with query/anchor preservation, plain Training labels and Product open/close.

## Colourlock partner logo — 7 November

Colourlock replaces Gtechniq in the homepage partner grid and the matching brand strip. The supplied Colourlock SVG is stored locally with its original bytes and included in the asset checksum manifest. Existing contain sizing, centring and opacity are retained; a CSS filter gives the new logo the same monochrome treatment as the other wordmarks. The unused Gtechniq logo asset is removed.

## Driver Personality Test — 7 November

The new /driver-personality-test/ page preserves the supplied p10x.my test's 25 questions, answer choices, referrer names, 25 celebrity profiles, scoring, car-model weighting, PPF/tint packages and optional email workflow. The original avatar sprite is stored locally without transformation. Homepage and footer links now open the local test.

The native questionnaire uses the current Inter/charcoal/turquoise style, multiple selection on question 3, keyboard controls, answer restoration, four progress milestones, responsive result cards, sharing and a downloadable PNG. Reduced-motion preferences are respected. Personal answers and contact details remain in memory during the test.

Completion posts through driver-test.php to the original Zapier destination using the same 18 result fields. The optional email action sends an update as in the source. The server validates answers and contact fields, recomputes package scores and only acknowledges successful webhook responses. Failed sends can be retried; acknowledged sends are deduplicated for each test run/email.

Verification: 300 deterministic answer/car combinations matched the original scoring and celebrity selection; committed golden fixtures cover all three package levels. Browser checks completed all 25 questions on desktop and at 390 px, including multi-select, back/answer restoration, keyboard input, milestones, results, preview-only email update, image download and retake. Mobile bounds are 375/375 px with no horizontal overflow. Development preview sends no external leads; PHP transport tests use a mock. Live Zapier acceptance and downstream email delivery still require verification on the PHP host; no live test lead was sent.

## Homepage service discovery — 7 November

The six services use two independent rows of three full-bleed photo panels: PPF / Automotive Window Tint / Wrapping, then Detailing / Architecture Tint / Training. Desktop panels are 420 px high with a 20 px row gap. The first panel in each row starts expanded; pointer hover or keyboard focus expands a chosen panel and reveals its description within that row. Pointer hover takes priority over a different keyboard focus in the same row. The other row keeps its own state. Expansion takes 550 ms, image movement 650 ms and accent changes 250 ms. Each photo is clipped within its panel, including the original Academy image for Training. Original media bytes remain unchanged.

At 1100 px and below each three-service row scrolls horizontally with snap positions, visible descriptions and a short browsing hint. Focused cards scroll into view; Left/Right and Home/End navigate within the current row. Reduced-motion visitors receive immediate transitions. The existing early heading reveal is retained.

Browser checks verified three panels in each row, independent desktop expansion (658 px selected / 281 px neighbours at a 1252 px row width), Training photo containment, and separate row navigation on 390 px and 1024 px viewports without horizontal page overflow. The final service is fully visible after keyboard navigation on mobile. The 32-page build and source checks are retained.

## Host verification

Verify appearance and enquiry/comment mail delivery on the final host after deployment. No real enquiry or comment was sent during development. Product placeholders and existing legal labels remain as supplied.

## Resume

Read this file and current Git state first. Work on the relevant page/component; do not restart a whole-site asset transfer. Keep the original images unchanged until the user explicitly authorizes image work.
