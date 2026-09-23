# Handoff: Julienna Batten portfolio

Everything needed to pick this project up on another machine. Read this first, then `DESIGN.md`,
`VOICE.md`, and `CONTENT-TODO.md` in the repo root.

- Live site: https://decoy-dev.github.io/julienna-portfolio/
- Repo: https://github.com/decoy-dev/julienna-portfolio (branch `main`, GitHub account `decoy-dev`)
- Deploys: every push to `main` runs `.github/workflows/deploy.yml` (GitHub Pages via Actions).

## What this is

A portfolio for Julienna "Jules" Batten (web designer, creative director, graphic designer who builds
automations and AI-assisted pipelines), marketed like a SaaS product: a value-prop hero, proof rail,
the two pipelines she built shown as live node-graph demos, an AI section, selected work, background,
personal work, a closing CTA, and a `/brand` guide with a downloadable asset kit. Pages: `/`, `/work`,
`/contact` (form is a UI preview, not wired), `/brand`.

Stack: Astro 7 (static), Tailwind v4 via `@tailwindcss/vite`, anime.js 4 (`animejs/animation`),
astro-icon with Phosphor (`@iconify-json/ph`). No framework runtime.

## Setup on a new machine

```sh
git clone https://github.com/decoy-dev/julienna-portfolio.git
cd julienna-portfolio
npm ci                         # Node >= 22.12 (CI uses 22; developed on 24.13)
npx astro dev --port 4321      # http://localhost:4321/julienna-portfolio/  (note the base path)
npx astro check                # expect 0 errors, 0 warnings (a few pre-existing hints)
npx astro build && npx astro preview --port 4322 --host 127.0.0.1
```

`astro.config.mjs` sets `site: https://decoy-dev.github.io` and `base: /julienna-portfolio`. Every internal
link and public asset URL goes through `href()` in `src/lib/url.ts`; never hardcode a path.

## Deploy

Push to `main`. The workflow builds and deploys to Pages (takes about 40s). With the GitHub CLI logged
in as `decoy-dev`:

```sh
export GH_TOKEN="$(gh auth token --user decoy-dev)"
git push -q "https://x-access-token:${GH_TOKEN}@github.com/decoy-dev/julienna-portfolio.git" main && git fetch -q origin
gh run list -R decoy-dev/julienna-portfolio -L 1
gh run watch <id> -R decoy-dev/julienna-portfolio --exit-status
```

(A plain `git push` works too if your credentials for `decoy-dev` are set up.) Repo-local git identity
used so far: `Chris <chris@hvddox.com>`.

Link-preview card: `scripts/og/render.mjs` renders `public/og.png` (1200x630) and
`public/apple-touch-icon.png` with a headless Chrome (`CHROME=/path/to/chrome-headless-shell node
scripts/og/render.mjs`). After re-rendering, bump `OG_VERSION` in `src/layouts/Base.astro`.

## Project map

