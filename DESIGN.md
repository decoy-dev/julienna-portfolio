# DESIGN.md: the Julienna Batten identity contract

Hard rules for anyone (human or agent) building on this site. The live version of this document is
`/brand` (src/pages/brand.astro); the downloadable kit is `public/brand-kit/`. If this file and
`src/styles/global.css` ever disagree, global.css wins and this file must be corrected.

Stack: Astro (static), Tailwind v4 via `@tailwindcss/vite`, anime.js v4, Phosphor icons through
`astro-icon` (`<Icon name="ph:..." />`, build-time inline SVG). Deployed under `/julienna-portfolio`,
so every internal link and every `public/` asset URL goes through `href()` from `src/lib/url.ts`.

## Principles

1. **Systems over one-offs.** Every asset is an instance of a system. If it cannot be regenerated from rules and tokens, it is not finished.
2. **Instrumentation, not decoration.** Node graphs, mono labels, and dot grids appear only where they organize real content.
3. **Proof before polish.** Verified numbers ship unmarked. Unknown numbers wear a dashed placeholder, never a guess.
4. **One accent.** Teal carries the brand, and only teal: primary for actions, graphic-deep for live state, tints for washes.

## Color tokens (light, shipped)

All defined in `@theme` in `src/styles/global.css`; Tailwind utilities are `bg-*` / `text-*` / `border-*` of the name.

| Token | OKLCH | Role | Contrast |
| --- | --- | --- | --- |
| `bg` / `white` | `oklch(1 0 0)` | Page background, pure white | base |
| `surface` | `oklch(0.978 0.004 200)` | Bands: proof rail, footer base, window chrome | |
| `surface-2` | `oklch(0.955 0.006 200)` | Inset wells, bento cells, chips | |
| `line` | `oklch(0.9 0.01 200)` | Hairlines, dividers, idle edges, node borders | |
| `ink` | `oklch(0.205 0.018 222)` | Headings, body text | 17.9:1 on white, AAA |
| `muted` | `oklch(0.47 0.02 215)` | Secondary text, captions | 6.8:1 on white, AA |
| `primary` | `oklch(0.46 0.08 188)` | Button fills, key emphasis, colored text | white on it 6.8:1, AA |
| `primary-hover` | `oklch(0.42 0.075 188)` | Hover fills | white on it 7.8:1 |
| `graphic-deep` | `oklch(0.6 0.09 188)` | Active edges, focus rings, port strokes, progress | 3.8:1, non-text only |
| `graphic` | `oklch(0.72 0.1 188)` | Port fills, done edges, wire tint | 2.4:1, non-text only |
| `graphic-tint` | `oklch(0.94 0.03 188)` | Teal washes, selection | text on it uses ink |
| `danger` | `oklch(0.5 0.17 27)` | Form errors only: error borders + error message text | 6.55:1 on white, AA |
| `dash` | `oklch(0.75 0.005 220)` | Placeholder dashed borders | |
| `dash-ink` | `oklch(0.52 0.01 220)` | Placeholder labels, specimen captions | 5.5:1 on white, 4.8:1 on surface-2, AA |
| `grid` | `oklch(0.92 0.008 200)` | Node-canvas dot grid | |
| `on-ink-muted` | `oklch(0.78 0.02 215)` | Secondary text on ink bands | 9.0:1 on ink, AA |

Color rules:

- One accent hue family (teal 188), and only teal. Packets and live-state pulses use `graphic-deep` with a 2px white ring; no second hue exists for emphasis.
- `danger` is state semantics for form validation only; it never decorates.
- `graphic` and `graphic-deep` never carry text and never act as the sole carrier of state-critical meaning without a second cue (check icon, label).
- Persona/client colors (the 11 OrthoBoost persona accents in `src/data/site.ts`) appear ONLY inside rendered-output previews (ad tiles, mock renders). Never buttons, chips, headings, or borders.

## Color tokens (dark, documented, NOT shipped)

