"""Build unchanged-composition WebP derivatives from approved Bobby masters."""
from pathlib import Path
import hashlib
import json
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "docs/source-assets/bobby-protector-builder-2026-10-31"
OUTPUT = ROOT / "assets/bobby/protector-builder"

def digest(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()

def main():
    OUTPUT.mkdir(parents=True, exist_ok=True)
    rows = []
    for name, widths in [("hero", [960, 1600]), ("tile", [480, 800])]:
        source = SOURCE / f"bobby_website_{name}.png"
        image = Image.open(source).convert("RGB")
        for width in widths:
            height = round(image.height * width / image.width)
            target = OUTPUT / f"bobby-{name}-{width}.webp"
            image.resize((width, height), Image.Resampling.LANCZOS).save(target, "WEBP", quality=84, method=6, exact=True)
            rows.append({"path": target.relative_to(ROOT).as_posix(), "width": width, "height": height, "bytes": target.stat().st_size, "sha256": digest(target), "source": source.relative_to(ROOT).as_posix(), "sourceSha256": digest(source), "crop": "none; complete source composition retained"})
    (OUTPUT / "provenance.json").write_text(json.dumps({"owner": "Four of Hearts Interactive, LLC", "sourcePackage": "Bobby Protector + Builder Artwork, 2026-10-31", "status": "Founder-supplied static development artwork; not gameplay screenshots", "derivatives": rows}, indent=2) + "\n", encoding="utf-8")

if __name__ == "__main__":
    main()
