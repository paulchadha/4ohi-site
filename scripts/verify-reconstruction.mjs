import { createRequire } from "node:module";
import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const require = createRequire(import.meta.url);
const { chromium } = require("playwright");
const base = process.env.SITE_URL || "http://127.0.0.1:4173";
const chrome = process.env.CHROME_PATH || "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const evidence = resolve("docs", "visual-evidence", "reconstruction-2026-08-29");
mkdirSync(evidence, { recursive: true });

const games = [
  ["Palace", "/palace-play.html"],
  ["Bobby the Breadasaurus", "/bobby-the-breadasaurus.html"],
  ["Evil Doom Adventures: Shadow Run", "/evil-doom-adventures.html"],
  ["Thumb Command", "/games/thumb-command/"],
  ["Hearts", "/hearts-play.html"],
  ["Spades", "/spades-play.html"],
  ["Euchre", "/euchre-play.html"]
];
const routes = [
  "index.html", "games.html", "palace.html", "palace-play.html",
  "bobby-the-breadasaurus.html", "evil-doom-adventures.html", "thumb-command.html",
  "hearts-play.html", "spades-play.html", "euchre-play.html", "news.html",
  "about.html", "support.html", "privacy.html", "security.html", "terms.html"
];
const viewports = [[320, 568], [375, 812], [430, 932], [768, 1024], [1024, 768], [1440, 900], [1920, 1080], [844, 390]];
const failures = [];
const results = { checkedAt: new Date().toISOString(), base, routes: [], interactions: {}, failures };
const browser = await chromium.launch({ headless: true, executablePath: chrome });

for (const route of routes) {
  for (const [width, height] of viewports) {
    const page = await browser.newPage({ viewport: { width, height } });
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    const response = await page.goto(`${base}/${route}`, { waitUntil: "networkidle" });
    const state = await page.evaluate(() => ({
      h1: document.querySelectorAll("h1").length,
      main: Boolean(document.querySelector("main#main")),
      overflow: document.documentElement.scrollWidth - innerWidth,
      brokenImages: [...document.images].filter((image) => image.complete && image.naturalWidth === 0).map((image) => image.currentSrc),
      cookies: document.cookie,
      local: localStorage.length,
      session: sessionStorage.length
    }));
    const entry = { route, width, height, status: response?.status(), errors, ...state };
    results.routes.push(entry);
    if (entry.status !== 200 || entry.h1 !== 1 || !entry.main || entry.overflow > 1 || entry.brokenImages.length || entry.errors.length || entry.cookies || entry.local || entry.session) {
      failures.push(`${route} ${width}x${height}: ${JSON.stringify(entry)}`);
    }
    await page.close();
  }
}

const desktop = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await desktop.goto(`${base}/index.html`, { waitUntil: "networkidle" });
const portfolioLinks = desktop.locator("[data-portfolio-game]");
if (await portfolioLinks.count() !== games.length) failures.push("Homepage portfolio does not expose all seven canonical games.");
for (const [title, href] of games) {
  const link = portfolioLinks.filter({ hasText: title });
  if (await link.count() !== 1) failures.push(`Homepage portfolio is missing ${title}.`);
  const target = await link.first().getAttribute("href");
  if (new URL(target, base).pathname !== href) failures.push(`${title} homepage portfolio target is ${target}, expected ${href}.`);
}
await portfolioLinks.first().scrollIntoViewIfNeeded();
await portfolioLinks.first().focus();
const portfolioFocus = await portfolioLinks.first().evaluate((node) => getComputedStyle(node).outlineWidth);
if (parseFloat(portfolioFocus) < 2) failures.push("Homepage portfolio focus is not visibly outlined.");
await desktop.screenshot({ path: resolve(evidence, "desktop-home-seven-worlds.png") });
await desktop.locator(".games-menu > summary").click();
const desktopItems = await desktop.locator(".games-menu-panel a:not(.view-all-games)").allTextContents();
if (desktopItems.length !== 7 || games.some(([title]) => !desktopItems.some((text) => text.includes(title)))) failures.push("Desktop Games menu does not expose all seven canonical titles.");
await desktop.screenshot({ path: resolve(evidence, "desktop-games-menu-open.png") });
await desktop.keyboard.press("Escape");
if (await desktop.locator(".games-menu").evaluate((node) => node.open)) failures.push("Escape did not close desktop Games menu.");
for (const [title] of games) {
  await desktop.locator(".games-menu > summary").click();
  const link = desktop.locator(".games-menu-panel a:not(.view-all-games)").filter({ hasText: title });
  if (await link.count() !== 1) {
    failures.push(`Missing menu destination for ${title}.`);
  } else {
    const href = await link.getAttribute("href");
    const response = await desktop.request.get(new URL(href, base).href);
    if (!response.ok()) failures.push(`${title} destination returned ${response.status()}.`);
  }
  await desktop.keyboard.press("Escape");
}
await desktop.keyboard.press("Tab");
await desktop.keyboard.press("Tab");
await desktop.keyboard.press("Tab");
const focus = await desktop.evaluate(() => ({ tag: document.activeElement?.tagName, outline: getComputedStyle(document.activeElement).outlineWidth }));
if (parseFloat(focus.outline) < 2) failures.push("Primary navigation focus is not visibly outlined.");
await desktop.screenshot({ path: resolve(evidence, "desktop-navigation-focus.png") });
results.interactions.desktop = { items: desktopItems.length, focus };
await desktop.close();

