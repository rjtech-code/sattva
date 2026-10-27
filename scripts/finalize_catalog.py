"""Turn the raw extraction output into src/data/catalog.generated.json.

Usage: python3 scripts/finalize_catalog.py <work_dir>
- Keeps official codes/names; drops empty fields.
- Duplicate design+colour pages in the StonIT master card are kept as separate products
  (their photographs differ) with a numbered suffix, and listed in docs/CONTENT_AND_ASSET_MAP.md.
"""
import json, os, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
raw = json.load(open(os.path.join(sys.argv[1], 'products.raw.json')))
seen, out = {}, []
for p in raw:
    key = (p['range'], p['collection'], p['slug'])
    seen[key] = seen.get(key, 0) + 1
    if seen[key] > 1:
        p['slug'] = f"{p['slug']}-{seen[key]}"
        if p.get('name'):
            p['name'] = f"{p['name']} ({seen[key]})"
    for k in ('page', 'collectionName'):
        p.pop(k, None)
    out.append({k: v for k, v in p.items() if v not in (None, '', [], {})})
dest = os.path.join(ROOT, 'src', 'data', 'catalog.generated.json')
with open(dest, 'w') as f:
    json.dump(out, f, indent=1, ensure_ascii=False)
print(len(out), 'products ->', dest)
