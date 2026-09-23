# Round 4 spec: split the pipeline window into two deep sections

Replaces `src/sections/Pipeline.astro` (deleted) with `src/sections/AdGenerator.astro` + `src/sections/PhotoIntake.astro`, rendered in `index.astro` as `<AdGenerator /><PhotoIntake />` directly after `<Hero />` (which contains the proof rail) and before `<AiBento />`. Order rationale: the ad generator is the flagship SaaS proof and keeps the `#systems` nav anchor; photo intake follows as the second verified pipeline.

## 0. File map

| File | Action |
| --- | --- |
| `src/sections/AdGenerator.astro` | New. Owns section copy + ad decision graphic + inline script block. |
| `src/sections/PhotoIntake.astro` | New. Owns section copy + photo phase graphic + inline script block. |
| `src/sections/Pipeline.astro` | Deleted (including `.pl-results`, `.lane-*`, footnote). |
| `src/scripts/pipeline.ts` | Keep `createLaneRunner` and the `Run` primitives as-is. Rewrite `createAdGenerator` and `createPhotoIntake` choreography to the tables below. |
| `src/components/AdFrame.astro` | Unchanged (whole-frame reveal; no per-zone animation). |
| `src/data/site.ts` | Unchanged (personas, templates reused). |
| `src/data/split-stack.json` | Unchanged (drives AdFrame and the chosen Split Stack schematic). |
| `src/pages/index.astro` | Swap import/component. |
| `CONTENT-TODO.md` | Keep the four `Add before`/`Add after` entries and the `~320` verify entry; update locations. |

Both sections keep `data-wire-section` (page wire ownership is a sibling ticket; nothing here changes the wire contract). One shared inline-script pattern per section, copied from the current Pipeline block: `layoutEdges(graph)`, one runner, `watchVisibility(graph, …, 0.45)` to start once, `watchVisibility(section, …, 0)` + `visibilitychange` to settle offscreen/hidden, replay re-arms when offscreen, sr-only `role=status` announced only on explicit replay.

## 1. Shared decisions

**Replay control: one button per section, no pause button.** Each run is under 5s (ad ≈ 4.4s, photo ≈ 3.9s), so WCAG 2.2.2 is satisfied without a pause control; the replay button (`btn btn-ghost btn-sm`, `ph:arrow-counter-clockwise` 16, label "Replay pipeline") sits at the right end of each section header row and ships `hidden`, unhidden by JS. Separate buttons because the two sections are now independent surfaces; one shared button would replay a graphic the user may not be looking at.

**State model (identical in both sections):**

| State | How it is reached | What it looks like |
| --- | --- | --- |
| Shipped / no-JS | default markup | Everything in finished state: edges `done` (teal), chosen cards checked, all output items visible, tickers show final file name/path, zones populated. |
| Ready | JS `reset()` when motion is allowed and before first visibility | Edges grey (`data-state` cleared), deck front cards show the two cycle-through names, checks/rings hidden, not-done items at `opacity: .25` (never 0: content is never gated), tickers show idle text ("Waiting for render" / "Waiting for the shoot"). |
| Running | IO at 0.45 of the graphic, once | Choreography tables below. |
| Finished | end of run, `finish()`, reduced motion, offscreen settle | Identical to shipped state. |
| Reduced motion | `reducedMotion.matches` at load or mid-run | `finish()` immediately; replay button still works and just re-asserts the finished state. |

## 2. Section A: Ad generator (`id="systems"`, `aria-labelledby="systems-title"`)

### 2.1 Copy (exact strings; all first person, no em/en dashes)

Header row (flex, items-end, justify-between):
- H2 `text-h2`, max 20ch: **"One brief becomes a whole campaign"**
- Replay button (right end).

Intro, `mt-4 max-w-[58ch] text-body text-muted`:
> "Around 40 practices each need 8 ad files per campaign, so I built a generator that renders every version from rules instead of a blank artboard."

