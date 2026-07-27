import { createRequire } from "node:module";
import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const require = createRequire(import.meta.url);
const { chromium } = require("playwright");
const base = process.env.SITE_URL || "http://127.0.0.1:4173";
const chrome = process.env.CHROME_PATH || "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const capture = process.env.NO_SCREENSHOTS !== "1";
const evidence = resolve("docs", "visual-evidence");
const resultFile = process.env.SITE_RESULTS || "commander-thumb-results.json";
const results = { base, checkedAt: new Date().toISOString(), commander: [], integrations: {}, palace: {}, failures: [] };
const fail = (message) => results.failures.push(message);
mkdirSync(evidence, { recursive: true });

const browser = await chromium.launch({ headless: true, executablePath: chrome });
const context = await browser.newContext();
const viewports = [
  [320, 568], [375, 812], [430, 932], [768, 1024],
  [1024, 768], [1366, 768], [1920, 1080]
];

for (const [width, height] of viewports) {
  const page = await context.newPage();
  await page.setViewportSize({ width, height });
  const errors = [];
  page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
  page.on("pageerror", (error) => errors.push(error.message));
  const response = await page.goto(`${base}/commander-thumb.html`, { waitUntil: "networkidle" });
  for (const image of await page.locator("main img").all()) await image.scrollIntoViewIfNeeded();
  await page.waitForTimeout(200);
  const state = await page.evaluate(() => {
    const links = [...document.querySelectorAll('main a[href^="#"]')];
    const imageFailures = [...document.images].filter((image) => !image.complete || image.naturalWidth === 0).map((image) => image.getAttribute("src"));
    const text = document.querySelector("main")?.textContent || "";
    return {
      statusTitle: document.title,
      h1: document.querySelector("h1")?.textContent.trim(),
      active: document.querySelector('.site-nav a[aria-current="page"]')?.textContent.trim(),
      navLink: document.querySelector('.site-nav a[href^="commander-thumb.html"]')?.textContent.trim(),
      overflow: document.documentElement.scrollWidth > innerWidth + 1,
      minButton: Math.min(...[...document.querySelectorAll(".ct-button")].map((button) => button.getBoundingClientRect().height)),
      planets: [...document.querySelectorAll(".ct-planet b")].map((node) => node.textContent.trim()),
      bosses: [...document.querySelectorAll(".ct-boss-card b")].map((node) => node.textContent.trim()),
      exactTitleCount: (text.match(/Commander ThumB/g) || []).length,
      wrongSpellings: [...text.matchAll(/\b(?:Commander Thumb|Commander THUMB|Thumb [ABC]|Planet [ABC])\b/g)].map((match) => match[0]),
      anchorFailures: links.map((link) => link.getAttribute("href")).filter((href) => !document.querySelector(href)),
      imageFailures,
      mapLabel: document.querySelector(".ct-system-map")?.getAttribute("aria-label"),
      comingSoon: document.querySelector(".ct-status")?.textContent.trim() === "Coming Soon",
      lore: {
        star: text.includes("star named Thum"),
        invades: text.includes("Thum A") && text.includes("Invades"),
        defends: text.includes("Thum B") && text.includes("Defends"),
        observes: text.includes("Thum C") && text.includes("Observes"),
        levels: text.includes("1,000 levels"),
        cadence: text.includes("every 100 levels")
      }
    };
  });
  results.commander.push({ width, height, status: response?.status(), ...state, errors });
  if (response?.status() !== 200 || state.statusTitle !== "Commander ThumB | Four of Hearts Interactive" || state.h1 !== "Commander ThumB" || state.active !== "Commander ThumB" || state.navLink !== "Commander ThumB") fail(`${width}x${height}: route, title, or navigation failed`);
  if (state.overflow || state.minButton < 44 || state.planets.join(",") !== "Thum A,Thum B,Thum C" || state.bosses.length !== 10 || state.bosses[0] !== "Level 100" || state.bosses[9] !== "Level 1000") fail(`${width}x${height}: responsive content geometry failed`);
  if (!state.exactTitleCount || state.wrongSpellings.length || state.anchorFailures.length || state.imageFailures.length || !state.mapLabel?.includes("central star Thum") || !state.comingSoon || Object.values(state.lore).some((value) => !value) || errors.length) fail(`${width}x${height}: spelling, lore, assets, anchors, or runtime failed`);
  if (capture && [320, 430, 768, 1366].includes(width)) {
    await page.locator(".ct-hero").screenshot({ path: resolve(evidence, `commander-thumb-hero-${width}x${height}.png`) });
  }
  await page.close();
}

