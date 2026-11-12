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

## Homepage Insights — 7 November

The homepage article carousel had six valid article links but inherited an opacity:0 rule, leaving the complete block invisible. A scoped visible default now keeps the article content readable. The homepage cards are regenerated from the first six entries in docs/article-index.json by tools/sync-home-insights.mjs, invoked during shared-layout synchronization and builds. Article titles, excerpts, dates, original images and routes stay in the shared metadata collection.

The section keeps its existing presentation and More News link. Its native controller displays three/two/one cards, supports previous/next buttons, swipe gestures and keyboard navigation, announces the visible range and excludes offscreen links from keyboard navigation. Images and titles both open the article; More News opens /insights/. Dates remain right-aligned and cards share a common height. Motion respects reduced-motion preferences. No image files were changed.

Browser checks verified the initial visible cards and covers, navigation to all six articles, disabled controls at the ends, article image and title destinations, and the More News destination with all twenty listing entries. Mobile (390 px) and tablet (820 px) show one and two cards respectively; all articles remain reachable and page bounds do not overflow. Original cover-image checksums, the build and repository validation are checked separately.

## Blog image colour interaction — 7 November

Homepage article covers and the Insights list use a CSS grayscale filter by default. Hovering or focusing any link within a card restores its original colour over 350 ms. Text, author avatars and article-page images are unaffected. Reduced-motion visitors receive an immediate colour change. This also applies to cards revealed by Load More; no media files are transformed.

Browser checks verified grayscale defaults, full colour on pointer hover, return to grayscale off hover, and keyboard focus restoration on the Insights list.

## Warm neutral CEO portrait — 7 November

The homepage leadership section uses a separate colourised portrait, William-Lee-P10X-CEO-warm-neutral.png, with warm natural skin, muted taupe knitwear and charcoal trousers. Its transparent background and existing photo placement are retained. The original monochrome portrait remains unchanged for its other existing references. The new file is stored as supplied by the colourisation output and recorded in the asset checksum manifest.

Browser review confirmed the new image loads at its native 1011 × 1556 dimensions, has no CSS grayscale filter and displays cleanly against the existing dark leadership panel. The surrounding content and layout are unchanged.

## News and Insights title spacing — 7 November

The homepage Insights heading and article titles, plus the Insights page heading and article-list titles, use 1em line height. The scoped rule overrides the compact global heading style on desktop and mobile; other headings retain their existing spacing. The 32-page build and diff whitespace check pass. Full source/asset validation could not complete in the resumed workspace because original media files are absent locally; media references and files were not changed.

## About Us CEO portrait — 7 November

The first leadership explorer card (William.L / control 01) reuses the homepage warm neutral CEO portrait. Native dimensions are 1011 × 1556; existing card crop, controls, text and other portraits remain unchanged. The card already uses filter:none. Image reference, dimensions, existing asset checksum, 32-page build and diff whitespace checks pass. No new media was created.

## About Us leadership gallery right edge — 7 November

The leadership scroll viewport extends from its existing left content alignment to the right edge of the section. Container-relative sizing follows the page width without adding horizontal document overflow. Trailing padding preserves the content inset when reaching the final card. Existing drag, snap, keyboard and numbered controls are retained.

Desktop browser checks: first card and shell both start at 48px, gallery right edge equals the 1348px viewport, document width remains 1348px, control 07 reaches the final card fully, and Home returns to the first card. The 32-page build and diff whitespace checks pass. Mobile sizing follows the existing shell width; a separate mobile browser check was not performed.

## About Us character values — 7 November

Character comes before success now contains the five supplied values, numbered 01–05: Be Humble; Gratitude; Zero Negativity; Help Each Other; Always Learn, Always Improve & Always Impress (3A). Paragraph wording is preserved exactly, with pasted line wraps treated as ordinary spaces. The existing responsive row layout, hover treatment and scroll animations apply to all five rows. Every row has unique block/heading identifiers.

Desktop browser checks confirmed all five titles and paragraphs, the longer 3A title wrapping within its own column, animation progress on all five rows, unique IDs, and no horizontal document overflow at 1348px. The 32-page build and HTML diff whitespace checks pass. No separate mobile browser check was performed for this content change.

## Interactive About Us ecosystem — 8 November

The five pillars now use a large image stage with an adjacent numbered selector. Hovering or clicking a division changes its image and original description with a 600ms crossfade and gentle image settling. Previous/next controls wrap through all five divisions; keyboard arrows and Home/End select tabs. Mobile uses a horizontally scrollable selector above the image, with selected items brought into view. Touch horizontal swipes change the pillar while vertical page scrolling remains available. There is no automatic cycling.

The original five images and pillar descriptions are retained. Original image checksums are unchanged. Tabs expose one active panel, inactive panels are inert, selection is announced on deliberate controls, reduced-motion preferences remove transitions, and the five panels remain readable without JavaScript. The About motion controller tolerates removal of the former tab widget. Other About Us sections are unchanged.

