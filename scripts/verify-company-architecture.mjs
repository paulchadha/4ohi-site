import { createRequire } from "node:module";
import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const require = createRequire(import.meta.url);
const { chromium } = require("playwright");
const base = process.env.SITE_URL || "http://127.0.0.1:4173";
const chrome = process.env.CHROME_PATH || "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const evidence = resolve("docs", "visual-evidence");
mkdirSync(evidence, { recursive: true });

const routes = [
  "index.html", "games.html", "palace.html", "palace-play.html", "palace-story.html", "palace-faq.html",
  "commander-thumb.html", "news.html", "news-commander-thumb-is-coming.html",
  "news-welcome-to-the-thum-system.html", "news-building-commander-thumb.html",
  "news-why-were-building-palace.html", "news-palace-enters-founder-testing.html",
  "about.html", "support.html", "privacy.html", "security.html", "terms.html", "contact.html", "404.html"
];
const matrix = [
  [320, 568], [375, 812], [430, 932], [768, 1024],
  [1024, 768], [1366, 768], [1920, 1080]
];
const keyRoutes = ["index.html", "games.html", "palace-play.html", "commander-thumb.html", "news.html", "about.html"];
const results = { base, checkedAt: new Date().toISOString(), pages: [], viewports: [], interactions: {}, failures: [] };
const fail = (message) => results.failures.push(message);

const browser = await chromium.launch({ headless: true, executablePath: chrome });
const context = await browser.newContext();

for (const route of routes) {
  const page = await context.newPage();
  const errors = [];
  page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
  page.on("pageerror", (error) => errors.push(error.message));
  const response = await page.goto(`${base}/${route}`, { waitUntil: "networkidle" });
  for (const image of await page.locator("img").all()) await image.scrollIntoViewIfNeeded();
  await page.waitForTimeout(100);
  const data = await page.evaluate(() => ({
    title: document.title,
    h1Count: document.querySelectorAll("h1").length,
    skip: Boolean(document.querySelector('.skip-link[href="#main"]')),
    main: Boolean(document.querySelector("main#main")),
    nav: [...document.querySelectorAll("#primary-navigation > a, #primary-navigation > details > summary")].map((node) => node.textContent.trim()),
    gameLinks: [...document.querySelectorAll(".games-menu-panel > a")].map((node) => node.textContent.trim()),
    tableSelector: document.querySelectorAll("[data-palace-context]").length,
    externalScripts: [...document.scripts].filter((script) => script.src && new URL(script.src).origin !== location.origin).map((script) => script.src),
    tracking: [...document.scripts].some((script) => /analytics|gtag|pixel|segment|hotjar/i.test(script.src || script.textContent)),
    imagesBroken: [...document.images].filter((image) => !image.complete || image.naturalWidth === 0).map((image) => image.src),
    overflow: document.documentElement.scrollWidth > innerWidth + 1
  }));
  results.pages.push({ route, status: response?.status(), ...data, errors });
  if (response?.status() !== 200 || data.h1Count !== 1 || !data.skip || !data.main || data.overflow || data.imagesBroken.length || errors.length) fail(`${route}: route, structure, image, overflow, or runtime failure`);
  if (data.nav.join("|") !== "Home|Games|News|About 4OH|Support") fail(`${route}: company navigation hierarchy is incorrect`);
  if (!data.gameLinks.some((item) => item.startsWith("Palace")) || !data.gameLinks.some((item) => item.startsWith("Commander ThumB")) || !data.gameLinks.includes("View All Games")) fail(`${route}: Games menu is incomplete`);
  if (data.tableSelector !== (["index.html", "palace-play.html"].includes(route) ? 1 : 0)) fail(`${route}: Palace table selector scope is incorrect`);
  if (data.externalScripts.length || data.tracking) fail(`${route}: external script or tracking detected`);
  await page.close();
}

