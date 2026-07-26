import { createRequire } from "node:module";
import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const require = createRequire(import.meta.url);
const { chromium } = require("playwright");
const base = process.env.SITE_URL || "http://127.0.0.1:4173";
const chrome = process.env.CHROME_PATH || "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const evidence = resolve("docs", "visual-evidence");
mkdirSync(evidence, { recursive: true });
const results = { base, checkedAt: new Date().toISOString(), pages: [], modes: [], layouts: {}, tutorials: [], privacy: {}, failures: [] };
const fail = (message) => results.failures.push(message);
const browser = await chromium.launch({ headless: true, executablePath: chrome });
const context = await browser.newContext();

const pages = [
  "index.html", "palace.html", "palace-play.html", "palace-story.html", "palace-faq.html",
  "news.html", "news-why-were-building-palace.html", "news-palace-enters-founder-testing.html",
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
    overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
    nameControl: Boolean(document.querySelector(".header-name [data-current-game]")),
    languageControl: Boolean(document.querySelector(".header-language select")),
    settings: Boolean(document.querySelector("[data-open-settings]")),
    externalScripts: [...document.scripts].map((script) => script.src).filter((url) => url && new URL(url).origin !== location.origin),
    alternates: document.querySelectorAll('link[rel="alternate"][hreflang]').length
  }));
  results.pages.push({ file, status: response?.status(), ...data, errors });
  if (response?.status() !== 200 || data.h1 !== 1 || data.overflow || !data.nameControl || !data.languageControl || !data.settings || data.externalScripts.length || data.alternates !== 9 || errors.length) fail(`${file}: public page gate failed`);
  await page.close();
}

for (const [locale, mode, expected, dir] of [
  ["en", "palace", "Palace", "ltr"], ["en", "shed", "Shed", "ltr"],
  ["fr", "shed", "Shed", "ltr"], ["es", "palace", "Palace", "ltr"],
  ["hi", "shed", "Shed", "ltr"], ["zh-Hans", "palace", "Palace", "ltr"],
  ["he", "shed", "Shed", "rtl"], ["ar", "palace", "Palace", "rtl"],
  ["en-CA-fun", "shed", "Shed", "ltr"]
]) {
  const page = await context.newPage({ viewport: { width: 1366, height: 768 } });
  await page.goto(`${base}/news.html?lang=${encodeURIComponent(locale)}&game=${mode}`, { waitUntil: "networkidle" });
  const state = await page.evaluate((currentMode) => ({
    lang: document.documentElement.lang,
    dir: document.documentElement.dir,
    name: document.querySelector("[data-current-game]")?.textContent.trim(),
    navName: document.querySelector('.site-nav a[href*="palace.html"]')?.textContent.trim(),
    playLabel: document.querySelector(".nav-play")?.textContent.trim(),
    newsLabel: document.querySelector("h1")?.textContent.trim(),
    linksPreserve: [...document.querySelectorAll(".site-nav a")].every((a) => a.search.includes("lang=") && (currentMode === "palace" ? !a.search.includes("game=") : a.search.includes(`game=${currentMode}`)))
  }), mode);
  results.modes.push({ locale, mode, ...state });
  if (state.lang !== locale || state.dir !== dir || state.name !== expected || state.navName !== expected || !state.playLabel.includes(expected) || !state.newsLabel.includes(expected) || !state.linksPreserve) fail(`${locale}/${mode}: naming or locale gate failed`);
  await page.close();
}

for (const [file, width, height, shot] of [
  ["index.html", 1440, 900, "app-home-1440x900.png"],
  ["index.html", 390, 844, "app-home-390x844.png"],
  ["news.html", 1440, 900, "app-news-1440x900.png"],
  ["games.html", 1440, 900, "app-games-1440x900.png"],
  ["about.html", 1440, 900, "app-about-1440x900.png"],
  ["palace-play.html", 390, 844, "app-mini-match-390x844.png"],
  ["palace-play.html?lang=ar&game=shed", 390, 844, "app-mini-match-ar-shed-390x844.png"]
]) {
  const page = await context.newPage({ viewport: { width, height } });
  await page.goto(`${base}/${file}`, { waitUntil: "networkidle" });
  const geometry = await page.evaluate(() => ({
    overflow: document.documentElement.scrollWidth > innerWidth + 1,
    headerBottom: Math.round(document.querySelector(".site-header")?.getBoundingClientRect().bottom || 0),
    h1Bottom: Math.round(document.querySelector("h1")?.getBoundingClientRect().bottom || 0),
    newsTop: Math.round(document.querySelector(".featured-news")?.getBoundingClientRect().top || 0),
    gamesTop: Math.round(document.querySelector(".game-shelf")?.getBoundingClientRect().top || 0)
  }));
  results.layouts[shot] = geometry;
  if (geometry.overflow) fail(`${shot}: horizontal overflow`);
  if (file === "news.html" && geometry.newsTop > height * .72) fail("News featured story is still below the first viewport");
  if (file === "games.html" && geometry.gamesTop > height * .72) fail("More Games cards are still below the first viewport");
  await page.screenshot({ path: resolve(evidence, shot), fullPage: true });
  await page.close();
}

