"""Side-by-side before/after images from two scripts/screenshots.mjs runs.

Usage: python3 scripts/compare_screenshots.py screenshots/before screenshots/after screenshots/compare
Writes <out>/<theme>-<viewport>-<page>.jpg showing the first screens of each page, before | after.
Pages that exist in only one run (e.g. a removed page) are still written, with a placeholder.
"""
import os, sys
from PIL import Image, ImageDraw

before, after, out = sys.argv[1:4]
TOP = {'desktop': (900, 1800), 'mobile': (390, 2400)}  # (scaled width, max height) per viewport


def load(path, w, h):
    if not os.path.exists(path):
        return None
    im = Image.open(path).convert('RGB')
    k = w / im.width
    im = im.resize((w, int(im.height * k)))
    return im.crop((0, 0, w, min(h, im.height)))


count = 0
for theme in ('dark', 'light'):
    for vp, (w, h) in TOP.items():
        names = set()
        for root in (before, after):
            d = os.path.join(root, theme, vp)
            if os.path.isdir(d):
                names |= {f for f in os.listdir(d) if f.endswith('.png')}
        for name in sorted(names):
            a = load(os.path.join(before, theme, vp, name), w, h)
            b = load(os.path.join(after, theme, vp, name), w, h)
            ht = max(x.height for x in (a, b) if x)
            sheet = Image.new('RGB', (w * 2 + 24, ht + 40), (40, 40, 44))
            dr = ImageDraw.Draw(sheet)
            for i, (label, im) in enumerate((('BEFORE', a), ('AFTER', b))):
                x = i * (w + 24)
                dr.text((x + 8, 12), label, fill=(255, 255, 255))
                if im:
                    sheet.paste(im, (x, 40))
                else:
                    dr.text((x + 8, 60), '(page not present)', fill=(200, 200, 200))
            os.makedirs(out, exist_ok=True)
            sheet.save(os.path.join(out, f'{theme}-{vp}-{name[:-4]}.jpg'), quality=82)
            count += 1
print(count, 'comparisons ->', out)