for (const route of keyRoutes) {
  for (const [width, height] of matrix) {
    const page = await context.newPage();
    await page.setViewportSize({ width, height });
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto(`${base}/${route}`, { waitUntil: "networkidle" });
    const state = await page.evaluate(() => ({
      overflow: document.documentElement.scrollWidth > innerWidth + 1,
      bodyWidth: document.body.getBoundingClientRect().width,
      viewport: innerWidth,
      tinyTargets: [...document.querySelectorAll("button, summary, .button")].filter((node) => {
        const rect = node.getBoundingClientRect();
        return rect.width > 0 && rect.height > 0 && (rect.width < 40 || rect.height < 40);
      }).map((node) => `${node.tagName}:${node.textContent.trim().slice(0, 30)}`),
      heroVisible: Boolean(document.querySelector("h1")?.getBoundingClientRect().height)
    }));
    results.viewports.push({ route, width, height, ...state, errors });
    if (state.overflow || !state.heroVisible || errors.length) fail(`${route} at ${width}x${height}: responsive runtime failed`);
    if (width <= 430 && state.tinyTargets.length) fail(`${route} at ${width}x${height}: undersized targets ${state.tinyTargets.join(", ")}`);
    if ([320, 430, 768, 1366].includes(width) && ["index.html", "commander-thumb.html", "games.html", "palace-play.html"].includes(route)) {
      await page.screenshot({ path: resolve(evidence, `company-${route.replace(".html", "")}-${width}x${height}.png`), fullPage: true });
    }
    await page.close();
  }
}

const mobile = await context.newPage();
await mobile.setViewportSize({ width: 320, height: 568 });
await mobile.goto(`${base}/index.html`, { waitUntil: "networkidle" });
await mobile.locator(".menu-toggle").click();
await mobile.locator(".games-menu > summary").click();
results.interactions.mobile = {
  menuExpanded: await mobile.locator(".menu-toggle").getAttribute("aria-expanded"),
  gamesOpen: await mobile.locator(".games-menu").getAttribute("open"),
  commanderVisible: await mobile.locator('.games-menu-panel a[href^="commander-thumb.html"]').isVisible()
};
if (results.interactions.mobile.menuExpanded !== "true" || results.interactions.mobile.gamesOpen === null || !results.interactions.mobile.commanderVisible) fail("Mobile company/Games navigation failed");
await mobile.keyboard.press("Escape");
if (await mobile.locator(".games-menu").getAttribute("open") !== null) fail("Games menu did not close on Escape");
await mobile.close();

const palace = await context.newPage();
await palace.goto(`${base}/palace-play.html`, { waitUntil: "networkidle" });
await palace.locator(".palace-table-tools details > summary").click();
await palace.locator('[data-name-choice="Shed"]').first().click();
const palaceState = await palace.evaluate(() => ({
  label: document.querySelector("[data-current-game]")?.textContent.trim(),
  url: location.search,
  commanderLink: document.querySelector('.games-menu-panel a[href^="commander-thumb"]')?.getAttribute("href")
}));
results.interactions.palaceSelector = palaceState;
if (palaceState.label !== "Shed" || !palaceState.url.includes("game=shed") || palaceState.commanderLink?.includes("game=")) fail("Palace table selector changed the wrong scope or failed to update");
await palace.close();

const commander = await context.newPage();
await commander.goto(`${base}/commander-thumb.html?game=shed`, { waitUntil: "networkidle" });
const commanderState = await commander.evaluate(() => {
  const text = document.body.innerText;
  return {
    title: document.title,
    h1: [...document.querySelectorAll("h1")].map((node) => node.textContent.replace(/\s+/g, " ").trim()),
    status: /Coming Soon/i.test(text),
    wrong: text.includes("Commander Thum" + String.fromCharCode(98)) || text.includes("Commander " + "TH" + "UMB") || text.includes("COMMANDER " + "TH" + "UMB"),
    newsLinks: document.querySelectorAll('.retro-news-grid a[href^="news-"]').length,
    planetDiagram: Boolean(document.querySelector(".ct-system-map"))
  };
});
results.interactions.commander = commanderState;
if (commanderState.title !== "Commander ThumB | Four of Hearts Interactive" || commanderState.h1.length !== 1 || commanderState.h1[0] !== "Commander ThumB" || !commanderState.status || commanderState.wrong || commanderState.newsLinks !== 3 || commanderState.planetDiagram) fail("Commander ThumB identity, status, title, News, or story treatment failed");
await commander.close();

