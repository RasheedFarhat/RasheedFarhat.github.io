# Portfolio Validation Report

Validation date: July 18, 2026 (Clear Signal theme release)

## August 14, 2026 addendum: The Resolution Desk (signature interaction)

This addendum covers a single new signature interaction added to `/support/`,
between the page hero and the existing proof section: an interactive
resolution-workflow visualization called "The Resolution Desk." It ships as
two new files, `support/resolution-desk.css` (480 lines, 10,130 bytes) and
`support/resolution-desk.js` (566 lines, 25,604 bytes), both scoped
exclusively to the support lane, plus a new section inserted into
`support/index.html` (now 662 lines, 32,258 bytes) and two new lines in
`scripts/validate-site.mjs`'s `requiredAssets` list. No other file was
created, modified, or deleted.

### Scope confirmation (security portfolio unaltered)

- `git diff --stat` against the working tree, excluding the four files named
  above, returns empty: no security-portfolio route, no shared component
  outside the support lane, and no other asset was touched.
- A Playwright regression pass rendered all 13 security-portfolio routes
  (`/`, `/projects/`, all 4 project detail pages, `/writing/`, all 3 article
  pages, `/about/`, `/resume/`, `/contact/`) at 1440px in both themes, 26
  page loads total, with zero console errors and zero `pageerror` events.
  Full-page screenshots were captured for all 26 and spot-checked visually;
  rendering is identical to the pre-existing Clear Signal design.

### Content model

- One structured data object in `resolution-desk.js` (`TICKETS`) drives all
  four scenarios; adding a fifth ticket requires only a new entry, no markup
  or logic changes.
- Four representative example tickets, each explicitly labeled as such in
  the on-page disclosure text: account lockout / sign-in failure, unstable
  remote-access / VPN connection, slow or unreliable workstation, and
  suspicious authentication activity.
- Six primary stations (Intake, Triage, Investigation, Resolution,
  Verification, Documentation) plus two secondary stations (Knowledge Base,
  Escalation Desk), for 8 stations x 4 tickets = 32 authored evidence-panel
  states, each with distinct copy.
- All six required evidence categories from the brief (what he would
  clarify, what he would check, the troubleshooting logic, what gets
  documented, when escalation applies, how resolution is verified) appear
  across each ticket's full path; each individual station surfaces exactly
  2 of the 6 categories (3 for Escalation Desk) to keep panels concise
  rather than repeating all 6 at every stop.
- The "suspicious authentication activity" ticket is deliberately framed as
  standard support-desk judgment, contain and hand off, not as
  security-analyst work: its Escalation Desk panel states plainly that "his
  role ends at containment and a clean handoff" and that the security review
  belongs to the team that owns it.
- No named commercial ITSM, SIEM, IAM, or endpoint-management platform
  appears anywhere in the component's copy, consistent with the workspace
  truthfulness rules.

### Truthfulness and markup checks

- Zero em dash or en dash characters in either new file or the modified
  section of `support/index.html` (checked by direct grep, not just the
  sitewide validator).
- Zero `style="` attributes anywhere in the new markup, including every new
  inline `<svg>` element (route lines, station icons, the traveling marker).
- `node --check support/resolution-desk.js`: passed.
- `node scripts/validate-site.mjs`: passed for 16 HTML files and 25 required
  assets (up from 23; the two new files were added to `requiredAssets`).
- `npx html-validate@9.7.1 support/index.html support/casework/index.html`:
  zero errors, exit code 0.
- `git diff --check`: passed, no whitespace errors.

### Accessibility

- axe-core 4.13.0, injected via Playwright (`colorScheme: "dark"` and
  `colorScheme: "light"`, WCAG 2.0/2.1 A and AA rule sets), scoped to
  `[data-resolution-desk]` with the "suspicious authentication activity"
  ticket and the Escalation Desk station selected (the deepest interaction
  state): 0 violations in either theme.
