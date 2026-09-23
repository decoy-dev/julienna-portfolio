# Round 3 design spec: items 1, 4, 6, 7

Everything below respects DESIGN.md/VOICE.md, the existing graph engine (`layoutEdges`, `sendPacket`, `drawEdge`, `MotionScope`, `watchVisibility`, `reducedMotion`), and the current shipped-final-state/no-JS pattern from `pipeline.ts`. All copy is first person, zero em/en dashes, no invented metrics. Persona accent colors appear only inside AdFrame output previews, per the color contract.

---

## Item 1: Pipelines (src/sections/Pipeline.astro + src/scripts/pipeline.ts)

Two lanes with different silhouettes: **Lane A (ad generator) is a horizontal bowtie** (four inputs converge into one Render node, which fans into 8 outputs). **Lane B (photo intake) is a vertical-density funnel** (a loose scatter field drains through two gates into sorted bins). At a 3-second glance: A reads "choices merge into a machine that stamps out files"; B reads "a mess gets sorted". They share zero layout DNA beyond node/port/edge primitives.

### Lane A: Ad generator (combine, then fan out)

**Desktop (1440; lane inner width ~1104px):** `.lane-graph` grid becomes `grid-template-columns: 288px minmax(0,1fr) 344px; gap: 48px; align-items: center`. Height ~310px.

Left column: four input nodes stacked, gap 14px, each h 64px, icon 18px `text-primary`, `.port` at right center:
1. `ph:user-circle` **Persona** / meta: current persona name + archetype on two lines is too tall; use title "Persona", meta line 1 `Dr. V. Frizzle`, meta line 2 omitted; count goes in a right-aligned `.meta text-muted` suffix: `1 of 11`. Archetype moves to a title attribute? No: put archetype as a second muted line only in the Persona node (h 76px for this one): "Dr. V. Frizzle" / "The Wellness Educator" (0.75rem muted).
2. `ph:swatches` **Brand kit** / meta "sample-practice" + suffix `1 of ~40`.
3. `ph:layout` **Template** / meta "Split Stack" + suffix `1 of 5`.
4. `ph:text-aa` **Content** / meta "Copy, photo, logo". No count suffix (single input).

Choice-set read: nodes 1-3 get a deck silhouette via `::before`/`::after` pseudo-cards behind the node (same radius-card, 1.5px `line` border, white bg, offset 3px and 6px straight down, inset-inline 3px/6px so the stack narrows). Node 4 stays single. This communicates "picked from 11 / ~40 / 5" without drawing 56 items.

Middle: Render node centered vertically, 176 x 88px, `ph:cpu` 20px, title "Render", meta "Fixed rules". (The LLM point lives in the bento H3 next door; do not repeat it here.)

Edges: 4 converging cubic beziers `persona:out -> render:in`, `brandkit:out -> render:in`, `template:out -> render:in`, `content:out -> render:in` (they bundle into the single in-port; that bunching IS the combine read), plus `render:out -> ads-out:in`.

Right: output node unchanged (344px): head "8 files for one practice", 8 AdFrames `repeat(8, 1fr)` gap 6, ticker, "About 320 files per campaign across ~40 practices." + existing "Estimate, verify" and "Illustrative" chips.

**Animation (finite, ~3.2s):** ready state = inputs idle, edges hidden, render idle, frames dim, ticker "Waiting for render". Sequence:
1. Inputs fire top to bottom: node `active` 160ms -> `done`; packet travels its edge 280ms linear; edge -> `done`. Four inputs x ~480ms = 1.92s. One packet at a time (the combine reads as assembly, not a race).
2. Render goes `active` 350ms (border `graphic-deep` + `shadow-raised` only; no spinner, no pulse).
3. Packet render->output 280ms; output `active`.
4. 8 frames pop: stagger 45ms, each `translateY(3px) scale(0.94) -> none` + opacity 0.3->1, 250ms `--ease-out` (max ~6 frames mid-flight; transform/opacity only). Ticker streams each `data-name`. All frames tinted with the run's persona color.
5. Output `done`, ticker rests on `data-final`, live region announces the existing status string.

