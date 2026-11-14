# Development rules

**Updated:** 14 November 2026. These rules apply across ChatGPT conversations, Codex sessions, local development and GitHub changes.

## Non-negotiables

## Rules to preserve

- **Keep original media unchanged.** Do not resize, downsize, recompress, convert or replace images/videos, or generate responsive variants, without explicit authorisation. Display sizing and crops belong in CSS. Keep assets local; do not introduce dependencies on the reference site's media library.
- **Preserve the approved appearance and interaction.** Performance/SEO changes must retain layout, typography, colours, spacing, image treatment, scroll behaviour and animation unless the user asks to change them. Do not “simplify” established sections into a different design.
- **Follow the existing visual series.** Use Inter, the established font weights, turquoise `#03c4d5`, component spacing and responsive rules. Retain existing component-specific font exceptions. Most section titles use the compact `0.9em` treatment; News & Insights headings/card titles use `1em`. Preserve deliberate hero and component overrides.
- Use the existing SVG/icon system so mobile controls do not become emoji. Keep keyboard access, focus handling, reduced-motion support and readable content when JavaScript or an entrance animation is unavailable.
- Add only media required by the requested feature. Check references before deleting existing assets. Keep third-party licence notices with their files.

## Working process

1. Read [CURRENT-TASKS.md](CURRENT-TASKS.md), [PROJECT-CONTEXT.md](PROJECT-CONTEXT.md), and [DESIGN-SYSTEM.md](DESIGN-SYSTEM.md). Consult [PROJECT-CHECKPOINT.md](PROJECT-CHECKPOINT.md) for prior implementation evidence.
2. Inspect the current repository branch and relevant source, then identify the smallest affected set of files. Do not recreate work already in the current source.
3. For a substantial or risky site change, use a feature branch/review before merging. Keep `main` stable; don't force-push. Small, explicitly requested documentation-only updates may be committed directly.
4. Change focused source files. Keep unrelated layouts, content, media, code and generated files unchanged unless the build necessarily updates them.
5. Run the applicable checks and, where interaction/appearance changes, inspect the resulting desktop/mobile browser behaviour. Report what was **actually** checked versus what remains unverified.
6. Record the result in [CURRENT-TASKS.md](CURRENT-TASKS.md) and add a dated milestone to [PROJECT-CHECKPOINT.md](PROJECT-CHECKPOINT.md). Include changed files, commit or branch, tests and specific next step.
7. Never make unrequested site-wide optimizations, rewrite source paragraphs from summaries, or conduct a whole-site asset transfer to fix one page.

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

Driver-test checks and PHP lint/tests are listed in [.github/workflows/check.yml](../.github/workflows/check.yml). Run the relevant checks when those files change; record any unavailable runtime instead of claiming a pass. Enquiries and comments use server mail; `P10X_CONTACT_TO` overrides the recipient, and comments are emailed for review. Do not submit real enquiries just to test a visual change.

## Deployment and production checks

- Changes committed to GitHub are source changes until the actual host confirms deployment.
- Check static asset loading, animation states, mobile layout and caching/compression response headers where relevant.
- Verify enquiry/comment mail only through a safe agreed host-side process; do not send real leads merely to test a cosmetic change.
- External embeds and integrations may need separate live verification.
- A completed task must distinguish **committed**, **built/tested**, **deployed** and **verified live**.

## Keeping the project memory current

Update documentation after a meaningful milestone, an approved decision/constraint change, or before pausing or handing work to a new session:

- **README:** keep the short repository entry point and links current.
- **Current tasks:** keep [CURRENT-TASKS.md](CURRENT-TASKS.md) short and authoritative for status and next action.
- **[Project checkpoint](PROJECT-CHECKPOINT.md):** append dated implementation evidence and update the top resume status.
- **[SEO audit](SEO-AUDIT.md):** record new measured results with their date, URL, mobile/desktop strategy and pre/post-deployment status. Do not overwrite a baseline with an estimate.

Keep entries short and factual. Link existing code or detailed notes instead of pasting full source, reports or chat transcripts. Never mark untested, uncommitted or undeployed work as finished. If files are unavailable locally, recover the current repository version and resume from the saved checkpoint.
