# SEO and delivery review — 13 November 2026

The supplied mobile PageSpeed report reports SEO 100, best practices 100, accessibility 96 and performance 83. A separate fresh mobile audit returned SEO 100, best practices 100, accessibility 96 and performance 84, with lab LCP 2.4s, CLS 0.004 and TBT 120ms. These are pre-change lab measurements; no post-deployment score is claimed. No CrUX field data was available.

Reference: https://pagespeed.web.dev/analysis/https-p10x-flevor-me/g8hhtalbj5?form_factor=mobile

## Changes

- Consolidate styles into three ordered, content-hashed bundles per page. The largest library is shared and cached across pages. Remove only selectors that require another page's invariant root/body class; retain interactive/pseudo states and the shared library. Keep declaration values, cascade order and licence notices. Original source stylesheets remain editable.
- Homepage CSS decreases from 1,884,814 source bytes to approximately 1,460,305 bytes. Local gzip comparison is approximately 225,864 bytes across the original files versus 181,519 bytes across the bundles. Actual host transfer sizes depend on compression settings.
- The two below-the-fold homepage films keep their original files and playback settings. Their URLs are attached when a film approaches the viewport or on the first interaction/scroll. The 26MB later film no longer starts downloading during an untouched hero visit.
- Preload the existing Inter fonts and supply missing HTML image dimensions from the original files. No image or video is resized, recompressed, converted or replaced.
- Correct homepage service-card accessible names, the product menu label and the shared footer test link label. Repair the homepage accessibility heading outline through roles/levels while retaining styled elements and visible copy.
- Add Organization/WebSite structured data based on the existing company name, logo and social links. Existing page titles, descriptions, canonicals, sitemap and robots remain.
- Include lossless text/font compression and cache directives for Apache. HTML/unversioned code revalidates; hashed CSS is immutable. Plesk/Nginx direct static delivery requires equivalent host settings; repository directives alone do not verify live headers.

## Validation and limits

Source and export checks cover all 32 routes, one primary heading per page, canonical URLs, anchors, local dependencies and JavaScript syntax. Styles were compared against the original page source at desktop width across all 32 routes, including component widths, padding, fonts, positioning and display. A separate mobile homepage comparison matched all 196 checked components. Initial image/font-loading differences settled to the same final layout. Product menu opening/closing and mobile Learn More/video activation were exercised.

Colours, contrast, animations, layouts and original media bytes are retained. The existing contrast warning is deliberately not addressed because that would alter the visual design. Large original media remains a payload limitation. PageSpeed's SEO score covers technical basics rather than keyword rankings or a guarantee of search placement. Re-measure after deploying the new source/build and confirming the host's compression/cache headers.
