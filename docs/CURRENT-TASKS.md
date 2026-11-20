# Current tasks and handover

**Updated:** 20 November 2026
**Working repository:** `dee-mn/p10x`
**Primary branch:** `main`
**Live origin:** https://p10x.flevor.me

> Start here for a new chat or Codex task. This file is deliberately short: update it when work is finished or paused. The actual code and latest explicit user request override any stale note.

## Current state

- **Header search (20 November)** — The desktop and mobile icons open a full-screen search with photo shortcuts and live results. Pagefind indexes all 32 canonical routes after each build. Source and export checks passed. Chromium checks covered 320–1440 px, touch, keyboard, reduced motion, focus restoration, pagination and retry. Confirm the search on the production host after deployment.

- **Homepage PageSpeed and search metadata (20 November)** — The [SEO review](SEO-AUDIT.md) records both report baselines, measured CSS and font savings, and the follow-up measurement after deployment.

- **Source maintenance (20 November)** — Pushed five cleanup commits to `main`, from `0ec590f` through `4b5a6bd`, on top of PPF video commit `0d3f93d`. They stabilize build output, share the 20 article comment forms and mail handling, consolidate training styles, and remove unused animation state. Photo commit `67d302e` remains separate.
- **Verification** — Source and export checks passed on 32 routes. Builds in Kuala Lumpur and Los Angeles timezones produced 401 byte-identical export files. The second build did not rewrite any tracked file. Driver scoring, PHP lint, mocked submissions and browser checks passed. See [the checkpoint](PROJECT-CHECKPOINT.md) for coverage.
- **Open form issue** — On the contact page the response element stays hidden after its text updates. Reproduced with both the original and cleaned-up scripts. Live mail delivery and production deployment are unverified.

- **Source cleanup (20 November):** Formatted 89 first-party source files. Shared layout and homepage card generation now preserve indentation across builds. The generated stylesheets match the prior release byte for byte. See the [checkpoint](PROJECT-CHECKPOINT.md) for checks.

- **Website implementation:** Last documented site baseline is [`1ac36c8`](https://github.com/dee-mn/p10x/commit/1ac36c822b3af2b9bd4b95551e0fefcde17fa088). The checkpoint records 32 registered routes and the visual/interaction state as of 13–14 November.
- **Documentation:** Organised into README, project context, design system, development rules, this status file, historical checkpoint and SEO audit. `AGENTS.md` points coding agents to them.
- **Media:** The 13 November source/URL image audit found no missing image files or broken image URLs. It was not an exhaustive human scroll-through of every possible page state.
- **Performance work:** Dated 13 November changes cover CSS delivery, offscreen-video loading, font preload, image dimensions and selected accessibility/structured-data items. Original media bytes and approved presentation were protected.
- **About leadership (20 November):** Five named portraits replace the initials on the About Us cards. The source and export checks passed. The five image mappings and desktop/mobile crop previews were checked. Live verification is pending.
- **Driver Personality Test (20 November):** Tidied the Driver Personality Test welcome screen. Verified the responsive layout at 320, 390, 768 and 1280 px frame widths, keyboard Start and Back, the build, source/export checks and driver-test scoring fixtures. Deployment verification is pending.

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