- The same scan run unscoped, against the full `/support/` page in both
  themes: 1 violation total (color-contrast, `light` theme only), and it
  belongs to the pre-existing `.case-desk__stage-label` element from the
  page's hero case-file figure, not to any element introduced by this
  addendum. Left as-is and flagged separately; fixing a pre-existing,
  out-of-scope component was not part of this brief.
- Keyboard-only walk (Tab key, no mouse): every one of the 4 ticket chips
  and all 8 stations receives focus in document order and is independently
  operable; the evidence panel updates via the `focus` event, not only
  `click`. Confirmed the walk reaches the final "documentation" station with
  `aria-pressed="true"` set correctly.
- Hover, focus-visible, and selected states share one CSS rule
  (`.station:hover, .station:focus-visible, .station.is-selected`, and the
  same pattern for `.ticket-chip`), so they are visually identical by
  construction, not just by manual matching.
- `prefers-reduced-motion: reduce`: verified via a Playwright context with
  `reducedMotion: "reduce"`. Selecting a ticket shows the correct final
  panel content ("Intake") immediately, with zero animation-related
  JavaScript run (the `resolution-desk.js` traversal preview checks
  `window.matchMedia("(prefers-reduced-motion: reduce)")` and returns before
  scheduling any `requestAnimationFrame` or `setTimeout` call). The global
  CSS `prefers-reduced-motion` rule in `styles.css` independently zeroes the
  marker's CSS `transition` and every hover/focus/selected transition.
- No audio anywhere in the component; nothing autoplays.

### Interaction correctness

- A Playwright sweep clicked all 4 ticket chips and all 8 stations for the
  selected ticket, and verified `aria-pressed` state, evidence-panel title,
  eyebrow text, and evidence-field count after each: 2 fields for every
  primary station and Knowledge Base, 3 for Escalation Desk, matching the
  data model. Zero console errors or warnings across the full sweep.
- A layout bug found during visual review was fixed before this validation
  pass: the secondary station block (`.resolution-desk__secondary`) was
  originally nested inside the same absolutely-positioned `.stage` element
  as the two route-map SVGs, which inflated the stage's rendered height
  beyond the primary station row's height and threw the SVG route line and
  marker out of vertical alignment with the station buttons. Moving the
  secondary block to be a sibling of `.resolution-desk__stage` (still inside
  `.resolution-desk__floor`) fixed it; re-verified visually at 375, 768, and
  1440px in both themes after the fix.
- Visually reviewed element-scoped screenshots at 375px, 768px (the exact
  `48rem` desktop-switch boundary), and 1440px, in both dark and light
  themes, plus the "authentication ticket / Escalation Desk selected" state
  at 1440px in both themes, 8 screenshots total. Confirmed: the fixed
  `--rd-*` tokens keep the scene dark-graphite-and-amber regardless of the
  site's light/dark toggle; the mobile layout reads as a clean vertical
  path with the numbered stations connected by a spine line; the 768px
  boundary renders cleanly with no layout glitch; and the Escalation Desk
  selection correctly moves the marker to its schematic node and renders
  its 3-field panel.

### Known limitations

- A manual screen-reader session was not performed on this component.
- The two secondary-station SVG connector lines are schematic (they run a
  short distance to a small node marker, not literally to the Knowledge
  Base / Escalation Desk cards), a deliberate simplification rather than an
  oversight.
- The traveling marker's path is computed by linear interpolation between
  hardcoded coordinates, not `SVGGeometryElement.getPointAtLength()`; this
  is sufficient because the primary route is a straight line, and was a
  deliberate choice to avoid unnecessary complexity.

## August 14, 2026 addendum: support-lane rebuild (Resolution Desk)

This addendum covers the full rebuild of the IT/technical support lane: a
redesigned `/support/` landing page, a new `/support/casework/` route
documenting three support cases plus a synthetic workflow lab, a scoped
"Resolution Desk" sub-theme in `styles.css`, a support-lane social card, and a
re-rendered support resume PDF with the corrected phone number.

### Content and evidence