Copy column body (three paragraphs + fact list + stat + chips line; `text-body text-muted`, paragraphs max 25 words):
1. "The tool walks five gated steps: persona, brand kit, template, content, render. A gate stays shut until the step before it is set."
2. "Claude helps me draft new templates, but fixed rules render the ads. No LLM touches the render path, so any file can be regenerated exactly."
3. "The steps match the tool I use at OrthoBoost. Practice and file names are stand-ins, because client work stays private. The file names look fussy until the third campaign."

Compact fact list (`text-small text-ink`, `ph:check` 16 teal bullets, two items):
- "8 files per practice: V1 and V2, Story and Post, static and animated."
- "A matching site template ships alongside: nav, hero, footer."

Stat line (plain text, NOT `CountUp`: the figure is an estimate): `text-stat` "About 320" + `text-small text-muted` " files per campaign across around 40 practices." + `.ph-chip` `data-todo="verify"` "Estimate, verify".

Time line: `.meta text-muted` "Production time per campaign:" + `.ph-chip` `data-todo="metric"` "Add before" + `ph:arrow-right` 12 (aria-label "to") + `.ph-chip` "Add after".

Rationale: the removed results row's verified facts survive as prose (8 deliverables, site template), the estimate keeps its chip, and the unknown time cost becomes an inline placeholder pair instead of a fake dashboard row.

### 2.2 Layout

- Section: `relative py-[clamp(80px,12vh,128px)]`, `.shell`.
- **1440 / 1280:** after the header/intro, a 12-col grid, 24px gaps. Copy column spans 4 (384px). Graphic panel spans 8 (792px), `.window` + `grid-canvas`, `container-type: inline-size`, padding 24px. Internal grid: `grid-template-columns: 292px 128px 272px; gap: 24px` (selection rail | render column | output node). Panel height ≈ 600px, set by the rail; render node vertically centered.
- **1024:** copy and graphic stack (copy above, grid 1 col); panel keeps its 3-col internal grid (inner ≈ 904px at this width, still fits).
- **390 / 320** (`@container (max-width: 900px)` on the panel): single column, compact edge variants (`data-from-compact`/`data-to-compact` chain straight down: content:down → render:up, render:down → output:up). Padding 16px. Template schematics shrink to 36px wide; output matrix stays 2 groups of 4 frames; ticker wraps via existing `wrap-anywhere`. At ≤380px the output matrix collapses to one column of two groups (existing rule). The rail groups keep four different shapes (deck, deck, schematic row, slot rows), so the mobile stack is not a repeated list.

### 2.3 Graphic anatomy (the decision rail)

Four chained gate groups feed Render, which feeds the output node. Five edges, five pooled `circle.packet`s. Each group label is `.meta text-muted` sentence case. No persona accent colors anywhere except inside the output `AdFrame`s (rule honored: deck cards are text-only neutrals; the chosen card is marked with the brand `graphic-deep` ring + check, never persona color).

1. **Persona group** — label "Persona · stack of 11". A 3-card deck (two blank `deck-card` outlines behind, existing `.deck-1`/`.deck-2` geometry). Front card is a `.node` (`data-stage`, `data-node="ad-persona"`): `ph:user-circle` 18 teal, name `text-small text-ink`, archetype `text-[0.75rem] text-muted`. Ships showing the final choice "Dr. V. Frizzle / The Wellness Educator"; `reset()` swaps the two cycle cards in front ("Dr. K. Clarkson", "Dr. G. House") via `data-persona-name`/`data-persona-type` spans.
2. **Brand kit group** — label "Brand kit · stack of ~40". Same deck; front card: `ph:swatches` 18, "SamplePractice", plus a row of three neutral swatch bars (`surface-2`, `ink` at 0.18, `muted` at 0.3; neutral only, since kit colors are client content). Behind cards blank.
3. **Template group** — label "Template · 5 in the library". Row of five mini schematics, one per real template (`templates` from site.ts): Badge Burst (center circle badge + 2 bars), Hero Banner CTA (top bar + bottom-right pill), Offer Card (left block + right bar), Split Stack (top photo rect + 2 bars + pill, matching split-stack.json proportions), Testimonial Frame (quote bars + avatar circle). Each 40x48px neutral wireframe (`line` border, `surface-2`/`ink`-alpha fills, 6px radius) with a `text-[0.6875rem] text-muted` two-line label under. Chosen = `graphic-deep` ring + 14px `ph:check-bold` badge top-right.
4. **Content group** — label "Content · one pick per slot" + `.ph-chip` "Sample copy". Five slot rows (slot name `.meta`, candidates as small chips/thumbs), one chosen per Split Stack slot:
   - headline (1 of 3 text chips): chosen "A straighter smile starts here"; losers "New patients welcome this season", "Braces that fit your schedule".
   - subhead (1 of 2): chosen "Clear aligners and braces for every age."; loser "Book a consult in minutes."
   - cta (1 of 2 pill chips): chosen "Book a consult"; loser "See pricing".
   - photo (1 of 3 neutral thumbs, `ph:image` 16): chosen gets the ring.
   - logo (1 fixed neutral block): caption "From the brand kit".
   Chosen chip: `graphic-deep` border + `ph:check` 12; losers rest at `opacity: .4`.
