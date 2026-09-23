# Build contract: Julienna Batten portfolio

Project: `~/Documents/julienna-portfolio` (Astro 7 static, Tailwind v4 via `@tailwindcss/vite`, anime.js v4, Phosphor icons via `astro-icon` `<Icon name="ph:…" />`). Dev server already running: http://localhost:4321/julienna-portfolio/ (do NOT start another; do NOT run `astro build`, linters, or formatters).

Read first: `local://plan.md` (brief + decisions), `agent://IdentityDesigner` (full visual identity spec: palette, type, radii, elevation, motion, motif, voice).

## Files you may READ but not EDIT (owned by Main)
- `src/styles/global.css` — all tokens + component classes. If you need a new shared class, add it in your own component `<style>` block instead, and tell Main via hub.
- `src/layouts/Base.astro` — `<Base title description>` wraps every page (nav, footer, back-to-top, fonts, view transitions).
- `src/components/{Nav,Footer,Mark,Slot,Wire,HeroGraph,AdFrame,BackToTop}.astro`, `src/scripts/{graph,field,pipeline}.ts`, `src/sections/*`, `src/data/site.ts`, `src/lib/url.ts`.

## Tokens → Tailwind classes (from `@theme` in global.css)
Colors (bg-/text-/border-): `bg` (pure white), `surface`, `surface-2`, `line`, `ink`, `muted`, `primary`, `primary-hover`, `graphic`, `graphic-deep`, `graphic-tint`, `accent` (amber, packets/live state ONLY, never text, never large fills), `accent-tint`, `dash`, `dash-ink`, `grid`, `white`, `on-ink-muted`.
Fonts: `font-sans` (Host Grotesk variable, default), `font-mono` (Commit Mono 500; ONLY for node/port labels, file names, data, `.label`).
Text sizes (each sets line-height/tracking/weight): `text-display`, `text-h2`, `text-h3`, `text-body`, `text-small`, `text-label`, `text-stat`.
Radii: `rounded-inset` 8px (inputs, swatches, nested media), `rounded-card` 12px (cards, nodes, windows), `rounded-media` 16px (feature imagery, graph canvases), `rounded-full` (buttons, chips, ports). Nested elements step DOWN one radius.
Shadows: `shadow-raised`, `shadow-float`. Never combine a border with a shadow whose blur > 8px.
Motion vars: `--d1` 120ms, `--d2` 200ms, `--d3` 350ms, `--d4` 600ms; `--ease-std`, `--ease-out`, `--ease-in`. No bounce/spring/overshoot. Honor `prefers-reduced-motion`.

## Component classes (global.css)
`.shell` (1200px container), `.label` (mono uppercase micro label), `.btn` + `.btn-primary | .btn-ghost | .btn-invert | .btn-outline-invert` (+ `.btn-sm`; `.btn-arrow` child nudges on hover), `.link` (+ `.link-arrow`), `.chip`, `.ph-frame` (dashed placeholder surface), `.ph-chip` (dashed "add number"-style chip), `.grid-canvas` / `.grid-canvas-ink` (node-canvas dot grid, ONLY behind real node-graph surfaces), `.node`, `.node-bar`, `.node-check`, `.port[data-side=in|out|up|down]`, `.edge[data-state=active|done]` (SVG path), `.packet` (SVG circle), `.window` (app frame).
Node states: `data-state="active" | "done"` on `.node`.

## Components
- `<Slot ratio="16 / 10" brief="What asset goes here" radius="media|card|inset" class? />` → wireframe image placeholder (always use this for self-provided images).
- `<Mark size tile? />` → jb monogram SVG.
- `<Wire portTop? />` inside a `data-wired` full-width section → left-gutter section wire (home page only).
- `href(path)` from `src/lib/url.ts` → ALWAYS wrap internal links and `public/` asset URLs (site is deployed under `/julienna-portfolio`).
- Graph engine `src/scripts/graph.ts`: `layoutEdges(root)` (root has `data-graph`, contains `svg[data-edges]` with `path.edge[data-from="id:out"][data-to="id:in"]` and elements `[data-node="id"]`), `sendPacket(path, circle, ms)`, `drawEdge(path, ms, delay)`, `reducedMotion`, `watchVisibility(el, cb, threshold)`.

## Hard rules (fail = rewrite)
- ZERO em dashes (—) or en dashes (–) anywhere visible. Use commas, colons, periods, parentheses, or hyphen ranges (2019-2022).
- No buzzwords: streamline, empower, supercharge, leverage, unleash, transform, seamless, elevate, cutting-edge, world-class, next-gen, game-changer.
- No eyebrow on every section (max 1 per 3 sections), no section numbering (01/02), no decorative dots, no gradient text, no side-stripe colored borders, no glassmorphism, no 3 identical cards in a row, no pills overlaid on images, no scroll cues, no fake testimonials, no invented metrics (unknown numbers use `.ph-chip` "add number"), no invented client names (use "Sample" / illustrative labels).
- One accent (teal primary). Persona/client colors ONLY inside rendered-output previews.
- Headlines: sentence case, `text-wrap: balance` (global), ≤ 8 words. Sub-paragraphs ≤ 25 words, max 65ch.
- Label above input; never placeholder-as-label; visible focus (global `:focus-visible`).
- Responsive: verify 390px, 768px, 1024px, 1440px. No horizontal overflow.
- Copy tone: specific, plain, confident. First name "Jules" allowed conversationally; full name "Julienna Batten".
- Verified facts only (see plan.md "Verified facts").
