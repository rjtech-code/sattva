"""Extract product swatches and application photos from the client's Drive catalogue PDFs
at their ORIGINAL embedded resolution (no re-rendering, no downscaling).

Usage: python3 scripts/extract_catalogue.py <pdf_dir> <work_dir>
Writes WebP images to public/media/<range>/<collection>/ and <work_dir>/products.raw.json
(then run scripts/finalize_catalog.py <work_dir>).

How an image is found: for each target area of a page (a fraction box), the embedded image
placed there is taken straight from the PDF (PyMuPDF), converted to sRGB via its ICC profile,
and oriented by comparing all 8 rotations/flips against a low-res render of the same area.
Full-page images (Natural/Grainy shade cards) are cropped to the swatch at native pixels.
The Bookmatch layout mirrors two halves of one photo; that mirror is rebuilt at native size.
Codes come from the PDF text layer; Natural and Grainy pages are flattened, so their codes
were transcribed from the page labels.

Requires: pymupdf, Pillow, numpy, poppler-utils (pdftotext).
"""
import glob, json, os, re, subprocess, sys
import numpy as np
import pymupdf
from PIL import Image

PDF_DIR, WORK = sys.argv[1], sys.argv[2]
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MEDIA = os.path.join(ROOT, 'public', 'media')
MAX_LONG = 2600       # cap only for very large originals
SMALL_LONG = 640      # grid/thumbnail size
pymupdf.TOOLS.set_icc(True)

NATURAL = ['1000/1', '1000/2', '1000/3', '2000', '3000/1', '3000/2', '3000/3', '3000/4', '4000', '5000/1', '5000/2',
           '6000/1', '6000/2', '7000/1', '7000/2', '7000/3', '8000', '9000/1', '9000/2', '10000', '11000', '13000/1',
           '13000/2', '14000/1', '14000/2', '14000/3', '15000/1', '15000/2', '15000/3', '16000', '17000', '18000/1',
           '18000/2', '19000/1', '19000/2', '19000/3', '20000', '22000', '23000', '24000']
GRAINY = ['31000/1', '31000/2', '32000', '33000/1', '33000/2', '33000/3', '34000', '35000', '36000', '37000', '38000/1',
          '38000/2', '39000/1', '39000/2', '40000', '41000/1', '41000/2', '41000/3', '42000', '43000/1', '43000/2',
          '44000', '45000', '46000/1', '46000/2', '47000', '48000', '49000', '50000', '51000/1', '51000/2', '52000/1',
          '52000/2', '53000', '54000/1', '54000/2', '55000/1', '55000/2', '55000/3', '56000/1', '56000/2', '56000/3',
          '57000', '58000', '59000', '60000', '61000', '62000']


def find_pdf(name):
    """Match 'Stonir - Natural Series.pdf' regardless of spaces/underscores in the downloaded name."""
    key = re.sub(r'[\W_]+', '', name.lower())
    for f in glob.glob(os.path.join(PDF_DIR, '*.pdf')):
        if re.sub(r'[\W_]+', '', os.path.basename(f).lower()) == key:
            return f
    raise FileNotFoundError(name)


def page_text(pdf, p):
    t = subprocess.run(['pdftotext', '-layout', '-f', str(p), '-l', str(p), pdf, '-'], capture_output=True, text=True).stdout
    return ' '.join(t.split())


_docs = {}
def doc(pdf):
    if pdf not in _docs:
        _docs[pdf] = pymupdf.open(pdf)
    return _docs[pdf]


def native(d, xref):
    """Embedded image pixels as an sRGB PIL image (ICC applied, alpha dropped)."""
    pix = pymupdf.Pixmap(d, xref)
    if pix.alpha:
        pix = pymupdf.Pixmap(pix, 0)
    if pix.colorspace is None or pix.colorspace.n != 3:
        pix = pymupdf.Pixmap(pymupdf.csRGB, pix)
    return Image.frombytes('RGB', (pix.width, pix.height), pix.samples)