for (const file of ["index.html", "games.html", "play.html"]) {
  const page = await context.newPage();
  await page.goto(`${base}/${file}`, { waitUntil: "networkidle" });
  const tile = await page.locator('main a[href^="commander-thumb.html"]').count();
  const title = await page.locator("main").textContent();
  results.integrations[file] = { tile, title: title.includes("Commander ThumB") };
  if (!tile || !title.includes("Commander ThumB")) fail(`${file}: Commander ThumB integration missing`);
  await page.close();
}

const mobile = await context.newPage();
await mobile.setViewportSize({ width: 375, height: 812 });
await mobile.goto(`${base}/commander-thumb.html`, { waitUntil: "networkidle" });
await mobile.locator(".menu-toggle").focus();
await mobile.keyboard.press("Enter");
const mobileNav = await mobile.evaluate(() => {
  const menu = document.querySelector(".site-nav");
  const link = document.querySelector('.site-nav a[href^="commander-thumb.html"]');
  return {
    expanded: document.querySelector(".menu-toggle")?.getAttribute("aria-expanded"),
    open: menu?.dataset.open,
    displayed: link ? getComputedStyle(link).display !== "none" && link.getBoundingClientRect().height >= 44 : false
  };
});
results.integrations.mobileNavigation = mobileNav;
if (mobileNav.expanded !== "true" || mobileNav.open !== "true" || !mobileNav.displayed) fail("Mobile keyboard navigation does not expose Commander ThumB");
await mobile.close();

const reduced = await context.newPage();
await reduced.emulateMedia({ reducedMotion: "reduce" });
await reduced.goto(`${base}/commander-thumb.html`, { waitUntil: "networkidle" });
const reducedTransition = await reduced.locator(".ct-button").first().evaluate((node) => getComputedStyle(node).transitionDuration);
results.integrations.reducedMotion = reducedTransition;
if (parseFloat(reducedTransition) > 0.0001) fail("Reduced-motion preference is not respected");
await reduced.close();

const palace = await context.newPage();
await palace.setViewportSize({ width: 375, height: 812 });
await palace.goto(`${base}/palace-play.html`, { waitUntil: "networkidle" });
await palace.locator(".mini-match-chrome").waitFor();
results.palace = await palace.evaluate(() => {
  const alpha = (value) => {
    const match = value.match(/rgba?\(([^)]+)\)/);
    if (!match) return 1;
    const channels = match[1].split(",").map(Number);
    return channels.length === 4 ? channels[3] : 1;
  };
  const stage = getComputedStyle(document.querySelector(".tutorial-stage"));
  const table = getComputedStyle(document.querySelector(".palace-app-table"));
  const feedback = getComputedStyle(document.querySelector(".mini-match-chrome > footer"));
  return {
    overflow: document.documentElement.scrollWidth > innerWidth + 1,
    stageBackground: stage.backgroundColor,
    stageAlpha: alpha(stage.backgroundColor),
    tableBackground: table.backgroundColor,
    tableAlpha: alpha(table.backgroundColor),
    feedbackBackground: feedback.backgroundColor,
    feedbackColor: feedback.color,
    feedbackAlpha: alpha(feedback.backgroundColor),
    focusRule: getComputedStyle(document.querySelector(".tutorial-stage")).outlineStyle
  };
});
if (results.palace.overflow || results.palace.stageAlpha < .95 || results.palace.tableAlpha < .95 || results.palace.feedbackAlpha < .95) fail("Play Palace still uses unreadable translucent primary surfaces or overflows mobile");
if (capture) await palace.screenshot({ path: resolve(evidence, "palace-readability-375x812.png"), fullPage: false });
await palace.close();

await browser.close();
writeFileSync(resolve(evidence, resultFile), `${JSON.stringify(results, null, 2)}\n`);
if (results.failures.length) {
  console.error(`Commander ThumB verification failed with ${results.failures.length} issue(s):`);
  for (const failure of results.failures) console.error(`- ${failure}`);
  process.exit(1);
}
console.log(`Commander ThumB verification passed at ${viewports.length} viewports, with navigation, lore, artwork, anchors, reduced motion, and Palace readability verified.`);
