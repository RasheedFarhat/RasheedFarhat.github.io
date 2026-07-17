# Portfolio Validation Report

Validation date: July 17, 2026 (Clear Signal redesign)

## Commands run

- `node scripts/validate-site.mjs`
- `node --check script.js`
- `npx --yes html-validate@9.7.1` across all ten public HTML files
- `npx --yes @axe-core/cli` across all ten local routes
- `npx --yes lighthouse http://127.0.0.1:8000/` with headless Chrome
- `git diff --check`
- WCAG contrast calculations for the shared text and surface tokens
- HTTP checks for the eight unique external destinations

## Results

### Repository and markup

- Site validator: passed for 10 HTML files and 14 required assets.
- JavaScript syntax: passed.
- HTML validation: zero reported errors or warnings.
- Git whitespace validation: passed.

### Accessibility

- axe-core 4.12.1: zero violations on all ten routes.
- Lighthouse accessibility: 100.
- Shared normal-text contrast ratios range from 5.05:1 to 13.76:1 on their
  assigned backgrounds.
- Primary button text measures 5.80:1 against the signal-teal fill.
- Mobile menu verified at 390px: 44x44px control, focus moves to the first link,
  `aria-expanded` updates, Escape closes the menu, and focus returns to the
  toggle.
- Reduced-motion support remains active.

Automated checks do not prove complete WCAG conformance. A manual screen-reader
session was not performed.

### Responsive and route checks

- Browser-rendered all ten routes at 1280px and 390px.
- Every route had exactly one H1 and one main landmark.
- No horizontal overflow was found on any tested route.
- No browser console errors or warnings were recorded.
- The mobile compiler figure was visually inspected after removing its default
  figure margin.
- A separate 320px capture could not be produced because the in-app browser
  clamped that override to 390px. The 320px layout was reviewed from the same
  fluid CSS rules, but it is not claimed as browser-verified.

### Lighthouse

- Performance: 99
- Accessibility: 100
- Best Practices: 100
- SEO: 100
- Agentic Browsing: 100
- First Contentful Paint: 1.4s
- Largest Contentful Paint: 2.1s
- Total Blocking Time: 0ms
- Cumulative Layout Shift: 0
- Speed Index: 1.4s

### Assets and budget

- Homepage HTML: 18,716 bytes
- CSS: 38,364 bytes
- JavaScript: 1,407 bytes
- Fonts: 105,104 bytes total, self-hosted WOFF2
- Social card: 250,503 bytes
- Touch icon: 13,591 bytes

### External links

- All four GitHub destinations returned HTTP 200.
- Medium returned HTTP 403 to the command-line user agent for the profile and
  both article links. The links are syntactically valid and were preserved.
- LinkedIn returned its automated-request status 999. The profile URL is
  syntactically valid and was preserved.

## Known limitations

- Production deployment was not performed during this redesign.
- Field performance and real-user accessibility were not measured.
- Medium and LinkedIn could not be content-verified from the command line
  because those services blocked the automated requests.
