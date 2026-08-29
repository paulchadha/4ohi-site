import { createRequire } from "node:module";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const require = createRequire(import.meta.url);
const { chromium } = require("playwright");
const base = (process.env.SITE_URL || "http://127.0.0.1:4173").replace(/\/$/, "");
const chrome = process.env.CHROME_PATH || "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const evidence = resolve("docs", "visual-evidence", "thumb-command");
const writeEvidence = process.env.WRITE_EVIDENCE !== "0";
mkdirSync(evidence, { recursive: true });


const regularRoutes = [
  "index.html", "games.html", "palace.html", "palace-play.html", "palace-story.html", "palace-faq.html",
  "games/thumb-command/", "thumb-command.html", "bobby-the-breadasaurus.html", "evil-doom-adventures.html", "news.html",
  "news-thumb-command-save-planet-earth.html", "news-the-city-is-the-base.html", "news-meet-the-blueguard.html",
  "news-designing-the-alien-invasion.html", "news-thumb-command-world-tour.html",
  "hearts-play.html", "spades-play.html", "euchre-play.html", "about.html", "support.html",
  "privacy.html", "security.html", "terms.html", "contact.html", "404.html"
];
const redirects = new Map([
  ["games/commander-thum-b/", "games/thumb-command/"],
  ["commander-thumb.html", "games/thumb-command/"],
  ["news-commander-thumb-is-coming.html", "news-thumb-command-save-planet-earth.html"],
  ["news-welcome-to-the-thum-system.html", "news-the-city-is-the-base.html"],
  ["news-building-commander-thumb.html", "news-meet-the-blueguard.html"]
]);
const viewports = [[320, 568], [390, 844], [768, 1024], [1366, 768], [1920, 1080]];
const responsiveRoutes = ["index.html", "games.html", "games/thumb-command/", "news.html", "news-thumb-command-save-planet-earth.html"];
const failures = [];
const results = { checkedAt: new Date().toISOString(), base, routes: [], responsive: [], interactions: {}, redirects: [], failures };
const fail = (message) => failures.push(message);
const retired = /Commander\s+(?:Thum|Thumb)|\bThum[-‑ ]B\b|Thum System/i;
const expectedGames = ["Palace", "Bobby the Breadasaurus", "Evil Doom Girl Adventures", "Thumb Command", "Hearts", "Spades", "Euchre"];

const browser = await chromium.launch({ headless: true, executablePath: chrome });
const context = await browser.newContext();
const settleImages = async (page) => {
  await page.evaluate(async () => {
    document.querySelectorAll("img[loading='lazy']").forEach((image) => { image.loading = "eager"; });
    await Promise.all([...document.images].map((image) => {
      if (image.complete) return Promise.resolve();
      return new Promise((resolve) => {
        image.addEventListener("load", resolve, { once: true });
        image.addEventListener("error", resolve, { once: true });
      });
    }));
  });
};

for (const route of regularRoutes) {
  const page = await context.newPage();
  const errors = [];
  page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
  page.on("pageerror", (error) => errors.push(error.message));
  const response = await page.goto(`${base}/${route}`, { waitUntil: "networkidle" });
  await settleImages(page);
  const state = await page.evaluate(() => ({
    h1: document.querySelectorAll("h1").length,
    main: Boolean(document.querySelector("main#main")),
    skip: Boolean(document.querySelector('.skip-link[href="#main"]')),
    nav: [...document.querySelectorAll("#primary-navigation > a, #primary-navigation > details > summary")].map((node) => node.textContent.trim()),
    gameLinks: [...document.querySelectorAll(".games-menu-panel > a")].map((node) => node.textContent.trim()),
    brokenImages: [...document.images].filter((image) => image.currentSrc && (!image.complete || image.naturalWidth === 0)).map((image) => image.currentSrc),
    overflow: Math.max(0, document.documentElement.scrollWidth - document.documentElement.clientWidth),
    title: document.title,
    text: document.body.innerText,
    metadata: Boolean(document.querySelector('link[rel="canonical"]')) && Boolean(document.querySelector('meta[property="og:image"]')),
    tracking: [...document.scripts].some((script) => /analytics|gtag|pixel|segment|hotjar/i.test(script.src || script.textContent)),
    storage: document.cookie || localStorage.length || sessionStorage.length
  }));
  results.routes.push({ route, status: response?.status(), ...state, text: undefined, errors });
  if (response?.status() !== 200 || state.h1 !== 1 || !state.main || !state.metadata || state.brokenImages.length || state.overflow > 1 || errors.length) fail(`${route}: route, metadata, image, overflow, or runtime failure`);
  if (route !== "404.html" && (!state.skip || state.nav.join("|") !== "Games|News|About|Play Palace")) fail(`${route}: company navigation or skip link is incomplete`);
  if (route !== "404.html" && !expectedGames.every((title) => state.gameLinks.some((item) => item.startsWith(title)))) fail(`${route}: Games navigation is incomplete`);
  if (retired.test(state.title) || retired.test(state.text)) fail(`${route}: retired public branding remains visible`);
  if (state.tracking || state.storage) fail(`${route}: tracking or persisted browser state detected`);
  await page.close();
}