| Path | What |
| --- | --- |
| `src/pages/` | `index`, `work`, `contact`, `brand` |
| `src/layouts/Base.astro` | Head, fonts (preloaded woff2 via Vite imports), OG tags, nav, footer, back-to-top |
| `src/sections/` | Home sections in order: `Hero`, `AdGenerator` (#systems), `PhotoIntake` (#intake), `AiBento`, `SelectedWork` (#work), `Background` (#about), `Personal`, `ClosingCta` |
| `src/components/` | `Nav`, `Footer` (status panel), `HeroGraph`, `PageWire`, `CountUp`, `AdFrame`, `Slot` (image placeholders), `Mark`, `BackToTop`, `brand/*` (the /brand guide sections) |
| `src/scripts/graph.ts` | Node-graph engine: `layoutEdges` (ports, compact variants, elbow routes), `MotionScope`, `sendPacket`, `drawEdge`, `watchVisibility`, `reducedMotion` |
| `src/scripts/pipeline.ts` | Shared lane runner (`createLaneRunner`); choreography in `ad-generator.ts` and `photo-intake.ts` |
| `src/scripts/copy-email.ts` | Copy-email buttons (footer and /contact) |
| `src/data/site.ts` | Single source for person, stats, brands, seats, personas, templates |
| `src/data/split-stack.json`, `src/data/projects.ts` | Real Split Stack template zones; project list |
| `src/styles/global.css` | Tokens, components (`.node`, `.port`, `.edge`, `.packet`, `.btn`, `.ph-chip`, `.meta`, `.section-y`, ...) |
| `public/brand-kit/` | Downloadable asset kit linked from /brand |
| `scripts/qa/` | QA tools (below) |
| `docs/handoff/history/` | Every round's plan, user feedback, design specs, and advisor reviews |

## The user's standing requirements (do not regress these)

Visual and interaction
- Traditional SaaS look: white background, ONE teal accent, node-graph motif (nodes, ports, edges,
  packets on a 24px dot-grid canvas). Phosphor icons. No gradients/glows/neon, no ghost cards.
- Fonts: Funnel Display (headings), Funnel Sans (body), Spline Sans Mono ONLY for literal file names,
  paths, code, and the email address. The user dislikes JetBrains Mono and generic faces (Inter etc.).
- No all-caps eyebrows, no mono uppercase labels: small labels are `.meta` in sentence case.
- No scroll locking, scroll hijacking, or scroll event listeners (ScrollTimeline, CSS
  `animation-timeline`, and IntersectionObserver are fine).
- Motion respects `prefers-reduced-motion` (live changes too), pauses/settles offscreen and on hidden
  tabs, and never gates content: everything ships in its finished state and is readable without JS.
  Automatic motion stays under 5s (WCAG 2.2.2) or gets a pause control.
- Edges idle grey until a packet crosses them, then turn teal (the user asked for this explicitly).
- Spacing rule (round 4): every margin, padding, and gap is a factor or multiple of 8px
  (2, 4, 8, 16, 24, 32, 40, 48, 64, 96, 128); 2 and 4 only inside components. No fluid vw/vh spacing.
  Details in `DESIGN.md` → Layout; enforce with `scripts/qa/spacing-audit.js`.

Quality bars
- Lighthouse performance > 80 on the mobile preset with the GPU disabled (currently 99 to 100 on all
  pages, CLS 0, TBT 0). Responsive 320 to 1440+ with no horizontal overflow.

Copy and honesty (read `VOICE.md`)
- First person always ("I built..."). "Julienna Batten" appears only as identity (nav lockup, titles,
  the hero operator node).
- Zero em or en dashes. No AI sentence patterns (triads, "X, not Y", stock phrases, buzzwords).
- Only resume-verified numbers ship unmarked (list in `history/round1-plan.md` → Verified facts).
  Unknowns are dashed `.ph-chip` placeholders and are listed in `CONTENT-TODO.md`. "About 320 files per
  campaign" is an estimate and keeps its "Estimate, verify" chip. Client names are "SamplePractice";
  photo intake steps, folders, and images are labelled illustrative/example. Persona and client colors
  appear only inside rendered-output previews (AdFrame), never as UI color.

## How the user expects work to be done

Each revision round so far followed the same loop, and the user asked to keep it:
1. Capture the user's feedback verbatim as a list (see `history/round*-user-feedback.md` / `-revisions.md`).
2. A designer agent writes an implementation-ready spec (layouts per breakpoint, exact copy, timings).
3. An advisor agent (the "sol" read-only reviewer) reviews the spec for honesty, lifecycle,
   accessibility, and whether it answers the feedback; its blocking items are fixed before building.
4. Build (parallel builders for independent sections with a written ownership contract, see
   `history/round4-build-contract.md`), then verify in a real browser at 320, 390, 768, 1024, 1440
   (+1359/1360 for the page wire), including mid-run states, replay, reduced motion, and hidden tab.
5. `npx astro check`, build, Lighthouse, then an advisor review of the build, fix, commit, push, and
   confirm the Pages deploy.

## QA toolkit

- Browser: any Chromium works. On the original machine QA used Playwright's Chrome for Testing,
  headless, with a fresh profile per tab:
  `~/Library/Caches/ms-playwright/chromium-1234/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing --headless=new --user-data-dir=/tmp/jb-<name>`.
  In the omp harness this was wrapped as
  `openQA = (name) => browser.open({ name, url: 'about:blank', app: { path: <that exe>, args: ['--headless=new', '--user-data-dir=/tmp/jb-' + name, 'about:blank'] } })`.
- Reduced motion: `page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }])`.
- Hidden tab: override `document.hidden`/`visibilityState` with `Object.defineProperty` and dispatch
  `visibilitychange`.
- Pitfalls seen: a headless tab can wedge (IntersectionObserver and media-query events stop firing,
  screenshots time out). That is the harness, not the site: close the tab and open a fresh one.
  Init scripts added through CDP may survive removal; use a fresh tab after failure-injection tests.
- `scripts/qa/spacing-audit.js`: paste into the console (or evaluate) on each page; must return only the
  two known exceptions (native `<option>` gaps; the mark clear-space specimen on /brand).
- `scripts/qa/snap-tailwind-spacing.py` and `scripts/qa/snap-css-spacing.py`: dry-run spacing snappers
  (pass `--apply` to write). Both should report nothing.
- `scripts/qa/lighthouse.sh`: Lighthouse on all four pages against a running preview (set `CHROME_PATH`).
- The Vite dev server sometimes serves a stale `<style>` chunk after a style-only edit; touch the file.

## History (docs/handoff/history)

| Round | Files | What changed |
| --- | --- | --- |
| 1 | `round1-plan.md`, `round1-build-contract.md` | Brief, verified facts, identity, full build: home, work, contact, brand guide + kit, GitHub Pages |
| 2 | `round2-revisions.md` | Funnel type system, concurrent hero graph, H1 highlight, two-lane pipelines, OG card, voice pass |
| 3 | `round3-revisions.md`, `round3-pipelines-spec.md`, `round3-codeblock-notes.md`, `specs/round3-designer-spec.md` | Distinct pipeline shapes, typed render demo synced to the gate checklist, Who does what flow, page-wide scroll wire, count-ups, Marshall elbow route |
| 4 | `round4-user-feedback.md`, `specs/round4-pipeline-spec.md`, `specs/round4-chrome-spec.md`, `reviews/round4-spec-review.md`, `round4-amendments.md`, `round4-build-contract.md`, `builds/round4-*-report.md`, `reviews/round4-build-review.md` | Pipelines split into two sections with decision/stage graphics, results row and footnote removed, G2-smooth page wire, ball enters the CTA and the button pulses at center, visual "I sign off" node, footer status panel replaces the sitemap graph, site-wide 8px spacing rule |

References in those files to `local://...` or `agent://...` pointed at session-local copies of the same
documents; everything they referred to is in this folder. The original source material (Jules's resume
content and the OrthoBoost ad-generator repo excerpts) lived outside this repo; the facts taken from it
are recorded in `round1-plan.md` → "Verified facts", `src/data/site.ts`, and `src/data/split-stack.json`.

## Open items

See `CONTENT-TODO.md` for everything Jules still has to supply (metrics, logos, images, LinkedIn URL,
current resume PDF, availability/response time/time zone, real pipeline steps). Nothing else is
known to be pending as of the last commit; the state at handoff is recorded below.

## State at handoff

Updated with each handoff commit.

**Last code commit: `512e9af` (Round 4), deployed and verified live.** Round 4 feedback (all nine items
plus the mid-round spacing rule) is implemented and passed the advisor's post-build review; its three
blocking findings were fixed and re-verified:
- CTA pulse starts only while the button is really on screen and cancels when it leaves.
- Photo intake folder names and filenames stay at full contrast in every state.
- Copy-email failure shows a short "Copy failed" label plus a wrapping hint, and restores focus.

Verification at that commit:
- `astro check` 0 errors / 0 warnings; build clean.
- Lighthouse (mobile, `--disable-gpu`): 100 / 100 / 100 / 100 on all four pages, CLS 0, TBT 0.
- No horizontal overflow at 320, 390, 768, 1024, 1359, 1360, 1440.
- Spacing audit clean (only the two documented exceptions).
- Ad generator autoplay 4.42s and photo intake 4.45s, measured to the last transitionend (under 5s).
- Page-wire ball reaches the "Get in touch" center when the button is at mid-viewport, then docks.

Known, accepted limitations (non-blocking in review):
- The ad generator's Split Stack preview is schematic. Chosen content lights its slot, but the text is
  not literally transferred; don't describe it as content transfer.
- Without JS there is no page wire (it is decorative; all content is readable).

Nothing else is in progress. The next round starts from new user feedback; follow the loop above.
