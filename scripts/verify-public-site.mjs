import { createRequire } from "node:module";
import { writeFileSync } from "node:fs";

const require = createRequire(import.meta.url);
const { chromium } = require("playwright");

const base = process.env.PUBLIC_SITE_URL || "https://4ohi.com";
const pages = [
  ["index.html", "/"],
  ["games.html", "/games.html"],
  ["play.html", "/play.html"],
  ["support.html", "/support.html"],
  ["privacy.html", "/privacy.html"],
  ["security.html", "/security.html"],
  ["terms.html", "/terms.html"],
  ["contact.html", "/contact.html"],
];
const viewports = [
  [320, 568],
  [360, 800],
  [390, 844],
  [430, 932],
  [768, 1024],
  [1366, 768],
  [1920, 1080],
];
const failures = [];
const results = { base, pages: [], viewports: [], interaction: {}, accessibility: {}, requests: [] };
const check = (condition, message) => {
  if (!condition) failures.push(message);
};

const browser = await chromium.launch({
  executablePath: process.env.CHROME_PATH || "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  headless: true,
});
const context = await browser.newContext();
const page = await context.newPage();
const consoleErrors = [];
const failedRequests = [];
page.on("console", (message) => {
  if (message.type() === "error") consoleErrors.push(message.text());
});
page.on("requestfailed", (request) => failedRequests.push(`${request.method()} ${request.url()}: ${request.failure()?.errorText}`));
page.on("request", (request) => results.requests.push(request.url()));

for (const [name, path] of pages) {
  const response = await page.goto(`${base}${path}`, { waitUntil: "networkidle" });
  const record = await page.evaluate(() => ({
    title: document.title,
    h1: document.querySelector("h1")?.textContent?.trim(),
    canonical: document.querySelector('link[rel="canonical"]')?.href,
    description: document.querySelector('meta[name="description"]')?.content,
    cookies: document.cookie,
    imagesLoaded: [...document.images].every((image) => image.complete && image.naturalWidth > 0),
  }));
  record.name = name;
  record.status = response?.status();
  record.url = page.url();
  results.pages.push(record);
  check(record.status === 200, `${name}: expected 200, received ${record.status}`);
  check(record.url.startsWith(`${base}/`), `${name}: unexpected final URL ${record.url}`);
  check(Boolean(record.title && record.h1 && record.canonical && record.description), `${name}: metadata or H1 missing`);
  check(record.canonical.startsWith("https://4ohi.com/"), `${name}: canonical URL is not HTTPS apex`);
  check(record.cookies === "", `${name}: first-party cookie found`);
  check(record.imagesLoaded, `${name}: image failed to load`);
}

const errorsBefore404 = consoleErrors.length;
const notFound = await page.goto(`${base}/launch-verification-not-found`, { waitUntil: "networkidle" });
results.notFound = {
  status: notFound?.status(),
  h1: await page.locator("h1").textContent(),
  robots: await page.locator('meta[name="robots"]').getAttribute("content"),
};
check(results.notFound.status === 404, `404 route returned ${results.notFound.status}`);
check(results.notFound.robots?.includes("noindex"), "404 route is missing noindex");
consoleErrors.splice(errorsBefore404);

for (const [width, height] of viewports) {
  for (const path of ["/", "/play.html"]) {
    await page.setViewportSize({ width, height });
    await page.goto(`${base}${path}`, { waitUntil: "networkidle" });
    const sizing = await page.evaluate(() => ({
      clientWidth: document.documentElement.clientWidth,
      scrollWidth: document.documentElement.scrollWidth,
    }));
    results.viewports.push({ path, width, height, ...sizing });
    check(sizing.scrollWidth <= sizing.clientWidth, `${path} overflows at ${width}x${height}`);
  }
}

await page.setViewportSize({ width: 1440, height: 900 });
await page.goto(`${base}/play.html`, { waitUntil: "networkidle" });
await page.keyboard.press("Tab");
results.accessibility.firstTab = {
  text: await page.locator(":focus").textContent(),
  href: await page.locator(":focus").getAttribute("href"),
};
check(results.accessibility.firstTab.href === "#main", "first Tab did not focus the skip link");
await page.locator('[role="tab"][data-game="palace"]').focus();
await page.keyboard.press("ArrowRight");
results.accessibility.afterRight = await page.locator('[role="tab"][aria-selected="true"]').getAttribute("data-game");
await page.keyboard.press("ArrowRight");
results.accessibility.afterSecondRight = await page.locator('[role="tab"][aria-selected="true"]').getAttribute("data-game");
check(results.accessibility.afterRight === "hearts" && results.accessibility.afterSecondRight === "spades", "tab arrow navigation failed");

await page.locator('[role="tab"][data-game="palace"]').click();
await page.locator('.choice-card').nth(0).click();
results.interaction.friendlyMiss = await page.locator("#lesson-feedback").textContent();
check(results.interaction.friendlyMiss.includes("Good try."), "friendly incorrect-choice feedback missing");

for (const game of ["palace", "hearts", "spades", "euchre"]) {
  await page.locator(`[role="tab"][data-game="${game}"]`).click();
  for (let round = 0; round < 2; round += 1) {
    const correctIndex = game === "palace" ? 1 : 0;
    await page.locator(".choice-card").nth(correctIndex).click();
    await page.locator(".next-button").click();
  }
}
await page.locator("#continue-tour").click();
results.interaction.score = await page.locator("#score-text").textContent();
results.interaction.finalHeading = await page.locator("#tutorial-panel h2").textContent();
check(results.interaction.score === "4 of 4 tables complete", "all four tutorials did not complete");
check(results.interaction.finalHeading === "You are a table legend.", "final tutorial state missing");

const targetHeights = await page.locator("a,button").evaluateAll((elements) =>
  elements.filter((element) => element.getClientRects().length).map((element) => element.getBoundingClientRect().height),
);
results.accessibility.primaryTargetsAtLeast44px = targetHeights.every((height) => height >= 44);
check(results.accessibility.primaryTargetsAtLeast44px, "a visible link or button is shorter than 44px");

results.cookies = await context.cookies();
check(results.cookies.length === 0, `browser stored ${results.cookies.length} cookie(s)`);
const insecureRequests = results.requests.filter((url) => url.startsWith("http://"));
const thirdPartyRequests = results.requests.filter((url) => {
  try {
    return new URL(url).hostname !== "4ohi.com";
  } catch {
    return true;
  }
});
results.insecureRequests = [...new Set(insecureRequests)];
results.thirdPartyRequests = [...new Set(thirdPartyRequests)];
results.consoleErrors = consoleErrors;
results.failedRequests = failedRequests;
check(insecureRequests.length === 0, "mixed-content HTTP request found");
check(thirdPartyRequests.length === 0, "third-party request found");
check(consoleErrors.length === 0, "console errors found");
check(failedRequests.length === 0, "failed requests found");

await browser.close();
const output = `${JSON.stringify(results, null, 2)}\n`;
if (process.env.PUBLIC_SITE_RESULTS) writeFileSync(process.env.PUBLIC_SITE_RESULTS, output, "utf8");
console.log(output);
if (failures.length) {
  console.error(`Public-site verification failed with ${failures.length} issue(s):`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}






