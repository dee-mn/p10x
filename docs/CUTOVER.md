# Hosting cutover

1. Build with `SITE_URL=https://your-domain.example npm run build` using Node 20+.
2. Deploy `dist/` to a separate staging document root in Plesk; enable PHP 8.1+.
3. Keep the referenced images, videos, fonts, CSS and JavaScript available at `https://p10xx.flevor.me/`. No media directory is included in this repository. Do not remove or overwrite the files at that origin during cutover.
4. Verify navigation, homepage animations, service pages, FAQ, news, mobile layout and real contact enquiry delivery. The contact handler requires server mail; local checks cannot verify inbox receipt.
5. Switch the live document root only after staging review. Retain the original directory for rollback and asset hosting.

If the target domain is `p10xx.flevor.me` itself, a new document root must continue serving the old `/wp-content/` and `/wp-includes/` asset URLs, for example through retained directories or web-server aliases. Otherwise leave the hardcoded site on staging until the necessary assets have been placed at stable URLs.