for (const route of responsiveRoutes) {
  for (const [width, height] of viewports) {
    const page = await context.newPage();
    await page.setViewportSize({ width, height });
    const errors = [];
    page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto(`${base}/${route}`, { waitUntil: "networkidle" });
    await settleImages(page);
    const state = await page.evaluate(() => ({
      overflow: Math.max(0, document.documentElement.scrollWidth - document.documentElement.clientWidth),
      h1Visible: Boolean(document.querySelector("h1")?.getBoundingClientRect().height),
      tinyTargets: [...document.querySelectorAll("a,button,summary,select")].filter((node) => {
        const rect = node.getBoundingClientRect();
        const style = getComputedStyle(node);
        return style.visibility !== "hidden" && style.display !== "none" && rect.width > 0 && rect.height > 0 && (rect.width < 40 || rect.height < 40);
      }).slice(0, 8).map((node) => node.textContent.trim() || node.getAttribute("aria-label"))
    }));
    results.responsive.push({ route, width, height, ...state, errors });
    if (state.overflow > 1 || !state.h1Visible || errors.length) fail(`${route} at ${width}x${height}: responsive runtime failure`);
    if (width <= 390 && state.tinyTargets.length) fail(`${route} at ${width}x${height}: undersized targets ${state.tinyTargets.join(", ")}`);
    if (writeEvidence && [390, 768, 1366].includes(width)) await page.screenshot({ path: resolve(evidence, `${route.replace(".html", "").replaceAll("/", "-")}-${width}x${height}.png`), fullPage: true });

    await page.close();
  }
}

const thumb = await context.newPage();
await thumb.setViewportSize({ width: 1440, height: 900 });
await thumb.goto(`${base}/games/thumb-command/`, { waitUntil: "networkidle" });
results.interactions.thumbCommand = await thumb.evaluate(() => ({
  h1: document.querySelector("h1")?.textContent.replace(/\s+/g, " ").trim(),
  tagline: document.querySelector(".tc-tagline")?.textContent.trim(),
  cityNames: [...document.querySelectorAll(".tc-city-card h3")].map((node) => node.textContent.trim()),
  galleryItems: document.querySelectorAll(".tc-gallery-grid a").length,
  blueguard: document.body.innerText.includes("Blueguard"),
  mothership: document.body.innerText.toLowerCase().includes("mothership"),
  appIcon: document.querySelector(".tc-app-icon")?.getAttribute("src"),
  hero: document.querySelector(".tc-hero-art img")?.currentSrc,
  sections: ["mission", "gameplay", "blueguard", "aliens", "cities", "defense", "gallery"].every((id) => document.getElementById(id)),
  jsonLd: Boolean(document.querySelector('script[type="application/ld+json"]'))

}));
const tc = results.interactions.thumbCommand;
if (tc.h1 !== "Thumb Command" || tc.tagline !== "Save Planet Earth" || tc.cityNames.join("|") !== "Chicago|San Francisco|New York City|London|Tokyo" || tc.galleryItems < 6 || !tc.blueguard || !tc.mothership || !tc.appIcon || !tc.hero || !tc.sections || !tc.jsonLd) fail("Thumb Command landing-page acceptance failed");

