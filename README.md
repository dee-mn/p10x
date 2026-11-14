# P10X

P10X's standalone company website, built with static HTML, CSS, JavaScript and local media. PHP powers enquiry, comment and driver-test submissions.

**Public site:** https://p10x.flevor.me · **Repository:** `dee-mn/p10x` · **Working branch:** `main`

## Start or resume here

This repository is the durable record for work that moves between iPhone, iPad, desktop, ChatGPT and Codex. **Do not rely on any single chat as the only project memory.**

1. Read [current tasks and handover](docs/CURRENT-TASKS.md) first to see the latest recorded work, limits and next action.
2. Read [project context](docs/PROJECT-CONTEXT.md) for the architecture, routes, hosting and file map.
3. Read [design system](docs/DESIGN-SYSTEM.md) and [development rules](docs/DEVELOPMENT-RULES.md) before modifying a component.
4. Check current `main`, recent commits and the actual source before editing. The latest user instruction and current code take precedence over historical notes.
5. Make a focused change, validate what you can, and update [current tasks](docs/CURRENT-TASKS.md). Add a concise entry to [project checkpoint](docs/PROJECT-CHECKPOINT.md) for meaningful milestones.

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

## Local development

Node.js 20+ (CI runs Node.js 22):

```sh
npm ci
npm run dev
# For changes:
npm run check
npm run build
P10X_CHECK_ROOT=dist npm run check
```

The build updates shared layout and content-hashed styles. Review the generated diff and test affected desktop/mobile behaviour as needed. PHP forms and host configuration require their own verification.

**Current implementation baseline:** 32 registered routes at the last reviewed checkpoint (14 November 2026). See [current tasks](docs/CURRENT-TASKS.md) for the latest verified status and outstanding checks.
