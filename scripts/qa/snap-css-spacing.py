"""Snap margin/padding/gap declarations in <style> blocks and .css files to the 8px rule.
Dry run by default (prints each change); pass --apply to write. Ties go to the multiple of 16,
else the larger value. Fluid clamp(... vw/vh) spacing must still be replaced by hand with breakpoint steps."""
import re, sys, pathlib
APPLY = '--apply' in sys.argv
SKIP = set(a for a in sys.argv[1:] if not a.startswith('--'))  # paths to leave alone
ALLOWED = {0, 1, 2, 4} | {8*k for k in range(1, 40)}
def snap(px):
    a = abs(px)
    if a in ALLOWED: return px
    cands = sorted(ALLOWED, key=lambda v: (abs(v - a), -(v % 16 == 0), v))
    # tie -> the candidate that is a multiple of 16
    best = cands[0]
    ties = [c for c in cands if abs(c - a) == abs(best - a)]
    m16 = [c for c in ties if c % 16 == 0]
    best = m16[0] if m16 else max(ties)
    return best if px >= 0 else -best
decl = re.compile(r'(?P<prop>(?<![\w-])(?:margin|padding|gap|row-gap|column-gap|margin-(?:top|bottom|left|right|inline|block)(?:-(?:start|end))?|padding-(?:top|bottom|left|right|inline|block)(?:-(?:start|end))?|scroll-padding(?:-[a-z-]+)?))\s*:\s*(?P<val>[^;{}]+);')
num = re.compile(r'(?<![\w.#-])(-?\d*\.?\d+)(rem|px)\b')
files = [p for p in pathlib.Path('src').rglob('*') if p.suffix in ('.astro', '.css') and str(p) not in SKIP]
for p in files:
    s = p.read_text()
    out = []; changed = False
    def fix(m):
        global changed
        val = m.group('val')
        if 'var(' in val and not num.search(val): return m.group(0)
        def rep(n):
            v = float(n.group(1)); unit = n.group(2)
            px = v * 16 if unit == 'rem' else v
            if abs(px - round(px)) > 1e-6 and unit == 'px': return n.group(0)
            px = round(px, 3)
            s2 = snap(px)
            if s2 == px: return n.group(0)
            new = f"{s2/16:g}rem" if unit == 'rem' else f"{s2:g}px"
            print(f"{p}: {m.group('prop')}: {val.strip()}  [{n.group(0)} -> {new}]")
            return new
        newval = num.sub(rep, val)
        return m.group(0).replace(val, newval)
    ns = decl.sub(fix, s)
    if ns != s and APPLY: p.write_text(ns)