- All three casework cases use real, source-anchored evidence: the published
  Android investigation article on Medium, the DaC-Pipeline silent-API-write
  behavior verified against `THREAT_MODEL.md` and `tests/test_deploy_rule.py`,
  and the Zero-Trust Deception Fabric self-hosted access stack issues from its
  README. Each case cites its source inline.
- The workflow lab is explicitly labeled "Synthetic workflow lab, not a
  production ITSM deployment" and names Control Plane as a synthetic modeling
  exercise, not commercial ITSM platform experience.
- Zero em dashes and zero colon-as-explanation constructions across both new
  routes.
- No fabricated quotes, testimonials, metrics, named commercial ITSM
  platforms, managers, or customers appear on either route.
- The unsafe Authentik screenshot
  (`Zero-Trust-Deception-Fabric/assets/authentik-css-injection.jpg`, which
  contains a live Canarytokens URL) was not used, cropped, or referenced
  anywhere in the rebuild.
- The support resume PDF (`assets/rasheed-farhat-resume-support.pdf`) was
  re-rendered from `resume-system/support-resume.html` and verified to
  contain the current phone number `507-460-5070` and not the stale
  `530-370-5109`.

### Markup and accessibility

- Site validator: passed for 16 HTML files and 23 required assets.
- HTML Validate 9.7.1: zero reported errors or warnings across every public
  route including both new support routes, exit code 0.
- `node --check` passed for `script.js`, `theme-init.js`, and
  `scripts/validate-site.mjs`.
- `git diff --check`: passed, no whitespace errors.
- axe-core 4.13.0 (CLI, default light theme): 0 violations on `/support/` and
  `/support/casework/`.
- axe-core 4.13.0 (injected via Playwright with `colorScheme: "dark"` and
  `data-theme="dark"` forced, WCAG 2.0/2.1 A and AA rule sets): 0 violations
  on both routes. This closes the dark-mode accessibility gap left open by
  earlier CLI-only runs, which do not support forced color-scheme emulation.
- A dependency-free Playwright sweep covered both routes across both themes
  at five widths (320, 390, 768, 1024, 1440px), 20 combinations total: zero
  console errors or warnings, zero `pageerror` events, and zero horizontal
  overflow (`scrollWidth > clientWidth`) at any combination.
- Mobile menu (375px viewport) verified on both routes: the toggle measures
  exactly 44x44px, `aria-expanded` flips from `false` to `true` on a
  keyboard `Enter` press against the focused toggle (no mouse interaction
  used), and a visible focus ring lands on the first menu link after
  opening. Primary nav links measure 335x52px and the theme toggle measures
  77x44px, all at or above the 44x44px minimum. The breadcrumb link
  ("Support" at the top of the casework page) measures smaller than 44x44px,
  but this is a pre-existing sitewide pattern shared with six other
  project/writing routes, not a regression introduced by this rebuild.
- Every internal fragment link on the casework page (`#case-1`, `#case-2`,
  `#case-3`, `#workflow-lab`) resolves to a real element ID on the same page,
  checked by the site validator's fragment-target rule.
- All `target="_blank"` links on both new routes carry
  `rel="noopener noreferrer"`.

### Visual review

- 20 full-page screenshots (2 routes x 2 themes x 5 widths) plus 2 mobile
  menu-open captures were generated with Playwright against a local
  `python3 -m http.server 8000` instance and reviewed via cropped
  close-up inspection (PyObjC Quartz) at 320px and 1440px in both themes,
  plus spot checks at 390px and 768px.
- Confirmed clean, on-design rendering with no defects for: the `.brand--support`
  header lockup at 320px, the hero and case-desk on `/support/`, the
  `.comms-sample` component, the `.case-file` 11-field anatomy in both
  1-column (mobile) and 2-column (`min-width: 40rem`) layouts, the
  amber-keyed Boundary field, the `.stage-list` workflow lab (8 stages), the
  sticky case-sidebar with on-page navigation and tag list, the minimal
  support footer, the light-theme "technical paper" palette, and the
  contact panel.
