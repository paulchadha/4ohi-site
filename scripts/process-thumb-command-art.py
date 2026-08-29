"""Build reproducible, responsive Thumb Command website artwork derivatives."""

from __future__ import annotations

import hashlib
import json
from pathlib import Path

from PIL import Image, ImageOps


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "docs" / "source-assets" / "thumb-command"
OUTPUT = ROOT / "assets" / "thumb-command"

SCENES = {
    "thumb-command-chicago-gameplay": "thumb-command-chicago-gameplay-source.png",
    "thumb-command-city-san-francisco": "thumb-command-city-san-francisco-source.png",
    "thumb-command-city-new-york": "thumb-command-city-new-york-source.png",
    "thumb-command-city-london": "thumb-command-city-london-source.png",
    "thumb-command-city-tokyo": "thumb-command-city-tokyo-source.png",
    "thumb-command-blueguard-upgrades": "thumb-command-blueguard-upgrades-source.png",
    "thumb-command-alien-fleet": "thumb-command-alien-fleet-source.png",
}


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def fit(image: Image.Image, size: tuple[int, int]) -> Image.Image:
    return ImageOps.fit(image, size, Image.Resampling.LANCZOS, centering=(0.5, 0.5))


def save_webp(image: Image.Image, path: Path) -> None:
    image.save(path, "WEBP", quality=84, method=6)


def save_jpeg(image: Image.Image, path: Path) -> None:
    image.convert("RGB").save(path, "JPEG", quality=88, optimize=True, progressive=True)


def main() -> None:
    OUTPUT.mkdir(parents=True, exist_ok=True)
    report: dict[str, object] = {"sources": {}, "outputs": []}

    icon_path = SOURCE / "thumb-command-approved-app-icon.png"
    with Image.open(icon_path) as icon:
        icon = icon.convert("RGBA")
        for edge in (384, 768):
            derivative = icon.resize((edge, edge), Image.Resampling.LANCZOS)
            target = OUTPUT / f"thumb-command-app-icon-{edge}.webp"
            save_webp(derivative, target)
            report["outputs"].append(str(target.relative_to(ROOT)).replace("\\", "/"))
        fallback = icon.resize((512, 512), Image.Resampling.LANCZOS)
        fallback_path = OUTPUT / "thumb-command-app-icon-512.png"
        fallback.save(fallback_path, "PNG", optimize=True)
        report["outputs"].append(str(fallback_path.relative_to(ROOT)).replace("\\", "/"))
    report["sources"][icon_path.name] = sha256(icon_path)

    for stem, filename in SCENES.items():
        source_path = SOURCE / filename
        with Image.open(source_path) as source:
            source = source.convert("RGB")
            for width in (720, 1280, 1600):
                height = round(width * 9 / 16)
                derivative = fit(source, (width, height))
                target = OUTPUT / f"{stem}-{width}.webp"
                save_webp(derivative, target)
                report["outputs"].append(str(target.relative_to(ROOT)).replace("\\", "/"))

            fallback = fit(source, (1600, 900))
            fallback_path = OUTPUT / f"{stem}-1600.jpg"
            save_jpeg(fallback, fallback_path)
            report["outputs"].append(str(fallback_path.relative_to(ROOT)).replace("\\", "/"))

            news = fit(source, (1200, 630))
            news_path = OUTPUT / f"{stem}-news-1200.jpg"
            save_jpeg(news, news_path)
            report["outputs"].append(str(news_path.relative_to(ROOT)).replace("\\", "/"))
        report["sources"][source_path.name] = sha256(source_path)

    social_source = SOURCE / "thumb-command-chicago-gameplay-source.png"
    with Image.open(social_source) as source:
        social = fit(source.convert("RGB"), (1200, 630))
        social_path = OUTPUT / "thumb-command-social-1200x630.jpg"
        save_jpeg(social, social_path)
        report["outputs"].append(str(social_path.relative_to(ROOT)).replace("\\", "/"))

    report_path = OUTPUT / "provenance.json"
    report_path.write_text(json.dumps(report, indent=2) + "\n", encoding="utf-8")
    print(f"Built {len(report['outputs'])} Thumb Command derivatives in {OUTPUT}")


if __name__ == "__main__":
    main()