For a future dark mode; nothing toggles these today. `dark-bg oklch(0.16 0.015 220)`, `dark-surface 0.195`,
`dark-surface-2 0.235`, `dark-line 0.32`, `dark-ink 0.95` (16.8:1 on dark-bg), `dark-ink-muted 0.72 0.02 215`
(7.9:1), `dark-primary oklch(0.7 0.11 188)` paired with dark text `oklch(0.2 0.02 220)` (7.1:1, white text is
NOT used on dark-primary), `dark-graphic oklch(0.78 0.1 188)`. Full values
in `public/brand-kit/tokens.css` and `tokens.json`.

## Typography

Three faces, self-hosted variable woff2, `font-display: swap`. Funnel Display and Funnel Sans are preloaded
in `Base.astro`; the mono is never preloaded (nothing above the fold uses it).

- **Funnel Display** (`src/assets/fonts/funnel-display-var.woff2`): h1 through h3 (automatic via base CSS), stat numbers, the wordmark. Weights 650 headings, 700 display/stats, 600 wordmark.
- **Funnel Sans** (`src/assets/fonts/funnel-sans-var.woff2`): everything you read that is not a heading. Weights 400 body, 500 chips, 600 buttons/labels/`.meta`.
- **Spline Sans Mono** (`src/assets/fonts/spline-sans-mono-var.woff2`): literal file names, paths, JSON/code excerpts, token names and values ONLY. Never labels, never titles, never uppercase, never letterspaced. If it reads as a sentence or names a thing for a reader, it is sans.

The one small-label voice is `.meta` (also `text-meta`): sans, 0.8125rem, 600, sentence case, +0.005em.
There is no uppercase tracked label anywhere on the site; the old mono `.label` is deleted.

Scale (each `text-*` utility sets size, line-height, tracking, weight):

| Utility | Face | Size | lh / ls / wt |
| --- | --- | --- | --- |
| `text-display` | display | `clamp(2.375rem, 1.55rem + 3vw, 3.625rem)` | 1.06 / -0.025em / 700 |
| `text-h2` | display | `clamp(1.875rem, 1.45rem + 1.6vw, 2.75rem)` | 1.1 / -0.02em / 650 |
| `text-h3` | display | `clamp(1.1875rem, 1.07rem + 0.5vw, 1.375rem)` | 1.25 / -0.01em / 650 |
| `text-body` | sans | `clamp(1rem, 0.95rem + 0.2vw, 1.125rem)` | 1.6 / 0 / 400, max 65ch |
| `text-small` | sans | `0.875rem` | 1.5 / 0 / 400 |
| `text-meta` | sans | `0.8125rem` (sentence case) | 1.4 / +0.005em / 600 |
| `text-stat` | display | `clamp(1.75rem, 1.4rem + 1.2vw, 2.5rem)` | 1.1 / -0.02em / 700, `tabular-nums` |

Rules: tracking never tighter than -0.025em; only display/h2/stat go negative. Headlines are sentence case,
eight words max, `text-wrap: balance` (global). Sub-paragraphs 25 words max. Stats always tabular.

## Layout

- One container: `.shell` = `min(1200px, 100% - 2 * var(--gutter))`; `--gutter` 16px, 24px from 640px.
- 12 columns, 24px gaps on desktop.
- **Spacing rule: 8px.** Every margin, padding, and gap is a factor or a multiple of 8:
  2, 4, 8, 16, 24, 32, 40, 48, 64, 96, 128. 2 and 4 are for component interiors only (chip padding,
  icon-to-label gaps); anything between blocks uses 8 or more. Never 6, 10, 12, 14, 18, 20, 28, 36. In
  Tailwind: steps 0.5, 1, 2, 4, 6, 8, 10, 12, 16, 24, 32 (no 1.5, 2.5, 3, 3.5, 5, 7, 9). Spacing never
  interpolates with `vw`/`vh`; it steps at breakpoints so every rendered value stays on the rule. The only
  exception is the mark's clear-space specimen on /brand, which is drawn to the mark's own proportion.
- Section rhythm `.section-y`: 64px, 96px from 1024px. Cards and bento cells pad 24px, 32px from 1024px;
  full-bleed bands use 64px inner padding.
