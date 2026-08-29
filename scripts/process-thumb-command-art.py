from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / "assets" / "thumb-command"
SOURCE = ASSETS / "source"
ASSETS.mkdir(parents=True, exist_ok=True)
SOURCE.mkdir(parents=True, exist_ok=True)

def webp(image, name, width, quality=88):
    ratio = width / image.width
    resized = image.resize((width, round(image.height * ratio)), Image.Resampling.LANCZOS)
    resized.save(ASSETS / name, "WEBP", quality=quality, method=6)

icon = Image.open(SOURCE / "thumb-command-app-icon-source.png").convert("RGB")
for width in (480, 960, 1254):
    webp(icon, f"thumb-command-app-icon-{width}.webp", width, 90)

gameplay = Image.open(SOURCE / "thumb-command-chicago-gameplay-source.png").convert("RGB")
for width in (640, 960, 1440):
    webp(gameplay, f"thumb-command-chicago-{width}.webp", width)

cities = Image.open(SOURCE / "thumb-command-city-board-source.png").convert("RGB")
city_boxes = {
    "san-francisco": (0, 0, 768, 512),
    "new-york-city": (768, 0, 1536, 512),
    "london": (0, 512, 768, 1024),
    "tokyo": (768, 512, 1536, 1024),
}
for city, box in city_boxes.items():
    crop = cities.crop(box)
    for width in (640, 960):
        webp(crop, f"thumb-command-city-{city}-{width}.webp", width)

units = Image.open(SOURCE / "thumb-command-units-board-source.png").convert("RGB")
unit_boxes = {
    "blueguard": (185, 0, 990, 320),
    "alien-fleet": (0, 310, 990, 600),
    "mothership": (990, 320, 1536, 760),
    "defense-systems": (0, 590, 1536, 1024),
}
for feature, box in unit_boxes.items():
    crop = units.crop(box)
    for width in (640, 960):
        webp(crop, f"thumb-command-{feature}-{width}.webp", width)

og = gameplay.crop((80, 105, 1456, 827)).resize((1200, 630), Image.Resampling.LANCZOS)
og.save(ASSETS / "og-thumb-command.jpg", "JPEG", quality=91, optimize=True, progressive=True)

print("Processed Thumb Command source art into responsive derivatives.")
