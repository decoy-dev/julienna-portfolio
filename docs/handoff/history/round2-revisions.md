# Round 2 revisions: Julienna Batten portfolio

Project: ~/Documents/julienna-portfolio (Astro 7 + Tailwind v4 + anime.js v4 + Phosphor via astro-icon). Live: https://decoy-dev.github.io/julienna-portfolio/. Original brief + constraints: local://PLAN.md. Voice rules: ~/Documents/julienna-portfolio/VOICE.md (first person, no AI sentence patterns). Design contract: ~/Documents/julienna-portfolio/DESIGN.md. Current screenshots (1440x900): /tmp/jb-shots/{hero,pipeline,pipeline-lower,bento,timeline,footer}.webp.

## User feedback (verbatim intent)
1. Avoid really standard font faces. The user hates JetBrains Mono (the current Commit Mono reads very close to it). Current sans is Host Grotesk.
2. Hero graphic should be more reactive with more movement. Instead of going down the list sequentially, all six role nodes should be rapidly piping into the Julienna Batten node concurrently. Each role node should visibly "fill" left to right, then send its dot along the wire into the Julienna node.
3. "whole design team's output" in the H1 gets a highlighting animation on first load to emphasize it.
4. Eyebrow-style node titles like "One practice, one campaign" (mono uppercase node title bars) read as an AI tell.
5. The "Photo intake" tab was hard to spot; refine how both pipelines are illustrated simultaneously.
6. Many graphic sections are heavy and hard to follow; simplify.
7. Freedom to improve beyond the list.
8. (Added mid-round) Create a rich embed graphic: the social/link-preview image shown when the site URL is shared (Open Graph + Twitter large card), plus the meta tags on every page.

## Main's proposals (designer to refine or overrule)
- Type: replace BOTH families with something less standard, self-hostable (Fontsource or a free OFL foundry file), light enough for Lighthouse. Drastically reduce mono usage: mono only for literal file names and code; every other small label becomes sentence-case sans (kills the uppercase-tracked "label" look that reads as eyebrows).
- Node titles: remove the mono uppercase node-bar headers for content titles. Nodes get a sentence-case sans title (or none) with literal wording ("8 files for one practice", not "One practice, one campaign").
- Hero animation: all six role nodes run concurrently on staggered, slightly randomized cycles: a left-to-right fill (scaleX on a pseudo-element, compositor-only) over ~0.7-1.1s, then a packet fires along the edge into the Julienna node, the role resets and refills. The Julienna node reacts to each arrival (brief border/ring pulse); every few arrivals it emits a packet to Shipped work, whose output chips light one at a time. Reactivity: hovering/focusing a role node speeds or triggers its fill; clicking fires it. Pause button and reduced-motion/offscreen gating stay.
- H1 highlight: wrap "whole design team's output" in a span; on page load a marker band (graphic-tint, lower ~55% of the line) sweeps left to right across the phrase once. Static highlight under reduced motion. No gradient text.
- Pipelines: drop the tabs. Show both pipelines at once as two stacked horizontal lanes in one frame (clear lane titles at left), each a short flow of ~4-5 compact steps into one simple output node. Ad generator output: a small row of 8 mini frames + "~320 per campaign (estimate)". Photo intake output: a simple folder stack. Both lanes animate when the section enters view (staggered), with one "Replay" control. Remove the 40x8 tile grid and the second output node per lane; keep the results row but lighter.
- Simplify other graphic sections: AI bento (shorter or no JSON block), background timeline (fewer chips, less chrome), footer graph (fine, maybe smaller).
- Embed graphic: a 1200x630 PNG in public/ (under ~150 KB), built by Main from an HTML/CSS composition using the site's own fonts, tokens, and a simplified hero graph, rendered once in headless Chrome. Must read at thumbnail size (Slack/iMessage/LinkedIn crop to ~500px wide): name, the value prop, one clear motif element, no tiny text. Tags on every page: og:image, og:image:width/height/alt, twitter:card=summary_large_image, twitter:image, og:site_name.

## Constraints that still hold
No scroll locking; Lighthouse perf > 80 on mobile preset with GPU disabled; reduced motion + offscreen + pause gating; content visible without JS; one accent (teal); zero em/en dashes; first-person voice; responsive 320-1440+.