- Breakpoints: 640, 768, 1024, 1280. The page wire renders at >= 1360px (`--breakpoint-wire: 85rem`) only, weaving through the home page's `data-wire-section` sections.
- Verify every layout at 390, 768, 1024, 1440. No horizontal page overflow ever; wide specimens scroll inside their own frame.

## Radius and elevation

Radii (`rounded-*`): `inset` 8px (inputs, swatches, nested media), `card` 12px (cards,
nodes, windows, bento cells), `media` 16px (feature imagery, graph canvases), `full` 999px (buttons, chips,
ports, nav). **Nesting rule: a child container steps down exactly one radius.**

Elevation: e0 = flat, 1px `line` border. e1 = `shadow-raised`, no border. e2 = `shadow-float`, no border.
Shadow color is cool-tinted `oklch(0.3 0.03 220 / a)`. **Border OR shadow, never both when blur exceeds
8px.** No ghost cards, no side-stripe borders, no glassmorphism, no gradient text.

## Motion

Durations: `--d1` 120ms hovers, `--d2` 200ms menus/toggles/small state changes, `--d3` 350ms panels/popovers/page crossfade,
`--d4` 600ms per pipeline choreography step. Easings: `--ease-std cubic-bezier(0.4, 0, 0.2, 1)` morphs,
`--ease-out cubic-bezier(0.16, 1, 0.3, 1)` entrances, `--ease-in cubic-bezier(0.4, 0, 1, 1)` exits, linear
for packet travel. anime.js mappings: easeOutExpo entrances, easeInOutQuad morphs, linear packets.

Rules:

- Animate transform and opacity only, plus SVG stroke-dashoffset / packet position on graph surfaces.
- Choreography is IntersectionObserver-triggered, plays once, pauses offscreen. NEVER scroll-driven content, NEVER scroll locking or hijacking. (Scroll timelines, CSS `animation-timeline` or a WAAPI `ScrollTimeline`, are allowed for the page wire and progress ring because they are passive chrome.)
- Loops are finite or pausable. `prefers-reduced-motion: reduce` gets completed end states (global kill switch exists in global.css).
- No bounce, spring, or overshoot. Content is visible by default; entry animation never gates readability.
- `.reveal` (CSS scroll-driven, transform-only rise, no opacity fade) is used on the home gallery; never place it on elements that graph edges attach to.

## Iconography

Phosphor regular weight only, via `astro-icon` + `@iconify-json/ph`. Sizes 16 (chips, labels), 18 (inline),
24 (slots, empty states). Icons inherit `currentColor`, carry `aria-hidden` when decorative, and never
replace a visible label. No filled/duotone/bold variants.

## Node-graph motif

Anatomy (all classes in global.css):

- **Node** `.node`: card radius, real 1.5px border, min 160x56 desktop. One padded card, no header band. The optional title row is `.node-head`: sentence-case sans, 0.8125rem/600 ink, padding 0.75rem 0.875rem 0. Node titles are literal ("8 files for one practice"), never slogans. States via `data-state`: idle = `line` border; `active` = `graphic-deep` border + `shadow-raised`; `done` = `graphic` border + 14px `ph:check` (`.node-check`) on the title row.
- **Port** `.port[data-side="in|out|up|down"]`: 8px circle centered on the border edge (offset `var(--port-off)`), white fill, 1.5px `graphic-deep` stroke. Ports exist ONLY where an edge attaches.
- **Edge** `.edge[data-state]` (SVG path): cubic bezier, horizontal tangents (exit right, enter left; exit bottom, enter top). 1.5px. Idle `line`, active `graphic-deep`, done `graphic`. Edges never cross, never loop, no diagonal free curves.
- **Packet** `.packet`: 6px `graphic-deep` dot, 2px white ring, linear travel, one per active edge, 600ms stagger. Packets only move; a packet at rest is a bug.
- **Canvas** `.grid-canvas` / `.grid-canvas-ink`: 24px dot grid. ONLY behind genuine graph surfaces (hero graph, pipeline stages, closing band). Never texture.

