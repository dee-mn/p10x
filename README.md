# P10X

Ready-to-deploy HTML, CSS and JavaScript for **https://p10x.flevor.me/**. The repository root is the website root. No build step, Node server or WordPress installation is needed on hosting.

## Deploy with Plesk Git

1. Pull `main` and click **Deploy** into the domain's document root.
2. The deployment folder must directly contain `index.html`, `styles/`, `scripts/` and the page folders.
3. Serve that same folder in Plesk Hosting Settings. Do not point the document root at `src/`, `public/` or `dist/`.
4. Enable PHP 8.1+ for `contact.php`, configure server mail, and verify a real enquiry reaches the inbox.

The pages reuse images, videos, fonts and frontend theme libraries at **https://p10xx.flevor.me/**. Keep that asset origin available. No media or theme directory is copied into this repository.

## Edit

| Content | Location |
| --- | --- |
| Homepage | `index.html` |
| Other pages and articles | `<route>/index.html` |
| Page styles and scripts | `styles/`, `scripts/` |
| Shared standalone changes | `styles/site.css`, `scripts/site.js` |
| Contact handler | `contact.php` |
| Search metadata | `robots.txt`, `sitemap.xml` |
| Migrated source pages | `docs/migrated-pages.json` |

There are 30 migrated pages, including 20 articles. The established design, animations, FAQ filtering and page interactions are retained. News Load More and article search run locally without WordPress AJAX.

## Optional local preview and checks

Node.js 20+; no dependencies or installation step.

```sh
npm run check
npm run dev
```

`npm run build` is an optional export to `dist/`; Plesk Git deployment does not need it. Set `SITE_URL` for a different canonical domain when exporting. Local preview does not send email; hosting must provide PHP and working mail. The enquiry recipient defaults to `info@p10x.my`, configurable through the server variable `P10X_CONTACT_TO`.

## Refreshing from WordPress

`tools/import-origin.py` reads the 30 known public pages at the asset origin and replaces the imported HTML and extracted styles/scripts. It downloads no media or theme libraries and never writes to WordPress. Rerunning requires Python, BeautifulSoup and curl; preserve custom edits first. Normal editing requires only HTML, CSS and JavaScript.

Article wording and dates are retained from the source; this migration does not update their factual content. Existing theme/library licenses continue to apply.