def preview(pdf, p, box, w=160):
    """Low-res render of a page area — used only to decide orientation, never saved."""
    page = doc(pdf)[p - 1]
    R = page.rect
    clip = pymupdf.Rect(R.x0 + box[0] * R.width, R.y0 + box[1] * R.height, R.x0 + box[2] * R.width, R.y0 + box[3] * R.height)
    zoom = w / clip.width
    pix = page.get_pixmap(matrix=pymupdf.Matrix(zoom, zoom), clip=clip, colorspace=pymupdf.csRGB, alpha=False)
    return Image.frombytes('RGB', (pix.width, pix.height), pix.samples)


TRANSFORMS = [None, Image.ROTATE_90, Image.ROTATE_180, Image.ROTATE_270, Image.FLIP_LEFT_RIGHT, Image.FLIP_TOP_BOTTOM,
              Image.TRANSPOSE, Image.TRANSVERSE]


def orient(img, ref, vis=(0, 0, 1, 1)):
    """Rotation/flip of `img` that best matches the rendered `ref`. `vis` is the visible part
    of the placed image (fractions), for images that run past the page edge."""
    best, best_err = img, 1e9
    ref_a = np.asarray(ref.convert('L'), np.float32)
    for t in TRANSFORMS:
        cand = img if t is None else img.transpose(t)
        part = cand.crop((round(vis[0] * cand.width), round(vis[1] * cand.height), round(vis[2] * cand.width), round(vis[3] * cand.height)))
        if abs(np.log((part.width / part.height) / (ref.width / ref.height))) > 0.12:
            continue
        c = np.asarray(part.convert('L').resize(ref.size, Image.BILINEAR), np.float32)
        err = float(np.abs(c - ref_a).mean())
        if err < best_err:
            best, best_err = cand, err
    return best, best_err


def placed(pdf, p, box):
    """Embedded images covering at least 60% of `box` on page p, as (info, coverage)."""
    page = doc(pdf)[p - 1]
    W, H = page.rect.width, page.rect.height
    rx0, ry0, rx1, ry1 = box[0] * W, box[1] * H, box[2] * W, box[3] * H
    area = (rx1 - rx0) * (ry1 - ry0)
    cands = []
    for info in page.get_image_info(xrefs=True):
        if min(info['width'], info['height']) < 200:
            continue
        x0, y0, x1, y1 = info['bbox']
        ov = max(0, min(x1, rx1) - max(x0, rx0)) * max(0, min(y1, ry1) - max(y0, ry0))
        if ov / area >= 0.6:
            cands.append((info, ov / area))
    return cands


def render_area(pdf, p, box, dpi=200):
    """Direct render of a page area, for layouts the PDF composes from several pieces."""
    img = preview(pdf, p, box, w=round((box[2] - box[0]) * doc(pdf)[p - 1].rect.width * dpi / 72))
    return img, 0.0


def extract(pdf, p, box, whole=True):
    """Native image for the page area `box`. whole=True keeps the full placed image (clipped to
    the page); otherwise crops it to `box` (used for full-page shade-card images)."""
    d = doc(pdf)
    page = d[p - 1]
    W, H = page.rect.width, page.rect.height
    cands = placed(pdf, p, box)
    if not cands:
        raise RuntimeError(f'no embedded image covers {box} on p.{p} of {os.path.basename(pdf)}')
    # Several images can sit under one area (hidden backgrounds, underlays). Keep the one that
    # actually looks like the rendered page there.
    best = None
    for info, _ in cands:
        x0, y0, x1, y1 = info['bbox']
        vis = (max(x0, 0), max(y0, 0), min(x1, W), min(y1, H))
        vis_frac = ((vis[0] - x0) / (x1 - x0), (vis[1] - y0) / (y1 - y0), (vis[2] - x0) / (x1 - x0), (vis[3] - y0) / (y1 - y0))
        img, err = orient(native(d, info['xref']), preview(pdf, p, (vis[0] / W, vis[1] / H, vis[2] / W, vis[3] / H)), vis_frac)
        if best is None or err < best[0]:
            best = (err, img, info, vis)
    err, img, info, vis = best
    if err > 60:  # area is composed from several images (overlays) — render what the PDF shows
        return render_area(pdf, p, box)
    x0, y0, x1, y1 = info['bbox']
    # Crop to the visible part of the image, then (optionally) to the target box — in native pixels.
    cx0, cy0, cx1, cy1 = vis if whole else (max(vis[0], box[0] * W), max(vis[1], box[1] * H), min(vis[2], box[2] * W), min(vis[3], box[3] * H))
    fx = lambda x: round((x - x0) / (x1 - x0) * img.width)
    fy = lambda y: round((y - y0) / (y1 - y0) * img.height)
    out = img.crop((fx(cx0), fy(cy0), fx(cx1), fy(cy1)))
    return out, err


