# Portfolio Implementation Report

Date: July 17, 2026

## Outcome

The portfolio was visually and editorially reinvented around a single design
concept, "The Compile Plate": the site reads as a controlled engineering
document, and its signature element is a homepage exhibit showing a real
detection rule from the Detection-as-Code pipeline as authored Sigma source
beside the exact Wazuh PCRE2 XML it compiles to, annotated with the four
transform stages. The excerpt is verifiable against the public repository.

The site remains a dependency-free static deployment: semantic HTML, one
stylesheet, one small script, no build step, no trackers.

## Identity

- Palette: petroleum ink and gunmetal surfaces with a single oxidized-copper
  accent family. All text pairs pass WCAG AA with margin.
- Type: Big Shoulders (condensed industrial display), Public Sans (body),
  IBM Plex Mono (code, labels, metadata). Self-hosted variable WOFF2 subsets.
- Devices: hairline section rules with copper ticks, drafting-style eyebrow
  labels, claim/evidence/boundary assessment strips, pipeline stage
  schematics, scope notes, native-details disclosures, and a title-block
  footer modeled on an engineering drawing.

## Structural changes

- Rewrote every route with condensed copy. Case studies dropped roughly a
  third of their word count; deep detail moved into expandable disclosures.
- Homepage restructured: status line, display-scale name, positioning
  statement, compile-plate exhibit, three project rows with evidence
  columns, dated record list, four capability groups, two writing entries,
  and a short contact panel.
- Project rows replaced numbered cards; markers now carry real information
  (status and years) instead of sequence decoration.
- The technical alias was removed site-wide.
- Writing index carries verified publication dates for both Medium articles.
- New favicon, social card, and touch icon expressing the compile motif
  (source lines, transform chevron, artifact block).

## Files

- Rewritten: `styles.css`, `index.html`, all nine interior routes,
  `favicon.svg`, `site.webmanifest`, `README.md`, `DESIGN_SYSTEM.md`,
  `VALIDATION_REPORT.md`.
- Added: `assets/fonts/` (four WOFF2 subsets),
  `scripts/social-card-source.html`, `scripts/apple-touch-icon-source.html`.
- Regenerated: `assets/social-card.png`, `assets/apple-touch-icon.png`.
- Removed: `assets/social-card.svg` (replaced by the HTML source).
- Unchanged: `script.js`, `robots.txt`, `sitemap.xml` (lastmod already
  current), the resume PDF, and `.htmlvalidate.json`.
- `scripts/validate-site.mjs` now requires the font files and skips the
  non-page asset sources in `scripts/`.

## Validation

See `VALIDATION_REPORT.md` for the full command-level record: repository
validator, html-validate, axe-core (0 violations on all routes), Lighthouse
99/100/100/100, five-width overflow checks, keyboard and mobile-menu
verification, link checks, and content scans.
