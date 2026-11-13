# P10X

Company website for P10X. Static HTML, CSS and JavaScript with local photographs, video, fonts and animation libraries.

## Development

Node.js 20 or later. Install the locked build dependencies once with `npm ci`.

```sh
npm run dev
npm run check
npm run build
```

The build writes the complete site to `dist/`. The repository root can also be served directly. Enquiries and article comments use PHP with server mail; set `P10X_CONTACT_TO` to change the recipient. Comments are emailed for review.

## Editing

| Area | Files |
| --- | --- |
| Homepage and other pages | `index.html`, `<route>/index.html` |
| Shared navigation and footer | `components/` |
| Typography and original media display sizes | `styles/foundation.css` |
| Page layouts and responsive rules | Stylesheets listed in each page's `<head>` |
| Shared controls and forms | `scripts/native.js` |
| Section interactions | `scripts/sections/` |
| Homepage globe | `styles/hero.css`, `scripts/motion-hero.js`, `scripts/hero-values.js` |
| Original media and fonts | `assets/` |
| Route and article index | `docs/routes.json`, `docs/article-index.json` |

The navigation and footer templates are applied before development and export. Keep image files in their original format, dimensions and quality. Display crops belong in CSS. Keep third-party licence notices with their files.

## Delivery

The build generates versioned CSS bundles, sharing the largest library between pages, retaining the original source rules and their order. Edit the source CSS files listed in `docs/style-manifest.json`, then run `npm run build`; generated files should not be edited by hand. New stylesheet links are incorporated on the next build. Original media dimensions and file quality are preserved; `docs/image-dimensions.json` supplies missing HTML size attributes.

The repository root and `dist/` both contain the optimised pages. Hashed CSS may be cached immutably; HTML and unversioned scripts must revalidate. Apache compression/cache directives are included in `.htaccess`. If Plesk/Nginx serves static files directly, equivalent headers and text compression must be enabled in the host configuration.
