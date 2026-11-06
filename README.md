# P10X

Company website for P10X. Plain HTML, CSS and JavaScript, with local media and fonts.

## Work locally

Node.js 20 or later. No package installation is needed.

```sh
npm run dev
npm run check
npm run build
```

The optional build copies the website and assets to `dist/`. The repository root can also be served directly. The enquiry handler requires PHP and a working server mail transport; set `P10X_CONTACT_TO` to change its recipient.

## Edit

| Area | Files |
| --- | --- |
| Homepage | `index.html` |
| Layout and responsive styles | `styles/site.css` |
| Globe presentation | `styles/hero.css`, `scripts/motion-hero.js` |
| Ten values and title animation | `scripts/hero-values.js` |
| Expert Match | `styles/expert.css`, `scripts/expert.js` |
| Navigation, scrolling sections and form | `scripts/site.js` |
| Car Care globe | `scripts/purpose-globe.js` |
| Images, video and fonts | `assets/` |

Keep one original file per image during development. Compression and responsive exports are reserved for the final media pass. Keep font licence notices with their files.

This branch is a homepage review milestone. See `docs/PROJECT-CHECKPOINT.md` for completed work and the remaining pages. It is not the production branch.