await thumb.keyboard.press("Tab");
results.interactions.firstFocus = await thumb.evaluate(() => ({ className: document.activeElement?.className, outline: getComputedStyle(document.activeElement).outlineWidth }));
if (!String(results.interactions.firstFocus.className).includes("skip-link") || results.interactions.firstFocus.outline === "0px") fail("Keyboard skip-link focus is not visible");
await thumb.close();

const home = await context.newPage();
await home.setViewportSize({ width: 390, height: 844 });
await home.goto(`${base}/index.html`, { waitUntil: "networkidle" });
await home.locator(".menu-toggle").click();
await home.locator(".games-menu > summary").click();
await home.locator('.games-menu-panel a[href*="games/thumb-command/"]').waitFor({ state: "visible" });
results.interactions.home = {
  portfolioVisible: await home.locator(".portfolio-link.thumb-command").isVisible(),
  campaignVisible: await home.locator(".palace-campaign-hero").isVisible(),
  menuLinkVisible: await home.locator('.games-menu-panel a[href*="games/thumb-command/"]').isVisible(),
  menuExpanded: await home.locator(".menu-toggle").getAttribute("aria-expanded")
};
if (!results.interactions.home.portfolioVisible || !results.interactions.home.campaignVisible || !results.interactions.home.menuLinkVisible || results.interactions.home.menuExpanded !== "true") fail("Homepage tile, feature, or mobile navigation failed");

await home.close();

const news = await context.newPage();
await news.goto(`${base}/news.html?tag=thumb-command`, { waitUntil: "networkidle" });
results.interactions.news = await news.evaluate(() => ({
  selected: document.querySelector('[data-news-filter][aria-pressed="true"]')?.dataset.newsFilter,
  visible: [...document.querySelectorAll("[data-news-tags]")].filter((node) => !node.hidden).length,
  titles: [...document.querySelectorAll("[data-news-tags]")].filter((node) => !node.hidden).map((node) => node.querySelector("h2")?.textContent.trim())
}));
if (results.interactions.news.selected !== "thumb-command" || results.interactions.news.visible !== 5) fail("Thumb Command news filter did not expose exactly five new articles");
await news.close();

const reduced = await browser.newContext({ reducedMotion: "reduce" });
const reducedPage = await reduced.newPage();
await reducedPage.goto(`${base}/games/thumb-command/`, { waitUntil: "networkidle" });
results.interactions.reducedMotion = await reducedPage.locator(".tc-stars").evaluate((node) => getComputedStyle(node).animationName);
if (results.interactions.reducedMotion !== "none") fail("Reduced-motion preference did not disable star movement");
await reduced.close();

for (const [from, to] of redirects) {
  const raw = await context.request.get(`${base}/${from}`, { headers: { "Cache-Control": "no-cache" } });
  const body = await raw.text();
  const page = await context.newPage();
  await page.goto(`${base}/${from}?source=legacy#mission`, { waitUntil: "networkidle" });
  const finalUrl = page.url();
  results.redirects.push({ from, to, status: raw.status(), canonical: body.includes(`https://4ohi.com/${to}`), finalUrl });
  const directoryAlias = from.endsWith("/");
  const finalMatches = directoryAlias ? finalUrl.includes(`/${to}`) : finalUrl.includes(`/${to}?source=legacy#mission`);
  const markerMatches = directoryAlias || body.includes(`data-route-target="${to}"`);
  if (raw.status() !== 200 || !markerMatches || !body.includes(`https://4ohi.com/${to}`) || !finalMatches) fail(`${from}: compatibility redirect failed`);

  await page.close();
}

await browser.close();
if (writeEvidence) writeFileSync(resolve(evidence, "acceptance-results.json"), `${JSON.stringify(results, null, 2)}\n`);
if (!existsSync(resolve("docs", "source-assets", "thumb-command", "thumb-command-approved-app-icon.png"))) fail("Approved source-art preservation gate failed");
if (failures.length) {
  console.error(`Company architecture QA failed with ${failures.length} issue(s):`);
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}
console.log(`Company architecture QA passed: ${regularRoutes.length} routes, ${responsiveRoutes.length * viewports.length} responsive renders, five Thumb Command articles, global navigation, reduced motion, and five compatibility redirects.`);

