#!/usr/bin/env node
/**
 * Renders the link-preview card (public/og.png, 1200x630) and the Apple touch icon
 * (public/apple-touch-icon.png, 180x180) from HTML that uses the site's own fonts and tokens.
 *
 *   CHROME=/path/to/chrome-headless-shell node scripts/og/render.mjs
 *
 * Any Chromium works; `chrome-headless-shell` (installed with Playwright/Puppeteer) is the most
 * reliable for CLI screenshots. After changing the card, bump OG_VERSION in
 * src/layouts/Base.astro so social crawlers fetch the new image.
 */
import { execFileSync } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const fonts = pathToFileURL(join(root, 'src/assets/fonts')).href;
const icons = JSON.parse(readFileSync(join(root, 'node_modules/@iconify-json/ph/icons.json'), 'utf8')).icons;
const icon = (name, size) => `<svg width="${size}" height="${size}" viewBox="0 0 256 256" aria-hidden="true">${icons[name].body}</svg>`;

const chrome =
  process.env.CHROME ??
  ['/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/usr/bin/google-chrome', '/usr/bin/chromium'].find(existsSync);
if (!chrome) throw new Error('Set CHROME to a Chromium binary.');

// Mark geometry mirrors src/components/Mark.astro (tile variant).
const mark = (size) => `<svg width="${size}" height="${size}" viewBox="0 0 40 40" fill="none">
  <rect width="40" height="40" rx="10" fill="oklch(0.46 0.08 188)"/>
  <g stroke="#fff" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round" transform="translate(1 -1.6)">
    <path d="M18 9V29"/><path d="M18 16.5C23.5 16.5 29 18.2 29 22.3C29 26.4 23.5 28 18 28"/><path d="M18 29C18 33.5 15.5 35.2 12 34.2"/>
  </g>
  <g fill="oklch(0.94 0.03 188)" stroke="oklch(0.46 0.08 188)" stroke-width="1.2" transform="translate(1 -1.6)">
    <circle cx="18" cy="9" r="3"/><circle cx="12" cy="34.2" r="3"/>
  </g>
</svg>`;

const css = `
@font-face { font-family: "Funnel Display"; src: url("${fonts}/funnel-display-var.woff2") format("woff2"); font-weight: 300 800; }
@font-face { font-family: "Funnel Sans"; src: url("${fonts}/funnel-sans-var.woff2") format("woff2"); font-weight: 300 800; }
:root {
  --ink: oklch(0.205 0.018 222); --muted: oklch(0.47 0.02 215); --line: oklch(0.9 0.01 200);
  --grid: oklch(0.92 0.008 200); --deep: oklch(0.6 0.09 188); --graphic: oklch(0.72 0.1 188);
  --tint: oklch(0.94 0.03 188); --primary: oklch(0.46 0.08 188);
}
* { box-sizing: border-box; margin: 0; }
html, body { width: 1200px; height: 630px; overflow: hidden; background: #fff; }
body { font-family: "Funnel Sans", sans-serif; color: var(--ink); position: relative; }
.lockup { position: absolute; left: 72px; top: 60px; display: flex; align-items: center; gap: 14px;
  font: 600 30px/1 "Funnel Display", sans-serif; letter-spacing: -0.01em; }
h1 { position: absolute; left: 72px; top: 168px; width: 610px; font: 700 70px/1.06 "Funnel Display", sans-serif; letter-spacing: -0.025em; }
.hl { background: linear-gradient(var(--tint), var(--tint)) no-repeat 0 92% / 100% 0.62em;
  -webkit-box-decoration-break: clone; box-decoration-break: clone; }
.sub { position: absolute; left: 72px; bottom: 64px; width: 600px; font-size: 26px; line-height: 1.4; color: var(--muted); }
.panel { position: absolute; left: 700px; top: 92px; width: 428px; height: 446px; border-radius: 20px;
  border: 1.5px solid var(--line); overflow: hidden;
  background-color: #fff; background-image: radial-gradient(circle, var(--grid) 2px, transparent 2.2px);
  background-size: 28px 28px; background-position: 14px 14px; }
.node { position: absolute; background: #fff; border: 2px solid var(--line); border-radius: 14px;
  display: flex; align-items: center; gap: 10px; padding: 0 14px; font-weight: 600; font-size: 20px; }
.role { left: 24px; width: 176px; height: 52px; color: var(--ink); white-space: nowrap; }
.role svg { color: var(--primary); flex: none; }
.role.fill { background: linear-gradient(90deg, var(--tint) 62%, #fff 62%); }
.me { left: 240px; top: 150px; width: 164px; height: 92px; border-color: var(--deep);
  flex-direction: column; align-items: flex-start; justify-content: center; gap: 4px;
  box-shadow: 0 0 0 5px oklch(0.6 0.09 188 / 0.16); }
.me b { font: 650 19px/1.1 "Funnel Display", sans-serif; white-space: nowrap; }
.me span { font-size: 15px; font-weight: 500; color: var(--muted); }
.out { left: 240px; top: 322px; width: 164px; height: 64px; border-color: var(--graphic); justify-content: space-between; }
.out svg { color: var(--deep); }
svg.edges { position: absolute; inset: 0; }
.port { fill: #fff; stroke: var(--deep); stroke-width: 2; }
`;

