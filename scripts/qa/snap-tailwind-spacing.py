"""Snap Tailwind spacing utilities (m/p/gap/space) in src/**/*.astro to the 8px rule (DESIGN.md -> Layout).
Dry run by default; pass --apply to write. Extra args are paths to skip.
Mapping: 1.5,2.5 -> 2; 3,3.5,5 -> 4; 7,9 -> 8; 11,13 -> 12; 15 -> 16 (ties go to the multiple of 16)."""
import re, sys, pathlib, collections
APPLY = '--apply' in sys.argv
SKIP = set(a for a in sys.argv[1:] if not a.startswith('--'))  # paths to leave alone
MAP = {'1.5':'2','2.5':'2','3':'4','3.5':'4','5':'4','7':'8','9':'8','11':'12','13':'12','15':'16'}
cls = re.compile(r'(?<![\w\-\[])(-?(?:m[trblxyse]?|p[trblxyse]?|gap(?:-[xy])?|space-[xy]))-(1\.5|2\.5|3\.5|11|13|15|3|5|7|9)(?![\w.\d\]])')
counts = collections.Counter()
for p in sorted(pathlib.Path('src').rglob('*.astro')):
    rel = str(p)
    if rel in SKIP: continue
    s = p.read_text()
    def sub(m):
        counts[f'{m.group(1)}-{m.group(2)} -> {m.group(1)}-{MAP[m.group(2)]}'] += 1
        return f'{m.group(1)}-{MAP[m.group(2)]}'
    n = cls.sub(sub, s)
    if n != s:
        print(rel, sum(1 for _ in cls.finditer(s)))
        if APPLY: p.write_text(n)
print(sum(counts.values()), 'replacements'); print(dict(counts.most_common()))
