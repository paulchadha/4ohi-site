import { createRequire } from "node:module";
import { readFile, stat } from "node:fs/promises";
import { resolve } from "node:path";

const require = createRequire(import.meta.url);
const { chromium } = require("playwright");
const root = resolve(import.meta.dirname, "..");
const base = process.env.SITE_URL || "http://127.0.0.1:4173";
const chrome = process.env.CHROME_PATH || "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const matrix = [[320,568],[360,800],[390,844],[412,915],[430,932],[768,1024],[1366,768],[1920,1080]];
const routes = ["index.html","palace.html","palace-play.html","palace-story.html","games.html","news.html","about.html"];
const failures = [];
const browser = await chromium.launch({ headless: true, executablePath: chrome });

const visible = (rect, width, height) => rect && rect.width > 0 && rect.height > 0 && rect.right > 0 && rect.left < width && rect.bottom > 0 && rect.top < height;
for (const [width,height] of matrix) {
  const page = await browser.newPage({ viewport: { width, height } });
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
  await page.goto(`${base}/index.html`, { waitUntil: "networkidle" });
  const state = await page.evaluate(() => {
    const rect = (selector) => document.querySelector(selector)?.getBoundingClientRect().toJSON();
    return {
      logo: rect(".brand-logo"), art: rect(".spatial-world.is-active .world-art-link"),
      title: rect("[data-spatial-title]"), play: rect("[data-spatial-link]"), news: rect(".portal-news-signal"),
      name: rect(".portal-utility .palace-table-tools"), locale: rect(".portal-language"), countdown: rect(".portal-countdown, [data-release-strip]"),
      overflow: document.documentElement.scrollWidth - innerWidth,
      titleText: document.querySelector("[data-spatial-title]")?.textContent.trim(),
      actionText: document.querySelector("[data-spatial-link]")?.textContent.trim(),
      errors: [...document.querySelectorAll('img')].filter((img) => !img.complete || !img.naturalWidth).length
    };
  });
  for (const key of ["logo","art","title","play","news","name","locale","countdown"]) {
    if (!visible(state[key],width,height)) failures.push(`${width}x${height}: ${key} is absent from the opening viewport`);
  }
  if (state.overflow > 1 || errors.length) failures.push(`${width}x${height}: overflow ${state.overflow}px or runtime errors ${errors.join(" | ")}`);
  if (state.titleText !== "Palace" || !state.actionText.startsWith("Play Palace")) failures.push(`${width}x${height}: Palace is not the opening flagship action`);
  await page.close();
}

const interaction = await browser.newPage({ viewport: { width: 390, height: 844 } });
await interaction.goto(`${base}/index.html`, { waitUntil: "networkidle" });
await interaction.locator(".portal-utility .palace-table-tools summary").focus();
await interaction.keyboard.press("Enter");
await interaction.click('[data-name-choice="Shed"]');
if (!new URL(interaction.url()).searchParams.get("game")?.includes("shed")) failures.push("Homepage table-name control did not update its URL-scoped state");
await Promise.all([
  interaction.waitForURL((url) => url.searchParams.get("lang") === "fr"),
  interaction.selectOption(".portal-language select", "fr")
]);
if (new URL(interaction.url()).searchParams.get("lang") !== "fr") failures.push("Homepage language control did not update locale state");
await interaction.click('[data-spatial-select="2"]');
await interaction.waitForTimeout(50);
if (await interaction.locator("[data-palace-portal-tools]").isVisible()) failures.push("Palace-only controls remain visible in the Hearts world");
if (!(await interaction.textContent("[data-spatial-link]"))?.includes("Try Hearts")) failures.push("Hearts world action is inaccurate");
await interaction.close();

const power = await browser.newPage({ viewport: { width: 1366, height: 768 } });
await power.goto(`${base}/palace.html`, { waitUntil: "networkidle" });
await power.locator('[data-power="2"]').focus();
await power.keyboard.press("ArrowRight");
if (await power.getAttribute('[data-power="7"]',"aria-pressed") !== "true") failures.push("Power Cards are not keyboard-examinable");
await power.close();

for (const route of routes) {
  for (const [width,height] of [[320,568],[390,844],[768,1024],[1366,768]]) {
    const page = await browser.newPage({ viewport: { width, height } });
    const response = await page.goto(`${base}/${route}`, { waitUntil: "networkidle" });
    const state = await page.evaluate(() => ({ overflow: document.documentElement.scrollWidth - innerWidth, h1: document.querySelectorAll("h1").length, main: Boolean(document.querySelector("main#main")) }));
    if (response?.status() !== 200 || state.overflow > 1 || state.h1 !== 1 || !state.main) failures.push(`${route} ${width}x${height}: route, landmark, heading, or overflow gate failed`);
    await page.close();
  }
}
await browser.close();

const html = await readFile(resolve(root,"index.html"),"utf8");
const assets = [...html.matchAll(/(?:src|href)="(assets\/[^"]+\.(?:css|js))(?:\?[^"#]*)?"/g)].map((match) => match[1]);
const bytes = (await Promise.all([...new Set(assets)].map((file) => stat(resolve(root,file))))).reduce((sum,item) => sum + item.size,0);
if (bytes > 450000) failures.push(`CSS/JS document payload exceeds 450 KB (${bytes})`);

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}
console.log(`Immersive experience QA passed: ${matrix.length} opening viewports, ${routes.length * 4} route/viewports, Palace scope, locale, Power Cards keyboard, and ${bytes} CSS/JS bytes.`);
