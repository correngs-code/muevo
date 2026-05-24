#!/usr/bin/env python3
"""Generate Muevo PWA icons from the SVG M-mountain logo."""
from PIL import Image, ImageDraw
import os

OUT = "/home/claude/repo/public"
os.makedirs(OUT, exist_ok=True)


def lerp(a, b, t):
    return tuple(int(a[i] + (b[i] - a[i]) * t) for i in range(3))


def make_gradient(size, c1=(5, 10, 68), c2=(78, 236, 255)):
    """Diagonal gradient background, top-left to bottom-right."""
    img = Image.new("RGB", (size, size), c1)
    px = img.load()
    for y in range(size):
        for x in range(size):
            t = (x + y) / (2 * size)
            px[x, y] = lerp(c1, c2, t)
    return img


def draw_m_path(draw, size, color, stroke_w, padding_pct=0.18):
    """Draw the M-mountain path: 4,22 → 4,8 → 14,16 → 24,8 → 24,22, scaled to size."""
    pad = int(size * padding_pct)
    avail = size - 2 * pad
    pts_svg = [(4, 22), (4, 8), (14, 16), (24, 8), (24, 22)]
    pts = [(pad + int(x / 28 * avail), pad + int(y / 28 * avail)) for x, y in pts_svg]
    # Draw connected stroked path with rounded joins (PIL doesn't have native rounded joins,
    # so we draw lines + circle caps at each vertex).
    for i in range(len(pts) - 1):
        draw.line([pts[i], pts[i + 1]], fill=color, width=stroke_w)
    r = stroke_w // 2
    for x, y in pts:
        draw.ellipse([x - r, y - r, x + r, y + r], fill=color)


def make_icon(size, maskable=False):
    """Maskable icons need ~20% safe zone padding (Chrome spec)."""
    bg = make_gradient(size).convert("RGBA")
    overlay = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)
    stroke_w = max(2, int(size * 0.10))
    pad_pct = 0.27 if maskable else 0.20
    draw_m_path(draw, size, (255, 255, 255, 255), stroke_w, padding_pct=pad_pct)
    return Image.alpha_composite(bg, overlay)


def main():
    # Standard icons
    make_icon(192).save(f"{OUT}/icon-192.png", optimize=True)
    make_icon(512).save(f"{OUT}/icon-512.png", optimize=True)
    # Maskable (more padding for Android adaptive icon crops)
    make_icon(512, maskable=True).save(f"{OUT}/icon-512-maskable.png", optimize=True)
    # Apple touch icon (iOS uses opaque, no transparency-as-mask)
    make_icon(180).save(f"{OUT}/apple-touch-icon.png", optimize=True)
    # Favicon
    fav = make_icon(64)
    fav.save(f"{OUT}/favicon-32.png", optimize=True)
    fav.resize((32, 32), Image.LANCZOS).save(f"{OUT}/favicon.ico", format="ICO", sizes=[(32, 32)])
    print("Generated:")
    for f in sorted(os.listdir(OUT)):
        path = f"{OUT}/{f}"
        print(f"  {f:30s} {os.path.getsize(path):>6d} bytes")


if __name__ == "__main__":
    main()
