import { createRequire } from "node:module";
import { writeFileSync } from "node:fs";

const require = createRequire(import.meta.url);
const { chromium } = require("playwright");

const base = process.env.SITE_URL || "http://127.0.0.1:8765";
const outputPath = process.env.SITE_RESULTS || "";
const screenshotDir = process.env.SCREENSHOT_DIR || "";
const chromePath = process.env.CHROME_PATH || "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const pages = [
  ["index.html", "/"],
  ["palace.html", "/palace.html"],
  ["palace-play.html", "/palace-play.html"],
  ["palace-story.html", "/palace-story.html"],
  ["news.html", "/news.html"],
  ["news-why-were-building-palace.html", "/news-why-were-building-palace.html"],
  ["news-palace-enters-founder-testing.html", "/news-palace-enters-founder-testing.html"],
  ["news-welcome-to-four-of-hearts.html", "/news-welcome-to-four-of-hearts.html"],
  ["news-meet-the-four-games.html", "/news-meet-the-four-games.html"],
  ["news-building-a-safer-card-table.html", "/news-building-a-safer-card-table.html"],
  ["games.html", "/games.html"],
  ["play.html", "/play.html"],
  ["hearts-play.html", "/hearts-play.html"],
  ["spades-play.html", "/spades-play.html"],
  ["euchre-play.html", "/euchre-play.html"],
  ["about.html", "/about.html"],
  ["support.html", "/support.html"],
  ["privacy.html", "/privacy.html"],
  ["security.html", "/security.html"],
  ["terms.html", "/terms.html"],
  ["contact.html", "/contact.html"]
];
const viewports = [
  [320, 568], [360, 800], [390, 844], [412, 915], [430, 932],
  [768, 1024], [1366, 768], [1920, 1080]
];
const failures = [];
const result = {
  base,
  pages: [],
  responsive: [],
  palaceTutorial: [],
  secondaryTutorials: [],
  accessibility: {},
  discovery: {},
  requests: [],
  consoleErrors: [],
  failedRequests: []
};
const check = (value, message) => {
  if (!value) failures.push(message);
};

const browser = await chromium.launch({ executablePath: chromePath, headless: true });
const context = await browser.newContext({ viewport: { width: 1366, height: 768 } });
const page = await context.newPage();
page.on("request", (request) => result.requests.push(request.url()));
page.on("requestfailed", (request) => {
  if (request.failure()?.errorText === "net::ERR_ABORTED") return;
  result.failedRequests.push(`${request.method()} ${request.url()}: ${request.failure()?.errorText}`);
});
page.on("console", (message) => {
  if (message.type() === "error") result.consoleErrors.push(message.text());
});

for (const [name, path] of pages) {
  const response = await page.goto(`${base}${path}`, { waitUntil: "networkidle" });
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(120);
  const data = await page.evaluate(() => ({
    title: document.title,
    h1: document.querySelector("h1")?.textContent?.trim() ?? "",
    description: document.querySelector('meta[name="description"]')?.content ?? "",
    canonical: document.querySelector('link[rel="canonical"]')?.href ?? "",
    ogTitle: document.querySelector('meta[property="og:title"]')?.content ?? "",
    ogDescription: document.querySelector('meta[property="og:description"]')?.content ?? "",
    ogImage: document.querySelector('meta[property="og:image"]')?.content ?? "",
    imagesLoaded: [...document.images].every((image) => image.complete && image.naturalWidth > 0),
    cookie: document.cookie,
    localStorage: localStorage.length,
    sessionStorage: sessionStorage.length
  }));
  data.name = name;
  data.status = response?.status();
  result.pages.push(data);
  check(data.status === 200, `${name}: status ${data.status}`);
  check(Boolean(data.title && data.h1 && data.description), `${name}: missing title, H1, or description`);
  check(data.canonical.startsWith("https://4ohi.com/"), `${name}: canonical URL is not secure apex`);
  check(Boolean(data.ogTitle && data.ogDescription && data.ogImage), `${name}: incomplete Open Graph metadata`);
  check(data.imagesLoaded, `${name}: image failed to load`);
  check(data.cookie === "" && data.localStorage === 0 && data.sessionStorage === 0, `${name}: unexpected client persistence`);
}

