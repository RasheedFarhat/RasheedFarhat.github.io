# Design system: Signal & Boundary

This document describes the design system as shipped. It supersedes the earlier
"Clear Signal" system, which stacked a rounded, drop-shadowed component layer on
top of a sharper base and diluted it. That override layer has been deleted; what
follows is the single, consistent system that replaced it.

The name comes from how Rasheed writes about his own work, not from a mood board.
`mcp-detect/docs/CONTROL-ASSURANCE.md` defines a six-state assurance taxonomy
where an absence of indicators never yields `verified`, and `control-plane`
defaults new evidence to `review_required`. The two accent colors on this site
encode exactly that distinction: teal is what a system detects and verifies,
amber is what it cannot see. Nothing on the site uses amber decoratively, and
every page carries at least one real amber boundary, not just the teal
evidence beside it.

The hero states the system before a visitor sees a single lamp or limit list.
The homepage lede reads "Detection engineering, tested and bounded," with
`tested` set in `--sig` and `bounded` set in `--amb` using the same
`.article-title__signal` word-highlight idiom used elsewhere for article
titles. That sentence is the whole color code, taught in eight words, before
any component demonstrates it.

---

## Color

Dark is the primary target; the theme toggle and system-preference default both
resolve to it. Light is a full second treatment, styled as technical paper
(warm gray ground, no pure white), not a washed-out afterthought. Every pair
below was chosen to clear WCAG AA (4.5:1 body text, 3:1 large text and UI
borders) in both themes.

| Token | Dark | Light | Role |
| --- | --- | --- | --- |
| `--ink` | `#0F1211` | `#DCDAD3` | Page ground |
| `--panel` | `#171B1A` | `#EDEBE5` | Standard raised surface |
| `--panel-hi` | `#1D2221` | `#F5F3EE` | Second elevation (hover, nested panel) |
| `--well` | `#0A0D0C` | `#CFCEC6` | Recessed screens: code, readouts |
| `--line` | `#262D2C` | `#BFBCB2` | Hairline rule |
| `--line-hi` | `#38423F` | `#9A968B` | Emphasized edge, inactive lamp |
| `--edge-top` | `rgb(255 255 255 / .055)` | `rgb(255 255 255 / .75)` | Raised-panel top highlight |
| `--edge-bottom` | `rgb(0 0 0 / .4)` | `rgb(0 0 0 / .08)` | Raised-panel bottom shade |
| `--well-top` | `rgb(0 0 0 / .5)` | `rgb(0 0 0 / .14)` | Recessed-well top shade |
| `--well-bottom` | `rgb(255 255 255 / .035)` | `rgb(255 255 255 / .55)` | Recessed-well bottom highlight |
| `--text-hi` | `#E8EDEA` | `#161A19` | Headings, values |
| `--text` | `#B3BFBA` | `#3A403D` | Body copy |
| `--text-dim` | `#7C8A85` | `#545B57` | Labels, captions |
| `--sig` | `#6FBFB4` | `#0D5F62` | Verified / tested / active |
| `--sig-hi` | `#96D6CB` | `#0A4B4E` | Hover, active path |
| `--sig-ink` | `#06201D` | `#F4FAF9` | Text set on a filled teal chip |
| `--sig-soft` | `rgb(111 191 180 / .12)` | `rgb(13 95 98 / .09)` | Lamp halo, soft fill |
| `--amb` | `#E0A75E` | `#8A5A16` | Boundary / limit / review required |
| `--amb-hi` | `#F0C287` | `#6E4711` | Amber hover |
| `--amb-ink` | `#2A1A03` | `#FBF4E8` | Text set on a filled amber chip |
| `--amb-soft` | `rgb(224 167 94 / .12)` | `rgb(138 90 22 / .1)` | Lamp halo, soft fill |

`--code-a` through `--code-d` alias `--text-hi` / `--sig` / `--amb` / `--text-dim`
for syntax coloring in the inset code screens, so a code block never needs its
own palette.

Status is never carried by color alone. Every lamp, chip, or meter segment sits
next to a text label; color reinforces the label, it does not replace it.

---

## Material

There are no drop shadows anywhere on the site. Depth comes from three rules,
applied consistently everywhere a surface changes elevation:

