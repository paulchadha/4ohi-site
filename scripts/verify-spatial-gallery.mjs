import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { chromium } = require("playwright");
const base = process.env.SITE_URL || "http://127.0.0.1:4173";
const chrome = process.env.CHROME_PATH || "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const matrix = [[320,568],[375,812],[430,932],[768,1024],[1366,768],[1920,1080]];
const failures = [];
const browser = await chromium.launch({ headless: true, executablePath: chrome });

for (const [width,height] of matrix) {
  const page = await browser.newPage({ viewport: { width, height } });
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
  await page.goto(`${base}/index.html`, { waitUntil: "networkidle" });
  const state = await page.evaluate(() => {
    const worlds = [...document.querySelectorAll("[data-spatial-world]")];
    const active = worlds.filter((world) => world.classList.contains("is-active"));
    const art = active[0]?.querySelector(".world-art-link")?.getBoundingClientRect();
    const caption = document.querySelector(".spatial-caption")?.getBoundingClientRect();
    const gallery = document.querySelector(".spatial-gallery")?.getBoundingClientRect();
    const targets = [...document.querySelectorAll(".spatial-controls button")].filter((button) => {
      const style = getComputedStyle(button);
      return style.display !== "none" && style.visibility !== "hidden";
    }).map((button) => button.getBoundingClientRect()).filter((rect) => rect.width < 42 || rect.height < 42);
    return {
      overflow: document.documentElement.scrollWidth - innerWidth,
      worlds: worlds.length,
      active: active.length,
      galleryHeight: gallery?.height || 0,
      artVisible: art ? art.right > 0 && art.left < innerWidth && art.bottom > 0 && art.top < innerHeight : false,
      captionVisible: caption ? caption.right > 0 && caption.left < innerWidth && caption.bottom > 0 && caption.top < innerHeight : false,
      undersized: targets.length,
      title: document.querySelector("[data-spatial-title]")?.textContent.trim()
    };
  });
  if (state.overflow > 1) failures.push(`${width}x${height}: horizontal overflow ${state.overflow}px`);
  if (state.worlds !== 5 || state.active !== 1) failures.push(`${width}x${height}: expected five worlds and one active (${state.worlds}/${state.active})`);
  if (state.galleryHeight < height * .9) failures.push(`${width}x${height}: gallery is not viewport-scale`);
  if (!state.artVisible || !state.captionVisible) failures.push(`${width}x${height}: active art or caption is outside the viewport`);
  if (state.undersized) failures.push(`${width}x${height}: ${state.undersized} undersized visible controls`);
  if (state.title !== "Palace") failures.push(`${width}x${height}: Palace is not initial world`);
  await page.close();
}

const interaction = await browser.newPage({ viewport: { width: 1366, height: 768 } });
await interaction.goto(`${base}/index.html`, { waitUntil: "networkidle" });
await interaction.click('[data-spatial-select="2"]');
if (await interaction.textContent("[data-spatial-title]") !== "Hearts") failures.push("Selector did not activate Hearts");
await interaction.locator('[data-spatial-select="2"]').focus();
await interaction.keyboard.press("ArrowRight");
if (await interaction.textContent("[data-spatial-title]") !== "Spades") failures.push("Keyboard ArrowRight did not activate Spades");
const activeHref = await interaction.getAttribute("[data-spatial-link]", "href");
if (activeHref !== "spades-play.html") failures.push(`Spades action link is wrong: ${activeHref}`);
await interaction.click("[data-spatial-next]");
if (await interaction.textContent("[data-spatial-title]") !== "Euchre") failures.push("Next control did not activate Euchre");
await interaction.click("[data-spatial-prev]");
if (await interaction.textContent("[data-spatial-title]") !== "Spades") failures.push("Previous control did not return to Spades");
await interaction.close();

await browser.close();
if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}
console.log(`Spatial gallery QA passed: ${matrix.length} viewports, five worlds, controls, keyboard, links, and overflow gates.`);