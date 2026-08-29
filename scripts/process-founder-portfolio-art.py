from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "assets" / "portfolio-2026"
SRC = ROOT / "docs" / "source-assets" / "founder-studio-portfolio-2026-08-29"
OUT.mkdir(parents=True, exist_ok=True)


def export(source, name, box=None, size=(1600, 1000), quality=86):
    image = Image.open(SRC / source).convert("RGB")
    if box:
        image = image.crop(box)
    target_ratio = size[0] / size[1]
    ratio = image.width / image.height
    if ratio > target_ratio:
        width = round(image.height * target_ratio)
        left = (image.width - width) // 2
        image = image.crop((left, 0, left + width, image.height))
    elif ratio < target_ratio:
        height = round(image.width / target_ratio)
        top = (image.height - height) // 2
        image = image.crop((0, top, image.width, top + height))
    image.thumbnail(size, Image.Resampling.LANCZOS)
    image.save(OUT / f"{name}.webp", "WEBP", quality=quality, method=6)


export("bobby-system.png", "bobby-tower-defense", box=(0, 0, 835, 887))
export("bobby-gameplay.png", "bobby-gameplay", box=(0, 0, 1142, 590))
export("commander-cities.png", "commander-world-campaign", box=(0, 0, 1536, 1024))
export("heartstack.png", "heartstack-unicorn-blast", box=(0, 0, 1024, 760))
export("lands-a.png", "unicorn-land", box=(0, 0, 768, 1024))
export("lands-a.png", "princess-land", box=(768, 0, 1536, 1024))
export("lands-b.png", "unicorn-land-world", box=(0, 0, 768, 1024))
export("lands-b.png", "princess-land-world", box=(768, 0, 1536, 1024))
