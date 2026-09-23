# Fonts

The Julienna Batten identity uses exactly three typefaces, each with one job. Do not add a fourth.

## Funnel Display (headlines, stats, wordmark)

- Role: h1 through h3, stat numbers, the "Julienna Batten" wordmark and lockup. Nothing else.
- Weights used: 650 (h2, h3), 700 (display, stats), 600 (wordmark).
- Source: variable font, latin subset.
  - npm: `@fontsource-variable/funnel-display`
  - Google Fonts: https://fonts.google.com/specimen/Funnel+Display
- License: SIL Open Font License 1.1.
- CSS stack: `"Funnel Display", ui-sans-serif, system-ui, sans-serif`

## Funnel Sans (body and UI)

- Role: everything you read that is not a heading: body, captions, buttons, links, chips, form labels, the `.meta` small label (0.8125rem/600, sentence case).
- Weights used: 400 (body), 500 (chips), 600 (buttons, labels, meta).
- Source: variable font, latin subset.
  - npm: `@fontsource-variable/funnel-sans`
  - Google Fonts: https://fonts.google.com/specimen/Funnel+Sans
- License: SIL Open Font License 1.1.
- CSS stack: `"Funnel Sans", ui-sans-serif, system-ui, sans-serif`

## Spline Sans Mono (literal data only)

- Role: literal file names, paths, JSON and code excerpts, token names and values. Never labels, never titles, never captions, never uppercase, never letterspaced. If it reads as a sentence or names a thing for a reader, it is Funnel Sans.
- Weights used: 400 and 500.
- Source:
  - npm: `@fontsource-variable/spline-sans-mono`
  - Google Fonts: https://fonts.google.com/specimen/Spline+Sans+Mono
- License: SIL Open Font License 1.1.
- CSS stack: `"Spline Sans Mono", ui-monospace, "SF Mono", Menlo, monospace`

## Serving rules

Self-host the three variable woff2 files, `font-display: swap`. Preload Funnel Display and Funnel Sans (both appear above the fold); never preload the mono (nothing above the fold uses it). Never load fonts from a third-party CDN at runtime.

## Files shipped in the portfolio repo

| File | Face | Range |
| --- | --- | --- |
| `src/assets/fonts/funnel-display-var.woff2` | Funnel Display variable | wght 300-800, latin |
| `src/assets/fonts/funnel-sans-var.woff2` | Funnel Sans variable | wght 300-800, latin |
| `src/assets/fonts/spline-sans-mono-var.woff2` | Spline Sans Mono variable | wght 300-700, latin |

All three are declared in `src/styles/global.css`; the two Funnel files are preloaded in `src/layouts/Base.astro`.
