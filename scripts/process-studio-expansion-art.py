"""Build repeatable website derivatives for BooYang City, Funky Town, Whomly, and Sleep Amigo."""
from pathlib import Path
import json
from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "docs" / "source-assets" / "studio-expansion-2026-09-05"
OUTPUT = ROOT / "assets" / "studio-expansion"
OUTPUT.mkdir(parents=True, exist_ok=True)

def open_rgb(name):
    return Image.open(SOURCE / name).convert("RGB")

def save_cover(image, name, size, center=(0.5, 0.5), quality=88):
    fitted = ImageOps.fit(image, size, method=Image.Resampling.LANCZOS, centering=center)
    path = OUTPUT / name
    fitted.save(path, "WEBP", quality=quality, method=6)
    return {"path": str(path.relative_to(ROOT)).replace("\\", "/"), "width": size[0], "height": size[1]}

def save_contain(image, name, max_size, quality=88):
    copy = image.copy()
    copy.thumbnail(max_size, Image.Resampling.LANCZOS)
    path = OUTPUT / name
    copy.save(path, "WEBP", quality=quality, method=6)
    return {"path": str(path.relative_to(ROOT)).replace("\\", "/"), "width": copy.width, "height": copy.height}

wide = open_rgb("booyang-funky-gildenspire-wide-source.png")
board = open_rgb("booyang-funky-gildenspire-board-source.png")
whomly = open_rgb("whomly-board-source.png")
sleep = open_rgb("sleep-amigo-board-source.png")
outputs = []

booyang_square = wide.crop((0, 0, 724, 724))
funky_square = wide.crop((724, 0, 1448, 724))
booyang_play = board.crop((0, 460, 512, 1024))
funky_play = board.crop((512, 460, 1024, 1024))
for base, image in (("booyang-city", booyang_square), ("funky-town", funky_square)):
    outputs += [save_cover(image, f"{base}-tile-960.webp", (960, 720)), save_cover(image, f"{base}-tile-480.webp", (480, 360)), save_cover(image, f"{base}-hero-1600.webp", (1600, 900), (0.5, 0.48)), save_cover(image, f"{base}-social-1200.webp", (1200, 630), (0.5, 0.48))]
outputs += [save_cover(booyang_play, "booyang-city-play-960.webp", (960, 1080)), save_cover(funky_play, "funky-town-play-960.webp", (960, 1080))]

whomly_icon = whomly.crop((38, 22, 365, 350))
whomly_phone = whomly.crop((365, 25, 855, 1050))
whomly_context = whomly.crop((850, 20, 1249, 1040))
outputs += [save_cover(whomly_icon, "whomly-tile-720.webp", (720, 720)), save_contain(whomly, "whomly-board-1200.webp", (1200, 1210)), save_contain(whomly_phone, "whomly-search-720.webp", (720, 1200)), save_contain(whomly_context, "whomly-context-640.webp", (640, 1200)), save_cover(whomly, "whomly-social-1200.webp", (1200, 630), (0.5, 0.39))]

sleep_icon = sleep.crop((28, 45, 330, 390))
sleep_phone = sleep.crop((325, 25, 715, 800))
sleep_features = sleep.crop((10, 800, 1014, 1325))
outputs += [save_cover(sleep_icon, "sleep-amigo-tile-720.webp", (720, 720)), save_contain(sleep, "sleep-amigo-board-1024.webp", (1024, 1536)), save_cover(sleep_phone, "sleep-amigo-night-720.webp", (720, 1200)), save_contain(sleep_features, "sleep-amigo-features-1200.webp", (1200, 700)), save_cover(sleep, "sleep-amigo-social-1200.webp", (1200, 630), (0.5, 0.34))]

(OUTPUT / "provenance.json").write_text(json.dumps({"generatedFrom": "founder-supplied artwork boards", "date": "2026-09-05", "outputs": outputs}, indent=2), encoding="utf-8")
print(f"Created {len(outputs)} optimized assets in {OUTPUT}")
