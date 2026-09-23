# Round 4 user feedback (verbatim intent)

1. Page wire: the transition from straight vertical to curved (crossing to the other gutter) should be more seamless. Consider redesigning the whole thing.
2. The ad generator and the photo intake pipeline should NOT be shown simultaneously in one window. Give each its own section, where the pipeline is talked about in more depth.
3. Photo intake should be more illustrative: images get selected and the others discarded, then sorted, then named, then placed in the production library.
4. Ad generator should show more "process" / decision making: the persona is selected out of a stack, same with the brand kit, then the template is selected, and the content is placed or curated from a selection. Then render into the 8 files.
5. Remove the results row entirely (Per practice per campaign / Ships alongside / Production time per campaign / Hours per photo shoot).
6. Remove the footnote "The ad generator steps match the tool I use at OrthoBoost. Practice names, file names, and the photo intake steps are stand-ins, since client work stays private." Fold its honesty content into each pipeline's own supporting copy.
7. "I sign off" node (Who does what, AiBento) should be more visual: a large icon in the center, text underneath.
8. When the page-wire ball reaches the closing CTA, it should animate into the CTA block and make the CTA pulse when the CTA is vertically centered on the page.
9. The footer's draggable sitemap node graph doesn't do anything useful. Replace it with something else.

# Standing constraints (unchanged)
- White bg, one teal accent, node-graph motif, Tailwind v4, Phosphor icons (astro-icon), anime.js v4.
- No scroll lock/hijack, NO scroll event listeners (ScrollTimeline / animation-timeline / IntersectionObserver are fine). Reduced motion gets final states. Gate animation on offscreen / hidden tab. Content visible without JS. WCAG 2.2.2: auto motion under 5s or pausable.
- Lighthouse perf > 80 mobile with GPU disabled (currently 99). 320 to 1440+, no horizontal overflow.
- VOICE.md: first person always; zero em/en dashes; no AI sentence patterns (triads, "X, not Y", stock phrases); no all-caps eyebrows, no mono uppercase labels (use `.meta` sentence case).
- Fonts: Funnel Display (headings), Funnel Sans (body), Spline Sans Mono only for literal file names/paths/code/email.
- Honesty: only resume-verified numbers unmarked; placeholders use `.ph-chip`. Photo intake steps are examples; client names are "SamplePractice"; "~320 files per campaign" keeps "Estimate, verify". Persona/client colors only inside rendered-output previews.
- Verified ad-generator facts: 11 personas (src/data/site.ts), ~40 practices/brand kits, 5 templates (Badge Burst, Hero Banner CTA, Offer Card, Split Stack, Testimonial Frame), gated steps persona -> brand kit -> template -> content -> render, rules-driven render with no LLM in the render path, Claude drafts templates, 8 deliverables per practice (V1/V2 x Story/Post x Image/Video), naming `{Seasonal|Evergreen}_{Theme-YYYY}_{Video|Image}_{V1|V2}_{Story|Post}_{Client}`, a matching site template (nav, hero, footer) ships alongside. Split Stack zones in src/data/split-stack.json (slots headline, subhead, cta, photo, logo).
