# Portfolio audit

Audit date: 2026-07-17

## Initial state

The repository was a dependency-free static GitHub Pages site with seven files:

- One homepage with anchor navigation
- One 404 page
- One global stylesheet
- One small JavaScript file
- An SVG favicon
- A short README
- A `.nojekyll` deployment marker

There was no framework, package manifest, build step, route generator, analytics, form backend, or test suite. GitHub Pages deployed the `main` branch from the repository root.

Baseline checks:

- `node --check script.js` passed.
- Local requests for the homepage, 404 page, CSS, JavaScript, and favicon returned successfully.
- `html-validate` reported 29 errors across the two HTML files.
- A pattern scan found no API keys, private keys, passwords, or embedded secrets.
- Baseline compressed transfer sizes were small: homepage 3,996 bytes, CSS 4,315 bytes, JavaScript 424 bytes.

## UX problems

1. The site behaved as a single landing page rather than a technical portfolio.
2. Projects had repository links but no case-study routes, architecture context, constraints, tradeoffs, or limitations.
3. There was no direct resume path.
4. Writing, About, and Contact existed only as fragments or did not exist.
5. Mobile navigation disappeared below 760px instead of adapting.
6. The sticky header occupied a floating layer throughout the page and competed with content.
7. The primary visitor journeys for hiring managers, technical reviewers, and consulting inquiries were not distinct.

## Visual design problems

1. The light visual system was polished but did not match the requested darker direction.
2. Multiple accent colors competed for attention: cobalt, orange, mint, and green.
3. The evidence console leaned toward a simulated interface pattern even though it displayed static portfolio copy.
4. Large cards and metric strips created a landing-page feel.
5. Project presentation relied on decorative framing more than technical structure.
6. The responsive hero became very tall on small screens.

## Content problems

1. The hero opened with a slogan rather than a specific professional direction.
2. Strong project evidence was visible, but the engineering problem and decisions behind it were not.
3. MCP-DETECT was not clearly framed as supervised tooling that supports a human-led review.
4. Project limitations were mentioned briefly but not presented consistently.
5. The Detection-as-Code project did not explain the Sigma AST, DNF conversion, stable ID management, deployment safeguards, or unsupported constructs.
6. The identity deception project did not distinguish a lab architecture from a production control.
7. A verified Android investigation article was absent.
8. No browser or account forensics source was found, so adding that topic would create an unsupported credibility risk.

## Accessibility issues

1. `html-validate` reported invalid ARIA labeling on non-labelable generic elements.
2. The mobile navigation was unavailable rather than keyboard-accessible.
3. The 404 page used inline styles and had no shared navigation or skip link.
4. Reveal effects set content to `opacity: 0` until JavaScript ran.
5. Some small uppercase text fell below comfortable reading size.
6. Diagram information could be hidden from assistive technology through `aria-hidden` presentation.
7. There was no current-page state in navigation.
8. External-link labels did not consistently explain the destination.

## Performance issues

1. Three third-party Google Font families required external DNS, TLS, CSS, and font requests.
2. The passive scroll listener only changed header styling and added work with little user value.
3. The reveal observer added JavaScript and delayed content presentation.
4. The site lacked a committed sitemap and robots file.
5. Social metadata had no preview image.

## Engineering issues

1. There was no automated route, link, metadata, or asset validation.
2. The 404 page duplicated styles inline instead of using shared components.
3. Navigation did not support multiple routes.
4. There were no documented design tokens or component rules.
5. The site had no structured content model for project status, ownership, evidence, or limits.
6. HTML validation failed on doctype style, void-element style, inline CSS, and ARIA usage.

## Credibility risks

1. Strong numerical claims lacked enough on-page context about self-authored test data.
2. The phrase "zero false positives" could be misread as a production guarantee without the corpus boundary next to it.
3. The identity deception repository contains lab code with known operational limitations. Presenting it as production-ready would be misleading.
4. An existing pipeline image uses a neon cyber aesthetic and broad claims that do not match the requested tone.
5. A public Authentik screenshot contains a full Canarytokens URL and should not be republished.
6. A generic contact form would either be broken or add an unnecessary data-processing dependency.

## Prioritized recommendations

1. Build a clear multi-page information architecture with detailed project case studies.
2. Adopt a restrained dark system with controlled functional accents and no third-party fonts.
3. Use a shared "claim / evidence / boundary" pattern across project pages.
4. Add an accessible mobile menu with current-page state and Escape handling.
5. Add a verified resume asset and dedicated resume route.
6. Create a Writing route with the verified Android investigation and repository-based technical reports.
7. Present validation and limitations beside project outcomes.
8. Add structured metadata, social preview assets, sitemap, robots, and Person schema.
9. Add dependency-free automated route and content checks.
10. Re-run HTML validation, browser checks, keyboard checks, responsive checks, and external link checks before deployment.