const powers = await context.newPage({ viewport: { width: 1440, height: 900 } });
await powers.goto(`${base}/index.html#rules`, { waitUntil: "networkidle" });
for (const rank of ["2", "7", "8", "10"]) {
  await powers.locator(`[data-power="${rank}"]`).click();
  const pressed = await powers.locator(`[data-power="${rank}"]`).getAttribute("aria-pressed");
  const active = await powers.locator("[data-power-showcase]").getAttribute("data-active-power");
  if (pressed !== "true" || active !== rank) fail(`Power card ${rank}: interaction state failed`);
}
await powers.locator("#rules").screenshot({ path: resolve(evidence, "app-power-cards-1440.png") });
await powers.close();

const palace = await context.newPage({ viewport: { width: 390, height: 844 } });
await palace.goto(`${base}/palace-play.html?lang=en&game=shed`, { waitUntil: "networkidle" });
await palace.locator('[data-play="low"]').click();
await palace.locator('[data-play="match"]').click();
await palace.locator('[data-chapter="burn"]').waitFor();
await palace.locator('[data-play="burn"]').click();
await palace.locator('[data-chapter="pickup"]').waitFor();
await palace.locator('[data-action="pickup"]').click();
await palace.locator('[data-chapter="powers"]').waitFor();
for (const rank of ["2", "7", "8", "10"]) await palace.locator(`[data-play="${rank}"]`).click();
await palace.locator('[data-chapter="levels"]').waitFor();
for (let step = 0; step < 3; step += 1) await palace.locator('[data-play="level"]').first().click();
await palace.locator('[data-action="replay"]').waitFor();
results.tutorials.push({ game: "Palace/Shed", complete: true });
await palace.close();

for (const game of ["hearts", "spades", "euchre"]) {
  const page = await context.newPage({ viewport: { width: 390, height: 844 } });
  await page.goto(`${base}/${game}-play.html`, { waitUntil: "networkidle" });
  for (let round = 0; round < 2; round += 1) {
    const buttons = page.locator("[data-choice]");
    let advanced = false;
    for (let index = 0; index < await buttons.count(); index += 1) {
      await buttons.nth(index).click();
      if (!(await page.locator("[data-next]").isDisabled())) { advanced = true; break; }
    }
    if (!advanced) fail(`${game}: no correct choice found in round ${round + 1}`);
    await page.locator("[data-next]").click();
  }
  const replay = await page.locator("[data-replay]").count();
  results.tutorials.push({ game, complete: replay === 1 });
  if (replay !== 1) fail(`${game}: tutorial did not complete`);
  await page.close();
}

const naming = await context.newPage();
await naming.goto(`${base}/palace.html?lang=en&game=shed`, { waitUntil: "networkidle" });
await naming.locator("[data-open-settings]").click();
for (let i = 0; i < 9; i += 1) await naming.locator('[data-settings-dialog] [data-name-choice="Shed"]').click();
if (await naming.locator("[data-nsfw-dialog]").evaluate((dialog) => dialog.open)) fail("Traditional-name dialog opened early");
await naming.locator('[data-settings-dialog] [data-name-choice="Shed"]').click();
if (!(await naming.locator("[data-nsfw-dialog]").evaluate((dialog) => dialog.open))) fail("Traditional-name dialog did not open on tenth tap");
await naming.locator('[data-nsfw-dialog] button[value="yes"]').click();
await naming.waitForFunction(() => location.search.includes("game=shithead"));
if ((await naming.locator("[data-current-game]").first().textContent()) !== "Shithead") fail("Traditional mode did not render globally");
await naming.close();

const privacy = await context.newPage();
await privacy.goto(`${base}/index.html?lang=he&game=shed`, { waitUntil: "networkidle" });
results.privacy = await privacy.evaluate(() => ({
  cookies: document.cookie,
  localStorage: localStorage.length,
  sessionStorage: sessionStorage.length,
  external: performance.getEntriesByType("resource").map((entry) => entry.name).filter((url) => new URL(url).origin !== location.origin)
}));
if (results.privacy.cookies || results.privacy.localStorage || results.privacy.sessionStorage || results.privacy.external.length) fail("Zero-storage privacy gate failed");
await privacy.close();

await browser.close();
writeFileSync(resolve(evidence, "app-parity-results.json"), `${JSON.stringify(results, null, 2)}\n`);
if (results.failures.length) {
  console.error(`App-parity verification failed:\n- ${results.failures.join("\n- ")}`);
  process.exit(1);
}
console.log(`App-parity verification passed: ${results.pages.length} pages, ${results.modes.length} locale/name states, ${results.tutorials.length} tutorials, responsive first viewports, power cards, Easter egg, and zero storage.`);
