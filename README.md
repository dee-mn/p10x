# P10X

P10X's standalone company website, built with Astro 4.16.19, CSS, JavaScript and local media. PHP powers enquiry, comment and driver-test submissions.

**Public site:** https://p10x.flevor.me · **Repository:** `dee-mn/p10x` · **Working branch:** `main`

## Start or resume here

This repository is the durable record for work that moves between iPhone, iPad, desktop, ChatGPT and Codex. **Do not rely on any single chat as the only project memory.**

For a routine photo, copy or page edit, start with the [focused workflow in AGENTS.md](AGENTS.md#routine-page-and-media-edits) and the affected source on `main`. For broader work or a project handoff, use the following reading order.

1. Read [current tasks and handover](docs/CURRENT-TASKS.md) first to see the latest recorded work, limits and next action.
2. Read [project context](docs/PROJECT-CONTEXT.md) for the architecture, routes, hosting and file map.
3. Read [design system](docs/DESIGN-SYSTEM.md) and [development rules](docs/DEVELOPMENT-RULES.md) before modifying a component.
4. Check current `main`, recent commits and the actual source before editing. The latest user instruction and current code take precedence over historical notes.
5. Make a focused change, validate what you can, and update [current tasks](docs/CURRENT-TASKS.md) when a milestone or pending handoff needs recording. Add a concise entry to [project checkpoint](docs/PROJECT-CHECKPOINT.md) for meaningful milestones.

## Documentation map

| File | What it owns |
| --- | --- |
| [CURRENT-TASKS.md](docs/CURRENT-TASKS.md) | Short, frequently updated status, open checks, next action and handoff |
| [PROJECT-CONTEXT.md](docs/PROJECT-CONTEXT.md) | Hosting, architecture, page routes, code ownership and source map |
| [DESIGN-SYSTEM.md](docs/DESIGN-SYSTEM.md) | Approved visuals, wording, content, interactions and exceptions |
| [DEVELOPMENT-RULES.md](docs/DEVELOPMENT-RULES.md) | Non-negotiable constraints, editing process, validation and documentation updates |
| [PROJECT-CHECKPOINT.md](docs/PROJECT-CHECKPOINT.md) | Dated, historical implementation records; do not use old entries over current decisions |
| [SEO-AUDIT.md](docs/SEO-AUDIT.md) | Measured PageSpeed baseline, delivery changes and verification limits |
| [AGENTS.md](AGENTS.md) | Compact entry instructions for Codex and other coding agents |

The route, asset, font/image-dimension, article and stylesheet manifests remain in `docs/*.json`. They are machine-readable project data, not notes to rewrite.

## Essential guardrails

- Preserve approved layout, copy, typography, media quality and interactions unless expressly asked to change them.
- **Do not downsize, recompress, convert, replace or generate alternate versions of original media** without explicit approval.
- Use the local media, fonts and existing animation/icon systems. Do not add dependencies on another site's asset library.
- Edit source CSS and rebuild; never hand-edit `styles/generated/`.
- Do not claim a change is deployed, visually verified or host-tested because it was committed to GitHub.

## Development and Plesk deployment

Use Node 22. Run `npm ci`, then `npm run dev` for a built preview with Pagefind and simulated form responses. After editing, run `npm run build && npm run check`.

The blog index lives at `/insights/`. Put article bodies in `src/fragments/insights/<slug>.html` and register their `/insights/<slug>/` URLs in the route and article manifests.

Edit page bodies in `src/fragments/`, metadata and script order in `src/data/pages.json`, and shared markup in `components/`. Astro generates the URLs in `docs/routes.json`. The build generates optimized CSS and Pagefind in `dist/` and copies original media, redirects and PHP handlers into the export.

GitHub Actions validates pushes to `main` and publishes the built files to `plesk-deploy`. In Plesk Git, select that branch and deploy its root to the site's existing document root. Keep the existing PHP handler and mail configuration. Until the branch is switched, a host tracking `main` serves its previous HTML snapshot. Future edits belong in the Astro sources.
