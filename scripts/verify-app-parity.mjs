import { createRequire } from "node:module";
import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const require = createRequire(import.meta.url);
const { chromium } = require("playwright");
const base = process.env.SITE_URL || "http://127.0.0.1:4173";
const chrome = process.env.CHROME_PATH || "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const evidence = resolve("docs", "visual-evidence");
const resultFile = process.env.SITE_RESULTS || "app-parity-results.json";
const captureScreenshots = process.env.NO_SCREENSHOTS !== "1";
mkdirSync(evidence, { recursive: true });
const results = { base, checkedAt: new Date().toISOString(), pages: [], modes: [], layouts: {}, tutorials: [], founderReview: {}, keyboard: {}, privacy: {}, failures: [] };
const fail = (message) => results.failures.push(message);
const browser = await chromium.launch({ headless: true, executablePath: chrome });
const context = await browser.newContext();

const pages = [
  "index.html", "palace.html", "palace-play.html", "palace-story.html", "palace-faq.html", "commander-thumb.html",
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
    alternates: document.querySelectorAll('link[rel="alternate"][hreflang]').length,
    fingerprintedAssets: [...document.querySelectorAll('script[src], link[rel="stylesheet"]')].every((node) => new URL(node.src || node.href).searchParams.has("v"))
  }));
  results.pages.push({ file, status: response?.status(), ...data, errors });
  if (response?.status() !== 200 || data.h1 !== 1 || data.overflow || !data.nameControl || !data.languageControl || !data.settings || data.externalScripts.length || data.alternates !== 9 || !data.fingerprintedAssets || errors.length) fail(`${file}: public page gate failed`);
  await page.close();
}

// Founder page-by-page acceptance gates.
const canonical = await context.newPage();
await canonical.setViewportSize({ width: 1440, height: 900 });
await canonical.goto(`${base}/index.html?lang=en`, { waitUntil: "networkidle" });
const canonicalState = await canonical.evaluate(() => {
  const rectangles = [...document.querySelectorAll(".power-playing-card")].map((card) => card.getBoundingClientRect());
  const overlap = rectangles.some((a, i) => rectangles.some((b, j) => j > i && a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top));
  const rule = document.querySelector(".power-live")?.getBoundingClientRect();
  const ruleCoversCard = rule ? rectangles.some((card) => card.left < rule.right && card.right > rule.left && card.top < rule.bottom && card.bottom > rule.top) : true;
  return { logo: document.querySelector(".brand")?.getAttribute("href"), countdowns: document.querySelectorAll("[data-release-strip], [data-launch-countdown]").length, transmission: document.querySelector(".transmission-link")?.textContent.trim(), powerRanks: [...document.querySelectorAll("[data-power]")].map((node) => node.dataset.power), overlap, ruleCoversCard };
});
await canonical.goto(`${base}/palace.html?lang=en&game=shed#rules`, { waitUntil: "networkidle" });
const legacyFinal = await canonical.evaluate(() => ({ path: location.pathname, search: location.search, hash: location.hash }));
results.founderReview.canonical = { canonicalState, legacyFinal };
if (!canonicalState.logo.startsWith("index.html") || canonicalState.countdowns !== 1 || !canonicalState.transmission?.includes("Transmission 001") || canonicalState.powerRanks.join(",") !== "2,7,8,10" || canonicalState.overlap || canonicalState.ruleCoversCard) fail("Canonical homepage, countdown, Transmission, or Power Cards gate failed");
if (!legacyFinal.path.endsWith("/index.html") || !legacyFinal.search.includes("lang=en") || !legacyFinal.search.includes("game=shed") || legacyFinal.hash !== "#rules") fail("Legacy Palace route did not preserve URL state while canonicalizing home");
await canonical.close();

