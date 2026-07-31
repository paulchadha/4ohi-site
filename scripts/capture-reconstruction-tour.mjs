import { createRequire } from "node:module";
import { copyFileSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";

const require = createRequire(import.meta.url);
const { chromium } = require("playwright");
const output = resolve("docs", "visual-evidence", "reconstruction");
mkdirSync(output, { recursive: true });
const browser = await chromium.launch({
  headless: true,
  executablePath: process.env.CHROME_PATH || "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"
});
const context = await browser.newContext({
  viewport: { width: 1280, height: 720 },
  recordVideo: { dir: output, size: { width: 1280, height: 720 } }
});
const page = await context.newPage();
await page.goto("http://127.0.0.1:4173/index.html");
await page.waitForTimeout(900);
await page.locator(".games-menu > summary").click();
await page.waitForTimeout(900);
await page.locator('.games-menu-panel a[href^="bobby-the-breadasaurus.html"]').click();
await page.waitForTimeout(900);
await page.goto("http://127.0.0.1:4173/evil-doom-adventures.html");
await page.waitForTimeout(900);
await page.goto("http://127.0.0.1:4173/index.html");
await page.setViewportSize({ width: 375, height: 812 });
await page.locator(".menu-toggle").click();
await page.waitForTimeout(900);
await page.locator(".games-menu > summary").click();
await page.waitForTimeout(900);
await page.goto("http://127.0.0.1:4173/palace-play.html");
await page.waitForTimeout(1200);
const video = page.video();
await context.close();
copyFileSync(await video.path(), resolve(output, "reconstruction-tour.webm"));
await browser.close();
console.log("Captured docs/visual-evidence/reconstruction/reconstruction-tour.webm");
