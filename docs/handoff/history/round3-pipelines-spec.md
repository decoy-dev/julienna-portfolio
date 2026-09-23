# Round 3: Pipeline lanes spec (item 1)

Scope: `src/sections/Pipeline.astro` + `src/scripts/pipeline.ts`. Respects DESIGN.md/VOICE.md, the existing engine (`layoutEdges`, `sendPacket`, `drawEdge`, `MotionScope`, `watchVisibility`, `reducedMotion`), and the shipped-final-state pattern. Persona accent colors only inside AdFrame previews.

Two lanes with different silhouettes: **Lane A (ad generator) is a horizontal bowtie** (four inputs converge into one Render node, which fans into 8 outputs). **Lane B (photo intake) is a scatter-funnel-sort** (a loose tile field drains through two gates into 4 bins). At a 3-second glance: A reads "choices merge into a machine that stamps out files"; B reads "a mess gets sorted".

---

## Lane A: Ad generator (combine, then fan out)

### Desktop (1440; lane inner width ~1104px)

`.lane-graph` grid: `grid-template-columns: 288px minmax(0,1fr) 344px; gap: 48px; align-items: center`. Region height ~310px.

**Left column: four input nodes**, stacked, gap 14px, h 64px, icon 18px `text-primary`, `.port` right center:

1. `ph:user-circle` **Persona** — this one is h 76px with two meta lines: "Dr. V. Frizzle" / "The Wellness Educator" (0.75rem muted). Right-aligned `.meta text-muted` suffix: `1 of 11`.
2. `ph:swatches` **Brand kit** — meta "sample-practice", suffix `1 of ~40`.
3. `ph:layout` **Template** — meta "Split Stack", suffix `1 of 5`.
4. `ph:text-aa` **Content** — meta "Copy, photo, logo", no suffix.

Choice-set read: nodes 1-3 get a deck silhouette via `::before`/`::after` pseudo-cards behind (radius-card, 1.5px `line` border, white bg, offset 3px and 6px straight down, inset-inline 3px/6px so the stack narrows). Node 4 stays single. This says "picked from 11 / ~40 / 5" without drawing 56 items.

**Middle:** Render node, 176 x 88px, vertically centered, `ph:cpu` 20px, title "Render", meta "Fixed rules". (The LLM point lives in the bento H3; do not repeat it here.)

**Edges:** 4 converging cubic beziers `persona:out -> render:in`, `brandkit:out -> render:in`, `template:out -> render:in`, `content:out -> render:in` (they bundle into the single in-port; the bunching IS the combine read), plus `render:out -> ads-out:in`.

**Right:** output node unchanged (344px): head "8 files for one practice", 8 AdFrames `repeat(8, 1fr)` gap 6, ticker, "About 320 files per campaign across ~40 practices." + existing "Estimate, verify" and "Illustrative" chips.

### Animation (finite, ~3.2s)

Ready state: inputs idle, edges hidden, render idle, frames dim, ticker "Waiting for render".

1. Inputs fire top to bottom: node `active` 160ms -> `done`; packet travels its edge 280ms linear; edge -> `done`. Four inputs x ~480ms = 1.92s. One packet at a time (combine reads as assembly, not a race).
2. Render `active` 350ms (border `graphic-deep` + `shadow-raised` only; no spinner, no pulse).
3. Packet render->output 280ms; output `active`.
4. 8 frames pop: stagger 45ms, each `translateY(3px) scale(0.94) -> none` + opacity 0.3->1, 250ms `--ease-out` (max ~6 frames mid-flight; transform/opacity only). Ticker streams each `data-name`. All frames tinted with the run's persona color.
5. Output `done`, ticker rests on `data-final`, live region announces the existing status string.

**Persona cycling:** each Replay advances the persona index (mod 11): Persona node name + archetype update, 8 AdFrames re-tint. For runtime re-tint, AdFrame's `FILL` mixes must reference `var(--persona, <build-time color>)` via inline style on `.ad-frame`; JS sets `--persona` on the output node once per run. First autoplay uses personas[0] (Dr. V. Frizzle, #48bb78). Brand kit and Template stay fixed (Split Stack is the documented excerpt).