const news = await context.newPage();
await news.goto(`${base}/news.html?tag=commander`, { waitUntil: "networkidle" });
const newsState = await news.evaluate(() => ({
  selected: document.querySelector('[data-news-filter][aria-pressed="true"]')?.dataset.newsFilter,
  visible: [...document.querySelectorAll("[data-news-tags]")].filter((node) => !node.hidden).length,
  allCommander: [...document.querySelectorAll("[data-news-tags]")].filter((node) => !node.hidden).every((node) => node.dataset.newsTags.includes("commander"))
}));
results.interactions.news = newsState;
if (newsState.selected !== "commander" || newsState.visible !== 3 || !newsState.allCommander) fail("Commander ThumB News filter failed");
await news.close();

const tutorial = await context.newPage();
await tutorial.goto(`${base}/palace-play.html`, { waitUntil: "networkidle" });
await tutorial.locator('[data-play="low"]').click();
const recoverable = /below six/i.test(await tutorial.locator("[data-match-status]").textContent());
await tutorial.locator('[data-play="match"]').click();
await tutorial.waitForSelector('[data-chapter="burn"]');
await tutorial.locator('[data-play="burn"]').click();
await tutorial.waitForSelector('[data-chapter="pickup"]');
await tutorial.locator('[data-action="pickup"]').click();
await tutorial.waitForSelector('[data-chapter="powers"]');
for (const power of ["2", "7", "8", "10"]) await tutorial.locator(`[data-play="${power}"]`).click();
await tutorial.waitForSelector('[data-chapter="levels"]');
for (let layer = 0; layer < 3; layer += 1) {
  await tutorial.locator('[data-play="level"]').first().click();
  await tutorial.waitForTimeout(450);
}
const palaceFinish = await tutorial.locator("#palace-tutorial h2").textContent();
results.interactions.palaceTutorial = { recoverable, finish: palaceFinish };
if (!recoverable || !/YOU RULE/i.test(palaceFinish || "")) fail("Palace five-scene tutorial failed");
await tutorial.close();

results.interactions.secondaryTutorials = [];
for (const game of ["hearts", "spades", "euchre"]) {
  const lesson = await context.newPage();
  await lesson.goto(`${base}/${game}-play.html`, { waitUntil: "networkidle" });
  for (let round = 0; round < 2; round += 1) {
    await lesson.locator("[data-choice]").first().click();
    await lesson.locator("[data-next]").click();
  }
  const finish = await lesson.locator("[data-secondary-tutorial] h2").textContent();
  results.interactions.secondaryTutorials.push({ game, finish });
  if (finish !== "Nice play.") fail(`${game} two-step tutorial failed`);
  await lesson.close();
}
for (const localeCase of [{ lang: "he", dir: "rtl" }, { lang: "en-CA-fun", dir: "ltr" }]) {
  const localized = await context.newPage();
  await localized.setViewportSize({ width: 375, height: 812 });
  await localized.goto(`${base}/commander-thumb.html?lang=${localeCase.lang}&game=shed`, { waitUntil: "networkidle" });
  const state = await localized.evaluate(() => ({
    lang: document.documentElement.lang,
    dir: document.documentElement.dir,
    title: document.title,
    overflow: document.documentElement.scrollWidth > innerWidth + 1,
    gameQuery: new URL(location.href).searchParams.has("game"),
    selected: document.querySelector("[data-locale]")?.value
  }));
  results.interactions[`locale-${localeCase.lang}`] = state;
  if (state.lang !== localeCase.lang || state.dir !== localeCase.dir || state.title !== "Commander ThumB | Four of Hearts Interactive" || state.overflow || state.gameQuery || state.selected !== localeCase.lang) fail(`${localeCase.lang}: language control layout or game-state isolation failed`);
  await localized.close();
}
const privacy = await context.newPage();
await privacy.goto(`${base}/index.html`, { waitUntil: "networkidle" });
results.interactions.privacy = await privacy.evaluate(() => ({
  cookies: document.cookie,
  local: localStorage.length,
  session: sessionStorage.length
}));
if (results.interactions.privacy.cookies || results.interactions.privacy.local || results.interactions.privacy.session) fail("Cookie or browser storage detected");
await privacy.close();

await browser.close();
writeFileSync(resolve(evidence, "company-architecture-results.json"), `${JSON.stringify(results, null, 2)}\n`, "utf8");
if (results.failures.length) {
  console.error(results.failures.join("\n"));
  process.exit(1);
}
console.log(`Company architecture browser QA passed: ${routes.length} routes, ${matrix.length} viewports, responsive/keyboard/news/Palace scope/privacy gates.`);
