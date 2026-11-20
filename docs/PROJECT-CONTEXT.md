# Project context

**Updated:** 14 November 2026. Purpose: let a new ChatGPT/Codex session understand the real repository without reconstructing it from conversation history.

## What this project is

P10X is a company website covering automotive care and protection, its ecosystem, training and editorial insights. It is primarily an interactive, multi-page corporate website, not a SaaS application. The code and original media are intended to run independently from this repository on the configured host. Preserve approved presentation while keeping the implementation maintainable.

## Current baseline

Reviewed 14 November 2026. Website implementation baseline: [`1ac36c8`](https://github.com/dee-mn/p10x/commit/1ac36c822b3af2b9bd4b95551e0fefcde17fa088).

| Item | Current state |
| --- | --- |
| Repository and working branch | `dee-mn/p10x`, `main` |
| Public site / canonical origin | `https://p10x.flevor.me` |
| Hosting | Hostinger VPS / Plesk; PHP and server mail are needed for form processing |
| Pages | Site pages in [docs/routes.json](routes.json) and published Markdown articles |
| Runtime | Standalone HTML/CSS/JavaScript; local media, fonts and animation libraries. Intentional Google Maps and Vimeo embeds remain external |
| Export | Complete site in `dist/`, published to `plesk-deploy` by CI |
| Deployment status | A GitHub commit confirms source publication. Verify the host separately before claiming a change is live |

Older checkpoint entries describe earlier stages. Later dated entries supersede earlier counts, route names, layouts and controls.

## Architecture and dependencies

- Astro builds each registered route from `src/pages/[...slug].astro`, `src/fragments/` and `src/data/pages.json`.
- Shared header, footer and article comment form markup lives in `components/`. The Astro layout and page template render them. Insights surfaces use the published Astro collection.
- Named page/section styles and interaction controllers live in `styles/` and `scripts/sections/`; use the existing controllers to avoid duplicate listeners.
- `tools/optimize-pages.mjs` generates content-hashed CSS using `docs/style-manifest.json`. `tools/build.mjs` exports the complete site to `dist/`.
- Enquiries and comments use `contact.php` and `comment.php`. The driver personality test uses `driver-test.php`, its JSON data, and `scripts/driver-test*.js`.
- The site retains deliberate Google Maps/Vimeo embeds. The host must support PHP and email for form processing. Do not assume working mail solely from static previews.
- The primary hosting configuration is Hostinger VPS/Plesk. Source commits are **not** proof of deployment to the public site.

## Editing map

| Area | Source |
| --- | --- |
| Homepage and other pages | `src/fragments/`, `src/data/pages.json`, `src/pages/[...slug].astro` |
| Shared navigation and footer | `components/`, rendered by `src/layouts/SiteLayout.astro` |
| Typography and original media display sizes | `styles/foundation.css` |
| Original page styles and their order | `docs/style-manifest.json`, `styles/reference/` and the named page styles |
| Shared controls and forms | `scripts/native.js`, `contact.php`, `comment.php`, `driver-test.php` |
| Section interactions | `scripts/sections/`; keep existing controllers rather than adding competing handlers |
| Homepage globe and values | `styles/hero.css`, `scripts/motion-hero.js`, `scripts/hero-values.js` |
| Original media and fonts | `assets/`; checksums in `docs/assets.json` |
| Image size attributes | `docs/image-dimensions.json` |
| Route and article index | `docs/routes.json`, `src/content/insights/` |
| CSS delivery and export | `tools/optimize-pages.mjs`, `tools/build.mjs` |

Edit source CSS, then build. **Do not hand-edit `styles/generated/`.** The build preserves cascade order and generates content-hashed bundles shared between pages. New source stylesheet links are incorporated into the manifest on the next build. Commit the regenerated pages, manifest and bundles together so direct root hosting and `dist/` remain consistent.

## Route and content authority

- `docs/routes.json` registers site pages. The published Markdown collection supplies article routes.
- Use page source for exact, approved paragraphs. The summarized design guide is not a substitute for supplied text.
- Keep old URL redirects functional. Current names and canonical routes are in [DESIGN-SYSTEM.md](DESIGN-SYSTEM.md).
- Local media references and checksums are tracked in `docs/assets.json`; image dimensions in `docs/image-dimensions.json`.
- The current project status and deployment/host checks are in [CURRENT-TASKS.md](CURRENT-TASKS.md). For dated implementation evidence see [PROJECT-CHECKPOINT.md](PROJECT-CHECKPOINT.md).

## What not to assume

A repo change does not guarantee a live-site change. A successful static build does not guarantee a visible image, smooth mobile animation, email delivery or external integration. Verify these separately and report any limitations.