### Mobile (390)

Inputs become a 2x2 grid (Persona+Brand kit / Template+Content, each ~160px, deck silhouette kept), compact ports `down`; edges curve down into `render:up`; Render max 220px, centered; output full width; frames 4x2 (extend the existing 380px container query to the compact layout). Vertical rhythm: inputs, 28px gap, Render, 28px gap, output.

---

## Lane B: Photo intake (scatter, funnel, sort)

### Desktop (1440)

`.lane-graph` grid: `grid-template-columns: minmax(0,1.15fr) 200px 344px; gap: 48px; align-items: center`. Region height ~320px.

**Left zone: the raw field.** 24 tiles (24 x 18px, 3px radius, 1.5px `line` border, `surface-2` fill; 6 carry a centered `ph:image` 10px at muted/0.5 for texture). Scatter is deterministic and server-rendered: absolute positions on a 24px-grid-snapped jitter, rotation -4deg..+4deg (precomputed array in frontmatter, stable across builds). 8 predetermined tiles carry `data-reject`. Field label: `.meta text-muted` "Raw shoot, unsorted" top-left of the zone. The field is deliberately NOT a node; it is loose content on the grid canvas.

Four feed edges start at floating ports inside the field (8px port circles, white fill, 1.5px `graphic-deep` ring, at 4 fixed anchor points among the tiles) and converge into `cull:in`. Floating ports satisfy "ports exist only where edges attach" without boxing the field.

**Middle: two gate nodes** stacked, gap 56px, each 168px wide, h 56px:

- `ph:funnel` **Cull** / meta "Selects kept"
- `ph:tag` **Name** / meta "One convention"

Edges: `cull:down -> name:up`, `name:out -> photos-out:in`.

**Right:** output node unchanged ("Production library", 4 folder rows /web /ads /social /print with 4 thumb spans each, ticker, "Illustrative" chip). Lane keeps its "Example steps" chip; the section footnote stays.

### Animation (finite, ~2.9s, starts 400ms after Lane A)

1. Cull: the 8 `data-reject` tiles dim to opacity 0.2 and scale 0.9 over 400ms `--ease-std`. Simultaneously the 4 feed edges `drawEdge` 450ms staggered 80ms, then 4 packets travel them concurrently, 400ms linear, staggered 100ms (peak concurrent motion: 4 packets + 8 dimming tiles).
2. Cull `active` 200ms -> `done`; packet cull->name 260ms; Name `active` 200ms -> `done`.
3. Name stamp: the 16 survivor tiles each get a 2px `ink`/0.5 bar at their bottom edge (the "tag"), fading in staggered 25ms (400ms total).
4. Packet name->library 260ms; library `active`.
5. Sort: 4 folder rows fill staggered 90ms (thumbs opacity 0.3->1, existing item reveal), and in synced batches the 16 field tiles fade to 0.35 (4 per folder, mapped by index) so the field visibly drains as the bins fill. Ticker streams each folder's `data-name`.
6. Library `done`; ticker rests.

**Static final state (server-rendered; no JS, reduced motion, settled):** rejects at 0.2 / 0.9 scale, survivors at 0.35 with tag bars on, all edges drawn `done` (`graphic`), bins full, tickers at final text. Same `reset()/finish()/play()` runner contract as today; Lane B's runner also toggles tile/reject/feed-edge state.

### Mobile (390)

Field on top (full width, 150px tall, 18 tiles, 2 feed edges from bottom anchors with compact `down` ports), then Cull, Name, library stacked with 28px gaps, `down`/`up` compact ports.

---

## Shared lane chrome

- Replay: keep the single header "Replay pipelines" `btn-ghost btn-sm` + `ph:arrow-counter-clockwise`; replays both lanes (Lane B offset 400ms) and advances Lane A's persona. Total wall time ~3.6s, finite, under WCAG 2.2.2's 5s; no pause control required.
- Results `<dl>`, the footnote, and the `data-status` live region stay unchanged.
- Offscreen/hidden-tab `settle()` behavior stays.
