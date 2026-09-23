# Content TODO

Everything on the site that is a placeholder, an estimate, or needs Jules to confirm. Placeholders render with the dashed "needs input" treatment (`.ph-frame`, `.ph-chip`) and carry a `data-todo` attribute, so this command lists every one that is still live:

```sh
grep -rn 'data-todo' src
```

## Numbers (proof rail and pipeline results)

| Where | What | File |
| --- | --- | --- |
| Home, proof rail | Hours saved per year by her pipelines | `src/data/site.ts` → `stats` |
| Home, proof rail | Production assets shipped since 2017 | `src/data/site.ts` → `stats` |
| Home, proof rail | Revenue influenced by her campaigns | `src/data/site.ts` → `stats` |
| Home, ad generator | Production time per campaign, before and after (not shown on the site yet; add it to the section copy once known) | `src/sections/AdGenerator.astro` |
| Home, ad generator | Verify the "About 320 files per campaign" estimate (~40 practices x 8 deliverables) | `src/sections/AdGenerator.astro` |
| Home, photo intake | Hours per shoot, before and after (not shown on the site yet; add it to the section copy once known) | `src/sections/PhotoIntake.astro` |
| Footer, every page | Availability, typical response time, time zone | `src/components/Footer.astro` → `status` |

To fill a stat, set `value` and remove `placeholder: true`.

## Facts to confirm

- Photo intake: the example shoot, its keepers and rejects, the file names, and the `/web`, `/ads`, `/social`, `/print` folders are illustrative (the section says so and carries an "Example steps and folders" chip). Replace them in `src/sections/PhotoIntake.astro` once the real steps can be shown.
- Ad generator: the brand kits ("Sample kit A", "Sample kit B", "SamplePractice"), the candidate headlines and CTAs ("Sample copy" chip), and the file names are stand-ins; client work stays private. The personas and the five templates are real.
- The render demo in `src/sections/AiBento.astro` is labelled "Illustrative render sequence". The code, `render-campaign.ts`, and the terminal rows are stand-ins built from real vocabulary (the persona slug, Split Stack's 5 slots, the 8 deliverables). Swap in a real excerpt if one can be shared.
- The 40% cut in catalog and brochure production time is attributed to AI tooling at Machine Communications (`src/sections/AiBento.astro`). Confirm the wording.
- OrthoBoost promotion month in 2026 (the copy currently says "in 2026").
- The link-preview card (`public/og.png`) repeats the hero headline and sub. If either changes, re-render it (see README) and bump `OG_VERSION` in `src/layouts/Base.astro`.

## Logos

Drop single-color SVGs into `src/assets/logos/` using these exact file names; the proof rail swaps the text wordmark for the logo automatically.

- `orthoboost.svg`, `wincore.svg`, `machine-communications.svg`, `geek-inc.svg`, `decoy-ltd.svg`
- Two more client logos: add entries to `brands` in `src/data/site.ts` and replace the two `placeholder: true` slots.

Use `fill="currentColor"` in the SVGs so they inherit the muted ink color.

## Links

- LinkedIn profile URL: `src/data/site.ts` → `person.linkedin`. While it is empty, LinkedIn is hidden from the footer; the contact page shows an "add link" chip (`src/pages/contact.astro`).
- Resume: `public/assets/Julienna-Batten-Resume.pdf` is a copy of the previous "Jules Batten" resume. Replace it with the current version.

## Images (all wireframed with `<Slot>`; the caption is the asset brief)

Home
- Selected work: OrthoBoost (16:9), Wincore (4:3), Geek Inc. (4:5)
- Background: portrait of Jules (4:5)
- Off the clock: GLEAM still (1:1), show poster (4:5), live-visuals still (16:10), Spotify Canvas still (9:16), DECOY campaign shot (4:5), favorite commission (1:1)

Work (`/work`)
- One 16:10 (featured) or 4:3 slot per project; each brief lives in `src/data/projects.ts` → `brief`.
- Case study pages don't exist yet; entries say "Case study coming soon".

Swap a slot for an optimized image with Astro's `<Image>` from `astro:assets`, keeping the same aspect ratio so layout doesn't shift.

## Contact page

- Availability status ("add status" chip) and reply time in business days ("add number" chip): `src/pages/contact.astro`.
- Confirm the "What to expect" list (short scoping call, work samples on request) matches how Jules actually works.
- The form is a UI preview and does not send. Wire it to a form service (Formspree, Basin, a Worker) before removing the "Preview only" notice.

## Optional

- A short testimonial from a coworker or client (was left out on purpose rather than invented).
- Commission piece and client for the "Commissions" tile.