- Confirmed the `.case-file__fields dt` amber coloring on every field label
  (not just Boundary) is expected behavior: the support sub-theme repoints
  `--sig` and `--amb` to the same amber value, so `dt { color: var(--sig) }`
  reads amber sitewide on this page by design. The Boundary field's
  `--amb-hi` is a deliberately subtle, not categorical, distinction.
- No regressions found anywhere else on the site: full-site `html-validate`
  and `validate-site.mjs` both pass with the new routes and assets included.

### Assets and budget

- `support/index.html`: 21,280 bytes
- `support/casework/index.html`: 22,893 bytes (429 lines)
- `styles.css`: 3,855 lines total after the Resolution Desk sub-theme and
  `.case-file` component additions
- `assets/support-social-card.png`: 48,393 bytes, exactly 1200x630
- `assets/rasheed-farhat-resume-support.pdf`: 117,101 bytes, 1 page,
  confirmed correct phone number

### Known limitations

- A manual screen-reader session was not performed on either new route.
- Lighthouse was not re-run for this addendum; the shared-theme Lighthouse
  baseline below predates the support-lane rebuild and is not a claim about
  the new routes specifically.
- macOS TCC permissions blocked direct filesystem reads of
  `~/Desktop/Coding Projects/` and `~/Documents/` during evidence gathering
  for this rebuild; the Zero-Trust Deception Fabric and Control Plane
  material used was drawn from prior-session research already captured in
  `CLAUDE.md` rather than a fresh read in this session.
- The Control Plane project page's web case explorer (`lab/api.py`, port
  18081) was not screenshotted or linked from the support lane; the
  workflow lab describes the modeled chain in prose and the `.stage-list`
  component only.

## August 3, 2026 addendum: Inside MCP Detect series

This addendum covers the three new longform article routes, the updated MCP
project page and writing index, and six social preview assets.

### Content and evidence

- All three articles pass the zero-em-dash, forbidden-phrase, AI-default
  vocabulary, unsupported-placeholder, synthetic-label, command, and
  commercial-history checks in `scripts/validate-site.mjs`.
- Rendered article-body text falls within the requested ranges: 2,301 words for
  part one, 2,703 for part two, and 2,202 for part three at the final content
  audit.
- `make measure` and `make measure-full` reproduce the published sample and
  complete-corpus results, including 0 alerts across 4,727 project-authored
  benign records.
- The synthetic authorization reference passes all four focused tests. The
  vulnerable cross-tenant control succeeds, the fixed cross-tenant path is
  denied, same-tenant access succeeds, and the fixed schema removes
  caller-controlled tenant selection.
- `examples/reference-mcp-review/verify_manifest.py` passes for all four pinned
  source and test artifacts.
- All 24 unique external evidence links used by the articles returned HTTP 200.

### Markup and accessibility

- Site validator: passed for 13 HTML files and 21 required assets.
- HTML Validate 9.7.1: zero reported errors or warnings across every public
  route.
- JavaScript syntax and Git whitespace checks: passed.
- Browser DOM inspection confirmed one H1, named landmarks, useful figure
  labels, article publication metadata, and readable source ordering.
- Mobile navigation at 390px moves focus to the first link, updates
  `aria-expanded`, closes on Escape, and returns focus to the trigger.
- Every horizontally scrollable code block, trace, and coverage table in the
  series is keyboard focusable.
- No page-level horizontal overflow appeared at 390px or at the 640px
  reflow-equivalent check.
- New article token contrast ranges from 5.45:1 to 12.76:1 in light mode and
  6.27:1 to 15.99:1 in dark mode.
- Automated axe-core and Lighthouse runs were not repeated for the new routes.
  The earlier shared-theme results below remain a baseline, not a claim about
  the new pages. A manual screen-reader session was not performed.

### Visual assets

- Three portfolio and Medium previews render at exactly 1200x630.
- Three LinkedIn covers render at exactly 1920x1080.
- The previews were visually checked for title cropping, evidence-strip
  visibility, author credit, and the identity-to-handler-to-resource trace.
- Desktop, dark-theme, mobile, light-theme, and synthetic-label views were
  inspected in the browser.

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
