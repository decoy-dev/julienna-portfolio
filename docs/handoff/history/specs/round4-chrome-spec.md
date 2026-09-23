I have everything I need: the live build viewed at 1440, the current geometry, and numeric verification of the new curve math. Writing the spec now.

A few measured facts that ground the decisions below:

- The current crossing cubic (`C x mid, nx mid, nx next`) has tangent continuity but a curvature jump of 0 to 0.073 (a ~14px bend radius) exactly where it leaves the straight run. That hook is the kink the user sees, and it is the sharpest curvature on the entire route.
- A Hermite-sampled clothoid (4 to 6 cubics) fits position within ~1 to 3.5px but reintroduces a nonzero end curvature hook (measured -0.075), so sampling is rejected in favor of a closed-form two-cubic bend with exactly zero curvature at the joins.
- Sections abut (0px gaps); crossings live inside the ~216px padding band between one section's shell bottom and the next section's h2 top. Gutter-to-gutter width at 1440 is 1280px.

---

# Round 4 spec: page wire, CTA handoff, sign-off node, footer

## Item 1: Page wire redesign

**Diagnosis.** The route topology (gutter runs, crossings in the inter-section padding band, ports at section heads) is sound and stays. The kink is purely a curve-quality bug: the single cubic that crosses between gutters starts and ends with a hard curvature discontinuity, so the eye reads "straight line, corner, diagonal, corner, straight line". The fix replaces every transition with curves that have exactly zero curvature at the joins, so a straight run flows into a bend with no visible event.

### New curve primitives (exact formulas)

Two closed-form primitives cover the whole route. Both are built so the first three control points at each join are collinear with the straight run, which forces curvature to exactly zero at the join (G2 continuity against the line), with no fitting code and no per-frame cost.

**Crossing bend** from `A = (x0, y0)` to `B = (x1, y1)`, entering and leaving vertical (`W = x1 - x0`, `H = y1 - y0`, `xm = (x0+x1)/2`, `ym = (y0+y1)/2`):

```
M x0 y0
C x0 (y0 + H/4)   x0 (y0 + H/4)   xm ym
C x1 (y1 - H/4)   x1 (y1 - H/4)   x1 y1
```

Note the doubled control points. Properties, verified numerically at the worst case on this page (W = 1280, H = 216): curvature is exactly 0 at A, at the midpoint join, and at B; it rises to a single smooth peak of 0.042 (about a 24px radius) at roughly the quarter and three-quarter points, versus today's 0.073 hook at the joins. The curve stays within about 10% of W of the starting gutter for the first quarter of the band, so it clears content edges exactly like today. x and y are both monotone, so the existing ball-tracking sampler keeps working unchanged.

**Eased quarter turn** from a vertical run at `x` (heading down) to horizontal at `y = yLine`, turning right, box side `R`, `c = R/4`:

```
... V (yLine - R)
C x (yLine - R + c)   x (yLine - R)   (x + R/2) (yLine - R/2)
C (x + R) yLine       (x + R - c) yLine   (x + R) yLine
```