5. **Render node** (existing `.ads-render` treatment, `data-render`, `ph:cpu` 20): title "Render", sub "Fixed rules, no LLM".
6. **Output node** (existing structure, `data-output`, `--persona` set per run): head "8 files for one practice", the 2x4 V1/V2 matrix of `AdFrame`s with `ph:image`/`ph:film-strip` icons, then ticker row (`font-mono text-[0.6875rem]`, `data-ticker`, `data-idle="Waiting for render"`, `data-final="Seasonal_Summer-2026_Video_V2_Post_SamplePractice"`, sr-only static example, `.ph-chip` "Illustrative").

Edges: persona:down→kit:up, kit:down→template:up, template:down→content:up (short vertical chains inside the rail), content:out→render:in (`data-route="elbow"`), render:out→output:in. Compact variants point down/up through the stack.

### 2.4 Choreography (autoplay ≈ 4.4s; all transform/opacity + edge stroke + packet position)

| # | t (ms) | Element | Change | Dur. | Ease |
| --- | --- | --- | --- | --- | --- |
| 1 | 0 | persona deck top card | translateX 0→110%, rotate 0→3deg, opacity→0 | 200 | easeInQuad |
| 2 | 190 | persona deck next card | same exit | 200 | easeInQuad |
| 3 | 400 | persona front card | `data-state` active→done; ring + check scale .6→1, opacity 0→1 | 180 | easeOutExpo |
| 4 | 560 | edge persona→kit | packet travel; edge active→done | 250 | linear |
| 5 | 700 | kit deck card 1 | exit (overlaps packet) | 200 | easeInQuad |
| 6 | 890 | kit deck card 2 | exit | 200 | easeInQuad |
| 7 | 1100 | kit front card | done + check | 180 | easeOutExpo |
| 8 | 1220 | edge kit→template | packet | 250 | linear |
| 9 | 1400 | 5 template schematics | scan: each flashes `active` border, 60ms apart, left to right, ending on Split Stack | 60 ea | easeInOutQuad |
| 10 | 1750 | Split Stack schematic | done: ring scale .92→1 + check | 200 | easeOutExpo |
| 11 | 1900 | edge template→content | packet | 250 | linear |
| 12 | 2100 | content picks | headline chosen (losers→.4, chosen check+ring), then subhead/cta/photo/logo at +120 staggers | 160 ea | easeOutExpo |
| 13 | 2740 | edge content→render | packet | 250 | linear |
| 14 | 2960 | render node | `active` | 350 | state only |
| 15 | 3310 | render node + edge→output | render `done`; packet | 250 | linear |
| 16 | 3560 | output node + file 1 | output `active`; item `done`: opacity .25→1, translateY 3px→0, scale .94→1; ticker shows file 1 name | 200 | easeOutExpo |
| 17 | 3700 | files 2-8 | `done` staggered 55ms in reading order; ticker streams each `data-name` | 200 ea | easeOutExpo |
| 18 | ≈4360 | output node | `done`; ticker sets `data-final` | — | — |

