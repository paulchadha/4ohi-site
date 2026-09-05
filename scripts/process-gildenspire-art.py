"""Create reproducible web derivatives from the founder-supplied GildenSpire board."""

from __future__ import annotations

import hashlib
import json
from pathlib import Path

from PIL import Image, ImageOps


ROOT = Path(__file__).resolve().parents[1]
SOURCE_DIR = ROOT / "docs" / "source-assets" / "gildenspire"
OUTPUT_DIR = ROOT / "assets" / "gildenspire"
BOARD = SOURCE_DIR / "gildenspire-concept-board-source.png"
HERO = SOURCE_DIR / "gildenspire-hero-generated-v1.png"


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as stream:
        for chunk in iter(lambda: stream.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def fitted(image: Image.Image, size: tuple[int, int], centering=(0.5, 0.5)) -> Image.Image:
    return ImageOps.fit(image.convert("RGB"), size, Image.Resampling.LANCZOS, centering=centering)


def webp(image: Image.Image, name: str, size: tuple[int, int], centering=(0.5, 0.5)) -> Path:
    target = OUTPUT_DIR / name
    fitted(image, size, centering).save(target, "WEBP", quality=88, method=6)
    return target


def panel(board: Image.Image, box: tuple[int, int, int, int], name: str) -> Path:
    crop = board.crop(box).convert("RGB")
    width = 960
    height = round(width * crop.height / crop.width)
    target = OUTPUT_DIR / name
    crop.resize((width, height), Image.Resampling.LANCZOS).save(target, "WEBP", quality=88, method=6)
    return target


def main() -> None:
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    with Image.open(HERO) as hero, Image.open(BOARD) as board:
        outputs = [
            webp(hero, "gildenspire-hero-1600.webp", (1600, 900), (0.52, 0.5)),
            webp(hero, "gildenspire-hero-960.webp", (960, 540), (0.52, 0.5)),
            webp(hero, "gildenspire-tile-960.webp", (960, 720), (0.46, 0.5)),
        ]
        og = OUTPUT_DIR / "gildenspire-social-1200x630.jpg"
        fitted(hero, (1200, 630), (0.52, 0.5)).save(og, "JPEG", quality=91, optimize=True, progressive=True)
        outputs.append(og)
        outputs.extend(
            [
                panel(board, (384, 312, 916, 666), "gildenspire-raise-960.webp"),
                panel(board, (916, 312, 1536, 666), "gildenspire-fly-960.webp"),
                panel(board, (0, 667, 422, 960), "gildenspire-fight-960.webp"),
                panel(board, (810, 667, 1149, 960), "gildenspire-dragons-960.webp"),
                panel(board, (1149, 667, 1536, 960), "gildenspire-golden-960.webp"),
            ]
        )

    provenance = {
        "product": "GildenSpire",
        "sourceBoard": {
            "path": str(BOARD.relative_to(ROOT)).replace("\\", "/"),
            "sha256": sha256(BOARD),
            "role": "Founder-supplied concept board and approved visual direction",
        },
        "generatedHero": {
            "path": str(HERO.relative_to(ROOT)).replace("\\", "/"),
            "sha256": sha256(HERO),
            "role": "Text-free production derivative generated from the founder-supplied board",
            "tool": "OpenAI built-in image generation",
        },
        "outputs": [
            {
                "path": str(path.relative_to(ROOT)).replace("\\", "/"),
                "sha256": sha256(path),
                "bytes": path.stat().st_size,
            }
            for path in outputs
        ],
        "publicTitle": "GildenSpire",
        "workingTitleTreatment": "The source board's embedded working-title treatment is not used as public text.",
    }
    (OUTPUT_DIR / "provenance.json").write_text(json.dumps(provenance, indent=2) + "\n", encoding="utf-8")
    print(f"Created {len(outputs)} GildenSpire production assets in {OUTPUT_DIR}")


if __name__ == "__main__":
    main()
