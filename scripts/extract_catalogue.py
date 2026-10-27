"""Extract product swatches and application photos from the client's Drive catalogue PDFs.

Usage: python3 scripts/extract_catalogue.py <pdf_dir> <work_dir>
Writes WebP images to public/media/<range>/<collection>/ and src/data/catalog.generated.json.

Crop boxes are fractions of the rendered page (x0, y0, x1, y1), calibrated per catalogue
layout. Codes come from the PDF text layer where present; the Natural and Grainy
catalogues are flattened images, so their codes were transcribed from the page labels.
"""
import json, os, re, subprocess, sys
from PIL import Image

PDF_DIR, WORK = sys.argv[1], sys.argv[2]
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MEDIA = os.path.join(ROOT, 'public', 'media')
DRIVE = 'https://drive.google.com/file/d/{}/view'

NATURAL = ['1000/1', '1000/2', '1000/3', '2000', '3000/1', '3000/2', '3000/3', '3000/4', '4000', '5000/1', '5000/2',
           '6000/1', '6000/2', '7000/1', '7000/2', '7000/3', '8000', '9000/1', '9000/2', '10000', '11000', '13000/1',
           '13000/2', '14000/1', '14000/2', '14000/3', '15000/1', '15000/2', '15000/3', '16000', '17000', '18000/1',
           '18000/2', '19000/1', '19000/2', '19000/3', '20000', '22000', '23000', '24000']
GRAINY = ['31000/1', '31000/2', '32000', '33000/1', '33000/2', '33000/3', '34000', '35000', '36000', '37000', '38000/1',
          '38000/2', '39000/1', '39000/2', '40000', '41000/1', '41000/2', '41000/3', '42000', '43000/1', '43000/2',
          '44000', '45000', '46000/1', '46000/2', '47000', '48000', '49000', '50000', '51000/1', '51000/2', '52000/1',
          '52000/2', '53000', '54000/1', '54000/2', '55000/1', '55000/2', '55000/3', '56000/1', '56000/2', '56000/3',
          '57000', '58000', '59000', '60000', '61000', '62000']


def page_text(pdf, p):
    t = subprocess.run(['pdftotext', '-layout', '-f', str(p), '-l', str(p), pdf, '-'], capture_output=True, text=True).stdout
    return ' '.join(t.split())


def n_pages(pdf):
    out = subprocess.run(['pdfinfo', pdf], capture_output=True, text=True).stdout
    return int(re.search(r'Pages:\s+(\d+)', out).group(1))


def render(pdf, p, dpi):
    base = os.path.join(WORK, 'render', re.sub(r'\W+', '_', os.path.basename(pdf)) + f'_{p}_{dpi}')
    if not os.path.exists(base + '.png'):
        os.makedirs(os.path.dirname(base), exist_ok=True)
        subprocess.run(['pdftoppm', '-r', str(dpi), '-f', str(p), '-l', str(p), '-singlefile', '-png', pdf, base], check=True)
    return Image.open(base + '.png').convert('RGB')


def save(im, box, rel, long=1100, small=480):
    w, h = im.size
    c = im.crop((int(box[0] * w), int(box[1] * h), int(box[2] * w), int(box[3] * h)))
    path = os.path.join(MEDIA, rel)
    os.makedirs(os.path.dirname(path), exist_ok=True)
    out = []
    for size, suffix in ((long, ''), (small, '-sm')):
        k = min(1, size / max(c.size))
        r = c.resize((round(c.width * k), round(c.height * k)), Image.LANCZOS)
        r.save(f'{path}{suffix}.webp', quality=80, method=6)
        out.append(r.size)
    return {'src': f'/media/{rel}.webp', 'srcSmall': f'/media/{rel}-sm.webp', 'width': out[0][0], 'height': out[0][1]}


def slug(s):
    return re.sub(r'[^a-z0-9]+', '-', s.lower()).strip('-')


def ssv(code):
    return 'SSV ' + re.sub(r'^SSV\s*', '', code.strip())


products, collections = [], {}


def add(range_, coll, code, name, images, specs, source, page, extra=None):
    p = {'range': range_, 'collection': coll, 'slug': slug(code if code else name), 'code': code, 'name': name,
         'images': images, 'specs': specs, 'source': f'{source} p.{page}'}
    if extra: p.update(extra)
    products.append(p)


STONIR_SPECS = {'Thickness': '2 mm · 4 mm', 'Size': "4' × 8' · 4' × 10'"}

jobs = [
    # file, collection, dpi, box
    ('Stonir - Natural Series.pdf', 'natural-series', 170, (0.215, 0.065, 0.652, 0.845)),
    ('Stonir - Grainy Series.pdf', 'grainy-series', 170, (0.215, 0.065, 0.652, 0.845)),
]
for f, coll, dpi, box in jobs:
    pdf = os.path.join(PDF_DIR, f)
    codes = NATURAL if coll == 'natural-series' else GRAINY
    for i, c in enumerate(codes):
        p = i + 2
        code = ssv(c)
        img = save(render(pdf, p, dpi), box, f'stonir/{coll}/{slug(code)}')
        add('stonir', coll, code, None, [img], STONIR_SPECS, f, p)

