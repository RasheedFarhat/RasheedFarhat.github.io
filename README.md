# Rasheed Farhat security engineering portfolio

Static, dependency-free portfolio hosted with GitHub Pages at [rasheedfarhat.github.io](https://rasheedfarhat.github.io/).

## Architecture

- Plain semantic HTML
- One shared CSS design system
- One small JavaScript file for the accessible mobile menu and generated copyright year
- No build step
- No runtime dependencies
- No analytics, cookies, form processors, or third-party fonts

## Public routes

- `/` - Homepage
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
```

HTML validation used during release:

```bash
npx --yes html-validate@9.7.1 "**/*.html"
```

See `VALIDATION_REPORT.md` for the complete release record.