const mobile = await browser.newPage({ viewport: { width: 375, height: 812 }, hasTouch: true });
await mobile.goto(`${base}/index.html`, { waitUntil: "networkidle" });
await mobile.locator(".menu-toggle").click();
if (await mobile.locator("#primary-navigation").getAttribute("data-open") !== "true") failures.push("Mobile navigation did not open.");
await mobile.locator(".games-menu > summary").click();
const mobileItems = await mobile.locator(".games-menu-panel a:not(.view-all-games)").count();
if (mobileItems !== 7) failures.push("Mobile Games accordion does not expose all seven games.");
await mobile.screenshot({ path: resolve(evidence, "mobile-navigation-open.png") });
await mobile.keyboard.press("Escape");
await mobile.keyboard.press("Escape");
if (await mobile.locator("#primary-navigation").getAttribute("data-open") !== "false") failures.push("Escape did not close mobile navigation.");
results.interactions.mobile = { items: mobileItems };
await mobile.close();

const shots = [
  ["index.html", "desktop-home-top.png", 1440, 900, false],
  ["index.html", "desktop-home-featured.png", 1440, 900, true],
  ["games.html", "desktop-games-index.png", 1440, 900, false],
  ["palace.html", "desktop-palace.png", 1440, 900, false],
  ["bobby-the-breadasaurus.html", "desktop-bobby.png", 1440, 900, false],
  ["evil-doom-adventures.html", "desktop-evil-doom.png", 1440, 900, false],
  ["thumb-command.html", "desktop-commander-thumb.png", 1440, 900, false],
  ["news.html", "desktop-news.png", 1440, 900, false],
  ["about.html", "desktop-about.png", 1440, 900, false],
  ["index.html", "mobile-home.png", 375, 812, false],
  ["games.html", "mobile-games.png", 375, 812, false],
  ["bobby-the-breadasaurus.html", "mobile-bobby.png", 375, 812, false],
  ["evil-doom-adventures.html", "mobile-evil-doom.png", 375, 812, false],
  ["palace-play.html", "mobile-play-palace.png", 375, 812, false]
];
for (const [route, name, width, height, featured] of shots) {
  const page = await browser.newPage({ viewport: { width, height } });
  await page.goto(`${base}/${route}`, { waitUntil: "networkidle" });
  if (featured) await page.locator(".home-portfolio").scrollIntoViewIfNeeded();
  await page.screenshot({ path: resolve(evidence, name), fullPage: false });
  await page.close();
}

const purple = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await purple.goto(`${base}/evil-doom-adventures.html`, { waitUntil: "networkidle" });
await purple.locator(".shadow-runners").scrollIntoViewIfNeeded();
const purpleColor = await purple.locator(".shadow-runners").evaluate((node) => getComputedStyle(node).backgroundColor);
if (purpleColor !== "rgb(78, 42, 132)") failures.push(`Evil Doom Girl treatment is ${purpleColor}, expected rgb(78, 42, 132).`);
await purple.screenshot({ path: resolve(evidence, "evil-doom-girl-purple.png") });
await purple.close();

const hover = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await hover.goto(`${base}/games.html`, { waitUntil: "networkidle" });
await hover.locator(".catalog-card").first().hover();
await hover.locator(".catalog-card").first().screenshot({ path: resolve(evidence, "game-card-hover.png") });
await hover.close();

await browser.close();
writeFileSync(resolve(evidence, "reconstruction-results.json"), JSON.stringify(results, null, 2) + "\n");
if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}
console.log(`Reconstruction QA passed: ${routes.length} routes × ${viewports.length} viewports, seven-game navigation, keyboard, touch, overflow, privacy, purple, and screenshot gates.`);
