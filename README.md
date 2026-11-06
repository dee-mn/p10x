# P10X

Company website for P10X: services, company information, news and enquiries.

## Development

Requires Node.js 20 or later. No packages need to be installed.

```sh
npm run dev
npm run check
```

Pages are plain HTML. Shared styles and scripts are in `styles/` and `scripts/`; images, fonts, video and vendor libraries are in `assets/`.

| File | Purpose |
| --- | --- |
| `index.html` | Homepage |
| `<route>/index.html` | Pages and articles |
| `scripts/motion-hero.js` | Globe rendering and mobile scroll controls |
| `scripts/hero-values.js` | Interactive values and title animation |
| `styles/motion-hero.css` | Homepage hero styling |
| `contact.php` | Enquiry delivery |
| `docs/pages.json` | Page routes and titles |

## Deployment

Deploy the repository root to the domain's document root. It must contain `index.html`, `assets/`, `styles/`, `scripts/`, `contact.php` and the page folders.

For Plesk Git, pull `main` and deploy. Enable PHP 8.1 or later and configure the host's mail transport. Enquiries go to `info@p10x.my`; set `P10X_CONTACT_TO` on the server to use a different inbox. Test delivery after deployment.

`npm run build` exports the site to `dist/` when a separate deployment folder is needed. Set `SITE_URL` when building for another domain.

## Checks

`npm run check` validates page routes, asset references and JavaScript syntax. It also checks that website assets load locally. The same checks run in GitHub Actions, along with the export and PHP syntax check.

Keep vendor copyright and licence notices with their files.
