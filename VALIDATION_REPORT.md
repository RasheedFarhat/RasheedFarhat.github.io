# Portfolio Validation Report

Validation date: July 17, 2026 (compile-plate redesign)

## Scope

Full visual and technical redesign of all ten routes, the stylesheet, the
favicon, the social card, and the touch icon. The site remains a static,
build-free GitHub Pages deployment.

## Command results

### Repository validation

- `node scripts/validate-site.mjs`: passed for 10 HTML files and 13 required
  assets (now including the four self-hosted font files).
- `node --check script.js`: passed.
- `npx --yes html-validate@9.7.1` across all ten page routes: zero errors,
  zero warnings, using the recommended ruleset with only doctype-style and
  void-style disabled (Prettier-style output).
- Typographic dash scan across HTML, CSS, and JS: none found.
- Banned-copy scan (alias, "passionate", "innovative", "cutting edge",
  "world class", "robust", "future proof"): none found.
- Credential pattern scan (API keys, tokens, private keys): none found.

### Accessibility

- axe-core (via @axe-core/playwright, tags wcag2a, wcag2aa, wcag21aa,
  wcag22aa) on all 10 routes: 0 violations.
- An earlier run flagged the decorative 404 numeral at 1.81:1; it was raised
  to #566b70 (3.24:1, passes the large-text threshold) and re-verified.
- Keyboard walk on the homepage: skip link is the first tab stop, every stop
  shows a 2px copper outline, and no keyboard traps were found.
- Mobile menu verified in the browser: opens with focus moved to the first
  link, `aria-expanded` toggles, Escape closes and returns focus to the
  44px toggle button.
- Case-study disclosures open and close with Enter on the summary element.
- All palette text pairs measure between 5.75:1 and 15.99:1.
- Reduced-motion support collapses all transitions.

### Lighthouse (local, headless, simulated throttling)

- Performance 99, Accessibility 100, Best Practices 100, SEO 100.
- First Contentful Paint 1.4 s, Largest Contentful Paint 2.1 s, Total
  Blocking Time 0 ms, Cumulative Layout Shift 0, Speed Index 1.4 s.
- The single performance point is the display-font LCP under simulated
  throttling; fonts are preloaded and use `font-display: swap`.

### Responsive checks

- Rendered at 320, 390, 768, 1024, and 1440 px across all ten routes:
  zero horizontal overflow at every width (programmatic scrollWidth check).
- The compile plate collapses from a three-column source/transform/artifact
  layout to a stacked layout with a two-column stage grid.
- Case-study code figures scroll inside their own containers.

### Routes, links, and console

- All ten routes return HTTP 200 locally; an unknown route returns 404
  (GitHub Pages serves the custom 404 page in production, verified on the
  previous deployment).
- Browser crawl of all routes: no console errors, warnings, or failed
  requests other than the expected 404 for the unknown-route probe.
- All six GitHub link targets return HTTP 200.
- Both Medium articles were re-verified through a readable rendering:
  "Chromium-Based Browsers: An Analysis on Simple Cache" (Browser Forensics,
  August 6, 2024, 11 min) and "How I Turned My Mom's Infected Phone Into a
  Cybersecurity Lab" (September 8, 2025, 8 min). Medium and LinkedIn block
  raw command-line HTTP probes, as before.
- Every `target="_blank"` link carries `rel="noopener noreferrer"` and a
  screen-reader "(opens in a new tab)" note.

### Metadata

- Every page has one H1, one main landmark, a skip link, a unique title, and
  a unique meta description.
- Indexable pages carry canonical URLs, Open Graph, and Twitter card tags;
  the 404 page is noindex with no canonical.
- Person and WebSite schema on the homepage; SoftwareSourceCode schema on
  the three case studies.
- New 1200x630 social card and 180x180 touch icon rendered from the design
  system (sources in `scripts/`).
- Sitemap (lastmod 2026-07-17), robots.txt, and web manifest are current.

### Asset budget

- Homepage HTML 23,700 bytes raw / 5,549 gzipped.
- CSS 30,636 bytes raw / 5,654 gzipped.
- JavaScript 1,407 bytes raw / 527 gzipped.
- Fonts 112 KB total (four subset WOFF2 files, self-hosted).
- Social card PNG 57 KB. No other images.

## Known warnings and unverified items

- No manual screen-reader session was performed; axe-core cannot prove full
  WCAG conformance.
- Field performance was not measured from real visitors.
- Production deployment of this redesign has not happened yet; deployment
  checks in this report describe the local environment plus the prior
  deployment's 404 behavior.
