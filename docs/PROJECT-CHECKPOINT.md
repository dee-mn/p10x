# P10X project checkpoint

Updated: 6 November 2026

Work branch: `rebuild-20261106`.

## Current milestone

The homepage has been rebuilt with semantic HTML, local assets and independent JavaScript. The starting reference is the latest saved homepage at commit `8236829571a9e04179a5c13d3a6639064ed9405e`, together with the later user requests in “P10X Hardcoded”. The first exported version is not the visual baseline.

Preserved requirements:

- Inter and turquoise `#03C4D5`; tight heading line height.
- Full-viewport hero on desktop and mobile, centred double-shell globe, radial gap and reduced inner logo.
- Automatic rotation and drag controls. Hover, tap and keyboard exploration reveal all ten values and exact descriptions. Geometry stays hidden at rest.
- Typewriter title cycling the ten value words, with “10 Times”.
- Mobile opening scroll lock, Learn more/contact exits and re-lock when returning to the top; accessible skip link and reduced-motion behaviour.
- Current story, mission, vision, five pillars, division tabs, Expert Match, partners, expanding video, services, leadership, Humanity, news, Car Care, contact and footer sequence.
- Expert Match tabs and Driver Personality Test external link; no new destinations for Workmanship or Team.
- Original-colour footer logo, inline SVG controls and back-to-top arrow. No Precision in Motion play/pause overlay.
- William.L label near the original portrait, P10X logo in the message card, the Character Comes Before Success quote, leadership values and equal-height desktop cards.
- Six news cards, clickable images/titles, aligned dates and More News link.
- Name/phone on one form row and full-width email/message fields. The existing standalone mail handler is retained.

The custom globe renderers were retained; the page structure, scroll handling and shared UI no longer need the former theme libraries. Images have not been resized, recompressed or converted. The homepage uses 27 original raster images, one vector logo, two original videos and two local font weights.

## Verification

- Local asset and same-page anchor checks pass for source and exported output.
- JavaScript syntax checks pass.
- Desktop and 390 × 844 mobile layout inspected in browser.
- Hero values, menu open/close, division tabs, Expert Match and mobile scroll unlock exercised.
- The local preview has no mail transport; no enquiry was sent. PHP syntax passed in the repository verification job.

Original files were saved and checksum-verified directly on the rebuild branch. The repository verification job passed source checks, export checks and PHP syntax validation.

## Remaining work

1. Compare the homepage review with the approved reference and finish any visual refinements.
2. Build About Us, the five service pages, Insights, FAQ and Contact Us using the same components and current content. Preserve their existing URL paths.
3. Build the article template and carry over all 20 articles. Search and Load More belong to that stage.
4. Complete route, responsive and contact delivery verification on the final host.
5. Check page metadata and indexing. Do not resize, compress or convert images.

The other 29 routes are not present in this review milestone. Their navigation links retain the intended production paths. Do not merge this branch into `main` or replace the existing deployed site yet.

## Resume efficiently

Read this checkpoint and the current branch before editing. Complete one named stage, report its changed behaviour and checks, and update this file. Do not restart the previous bulk asset transfer or bring image variants back into the working set.