Rules: max 6 nodes per graph outside the pipeline demo; every node title is real production vocabulary; mono
appears on a graph only for literal file names, paths, or code (titles, captions, legends are sans); no
gradients, glows, or neon on wires. Layout/animation helpers live in `src/scripts/graph.ts` (`layoutEdges`,
`drawEdge`, `sendPacket`, `reducedMotion`, `watchVisibility`). Edges idle grey and turn done only after a
packet crosses them. `data-route="elbow"` (or `data-route-compact` for the stacked layout) routes an edge
orthogonally with one rounded corner, for edges that must not cut across other nodes.

- **Page wire** (`PageWire.astro`, home only, >= 1360px): one path from under the proof rail, down a gutter
  beside each `data-wire-section`, crossing to the other gutter in the whitespace between sections
  (`data-wire-stay` on a section keeps the previous gutter, used for the two pipeline sections), and turning
  into the closing CTA panel. Every bend meets its straight runs with zero curvature (doubled cubic control
  points), so runs never kink into curves. A ball rides it level with 55% of the viewport and the wire fills
  teal behind it; on the final approach the ball crosses the panel along the panel's own line and reaches
  "Get in touch" exactly when the button is at the middle of the viewport, where it docks. One WAAPI
  `ScrollTimeline`, no scroll listeners. Reduced motion or no support: static grey wire, no ball. The strokes
  sit behind all content; only the 12px ball is layered above (it may cross the ink panel).
- **CTA arrival** (`ClosingCta.astro`, all widths): when the button's center reaches the middle of the
  viewport (IntersectionObserver on a 1px marker with pixel root margins), the button gets one ring pulse
  (600ms, never loops, once per arrival from below). Skipped on a hidden tab and under reduced motion.
- **Pipelines**: two sections, each with its own copy and graphic. `AdGenerator.astro` shows the decisions
  (persona and brand kit picked from stacks, a template picked from the five, content curated per slot)
  feeding Render and the 8-file output; `PhotoIntake.astro` walks one example shoot through select and
  discard, sort, name, and the production library. Choreography lives in `src/scripts/ad-generator.ts` and
  `src/scripts/photo-intake.ts` on the shared runner in `src/scripts/pipeline.ts`. Each run is under 5s,
  starts from a reachable sentinel, ships and rests in its finished state, and settles instantly
  (`data-instant`) offscreen, in a hidden tab, or under reduced motion.
- **Who does what** (`AiBento.astro`): three nodes; the last, "I sign off", is a centered seal with one
  stamp pulse when the packet pass reaches it.
- **Footer status panel** (`Footer.astro`): "Before you email me", with availability, response time, and time
  zone as placeholders, the email with a copy button (`src/scripts/copy-email.ts`, shared with /contact), and
  the resume download.
- **Render demo** (`AiBento.astro`): the illustrative code types out, then each terminal row lights its code
  line and ticks the matching gate in "Nothing renders half set up". The moving copy is `aria-hidden` with
  an sr-only copy, the pane height is reserved, and it ships finished.
- **Count-up** (`CountUp.astro`): verified numbers count up once when 60% visible (900ms, ease out). Prefixes
  and suffixes stay exact. Never on dates, ratios, file names, or placeholders.

## The mark

`src/components/Mark.astro`, fixed geometry (viewBox 0 0 40 40, 3.2 strokes, round caps; group transform
`translate(1 -1.6)`; ports r2.6 at 18,9 and 12,34.2). Variants: currentColor strokes + `graphic` ports
(default); `tile` = `primary` r-2 tile, white strokes, `graphic-tint` ports. Clear space: one port height
(13% of mark) all sides. Min 16px (tile 24px). Never recolor ports, never rotate, shadow, outline, or
redraw. Lockup: mark 32px + 10px gap + "Julienna Batten" Funnel Display 600 at -0.01em.

## Component inventory

