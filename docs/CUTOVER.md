# Plesk deployment to p10x.flevor.me

The checked-in repository root is directly deployable. No build is required.

1. In Plesk Git, pull `main` and deploy into the document root configured for `p10x.flevor.me`.
2. Confirm `index.html` is directly inside that folder, beside `styles/`, `scripts/`, `contact.php`, and page folders such as `about-us/`.
3. Open the homepage and a service page. Enable PHP 8.1+ and verify actual contact enquiry delivery using the host's mail transport.

If the homepage still shows 403, compare the Plesk Git deployment path with the domain's Hosting Settings document root. They must identify the same folder containing `index.html`. This repository does not modify those server settings.

## Assets stay at the existing origin

Images, video, fonts and frontend libraries continue to load from `https://p10xx.flevor.me/`. Keep its referenced `/wp-content/` and `/wp-includes/` assets available. The new domain's Git deployment does not require moving or deleting the old WordPress installation.

## Optional export

For a separate packaged output, run `npm run build` and deploy the contents of `dist/`. That alternative is not needed for the normal Git deployment above.
