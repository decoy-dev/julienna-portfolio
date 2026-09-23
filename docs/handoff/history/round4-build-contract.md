# Round 4 build contract (pipelines)

Inputs, in priority order (later overrides earlier where they conflict):
1. Designer spec: agent://R4PipelineDesigner
2. Main's amendments: local://round4-amendments.md (Pipelines part)
3. Advisor corrections: agent://Round3Advisor (blocking items 1, 2, 3, 6; non-blocking "Photo visual sequence", "Results-row removal", "Accessibility and copy readability")
4. THIS FILE (final word).
User feedback: local://revisions4.md. Previous implementation for patterns/CSS: /tmp/Pipeline.round3.astro (deleted from the repo; read-only reference).

## Ownership (no one edits outside their files)
- AdBuilder: src/sections/AdGenerator.astro, new src/scripts/ad-generator.ts. May read src/components/AdFrame.astro (reads `--persona`), src/data/site.ts, src/data/split-stack.json.
- PhotoBuilder: src/sections/PhotoIntake.astro, new src/scripts/photo-intake.ts.
- Main owns everything else: src/scripts/pipeline.ts, src/scripts/graph.ts, src/styles/global.css, index.astro, PageWire, docs (DESIGN.md, CONTENT-TODO.md). Need an engine change? `hub send` Main; do not edit.
- Both stubs already exist and are mounted in index.astro in order: Hero, AdGenerator (#systems), PhotoIntake (#intake), AiBento.

## Engine (already in place, read src/scripts/pipeline.ts + graph.ts)
- `createLaneRunner({ lane, choreography, onReset, onFinish })` exported from pipeline.ts, with `Run` primitives `step`, `travel`, `reveal`, `scope`. finish/reset apply instantly (lane gets `data-instant` for two frames; global CSS disables transitions under it). `play()` waits two frames after reset before calling your choreography. Stateful selector: `[data-stage], [data-output], [data-item], path.edge`.
- Packets: any element with class `packet` inside the lane (circle, or e.g. `<rect class="packet" x="-5" y="-4" width="10" height="8" rx="1.5">` drawn around its origin; `sendPacket` translates non-circles).
- graph.ts: `layoutEdges` (data-from/data-to with `-compact` variants, `data-route` / `data-route-compact="elbow"`, CSS `--graph-compact: 1` switches), `MotionScope`, `watchVisibility`, `reducedMotion`, `sendPacket`.
- Custom CSS state for your own elements is fine (e.g. `data-phase` on a wrapper, per-item `--k` delays). Anything your choreography sets outside STATEFUL must be restored in onReset/onFinish.

## Section requirements (both)
- `<section id=… class="relative py-[clamp(80px,12vh,128px)]" data-wire-section aria-labelledby=…>` then `.shell`. Keep the H2 as the first heading (the page wire aligns a port to it) and nothing outside `.shell` inside the section.
- Copy ABOVE the graphic in both sections (H2 + replay button row, intro, then a two-column copy row at >= 1024, single column below). The graphic uses the full shell width (`.window` + `grid-canvas`, `container-type: inline-size`). Set each container breakpoint from the layout's actual minimum width; verify the wide composition is the one shown at 1440.
- Replay: one `btn btn-ghost btn-sm` "Replay pipeline" with `ph:arrow-counter-clockwise` 16 per section, shipped `hidden`, unhidden by JS. Replay re-arms instead of running if the graphic is not in view; announcements (sr-only role=status) only after an explicit replay.
- Autoplay: trigger from a reachable sentinel (e.g. the graphic's top edge region or its first row via IntersectionObserver with a pixel rootMargin), never a ratio of the whole tall graphic. The shipped finished state stays visible until play actually starts (no eager reset at load). Settle (finish) when the section leaves the viewport entirely or the tab hides; never run unseen; returning from a hidden tab may start an unstarted in-view run. Live reduced-motion change -> finish and never start again.
- Wall clock from start to the last CSS transition end: under 5000ms. Measure it.
- Accessibility: moving/duplicate visuals and tickers aria-hidden; one static sr-only description of the chosen inputs/steps and final outputs; candidate text keeps AA contrast (dim decorative surfaces only, mark choices with a check + ring, not color alone); present it as a demonstration, not fake controls (no buttons/inputs inside the graphic).
- No before/after time placeholders in these sections (they move to CONTENT-TODO.md, Main handles). No results row, no footnote.
- Copy rules: VOICE.md (first person, zero em/en dashes, no triads, no "X, not Y", no stock phrases), no invented numbers or process claims. Middle dot "·" in labels is fine. Mono only for literal file names/paths.
- Perf: transform/opacity (+ SVG attrs, packets), no per-frame layout reads, no new fonts, keep DOM lean.
- Responsive: 320, 390, 768, 1024, 1440; no horizontal overflow; mobile layouts keep the process legible and not identical vertical lists.

## AdBuilder specifics
- Copy (exact):
  - H2 "One brief becomes a whole campaign".
  - Intro: "Around 40 practices each need 8 ad files per campaign, so I built a generator that renders every version from rules instead of a blank artboard."
  - Col 1: "The tool walks five gated steps: persona, brand kit, template, content, render. A gate stays shut until the step before it is set." + "Claude helps me draft new templates, but fixed rules render the ads. No LLM touches the render path."
  - Col 2: fact list (ph:check bullets) "8 files per practice: V1 and V2, Story and Post, static and animated." / "A matching site template ships alongside: nav, hero, footer." + stat line "About 320 files per campaign across around 40 practices." with `.ph-chip data-todo="verify"` "Estimate, verify" (plain text, not CountUp) + disclosure "The steps match the tool I use at OrthoBoost. Practice names, file names, and the sample copy are stand-ins, because client work stays private."
- Graphic, wide (>= ~1100px container): the four decision gates in one row across the top (Persona, Brand kit, Template, Content; left to right with edges), then a second row with Render feeding the output node (8 AdFrames in two labelled groups V1/V2, frames at least 60px wide). Medium: gates 2x2. Narrow: stacked, with compact edges. Balance the heights; no big empty areas.
- Decisions must read as choices (advisor blocking item 1): persona deck shows real alternatives from site.ts (e.g. 3 fanned cards, names legible: two alternates plus Dr. V. Frizzle); during the run the cards cycle and the chosen card comes to the front with ring + check while the rejected ones stay visible behind it. Brand kit deck: "Sample kit A", "Sample kit B", "SamplePractice" (neutral swatches only; no client colors in UI). Template: the 5 real templates as small labelled wireframes; a selection highlight moves across and settles on Split Stack. Content: per Split Stack slot (headline, subhead, cta, photo) 2 or 3 candidates with one chosen that visibly lands in a small assembled Split Stack preview (or named slot) ; logo is fixed "From the brand kit" and is not animated as a choice. Chip "Sample copy". Persona colors only inside the output AdFrames and the Split Stack preview if it is a rendered preview.
- Replay advances the persona (front card + `--persona` on the output). The chosen persona for the first run is Dr. V. Frizzle.
- Ticker uses the real naming convention; `data-final` Seasonal_Summer-2026_Video_V2_Post_SamplePractice; `.ph-chip` "Illustrative".

## PhotoBuilder specifics
- Copy (exact):
  - H2 "From raw shoot to production library".
  - Intro: "I built a pipeline that turns client shoots into organized, production-ready libraries."
  - Col 1: "This example shows selection, sorting, and naming before files enter the library. The steps, folders, and images are illustrative." Col 2: one more short first-person line is optional; if you add one, it must not claim any unverified volume, timing, or process detail (safe: "The library is organized by where each file ends up: web, ads, social, and print."). Chip "Example steps and folders" near the graphic.
- Graphic stages in order, each visually distinct and literal: Raw shoot (scattered example frames) -> Select (keepers checked, rejects get an X cue AND visibly leave into a small "Discarded" pile/area) -> Sort (keepers grouped under /web /ads /social /print) -> Name (file cards with names like web_hero_01.webp) -> Production library (folder rows with thumbs, ticker `library/...`, `.ph-chip` "Illustrative"). Frame counts are example content (label them "Example shoot" or similar, not operating metrics).
- Keepers keep a recognizable identity across stages (e.g. each keeper has its own neutral glyph such as ph:user, ph:mountains, ph:storefront, ph:smiley, ph:tree, ph:sun, ph:buildings, ph:flower, shown in raw, select, sort, name, and library thumbs), so a viewer can follow one photo end to end.
- Packets between stages are tiny thumbnail rects (class `packet`).
- Wide: stages left to right across the full width; below the container breakpoint: stacked with compact edges, stage shapes kept distinct.

## Deliver
Build, then verify in a browser against http://localhost:4321/julienna-portfolio/ (dev server already running; do not start/stop servers). Use a fresh headless tab via the eval `browser` global (if a tab wedges, e.g. screenshots time out, close it and open a new one). Check 1440, 1024, 390, 320: layout, no overflow (`document.documentElement.scrollWidth <= clientWidth`), the run mid-way and finished, replay, reduced motion (emulateMediaFeatures), and measured wall-clock duration. Skip `astro build`, linters, and tests; you may run `npx astro check` once at the end for your own files. Report: files changed, measured durations, screenshots described, any engine change you needed from Main.
