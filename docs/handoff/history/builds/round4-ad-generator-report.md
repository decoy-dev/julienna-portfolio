```json
{
  "files": [
    {
      "path": "src/sections/AdGenerator.astro",
      "action": "rewritten from stub",
      "summary": "Full #systems section: header row (H2 'One brief becomes a whole campaign' + hidden-until-JS 'Replay pipeline' btn-ghost with ph:arrow-counter-clockwise 16), intro, two-column copy row at lg (gated-steps + Claude/no-LLM paragraphs left; ph:check fact list, plain-text 'About 320' stat with ph-chip data-todo=verify 'Estimate, verify', OrthoBoost disclosure right), then a full-shell-width .window/.grid-canvas graphic (container-type: inline-size). Graphic: 4 gate wells in a row (persona 3-card riffle deck with legible alternates Clarkson/House behind chosen Frizzle; kit deck Sample kit A/B behind SamplePractice with neutral swatches; 5 labelled template wireframes with scan highlight settling on Split Stack; content gate with 2-3 AA-contrast candidates per slot, check+ring marking, fixed logo row, and an assembled Split Stack named-slot preview zones fill as picks land) feeding a second row Render node ('Fixed rules only') into the output node: 8 AdFrames in labelled V1/V2 groups (62px frames at wide), mono ticker with real naming convention, data-final Seasonal_Summer-2026_Video_V2_Post_SamplePractice, ph-chip 'Illustrative'. Whole graph aria-hidden with one static first-person sr-only description + sr-only role=status announced only on explicit replay. Ships in finished state; scoped styles + inline lifecycle script."
    },
    {
      "path": "src/scripts/ad-generator.ts",
      "action": "new",
      "summary": "createAdGenerator(lane): LaneRunner on createLaneRunner. Choreography (~4.4s): persona riffle 0/190ms -> done 400 -> packet 560; kit riffle overlapping packet 700/890 -> done 1100 -> packet 1220; template scan flashes 1400 (60ms apart) settling on Split Stack ~1580; content picks 2100 +120ms staggers landing in preview zones; packet 2740 (300ms long sweep); render step 2980-3330; packet + reveal(55) from 3560; output done ~4000. Custom state (deck slot order via data-ready/data-done, slot data-pick, zone data-fill, data-scan) restored in one restore('ready'|'done') hooked to onReset/onFinish. Wrapped play() advances the persona each run (front-card text + --persona tint on output; first run stays Dr. V. Frizzle), works under reduced motion too. edge() picks the visible kit->template twin path."
    }
  ],
  "measuredDurations": {
    "wallClockReplayClickToLastCssTransitionEnd_ms": 4421,
    "budget_ms": 5000,
    "transitionEndEventsCounted": 145,
    "note": "Measured at 1440x900 via capture-phase transitionend listener on the lane; includes the runner's 2-frame instant reset before choreography, so choreography-start-to-last-transition is strictly smaller."
  },
  "breakpoints": {
    "320": "Container 277: same stack; candidate chips wrap to two lines instead of clipping; output frame rows pair up 2x2 (~132px frames, container <=339). No overflow.",
    "390": "Compact stack (--graph-compact:1, container 347): wells full width in process order with straight vertical down->up edges and mode-switched port dots; each stage keeps a distinct shape (deck / deck / wireframe row / candidate slots + preview / render / output). Frames 4-across at 62px; ticker reserves two lines and wraps. No overflow.",
    "768": "Medium-small (container 709): same 2x2 gates, two-column content grid (>=688 container), output V1/V2 groups stacked with 62px frames beside Render. No overflow.",
    "1024": "Medium (container 965): gates 2x2 (persona/kit over template/content), dedicated twin edge kit:down->template:up sweeps through the 96px row gap (wide twin display:none; the runner sends the packet down the visible one); content keeps the two-column candidates+preview grid; render + output side by side, output groups stacked at this width. No overflow.",
    "1440": "Wide (container 1200): four gate wells in one row (1fr / 1fr / 240px / 1.9fr), all equal height ~330px with vertically centered bodies; kit->template et al. horizontal out->in edges; content:down sweeps left under the gates band (128px gap) into render:up, clearing the output node's top; Render + output (V1/V2 groups side by side, frames 62px) centered as a second row. No horizontal overflow. Mid-run pause at ~2.3s shows chosen-vs-alternatives with check+ring on persona, kit, Split Stack, headline/subhead while cta/photo are still open and preview zones fill one by one."
  },
  "verifiedBehaviors": [
    "Autoplay via pixel-rootMargin sentinel ('0px 0px -160px') on the graphic, never a ratio of the tall graphic; shipped finished markup stays until play actually starts (no eager reset at load).",
    "Replay re-runs in view (announces 'Ad generator finished: 8 files for one practice.' via role=status only then), re-arms when the graphic is offscreen and the armed run starts on scroll-in (probed: armed -> running at +900ms -> finished).",
    "Scrolling the section fully away mid-run settles instantly to the finished state and does not restart on return.",
    "Persona advances per run: Frizzle -> Joe -> Sciuto -> Nye observed, front-card name/archetype and --persona output tint (#3182ce, #319795, #dd6b20) update; deck alternates stay visible behind the chosen card.",
    "Reduced motion (emulateMediaFeatures reduce + reload): shipped finished state everywhere, packets hidden, no run on scroll; replay just re-asserts the finished state and still announces.",
    "State machine probed at 100/800/1500/2300/3100/4600ms: gates activate and complete in order, picks/fills cleared on reset and re-applied in sequence, scan flags transient, output done with final ticker.",
    "Zero console errors across autoplay + replay runs; npx astro check: 0 errors, 0 warnings (4 pre-existing hints in files I don't own)."
  ],
  "engineChangesNeeded": "None. graph.ts and pipeline.ts used as-is. The two-routings-for-three-layouts limit (--graph-compact is root-global) was solved locally with a twin kit->template path shown only in the 640-1099 container band; layoutEdges computes both harmlessly and the choreography travels the visible one.",
  "spacingRule": "Applied Main's 8px-grid interjection: section root uses the new global section-y class (not the old py clamp); every margin/padding/gap in the section is from {2,4,8,16,24,32,40,48,64,96,128} (2/4 only for tight chip/icon internals).",
  "deviationsAndNotes": [
    "Render node sub-line is 'Fixed rules only' instead of the designer's 'Fixed rules, no LLM' to avoid a VOICE.md 'X, not Y' construction; the LLM fact lives verbatim in the section copy.",
    "No before/after time placeholder chips in the section, per contract line 29 (overrides designer spec 2.1 time line).",
    "Template scan flashes the first three wireframes then settles on Split Stack (Testimonial Frame never lights): the highlight stops at the match, matching 'moves across and settles'.",
    "Content preview is the neutral named-slot variant (no persona color), so persona color appears only inside the output AdFrames, per DESIGN.md.",
    "Hidden-tab settle/resume uses the same visibilitychange pattern proven in round 3; not exercised in headless verification ([INFERENCE] from identical code path).",
    "Browser note: the eval browser global attaches through the configured CDP relay; all checks ran in a dedicated tab named 'adgen' pointed only at localhost, closed afterwards."
  ]
}
```
