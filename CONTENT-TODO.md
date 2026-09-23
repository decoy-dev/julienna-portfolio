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
| Home, pipeline (ad generator) | Production time per campaign, before and after | `src/sections/Pipeline.astro` → results |
| Home, pipeline (ad generator) | Verify the "~320 files per campaign" estimate (~40 practices x 8 deliverables) | `src/sections/Pipeline.astro` |
| Home, pipeline (photo intake) | Hours per shoot, before and after | `src/sections/Pipeline.astro` → results |

To fill a stat, set `value` and remove `placeholder: true`.

## Facts to confirm

- Photo intake steps (Import, Cull, Name, Prepare) are examples; the lane shows an "Example steps" chip. Replace them in `src/sections/Pipeline.astro` → `lanes[1].steps`, then remove `example: true` and update the footnote under the demo.
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