def bookmatch(pdf, p):
    """Bookmatch sheets are composed in the PDF from mirrored halves of one photo (plus hidden
    underlays), so the visible result is rendered at the photo's native density (~200 dpi)."""
    return render_area(pdf, p, (0.19, 0.045, 0.70, 0.865))


def save(img, rel, rotatable=False, alt=None):
    path = os.path.join(MEDIA, rel)
    os.makedirs(os.path.dirname(path), exist_ok=True)
    sizes = []
    for long, suffix, q in ((MAX_LONG, '', 90), (SMALL_LONG, '-sm', 84)):
        k = min(1, long / max(img.size))
        r = img if k == 1 else img.resize((round(img.width * k), round(img.height * k)), Image.LANCZOS)
        r.save(f'{path}{suffix}.webp', quality=q, method=6)
        sizes.append(r.size)
    rec = {'src': f'/media/{rel}.webp', 'srcSmall': f'/media/{rel}-sm.webp', 'width': sizes[0][0], 'height': sizes[0][1], 'smallWidth': sizes[1][0]}
    if alt: rec['alt'] = alt
    if rotatable: rec['rotatable'] = True  # stone sheet — may be turned 90° to fill a landscape slot
    return rec


def slug(s):
    return re.sub(r'[^a-z0-9]+', '-', s.lower()).strip('-')


def ssv(code):
    return 'SSV ' + re.sub(r'^SSV\s*', '', code.strip())


products, log = [], []


def add(range_, coll, code, name, images, specs, source, page, extra=None):
    p = {'range': range_, 'collection': coll, 'slug': slug(code if code else name), 'code': code, 'name': name,
         'images': images, 'specs': specs, 'source': f'{source} p.{page}'}
    if extra:
        p.update(extra)
    products.append(p)


def note(rel, img, err):
    log.append(f'{rel:70s} {img.width}x{img.height}  match {err:5.1f}')


STONIR_SPECS = {'Thickness': '2 mm · 4 mm', 'Size': "4' × 8' · 4' × 10'"}

# Natural & Grainy: full-page image, swatch cropped at native pixels.
for f, coll, codes in (('Stonir - Natural Series.pdf', 'natural-series', NATURAL), ('Stonir - Grainy Series.pdf', 'grainy-series', GRAINY)):
    pdf = find_pdf(f)
    for i, c in enumerate(codes):
        p, code = i + 2, ssv(c)
        img, err = extract(pdf, p, (0.215, 0.065, 0.652, 0.845), whole=False)
        rel = f'stonir/{coll}/{slug(code)}'
        note(rel, img, err)
        add('stonir', coll, code, None, [save(img, rel, rotatable=True)], STONIR_SPECS, f, p)

# Bookmatch: mirrored halves rebuilt at native size.
f = 'Stonir - Bookmatch Series.pdf'
pdf = find_pdf(f)
for p in range(2, len(doc(pdf)) + 1):
    m = re.search(r'BOOKMATCH\s+(\d\d)', page_text(pdf, p))
    if not m:
        continue
    code = f'Bookmatch {m.group(1)}'
    img, err = bookmatch(pdf, p)
    rel = f'stonir/bookmatch-series/{slug(code)}'
    note(rel, img, err)
    add('stonir', 'bookmatch-series', code, None, [save(img, rel, rotatable=True)], STONIR_SPECS, f, p)

# 10x4: one rotated sheet photo per page.
f = 'Stonir - 10x4 Veneer Series.pdf'
pdf = find_pdf(f)
for p in range(2, len(doc(pdf)) + 1):
    m = re.search(r'(Natural|Grainy)\s+Series\s+(SSV\s?[\d/]+)', page_text(pdf, p))
    if not m:
        continue
    code = ssv(m.group(2))
    img, err = extract(pdf, p, (0.265, 0.03, 0.67, 0.865), whole=False)
    rel = f'stonir/10x4-massive-veneer/{slug(code)}'
    note(rel, img, err)
    add('stonir', '10x4-massive-veneer', code, None, [save(img, rel, rotatable=True)], {'Stone': f'{m.group(1)} series', **STONIR_SPECS}, f, p)

