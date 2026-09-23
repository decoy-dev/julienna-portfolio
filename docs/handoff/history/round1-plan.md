# Julienna Batten portfolio: build plan

## Brief (from the user, verbatim intent)
- Portfolio for Julienna "Jules" Batten: web designer, creative director, graphic designer who builds automations and AI-assisted pipelines.
- Current draft (https://gleam-7z.github.io/portfolio-2026/) is too bland in *content structure*. Market her like a SaaS markets itself.
- Hero: large value prop, one distinguishing trait recruiters remember. USER PICKED ANGLE: "A whole design team's output, from one person."
- Above the fold: social proof (worked-with logo rail) + metrics (hours saved, assets created, revenue). Unknown metrics = CLEARLY MARKED PLACEHOLDERS. Some logos = placeholders.
- Directly below fold: animation/visualization of her workflow showing how it generates value, backed by real examples. USER PICKED: Figma -> React ad generator, Photo/asset intake pipeline.
- Beneath: another value prop about AI-assisted workflows that tidies the section.
- Then traditional design work: Geek Inc (comic cons), Wincore (windows), OrthoBoost web.
- Show versatility + the background that made her good.
- Close with personal side: self-initiated work + commissions.
- Vibe: traditionally SaaS. Light, white bg, modern UI, animations. Tailwind as foundation, Phosphor icons, anime.js for animation. No AI tells; de-slop rules.
- Motif: USER PICKED node graph / pipeline. Corporate, not kitschy.
- Show off web-design tricks. Maximally usable, responsive. Lightweight; WebGL welcome. Lighthouse perf > 80; performant without hardware acceleration.
- NO scroll locking / scroll hijacking / guided experiences.
- Required chrome: floating navbar, custom scrollbar, return-to-top button, footer (can be creative).
- Pages: Home (full), Work (project list, not fleshed out), Contact (not functional), plus a comprehensive brand guide / asset kit (colors, fonts, UI components, rules) so future build-out stays cohesive.
- Images/self-provided graphics: wireframed placeholders.
- Decisions: Fresh identity (not her old cobalt). Astro + Tailwind v4. Light only, dark tokens documented in guide. Name "Julienna Batten". Built in ~/Documents/julienna-portfolio, pushed to GitHub account decoy-dev (GitHub Pages).

## Verified facts (only these numbers may appear unmarked)
- OrthoBoost (Oct 2025-present): Graphic Designer -> promoted Web Designer & Creative Director 2026. 11-persona brand/web system for ~40 client practices. React ad generator: personas + brand kits + templates, rules-driven, "no LLM in the render path", Claude-driven template synthesis, in-browser rendering, gated steps (persona -> brand kit -> template -> content -> render). Each campaign = 8 deliverables per practice (V1/V2 x Story 9:16/Post 4:5 x static/animated) + matching site template (nav, hero, footer). File naming `{Seasonal|Evergreen}_{Theme-YYYY}_{Video|Image}_{V1|V2}_{Story|Post}_{Client}`. 5 lo-fi templates: Badge Burst, Hero Banner CTA, Offer Card, Split Stack, Testimonial Frame. Personas have archetypes + accent colors (e.g. "Dr. V. Frizzle, The Wellness Educator"). Photo/asset intake pipeline: raw client shoots -> organized production-ready libraries.
- Machine Communications / Wincore (2022-2025): 5,000+ architectural line drawings; renders from DWG/STEP; template library 2,000+ configurations; online sales +25% in two quarters; AI tooling cut catalog/brochure production 40%; 3 major 3D viz projects; 7 web/print projects.
- Geek Inc (2019-2022): three comic & toy conventions + comic store; 30,000+ attendees/yr; pre-registration +27%; system across website, apparel, signage, badges, bracelets, billboards, social.
- Freelance (2017-present): brand systems for music artists; cover art for artist with 10M+ Spotify plays; 3D visualizers (GLEAM), Spotify Canvas, +110% Instagram engagement for a music client; TouchDesigner live visuals for rooms up to 500; DECOY Ltd streetwear visual direction; posters for grassroots / LGBTQ+-friendly shows.
- Marshall University BA Visual Arts & Media (2016-2020). Certs: Meta Certified Creative Strategy Professional, Adobe Certified Professional (PS/AI/ID), UI/UX specialization.
- Derived (flag for Jules to verify): ~40 practices x 8 = ~320 ad files per campaign from one brief.

## Design read
Solo designer portfolio marketed as a B2B SaaS landing, for recruiters/hiring managers at brand, agency, and in-house marketing teams; Stripe/Linear-light product-marketing language; Astro + Tailwind v4 + anime.js; node-graph motif. Dials: VARIANCE 6, MOTION 6, DENSITY 4.

## Identity (to be finalized by designer)
- Palette seed: teal oklch(0.720 0.100 188) (impeccable palette script). Pure white bg oklch(1 0 0). One accent, OKLCH, contrast-checked.
- Type: NOT Inter / DM Sans / Space Grotesk / IBM Plex / Instrument / Outfit / Plus Jakarta / Syne. No serif. Self-hosted via Fontsource. Display+body sans (maybe one family) + a mono only for node/port/data labels (mono must have semantic job, not costume).
- Radius system: documented rule (e.g. nodes/cards 12px, buttons pill or 8px, chips pill).
- Icons: Phosphor via astro-icon + @iconify-json/ph (build-time inline SVG, zero JS). One weight site-wide.

## Motif: node graph
- Primitives: Node (rounded rect, title + ports), Port (small circle on node edge), Edge (cubic bezier), Packet (small dot traveling an edge). Canvas backdrop = faint dot grid (node-editor canvas).
- The page itself is a pipeline: a thin "wire" in the left gutter connects section ports (desktop only), drawn via CSS scroll-driven animation (animation-timeline: view()) with static fallback. Organizes content, not decoration.
- Hero backdrop: tiny raw-WebGL dot-grid field that subtly displaces near the cursor; created with failIfMajorPerformanceCaveat:true so software-rendered browsers get a static CSS dot grid instead. Pauses offscreen / hidden tab / reduced motion.

## Page: Home (section order)
1. Floating pill navbar (one line, <=64px): mark + "Julienna Batten" | Work, Systems (anchor), About (anchor), Contact | primary CTA "Get in touch". Mobile: popover API menu. Light frosted bg with solid fallback.
2. Hero (left copy / right asset split). H1 around "A whole creative team's output, from one designer." Sub <=20 words. CTAs: "See the work" + "Get in touch". Right: hero node graph: six role nodes (Creative direction, Brand, Web design + code, Motion, 3D + viz, Automation) wired into one "Julienna" node, which outputs to "Shipped work". Packets flow via anime.js. Hero height leaves the proof rail peeking above the fold.
3. Proof rail (directly under hero, visible above fold at 1440x900): "Worked with" logo slots (OrthoBoost, Wincore, Machine Communications, Geek Inc, DECOY Ltd + 1-2 placeholder slots) and a stat strip: hours saved/yr [PLACEHOLDER], assets shipped [PLACEHOLDER], revenue influenced [PLACEHOLDER], +25% online sales (Wincore), ~40 practices on one system. Placeholders visibly marked (dashed chip "add number").
4. Pipeline demo ("Systems" anchor): interactive tabbed visualization of the two real pipelines. Tab A: Ad generator: Campaign brief -> 11 personas -> ~40 brand kits -> 5 templates -> render -> output grid filling with ~320 mini ad tiles tinted by persona accent colors, a live file-name ticker using the real naming convention. Tab B: Photo intake: raw shoot -> cull -> rename/tag -> crop to spec -> library. "Run pipeline" replay button. Autoplays once when in view (IntersectionObserver), never scroll-driven/locked. Result callouts below (real + placeholder before/after hours). Reduced motion: final state static.
5. AI value prop (bento, 4-5 cells, varied backgrounds): how she uses AI: procedural not generative (no LLM in render path), Claude drafts templates / rules render them, gated steps keep output on-brand, adding a client is data not code, human creative direction on every decision. Real artifacts inside cells (persona JSON excerpt, file-name string, gate checklist, brand-kit override swatches).
6. Selected work: OrthoBoost web, Wincore product viz, Geek Inc brand experience. Asymmetric layout (one wide + two), image placeholders, outcome chips, link to /work.
7. Range + background ("About" anchor): career as a node chain 2017 -> 2026 (Freelance, Marshall BA, Geek Inc, Machine Comms, OrthoBoost, CD promotion), each node emitting the skills it added; skills accumulate into the present. Horizontal desktop, vertical mobile. Plus capability groups.
8. Testimonial slot (1 quote, clearly placeholder, <=3 lines).
9. Personal work: GLEAM visualizers, TouchDesigner live sets, DECOY Ltd, posters, commissions. Masonry/gallery of placeholders, different layout family.
10. Closing CTA: "Get in touch" (email + resume download).
11. Footer (creative): the sitemap as a draggable node graph (nodes: Home, Work, Contact, Brand kit, Resume, LinkedIn, Email) with edges that follow drags (pointer events, keyboard accessible, real links underneath). Plus plain link columns and legal line.
- Global: custom scrollbar (CSS scrollbar-color + ::-webkit-scrollbar), back-to-top button with scroll-progress ring (CSS scroll-driven animation, fallback), cross-document View Transitions between pages, skip link, focus-visible rings.

## Other pages
- /work: filterable project list shell (filters are UI only), rows/cards with placeholders using same components.
- /contact: form UI (labels above inputs, non-functional), email, availability.
- /brand: comprehensive brand guide + asset kit: principles, logo/mark usage, color tokens w/ contrast values, type scale, spacing, radii, elevation, motion tokens (durations/easings), iconography, node-graph motif rules, components (buttons, links, chips, inputs, nav, stat, card, node, edge, placeholder, logo slot, tabs), voice & copy rules (no em dashes, banned words), do/don't, dark tokens (documented, not shipped).
- Repo docs: DESIGN.md (hardened rules mirroring /brand), CONTENT-TODO.md (every placeholder to fill).

## Hard constraints
- Zero em/en dashes in visible copy. No eyebrow on every section (<= ceil(n/3)). No section numbering. No 3 equal cards. No gradient text. No side-stripe borders. No border+wide-shadow ghost cards. No scroll cues. No decorative dots. One accent. One radius system. CTA labels: one per intent ("Get in touch" everywhere for contact).
- Motion: transform/opacity (+ SVG attrs), anime.js, IO-triggered, paused offscreen, reduced-motion alternatives, content visible by default (no reveal gating).
- Performance: static Astro, JS only where interactive, fonts self-hosted + preloaded, Lighthouse perf > 80 (target 95), no layout shift.
