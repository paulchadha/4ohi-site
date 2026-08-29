import { createRequire } from "node:module";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
const require = createRequire(import.meta.url);
const { chromium } = require("playwright");
const base = process.env.SITE_URL || "http://127.0.0.1:4173";
const chrome = process.env.CHROME_PATH || "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const evidence = resolve("docs", "visual-evidence", "reconstruction", "legacy-portfolio");
mkdirSync(evidence, { recursive: true });
const routes = ["index.html","games.html","bobby-the-breadasaurus.html","evil-doom-adventures.html","news.html","about.html"];
const matrix = [[320,568],[375,812],[430,932],[768,1024],[1024,768],[1366,768],[1920,1080],[844,390]];
const failures = [];
const results = { checkedAt:new Date().toISOString(), base, pages:[], failures };
const browser = await chromium.launch({ headless:true, executablePath:chrome });
for (const route of routes) {
  for (const size of matrix) {
    const page = await browser.newPage({ viewport:{ width:size[0], height:size[1] } });
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    const response = await page.goto(base + "/" + route, { waitUntil:"networkidle" });
    for (const image of await page.locator("img:visible").all()) await image.scrollIntoViewIfNeeded();
    await page.waitForTimeout(80);
    const state = await page.evaluate(() => ({
      h1:document.querySelectorAll("h1").length,
      overflow:document.documentElement.scrollWidth - innerWidth,
      broken:[...document.images].filter((image) => !image.complete || image.naturalWidth === 0).length,
      main:Boolean(document.querySelector("main#main")),
      table:document.querySelectorAll("[data-palace-context]").length
    }));
    results.pages.push({ route, width:size[0], height:size[1], status:response?.status(), ...state, errors });
    if (response?.status() !== 200 || state.h1 !== 1 || state.overflow > 1 || state.broken || !state.main || state.table || errors.length) failures.push(route + " " + size.join("x") + " failed responsive structure");
    if ([320,430,768,1366].includes(size[0])) await page.screenshot({ path:resolve(evidence,"portfolio-" + route.replace(".html","") + "-" + size.join("x") + ".png"), fullPage:true });
    await page.close();
  }
}
const page = await browser.newPage({ viewport:{ width:375, height:812 } });
await page.goto(base + "/index.html", { waitUntil:"networkidle" });
await page.keyboard.press("Tab");
const skip = await page.evaluate(() => document.activeElement?.classList.contains("skip-link"));
await page.keyboard.press("Enter");
await page.locator(".menu-toggle").click();
await page.locator(".games-menu > summary").focus();
await page.keyboard.press("Enter");
await page.screenshot({ path:resolve(evidence,"portfolio-mobile-navigation-open-375x812.png"), fullPage:false });
const mobile = await page.evaluate(() => ({
  h1:document.querySelector("h1")?.innerText.replace(/\s+/g," ").trim(),
  skip:location.hash === "#main",
  links:[...document.querySelectorAll(".games-menu-panel a")].filter((node) => node.getBoundingClientRect().height > 0).length,
  focus:parseFloat(getComputedStyle(document.activeElement).outlineWidth) > 0,
  storage:[document.cookie,localStorage.length,sessionStorage.length]
}));
if (!skip || !mobile.skip || mobile.h1 !== "Four of Hearts Interactive" || mobile.links !== 8 || !mobile.focus || mobile.storage.some(Boolean)) failures.push("Homepage keyboard, mobile menu, studio title, or privacy gate failed");
await page.close();
const games = await browser.newPage({ viewport:{ width:1366, height:768 } });
await games.goto(base + "/games.html", { waitUntil:"networkidle" });
const catalog = await games.evaluate(() => [...document.querySelectorAll(".catalog-card")].map((card) => ({ key:card.dataset.gameKey,title:card.querySelector("h2")?.textContent.trim(),play:card.querySelectorAll('.actions a[href*="play"]').length })));
const expected = ["Palace","Bobby the Breadasaurus","Evil Doom Adventures: Shadow Run","Thumb Command","Hearts","Spades","Euchre"];
if (catalog.length !== 7 || expected.some((title) => !catalog.some((game) => game.title === title))) failures.push("Seven-game catalog gate failed");
if (catalog.filter((game) => ["bobby","evil-doom","thumb-command"].includes(game.key)).some((game) => game.play)) failures.push("Unavailable game exposes a false play link");
results.catalog = catalog;
await games.close();
const bobby = await browser.newPage({ viewport:{ width:430,height:932 } });
await bobby.goto(base + "/bobby-the-breadasaurus.html", { waitUntil:"networkidle" });
const bobbyState = await bobby.evaluate(() => ({ h1:document.querySelector("h1")?.innerText.replace(/\s+/g," ").trim(),status:document.querySelector(".world-status")?.textContent,forbidden:["Crusto","Lofi","Velox","Rolla"].filter((name) => document.body.innerText.includes(name)) }));
if (bobbyState.h1 !== "Bobby the Breadasaurus" || !/in development/i.test(bobbyState.status) || bobbyState.forbidden.length) failures.push("Bobby title, status, or unpublished-name gate failed");
results.bobby = bobbyState;
await bobby.close();
const doom = await browser.newPage({ viewport:{ width:430,height:932 } });
await doom.goto(base + "/evil-doom-adventures.html", { waitUntil:"networkidle" });
const doomState = await doom.evaluate(() => ({ h1:document.querySelector("h1")?.innerText.replace(/\s+/g," ").trim(),status:document.querySelector(".world-status")?.textContent,background:getComputedStyle(document.querySelector(".doom-hero")).backgroundImage,moves:[...document.querySelectorAll(".runner li")].map((node) => node.textContent.trim()),falseClaim:/available now|download now|out now/i.test(document.body.innerText) }));
if (doomState.h1 !== "Evil Doom Adventures" || !/in development/i.test(doomState.status) || !doomState.background.includes("78, 42, 132") || doomState.falseClaim) failures.push("Shadow Run title, status, purple, or honesty gate failed");
if (!["Run","Jump","Duck","Slide","Dash","Climb","Rope","Swing"].every((move) => doomState.moves.includes(move))) failures.push("Shadow Run movement gate failed");
results.doom = doomState;
await doom.close();
const comparison = await browser.newPage({ viewport:{ width:1366,height:768 } });
await comparison.setContent('<style>body{margin:0;background:#111;color:white;font:700 18px system-ui;display:grid;grid-template-columns:1fr 1fr;gap:8px}figure{margin:0}img{width:100%;height:690px;object-fit:contain}figcaption{text-align:center}</style><figure><img src="' + base + '/assets/evil-doom/evil-doom-concept-board-a-original-1280.webp"><figcaption>Founder source colors</figcaption></figure><figure><img src="' + base + '/assets/evil-doom/evil-doom-concept-board-a-purple-1280.webp"><figcaption>Selective deep-purple website derivative</figcaption></figure>');
await comparison.waitForFunction(() => [...document.images].every((image) => image.complete && image.naturalWidth));
await comparison.screenshot({ path:resolve(evidence,"portfolio-art-before-after-1366x768.png"),fullPage:true });
await comparison.close();
await browser.close();
const required = ["assets/bobby/bobby-concept-board-source.png","assets/evil-doom/evil-doom-concept-board-a-source.png","assets/evil-doom/evil-doom-concept-board-b-source.png","assets/evil-doom/recolor-report.json","scripts/process-portfolio-art.py"];
if (required.some((file) => !existsSync(resolve(file)))) failures.push("Founder art provenance gate failed");
const css = readFileSync(resolve("assets","portfolio-worlds.css"),"utf8").toLowerCase();
if (!css.includes("#4e2a84") || /#ff1493|#ff69b4|hotpink/.test(css)) failures.push("Approved Evil Girl palette gate failed");
const userText = routes.map((route) => readFileSync(resolve(route),"utf8")).join("\n");
if (/Commander ThumB|Commander Thumb|Commander THUMB|COMMANDER THUMB/.test(userText)) failures.push("Incorrect Commander title spelling remains");
writeFileSync(resolve(evidence,"portfolio-expansion-results.json"),JSON.stringify(results,null,2) + "\n","utf8");
if (failures.length) { console.error(failures.join("\n")); process.exit(1); }
console.log("Portfolio expansion QA passed: 6 routes, 8 viewports, seven games, art provenance, status, keyboard, privacy, and spelling.");