# Bookmatch
pdf = os.path.join(PDF_DIR, 'Stonir - Bookmatch Series.pdf')
for p in range(2, n_pages(pdf) + 1):
    m = re.search(r'BOOKMATCH\s+(\d\d)', page_text(pdf, p))
    if not m: continue
    code = f'Bookmatch {m.group(1)}'
    img = save(render(pdf, p, 110), (0.19, 0.045, 0.70, 0.865), f'stonir/bookmatch-series/{slug(code)}')
    add('stonir', 'bookmatch-series', code, None, [img], STONIR_SPECS, 'Stonir - Bookmatch Series.pdf', p)

# 10x4
pdf = os.path.join(PDF_DIR, 'Stonir - 10x4 Veneer Series.pdf')
for p in range(2, n_pages(pdf) + 1):
    m = re.search(r'(Natural|Grainy)\s+Series\s+(SSV\s?[\d/]+)', page_text(pdf, p))
    if not m: continue
    code = ssv(m.group(2))
    img = save(render(pdf, p, 110), (0.265, 0.03, 0.67, 0.865), f'stonir/10x4-massive-veneer/{slug(code)}')
    add('stonir', '10x4-massive-veneer', code, None, [img], {'Stone': f'{m.group(1)} series', **STONIR_SPECS},
        'Stonir - 10x4 Veneer Series.pdf', p)

# Translucent: natural-light view + backlit view
pdf = os.path.join(PDF_DIR, 'Stonir - Translucent Series.pdf')
for p in range(2, n_pages(pdf) + 1):
    m = re.search(r'SLATE\s+(SSV\s?[\d/]+)', page_text(pdf, p))
    if not m: continue
    code = ssv(m.group(1))
    im = render(pdf, p, 110)
    a = save(im, (0.092, 0.33, 0.492, 0.79), f'stonir/translucent-series/{slug(code)}')
    b = save(im, (0.538, 0.33, 0.94, 0.79), f'stonir/translucent-series/{slug(code)}-backlit')
    a['alt'] = 'natural light'; b['alt'] = 'backlit'
    add('stonir', 'translucent-series', code, None, [a, b], {'Stone': 'Slate', **STONIR_SPECS},
        'Stonir - Translucent Series.pdf', p, {'backlit': True})

# STONIT: application photo + swatch, design + colour from text
pdf = os.path.join(PDF_DIR, 'STONIT - MASTER SHADE CARD.pdf')
DESIGNS = ['MODULAR CUBE', 'HAVELI ARCH', 'AQUA INSET', 'ISOMETRIC FLOW', 'ZURIC LEAF', 'QUADRA HERITAGE', 'FACET PAVILION',
           'VERSAILLES BLOOM', 'FLORA RELIEF', 'MAPLE ARCH', 'PETAL PORCELAIN', 'RUBIK ROUND', 'ALPINE PEAK',
           'PURE OBSIDIAN', 'FLINT ROCK', 'VERTICAL VISTA']
for p in range(2, n_pages(pdf) + 1):
    t = page_text(pdf, p)
    d = next((d for d in DESIGNS if d in t), None)
    if not d: continue
    colour = t.split(d, 1)[1].strip().title()
    design = d.title()
    im = render(pdf, p, 110)
    key = slug(f'{design} {colour}')
    sw = save(im, (0.712, 0.05, 0.985, 0.84), f'stonit/{slug(design)}/{key}-p{p}')
    app = save(im, (0.035, 0.05, 0.70, 0.80), f'stonit/{slug(design)}/{key}-p{p}-application', long=1400, small=640)
    sw['alt'] = 'panel'; app['alt'] = 'application'
    add('stonit', slug(design), None, f'{design} {colour}', [sw, app], {'Design': design, 'Colour': colour},
        'STONIT - MASTER SHADE CARD.pdf', p, {'slug': f'{key}', 'collectionName': design, 'page': p})

# Art-i: swatch page (even) followed by its application page
pdf = os.path.join(PDF_DIR, 'ART-i Canvas Veneer.pdf')
for p in range(4, n_pages(pdf) + 1, 2):
    m = re.search(r'(ACV-\d\d)', page_text(pdf, p))
    if not m: continue
    code = m.group(1)
    sw = save(render(pdf, p, 60), (0.035, 0.025, 0.50, 0.74), f'art-i/canvas-series/{slug(code)}')
    app = save(render(pdf, p + 1, 60), (0.0, 0.0, 1.0, 0.80), f'art-i/canvas-series/{slug(code)}-application', long=1400, small=640)
    sw['alt'] = 'design'; app['alt'] = 'application'
    add('art-i-canvas-veneer', 'canvas-series', code, None, [sw, app], {'Series': 'Canvas Series', 'Size': "4' × 8'"},
        'ART-i Canvas Veneer.pdf', p)

json.dump(products, open(os.path.join(WORK, 'products.raw.json'), 'w'), indent=1)
print(len(products), 'products')
from collections import Counter
print(Counter((p['range'], p['collection']) for p in products))
