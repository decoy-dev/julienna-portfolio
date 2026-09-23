/**
 * Runtime spacing audit. Paste into the devtools console (or evaluate via Puppeteer) on any page.
 * Lists every rendered margin, padding, and gap that breaks the 8px rule (DESIGN.md -> Layout):
 * allowed values are 1, 2, 4, and multiples of 8. Auto margins are read as `auto` through the CSS
 * Typed OM and ignored. Known, accepted exceptions: native <option> gaps (browser UA styles) and the
 * mark clear-space specimen on /brand (drawn to the mark's own proportion).
 * Returns an array of "section > element.classes property=value xN" strings.
 */
(() => {
  const props = ['margin-top', 'margin-bottom', 'margin-left', 'margin-right', 'padding-top', 'padding-bottom', 'padding-left', 'padding-right', 'row-gap', 'column-gap'];
  const ok = (n) => [1, 2, 4].includes(Math.abs(n)) || Math.abs(n) % 8 === 0;
  const off = new Map();
  const label = (el) => {
    const sec = el.closest('section[id], section[aria-labelledby], footer, nav, header, main');
    const where = sec ? sec.id || sec.getAttribute('aria-labelledby') || sec.tagName.toLowerCase() : 'body';
    const raw = typeof el.className === 'string' ? el.className : el.className.baseVal || '';
    const cls = raw.split(/\s+/).filter(Boolean).slice(0, 4).join('.');
    return `${where} > ${el.tagName.toLowerCase()}${cls ? '.' + cls : ''}`;
  };
  for (const el of document.querySelectorAll('body *')) {
    if (el.closest('svg') || el.closest('.sr-only')) continue;
    if (getComputedStyle(el).display === 'none') continue;
    const map = el.computedStyleMap();
    for (const p of props) {
      const v = map.get(p);
      if (!v || v instanceof CSSKeywordValue) continue;
      let n;
      try {
        n = v.to('px').value;
      } catch {
        n = parseFloat(getComputedStyle(el).getPropertyValue(p));
      }
      if (!n || Math.abs(n) < 0.01) continue;
      const r = Math.round(n * 100) / 100;
      if (!ok(r)) {
        const k = `${label(el)} ${p}=${r}`;
        off.set(k, (off.get(k) || 0) + 1);
      }
    }
  }
  return [...off.entries()].map(([k, c]) => (c > 1 ? `${k} x${c}` : k));
})();
