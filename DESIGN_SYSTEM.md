# Portfolio design system: "Clear Signal"

Clear Signal presents security engineering in daylight. Cool mineral surfaces,
deep blue-green ink, and a single signal-teal accent replace the conventional
dark security palette. The signature remains a real detection rule shown as
Sigma source, transformation stages, and generated Wazuh XML. Soft elevation,
open spacing, and rounded instrument panels keep the system calm without making
it casual. A solid slate-mist canvas replaces decorative background texture;
neutral surface layers provide the hierarchy.

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
| `--ink`         | `#e2e9e7` | Slate-mist page ground                 |
| `--panel`       | `#f2f5f4` | Raised instrument surfaces             |
| `--well`        | `#d5dfdc` | Code and evidence wells                |
| `--line`        | `#b9c8c4` | Quiet structural rules                 |
| `--line-strong` | `#94aaa5` | Emphasized borders                     |
| `--text-hi`     | `#10262c` | Headings and key values                |
| `--text`        | `#2d454b` | Body text                              |
| `--text-dim`    | `#52676b` | Labels and secondary text              |
| `--signal`      | `#0f6268` | Links, active paths, and section cues  |
| `--signal-hi`   | `#084c51` | Hover and active state                 |
| `--signal-fill` | `#0f6268` | Primary button fill                    |
| `--signal-ink`  | `#f5f8f7` | Text on signal teal                    |
| `--signal-soft` | `#c8dcda` | Low-emphasis active surface            |

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