const editorial = await context.newPage();
await editorial.goto(`${base}/news.html`, { waitUntil: "networkidle" });
const dates = await editorial.locator("time[datetime]").evaluateAll((nodes) => nodes.map((node) => node.dateTime));
await editorial.goto(`${base}/games.html`, { waitUntil: "networkidle" });
const futureBackground = await editorial.locator(".future-card").evaluate((node) => getComputedStyle(node).backgroundImage);
await editorial.goto(`${base}/about.html`, { waitUntil: "networkidle" });
const founderCopy = await editorial.locator("main").innerText();
results.founderReview.editorial = { dates, futureBackground, rejectedFounderHeadline: founderCopy.includes("very long field study"), aboutBeats: await editorial.locator(".about-beat").count() };
if (new Set(dates).size !== dates.length || dates.some((date, index) => index && date > dates[index - 1])) fail("News dates are not distinct and descending");
if (!futureBackground.includes("gradient")) fail("Future-games presentation remains generic gray");
if (founderCopy.includes("very long field study") || !founderCopy.includes("rules meet people") || await editorial.locator(".about-beat").count() !== 5) fail("About/founder reconstruction gate failed");
await editorial.close();
for (const [locale, mode, expected, dir] of [
  ["en", "palace", "Palace", "ltr"], ["en", "shed", "Shed", "ltr"],
  ["fr", "shed", "Shed", "ltr"], ["es", "palace", "Palace", "ltr"],
  ["hi", "shed", "Shed", "ltr"], ["zh-Hans", "palace", "Palace", "ltr"],
  ["he", "shed", "Shed", "rtl"], ["ar", "palace", "Palace", "rtl"],
  ["en-CA-fun", "shed", "Shed", "ltr"]
]) {
  const page = await context.newPage();
  await page.setViewportSize({ width: 1366, height: 768 });
  await page.goto(`${base}/news.html?lang=${encodeURIComponent(locale)}&game=${mode}`, { waitUntil: "networkidle" });
  const state = await page.evaluate((currentMode) => ({
    lang: document.documentElement.lang,
    dir: document.documentElement.dir,
    name: document.querySelector("[data-current-game]")?.textContent.trim(),
    navName: document.querySelector('.site-nav a[href*="index.html"]')?.textContent.trim(),
    playLabel: document.querySelector(".nav-play")?.textContent.trim(),
    newsLabel: document.querySelector("h1")?.textContent.trim(),
    localeLabel: document.querySelector("select[data-locale]")?.selectedOptions?.[0]?.textContent.trim(),
    navNews: document.querySelector('[data-brand-message="navNews"]')?.textContent.trim(),
    artMode: document.querySelector("img[data-game-art]")?.dataset.gameArt || "",
    artSrc: document.querySelector("img[data-game-art]")?.currentSrc || "",
    linksPreserve: [...document.querySelectorAll(".site-nav a")].every((a) => a.search.includes("lang=") && (currentMode === "palace" ? !a.search.includes("game=") : a.search.includes(`game=${currentMode}`)))
  }), mode);
  results.modes.push({ locale, mode, ...state });
  if (state.lang !== locale || state.dir !== dir || state.name !== expected || state.navName !== expected || !state.playLabel.includes(expected) || !state.newsLabel.includes(expected) || !state.linksPreserve) fail(`${locale}/${mode}: naming or locale gate failed`);
  if (locale === "en-CA-fun" && (state.localeLabel !== "Canadian" || state.navNews !== "Table Talk")) fail("Canadian locale label or navigation voice failed");
  if (state.artMode && state.artMode !== mode) fail(`${locale}/${mode}: dynamic artwork mode failed`);
  await page.close();
}

