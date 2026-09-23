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
| `surface` | `oklch(0.978 0.004 200)` | Bands: proof rail, footer, tab bars | |
| `surface-2` | `oklch(0.955 0.006 200)` | Inset wells, segmented tracks, chips | |
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

Two faces, self-hosted, `font-display: swap`, sans preloaded in `Base.astro`:

- **Host Grotesk** (variable, `src/assets/fonts/host-grotesk-var.woff2`): all prose. Weights 400 body, 500 medium, 600 headings/buttons, 650 display/stats.
- **Commit Mono** (`src/assets/fonts/commit-mono-500.woff2`): data only. Node titles, port labels, file names, JSON excerpts, stat labels, placeholder labels, `.label`. Never prose, never headlines.

Scale (each `text-*` utility sets size, line-height, tracking, weight):

| Utility | Size | lh / ls / wt |
| --- | --- | --- |
| `text-display` | `clamp(2.5rem, 1.6rem + 3.4vw, 4rem)` | 1.05 / -0.03em / 650 |
| `text-h2` | `clamp(2rem, 1.5rem + 1.8vw, 3rem)` | 1.1 / -0.025em / 600 |
| `text-h3` | `clamp(1.25rem, 1.1rem + 0.6vw, 1.5rem)` | 1.25 / -0.015em / 600 |
| `text-body` | `clamp(1rem, 0.95rem + 0.2vw, 1.125rem)` | 1.6 / 0 / 400, max 65ch |
| `text-small` | `0.875rem` | 1.5 / 0 / 400 |
| `text-label` | `0.75rem` (mono, uppercase) | 1.4 / +0.08em / 500 |
| `text-stat` | `clamp(1.75rem, 1.4rem + 1.2vw, 2.5rem)` | 1.1 / -0.02em / 650, `tabular-nums` |

Rules: tracking never tighter than -0.04em; only display/h2/stat go negative. Headlines are sentence case,
eight words max, `text-wrap: balance` (global). Sub-paragraphs 25 words max. Stats always tabular.

## Layout

- One container: `.shell` = `min(1200px, 100% - 2 * var(--gutter))`; `--gutter: clamp(20px, 4vw, 24px)`.
- 12 columns, 24px gaps on desktop; 4px spacing base everywhere.
- Section rhythm `clamp(80px, 12vh, 128px)`; full-bleed bands use 64px inner padding.
- Breakpoints: 640, 768, 1024, 1280. The left-gutter section wire renders at >= 1360px (`--breakpoint-wire: 85rem`) only, on the home page's `data-wired` sections.
- Verify every layout at 390, 768, 1024, 1440. No horizontal page overflow ever; wide specimens scroll inside their own frame.

## Radius and elevation

Radii (`rounded-*`): `inset` 8px (inputs, swatches, segmented controls, nested media), `card` 12px (cards,
nodes, windows, bento cells), `media` 16px (feature imagery, graph canvases), `full` 999px (buttons, chips,
ports, nav). **Nesting rule: a child container steps down exactly one radius.**

Elevation: e0 = flat, 1px `line` border. e1 = `shadow-raised`, no border. e2 = `shadow-float`, no border.
Shadow color is cool-tinted `oklch(0.3 0.03 220 / a)`. **Border OR shadow, never both when blur exceeds
8px.** No ghost cards, no side-stripe borders, no glassmorphism, no gradient text.

## Motion

Durations: `--d1` 120ms hovers, `--d2` 200ms tabs/menus/toggles, `--d3` 350ms panels/popovers/page crossfade,
`--d4` 600ms per pipeline choreography step. Easings: `--ease-std cubic-bezier(0.4, 0, 0.2, 1)` morphs,
`--ease-out cubic-bezier(0.16, 1, 0.3, 1)` entrances, `--ease-in cubic-bezier(0.4, 0, 1, 1)` exits, linear
for packet travel. anime.js mappings: easeOutExpo entrances, easeInOutQuad morphs, linear packets.

Rules:

- Animate transform and opacity only, plus SVG stroke-dashoffset / packet position on graph surfaces.
- Choreography is IntersectionObserver-triggered, plays once, pauses offscreen. NEVER scroll-driven content, NEVER scroll locking or hijacking. (CSS `animation-timeline` is allowed for the wire and progress ring because it is passive chrome.)
- Loops are finite or pausable. `prefers-reduced-motion: reduce` gets completed end states (global kill switch exists in global.css).
- No bounce, spring, or overshoot. Content is visible by default; entry animation never gates readability.
- `.reveal` (CSS scroll-driven, transform-only rise, no opacity fade) is used on the home gallery; never place it on elements that graph edges attach to.

## Iconography

Phosphor regular weight only, via `astro-icon` + `@iconify-json/ph`. Sizes 16 (chips, labels), 18 (inline),
24 (slots, empty states). Icons inherit `currentColor`, carry `aria-hidden` when decorative, and never
replace a visible label. No filled/duotone/bold variants.

