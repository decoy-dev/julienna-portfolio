# Fonts

The Julienna Batten identity uses exactly two typefaces. Do not add a third.

## Host Grotesk (sans: display and body)

- Role: everything that is prose. Headlines, body, buttons, links, chips, captions.
- Weights used: 400 (body), 500 (chips, quote emphasis), 600 (h2, h3, buttons, wordmark), 650 (display, stats).
- Source: variable font, latin subset.
  - npm: `@fontsource-variable/host-grotesk`
  - Google Fonts: https://fonts.google.com/specimen/Host+Grotesk
- License: SIL Open Font License 1.1 (free for commercial use, embedding, and web serving).
- CSS stack: `"Host Grotesk", ui-sans-serif, system-ui, sans-serif`
- Serving rule: self-host the variable woff2, preload it, `font-display: swap`. Never load from a third-party CDN at runtime.

## Commit Mono (mono: data only)

- Role: node titles, port labels, file names, JSON and data excerpts, stat labels, placeholder labels, the `.label` micro-label. Never prose, never headlines. Its job is "this is data".
- Weights used: 400 and 500 (500 is the shipped file; the face reads as one weight).
- Source:
  - npm: `@fontsource/commit-mono`
  - Site: https://commitmono.com
- License: SIL Open Font License 1.1.
- CSS stack: `"Commit Mono", ui-monospace, "SF Mono", Menlo, monospace`
- Typographic detail: use `letter-spacing: 0.08em` and uppercase for labels; normal case for file names and data.

## Files shipped in the portfolio repo

| File | Face | Range |
| --- | --- | --- |
| `src/assets/fonts/host-grotesk-var.woff2` | Host Grotesk variable | wght 300-800, latin |
| `src/assets/fonts/commit-mono-500.woff2` | Commit Mono 500 | latin |

Both are declared in `src/styles/global.css` with `font-display: swap`; the sans file is preloaded in `src/layouts/Base.astro`.
