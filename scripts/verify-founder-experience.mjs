import { createRequire } from "node:module";
import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const require = createRequire(import.meta.url);
const { chromium } = require("playwright");
const base = process.env.SITE_URL || "http://127.0.0.1:4173";
const chrome = process.env.CHROME_PATH || "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const evidence = resolve("docs", "visual-evidence");
mkdirSync(evidence, { recursive: true });
const results = { base, checkedAt: new Date().toISOString(), pages: [], viewports: [], combinations: [], tutorial: [], privacy: {}, failures: [] };
const fail = (message) => results.failures.push(message);
const browser = await chromium.launch({ headless: true, executablePath: chrome });
const context = await browser.newContext();

const pages = [
  "index.html", "palace.html", "palace-play.html", "palace-story.html", "news.html",
  "news-why-were-building-palace.html", "news-palace-enters-founder-testing.html",
  "news-welcome-to-four-of-hearts.html", "news-meet-the-four-games.html",
  "news-building-a-safer-card-table.html", "games.html", "play.html",
  "hearts-play.html", "spades-play.html", "euchre-play.html", "about.html",
  "support.html", "privacy.html", "security.html", "terms.html", "contact.html", "404.html"
];
for (const file of pages) {
  const page = await context.newPage();
  const errors = [];
  page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
  page.on("pageerror", (error) => errors.push(error.message));
  const response = await page.goto(`${base}/${file}`, { waitUntil: "networkidle" });
  const data = await page.evaluate(() => ({
    h1: document.querySelectorAll("h1").length,
    title: document.title,
    canonical: document.querySelector('link[rel="canonical"]')?.href || "",
    description: document.querySelector('meta[name="description"]')?.content || "",
    overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
    trackers: [...document.scripts].map((script) => script.src).filter((src) => src && new URL(src).origin !== location.origin),
    alternates: document.querySelectorAll('link[rel="alternate"][hreflang]').length
  }));
  results.pages.push({ file, status: response?.status(), ...data, errors });
  if (response?.status() !== 200 || data.h1 !== 1 || data.overflow || errors.length || data.trackers.length || data.alternates !== 9) fail(`${file}: page gate failed`);
  await page.close();
}

for (const [width, height] of [[320,568],[360,800],[390,844],[412,915],[430,932],[768,1024],[1366,768],[1920,1080]]) {
  const page = await context.newPage({ viewport: { width, height } });
  await page.goto(`${base}/palace-play.html`, { waitUntil: "networkidle" });
  const geometry = await page.evaluate(() => {
    const table = document.querySelector(".palace-app-table")?.getBoundingClientRect();
    const hand = document.querySelector(".player-hand")?.getBoundingClientRect();
    return { overflow: document.documentElement.scrollWidth > innerWidth + 1, tableWidth: Math.round(table?.width || 0), tableHeight: Math.round(table?.height || 0), handBottom: Math.round(hand?.bottom || 0), viewport: [innerWidth, innerHeight] };
  });
  results.viewports.push({ width, height, ...geometry });
  if (geometry.overflow || !geometry.tableWidth || geometry.handBottom > height + 300) fail(`${width}x${height}: tutorial geometry failed`);
  if ([[390,844],[768,1024],[1366,768],[1920,1080]].some(([w,h]) => w === width && h === height)) {
    await page.screenshot({ path: resolve(evidence, `founder-mini-match-${width}x${height}.png`), fullPage: true });
  }
  await page.close();
}

const combinations = [
  ["en","palace","ltr"],["en","shed","ltr"],["fr","palace","ltr"],["fr","shed","ltr"],
  ["ar","palace","rtl"],["he","shed","rtl"],["en-CA-fun","palace","ltr"],["es","palace","ltr"],
  ["zh-Hans","palace","ltr"],["hi","palace","ltr"]
];
for (const [lang, game, dir] of combinations) {
  const page = await context.newPage({ viewport: { width: 390, height: 844 } });
  await page.goto(`${base}/palace-play.html?lang=${encodeURIComponent(lang)}&game=${game}`, { waitUntil: "networkidle" });
  const data = await page.evaluate(() => ({
    lang: document.documentElement.lang, dir: document.documentElement.dir,
    game: document.querySelector("[data-game-name]")?.textContent,
    countdown: document.querySelector("[data-release-strip]")?.textContent.trim(),
    settings: document.querySelector(".experience-settings")?.textContent.trim(),
    href: document.querySelector('a[href*="palace.html"]')?.href || ""
  }));
  results.combinations.push({ requested: [lang,game,dir], ...data });
  if (data.lang !== lang || data.dir !== dir || !data.countdown || !data.settings) fail(`${lang}/${game}: locale combination failed`);
  await page.close();
}