**Persona cycling:** each Replay advances the persona index (mod 11): Persona node name + archetype update, and the 8 AdFrames re-tint. For runtime re-tint, AdFrame's `FILL` mixes must reference `var(--persona, <build-time color>)` via inline style on `.ad-frame`, so JS sets `--persona` on the output node once per run. First autoplay uses personas[0] (Dr. V. Frizzle, #48bb78). Brand kit and Template stay fixed (Split Stack is the documented excerpt).

**Mobile (390):** inputs become a 2x2 grid (Persona+Brand kit / Template+Content, each ~160px, deck silhouette kept), compact ports `down`; edges curve down into `render:up`; Render full-width-ish (max 220px, centered); output full width; frames 4x2 (extend the existing 380px container query to the compact layout). Vertical rhythm: inputs, 28px gap, Render, 28px gap, output.

### Lane B: Photo intake (scatter, funnel, sort)

**Desktop (1440):** `.lane-graph` grid `grid-template-columns: minmax(0,1.15fr) 200px 344px; gap: 48px; align-items: center`. Height ~320px.

Left zone: the raw field. 24 tiles (24 x 18px, `radius-inset` 8px scaled down: use 3px, 1.5px `line` border, `surface-2` fill; 6 of them carry a centered `ph:image` 10px at `muted`/0.5 for texture). Scatter is deterministic and server-rendered: absolute positions on a 24px-grid-snapped jitter, rotation -4deg..+4deg (precomputed array in frontmatter, stable across builds). 8 predetermined tiles carry `data-reject`. Field label: `.meta text-muted` "Raw shoot, unsorted" top-left of the zone. The field is deliberately NOT a node; it is loose content on the grid canvas.

Four feed edges start at floating ports inside the field (8px port circles, white fill, 1.5px `graphic-deep` ring, at 4 fixed anchor points among the tiles) and converge into `cull:in`. Floating ports satisfy "ports exist only where edges attach" without boxing the field.

Middle: two gate nodes stacked, gap 56px, each 168px wide, h 56px:
- `ph:funnel` **Cull** / meta "Selects kept"
- `ph:tag` **Name** / meta "One convention"
Edges: `cull:down -> name:up`, `name:out -> photos-out:in`.

Right: output node unchanged ("Production library", 4 folder rows /web /ads /social /print with 4 thumb spans each, ticker, "Illustrative" chip). The lane keeps its "Example steps" chip and the section footnote stays as is.

**Animation (finite, ~2.9s, starts 400ms after Lane A):**
1. Cull: the 8 `data-reject` tiles dim to opacity 0.2 and scale 0.9 over 400ms `--ease-std`. Simultaneously the 4 feed edges `drawEdge` 450ms, staggered 80ms, then 4 packets travel them concurrently, 400ms linear, staggered 100ms (max concurrent motion on the page: 4 packets + 8 dimming tiles).
2. Cull `active` 200ms -> `done`; packet cull->name 260ms; Name `active` 200ms -> `done`.
3. Name stamp: the 16 survivor tiles each get a 2px `ink`/0.5 bar at their bottom edge (the "tag"), fading in staggered 25ms (400ms total).
4. Packet name->library 260ms; library `active`.
5. Sort: 4 folder rows fill staggered 90ms (thumbs opacity 0.3->1, existing item reveal), and in synced batches the 16 field tiles fade to 0.35 (4 per folder, mapped by index) so the field visibly drains as the bins fill. Ticker streams each folder's `data-name`.
6. Library `done`; ticker rests.

**Static final state (server-rendered, no JS, reduced motion, settled):** rejects at 0.2/0.9-scale, survivors at 0.35 with tag bars on, all edges drawn `done` (`graphic`), bins full, tickers at final text. Same `reset()/finish()/play()` runner contract as today; Lane B's runner just also toggles tile/reject/feed-edge state.

