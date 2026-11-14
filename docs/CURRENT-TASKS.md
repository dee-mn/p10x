# Current tasks and handover

**Updated:** 14 November 2026
**Working repository:** `dee-mn/p10x`
**Primary branch:** `main`
**Live origin:** https://p10x.flevor.me

> Start here for a new chat or Codex task. This file is deliberately short: update it when work is finished or paused. The actual code and latest explicit user request override any stale note.

## Current state

- **Website implementation:** Last documented site baseline is [`1ac36c8`](https://github.com/dee-mn/p10x/commit/1ac36c822b3af2b9bd4b95551e0fefcde17fa088). The checkpoint records 32 registered routes and the visual/interaction state as of 13–14 November.
- **Documentation:** Organised into README, project context, design system, development rules, this status file, historical checkpoint and SEO audit. `AGENTS.md` points coding agents to them.
- **Media:** The 13 November source/URL image audit found no missing image files or broken image URLs. It was not an exhaustive human scroll-through of every possible page state.
- **Performance work:** Dated 13 November changes cover CSS delivery, offscreen-video loading, font preload, image dimensions and selected accessibility/structured-data items. Original media bytes and approved presentation were protected.
- **Recent user request:** Documentation/handover structure only. No site code, assets or deployment configuration were changed for this task.

## Pending verification — not yet confirmed

| Item | Required next check | Status |
| --- | --- | --- |
| Deployment | Confirm the expected source/build is on `p10x.flevor.me` | Unverified |
| Compression/caching | Inspect real host headers, including Plesk/Nginx static-file delivery | Unverified |
| PageSpeed | Run fresh mobile and desktop measurements against deployed site; compare with [SEO baseline](SEO-AUDIT.md) | Unverified |
| Contact/comment mail | Verify receipt and server-side handling through an agreed safe test | Unverified |
| Driver-test integrations | Verify live webhook/email acceptance if requested; do not send real test leads without approval | Not live-verified in the historical checkpoint |

These are outstanding **verification checks**, not claims that the features are broken. Do not create new features merely to close them.

## Next handoff action

Open the latest user request, check `main` and relevant files, then work only on that scope. If the request concerns SEO or production readiness, start with the pending host checks above. If it concerns layout, read [DESIGN-SYSTEM.md](DESIGN-SYSTEM.md) and validate the specified desktop/mobile states.

## Update this file after each meaningful task

Replace the transient status below with the newest facts rather than piling up a permanent task history:

- **Task / request:** (precise scope)
- **Changes:** (file paths and branch/commit)
- **Verification performed:** (commands, pages, viewports; record limitations)
- **Deployment:** (committed / deployed / visually checked live — distinguish them)
- **Remaining / next action:** (one concrete next step, or `none known`)

Store enduring design/technical policy in the dedicated docs and dated implementation detail in [PROJECT-CHECKPOINT.md](PROJECT-CHECKPOINT.md).
