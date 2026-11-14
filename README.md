# P10X

Company website for P10X. Static HTML, CSS and JavaScript with local photographs, video, fonts and animation libraries. PHP handles enquiries, article comments and the driver personality test.

## Start here when resuming work

1. Read this README and the latest entries in [the project checkpoint](docs/PROJECT-CHECKPOINT.md). For performance work, also read [the SEO audit](docs/SEO-AUDIT.md).
2. Check the current `main` branch, recent commits and any working changes before editing. The latest user instruction and current source take precedence over older notes.
3. Continue the requested page or component. Preserve completed work; do not restart the whole site, replace an approved layout or repeat a whole-site asset transfer.
4. Save the result and the next step using the checkpoint process below. Chat history is not the only record of project decisions.

## Current baseline

Reviewed 14 November 2026. Website implementation baseline: [`1ac36c8`](https://github.com/dee-mn/p10x/commit/1ac36c822b3af2b9bd4b95551e0fefcde17fa088).

| Item | Current state |
| --- | --- |
| Repository and working branch | `dee-mn/p10x`, `main` |
| Public site / canonical origin | `https://p10x.flevor.me` |
| Hosting | Hostinger VPS / Plesk; PHP and server mail are needed for form processing |
| Pages | 32 registered routes in [docs/routes.json](docs/routes.json) |
| Runtime | Standalone HTML/CSS/JavaScript; local media, fonts and animation libraries. Intentional Google Maps and Vimeo embeds remain external |
| Export | Complete site in `dist/`; the repository root can also be served directly |
| Deployment status | A GitHub commit confirms source publication. Verify the host separately before claiming a change is live |

Older checkpoint entries describe earlier stages. Later dated entries supersede earlier counts, route names, layouts and controls.

## Rules to preserve

- **Keep original media unchanged.** Do not resize, downsize, recompress, convert or replace images/videos, or generate responsive variants, without explicit authorisation. Display sizing and crops belong in CSS. Keep assets local; do not introduce dependencies on the reference site's media library.
- **Preserve the approved appearance and interaction.** Performance/SEO changes must retain layout, typography, colours, spacing, image treatment, scroll behaviour and animation unless the user asks to change them. Do not “simplify” established sections into a different design.
- **Follow the existing visual series.** Use Inter, the established font weights, turquoise `#03c4d5`, component spacing and responsive rules. Retain existing component-specific font exceptions. Most section titles use the compact `0.9em` treatment; News & Insights headings/card titles use `1em`. Preserve deliberate hero and component overrides.
- Use the existing SVG/icon system so mobile controls do not become emoji. Keep keyboard access, focus handling, reduced-motion support and readable content when JavaScript or an entrance animation is unavailable.
- Add only media required by the requested feature. Check references before deleting existing assets. Keep third-party licence notices with their files.

## Approved experience

| Area | Behaviour to retain |
| --- | --- |
| Homepage hero | Full viewport height; rotating, draggable particle globe with separated outer particles. The complete globe is 10% larger above 1024px; tablet/phone sizing stays unchanged. Hover/tap/keyboard reveals the value words and geometric lines; lines are hidden at rest. Preserve the typewriter and mobile Learn More scroll unlock / return-to-top lock |
| Homepage pillars and video | Keep the scroll-linked five-pillar experience, stationary card-height video and title-reveal timing. The Precision in motion play overlay stays removed |
| Services and products | Homepage services use two rows of three cards with hover expansion, including Training. Preserve Product menu series → product navigation, changing previews, mobile levels, focus trap, Escape/close and scroll restoration. The closed panel must be fully hidden with no preview photo leaking through |
| Homepage leadership | Warm neutral CEO portrait, William.L labelling, the real P10X logo and approved paragraph placement. Retain the added horizontal breathing room |
| Partners | Consistent grey logos at the existing 0.6 opacity, including JPK and BERNAMA; no separate name/ministry captions beneath the added logos. Retain the skills/knowledge-sharing paragraph |
| News & Insights | Real linked article cards, equal card treatment, default greyscale covers returning to colour on hover/focus, and More News / Load More behaviour |
| About ecosystem and brand meaning | Five original pillar images/descriptions with numbered selection, previous/next, keyboard and mobile swipe controls; no automatic cycling. Keep the supplied impact narrative and P/10X section. The P words type/delete like the homepage, with pause/resume and readable reduced-motion/no-JavaScript fallbacks |
| About leadership and founder story | Drag/snap/numbered explorer; first card aligned with the left content and the gallery visible to the right edge without document overflow. CEO card uses an arrow-only CTA at every size. Preserve its expandable story, icon-only close, Escape, focus return and photo clearance; gallery dragging is disabled while reading |
| Service pages | Preserve photographs, original copy, galleries and controls. Architecture Tint hero video must cover its section; retain Beyond the car text, the Your space photograph, Energy Saving copy and the added film-selection guide |
| FAQ and driver test | General is a searchable FAQ category alongside the service categories (127 questions at this baseline). Preserve the supplied driver-test content, scoring/form behaviour and new-tab entry link |

The homepage's ten hero terms include **People**; About's ten P ambitions include **Partnerships**. Keep these intentionally different lists as supplied rather than making one overwrite the other.

About leadership order: **William.L, Max Yong, Salwani Nor, Nick Ng, Nadzmi Zahin, Abraham Chai, Fabian Ong**.

## Approved names and copy

Keep the full approved paragraphs in their current page source; do not rewrite or reconstruct them from abbreviated notes.

| Item | Approved wording / route |
| --- | --- |
| Automotive service | Automotive Window Tint — `/automotive-window-tint/` |
| Buildings service | Architecture Tint — `/architecture-tint/` |
| Training | `/training/`, also present in navigation, footer, homepage services and sitemap |
| Old service URLs | Preserve redirects from `/tinting/`, `/window-film/` and `/window-tint/`; do not reintroduce them as canonical service routes |
| Five pillars | Retail, Academy, Media, Distribution and CarCheck; preserve the current selector order and existing brand artwork |
| Mission | To raise the standards in the world of automotive care. |
| Vision | To become the most trusted automotive care ecosystem by setting the benchmark for craftsmanship, customer experience, people development and the industry progress. |
| Care line | Considerate advice. Skilled hands. Care that lasts. |
| Leadership quote | **Character Comes Before Success.** |
| About values 01–05 | Be Humble; Gratitude; Zero Negativity; Help Each Other; Always Learn, Always Improve & Always Impress (3A) |

The complete founder story and ecosystem/impact copy are already implemented. Do not invent an ending for the corrupted final line of the originally supplied founder text. The General FAQ Distribution answer was drafted from existing site copy because no answer was supplied; retain that distinction if revisiting content.

## Editing map

| Area | Source |
| --- | --- |
| Homepage and other pages | `index.html`, `<route>/index.html` |
| Shared navigation and footer | `components/`, applied by `tools/sync-layout.mjs` |
| Typography and original media display sizes | `styles/foundation.css` |
| Original page styles and their order | `docs/style-manifest.json`, `styles/reference/` and the named page styles |
| Shared controls and forms | `scripts/native.js`, `contact.php`, `comment.php`, `driver-test.php` |
| Section interactions | `scripts/sections/`; keep existing controllers rather than adding competing handlers |
| Homepage globe and values | `styles/hero.css`, `scripts/motion-hero.js`, `scripts/hero-values.js` |
| Original media and fonts | `assets/`; checksums in `docs/assets.json` |
| Image size attributes | `docs/image-dimensions.json` |
| Route and article index | `docs/routes.json`, `docs/article-index.json` |
| CSS delivery and export | `tools/optimize-pages.mjs`, `tools/build.mjs` |

Edit source CSS, then build. **Do not hand-edit `styles/generated/`.** The build preserves cascade order and generates content-hashed bundles shared between pages. New source stylesheet links are incorporated into the manifest on the next build. Commit the regenerated pages, manifest and bundles together so direct root hosting and `dist/` remain consistent.

## Development and validation

Node.js 20 or later; CI uses Node.js 22. Install the locked dependencies first:

```sh
npm ci
npm run dev
```

For website changes:

```sh
npm run check
npm run build
P10X_CHECK_ROOT=dist npm run check
```

The dev/build commands sync the header/footer and optimise page delivery. Check the generated diff before committing. For layout/interaction work, also check desktop and mobile in the browser, the affected controls and document overflow. Source validation alone does not prove that a photo is visible or an animation completes.

Driver-test checks and PHP lint/tests are listed in [.github/workflows/check.yml](.github/workflows/check.yml). Run the relevant checks when those files change; record any unavailable runtime instead of claiming a pass. Enquiries and comments use server mail; `P10X_CONTACT_TO` overrides the recipient, and comments are emailed for review. Do not submit real enquiries just to test a visual change.

## Performance and SEO status

The 13 November pre-change mobile audits reported SEO **100**, best practices **100**, accessibility **96**, and performance **83** in the supplied report / **84** in a separate fresh audit. These are dated lab results, not current live scores or a guarantee of rankings.

The implemented delivery work reduces homepage stylesheet requests from 42 to 3, with approximately 20% less locally gzipped CSS; adds original-font preloads and image dimensions; defers offscreen video loading; improves accessible labels/heading roles; and adds Organization/WebSite structured data. No media bytes or visual design were changed. Large original images/video remain a payload limitation.

Apache compression/cache directives are in `.htaccess`. If Plesk/Nginx serves static files directly, equivalent host settings are required. **Pending host checks:** deployment, actual compression/cache headers, a fresh PageSpeed measurement, and enquiry/comment delivery. Do not report these as completed from repository changes alone. See [the SEO audit](docs/SEO-AUDIT.md) for measurements and verification limits.

## Keeping the project memory current

Update documentation after a meaningful milestone, an approved decision/constraint change, or before pausing or handing work to a new session:

- **README:** maintain the concise current rules, architecture, approved behaviour and unresolved host checks. Replace superseded guidance instead of accumulating contradictory instructions.
- **[Project checkpoint](docs/PROJECT-CHECKPOINT.md):** save a dated entry with the request, changed areas, source commit when known, checks actually run, limitations, remaining work and the next concrete step. Update the opening status so the next session need not infer it from the history.
- **[SEO audit](docs/SEO-AUDIT.md):** record new measured results with their date, URL, mobile/desktop strategy and pre/post-deployment status. Do not overwrite a baseline with an estimate.

Keep entries short and factual. Link existing code or detailed notes instead of pasting full source, reports or chat transcripts. Never mark untested, uncommitted or undeployed work as finished. If files are unavailable locally, recover the current repository version and resume from the saved checkpoint.