**Mobile (390):** field on top (full width, 150px tall, 18 tiles, 2 feed edges from bottom anchors with compact `down` ports), then Cull, Name, library stacked with 28px gaps, `down`/`up` ports.

### Shared lane chrome
- Replay: keep the single header "Replay pipelines" `btn-ghost btn-sm` with `ph:arrow-counter-clockwise`; it replays both lanes (Lane B offset 400ms) and advances Lane A's persona. Total wall time ~3.6s; both runs are finite and well under WCAG 2.2.2's 5s, so no pause control is required.
- Results `<dl>`, the footnote, and the `data-status` live region stay unchanged.
- Offscreen/hidden-tab `settle()` behavior stays.

---

## Item 4: Animated code block (AiBento cell-a, dark) + gate sync (cell-c)

### Cell-a layout (7 cols x 2 rows, ~590px wide at 1440)
Keep: header row, h3 "No LLM in the render path", the existing paragraph. Below them, two stacked panes, gap 10px:

**Code pane** (`pre`, radius-inset, bg `oklch(1 0 0 / 0.04)`, inset ring white/0.08, mono 0.75rem/1.6, padding 1rem 1.125rem, ~210px tall). Exact source (9 lines, ships complete in HTML):

```ts
// Simplified from the real generator
import { personas, brandKits, templates } from './kits';

const persona = personas.get('dr-v-frizzle');
const kit = brandKits.for(persona, 'sample-practice');
const template = templates.get('split-stack');
const content = brief.slots(template, { copy, photo, logo });

render(persona, kit, template, content).map(write); // rules only, no LLM
```

The `// Simplified from the real generator` comment is the required marking; it lives in the literal code so it survives every state. Header row keeps `ph:brackets-curly` + filename, updated to `render-campaign.ts`.

**Terminal pane** (same inset treatment but bg `oklch(0 0 0 / 0.28)`, min-height 118px, mono 0.75rem/1.7). Exact lines:

```
$ node render-campaign.ts
persona    ok   dr-v-frizzle (The Wellness Educator)
brand kit  ok   sample-practice (overrides applied)
template   ok   split-stack (5 slots, Story and Post)
content    ok   4 of 4 slots filled
render          Seasonal_Summer-2026_Image_V1_Story_SamplePractice
                ... 7 more files
done            8 files for sample-practice
```

Column padding is two/three spaces as shown (pad the gate word to 10 chars). No timing values, no fake durations.

**Controls:** "Run again" `btn btn-outline-invert btn-sm` + `ph:arrow-counter-clockwise` 16px, right side of the cell header row (visible once JS arms; same `hidden` pattern as the pipeline replay).

### Syntax colors on ink (teal family + neutrals only, 4 roles)
- `oklch(1 0 0)`: keywords (`import`, `const`), and the terminal `done` line at 600 weight.
- `oklch(0.72 0.1 188)` (`graphic`): string literals (`'dr-v-frizzle'`, `'sample-practice'`, `'split-stack'`, `'./kits'`) and every `ok` token in the terminal.
- `oklch(0.78 0.02 215)` (`on-ink-muted`): identifiers, punctuation, terminal body, file names.
- `oklch(0.64 0.015 215)`: comments and the `$` prompt (~4.9:1 on ink, AA for code).

