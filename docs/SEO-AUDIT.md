# Homepage first visit — 22 November 2026

The [mobile](https://pagespeed.web.dev/analysis/https-p10x-flevor-me/7u6ces8kpd?form_factor=mobile) and [desktop](https://pagespeed.web.dev/analysis/https-p10x-flevor-me/7u6ces8kpd?form_factor=desktop) saved reports scored performance 89 and 95, accessibility 97 and 97, best practices 96 and 96, and SEO 100 and 100. Lighthouse estimated 800 ms of mobile render blocking. The mobile LCP element was the hero description.

- Across the three homepage CSS bundles, uncompressed code drops from 1,348,290 to approximately 534,000 bytes. Gzip drops from approximately 168,000 to 73,500 bytes. Publication still uses content-hashed stylesheets.
- The Five Pillars backdrop, lower photographic backgrounds and the two films now load as their sections approach. The same responsive photographs, focal points and original video files are used. Backgrounds remain available without JavaScript.
- Gyeon and KCX keep their original dimensions, resolution metadata and decoded RGBA values. The two optimized PNGs total 6,903 bytes, down from 14,264 bytes. The original files are retained. Three Archivo weights are served in WOFF2 with their glyph and layout tables preserved.
- The public PageSpeed links above refer to the previous deployment. Run new mobile and desktop measurements after Plesk serves the published commit. Animation, hardware and network conditions influence the performance score.

# Homepage PageSpeed review — 20 November 2026

The supplied [mobile report](https://pagespeed.web.dev/analysis/https-p10x-flevor-me/128gndut86?form_factor=mobile) and [desktop report](https://pagespeed.web.dev/analysis/https-p10x-flevor-me/128gndut86?form_factor=desktop) measured the homepage before this change. The report contained no CrUX field data.

| Lab metric | Mobile | Desktop |
| --- | ---: | ---: |
| SEO | 100 | 100 |
| Performance | 86 | 62 |
| Accessibility | 97 | 94 |
| Best practices | 100 | 100 |
| Largest contentful paint | 2.2 s | 0.6 s |
| Total blocking time | 90 ms | 880 ms |

The homepage now uses the existing variable Inter WOFF2 for its hero. This removes two TTF requests totaling 650,694 transferred bytes in each audit. The build excludes rules that require absent shop classes, keeping pseudo-class branches and other shared styles. Homepage CSS across three bundles fell from 1,460,305 to 1,325,629 bytes, or from 181,589 to 167,625 bytes in a local gzip comparison.

The globe skips shell lighting calculations for logo particles. The Mission field allocates its particle grid on approach and limits decorative redraws. The logo link has a name, and decorative arrow replacement preserves existing link text. Thirty pages now have individual search descriptions. The Training and Driver Personality Test pages already had their own. No image assets or image markup changed.

The counts above describe source and build output. Measure both devices again after deployment for updated Lighthouse scores.

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