const tutorial = await context.newPage({ viewport: { width: 390, height: 844 } });
await tutorial.goto(`${base}/palace-play.html?lang=zh-Hans`, { waitUntil: "networkidle" });
await tutorial.locator('[data-play="low"]').click();
results.tutorial.push(await tutorial.locator("[data-match-status]").textContent());
await tutorial.locator('[data-play="match"]').click();
await tutorial.locator('[data-chapter="burn"]').waitFor();
await tutorial.locator('[data-play="burn"]').click();
await tutorial.locator('[data-chapter="pickup"]').waitFor();
await tutorial.locator('[data-action="pickup"]').click();
await tutorial.locator('[data-chapter="powers"]').waitFor();
for (const power of ["2","7","8","10"]) { await tutorial.locator(`[data-play="${power}"]`).click(); await tutorial.waitForTimeout(80); }
await tutorial.locator('[data-chapter="levels"]').waitFor();
for (let step = 0; step < 3; step += 1) await tutorial.locator('[data-play="level"]').first().click();
await tutorial.locator('[data-action="replay"]').waitFor();
await tutorial.locator('[data-action="replay"]').click();
const replayed = await tutorial.locator('[data-play="match"]').count();
results.tutorial.push({ replayed, finalChapter: await tutorial.locator(".palace-app-table").getAttribute("data-chapter") });
if (replayed !== 1) fail("Tutorial replay failed");
await tutorial.close();

const naming = await context.newPage();
await naming.goto(`${base}/palace.html?lang=fr&game=shed`, { waitUntil: "networkidle" });
for (let tap = 0; tap < 9; tap += 1) await naming.locator('[data-name-choice="Shed"]').first().click();
if (await naming.locator("[data-nsfw-dialog]").evaluate((dialog) => dialog.open)) fail("Easter egg opened before tenth tap");
await naming.locator('[data-name-choice="Shed"]').first().click();
if (!(await naming.locator("[data-nsfw-dialog]").evaluate((dialog) => dialog.open))) fail("Easter egg did not open on tenth tap");
await naming.locator('[data-nsfw-dialog] button[value="yes"]').click();
await naming.waitForFunction(() => location.search.includes("game=shithead"));
const secretUrl = naming.url();
const secretName = await naming.locator("[data-game-name]").first().textContent();
await naming.goto(`${base}/palace.html?lang=fr`, { waitUntil: "networkidle" });
const resetName = await naming.locator("[data-game-name]").first().textContent();
results.naming = { secretUrl, secretName, resetName };
if (!secretUrl.includes("game=shithead") || secretName !== "Shithead" || resetName === "Shithead") fail("Easter egg/reset gate failed");
await naming.close();

const privacyPage = await context.newPage();
await privacyPage.goto(`${base}/palace-play.html?lang=ar&game=shed`, { waitUntil: "networkidle" });
results.privacy = await privacyPage.evaluate(() => ({
  cookies: document.cookie,
  localStorage: localStorage.length,
  sessionStorage: sessionStorage.length,
  externalResources: performance.getEntriesByType("resource").map((entry) => entry.name).filter((url) => new URL(url).origin !== location.origin)
}));
if (results.privacy.cookies || results.privacy.localStorage || results.privacy.sessionStorage || results.privacy.externalResources.length) fail("Zero-storage/privacy gate failed");
await privacyPage.close();

await browser.close();
writeFileSync(resolve(evidence, "founder-experience-results.json"), `${JSON.stringify(results, null, 2)}\n`);
if (results.failures.length) {
  console.error(`Founder experience verification failed:\n- ${results.failures.join("\n- ")}`);
  process.exit(1);
}
console.log(`Founder experience verification passed: ${results.pages.length} pages, ${results.viewports.length} viewports, ${results.combinations.length} locale/name combinations, tutorial, Easter egg, RTL, and zero-storage privacy.`);
