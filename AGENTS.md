# P10X agent instructions

Use this file for Codex or any coding agent working on this repository.

## Read order

1. [docs/CURRENT-TASKS.md](docs/CURRENT-TASKS.md) — current handoff and outstanding checks.
2. [docs/PROJECT-CONTEXT.md](docs/PROJECT-CONTEXT.md) — architecture, routes, hosting and file map.
3. [docs/DESIGN-SYSTEM.md](docs/DESIGN-SYSTEM.md) — approved visuals, content and interactive behaviour.
4. [docs/DEVELOPMENT-RULES.md](docs/DEVELOPMENT-RULES.md) — non-negotiable editing and verification rules.
5. [docs/PROJECT-CHECKPOINT.md](docs/PROJECT-CHECKPOINT.md) and [docs/SEO-AUDIT.md](docs/SEO-AUDIT.md) only where history or measurements matter.

The **latest user instruction** and **current source** take precedence over stale notes. The README is the quick entry point; do not assume a prior chat is available.

## Hard constraints

- Preserve approved visual design, responsive behaviour, copy, media fidelity and interactions unless explicitly instructed otherwise.
- Do not downsize/recompress/convert images or video, or create alternate variants, without explicit approval.
- Use local media/fonts, existing icons and animations. Do not rely on another site's files.
- Edit source styles and build; never hand-edit `styles/generated/`.
- Keep changes scoped and reviewable. Avoid broad rewrites and duplicate event controllers.
- GitHub commit ≠ deployment. Build validation ≠ complete browser testing. Report each truthfully.

## Useful checks

```sh
npm ci
npm run check
npm run build
P10X_CHECK_ROOT=dist npm run check
```

Check affected mobile and desktop interactions, focus behaviour, image visibility and page overflow where relevant. Follow PHP/driver-test checks in `.github/workflows/check.yml` when those files change.

At handoff, update [docs/CURRENT-TASKS.md](docs/CURRENT-TASKS.md) with changes, actual tests, unverified parts, commit and next step. Add a concise dated milestone to [docs/PROJECT-CHECKPOINT.md](docs/PROJECT-CHECKPOINT.md) for substantive changes.