1. **Raised panel** (a card, the header, a button): background one step
   lighter than its ground, plus `inset 0 1px 0 var(--edge-top)` on top and
   `inset 0 -1px 0 var(--edge-bottom)` on the bottom. Reads as a plate sitting
   slightly proud of its surroundings.
2. **Recessed well** (code figures, the plate's inset screens, form fields):
   background one step darker than its ground, plus the inverse shadow pair,
   `--well-top` on top and `--well-bottom` on the bottom. Reads as a screen set
   into a bezel, below the panel that holds it.
3. **Grain**: a single `feTurbulence` SVG, inlined as a data URI on
   `body::before`, `position: fixed`, `opacity: .022`, `pointer-events: none`.
   Felt as texture on close reading, invisible at a glance.

`--radius` is `2px` and is the only corner radius used anywhere except
`--radius-lamp` (`50%`), reserved for status lamps. Lamps are circles because
lamps are circles; nothing else on the site is round.

A small scale layer sits on `:root` for the highest-traffic measurements:
`--s-1` through `--s-8` for spacing, `--t-1` through `--t-7` for type size,
`--header-h` for the fixed header height that every sticky offset derives
from, and `--pad-tight` / `--pad-panel` for the two card-padding shapes still
in use after the near-duplicates were collapsed. This is a partial migration
by design, covering the worst repeat offenders rather than every declaration
in the sheet, so a fair number of one-off values remain hand-set and that is
expected, not a gap to close later.

---

## Typography

Three self-hosted variable faces, each with one job:

- **Big Shoulders** — condensed industrial display. Used for the wordmark, the
  hero name, section headings, and every large numeral (metric values,
  coverage counts, the 404 code). The `opsz` axis is driven by the size it is
  set at rather than pinned to one value: roughly `opsz 40-46` for section
  headings, `opsz 56-72` for large standalone numerals, `opsz 60` for the hero
  name and plate titles.
- **Public Sans** — body copy. Carries a measure cap and no opinions; it is
  the face a reader should stop noticing.
- **IBM Plex Mono** — data and labels, in three deliberate tiers rather than
  one size used everywhere:
  - `0.625rem`, `600` weight, `0.18em` tracking — engraved plate labels
    (`.plate-label`), the smallest recurring detail on the site, always paired
    with a hairline rule underneath standing in for an etched groove.
  - `0.72rem`-`0.8rem` — eyebrows and section kickers.
  - `0.8rem`-`1rem` — inline data lines and readouts (case metrics, coverage
    values).

Tracking on mono labels stays at or under `0.18em`. Chrome splits a text run
into one node per glyph above roughly `2px` of letter-spacing on small type,
which breaks ATS/screen-reader text extraction; `0.18em` sits comfortably under
that ceiling at the sizes used here.

---

## The five signature elements

### 1. The exhibit as an instrument fascia (`.plate`)

The homepage compile exhibit is a device front panel: an engraved title strip
(`.plate__bar`, `.plate__title`), the real Sigma source in an inset screen
(`.plate__pane`, recessed well), a stage-indicator rail between the panes with
four lamps that light in sequence on load, and the generated Wazuh XML in a
second inset screen. The content is unchanged, real Sigma compiling to real
Wazuh XML; the treatment now reads as hardware rather than a text diff.

### 2. Semantic status lamps (`.lamp`, `.lamp--sig`, `.lamp--amb`)

One component, defined once in the base layer and reused everywhere a status
appears: hero status, homepage work rows, project case-study meta, the
Claim/Evidence/Boundary strip, and the support casework preview rows.
`.lamp--sig`
is teal for active/tested/verified; `.lamp--amb` is amber for
research/proof-of-concept/boundary; an undecorated `.lamp` (background
`--line-hi`) marks archived or inactive. `.lamp--pulse` adds a slow 4s opacity
breathe, reserved for the single "currently active" indicator on the page,
disabled entirely under `prefers-reduced-motion`.

### 3. Coverage meters from real data (`.coverage`, `.coverage__ticks`)

Segmented tick strips rendered from real project figures, not illustrative
data: DaC-Pipeline's 14-of-14 ATT&CK tactics across 119 techniques, and
MCP-DETECT's 5 techniques against 12 documented evasion classes with 3
structurally undetectable blind spots. Covered segments are teal
(`.is-covered`), known-blind segments are amber (`.is-blind`), out-of-scope
segments are hollow. The count sits alongside in Big Shoulders at `opsz 72`.
Pure CSS, class-driven, no inline styles or generated SVG bars, so
`validate-site.mjs`'s inline-style ban is never in tension with the dataviz.

### 4. The boundary panel (`.scope-note`)

The site's most distinctive recurring device, and the one that carries the
site's actual argument: limits get the same design investment as claims. Set
on a recessed ground with an amber hairline key and an engraved `BOUNDARY`
plate label, it appears on every case study's "what this cannot see" section
and on the homepage and project pages wherever a limitation needs to be named
rather than implied.

### 5. Engraved plate labels (`.plate-label`)

The smallest recurring detail, used for every metadata caption site-wide: case
meta, footer title block, scope-note keys, case-study sidebar and article-rail
headings, plate pane labels, tag lists, coverage labels. `.plate-label` is the
single shared rule (tiny uppercase mono, `0.18em` tracking, a hairline rule
beneath) that `.title-block__label`, `.case-meta dt`, `.scope-note strong`,
`.case-sidebar h2`, `.article-rail h2`, and `.plate__stages-label` all extend
in the stylesheet, each adding only its own per-component delta on top.
Applied with total consistency at the CSS level, not just visually, this is
the detail that signals one person designed every part of the page, not a
component library assembled from defaults.

---

## Motion

One orchestrated load sequence, gated by `html[data-loaded="true"]`, which
`script.js` sets on `DOMContentLoaded`:

1. Hairline rules draw in horizontally (`transform: scaleX`).
2. Status lamps come up in sequence.
3. The exhibit's four stage indicators light left to right, once.
4. The exhibit's boundary chip ("57 of 58 rules target Windows process
   creation") fades in last, after the fourth stage lamp. The limit arrives
   with the result, not instead of it or ahead of it.

The whole sequence runs under 900ms and every element is at full text opacity
from the first frame; nothing waits on animation to become readable, only
supporting marks (rules, lamps, stage lights, the boundary chip) animate in.

Hover states never lift or float. A row's left edge marker extends and its top
highlight brightens instead, which reads as a control being selected rather
than a card floating off the page.

Exactly one element carries an ambient loop outside the load sequence: the
single "currently active" lamp (`.lamp--pulse`), a 4s opacity drift.

`prefers-reduced-motion: reduce` disables the load sequence and the lamp pulse
entirely; every element renders in its final state with no animation.

---

## Recurring devices

- **Hairline rules** (`--line` / `--line-hi`) replace every drop shadow and
  card border from the old system. A boundary is a line, not a shadow.
- **Inset screens** for anything that is a readout rather than prose: code
  figures, the plate's panes, form fields. Always a recessed well, never a
  raised panel.
- **Big Shoulders numerals** for anything measured: metric values, coverage
  counts, the 404 code. A condensed number face at scale is the single most
  instrument-like typographic move on the site, and it is already loaded for
  the wordmark, so promoting it onto numerals costs nothing in font weight.

---

## The support sub-theme: Resolution Desk

`/support/` and `/support/casework/` are the two routes for the IT and
technical-support lane. They run the same base layer, spacing scale,
material rules, and motion system as the rest of the site, scoped entirely
under `body.support-page` so the security-facing pages are byte-for-byte
unaffected. Two things change on purpose.

**The accent repoints, it does not add a third color.** `--sig` and `--amb`
are both redefined to the same amber value under `body.support-page` (dark
default `#F2B84B`/`#FFD27A`, light `#845200`/`#6E4500`, kept in sync the same
explicit-toggle-plus-OS-default way as the site-wide light tokens). Detection
work reads as teal-verified against an amber boundary; support work reads as
one warm, consistent signal, because a service desk does not have the
same verified/unverified duality a detection claim does. A single
`--resolved` / `--resolved-hi` / `--resolved-ink` / `--resolved-soft` trio is
reserved for the one moment that is genuinely a resolution rather than a
standing fact: the hero case desk's last two stages transition into it once,
on load, gated by the same `html[data-loaded="true"]` sequence the rest of
the site uses, never as an ambient color.

**Three new components carry the "documented service ticket" idiom:**

- `.case-desk` (hero) — a live worked example, styled as a physical case
  file: a provenance-labeled fact panel (`.case-desk__facts`, a
  `dl > div > dt + dd` grid reusing the same structure as `.case-desk__facts`
  was in every case downstream) beside a five-stage status rail
  (`.case-desk__stages`) that lights REPORT through DOCUMENT in sequence,
  with RESOLVE and DOCUMENT keyed to `--resolved` instead of `--sig`.
- `.case-file` (casework page) — the repeating 11-field anatomy
  (Context and provenance through Boundary) used identically for all three
  cases, a lighter sibling of `.case-desk__facts` rather than a reuse of the
  heavier `/projects/` case-study stack (`.case-hero__grid`, `.assessment`,
  `.metric-list`), because three full case-study layouts on one page would
  compete with each other for weight. Boundary is always the last field, so
  its `dt` is permanently amber-keyed rather than carrying a manually
  applied class.
- `.comms-sample` — a two-pane, gap-as-line split (same technique as
  `.assessment`) pairing the exact customer-facing sentence with the
  engineering-handoff fields it was built from, making the translation
  between the two audiences a visible artifact instead of an assertion.

The casework page reuses `.case-layout` / `.case-content` / `.case-sidebar`
and `.stage-list` (with its `li--amb` boundary variant) unchanged from the
`/projects/` case-study pattern, at the whole-page level rather than
per-case, so the sticky "On this page" index covers all three cases plus the
workflow-lab module from one sidebar.

The brand lockup gets one scoped variant, `.brand--support`: "RF" stays the
identical size as the security site's mark, with a smaller mono
`.brand__tag` ("/ SUPPORT") beside it, the same plate-label idiom as the
portrait caption and the case desk's stage labels. This keeps the full mark
narrow enough to fit the header row next to the theme toggle and menu button
at a 320px viewport, where "RF / SUPPORT" set at the base `.brand` size would
not.

The support footer (`.support-footer`) is deliberately lighter than the
security site's six-cell title-block footer: identity, contact, one
`.support-footer__crossover` text link back to `/`, nothing else. One
crossover link, not a nav duplication.

---

## Interaction and accessibility

- Focus ring is visible on every interactive element: header nav, mobile
  menu, work rows, disclosures, case sidebar links, buttons. No `outline:
  none` without a replacement.
- Status is never color-only; every lamp and chip carries a text label.
- Contrast: all token pairs in the color table above clear WCAG AA (4.5:1
  body text, 3:1 large text and UI borders) in both themes.
- `prefers-reduced-motion: reduce` is honored globally (see Motion above).
- No horizontal overflow down to 320px viewport width.

---

## Constraints this system was built inside

- No new runtime dependencies, no build step, no third-party requests, no new
  font files. Same three self-hosted variable WOFF2 faces as before.
- `scripts/validate-site.mjs` rejects inline `style="` attributes and em/en
  dash typographic characters, and requires one `<h1>` and one `<main>` per
  page, a canonical link, a description meta, and `rel="noopener noreferrer"`
  on every `target="_blank"`. All dataviz on the site (coverage meters, stage
  indicators) is class-driven CSS for this reason.
- The three long-form `writing/*/index.html` articles inherit this system
  through shared classes only. Their body markup indentation is left
  untouched, because `validate-site.mjs` extracts article word counts using a
  literal indentation-sensitive marker.
- The light theme's token values are written twice: once under
  `:root[data-theme="light"]` for the explicit toggle, once under
  `@media (prefers-color-scheme: light)` for the OS-level default. A media
  query cannot join that selector without JavaScript, so the duplication is
  intentional rather than an oversight. `validate-site.mjs` asserts the two
  blocks stay token-for-token identical, so they cannot silently drift apart.
  The support-page repointed tokens (`html[data-theme="light"] body.support-page`
  and its `@media (prefers-color-scheme: light)` mirror) are the same pattern,
  scoped one level deeper, and get the identical automated sync check.