| Thing | Where | Notes |
| --- | --- | --- |
| Global classes: `.shell .meta .btn(-primary/-ghost/-invert/-outline-invert/-sm) .link .chip .ph-frame .ph-chip .grid-canvas(-ink) .node .node-head .node-check .port .edge .packet .window .reveal` | `src/styles/global.css` | Never redefine locally; page-local classes go in component `<style>` |
| `<Base title description>` | `src/layouts/Base.astro` | Wraps every page: nav, footer, back-to-top, skip link, fonts, view transitions |
| `<Mark size tile? />` | `src/components/Mark.astro` | The monogram |
| `<Slot ratio brief radius? />` | `src/components/Slot.astro` | EVERY self-provided image until the real asset lands |
| `<PageWire />` | `src/components/PageWire.astro` | Home page only, first child of `<main>` |
| `<CountUp text />` | `src/components/CountUp.astro` | Verified numbers only |
| Nav, Footer, BackToTop, HeroGraph, AdFrame | `src/components/` | Owned by the home shell |
| `href()` | `src/lib/url.ts` | Wraps ALL internal links and public asset URLs |
| Copy + facts | `src/data/site.ts` | Single source for stats, brands, personas, templates |
| Brand-guide specimens | `src/components/brand/` | `/brand` page only |

Component rules: one CTA label per intent ("Get in touch" for contact, "See the work" for the portfolio,
"View project" for project links). Buttons are pills, 44px (36px `.btn-sm`). Labels above inputs, never
placeholder-as-label; errors use `danger` border + `danger` message with `ph:warning-circle`. Window chrome
titles are sentence-case sans (`.meta`) or absent, never mono. No tabs that hide content: parallel content
shows in parallel. No 3 identical cards in a row; no pills overlaid on images; no scroll cues; no decorative
dots (a dot grid must have nodes on it).

## Voice

- ZERO em dashes and en dashes in visible copy AND in source strings. Commas, colons, periods, parentheses, hyphen ranges (2019-2022).
- Banned: streamline, empower, supercharge, leverage, unleash, transform, seamless, elevate, cutting-edge, world-class, next-gen, game-changer.
- Sentence case headlines, 8 words max; subcopy 25 words max, 65ch measure.
- No all-caps eyebrow labels above section headings, and no section numbering. There is no uppercase label anywhere: small labels are sentence-case sans (`.meta`); mono is reserved for literal file names, paths, and code.
- Full voice rules, banned sentence shapes, and before/after rewrites: `VOICE.md`. Write from it at the source.
- First person, always: the site is Julienna speaking about her own work ("I built", "my pipelines", "email me"). Never "she", "her", or "Jules does" in site copy.
- "Julienna Batten" appears only as identity (nav lockup, page titles, the hero operator node). No invented client names ("Sample" labels instead).

## Placeholder policy

Unknown numbers, missing logos, missing images, missing quotes: dashed treatment (`.ph-frame`, `.ph-chip`,
`<Slot />`), a sentence-case label naming exactly what belongs there, listed in CONTENT-TODO.md. Placeholders never
carry plausible fake data. Only resume-verified figures ship unmarked (see `src/data/site.ts`).

## Performance and accessibility requirements

- Static Astro output; JS only where something is genuinely interactive. Lighthouse performance > 80 (target 95) WITHOUT GPU acceleration; WebGL uses `failIfMajorPerformanceCaveat: true` with a static CSS fallback.
- Fonts self-hosted and preloaded; no layout shift (reserve space, `aspect-ratio` on slots).
- No scroll locking, hijacking, or guided scroll experiences. Anchors scroll natively (`scroll-padding-top` set globally).
- WCAG AA: text >= 4.5:1, non-text state graphics >= 3:1 (see Color table), visible `:focus-visible` ring (2px `graphic-deep`, 3px offset), skip link, labels tied to inputs, `aria-current` for location, decorative SVG/icons `aria-hidden`.
- `prefers-reduced-motion`: end states shown, loops disabled (global kill switch + per-surface checks via `reducedMotion` in graph.ts).
- Custom scrollbar and back-to-top progress ring are progressive enhancements with inert fallbacks.

## Downloads (public/brand-kit/)

`jb-mark.svg`, `jb-mark-tile.svg`, `jb-lockup.svg` (live `<text>` wordmark: convert to outlines before print
handoff), `tokens.css` (light + documented dark custom properties), `tokens.json` (W3C design-tokens format),
`fonts.md` (faces, sources, OFL licenses, serving rules). Link them through `href('/brand-kit/<file>')`.