### Choreography (finite, ~2.8s total)
1. Autoplay once via `watchVisibility(cellA, 0.4)`; offscreen/hidden settles to final (mirror the pipeline `settle` pattern).
2. Typing: ~340 chars at 4ms/char (~1.4s). Pre-tokenize into the 4 color spans server-side; JS reveals char by char inside the spans (newlines/indent instant). Caret: 8 x 14px `graphic` block after the last revealed char, removed when typing completes. No blink loop.
3. Terminal: lines append every 160ms, each fading opacity 0->1 over 120ms (`--d1`).
4. Gate sync: cell-c's five `<li>` get `data-gate` (index order). The instant each `ok` line appends, the matching gate ticks: persona line -> gate 1 "Persona selected", brand kit -> 2, template -> 3, content -> 4, and the `done` line -> gate 5 "Render". Gate pending state: 20px circle, inset 1.5px `line` ring, no icon, item text `muted`. Gate done state (200ms `--ease-std` crossfade): `bg-graphic-tint` circle + `ph:check-bold` 11px `graphic-deep`, text `ink`. Server ships all five done; JS resets them to pending only when motion is allowed and the run is about to start.
5. Finished static state: full code, no caret, full terminal, all gates checked. This is also the no-JS and reduced-motion state.

---

## Item 6: Who does what (AiBento cell-e, full width)

Replace the two text lists with a three-node mini flow that fills the cell width (~1136px at 1440). It uses the standard graph engine, so it reads as a small cousin of the hero graph.

**Structure:** cell keeps h3 "Who does what". Below, a `[data-graph]` div: `grid-template-columns: minmax(0,1fr) minmax(0,1.15fr) minmax(0,1fr); column-gap: 56px; align-items: stretch`, with the usual absolute `[data-edges]` SVG behind (z 1), nodes z 2.

**Node 1: I decide.** Header row: `ph:compass` 16px `text-primary` + `.meta text-primary` "I decide". List (text-small, ink, gap 8px): Campaign concepts; Persona definitions; Layout design in Figma.

**Node 2: Tools handle** (the machine; slightly wider via the 1.15fr track). Header: `ph:gear-six` 16px `text-muted` + `.meta text-muted` "Tools handle". List (text-small, muted): Template drafts with Claude; Every size and version; File naming and export. Teal-vs-muted header color is the semantic split: teal is her, grey is the tooling.

**Node 3: I sign off.** Header: `ph:seal-check` 16px `text-primary` + `.meta text-primary` "I sign off". One list item: Final approval on every piece. Below it, the dry aside in `text-small text-muted`: "If it ships, I signed off."

All three are standard `.node` (white, `line` border, radius-card), min-height 168px, no `data-state` (idle; these are not tasks completing). `.port` out on nodes 1-2, `.port` in on nodes 2-3.

**Edges:** two cubic beziers `decide:out -> tools:in`, `tools:out -> signoff:in`, static `graphic` (done) color, 1.5px. No labels, no arrowheads.

**Motion (finite, optional flourish):** on first entry into view (`watchVisibility(cell, 0.4)`), one packet per edge, left to right: edge 1 packet 500ms linear, then edge 2 packet 500ms after a 200ms gap. Once only. Reduced motion / no JS: static edges, no packets. No entrance animation on the nodes (content visible by default).

**Mobile (390):** stack vertically, gap 40px, compact ports (`data-from-compact` down / `data-to-compact` up), packets travel downward. The wider middle track collapses to full width like the others.

---

## Item 7: One continuous page wire (replaces per-section Wire.astro)