for (const path of ["/", "/palace.html", "/palace-play.html", "/news.html"]) {
  for (const [width, height] of viewports) {
    await page.setViewportSize({ width, height });
    await page.goto(`${base}${path}`, { waitUntil: "networkidle" });
    const dimensions = await page.evaluate(() => ({
      clientWidth: document.documentElement.clientWidth,
      scrollWidth: document.documentElement.scrollWidth
    }));
    result.responsive.push({ path, width, height, ...dimensions });
    check(dimensions.scrollWidth <= dimensions.clientWidth, `${path}: overflow at ${width}x${height}`);
  }
}

await page.setViewportSize({ width: 390, height: 844 });
await page.goto(`${base}/`, { waitUntil: "networkidle" });
await page.evaluate(() => { document.documentElement.style.fontSize = "125%"; });
const textZoom = await page.evaluate(() => ({
  clientWidth: document.documentElement.clientWidth,
  scrollWidth: document.documentElement.scrollWidth
}));
result.accessibility.textZoom125 = textZoom;
check(textZoom.scrollWidth <= textZoom.clientWidth, "home: overflow at 125% text size");
const launch = await page.evaluate(() => ({
  brandLoaded: Boolean(document.querySelector(".brand-logo")?.naturalWidth),
  countdownUnits: document.querySelectorAll("[data-countdown]").length,
  countdownLabel: document.querySelector("[data-launch-countdown]")?.getAttribute("aria-label") || "",
  launchDate: document.querySelector(".launch-countdown-label")?.textContent || "",
  primaryAction: document.querySelector('.hero-copy .button')?.textContent?.trim() || ""
}));
result.launch = launch;
check(launch.brandLoaded, "approved 4OH header logo did not load");
check(launch.countdownUnits === 4, "launch countdown is incomplete");
check(launch.countdownLabel.includes("until October 17, 2026"), "launch countdown accessible label is missing");
check(launch.launchDate.includes("October 17, 2026"), "launch date is missing");
check(launch.primaryAction === "Play the Palace tutorial", "primary Palace action is incorrect");

await page.goto(`${base}/palace-play.html`, { waitUntil: "networkidle" });
await page.keyboard.press("Tab");
result.accessibility.firstTab = {
  text: await page.locator(":focus").textContent(),
  href: await page.locator(":focus").getAttribute("href")
};
check(result.accessibility.firstTab.href === "#main", "first Tab did not reach skip link");

/* Legacy six-chapter Palace verifier retained for release-history context.
const palaceAction = async (label, locator) => {
  await locator.click();
  result.palaceTutorial.push({ label, heading: await page.locator("#palace-tutorial h2").textContent() });
};
await palaceAction("deal", page.locator('[data-action="deal"]'));
await palaceAction("friendly incorrect legal play", page.locator('[data-card="3♦"]'));
check((await page.locator(".tutorial-feedback").textContent()).includes("lower than six"), "Palace legal-play hint missing");
await palaceAction("legal equal play", page.locator('[data-card="6♥"]'));
await palaceAction("next to matching", page.locator('[data-action="next"]'));
await palaceAction("matching rank", page.locator('[data-card="9♣"]'));
await palaceAction("next to pickup", page.locator('[data-action="next"]'));
await palaceAction("blocked ordinary card", page.locator('[data-card="blocked"]').first());
await palaceAction("pick up pile", page.locator('[data-action="pickup"]'));
await page.waitForSelector('[data-card="special"]');
await palaceAction("special-card awareness", page.locator('[data-card="special"]'));
await palaceAction("next to layers", page.locator('[data-action="next"]'));
await palaceAction("face-up layer", page.locator('[data-layer="face-up"]'));
await palaceAction("face-down layer", page.locator('[data-layer="face-down"]'));
await palaceAction("finish tutorial", page.locator('[data-action="next"]'));
result.palaceTutorialFinal = await page.locator("#palace-tutorial h2").textContent();
check(result.palaceTutorialFinal === "You cleared the Palace.", "Palace tutorial completion state missing");
*/

for (const game of ["hearts", "spades", "euchre"]) {
  await page.goto(`${base}/${game}-play.html`, { waitUntil: "networkidle" });
  for (let round = 0; round < 2; round += 1) {
    await page.locator("[data-choice]").nth(0).click();
    await page.locator("[data-next]").click();
  }
  const heading = await page.locator("[data-secondary-tutorial] h2").textContent();
  result.secondaryTutorials.push({ game, heading });
  check(heading === "Nice play.", `${game}: completion state missing`);
}

