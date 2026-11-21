# P10X agent instructions

ChatGPT and Codex follow the same workflow in `dee-mn/p10x`, whether using a GitHub connector or a local checkout.

## Updating and deploying the site

1. **Start from the current `main` on GitHub.** Read the affected source at that revision. In a checkout, fetch `origin/main` first and preserve any unrelated work. When resuming a task, check whether the requested change has already landed. If it has, continue with the outstanding verification.
2. **Edit and check the source.** In a checkout, use Node 22 and run `npm ci`, then `npm run build && npm run check` for code changes. With a GitHub-only connector, use the same checks in Actions. A simple asset swap can also use CI for the full build and route checks. Exercise changed interactions in a browser and check visual changes on mobile and desktop. For a documentation-only edit, check the instructions and links against the files they describe.
3. **Commit approved changes to `main`.** Make a small, focused commit through GitHub or push it with Git. If `main` advances, incorporate the newer work, recheck the affected changes and push normally. Never force-push. If the tool requires a pull request, follow it through merge before reporting the change on `main`. Confirm the source commit on GitHub.
4. **Follow the “Check website” run for that commit.** After `verify` passes, the `publish` job builds and checks the site, then publishes the contents of `dist/` to `main-deploy`. GitHub Actions owns that branch. For changed output, look for the publication commit titled `Build P10X from <source SHA>`. Identical output, including a documentation-only update, can leave the branch at its previous commit. If a newer push supersedes the run, follow the newer run that contains the change. [Workflow](.github/workflows/check.yml)
5. **Verify production on the affected URL.** Plesk Git deploys the root of `main-deploy` to the existing site document root. For a site change, open the public page and check the requested behaviour. If it still serves the previous version, check the configured Plesk branch and deployed revision where access permits. Report the source commit, CI/publication result, and what you actually saw on the public site. If access is unavailable, identify the outstanding check. [Public site](https://p10x.flevor.me) · [Plesk setup](README.md#development-and-plesk-deployment)

## Routine page and media edits

Edit Insights articles in `src/content/insights/` using the publishing instructions in the README. Edit other page bodies in `src/fragments/`, route metadata and script order in `src/data/pages.json`, and shared markup in `components/`. Locate the named section and its asset references, including other uses when a shared replacement is requested. Read the matching source excerpts and only the project notes needed for that change. Use the broader reading order in the README for work spanning components.

- Inspect images as images and transfer media as files. Keep encoded media, complete HTML pages and successful build logs out of the conversation. Report the affected paths and any actionable error.
- For hero video changes, verify that the intended clip fills the section and its frames advance on mobile and desktop. Check tap-to-play when the page provides that fallback. Identify whether the check used emulation or a physical device.

## ChatGPT versus Codex: choose per task

The owner primarily works from iPhone/iPad and wants **one conversation, minimal handoffs, minimal duplicated planning and token usage**. ChatGPT with connected GitHub tools is the default for normal P10X development, including planning, content, targeted HTML/CSS/JS fixes and direct repository updates when supported.

Before starting a **complex** request, assess whether a full runnable coding environment would materially improve quality. If yes, **proactively suggest Codex for that particular task**, briefly explaining the specific reason (e.g. running builds/browser tests, multi-file refactoring, Three.js/GSAP debugging, difficult regressions or production-impacting changes). Do this **before** duplicating planning or editing documentation. Do not route every task to Codex merely because it involves code; the user decides whether to switch.

When Codex is recommended, provide **one concise ready-to-paste instruction** referencing the current repository files and acceptance checks. Avoid first updating Markdown solely to relay the same task, then making the user wait again in Codex. A separate Codex session is not automatically controlled from ChatGPT; be explicit about tool limits.

If the task is manageable here, do it here. Keep `CURRENT-TASKS.md` updated at meaningful milestones or handoffs, not for every tiny CSS/text adjustment. Maintain durable design/rules docs only when an enduring decision changes. This policy applies when a new chat starts and older conversations are unavailable.

If the current tool lacks write, CI or browser access, hand off the specific outstanding step with the branch, revision and files. A cloud environment Publish action saves the environment configuration. Repository updates and website releases follow the steps above.

## Hard constraints

- Preserve approved visual design, responsive behaviour, copy, media fidelity and interactions unless explicitly instructed otherwise.
- Do not downsize/recompress/convert images or video, or create alternate variants, without explicit approval.
- Use local media/fonts, existing icons and animations. Do not rely on another site's files.
- Edit source styles and build; never hand-edit `styles/generated/`.
- Keep changes scoped and reviewable. Avoid broad rewrites and duplicate event controllers.
- Check focus behaviour, image visibility and page overflow where relevant. Follow the PHP and driver-test checks in `.github/workflows/check.yml` when those files change.

At handoff, update [docs/CURRENT-TASKS.md](docs/CURRENT-TASKS.md) with changes, actual tests, unverified parts, commit and next step. Add a concise dated milestone to [docs/PROJECT-CHECKPOINT.md](docs/PROJECT-CHECKPOINT.md) for substantive changes.
