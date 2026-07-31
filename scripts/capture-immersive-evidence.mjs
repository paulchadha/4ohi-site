import { createRequire } from "node:module";
import { mkdir } from "node:fs/promises";
import { resolve } from "node:path";

const require = createRequire(import.meta.url);
const { chromium } = require("playwright");
const base = process.env.SITE_URL || "http://127.0.0.1:4173";
const prefix = process.env.EVIDENCE_PREFIX || "immersive-after";
const chrome = process.env.CHROME_PATH || "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const output = resolve(import.meta.dirname, "..", "docs", "visual-evidence");
const matrix = [[320,568],[360,800],[390,844],[412,915],[430,932],[768,1024],[1366,768],[1920,1080]];
const routes = ["index.html", "palace.html", "palace-play.html", "palace-story.html", "games.html", "news.html", "about.html"];

await mkdir(output, { recursive: true });
const browser = await chromium.launch({ headless: true, executablePath: chrome });
for (const [width, height] of matrix) {
  const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 });
  await page.goto(`${base}/index.html`, { waitUntil: "networkidle" });
  await page.screenshot({ path: resolve(output, `${prefix}-home-${width}x${height}.png`), fullPage: false });
  await page.close();
}
for (const route of routes.slice(1)) {
  for (const [width, height] of [[390,844],[1366,768]]) {
    const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 });
    await page.goto(`${base}/${route}`, { waitUntil: "networkidle" });
    await page.screenshot({ path: resolve(output, `${prefix}-${route.replace(".html", "")}-${width}x${height}.png`), fullPage: false });
    await page.close();
  }
}
await browser.close();
console.log(`Captured ${matrix.length + (routes.length - 1) * 2} ${prefix} screenshots.`);
