# P10X agent instructions

Use this file for Codex or any coding agent working on this repository.

## Read order

1. [docs/CURRENT-TASKS.md](docs/CURRENT-TASKS.md) — current handoff and outstanding checks.
2. [docs/PROJECT-CONTEXT.md](docs/PROJECT-CONTEXT.md) — architecture, routes, hosting and file map.
3. [docs/DESIGN-SYSTEM.md](docs/DESIGN-SYSTEM.md) — approved visuals, content and interactive behaviour.
4. [docs/DEVELOPMENT-RULES.md](docs/DEVELOPMENT-RULES.md) — non-negotiable editing and verification rules.
5. [docs/PROJECT-CHECKPOINT.md](docs/PROJECT-CHECKPOINT.md) and [docs/SEO-AUDIT.md](docs/SEO-AUDIT.md) only where history or measurements matter.

The **latest user instruction** and **current source** take precedence over stale notes. The README is the quick entry point; do not assume a prior chat is available.

## ChatGPT versus Codex: choose per task

The owner primarily works from iPhone/iPad and wants **one conversation, minimal handoffs, minimal duplicated planning and token usage**. ChatGPT with connected GitHub tools is the default for normal P10X development, including planning, content, targeted HTML/CSS/JS fixes and direct repository updates when supported.

Before starting a **complex** request, assess whether a full runnable coding environment would materially improve quality. If yes, **proactively suggest Codex for that particular task**, briefly explaining the specific reason (e.g. running builds/browser tests, multi-file refactoring, Three.js/GSAP debugging, difficult regressions or production-impacting changes). Do this **before** duplicating planning or editing documentation. Do not route every task to Codex merely because it involves code; the user decides whether to switch.

When Codex is recommended, provide **one concise ready-to-paste instruction** referencing the current repository files and acceptance checks. Avoid first updating Markdown solely to relay the same task, then making the user wait again in Codex. A separate Codex session is not automatically controlled from ChatGPT; be explicit about tool limits.

If the task is manageable here, do it here. Keep `CURRENT-TASKS.md` updated at meaningful milestones or handoffs, not for every tiny CSS/text adjustment. Maintain durable design/rules docs only when an enduring decision changes. This policy applies when a new chat starts and older conversations are unavailable.

**Branch preference:** the owner works alone and prefers `main` without routine feature-branch/PR overhead. Use direct `main` commits for ordinary authorized work where supported. For risky/destructive changes or where the platform requires a branch/PR, explain the shortest safe workflow; never assume a Codex Publish action automatically updates `main` or deploys the live site.

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
