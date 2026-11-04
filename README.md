# P10X

Editable HTML, CSS and JavaScript migrated from the working public pages at https://p10xx.flevor.me/. No WordPress database or installation is needed to serve these pages.

Images, videos, fonts and the frontend theme libraries are **reused at their existing public URLs**. They are not downloaded into this repository. Keep those URLs available when changing hosting; removing the old WordPress files would break the assets that still live there.

## Develop

Node.js 20+; no npm installation or dependencies are needed.

```sh
npm run build
npm run check
npm run dev
```

| Content | Location |
| --- | --- |
| Homepage | `src/pages/index.html` |
| Other pages and articles | `src/pages/<route>/index.html` |
| Styles and scripts extracted from the working pages | `src/styles/`, `src/scripts/` |
| Shared standalone changes | `src/styles/site.css`, `src/scripts/site.js` |
| Contact handler | `public/contact.php` |
| Checked source pages | `docs/migrated-pages.json` |

The existing layout, animations and frontend libraries are retained. Only resources referenced by the working pages are used; no theme asset directory is copied. Images can be replaced by editing their URL in the page or stylesheet.

The news listing includes all 20 migrated articles. Its Load More control and article search run locally without the WordPress AJAX endpoint. FAQ filtering and the existing page interactions are retained.

## Hostinger / Plesk

Run `SITE_URL=https://your-domain.example npm run build`. Deploy the contents of `dist/` to a separate staging document root. Enable PHP 8.1+ for `contact.php` and working server mail. The enquiry recipient defaults to `info@p10x.my`; it can be set with the server environment variable `P10X_CONTACT_TO`.

Check desktop/mobile navigation, animations and actual enquiry receipt on staging before switching the domain. Node preview does not send mail. This repository does not change the live WordPress website, DNS or hosting configuration.

## Refreshing from the public site

`tools/import-origin.py` reads the 30 known working pages and extracts their inline styles/scripts. It downloads no media or theme libraries and never writes to WordPress. Rerunning it requires Python, BeautifulSoup and curl, and replaces imported page content; preserve custom edits before doing so. Regular editing requires only HTML, CSS and JavaScript.

Article wording and dates are copied from the source; this migration does not update their factual content. Existing theme/library licenses continue to apply.