// Hand-placed static graph: three roles fan into the operator, which feeds shipped work.
const roles = [
  { y: 58, label: 'Brand', icon: 'pen-nib', fill: false },
  { y: 170, label: 'Web + code', icon: 'browsers', fill: true },
  { y: 282, label: 'Automation', icon: 'flow-arrow', fill: false },
];
const meIn = { x: 240, y: 196 };
const edges = roles
  .map(({ y }) => { const a = { x: 200, y: y + 26 }; return `<path d="M${a.x} ${a.y}C${a.x + 22} ${a.y} ${meIn.x - 22} ${meIn.y} ${meIn.x} ${meIn.y}" fill="none" stroke="var(--deep)" stroke-width="2.5"/><circle class="port" cx="${a.x}" cy="${a.y}" r="5"/>`; })
  .join('');

const card = `<!doctype html><html><head><meta charset="utf-8"><style>${css}</style></head><body>
  <div class="lockup">${mark(44)} Julienna Batten</div>
  <h1>A <span class="hl">whole design team's output</span>, from one person.</h1>
  <p class="sub">I run brand, web, and motion, and I build the automation that lets me ship all three.</p>
  <div class="panel">
    <svg class="edges" width="428" height="446">
      ${edges}
      <path d="M322 242V322" fill="none" stroke="var(--graphic)" stroke-width="2.5"/>
      <circle cx="220" cy="${(170 + 26 + meIn.y) / 2}" r="7" fill="var(--deep)" stroke="#fff" stroke-width="3"/>
      <circle class="port" cx="${meIn.x}" cy="${meIn.y}" r="5"/><circle class="port" cx="322" cy="242" r="5"/><circle class="port" cx="322" cy="322" r="5"/>
    </svg>
    ${roles.map((r) => `<div class="node role${r.fill ? ' fill' : ''}" style="top:${r.y}px">${icon(r.icon, 20)}${r.label}</div>`).join('')}
    <div class="node me"><b>Julienna Batten</b><span>Creative director</span></div>
    <div class="node out">Shipped ${icon('check-bold', 18)}</div>
  </div>
</body></html>`;

const touch = `<!doctype html><html><head><style>html,body{margin:0;width:180px;height:180px;overflow:hidden;background:oklch(0.46 0.08 188)}</style></head>
<body>${mark(180).replace('rx="10"', 'rx="0"')}</body></html>`;

const dir = mkdtempSync(join(tmpdir(), 'jb-og-'));
const shoot = (html, name, w, h) => {
  const file = join(dir, `${name}.html`);
  writeFileSync(file, html);
  execFileSync(chrome, [
    '--headless', '--disable-gpu', '--hide-scrollbars', '--allow-file-access-from-files',
    '--force-device-scale-factor=1', `--window-size=${w},${h}`, '--virtual-time-budget=4000',
    `--user-data-dir=${join(dir, 'profile')}`, `--screenshot=${join(root, 'public', `${name}.png`)}`, pathToFileURL(file).href,
  ], { stdio: 'ignore', timeout: 30_000 });
  console.log(`wrote public/${name}.png`);
};
shoot(card, 'og', 1200, 630);
shoot(touch, 'apple-touch-icon', 180, 180);
