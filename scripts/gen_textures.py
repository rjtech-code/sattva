"""Generate abstract, clearly-illustrative stone textures for the site's atmosphere.
These are NOT product photographs. Usage: python3 scripts/gen_textures.py public/textures"""
import sys, os
import numpy as np
from PIL import Image, ImageFilter

out = sys.argv[1]
os.makedirs(out, exist_ok=True)
W, H = 1920, 1200


def noise(w, h, octaves=6, base=4, persistence=0.55, seed=0):
    r = np.random.default_rng(seed)
    acc = np.zeros((h, w), np.float32)
    amp, tot = 1.0, 0.0
    for o in range(octaves):
        gw, gh = base * 2 ** o + 1, int(base * 2 ** o * h / w) + 2
        g = r.random((gh, gw)).astype(np.float32)
        img = Image.fromarray((g * 255).astype(np.uint8)).resize((w, h), Image.BICUBIC)
        acc += amp * (np.asarray(img, np.float32) / 255)
        tot += amp
        amp *= persistence
    return acc / tot


def norm(a):
    a = a - a.min()
    return a / (a.max() + 1e-6)


def save(name, rgb):
    rgb = np.clip(rgb, 0, 255).astype(np.uint8)
    im = Image.fromarray(rgb, 'RGB')
    im.save(os.path.join(out, f'{name}.webp'), quality=78, method=6)
    im.resize((W // 2, H // 2), Image.LANCZOS).save(os.path.join(out, f'{name}-960.webp'), quality=76, method=6)


yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
nx, ny = xx / W, yy / H


def vein_field(seed, freq=6.0, turb=5.0, angle=0.6, sharp=40.0):
    t = noise(W, H, 4, 2, 0.45, seed)
    d = nx * np.cos(angle) * freq + ny * np.sin(angle) * freq * 1.6 + t * turb
    v = np.abs(np.sin(d * np.pi))
    return np.exp(-v * sharp)  # thin bright lines


def grain(seed, amt=6):
    return (np.random.default_rng(seed).random((H, W)).astype(np.float32) - 0.5) * amt


# 1. Dark marble, white/grey veins
base = noise(W, H, 6, 3, 0.6, 1) * 28 + 6
v1 = vein_field(11, 5, 6, 0.7, 60) * 170
v2 = vein_field(12, 9, 4, 0.4, 25) * 45
soft = np.asarray(Image.fromarray(np.clip(v1, 0, 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(10)), np.float32)
lum = base + v1 * 0.8 + v2 + soft * 0.6 + noise(W, H, 4, 2, 0.5, 13) * 26 + grain(1)
save('marble-dark', np.stack([lum, lum, lum * 1.02], -1))

# 2. Black marble with crimson veins
base = noise(W, H, 6, 3, 0.6, 2) * 22 + 4
red = vein_field(21, 4, 7, 0.9, 45)
wht = vein_field(22, 7, 5, 0.5, 70) * 70
glow = np.asarray(Image.fromarray((red * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(14)), np.float32) / 255
r = base + wht + red * 200 + glow * 90 + grain(2)
g = base + wht + red * 18 + glow * 6 + grain(3)
b = base + wht + red * 26 + glow * 10 + grain(4)
save('marble-crimson', np.stack([r, g, b], -1))

# 3. Layered stone strata, lit from the side
n = noise(W, H, 7, 2, 0.6, 3)
strata = np.sin((ny * 22 + n * 9) * np.pi) * 0.5 + 0.5
fine = noise(W, H, 8, 16, 0.5, 31)
shade = np.clip(1.15 - nx * 0.9, 0.15, 1)
lum = (strata * 0.55 + fine * 0.45) * 120 * shade + 10 + grain(5, 10)
save('stonir-strata', np.stack([lum * 1.06, lum * 0.98, lum * 0.92], -1))

# 4. Flowing sculptural folds with crimson rim light
n = noise(W, H, 5, 2, 0.5, 4)
d = nx * 7 + np.sin(ny * 5 + n * 4) * 1.4 + n * 3
fold = np.sin(d * np.pi)
light = np.clip(fold, 0, 1) ** 3
rim = np.exp(-np.abs(fold - 0.97) * 90)
lum = 6 + light * 70 + noise(W, H, 8, 20, 0.5, 41) * 18
save('stonit-flow', np.stack([lum + rim * 110, lum * 0.95 + rim * 10, lum * 0.97 + rim * 16], -1))

# 5. Canvas weave with gestural strokes
weave = (np.sin(xx * 0.9) * np.sin(yy * 0.9)) * 6
band = np.exp(-((norm(noise(W, H, 5, 3, 0.7, 5)) - 0.55) ** 2) * 160)
band2 = np.exp(-((norm(noise(W, H, 4, 2, 0.7, 51)) - 0.4) ** 2) * 300)
lum = 12 + weave + band * 70 + noise(W, H, 8, 30, 0.5, 52) * 14
save('arti-canvas', np.stack([lum + band2 * 95, lum + band2 * 12, lum + band2 * 18], -1))

# 6. Charcoal grain
lum = 10 + noise(W, H, 7, 4, 0.55, 6) * 16 + grain(6, 5)
save('charcoal', np.stack([lum, lum, lum], -1))

# 7. Ridge horizon
ridge = 0.55 + (noise(W, 1, 7, 3, 0.55, 7)[0] - 0.5) * 0.5
mask = ny > ridge[None, :]
sky = 12 + (1 - ny) * 26 + noise(W, H, 5, 3, 0.5, 71) * 18
rock = 8 + noise(W, H, 8, 8, 0.6, 72) * 40 * np.exp(-(ny - ridge[None, :]) * 4)
lum = np.where(mask, rock, sky) + grain(7, 6)
save('ridge', np.stack([lum, lum, lum * 1.03], -1))
print('ok')