**Cutover:** delete `<Wire />` from Pipeline.astro and Background.astro and remove `data-wired` where it only served the old wire; delete Wire.astro and the `.wire`/`.wire-fill`/`.wire-port` CSS. One new overlay owns the whole behavior. (DESIGN.md's wire section and component inventory need the matching one-paragraph update.)

**Element:** a single `div` (aria-hidden, pointer-events none) as the FIRST child of `<main>`, `position:absolute; inset:0; z-index: var(--z-wire)`, containing one inline SVG (full size) with: base path (stroke `line`, 2px, fill none), fill path (identical `d`, stroke `graphic-deep`, 2px, `pathLength="1"`, `stroke-dasharray:1`, `stroke-dashoffset:1`), five port circles, and one ball. Because it is first in DOM order, section content and bands paint above it; it only ever occupies gutters and inter-section whitespace anyway.

**Rendered at >=85rem (1360px) only, and only when JS runs and the path measured successfully. No-JS gets nothing (decorative chrome; content is unaffected).**

**Geometry:**
- Wire X: left gutter `50% - 640px`, right gutter `50% + 640px` (40px clear of the 1200px shell at 1360px, more above).
- Start: port P1 centered vertically on the Pipeline H2 ("Two pipelines I built, and what they produce"), left gutter. Nothing above it: the hero already has its own graph surface and the proof band.
- Runs down the left gutter beside Pipeline; in the Pipeline/AiBento gap, sweep S1 crosses to the right gutter; port P2 at the AiBento H2 Y on the right; down the right gutter; sweep S2 back to left in the AiBento/SelectedWork gap; port P3 at the SelectedWork H2 Y; sweep S3 to right before Background; port P4 at the Background H2 Y; sweep S4 to left before Personal; port P5 at the Personal H2 Y.
- Each sweep: cubic bezier with vertical tangents both ends, control arms = half the vertical run, i.e. `M xA,y0 C xA,y0+k xB,y1-k xB,y1` where `k=(y1-y0)/2`. Vertical run = `min(96px, 0.6 x gap)`, centered in the whitespace between the two sections' content boxes (gaps are 2 x clamp(80px,12vh,128px), so ~60px clearance minimum). Sweeps never touch content.
- Final segment: from the left gutter below Personal, a mixed-tangent bend into the ClosingCta panel: `M xLeft,y0 C xLeft,y0+k xPanel-k2,yBtn xPanel,yBtn` (vertical start tangent, horizontal end tangent, `k`/`k2` = half the vertical/horizontal deltas, clamped to 80px), ending exactly at the CTA panel's left border edge at the "Get in touch" button's vertical center. There it hands off to ClosingCta's existing `.cta-line`, which carries the eye to the button (the sink). ClosingCta's own line and 3-packet loop stay unchanged; the page overlay never draws inside the ink panel (z-order would hide it anyway).

**Ports (5):** 10px circle, white fill, inset 1.5px `graphic-deep` ring (the old `.wire-port` look), centered on the wire at each H2's vertical center, on whichever side the wire occupies for that section. Side alternation is the point; the shared Y with the heading carries the association.

**Ball:** r5 (10px) `graphic-deep` fill, 2px white ring (a scaled-up `.packet`). Implemented as an HTML div in the overlay with `offset-path: path("<same d>")`, animated with WAAPI: two keyframes `offsetDistance: ['0%','100%']` on a `ScrollTimeline` (document, block axis), keyframe offsets computed from measurements: `o0 = (startDocY - 0.55*vh) / (scrollHeight - vh)`, `o1` likewise for the handoff point, both clamped to [0,1], `fill: both`, linear. Net effect: while scrolling between Pipeline and the CTA, the ball rides the wire at ~55% viewport height; before/after it parks at the ends.

**Fill behind the ball:** the fill path's `stroke-dashoffset` animates `1 -> 0` with the same keyframe offsets on the same ScrollTimeline, so the wire behind the ball is `graphic-deep`, ahead is `line` grey. Each port also fills (background white -> `graphic-deep`, 2 keyframes) at the scroll offset where the ball reaches its measured Y.

**Fallbacks (exact):** `prefers-reduced-motion`, no WAAPI `ScrollTimeline`, or any measurement failure: show the full static path in `line` grey with hollow ports, no ball, no fill. Below 85rem: `display:none` on the overlay.

**Measurement:** one `measure()` that reads the five H2 rects, the CTA panel rect, and the button rect (document coordinates), builds `d`, sizes the SVG, sets `offset-path`, and (re)creates the WAAPI animations (old ones are cancelled). Re-run on resize (rAF-coalesced) and via ResizeObserver on `<main>`; fonts are preloaded so heading Y is stable after load. No scroll event listeners anywhere; ScrollTimeline is passive chrome per the motion contract.

**Performance:** one 2-keyframe compositor-friendly animation per element (ball, fill, 5 ports), zero per-frame JS. SVG is ~1 path; trivially cheap with GPU disabled.