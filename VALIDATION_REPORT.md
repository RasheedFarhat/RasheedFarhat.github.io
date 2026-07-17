# Portfolio Validation Report

Validation date: July 18, 2026 (Clear Signal theme release)

## Commands run

- `node scripts/validate-site.mjs`
- `node --check script.js` and `node --check theme-init.js`
- `npx --yes html-validate@9.7.1` across all ten public HTML files
- `npx --yes @axe-core/cli` across all ten local routes in light and dark mode
- `npx --yes lighthouse http://127.0.0.1:8000/` in light and dark mode
- `git diff --check`
- WCAG contrast calculations for the shared text and surface tokens
- HTTP checks for the eight unique external destinations

## Results

### Repository and markup

- Site validator: passed for 10 HTML files and 15 required assets.
- JavaScript syntax: passed.
- HTML validation: zero reported errors or warnings.
- Git whitespace validation: passed.

### Accessibility

- axe-core 4.12.1: zero violations on all ten routes in both themes.
- Lighthouse accessibility: 100 in both themes.
- Shared normal-text contrast ratios range from 4.85:1 to 12.76:1 in light mode
  and 6.16:1 to 15.99:1 in dark mode on their assigned backgrounds.
- Primary button text measures 6.62:1 in light mode and 6.16:1 in dark mode.
- Mobile menu verified at 390px: 44x44px control, focus moves to the first link,
  `aria-expanded` updates, Escape closes the menu, and focus returns to the
  toggle.
- Reduced-motion support remains active.
- Theme control verified with an action-specific accessible name,
  `aria-pressed`, updated browser theme color, persisted choice, and system
  preference fallback.

Automated checks do not prove complete WCAG conformance. A manual screen-reader
session was not performed.

### Responsive and route checks

- Browser-rendered all ten routes at 1280px and 390px.
- Every route had exactly one H1 and one main landmark.
- No horizontal overflow was found on any tested route.
- Open mobile navigation is constrained to the 390px viewport and its theme
  control provides a 44px touch target.
- No browser console errors or warnings were recorded.
- The mobile compiler figure was visually inspected after removing its default
  figure margin.
- A separate 320px capture could not be produced because the in-app browser
  clamped that override to 390px. The 320px layout was reviewed from the same
  fluid CSS rules, but it is not claimed as browser-verified.

### Lighthouse

| Result | Light | Dark |
| --- | ---: | ---: |
| Performance | 98 | 99 |
| Accessibility | 100 | 100 |
| Best Practices | 100 | 100 |
| SEO | 100 | 100 |
| Agentic Browsing | 100 | 100 |
| First Contentful Paint | 1.4s | 1.5s |
| Largest Contentful Paint | 2.1s | 2.1s |
| Total Blocking Time | 0ms | 0ms |
| Cumulative Layout Shift | 0 | 0 |
| Speed Index | 3.1s | 1.5s |

### Assets and budget

- Homepage HTML: 19,101 bytes
- CSS: 40,246 bytes
- Deferred JavaScript: 2,993 bytes
- Pre-paint theme initialization: 589 bytes
- Fonts: 105,104 bytes total, self-hosted WOFF2
- Social card: 50,501 bytes
- Touch icon: 11,632 bytes

### External links

- All four GitHub destinations returned HTTP 200.
- Medium returned HTTP 403 to the command-line user agent for the profile and
  both article links. The links are syntactically valid and were preserved.
- LinkedIn returned its automated-request status 999. The profile URL is
  syntactically valid and was preserved.

## Known limitations

- Field performance and real-user accessibility were not measured.
- Medium and LinkedIn could not be content-verified from the command line
  because those services blocked the automated requests.
