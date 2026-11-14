# Design system and approved experiences

**Reviewed:** 14 November 2026. This file captures design decisions that must survive a change of device, chat or coding session. For exact paragraph content, inspect the corresponding page source.

## Visual direction

- Brand expression: premium automotive, confident typography, restrained motion, precise spacing and high-quality original photography.
- Main typeface: locally bundled **Inter**; retain existing per-component font exceptions. Do not replace an approved visual system with a generic template.
- Core turquoise accent: `#03c4d5` (as recorded in the latest repository README). Keep current dark/neutral treatments and existing scoped colour exceptions.
- Main section-heading line-height is generally `0.9em`; News & Insights headings/card titles use `1em`. Preserve component-specific overrides.
- Leadership imagery uses the approved warm neutral treatment; blog/news covers begin greyscale and return to colour on hover/focus.
- Use real existing SVG/icon assets instead of emoji fallbacks in mobile layouts.
- Preserve spacing, crop, letter spacing, layout and hover/scroll response when making performance or accessibility changes. Verify at mobile and desktop sizes.

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

## Review standard

For visual work compare the affected component in desktop and mobile layouts, including opening/closing states, scroll interactions, images loaded in place, no page overflow, keyboard/focus, and reduced-motion behaviour. Do not describe a design as approved based only on code inspection. For full historical implementation/measurements, see [PROJECT-CHECKPOINT.md](PROJECT-CHECKPOINT.md).
