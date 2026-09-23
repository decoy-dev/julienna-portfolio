```json
{
  "files": [
    {
      "path": "src/sections/PhotoIntake.astro",
      "action": "replaced stub",
      "notes": "Section root #intake with data-wire-section + data-wire-stay (Main's amendment) and aria-labelledby; H2 first heading, everything in .shell. Contract-exact copy: H2, intro, col 1 disclosure, col 2 safe folder line, ph-chip 'Example steps and folders' above the graphic, ph-chip 'Illustrative' on the ticker. Graphic is a full-shell-width .window (container-type: inline-size) + .pipe grid-canvas with five literal stages: Raw shoot (15 seeded scattered frames, 3 aspect ratios, rotations) -> Select (2x4 checked keepers with graphic-deep rings) -> Sort (/web /ads /social /print mono-labelled clusters) -> Name (8 file cards, mono names like web_hero_01.webp) -> Production library (.node output, 4 folder rows with glyph thumbs, library/... ticker). Rejects take an X badge then visibly leave (shrink + drop + fade) into a 'Discarded \u00b7 7' tray that fills in sync. Each keeper carries one neutral Phosphor glyph (mountains, user, storefront, sun, smiley, flower, buildings, tree) through raw, select, sort, name, and library thumbs, so one photo is followable end to end. Packets are 12x9 thumbnail rects (class packet). Counts labelled example ('15 example frames' + chip + copy). Whole window aria-hidden with one static sr-only demonstration description; sr-only role=status announced only on explicit replay. Ships fully in data-state=done (no-JS/reduced-motion final state, no eager reset at load)."
    },
    {
      "path": "src/scripts/photo-intake.ts",
      "action": "new",
      "notes": "createPhotoIntake(lane) factory on createLaneRunner. Stages are CSS-owned (transition-delay staggers from --k/--c custom props); the runner walks step(raw 800) -> travel 250 -> step(select 640) -> travel -> step(sort 540) -> travel -> step(name 640) -> travel -> reveal(110). Nothing set outside the engine's STATEFUL selector, so finish/reset need no restore hooks."
    }
  ],
  "lifecycle": "Inline script: sentinel autoplay via IntersectionObserver on the raw-shoot zone with a -96px bottom rootMargin (pixel margin, never a ratio of the tall graphic); watchVisibility(graph, 0) tracks in-view for replay decisions; watchVisibility(section, 0) settles when the section fully leaves; visibilitychange settles on hide and starts an unstarted in-view run on return; replay re-arms when offscreen; a live reduced-motion switch marks the run started so it never restarts (runner itself finishes the lane).",
  "measurements": {
    "wallClockMs": [
      4451,
      4429
    ],
    "method": "performance.now from replay click to last transitionend inside the window (capture phase, 141 transitions per run), 1.5s quiet window; both runs under the 5000ms budget with ~550ms margin",
    "astroCheck": "0 errors, 0 warnings; 4 pre-existing hints in files owned by others (HeroGraph, graph.ts, copy-email.ts)"
  },
  "breakpoints": {
    "320": "4x2 select grid, 2x2 clusters, 1-col names, tray minis shrink to 16px (211px, fits); zoneOverflow false, page 309 == 309. Mid-run shot caught a thumbnail packet on the select->sort edge.",
    "390": "Stack with single-column file cards (fix applied: below 440px container the 19-char names wrapped mid-name in 2 columns; now one column, nmWrapped false), 8-wide select row, 4 clusters. No overflow (379 == 379).",
    "1024": "--graph-compact: 1, single column stack with distinct shapes: scatter + discard tray, one row of 8 checked keepers, 4 clusters in a row, 2-column file cards, library node; vertical centered edges. No overflow.",
    "1440": "Wide composition confirmed (5 columns 280/120/203/193/243px inside the 1200px window, horizontal bezier edges with ports, zones vertically centered). Mid-run shot: raw done with tray filled, select active with ring, downstream dimmed at .25. Finished shot: every stage checked, ticker rests at library/print/print_card_02.tif. No overflow (scrollWidth == clientWidth)."
  },
  "behavior_checks": {
    "autoplayOnce": "IO on raw zone triggered the run when scrolled in at every width tested; shipped done state verified intact before first scroll (no eager reset)",
    "replay": "click-to-finish 4429-4451ms, announcement 'Photo intake finished: a production library from one shoot.' set only after replay",
    "replayOffscreen": "click at scrollTop 0 left the finished state untouched (armed); scrolling back started a fresh run (observed done,active,,, mid-run)",
    "hiddenTab": "simulated visibilitychange mid-run settled all stages to done instantly",
    "reducedMotion": "emulated prefers-reduced-motion: reduce; scroll-in and replay both kept the finished state with 0 transitionend events; status still announced on replay"
  },
  "engine_changes_needed": "None; used createLaneRunner/graph.ts as shipped. One coordination item received from Main mid-build (add data-wire-stay to the section root) and applied.",
  "notes": "Browser automation in this environment routes through the relay; verification used a dedicated localhost tab ('pi', released afterward) with CDP viewport emulation for 1440/1024/390/320. tickerFile helper inlined per ts-no-tiny-functions; zone/into helpers in photo-intake.ts kept (4 lockstep call sites each)."
}
```
