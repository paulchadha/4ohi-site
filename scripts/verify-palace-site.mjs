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

await page.goto(`${base}/palace-play.html`, { waitUntil: "networkidle" });
await page.keyboard.press("Tab");
result.accessibility.firstTab = {
  text: await page.locator(":focus").textContent(),
  href: await page.locator(":focus").getAttribute("href")
};
check(result.accessibility.firstTab.href === "#main", "first Tab did not reach skip link");

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
const primaryTargets = await page.locator(".site-header a, .site-header button, .button, .playing-card").evaluateAll((elements) =>
  elements.filter((element) => element.getClientRects().length).map((element) => ({
    text: element.textContent?.trim(),
    width: element.getBoundingClientRect().width,
    height: element.getBoundingClientRect().height
  }))
);
result.accessibility.primaryTargets = primaryTargets;
check(primaryTargets.every((target) => target.width >= 44 && target.height >= 44), "primary target smaller than 44px");

const reducedContext = await browser.newContext({ reducedMotion: "reduce", viewport: { width: 390, height: 844 } });
const reducedPage = await reducedContext.newPage();
await reducedPage.goto(`${base}/palace-play.html`, { waitUntil: "networkidle" });
await reducedPage.locator('[data-action="deal"]').click();
result.accessibility.reducedMotion = await reducedPage.locator(".playing-card").first().evaluate((element) => {
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
