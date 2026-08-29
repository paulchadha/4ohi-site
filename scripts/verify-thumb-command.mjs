import { createRequire } from "node:module";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const require = createRequire(import.meta.url);
const { chromium } = require("playwright");
const base = process.env.SITE_URL || "http://127.0.0.1:4173";
const chrome = process.env.CHROME_PATH || "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const evidence = resolve("docs", "visual-evidence", "thumb-command");
mkdirSync(evidence, { recursive: true });
const routes = [
  "index.html", "games.html", "thumb-command.html", "news.html",
  "news-thumb-command-save-planet-earth.html", "news-the-city-is-the-base.html",
  "news-meet-the-blueguard.html", "news-designing-the-alien-invasion.html",
  "news-thumb-command-world-tour.html"
];
const viewports = [[320,568],[375,812],[768,1024],[1366,768],[1920,1080]];
const legacy = /Commander\s+Thum(?:-B|B|b|b B)|Commander\s+Thumb|Thum\s+System/i;
const failures = [];
const results = { checkedAt: new Date().toISOString(), base, pages: [], failures };
const browser = await chromium.launch({ headless: true, executablePath: chrome });

for (const route of routes) {
  for (const [width, height] of viewports) {
    const page = await browser.newPage({ viewport: { width, height }, reducedMotion: "reduce" });
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
    const response = await page.goto(`${base}/${route}`, { waitUntil: "networkidle" });
    for (const image of await page.locator("img:visible").all()) await image.scrollIntoViewIfNeeded();
    const state = await page.evaluate(() => ({
      h1: document.querySelectorAll("h1").length,
      overflow: document.documentElement.scrollWidth - innerWidth,
      broken: [...document.images].filter((image) => !image.complete || image.naturalWidth === 0).length,
      legacy: /Commander\s+Thum(?:-B|B|b|b B)|Commander\s+Thumb|Thum\s+System/i.test(document.body.innerText),
      main: Boolean(document.querySelector("main#main"))
    }));
    results.pages.push({ route, width, height, status: response?.status(), ...state, errors });
    if (response?.status() !== 200 || state.h1 !== 1 || state.overflow > 1 || state.broken || state.legacy || !state.main || errors.length) failures.push(`${route} ${width}x${height} failed rendered gate`);
    if (route === "thumb-command.html" && [320,768,1366,1920].includes(width)) await page.screenshot({ path: resolve(evidence, `thumb-command-${width}x${height}.png`), fullPage: true });
    await page.close();
  }
}

const command = await browser.newPage({ viewport: { width: 375, height: 812 } });
await command.goto(`${base}/thumb-command.html`, { waitUntil: "networkidle" });
const commandState = await command.evaluate(() => ({
  title: document.title,
  canonical: document.querySelector('link[rel="canonical"]')?.href,
  h1: document.querySelector("h1")?.textContent.trim(),
  tagline: document.querySelector(".tc-hero-tagline")?.textContent.trim(),
  cities: [...document.querySelectorAll(".tc-city-grid figcaption b")].map((node) => node.textContent.trim()),
  upgrades: [...document.querySelectorAll(".tc-upgrades h3")].map((node) => node.textContent.trim()),
  enemies: [...document.querySelectorAll(".tc-enemy-tags > *")].map((node) => node.textContent.trim()),
  og: document.querySelector('meta[property="og:image"]')?.content,
  current: document.querySelector('.games-menu a[aria-current="page"] strong')?.textContent.trim()
}));
if (commandState.h1 !== "Thumb Command" || commandState.tagline !== "Save Planet Earth") failures.push("Thumb Command hero identity gate failed");
if (commandState.canonical !== "https://4ohi.com/games/thumb-command/") failures.push("Thumb Command canonical URL failed");
if (!["Chicago","San Francisco","New York City","London","Tokyo"].every((city) => commandState.cities.includes(city))) failures.push("World tour gate failed");
if (!["Vanguard","Sentinel","Paladin"].every((upgrade) => commandState.upgrades.includes(upgrade))) failures.push("Blueguard upgrade gate failed");
if (!["Stingray","Voidripper","Hexblade","Skitterer","Wraith","Bloodbite","Mothership boss"].every((enemy) => commandState.enemies.includes(enemy))) failures.push("Alien threat gate failed");
if (!commandState.og?.includes("og-thumb-command.jpg") || commandState.current !== "Thumb Command") failures.push("Metadata or current-navigation gate failed");
await command.locator('[data-tc-gallery]').first().focus();
await command.keyboard.press("Enter");
if (!(await command.locator("[data-tc-dialog]").evaluate((node) => node.open))) failures.push("Keyboard gallery open failed");
await command.keyboard.press("Escape");
await command.close();

const home = await browser.newPage({ viewport: { width: 430, height: 932 } });
await home.goto(`${base}/index.html`, { waitUntil: "networkidle" });
const tile = await home.evaluate(() => {
  const link = document.querySelector('[data-home-game="thumb-command"]');
  return { href: link?.getAttribute("href"), name: link?.querySelector("h3")?.textContent.trim(), copy: link?.innerText, image: link?.querySelector("img")?.getAttribute("src") };
});
if (!tile.href?.startsWith("thumb-command.html") || tile.name !== "Thumb Command" || !/Save Planet Earth/i.test(tile.copy) || !tile.image?.includes("thumb-command")) failures.push("Homepage Thumb Command feature gate failed");
await home.locator(".menu-toggle").click();
await home.locator(".games-menu > summary").focus();
await home.keyboard.press("Enter");
if ((await home.locator('.games-menu-panel a[href^="thumb-command.html"]').count()) !== 1) failures.push("Mobile Games navigation gate failed");
await home.close();

const news = await browser.newPage({ viewport: { width: 1366, height: 768 } });
await news.goto(`${base}/news.html`, { waitUntil: "networkidle" });
const articleTitles = await news.locator('[data-news-tags*="thumb-command"] h2').allTextContents();
if (articleTitles.length < 5) failures.push("Thumb Command news collection gate failed");
await news.close();

for (const [oldRoute, expected] of [["commander-thumb.html","thumb-command.html"],["news-commander-thumb-is-coming.html","news-thumb-command-save-planet-earth.html"],["news-welcome-to-the-thum-system.html","news-the-city-is-the-base.html"],["news-building-commander-thumb.html","news-meet-the-blueguard.html"]]) {
  const page = await browser.newPage();
  await page.goto(`${base}/${oldRoute}`, { waitUntil: "networkidle" });
  await page.waitForURL(new RegExp(`${expected.replaceAll(".", "\\.")}(?:[?#].*)?$`));
  if (!page.url().includes(expected)) failures.push(`${oldRoute} redirect failed`);
  await page.close();
}

await browser.close();
if (legacy.test(JSON.stringify(results))) failures.push("Legacy product name leaked into results");
writeFileSync(resolve(evidence, "thumb-command-results.json"), `${JSON.stringify({ ...results, command: commandState }, null, 2)}\n`, "utf8");
if (!existsSync(resolve("assets/thumb-command/source/thumb-command-app-icon-source.png"))) failures.push("Approved source-art preservation gate failed");
if (failures.length) { console.error(failures.join("\n")); process.exit(1); }
console.log(`Thumb Command QA passed: ${routes.length} routes, ${viewports.length} viewports, five articles, world tour, gallery, metadata, navigation, redirects, responsive layout, and source-art provenance.`);
