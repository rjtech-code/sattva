"""Derive light-theme counterparts of the generated atmosphere textures.
Usage: python3 scripts/gen_light_textures.py public/textures
For each <name>.webp / <name>-960.webp writes <name>-light.webp / <name>-light-960.webp:
luminance is inverted onto a soft off-white, and crimson veins stay crimson.
"""
import glob, os, sys
import numpy as np
from PIL import Image

d = sys.argv[1]
CRIMSON = np.array([200, 16, 46], np.float32)
for f in sorted(glob.glob(os.path.join(d, '*.webp'))):
    if '-light' in f:
        continue
    a = np.asarray(Image.open(f).convert('RGB'), np.float32)
    r, g, b = a[..., 0], a[..., 1], a[..., 2]
    gray = 0.3 * r + 0.59 * g + 0.11 * b
    red = np.clip((r - (g + b) / 2) / 110, 0, 1)[..., None]
    light = np.clip(246 - gray * 0.62, 150, 246)[..., None].repeat(3, -1)
    light[..., 2] += 1  # hair cooler, never cream
    out = light * (1 - red) + CRIMSON * red
    base, ext = os.path.splitext(f)
    name = base[:-4] + '-light-960' if base.endswith('-960') else base + '-light'
    Image.fromarray(np.clip(out, 0, 255).astype(np.uint8)).save(name + ext, quality=80, method=6)
    print(os.path.basename(name + ext))