for (const [file, width, height, shot] of [
  ["index.html", 1440, 900, "app-home-1440x900.png"],
  ["index.html", 320, 568, "app-home-320x568.png"],
  ["index.html", 360, 800, "app-home-360x800.png"],
  ["index.html", 390, 844, "app-home-390x844.png"],
  ["index.html", 412, 915, "app-home-412x915.png"],
  ["index.html", 430, 932, "app-home-430x932.png"],
  ["index.html", 768, 1024, "app-home-768x1024.png"],
  ["palace.html", 390, 844, "app-palace-390x844.png"],
  ["news.html", 1440, 900, "app-news-1440x900.png"],
  ["news.html", 390, 844, "app-news-390x844.png"],
  ["games.html", 1440, 900, "app-games-1440x900.png"],
  ["games.html", 390, 844, "app-games-390x844.png"],
  ["about.html", 1440, 900, "app-about-1440x900.png"],
  ["about.html", 390, 844, "app-about-390x844.png"],
  ["palace-play.html", 390, 844, "app-mini-match-390x844.png"],
  ["palace-play.html?lang=ar&game=shed", 390, 844, "app-mini-match-ar-shed-390x844.png"]
]) {
  const page = await context.newPage();
  await page.setViewportSize({ width, height });
  await page.goto(`${base}/${file}`, { waitUntil: "networkidle" });
  const geometry = await page.evaluate(() => ({
    overflow: document.documentElement.scrollWidth > innerWidth + 1,
    viewportWidth: innerWidth,
    scrollWidth: document.documentElement.scrollWidth,
    headerBottom: Math.round(document.querySelector(".site-header")?.getBoundingClientRect().bottom || 0),
    h1Left: Math.round(document.querySelector("h1")?.getBoundingClientRect().left || 0),
    h1Right: Math.round(document.querySelector("h1")?.getBoundingClientRect().right || 0),
    h1Bottom: Math.round(document.querySelector("h1")?.getBoundingClientRect().bottom || 0),
    h1Size: (() => { const heading = document.querySelector("h1"); return heading?.getBoundingClientRect().width ? parseFloat(getComputedStyle(heading).fontSize) : 0; })(),
    firstActionTop: Math.round(document.querySelector("main .actions .button")?.getBoundingClientRect().top || 0),
    newsTop: Math.round(document.querySelector(".featured-news")?.getBoundingClientRect().top || 0),
    gamesTop: Math.round(document.querySelector(".game-shelf")?.getBoundingClientRect().top || 0)
  }));
  results.layouts[shot] = geometry;
  if (geometry.overflow) fail(`${shot}: horizontal overflow`);
  if (width <= 430 && (geometry.h1Left < -1 || geometry.h1Right > width + 1)) fail(`${shot}: heading clipped outside phone viewport`);
  if (width <= 430 && !file.startsWith("palace-play.html") && geometry.h1Size > 58) fail(`${shot}: phone heading remains desktop-sized`);
  if (width <= 430 && geometry.headerBottom > 125) fail(`${shot}: phone header is too tall`);
  if (file === "index.html" && width >= 360 && width <= 430 && geometry.firstActionTop > height) fail(`${shot}: primary play action is below the first phone viewport`);
  if (file === "news.html" && geometry.newsTop > height * .72) fail("News featured story is still below the first viewport");
  if (file === "games.html" && geometry.gamesTop > height * .72) fail("More Games cards are still below the first viewport");
  if (captureScreenshots) await page.screenshot({ path: resolve(evidence, shot), fullPage: true });
  await page.close();
}

