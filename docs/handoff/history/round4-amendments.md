# Main's amendments to the round 4 specs

Specs: agent://R4PipelineDesigner (pipelines) and agent://R4ChromeDesigner (wire, CTA handoff, sign-off node, footer).

## Pipelines
- Drop invented copy: "The file names look fussy until the third campaign." and the consequence clause "so any file can be regenerated exactly". Keep: "Claude helps me draft new templates, but fixed rules render the ads. No LLM touches the render path."
- Ad output at 1440 sits in an 8-col graphic next to a 4-col copy column; the spec's 272px output node would make frames ~28px wide (the round 3 advisor already flagged 34px). Change: internal grid rail 272 | render 112 | output 1fr (~336px), and the output stacks V1 over V2 (each a row of 4) so frames are ~70px wide.
- Photo intake packets are tiny thumbnail rects (not dots), so a frame visibly travels between stages.
- Replay: one button per section, label "Replay pipeline". Autoplay under 5s each (ad ~4.4s, photo ~3.9s).

## Chrome
- Footer panel intro: drop the meta sentence about placeholders. Heading "Before you email me"; intro: "Where I am, when I can start, and how fast I reply." (placeholders stay as .ph-chip). LinkedIn link renders only when person.linkedin is set (it is empty today). Copy email follows the contact page's existing clipboard helper pattern.
- Wire: adopt the two closed-form G2 primitives (crossing bend, eased quarter turn R=40) and the ball-only z-order change + ballPath extension into the button center, plus in-panel fill line.
- CTA pulse: IO center band on the button, once per band entry, also below 1360px, skipped when hidden tab or reduced motion.
- Sign-off node: centered 40px ph:seal-check, title, one line, one scale pulse at the end of the packet pass.
