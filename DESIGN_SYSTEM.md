# Portfolio design system

## Design principles

1. Evidence before adjectives. Claims are paired with a source, validation method, or stated boundary.
2. Technical depth through structure. Architecture, decisions, and limitations carry the visual hierarchy.
3. Calm over theatrical. The site avoids simulated terminals, neon hacker motifs, gradients, particles, and decorative dashboards.
4. Two disciplined color roles. Patina identifies interaction. Copper identifies evidence, dates, and declared boundaries. Status is also expressed in text, never by color alone.
5. Fast by default. The production site uses system fonts, static HTML, one CSS file, one small script, and no tracking.
6. Progressive enhancement. All content and links work without JavaScript. JavaScript only manages the mobile menu and copyright year.

## Visual direction

The site uses a dark forensic-material direction based on carbon, oxidized metal, and evidence labels. The signature pattern is a three-part project evidence rail:

1. Claim
2. Evidence
3. Boundary

This structure is specific to security work. It shows what was built, how it was checked, and where confidence stops.

## Color system

| Token | Value | Use |
| --- | --- | --- |
| `--color-canvas` | `#0c1112` | Carbon page background |
| `--color-surface` | `#121b1b` | Oxidized primary surfaces |
| `--color-surface-raised` | `#192626` | Raised controls and diagrams |
| `--color-text` | `#f2f5f1` | Pale mineral primary text |
| `--color-text-muted` | `#aabab6` | Secondary text |
| `--color-line` | `#30413f` | Rules and component borders |
| `--color-accent` | `#71d8c0` | Patina links, selected states, and focus |
| `--color-accent-strong` | `#a4ead9` | Patina text on dark surfaces |
| `--color-signal` | `#e7aa68` | Copper evidence, dates, and boundary labels |

Accent-filled controls use dark text to preserve contrast. Patina and copper have separate semantic jobs and are not alternated for decoration.

## Typography

The site uses local system fonts to remove third-party requests and reduce layout shift.

- Display and body: `Inter`, `Segoe UI`, `Roboto`, `Helvetica Neue`, Arial, system sans-serif
- Technical labels and code: `SFMono-Regular`, `Cascadia Code`, `Roboto Mono`, Consolas, monospace
- Maximum body line length: 70 characters
- Heading line height: 1.05 to 1.15
- Body line height: 1.6 to 1.75
- Small text floor: 0.75rem, used only for uppercase metadata with increased tracking

## Type scale

| Token | Range | Use |
| --- | --- | --- |
| `--step--1` | 0.75rem | Metadata and tags |
| `--step-0` | 1rem | Body copy |
| `--step-1` | 1.125rem | Lead copy |
| `--step-2` | 1.35rem | Card and section subheads |
| `--step-3` | 1.75rem | Section headings |
| `--step-4` | 2.7rem to 5.2rem | Page titles |
| `--step-5` | 3rem to 4.8rem | Homepage hero |

## Spacing scale

The base spacing unit is 4px.

| Token | Value |
| --- | --- |
| `--space-1` | 0.25rem |
| `--space-2` | 0.5rem |
| `--space-3` | 0.75rem |
| `--space-4` | 1rem |
| `--space-5` | 1.5rem |
| `--space-6` | 2rem |
| `--space-7` | 3rem |
| `--space-8` | 4rem |
| `--space-9` | 6rem |
| `--space-10` | 8rem |

## Layout rules

- Global content width: 1200px maximum with responsive page gutters.
- Reading width: 70ch maximum.
- Homepage hero: two-column at large widths, single-column below 900px.
- Project case studies: main narrative plus a compact metadata rail.
- Section boundaries use rules and spacing rather than decorative containers.
- Cards are reserved for distinct destinations, not every content block.
- Diagrams become vertical flows below 720px.
- Code blocks scroll horizontally and never reduce below readable type.

## Component patterns

### Header

- Shared across all public pages.
- Sticky at the top with an opaque surface and a single lower rule.
- Desktop navigation shows five primary routes and a Resume action.
- Mobile navigation opens below the header without shifting page content.
- The current route uses `aria-current="page"` and a visible accent underline.

### Buttons

- Primary: patina fill, dark label.
- Secondary: transparent surface, visible border.
- Text link: underlined on hover and focus.
- Minimum interactive height: 44px.
- Labels begin with clear action verbs.

### Project row

- Uses one wide destination row instead of a dense grid.
- Shows status, project name, problem, selected evidence, technologies, and a clear case-study link.
- Hover changes border and heading color only.

### Evidence rail

- Three columns: Claim, Evidence, Boundary.
- Each column has an explicit heading so meaning is not color-dependent.
- Stacks vertically on small screens.

### Architecture flow

- Implemented as an ordered HTML list.
- Connecting lines are decorative and hidden from assistive technology.
- Every node uses a plain-language title and supporting label.
- Vertical on mobile, horizontal where space permits.

### Status label

- Text always names the status, such as "Active open source" or "Research lab".
- Patina is supportive only. Evidence and boundary states may use copper with explicit text.

### Footer

- Compact shared footer with identity, descriptor, core links, and generated year.
- ZerOne appears only as a secondary technical alias.

## Interaction rules

- No autoplay, parallax, scroll hijacking, cursor effects, or loading screens.
- Hover effects use color and one-pixel border changes, not movement.
- Mobile navigation supports Enter, Space, Escape, and focus return.
- Motion is limited to short color and opacity transitions.
- `prefers-reduced-motion` disables nonessential transitions and smooth scrolling.

## Responsive behavior

| Width | Behavior |
| --- | --- |
| 1200px and above | Full two-column hero, horizontal architecture flows |
| 900px to 1199px | Reduced gaps, stacked case-study sidebars where needed |
| 720px to 899px | Single-column page layouts, compact evidence rail |
| 320px to 719px | Mobile menu, vertical flows, full-width actions, stacked footer |

Touch targets remain at least 44 by 44 CSS pixels. Long URLs are not displayed as raw text. Diagrams, code, and metadata wrap or scroll without expanding the viewport.

## Accessibility considerations

- WCAG 2.2 AA is the target.
- Every page has one meaningful H1, a skip link, and shared landmarks.
- Focus indicators use a 3px accent outline with offset.
- Body and muted text colors are selected for AA contrast on their surfaces.
- Navigation state is semantic and visual.
- Mobile menu state is exposed through `aria-expanded` and `aria-controls`.
- The menu closes on Escape and returns focus to its trigger.
- Diagrams use semantic ordered lists and accompanying descriptions.
- Decorative connectors are hidden from assistive technology.
- External links state the destination in their accessible text.
- No content is hidden pending JavaScript execution.
- The 404 page preserves the same navigation and landmarks as other pages.