for (const file of ["index.html","palace.html","palace-play.html","news.html","games.html","about.html","support.html","404.html"]) {
  const page = await context.newPage();
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${base}/${file}?lang=en&game=shed`, { waitUntil: "networkidle" });
  const authority = await page.evaluate(() => ({
    header: document.querySelector("[data-current-game]")?.textContent.trim(),
    nav: document.querySelector(".site-nav a:first-child")?.textContent.trim(),
    play: document.querySelector(".nav-play")?.textContent.trim(),
    countdown: document.querySelector("[data-game-message='gameCountdown']")?.textContent.trim() || "",
    artModes: [...document.querySelectorAll("img[data-game-art]")].map((image) => image.dataset.gameArt),
    controlsVisible: [...document.querySelectorAll(".header-name,.header-language")].every((node) => getComputedStyle(node).display !== "none" && node.getBoundingClientRect().height >= 40)
  }));
  if (authority.header !== "Shed" || authority.nav !== "Shed" || !authority.play.includes("Shed") || (authority.countdown && !authority.countdown.includes("Shed")) || authority.artModes.some((mode) => mode !== "shed") || !authority.controlsVisible) fail(`${file}: Shed authority or mobile controls failed`);
  await page.close();
}

for (const file of ["index.html","news.html","games.html","about.html","support.html","404.html"]) {
  const page = await context.newPage();
  await page.goto(`${base}/${file}?lang=en-CA-fun&game=shed`, { waitUntil: "networkidle" });
  const canadian = await page.evaluate(() => ({
    label: document.querySelector("select[data-locale]")?.selectedOptions?.[0]?.textContent.trim(),
    changed: [...document.querySelectorAll("[data-brand-message]")].filter((node) => node.textContent.trim() !== node.dataset.brandDefault).length
  }));
  if (canadian.label !== "Canadian" || canadian.changed < 1) fail(`${file}: Canadian copy did not materially change`);
  await page.close();
}

const powers = await context.newPage();
await powers.setViewportSize({ width: 1440, height: 900 });
await powers.goto(`${base}/index.html#rules`, { waitUntil: "networkidle" });
for (const rank of ["2", "7", "8", "10"]) {
  await powers.locator(`[data-power="${rank}"]`).click();
  const pressed = await powers.locator(`[data-power="${rank}"]`).getAttribute("aria-pressed");
  const active = await powers.locator("[data-power-showcase]").getAttribute("data-active-power");
  if (pressed !== "true" || active !== rank) fail(`Power card ${rank}: interaction state failed`);
}
if (captureScreenshots) await powers.locator("#rules").screenshot({ path: resolve(evidence, "app-power-cards-1440.png") });
await powers.close();

const palace = await context.newPage();
await palace.setViewportSize({ width: 390, height: 844 });
await palace.goto(`${base}/palace-play.html?lang=en&game=shed`, { waitUntil: "networkidle" });
const palaceSetup = await palace.evaluate(() => ({ faceUp: document.querySelectorAll(".palace-foundation .visible-row .match-card").length, faceDown: document.querySelectorAll(".palace-foundation .hidden-row .match-card").length, drawDeck: document.querySelectorAll(".palace-foundation .draw-deck .match-card").length, hand: document.querySelectorAll(".player-hand .match-card").length, opponent: document.querySelectorAll(".rival-seat .match-card").length, pile: document.querySelectorAll(".central-pile .match-card").length, overflow: document.documentElement.scrollWidth > innerWidth + 1 }));
results.founderReview.palaceSetup = palaceSetup;
if (palaceSetup.faceUp !== 3 || palaceSetup.faceDown !== 3 || palaceSetup.drawDeck !== 1 || palaceSetup.hand < 3 || palaceSetup.opponent < 1 || palaceSetup.pile < 1 || palaceSetup.overflow) fail("Palace defining setup is incomplete or overflows mobile");
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
  const page = await context.newPage();
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${base}/${game}-play.html`, { waitUntil: "networkidle" });
  const gameTableState = await page.evaluate(() => ({ seats: document.querySelectorAll(".table-avatars > *").length, status: document.querySelectorAll(".game-specific-status span").length, center: Boolean(document.querySelector(".table-trick")), decision: Boolean(document.querySelector(".table-decision")), overflow: document.documentElement.scrollWidth > innerWidth + 1, background: getComputedStyle(document.querySelector(".tutorial-board")).backgroundImage }));
  if (gameTableState.seats !== 4 || gameTableState.status < 4 || !gameTableState.center || !gameTableState.decision || gameTableState.overflow || !gameTableState.background.includes("radial-gradient")) fail(`${game}: approved table-family structure or mobile bounds failed`);
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

const keyboard = await context.newPage();
await keyboard.setViewportSize({ width: 390, height: 844 });
await keyboard.goto(`${base}/palace.html?game=shed`, { waitUntil: "networkidle" });
await keyboard.locator('[data-power="7"]').focus();
await keyboard.keyboard.press("Enter");
const powerByKeyboard = await keyboard.locator('[data-power="7"]').getAttribute("aria-pressed") === "true";
await keyboard.locator(".header-name summary").focus();
await keyboard.keyboard.press("Enter");
const nameMenuByKeyboard = await keyboard.locator(".header-name details").getAttribute("open") !== null;
await keyboard.locator("[data-open-settings]").focus();
await keyboard.keyboard.press("Enter");
const dialogByKeyboard = await keyboard.locator("[data-settings-dialog]").evaluate((dialog) => dialog.open);
await keyboard.keyboard.press("Escape");
results.keyboard = { powerByKeyboard, nameMenuByKeyboard, dialogByKeyboard };
if (!powerByKeyboard || !nameMenuByKeyboard || !dialogByKeyboard) fail("Keyboard interaction gate failed");
await keyboard.close();
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
if (await naming.locator('img[data-game-art]:not([data-game-art="shithead"])').count()) fail("Traditional mode artwork did not update globally");
if (!naming.url().includes("game=shithead")) fail("Traditional mode was not kept in URL-only state");
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
writeFileSync(resolve(evidence, resultFile), `${JSON.stringify(results, null, 2)}\n`);
if (results.failures.length) {
  console.error(`App-parity verification failed:\n- ${results.failures.join("\n- ")}`);
  process.exit(1);
}
console.log(`App-parity verification passed: ${results.pages.length} pages, ${results.modes.length} locale/name states, ${results.tutorials.length} tutorials, responsive first viewports, power cards, Easter egg, and zero storage.`);