Again doubled control points (second segment's first and last are identical). Curvature is exactly 0 at both ends, the midpoint tangent is exactly 45 degrees, and the turn stays inside its `R` box (verified monotone both axes for `c <= R/2`). Use `R = 40` (the gutter width): the turn then ends exactly at the CTA panel's left edge, tangent horizontal, meeting the panel's own line with no corner at all.

### Route assembly (replaces the crossing and corner code in `PageWire.astro` `build()`)

Anchors are measured exactly as today (`startY = bottom(proof) + 32`, `heads[]`, `ends[]`, `lineY` = CTA button midline, `px` = panel left edge, `xs` = the two gutter x positions). Then:

1. `M xs[0] startY`; port at the start (unchanged).
2. For each section `i`: `V heads[i]`, port at `heads[i] + 14` (unchanged). If a next section exists: `V ends[i]`, then emit the **crossing bend** from `(xs[side], ends[i])` to `(xs[1-side], heads[i+1])`; flip `side`.
3. After the last section: `V ends[last]`. If `side === 1`, emit a crossing bend from `(xs[1], ends[last])` to `(xs[0], lineY - 40)`; otherwise `V (lineY - 40)`.
4. Emit the **quarter turn** at `xs[0]`, `yLine = lineY`, `R = 40`. The turn's end point is `(xs[0] + 40, lineY) = (shell.left, lineY) = px`, so the old `Q` corner and final `H px` are deleted; the wire stroke path ends here.
5. Build a second string, `ballPath = wirePath + ` `H buttonCx`, where `buttonCx` is the sink button's center x in main coordinates. The ball rides `ballPath`; the strokes use `wirePath` (see item 2 for why).

Add `stroke-linecap: round; stroke-linejoin: round` to `.pw-base` and `.pw-fill` so the start cap and segment joins never show a facet.

Everything else in the component stays: the ScrollTimeline keyframe sampling, the ResizeObserver rebuild triggers, the ports, the fill. The helpers are pure functions of the measured anchors, so `build()` cost is unchanged (two cubics where there was one).

### Breakpoints and states

- **1440 and up (>= 1360):** wire live as specified.
- **1024 / 390 / 320:** no page wire at all (unchanged, `display: none` below 85rem). Nothing replaces it; the motif carries through the in-content graphs.
- **Reduced motion / no ScrollTimeline:** static grey wire drawn from the same new path, no ball, no fill (existing fallback, unchanged).
- **No JS:** no wire (it is `aria-hidden` decorative chrome; all content is readable without it).

---

## Item 2: CTA handoff

**The z-order decision.** The wire strokes stay behind all content (that is a safety property: if layout ever shifts, the wire tucks under text instead of crossing it). Only the ball changes layers. Move `.pw-ball` out of the `.page-wire` div and make it a direct absolutely-positioned child of `<main>` with `z-index: 1` (nav and back-to-top stay higher). Flow content has no stacking context above auto, so the 12px ball paints over the ink panel for its final approach while every stroke remains safely behind. The ball's coordinates use the same main-relative space as the SVG, so nothing else changes.

**The in-panel segment.** The ball's `offset-path` is `ballPath` (item 1, step 5), so it physically travels from the left gutter, around the eased turn, across the panel's left edge, and along the button's midline into the button center. Inside the panel, the visible wire is the panel's own line, which becomes two lines in `ClosingCta.astro`:

- `.cta-line` (base, static): `stroke: oklch(0.72 0.1 188 / 0.35)`, full length from panel left edge to button center, at the button midline (the existing ResizeObserver math already computes these endpoints; keep it).
- `.cta-line-fill` (new, sibling): `stroke: var(--color-graphic-deep)`, same geometry, `stroke-dasharray` = its length `L2`, initial `stroke-dashoffset: L2` (hidden). `PageWire.animate()` already maps path length to scroll offsets; while sampling `ballPath` it records `oPanel` (offset where length passes `wireLen`) and `oEnd` (final offset), then adds one more WAAPI animation on the same ScrollTimeline with keyframes `[{0, L2}, {oPanel, L2}, {oEnd, 0}, {1, 0}]`. The teal fill visibly completes inside the panel exactly as the ball crosses it. No scroll listeners, one extra compositor-cheap animation.

**"Vertically centered" detection.** An IntersectionObserver in `ClosingCta.astro` observes the primary button `[data-cta-sink]` with `rootMargin: '-47.5% 0px -47.5% 0px'` and `threshold: 0`. That collapses the root to a band about 5% of viewport height around the vertical middle; the observer fires when the 44px button intersects it, i.e. when the button's midline sits within about 2.5% of dead center. On entry it sets `data-arrived` on `[data-cta]` and `data-cta-centered` on `<body>`; on exit it removes both. Note the ball rides at the 55% viewport line, so it arrives at the button a beat before centering; the dock and pulse then fire together at centering, which reads as one deliberate moment instead of two jittery ones 45px apart.

**The choreography (one moment, three parts):**

| Part | What happens | Timing |
| --- | --- | --- |
| Ball dock | Ball scales 1 to 0.3 and fades out at the button center, as if absorbed | 250ms, `var(--ease-in)`, CSS transition on `transform` + `opacity` |
| Ring pulse | A 1.5px `var(--color-graphic)` pill ring (`::after`, `inset: -2px`, `border-radius: 999px`, `pointer-events: none`) on the button scales 1 to 1.18 while fading 0.9 to 0 | 600ms, `var(--ease-out)`, plays once per entry |
| Fill | In-panel fill has already completed as the ball crossed | scroll-driven |

CSS sketch:

```css
[data-cta-sink]::after {
  content: ""; position: absolute; inset: -2px;
  border: 1.5px solid var(--color-graphic);
  border-radius: 999px; opacity: 0; pointer-events: none;
}
[data-cta][data-arrived] [data-cta-sink]::after { animation: cta-pulse 600ms var(--ease-out); }
@keyframes cta-pulse { from { opacity: .9; transform: scale(1); } to { opacity: 0; transform: scale(1.18); } }
body[data-cta-centered] .page-wire[data-live] ~ .pw-ball,
body[data-cta-centered] main > .pw-ball { transform: scale(.3); opacity: 0; }
.pw-ball { transition: transform 250ms var(--ease-in), opacity 250ms var(--ease-in); }
```

(Specificity note for the implementer: the dock rule must beat `.page-wire[data-live] .pw-ball`, which is why the `body[...]` attribute selector is written long. Removing the attribute reverses the same transition, so the ball quietly reappears as it rides back up the wire.)

**Repeat policy.** Repeats once per band entry, re-armed when the button leaves the band. Each pulse is a single 600ms finite animation triggered by a scroll direction change, so it satisfies WCAG 2.2.2 and never loops on a timer. If the tab is hidden on entry, the pulse is skipped (`document.hidden` guard) and the attributes still set.

**Reduced motion.** The observer is not installed (`reducedMotion.matches` check, plus the existing change listener disconnects it). No ball (existing), no ring, no dock. The CTA is fully readable and usable in its shipped state.

**Below 1360px.** The pulse still happens. It is an IntersectionObserver-driven emphasis on the single most important action on the page, independent of the wire, and it keeps the "arrival" moment alive on sizes where the wire cannot fit. Only the dock and in-panel fill are desktop-only (there is no ball and no fill to complete). The static `.cta-line` keeps its current >= 640px display rule.

---

## Item 3: "I sign off" node

The other two nodes keep their head-plus-list structure; only the sign-off node becomes a centered visual anchor, which also fixes the balance problem (today it is a mostly empty card).

**Markup** (replaces the generic branch for the `signoff` entry in `AiBento.astro`; the `who` array entry drops its `items`):

```html
<div class="node who-node who-me who-signoff" data-node="who-signoff">
  <span class="port w-in" />
  <div class="signoff-inner">
    <Icon name="ph:seal-check" size={40} class="text-primary" aria-hidden="true" data-signoff-icon />
    <p class="signoff-title">I sign off</p>
    <p class="signoff-line">Final approval on every piece</p>
  </div>
</div>
```

`ph:seal-check` stays (it is the right metaphor and already the node's icon); at 40px in `text-primary` it becomes the largest icon on the page, which is the visual emphasis the feedback asks for.

**CSS:**

```css
.signoff-inner {
  height: 100%;
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  text-align: center; gap: 0.5rem;
  padding: 0.875rem;
}
.signoff-title { font-size: 0.8125rem; font-weight: 600; color: var(--color-primary); }
.signoff-line  { font-size: var(--text-small); color: var(--color-ink); max-width: 22ch; }
```

**Balance.** The `.who` grid already stretches all three nodes to equal height. The "I decide" and "Tools handle" nodes (16px head icon + three list items, about 118px of content) stay top-aligned; the sign-off stack (40px icon + title + one line, about 112px) is vertically centered, so all three cards read as equally full with the eye landing on the seal last, which is also where the packet flow ends. At 1440 the three-column grid (`1fr 1.15fr 1fr`, 56px gaps) is unchanged.

**The stamp moment.** The existing one-pass packet flow already ends at this node; the sign-off is the payoff. In the `data-who` runner, after the final `sendPacket` resolves and the second edge goes `done`, run one restrained icon pulse: anime.js `scale: [1, 1.14, 1]`, 360ms, `easeInOutQuad` (the mapped morph ease, no spring, ends exactly at rest). Transform only, one node, fired once per page load inside the existing `spent` guard, so offscreen settling and reduced motion already behave: reduced motion and no-JS show the static node with its teal border; hidden tab spends the pass and shows the finished flow.

**Breakpoints.** 1440 and 1024: three-column row as above (the bento cell is full width at >= 768, and the row holds comfortably down to 768). 390 and 320: the existing compact stacking applies (`--graph-compact: 1`, single column, ports up/down, edges route with the `-compact` attributes); the sign-off content stays centered horizontally, icon on top, and the stamp still plays once when the flow runs.

---

## Item 4: Footer replacement

**Choice: a compact "reach me" status panel.** Justification: by the footer a recruiter has seen the whole pitch and needs logistics and a next step, not a second sitemap they already used to get there. This panel answers the questions every hiring email asks (availability, response time, time zone) with honest placeholders, and puts the two real actions (copy the email, download the resume) one click away.

It replaces the entire draggable graph box: the `footer-graph-box` markup, the fnode data and edges, the drag/keyboard/click-to-place script, the "Reset layout" button, the move hint, and the `grid-canvas` backdrop all go. (Docs touchpoint for the implementer: `DESIGN.md` lists "footer sitemap" as a `grid-canvas` consumer and mentions the sitemap graph under the motif rules; drop those mentions. Add the three placeholder rows to `CONTENT-TODO.md`.)

**Markup structure:**

```html
<div class="rounded-card border border-line bg-bg p-6 md:p-8 grid gap-8 lg:grid-cols-12" data-footer-status>
  <div class="lg:col-span-4">
    <h2 class="text-h3">Before you email me</h2>
    <p class="mt-2 max-w-[34ch] text-small text-muted">
      The things I would want to know before reaching out, with placeholders marked where I still owe an answer.
    </p>
  </div>
  <dl class="grid content-start gap-4 lg:col-span-4">
    <!-- three rows, each: -->
    <div class="flex items-center gap-2.5">
      <Icon name="ph:calendar-blank" size={18} class="shrink-0 text-muted" aria-hidden="true" />
      <dt class="meta text-muted">Availability</dt>
      <dd class="ml-auto"><span class="ph-chip">Add availability</span></dd>
    </div>
    <!-- ph:timer "Response time" -> "Add typical response time" -->
    <!-- ph:globe "Time zone" -> "Add time zone" -->
  </dl>
  <div class="flex flex-col items-start gap-3 lg:col-span-4">
    <div class="flex flex-wrap items-center gap-3">
      <a class="font-mono text-small text-ink underline-offset-4 hover:text-primary hover:underline"
         href="mailto:{person.email}">{person.email}</a>
      <button type="button" class="btn btn-primary btn-sm" data-copy-email hidden>
        <Icon name="ph:copy" size={16} aria-hidden="true" /> Copy email
      </button>
    </div>
    <a href={href(person.resume)} class="btn btn-ghost btn-sm" download>
      <Icon name="ph:download-simple" size={16} aria-hidden="true" /> Download resume
    </a>
    <a href={person.linkedin} target="_blank" rel="noopener" class="link text-small">
      LinkedIn <Icon name="ph:arrow-up-right" size={14} aria-hidden="true" />
    </a>
    <p class="sr-only" role="status" data-copy-status></p>
  </div>
</div>
```

**Copy decisions.** "Before you email me" (4 words, sentence case, first person framing) heads the panel; the intro line names the placeholder policy out loud, which is this site's honesty rule stated in her voice. The three status rows use `.ph-chip` dashed placeholders exactly like the proof rail ("Add availability", "Add typical response time", "Add time zone"); nothing is invented. The email is mono (literal address, allowed) and is itself a `mailto:` link. "Copy email" is a new utility intent, so it does not collide with the "Get in touch" contact label.

**Interaction and states.** The Copy button renders `hidden` and is unhidden by the script (same progressive-enhancement pattern as the pipeline's "Run again"), so no-JS still shows the working email link, the resume download, and LinkedIn. On click: `navigator.clipboard.writeText(email)`; on resolve, the label swaps to `ph:check` + "Copied" and the sr-only status announces "Email address copied", reverting after 1600ms; on rejection, the label stays and the status says "Copy failed, select the address instead". The swap is an instant content change, so reduced motion needs no special case. Focus-visible rings come free from the global button styles.

**Breakpoints.** 1440: the panel is a 12-column grid, 4/4/4 (intro, status rows, actions); the status rows align as a clean definition list with values right-aligned via `ml-auto`. 1024 (below lg): intro spans the full width, status list and actions sit side by side in two columns. 390 and 320: single column stack (intro, then status rows, then actions); the email row wraps, buttons go full width and keep their 44px height, and the dashed chips never force overflow since they are short and the row uses `flex-wrap`.

The plain link columns ("Pages", "Elsewhere") and the legal line below the panel are unchanged.