## Node-graph motif

Anatomy (all classes in global.css):

- **Node** `.node`: card radius, real 1.5px border, min 160x56 desktop. `.node-bar` mono title bar on surface with bottom hairline. States via `data-state`: idle = `line` border; `active` = `graphic-deep` border + `shadow-raised`; `done` = `graphic` border + 14px `ph:check` (`.node-check`) in the bar.
- **Port** `.port[data-side="in|out|up|down"]`: 8px circle centered on the border edge (offset `var(--port-off)`), white fill, 1.5px `graphic-deep` stroke. Ports exist ONLY where an edge attaches.
- **Edge** `.edge[data-state]` (SVG path): cubic bezier, horizontal tangents (exit right, enter left; exit bottom, enter top). 1.5px. Idle `line`, active `graphic-deep`, done `graphic`. Edges never cross, never loop, no diagonal free curves.
- **Packet** `.packet`: 6px `graphic-deep` dot, 2px white ring, linear travel, one per active edge, 600ms stagger. Packets only move; a packet at rest is a bug.
- **Canvas** `.grid-canvas` / `.grid-canvas-ink`: 24px dot grid. ONLY behind genuine graph surfaces (hero graph, pipeline stage, footer sitemap, closing band). Never texture.

Rules: max 6 nodes per graph outside the pipeline demo; every node label is real production vocabulary; mono
never leaks from graph surfaces into prose; no gradients, glows, or neon on wires. Layout/animation helpers
live in `src/scripts/graph.ts` (`layoutEdges`, `drawEdge`, `sendPacket`, `reducedMotion`, `watchVisibility`).

## The mark

`src/components/Mark.astro`, fixed geometry (viewBox 0 0 40 40, 3.2 strokes, round caps; group transform
`translate(1 -1.6)`; ports r2.6 at 18,9 and 12,34.2). Variants: currentColor strokes + `graphic` ports
(default); `tile` = `primary` r-2 tile, white strokes, `graphic-tint` ports. Clear space: one port height
(13% of mark) all sides. Min 16px (tile 24px). Never recolor ports, never rotate, shadow, outline, or
redraw. Lockup: mark 32px + 10px gap + "Julienna Batten" Host Grotesk 600 at -0.01em.

## Component inventory

| Thing | Where | Notes |
| --- | --- | --- |
| Global classes: `.shell .label .btn(-primary/-ghost/-invert/-outline-invert/-sm) .link .chip .ph-frame .ph-chip .grid-canvas(-ink) .node .node-bar .node-check .port .edge .packet .window .wire .reveal` | `src/styles/global.css` | Never redefine locally; page-local classes go in component `<style>` |
| `<Base title description>` | `src/layouts/Base.astro` | Wraps every page: nav, footer, back-to-top, skip link, fonts, view transitions |
| `<Mark size tile? />` | `src/components/Mark.astro` | The monogram |
| `<Slot ratio brief radius? />` | `src/components/Slot.astro` | EVERY self-provided image until the real asset lands |
| `<Wire portTop? />` | `src/components/Wire.astro` | Home page `data-wired` sections only |
| Nav, Footer, BackToTop, HeroGraph, AdFrame | `src/components/` | Owned by the home shell |
| `href()` | `src/lib/url.ts` | Wraps ALL internal links and public asset URLs |
| Copy + facts | `src/data/site.ts` | Single source for stats, brands, personas, templates |
| Brand-guide specimens | `src/components/brand/` | `/brand` page only |

Component rules: one CTA label per intent ("Get in touch" for contact, "See the work" for the portfolio,
"View project" for project links). Buttons are pills, 44px (36px `.btn-sm`). Labels above inputs, never
placeholder-as-label; errors use `danger` border + `danger` message with `ph:warning-circle`. Segmented
controls: `surface-2` track, white active pill on `shadow-raised`. No 3 identical cards in a row; no pills
overlaid on images; no scroll cues; no decorative dots (a dot grid must have nodes on it).

## Voice

- ZERO em dashes and en dashes in visible copy AND in source strings. Commas, colons, periods, parentheses, hyphen ranges (2019-2022).
- Banned: streamline, empower, supercharge, leverage, unleash, transform, seamless, elevate, cutting-edge, world-class, next-gen, game-changer.
- Sentence case headlines, 8 words max; subcopy 25 words max, 65ch measure.
- Eyebrow labels on at most 1 of every 3 headed sections. No section numbering.
- First person, always: the site is Julienna speaking about her own work ("I built", "my pipelines", "email me"). Never "she", "her", or "Jules does" in site copy.
- "Julienna Batten" appears only as identity (nav lockup, page titles, the hero operator node). No invented client names ("Sample" labels instead).

## Placeholder policy

Unknown numbers, missing logos, missing images, missing quotes: dashed treatment (`.ph-frame`, `.ph-chip`,
`<Slot />`), mono label naming exactly what belongs there, listed in CONTENT-TODO.md. Placeholders never
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
