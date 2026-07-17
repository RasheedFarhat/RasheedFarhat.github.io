# Portfolio design system: "Clear Signal"

Clear Signal presents security engineering in daylight. Cool mineral surfaces,
deep blue-green ink, and a single signal-teal accent replace the conventional
dark security palette. The signature remains a real detection rule shown as
Sigma source, transformation stages, and generated Wazuh XML. Soft elevation,
open spacing, and rounded instrument panels keep the system calm without making
it casual.

## Principles

1. Evidence before adjectives. Claims are paired with a source, a number, or a
   stated boundary.
2. The subject supplies the visuals. The one showpiece is a genuine compiler
   artifact, not an illustration of one.
3. Calm over theatrical. No simulated terminals, hacker motifs, decorative
   particles, scroll effects, or decorative dashboards.
4. One accent family. Signal teal marks interaction, active paths, and section
   cues. Status is always expressed in text, never by color alone.
5. Progressive enhancement. All content and links work without JavaScript,
   which only manages the mobile menu and the copyright year.

## Color tokens

| Token           | Value     | Role                                   |
| --------------- | --------- | -------------------------------------- |
| `--ink`         | `#eef4f2` | Mineral-mist page ground               |
| `--panel`       | `#f8fbfa` | Raised instrument surfaces             |
| `--well`        | `#e5eeeb` | Code and evidence wells                |
| `--line`        | `#cfddda` | Quiet structural rules                 |
| `--line-strong` | `#aebfbc` | Emphasized borders                     |
| `--text-hi`     | `#13282e` | Headings and key values                |
| `--text`        | `#344b51` | Body text                              |
| `--text-dim`    | `#566b70` | Labels and secondary text              |
| `--signal`      | `#176d73` | Links, active paths, and section cues  |
| `--signal-hi`   | `#0d555b` | Hover and active state                 |
| `--signal-fill` | `#176d73` | Primary button fill                    |
| `--signal-ink`  | `#f7fbfa` | Text on signal teal                    |
| `--signal-soft` | `#d9eae7` | Low-emphasis active surface            |

Text colors are selected for WCAG AA contrast on their assigned surfaces.
Automated and manual contrast results are recorded in `VALIDATION_REPORT.md`.

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

- Section rules: full-width hairline with a short teal signal at the left
  margin (`.section::before`).
- Eyebrow labels: small uppercase mono, letter-spaced.
- Status chips: bordered mono capsules (`ACTIVE OPEN SOURCE`, `RESEARCH LAB`,
  `LAB PROOF OF CONCEPT`, `PUBLISHED INVESTIGATION`).
- Assessment strip: three cells labeled Claim / Evidence / Boundary at the
  top of every case study.
- Stage list: vertical pipeline schematic with circular nodes and a connecting
  rule, used for architecture sections.
- Scope note: teal-edged panel stating what a project is not.
- Disclosures: native `details` elements for engineering decisions and
  constraint deep dives.
- Footer: a restrained labeled grid for contact, source, and document context.

## Interaction

- Rows lift by two pixels and gain a soft shadow on hover; no content moves.
- Focus is a 2px signal-teal outline with 3px offset on every interactive element.
- The mobile menu button is 44px, toggles `aria-expanded`, moves focus to the
  first link on open, closes on Escape, and returns focus to the button.
- `prefers-reduced-motion` collapses all transitions.
- No scroll-triggered animation anywhere.
