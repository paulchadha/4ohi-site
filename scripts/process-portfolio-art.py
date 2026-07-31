"""Create optimized, non-destructive portfolio art derivatives.

Founder source PNGs must already exist under assets/bobby and assets/evil-doom.
Only saturated magenta pixels in the Evil Doom boards are remapped to the
approved Northwestern purple system; all other source pixels remain unchanged.
"""

from __future__ import annotations

import hashlib
import json
from pathlib import Path

import numpy as np
from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
BOBBY = ROOT / "assets" / "bobby"
EVIL = ROOT / "assets" / "evil-doom"
PURPLE = np.array([0x4E, 0x2A, 0x84], dtype=np.float32)


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def save_webp(image: Image.Image, path: Path, width: int | None = None) -> None:
    if width and image.width != width:
        height = round(image.height * width / image.width)
        image = image.resize((width, height), Image.Resampling.LANCZOS)
    image.save(path, "WEBP", quality=84, method=6, exact=True)


def crop_webp(image: Image.Image, box: tuple[int, int, int, int], path: Path, width: int) -> None:
    save_webp(image.crop(box), path, width)


def magenta_to_purple(image: Image.Image) -> tuple[Image.Image, dict[str, int | str]]:
    rgba = np.array(image.convert("RGBA"), dtype=np.uint8)
    original = rgba.copy()
    rgb = rgba[..., :3].astype(np.float32) / 255.0
    r, g, b = rgb[..., 0], rgb[..., 1], rgb[..., 2]
    maximum = rgb.max(axis=2)
    minimum = rgb.min(axis=2)
    delta = maximum - minimum
    saturation = np.divide(delta, maximum, out=np.zeros_like(delta), where=maximum > 0)
    hue = np.zeros_like(maximum)
    active = delta > 0
    red_max = active & (maximum == r)
    green_max = active & (maximum == g)
    blue_max = active & (maximum == b)
    hue[red_max] = (60 * ((g[red_max] - b[red_max]) / delta[red_max]) + 360) % 360
    hue[green_max] = 60 * ((b[green_max] - r[green_max]) / delta[green_max] + 2)
    hue[blue_max] = 60 * ((r[blue_max] - g[blue_max]) / delta[blue_max] + 4)

    mask = (
        (hue >= 300)
        & (hue <= 345)
        & (saturation > 0.35)
        & (maximum > 0.18)
        & (r > g * 1.15)
        & (b > g * 1.05)
    )
    scale = np.clip(0.65 + maximum * 0.65, 0.72, 1.28)
    replacement = np.clip(PURPLE[None, None, :] * scale[..., None], 0, 255).astype(np.uint8)
    rgba[..., :3][mask] = replacement[mask]
    changed = np.any(rgba != original, axis=2)
    outside_changed = int(np.count_nonzero(changed & ~mask))
    return Image.fromarray(rgba, "RGBA"), {
        "target": "#4E2A84",
        "selected_pixels": int(np.count_nonzero(mask)),
        "changed_pixels": int(np.count_nonzero(changed)),
        "changed_outside_selection": outside_changed,
    }


def main() -> None:
    bobby_source = BOBBY / "bobby-concept-board-source.png"
    evil_sources = [
        EVIL / "evil-doom-concept-board-a-source.png",
        EVIL / "evil-doom-concept-board-b-source.png",
    ]
    for source in [bobby_source, *evil_sources]:
        if not source.exists():
            raise SystemExit(f"Missing founder source: {source}")

    bobby = Image.open(bobby_source).convert("RGB")
    save_webp(bobby, BOBBY / "bobby-concept-board-1536.webp")
    save_webp(bobby, BOBBY / "bobby-concept-board-960.webp", 960)
    crop_webp(bobby, (0, 0, 616, 476), BOBBY / "bobby-hero-1200.webp", 1200)
    crop_webp(bobby, (0, 165, 615, 476), BOBBY / "bobby-character-720.webp", 720)
    crop_webp(bobby, (1068, 716, 1536, 926), BOBBY / "bobby-world-960.webp", 960)

    report: dict[str, object] = {
        "method": "HSV-isolated saturated magenta selection; non-selected pixels copied byte-for-byte in the decoded raster",
        "target_purple": "#4E2A84",
        "sources": {},
    }
    purple_images: list[Image.Image] = []
    for label, source in zip(("a", "b"), evil_sources, strict=True):
        original = Image.open(source).convert("RGBA")
        purple, stats = magenta_to_purple(original)
        purple_images.append(purple)
        original_webp = EVIL / f"evil-doom-concept-board-{label}-original-1280.webp"
        purple_webp = EVIL / f"evil-doom-concept-board-{label}-purple-1280.webp"
        save_webp(original, original_webp, 1280)
        save_webp(purple, purple_webp, 1280)
        save_webp(purple, EVIL / f"evil-doom-concept-board-{label}-purple-768.webp", 768)
        report["sources"][label] = {
            "source_sha256": sha256(source),
            "source_dimensions": list(original.size),
            "original_derivative": original_webp.relative_to(ROOT).as_posix(),
            "purple_derivative": purple_webp.relative_to(ROOT).as_posix(),
            **stats,
        }

    crop_webp(purple_images[1], (0, 0, 665, 480), EVIL / "evil-doom-hero-purple-1200.webp", 1200)
    crop_webp(purple_images[1], (665, 0, 1536, 320), EVIL / "evil-doom-heroes-purple-1200.webp", 1200)
    crop_webp(purple_images[0], (0, 328, 1536, 548), EVIL / "evil-doom-worlds-purple-1440.webp", 1440)
    (EVIL / "recolor-report.json").write_text(json.dumps(report, indent=2) + "\n", encoding="utf-8")
    print(json.dumps(report, indent=2))


if __name__ == "__main__":
    main()
