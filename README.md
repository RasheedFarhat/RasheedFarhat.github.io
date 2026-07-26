# Rasheed Farhat security operations portfolio

Static, dependency-free portfolio hosted with GitHub Pages at [rasheedfarhat.github.io](https://rasheedfarhat.github.io/).

## Architecture

- Plain semantic HTML
- One shared CSS design system ("Clear Signal" identity, see `DESIGN_SYSTEM.md`)
- Two small JavaScript files for pre-paint theme selection, the accessible
  theme and mobile-menu controls, and the generated copyright year
- Self-hosted variable fonts (Big Shoulders, Public Sans, IBM Plex Mono) with no third-party requests
- No build step
- No runtime dependencies
- No analytics, cookies, form processors, or tracking of any kind

## Public routes

- `/` - Homepage with the detection compilation exhibit
- `/projects/` - Project index
- `/projects/detection-as-code/` - Detection-as-Code case study
- `/projects/mcp-security/` - MCP security review case study
- `/projects/identity-deception/` - Identity deception case study
- `/writing/` - Technical writing and reports
- `/about/` - Professional profile
- `/resume/` - Resume overview and PDF
- `/contact/` - Contact options
- `/404.html` - Not-found page

## Local preview

```bash
python3 -m http.server 8000
```

Open `http://127.0.0.1:8000/`.

## Validation

Dependency-free site checks:

```bash
node scripts/validate-site.mjs
node --check script.js
node --check theme-init.js
```

HTML validation used during release (page routes only; `scripts/` holds
non-page asset sources):

```bash
npx --yes html-validate@9.7.1 index.html 404.html "projects/**/*.html" "writing/**/*.html" "about/**/*.html" "contact/**/*.html" "resume/**/*.html"
```

Social-card and touch-icon PNGs are rendered from the HTML sources in
`scripts/` at 1200x630 and 180x180.

See `VALIDATION_REPORT.md` for the complete release record.