# Translucent: natural-light view + backlit view, each its own rotated photo.
f = 'Stonir - Translucent Series.pdf'
pdf = find_pdf(f)
for p in range(2, len(doc(pdf)) + 1):
    m = re.search(r'SLATE\s+(SSV\s?[\d/]+)', page_text(pdf, p))
    if not m:
        continue
    code = ssv(m.group(1))
    a, ea = extract(pdf, p, (0.092, 0.33, 0.492, 0.79))
    b, eb = extract(pdf, p, (0.538, 0.33, 0.94, 0.79))
    ra, rb = f'stonir/translucent-series/{slug(code)}', f'stonir/translucent-series/{slug(code)}-backlit'
    note(ra, a, ea); note(rb, b, eb)
    add('stonir', 'translucent-series', code, None, [save(a, ra, True, 'natural light'), save(b, rb, True, 'backlit')],
        {'Stone': 'Slate', **STONIR_SPECS}, f, p, {'backlit': True})

# StonIT: panel swatch + application photo, design + colour from text.
f = 'STONIT - MASTER SHADE CARD.pdf'
pdf = find_pdf(f)
DESIGNS = ['MODULAR CUBE', 'HAVELI ARCH', 'AQUA INSET', 'ISOMETRIC FLOW', 'ZURIC LEAF', 'QUADRA HERITAGE', 'FACET PAVILION',
           'VERSAILLES BLOOM', 'FLORA RELIEF', 'MAPLE ARCH', 'PETAL PORCELAIN', 'RUBIK ROUND', 'ALPINE PEAK',
           'PURE OBSIDIAN', 'FLINT ROCK', 'VERTICAL VISTA']
for p in range(2, len(doc(pdf)) + 1):
    t = page_text(pdf, p)
    d = next((d for d in DESIGNS if d in t), None)
    if not d:
        continue
    colour, design = t.split(d, 1)[1].strip().title(), d.title()
    key = slug(f'{design} {colour}')
    sw, es = extract(pdf, p, (0.712, 0.05, 0.985, 0.84), whole=False)
    app, ea = extract(pdf, p, (0.035, 0.05, 0.70, 0.80))
    rs, ra = f'stonit/{slug(design)}/{key}-p{p}', f'stonit/{slug(design)}/{key}-p{p}-application'
    note(rs, sw, es); note(ra, app, ea)
    add('stonit', slug(design), None, f'{design} {colour}', [save(sw, rs, True, 'panel'), save(app, ra, alt='application')],
        {'Design': design, 'Colour': colour}, f, p, {'slug': key, 'collectionName': design, 'page': p})

# Art-i: design page (even) followed by its application page.
f = 'ART-i Canvas Veneer.pdf'
pdf = find_pdf(f)
for p in range(4, len(doc(pdf)) + 1, 2):
    m = re.search(r'(ACV-\d\d)', page_text(pdf, p))
    if not m:
        continue
    code = m.group(1)
    sw, es = extract(pdf, p, (0.06, 0.05, 0.55, 0.74))
    app, ea = extract(pdf, p + 1, (0.0, 0.0, 1.0, 0.80))
    rs, ra = f'art-i/canvas-series/{slug(code)}', f'art-i/canvas-series/{slug(code)}-application'
    note(rs, sw, es); note(ra, app, ea)
    add('art-i-canvas-veneer', 'canvas-series', code, None, [save(sw, rs, alt='design'), save(app, ra, alt='application')],
        {'Series': 'Canvas Series', 'Size': "4' × 8'"}, f, p)

os.makedirs(WORK, exist_ok=True)
json.dump(products, open(os.path.join(WORK, 'products.raw.json'), 'w'), indent=1)
open(os.path.join(WORK, 'extract.log'), 'w').write('\n'.join(log) + '\n')
print(len(products), 'products;', len(log), 'images')