Overlap note (kit cycle starts while the persona packet is still flying) is deliberate: it reads as the next gate opening, and it keeps autoplay under 5s. Replay keeps the existing persona rotation: each run advances to the next persona in `site.ts`, updating the front card text and `--persona` on the output node (frames re-tint; allowed inside output previews).

## 3. Section B: Photo intake (`id="intake"`, `aria-labelledby="intake-title"`)

### 3.1 Copy (exact strings)

Header row: H2 **"From raw shoot to production library"** + replay button.

Intro:
> "Client shoots arrive as hundreds of unsorted frames. This pipeline turns one shoot into a library that web, ads, social, and print can pull from directly."

Copy row, two text columns at 1440 (each max 58ch):
- Col 1: "I select the keepers, discard the rest, sort by destination, and rename every file to one convention before anything reaches the library."
- Col 2: "The steps and folders shown here are examples. Client shoots stay private, so this shoot is a stand-in." + time line: `.meta` "Hours per photo shoot:" + `.ph-chip` "Add before" + arrow + `.ph-chip` "Add after".

This folds in the removed footnote's photo half and relocates the removed "Hours per photo shoot" placeholders.

### 3.2 Layout

Copy sits **above** the graphic here (contrast with section A's side-by-side; the photo flow is a left-to-right process and wants full width).

- **1440/1280:** graphic `.window` + `grid-canvas` panel, full shell width (1200px), padding 24px, `container-type: inline-size`. Inner row of five zones with 20px gaps: Raw 240 | Select 160 | Sort 200 | Name 254 | Library 218 (sums to 1152 with gaps). Zone heights: Raw 190px; others sized to content (~170px), vertically centered.
- **1024 and below** (`@container (max-width: 1152px)`): compact vertical stack, zones full width in process order with down/up compact edges. Zone shapes are all different (scatter field, tidy row, clusters, tag cards, folder rows), so the stack is not an identical-list repeat. Raw zone 200px tall.
- **390 / 320:** same stack; thumbs shrink (30x22 base), name tags 4→2 columns, panel padding 16px.

### 3.3 Graphic anatomy (literal phases, left to right)

Zones are `surface-2` inset wells, `rounded-inset` (one radius step down from the panel), each with a `.meta text-muted` label and `.port` anchors where edges attach. Four edges, four pooled packets: raw:out→select:in, select:out→sort:in, sort:out→name:in, name:out→library:in (compact: down→up).

1. **Raw shoot** — 15 thumbs absolutely positioned (seeded scatter, keep the existing PRNG approach; rotations ±4deg; three aspect ratios: 34x26 landscape, 26x34 portrait, 30x30 square; `surface-2` fill, `line` border, `ph:image` 13 on every third). Label "Raw shoot · 15 frames". 7 thumbs carry `data-reject`; in finished/selected states they rest at `opacity: .18; scale: .85` with a 12px `ph:x` badge (`muted`). Keepers stay full opacity.
2. **Select** — the 8 keepers in a 4x2 tidy grid (34x26), each with a `graphic-deep` ring + 12px teal `ph:check-bold` badge. Label "Select · 8 keepers".
3. **Sort** — the 8 keepers in four labeled 2-thumb clusters (2x2 arrangement of clusters); cluster labels are literal folder names in mono `text-[0.6875rem]`: `/web`, `/ads`, `/social`, `/print`. Label "Sort · by destination".
4. **Name** — the 8 keepers as file cards (thumb 40x30 over a mono `text-[0.625rem]` tag), revealed in cluster order. Names follow `{dest}_{subject}_{nn}.{ext}`: `web_hero_01.webp`, `web_team_02.webp`, `ads_offer_01.jpg`, `ads_story_02.jpg`, `social_smile_01.jpg`, `social_tip_02.jpg`, `print_broch_01.tif`, `print_card_02.tif`. Label "Name · one convention".
5. **Production library** — keeps the existing `.node lane-out` output treatment: head "Production library", four folder rows (`ph:folder-simple` 16 teal, mono `/web` etc., two 22x15 thumbs per row), then the ticker row: `data-idle="Waiting for the shoot"`, `data-final="library/print/print_card_02.tif"`, streams `library/web/web_hero_01.webp` → `library/ads/ads_offer_01.jpg` → `library/social/social_smile_01.jpg` → final; sr-only static example; `.ph-chip` "Illustrative".

### 3.4 Choreography (autoplay ≈ 3.9s)

Phases are CSS-owned: the runner only flips `data-state` on zone wrappers and items (transitions: transform/opacity, `--d3` 350ms max, per-item `transition-delay` from `--k` custom props) and sends packets.

| # | t (ms) | Element | Change | Dur. | Ease |
| --- | --- | --- | --- | --- | --- |
| 1 | 0 | raw zone `active`; 7 rejects | staggered 40ms: opacity→.18, scale→.85, `ph:x` badge fades in | 180 ea | easeInOutQuad |
| 2 | 300 | edge raw→select | packet | 250 | linear |
| 3 | 550 | select zone `active`; 8 keepers | staggered 60ms: opacity .25→1, translateY 6px→0; check badges +90ms behind each | 200 ea | easeOutExpo |
| 4 | 1250 | edge select→sort | packet | 250 | linear |
| 5 | 1500 | sort zone `active` | clusters appear one per 120ms (tiles translateY 6px→0, mono cluster labels fade) | 200/cluster | easeOutExpo |
| 6 | 2200 | edge sort→name | packet | 250 | linear |
| 7 | 2450 | name zone `active` | 8 file cards staggered 70ms in cluster order (opacity, translateY 2px→0; name tag appears with its card) | 150 ea | easeOutExpo |
| 8 | 3150 | edge name→library | packet | 250 | linear |
| 9 | 3400 | library node `active` | 4 folder rows fill staggered 90ms (thumbs fade in); ticker streams the four paths | 180 ea | easeOutExpo |
| 10 | ≈3900 | library node `done` | ticker sets `data-final` | — | — |

Static finished read: raw field with visibly discarded rejects, tidy checked keepers, four labeled clusters, eight named file cards, four filled folders. Every verb in the user's feedback (selected/discarded, sorted, named, placed) has its own literal visual moment.

## 4. Removal confirmations (revisions 5 and 6)

- `.pl-results` row: **removed entirely.** "8 deliverables" and "Ships alongside: site template" → section A fact list. "Production time per campaign" chips → section A copy. "Hours per photo shoot" chips → section B copy. Rationale: the four-cell strip was a fake dashboard; the same content reads more honestly as prose plus placeholders.
- Footnote paragraph: **removed.** Its ad half becomes section A paragraph 3; its photo half becomes section B column 2.
- "About 320 files per campaign": moves from the output node into section A's copy stat line and **keeps the `.ph-chip` "Estimate, verify"**; rendered as plain text, not `CountUp` (CountUp is contractually for verified numbers only).

## 5. DOM and performance budget

- Ad panel ≈ 115 nodes (4 group wrappers, 6 deck cards, 5 schematics ≈ 30 spans, ~14 content chips, render, output with 8 AdFrames ≈ 48 spans, 5 edges, 5 packets). Photo panel ≈ 120 nodes (15 raw + 8 + 8 + 8 tiles, 8 name tags, 4 folder rows, 5 edges/packets). Both well under control; no images, no canvas, no WebGL.
- Animate transform/opacity only, plus edge stroke-color transitions and `sendPacket` position (one path-length read per flight, existing). No per-frame layout reads; `layoutEdges` runs once per play, rAF-coalesced.
- Item staggers are CSS `transition-delay` from `--k`/`--bin` custom properties set at build time, not JS timers per tile, except where the runner already owns timing via `MotionScope.wait`.
- Both graphics IO-gated at 0.45, play once, settle offscreen/hidden via the existing `watchVisibility` + `visibilitychange` pattern; replay re-arms offscreen sections instead of running them unseen.
- No `will-change`, no new fonts, no scroll listeners. Expected Lighthouse impact: negligible (two inline module scripts, same total DOM as the current window plus ~100 cheap spans).