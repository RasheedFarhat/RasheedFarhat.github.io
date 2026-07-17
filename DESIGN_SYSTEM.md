# Portfolio design system: "The Compile Plate"

The site is composed like a controlled engineering document. Its signature is
the homepage compile plate: a real detection rule from the Detection-as-Code
pipeline shown as authored Sigma source beside the exact Wazuh PCRE2 XML it
compiles to, annotated with the transform stages. Everything else stays quiet
and precise: hairline structure, drafting-style annotations, and a title-block
footer modeled on an engineering drawing.

## Principles

1. Evidence before adjectives. Claims are paired with a source, a number, or a
   stated boundary.
2. The subject supplies the visuals. The one showpiece is a genuine compiler
   artifact, not an illustration of one.
3. Calm over theatrical. No simulated terminals, neon motifs, gradients,
   particles, scroll effects, or decorative dashboards.
4. One accent family. Copper marks interaction, evidence labels, and section
   ticks. Status is always expressed in text, never by color alone.
5. Progressive enhancement. All content and links work without JavaScript,
   which only manages the mobile menu and the copyright year.

## Color tokens

| Token           | Value     | Role                                   |
| --------------- | --------- | -------------------------------------- |
| `--ink`         | `#101619` | Page ground (petroleum ink)            |
| `--panel`       | `#161f22` | Raised panels (gunmetal)               |
| `--well`        | `#0c1113` | Code wells                             |
| `--line`        | `#243135` | Hairline rules                         |
| `--line-strong` | `#33454b` | Emphasized rules and borders           |
| `--text-hi`     | `#ecf1f0` | Headings and key values (cold silver)  |
| `--text`        | `#c3ccce` | Body text                              |
| `--text-dim`    | `#93a3a2` | Mono labels and secondary text         |
| `--copper`      | `#d28c5e` | Links, markers, evidence labels        |
| `--copper-hi`   | `#e0a578` | Hover state                            |
| `--copper-fill` | `#c87e4f` | Primary button fill                    |
| `--copper-ink`  | `#1c1209` | Text on copper                         |

All text pairs measure at least 5.7:1 against their backgrounds (WCAG AA;
most pairs exceed AAA). The ghosted 404 numeral uses `#566b70` at 3.2:1,
passing the large-text threshold.

## Typography

- Display: Big Shoulders (variable, optical size 10 to 72). Headings, the
  hero name, and metric numerals. Uppercase only for the name, status chips,
  and mono labels.
- Body: Public Sans (variable). All prose.
- Technical: IBM Plex Mono 400/600. Code, filenames, dates, eyebrow labels,
  evidence lines, buttons, and navigation.

All fonts are subset latin WOFF2 files self-hosted under `/assets/fonts/`
(about 105 KB total). No third-party font requests.

## Recurring devices

- Section rules: full-width hairline with a short copper tick at the left
  margin (`.section::before`).
- Eyebrow labels: small uppercase mono, letter-spaced.
- Status chips: bordered mono capsules (`ACTIVE OPEN SOURCE`, `RESEARCH LAB`,
  `LAB PROOF OF CONCEPT`, `PUBLISHED INVESTIGATION`).
- Assessment strip: three cells labeled Claim / Evidence / Boundary at the
  top of every case study.
- Stage list: vertical pipeline schematic with square nodes and a connecting
  rule, used for architecture sections.
- Scope note: copper-edged panel stating what a project is not.
- Disclosures: native `details` elements for engineering decisions and
  constraint deep dives.
- Title-block footer: a bordered grid of labeled cells (Engineer / Focus /
  Location / Contact / Source / Document), like a drawing title block.

## Interaction

- Hover states shift color only; rows tint to `--panel`.
- Focus is a 2px copper outline with 3px offset, on every interactive element.
- The mobile menu button is 44px, toggles `aria-expanded`, moves focus to the
  first link on open, closes on Escape, and returns focus to the button.
- `prefers-reduced-motion` collapses all transitions.
- No scroll-triggered animation anywhere.