await page.goto(`${base}/palace-play.html`, { waitUntil: "networkidle" });
const primaryTargets = await page.locator(".site-header a, .site-header button, .button, .v3-card").evaluateAll((elements) =>
  elements.filter((element) => element.getClientRects().length).map((element) => ({
    text: element.textContent?.trim(),
    width: element.getBoundingClientRect().width,
    height: element.getBoundingClientRect().height
  }))
);
/* End of misplaced legacy verifier block marker.
*/
const recordPalace = async (label) => result.palaceTutorial.push({ label, text: await page.locator("#palace-tutorial").innerText() });
await page.locator('[data-action="start"]').click();
await recordPalace("take seat");
await page.locator('[data-card="wrong"]').click();
check((await page.locator(".v3-feedback").textContent()).includes("lower than six"), "recoverable match mistake missing");
await page.locator('[data-card="match"]').click();
await page.waitForSelector('[data-card="burn"]');
await recordPalace("match equal rank");
await page.locator('[data-card="burn"]').click();
await page.waitForSelector('[data-action="opponent"]');
await recordPalace("ten burns pile");
await page.locator('[data-action="opponent"]').click();
await page.waitForSelector('[data-power-readout]');
await recordPalace("opponent picks up");
for (const value of ["2", "7", "8", "10"]) await page.locator(`[data-card="${value}"]`).click();
await page.waitForSelector('[data-action="layer"]');
await recordPalace("all power cards");
await page.locator('[data-action="layer"]').click();
await page.locator('[data-action="layer"]').click();
await page.locator('[data-action="layer"]').click();
await page.waitForFunction(() => document.querySelector("#palace-tutorial h2")?.textContent === "You rule this Palace.");
result.palaceTutorialFinal = await page.locator("#palace-tutorial h2").textContent();
check(result.palaceTutorialFinal === "You rule this Palace.", "Palace tutorial completion state missing");
result.accessibility.primaryTargets = primaryTargets;
check(primaryTargets.every((target) => target.width >= 44 && target.height >= 44), "primary target smaller than 44px");

await page.goto(`${base}/palace.html`, { waitUntil: "networkidle" });
await page.locator('[data-name-choice="Shed"]').click();
check((await page.locator('[data-game-name]').first().textContent()) === "Shed", "Palace/Shed session name did not update");
for (let tap = 0; tap < 9; tap += 1) await page.locator('[data-name-choice="Shed"]').click();
check((await page.locator('[data-game-name]').first().textContent()) === "Shithead", "ten-tap founder Easter egg did not unlock");
check(await page.locator('[data-name-secret]').isVisible(), "founder Easter egg acknowledgement missing");
await page.reload({ waitUntil: "networkidle" });
check((await page.locator('[data-game-name]').first().textContent()) === "Palace", "name setting persisted after refresh");
check(await page.evaluate(() => !document.cookie && localStorage.length === 0 && sessionStorage.length === 0), "name setting used browser persistence");
await page.goto(`${base}/privacy.html`, { waitUntil: "networkidle" });
check(await page.locator(".privacy-row").count() === 8, "privacy choices center is incomplete");
const reducedContext = await browser.newContext({ reducedMotion: "reduce", viewport: { width: 390, height: 844 } });
const reducedPage = await reducedContext.newPage();
await reducedPage.goto(`${base}/palace-play.html`, { waitUntil: "networkidle" });
await reducedPage.locator('[data-action="start"]').click();
result.accessibility.reducedMotion = await reducedPage.locator(".v3-card").first().evaluate((element) => {
  const style = getComputedStyle(element);
  return { animationDuration: style.animationDuration, transitionDuration: style.transitionDuration };
});
await reducedContext.close();

for (const [name, expected] of [["robots.txt", "https://4ohi.com/sitemap.xml"], ["sitemap.xml", "palace-story.html"], ["feed.xml", "Why We’re Building Palace"]]) {
  const response = await context.request.get(`${base}/${name}`);
  const body = await response.text();
  result.discovery[name] = { status: response.status(), containsExpected: body.includes(expected) };
  check(response.status() === 200 && body.includes(expected), `${name}: missing or invalid`);
}

