# Julienna Batten, portfolio

Static portfolio site built with Astro, Tailwind CSS v4, anime.js, and Phosphor icons. Deployed to GitHub Pages at `https://decoy-dev.github.io/julienna-portfolio/`.

## Develop

```sh
npm install
npm run dev      # http://localhost:4321/julienna-portfolio/
npm run build    # static output in dist/
npm run preview
```

## Where things live

| Path | What |
| --- | --- |
| `DESIGN.md` | The design system contract: tokens, type, motion, motif, components, voice. Read before adding anything. |
| `CONTENT-TODO.md` | Every placeholder, estimate, and unconfirmed fact on the site. |
| `src/data/site.ts` | Copy and facts shared across pages (stats, brands, personas, seats). |
| `src/styles/global.css` | Tokens (`@theme`) and shared component classes. |
| `src/sections/` | Home page sections. |
| `src/components/` | Shared components (nav, footer, mark, placeholder slot, graph pieces). |
| `src/scripts/graph.ts` | Node-graph engine: edge routing, packets, edge drawing. |
| `src/scripts/field.ts` | WebGL dot-grid field for the hero (falls back to CSS on software rendering). |
| `src/scripts/pipeline.ts` | Pipeline demo choreography. |
| `src/pages/brand.astro` | Live brand guide; downloads in `public/brand-kit/`. |

## Link-preview card

`public/og.png` (1200x630) and `public/apple-touch-icon.png` are rendered from HTML in `scripts/og/render.mjs`, using the site's own fonts and tokens:

```sh
CHROME=/path/to/chrome-headless-shell node scripts/og/render.mjs
```

Then bump `OG_VERSION` in `src/layouts/Base.astro` so social platforms fetch the new image instead of a cached one.

## Deploy

Pushing to `main` runs `.github/workflows/deploy.yml`, which builds and publishes to GitHub Pages. Internal links must go through `href()` in `src/lib/url.ts` because the site lives under the `/julienna-portfolio` base path.
