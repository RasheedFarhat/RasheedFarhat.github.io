# Portfolio Validation Report

Validation date: July 17, 2026

## Baseline

The repository had no package manifest, test suite, type system, or build command. It was a seven-file static GitHub Pages site.

Baseline commands and results:

- `node --check script.js`: passed.
- Local route and asset requests: passed for the two original HTML pages and local assets.
- `npx --yes html-validate@9.7.1 index.html 404.html`: failed with 29 errors, including doctype and void-element style, invalid ARIA labels, and inline styles.
- Secret pattern scan: no exposed credentials found.

## Final command results

### Repository validation

- `node scripts/validate-site.mjs`: passed for 10 HTML files and 9 required assets.
- `npx --yes html-validate@9.7.1 "**/*.html"`: passed with zero errors or warnings.
- `node --check script.js`: passed.
- `git diff --check`: passed.
- Typographic dash scan: no en dash or em dash found outside binary assets.
- Credential pattern scan: no API keys, GitHub tokens, or private-key headers found.

The HTML validator uses the recommended ruleset. Doctype capitalization and void-tag style rules are disabled because the checked-in HTML is formatted by Prettier, whose HTML output uses a lowercase doctype and self-closing void-tag syntax. Both forms are accepted by HTML parsers. All structural, semantic, ARIA, and content rules remain enabled.

### Build, tests, lint, and type checking

- Production build: not applicable. The production artifact is the checked-in static HTML, CSS, JavaScript, and assets.
- Unit tests: not present in the original repository. The new repository validation script covers route files, required assets, headings, landmarks, metadata, fragments, local links, external-link safety, inline styles, and banned placeholder copy.
- Lint: HTML validation and JavaScript syntax validation passed.
- Type check: not applicable. The site has no TypeScript or typed build step.
- Dependency audit: not applicable. The site has no runtime or package dependencies.

### Accessibility

- axe-core CLI 4.12.1 ran against all 10 HTML routes with WCAG 2 A, AA, 2.1 AA, and 2.2 AA tags: zero automated violations.
- Lighthouse accessibility score on the homepage: 100.
- Primary color-pair contrast ratios ranged from 8.64:1 to 17.30:1 after the forensic-material palette update.
- Mobile menu: opens with an updated `aria-expanded` state, closes on Escape, and returns focus to its button.
- Case-study sidebar links: measured at 44px high after a mobile touch-target correction.
- Skip link, heading hierarchy, landmarks, current-page state, external-link context, visible focus, and reduced-motion CSS were inspected.

Automated accessibility tools cannot prove full WCAG conformance. A manual screen-reader pass remains recommended.

### Lighthouse

Final homepage scores:

- Performance: 100.
- Accessibility: 100.
- Best Practices: 100.
- SEO: 100.
- First Contentful Paint: 0.9 seconds.
- Largest Contentful Paint: 1.2 seconds.
- Speed Index: 0.9 seconds.
- Total Blocking Time: 0 milliseconds.
- Cumulative Layout Shift: 0.

These results came from a local, headless, simulated Lighthouse run. Production network conditions and GitHub Pages caching can change field performance.

### Responsive browser checks

Rendered checks were performed at 1440 by 1000, 1024 by 768, 390 by 844, and 320 by 800.

- No horizontal overflow was found on any public route at 1024px or 390px.
- The 320px homepage had no overflowing elements.
- Desktop navigation, current-page states, mobile menu, case-study sidebars, diagrams, buttons, code blocks, and footer layout were inspected.
- Case-study flow diagrams collapsed to one column on mobile.
- Project code remained within its scroll container.
- The desktop hero was refined so the statement, evidence focus, explanation, and primary actions appear in the initial viewport.
- No browser console warnings or errors were recorded during the route crawl.

### Routes and assets

Local HTTP status checks returned 200 for:

- `/`
- `/projects/`
- `/projects/detection-as-code/`
- `/projects/mcp-security/`
- `/projects/identity-deception/`
- `/writing/`
- `/about/`
- `/resume/`
- `/contact/`
- `/404.html`
- Resume PDF, social image, robots, sitemap, and manifest assets

An unknown local route returned HTTP 404. After deployment, an unknown GitHub Pages route also returned HTTP 404 with the custom portfolio error page.

### Production deployment

- GitHub Pages completed the build for commit `9a99a3a` with status `built`.
- The live homepage and Detection-as-Code route returned HTTP 200 with the new release copy.
- The live resume returned HTTP 200 with `application/pdf`.
- The live social preview returned HTTP 200 with `image/png`.
- A deliberately unknown live route returned HTTP 404 with the custom 404 page.

### Metadata and assets

- All public pages have one H1, one main landmark, a unique title, a description, and a skip link.
- All indexable pages have canonical URLs.
- The 404 page has `noindex` and no canonical URL.
- All project routes have current-page navigation state.
- All image elements loaded successfully during the browser crawl.
- The social preview image is 1200 by 630.
- The Apple touch icon is 180 by 180.
- Sitemap, robots, manifest, favicon, and structured data are present.

### Internal and external links

- The repository validator found no missing local route, asset, or fragment targets.
- All tested GitHub repository and documentation links returned HTTP 200.
- The MIT license destination returned HTTP 200.
- Medium returned HTTP 403 to direct command-line requests and LinkedIn returned HTTP 999, both consistent with automated-request blocking. The destinations were corroborated from the source resume and published page evidence. The Chromium Simple Cache article title, author, publication date, reading time, technical contents, and supporting repository link were also checked through a readable rendering of the published page.
- All `target="_blank"` destinations include `noopener noreferrer`.

### Asset size check

- Homepage HTML: 18,119 bytes raw, 4,537 bytes gzipped.
- CSS: 27,216 bytes raw, 5,182 bytes gzipped.
- JavaScript: 1,407 bytes raw, 527 bytes gzipped.
- Social preview PNG: 94,184 bytes.
- Resume PDF: 139,289 bytes.

## Known warnings and unverified items

- No full manual screen-reader session was performed.
- External link status for Medium and LinkedIn could not be established through command-line HTTP because those services block automated requests.
- Field performance was not measured from real visitors.