const measureRoute = async (path, width, height) => {
  const measureContext = await browser.newContext();
  const measurePage = await measureContext.newPage();
  await measurePage.setViewportSize({ width, height });
  await measurePage.goto(`${base}${path}`, { waitUntil: "networkidle" });
  const entries = await measurePage.evaluate(() => [performance.getEntriesByType("navigation")[0], ...performance.getEntriesByType("resource")].filter(Boolean).map((entry) => ({
    name: new URL(entry.name).pathname,
    type: entry.initiatorType,
    transferSize: entry.transferSize,
    decodedBodySize: entry.decodedBodySize
  })));
  await measureContext.close();
  const total = entries.reduce((sum, entry) => sum + entry.transferSize, 0);
  const javascript = entries.filter((entry) => entry.type === "script").reduce((sum, entry) => sum + entry.transferSize, 0);
  const css = entries.filter((entry) => entry.type === "css" || entry.name.endsWith(".css")).reduce((sum, entry) => sum + entry.transferSize, 0);
  const largest = [...entries].sort((a, b) => b.transferSize - a.transferSize)[0];
  const totalDecoded = entries.reduce((sum, entry) => sum + entry.decodedBodySize, 0);
  const javascriptDecoded = entries.filter((entry) => entry.type === "script").reduce((sum, entry) => sum + entry.decodedBodySize, 0);
  const cssDecoded = entries.filter((entry) => entry.type === "css" || entry.name.endsWith(".css")).reduce((sum, entry) => sum + entry.decodedBodySize, 0);
  const largestDecoded = [...entries].sort((a, b) => b.decodedBodySize - a.decodedBodySize)[0];
  return { path, width, height, totalTransferBytes: total, javascriptTransferBytes: javascript, cssTransferBytes: css, largestResource: largest, totalDecodedBytes: totalDecoded, javascriptDecodedBytes: javascriptDecoded, cssDecodedBytes: cssDecoded, largestDecodedResource: largestDecoded, resources: entries };
};

result.performance = {
  homeDesktop: await measureRoute("/", 1440, 900),
  palaceTutorialMobile: await measureRoute("/palace-play.html", 390, 844)
};

await page.goto(`${base}/404.html`, { waitUntil: "networkidle" });
result.notFound = {
  h1: await page.locator("h1").textContent(),
  noindex: await page.locator('meta[name="robots"]').getAttribute("content")
};
check(result.notFound.noindex === "noindex", "404 page missing noindex");

if (screenshotDir) {
  const shots = [
    ["/", "palace-home-1440x900.png", 1440, 900, true],
    ["/", "palace-home-wide-1920x1080.png", 1920, 1080, false],
    ["/", "palace-home-mobile-390x844.png", 390, 844, false],
    ["/", "palace-home-tablet-768x1024.png", 768, 1024, false],
    ["/palace.html", "palace-product-1440x900.png", 1440, 900, true],
    ["/palace-play.html", "palace-tutorial-390x844.png", 390, 844, true],
    ["/palace-story.html", "palace-history-1440x900.png", 1440, 900, true],
    ["/news.html", "news-390x844.png", 390, 844, true],
    ["/news-why-were-building-palace.html", "news-article-390x844.png", 390, 844, true],
    ["/games.html", "more-games-1440x900.png", 1440, 900, true],
    ["/support.html", "support-390x844.png", 390, 844, false],
    ["/privacy.html", "privacy-390x844.png", 390, 844, false],
    ["/security.html", "security-390x844.png", 390, 844, false],
    ["/terms.html", "terms-390x844.png", 390, 844, false],
    ["/contact.html", "contact-390x844.png", 390, 844, false]
  ];
  for (const [path, filename, width, height, fullPage] of shots) {
    await page.setViewportSize({ width, height });
    await page.goto(`${base}${path}`, { waitUntil: "networkidle" });
    await page.screenshot({ path: `${screenshotDir}/${filename}`, fullPage });
  }
}

result.cookies = await context.cookies();
result.requests = [...new Set(result.requests)];
result.thirdPartyRequests = result.requests.filter((url) => {
  try {
    const hostname = new URL(url).hostname;
    return !["127.0.0.1", "localhost", "4ohi.com"].includes(hostname);
  } catch {
    return true;
  }
});
result.insecureSourceRequests = result.requests.filter((url) => base.startsWith("https://") && url.startsWith("http://"));
check(result.cookies.length === 0, "browser stored cookies");
check(result.thirdPartyRequests.length === 0, "third-party request found");
check(result.insecureSourceRequests.length === 0, "mixed-content request found");
check(result.consoleErrors.length === 0, "console error found");
check(result.failedRequests.length === 0, "failed request found");

await browser.close();
const output = `${JSON.stringify(result, null, 2)}\n`;
if (outputPath) writeFileSync(outputPath, output, "utf8");
console.log(output);
if (failures.length) {
  console.error(`Palace-site verification failed with ${failures.length} issue(s):`);
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}