Desktop browser checks covered all five selectors, counters/panels, Home/ArrowDown navigation and Next. A 390px iframe (375px content viewport including scrollbar) verified horizontal selector navigation to Car Check, keyboard return/advance, all five image loads and 375px document bounds. A physical touch swipe was not exercised. The 32-page build, JavaScript syntax and diff whitespace checks pass. Full source checking reports only the previously absent original local media, with no other source errors.

## General FAQ category — 8 November

FAQ includes a General filter with eight questions covering Quad Film, Academy, CarCheck, the founder, P10X story, Retail, Media and Distribution. The seven supplied answers retain their exact wording and paragraph breaks; pasted line wraps are treated as spaces. The Distribution answer was drafted from the site's existing film-distribution description because no answer accompanied that question.

All 119 previous questions remain: 95 PPF, 12 Coating, 12 Tinting. Total count is 127. Category badges and result headings recognise General, and filter counts are derived from the current question collection. General entries are included in the shared search and accordion keyboard controls.

Desktop browser checks verified General's eight results, expanded Quad Film and founder answers, answer-text search for corporate scholarship returning the founder question, clear/reset and category restoration. Build, JavaScript syntax, 127-category counts, unique IDs and changed-file whitespace checks pass. This content change did not receive a separate mobile browser check.

## Architecture Tint and founder story — 8 November

Architecture Tint uses /architecture-tint/. The former /window-film/ and /window-tint/ URLs redirect to the new route in Apache, the preview server and static fallbacks. Site links, canonicals, sitemap, route registry and build outputs follow the new route; Automotive Window Tint retains /automotive-window-tint/.

The external Vimeo hero player is wrapped, centred and sized to cover its measured section. Existing Beyond the car overview paragraphs and the Your space / Our starting point photograph were present but hidden by entrance styles; scoped visible defaults restore them. Energy Saving and the supplied energy-use description replace Solar comfort. The new film-selection guide contains four keyboard-accessible disclosures covering heat, daylight/glare, privacy and film/glass suitability. Original media bytes are unchanged.

The About Us founder card opens into a full-width narrative within the leadership gallery, with a portrait, four reading chapters and all ten complete supplied paragraphs. The corrupted final line was omitted. Close, Escape, the return control and numbered leader navigation restore the gallery. Expanded mode disables gallery dragging, arrow handling and scroll selection updates, so story text and keyboard reading remain usable. Focus moves to the story heading on open and returns to the trigger on close.

Browser checks covered hero coverage (1348px desktop and 375px narrow content viewport), restored image load/visibility, guide disclosures, old-route redirects with query/anchor preservation, founder opening/closing, Escape, changing leader, mobile return control, all ten story paragraphs and no horizontal overflow. Vimeo imagery was visible in the hero. The 32-page build, changed JS syntax, unique IDs and diff whitespace checks pass. Full source/asset verification is limited by original videos absent from the sparse local checkout; no media was altered.

## P10X impact and brand meaning — 12 November

The About Us ecosystem now opens with the supplied everyday-impact introduction. Each existing interactive pillar carries its corresponding supplied “Through…” statement; the current Distribution panel uses Distribution consistently. The supplied paragraph connecting workshop learning, training, shared knowledge and partnerships closes the ecosystem.

A new “Multiply the impact.” section follows the ecosystem and precedes Why P10X. It explains P through the ten supplied ambitions, then explains 10X and the ambition to grow their impact from Malaysia into new markets. The supplied closing line completes the section. All wording is retained, with the ten P terms presented as a numbered list and pasted line wraps treated as spaces. Existing section numbers, including 06 leadership, are retained.

The layout follows the site's Inter typography, turquoise accents, rounded light panels and scroll rhythm. The P/10X columns, sequential word colour and progress lines respond to scroll; a reduced-motion query skips these animations. Content remains visible without JavaScript. The columns stack on narrow screens and use the original ecosystem photography; no media was added or altered.

Desktop checks confirmed the five-pillar integration, Distribution selection, Inter typography, ten terms, two-column layout and animation progress. A 390px iframe with a 375px content viewport confirmed the stacked layout, keyboard pillar selection and no horizontal document overflow. The 32-page build, new JavaScript syntax and diff whitespace checks pass. Full source checking reports only eight original media files unavailable in the sparse checkout, with no other source errors.

## Host verification

Verify appearance and enquiry/comment mail delivery on the final host after deployment. No real enquiry or comment was sent during development. Product placeholders and existing legal labels remain as supplied.

## Resume

Read this file and current Git state first. Work on the relevant page/component; do not restart a whole-site asset transfer. Keep the original images unchanged until the user explicitly authorizes image work.
