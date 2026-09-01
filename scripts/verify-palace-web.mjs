import { createRequire } from "node:module";
import { createServer } from "node:http";
import { extname, join, normalize, resolve } from "node:path";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
const require = createRequire(import.meta.url);
const { chromium } = require("playwright");
const root = resolve(import.meta.dirname, "..");
const out = resolve(root, "docs/visual-evidence/palace-web-2026-08-31");
mkdirSync(out, { recursive: true });
const types = { ".html":"text/html", ".js":"text/javascript", ".css":"text/css", ".png":"image/png", ".webp":"image/webp", ".jpg":"image/jpeg", ".svg":"image/svg+xml" };
const server = createServer((request, response) => { try { const pathname = decodeURIComponent(new URL(request.url, "http://local").pathname); const raw = pathname === "/" ? "index.html" : pathname.replace(/^\//, ""); const rel = raw.endsWith("/") ? `${raw}index.html` : raw; const file = normalize(join(root, rel)); if (!file.startsWith(root)) throw new Error("outside root"); const data = readFileSync(file); response.writeHead(200, { "Content-Type": types[extname(file)] || "application/octet-stream", "Cache-Control":"no-store" }); response.end(data); } catch { response.writeHead(404); response.end("Not found"); } });
await new Promise((resolveListen) => server.listen(4217, "127.0.0.1", resolveListen));
const browser = await chromium.launch({ headless: true, executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe" });
const failures = [];
const results = [];
const test = async (name, callback) => { try { await callback(); results.push({ name, status:"pass" }); console.log(`PASS ${name}`); } catch (error) { failures.push({ name, error:error.message }); results.push({ name, status:"fail", error:error.message }); console.error(`FAIL ${name}: ${error.stack}`); } };
const ok = (value, message) => { if (!value) throw new Error(message); };
const open = async (query = "", viewport = { width: 390, height: 844 }, options = {}) => { const context = await browser.newContext({ viewport, reducedMotion: options.reducedMotion || "no-preference" }); const page = await context.newPage(); const errors = []; page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); }); page.on("pageerror", (error) => errors.push(error.message)); const response = await page.goto(`http://127.0.0.1:4217/palace-play.html?palaceQa=1&fast=1&seed=5${query}`, { waitUntil:"networkidle" }); ok(response?.ok(), `HTTP ${response?.status()}`); await page.waitForSelector("#palace-web-game:not([aria-busy])"); const privacy = page.locator("[data-continue-without-saving]"); if (await privacy.isVisible().catch(() => false)) await privacy.click(); return { context, page, errors }; };

await test("English entry copy and primary navigation", async () => { const { context, page, errors } = await open(); await page.evaluate(() => window.__PALACE_WEB_QA__.reset()); ok(await page.getByText("PLAY PALACE", { exact:true }).isVisible(), "eyebrow"); ok(await page.getByRole("heading", { name:"Play one complete game of Palace." }).isVisible(), "heading"); ok(await page.getByRole("button", { name:"Deal the cards" }).isVisible(), "deal"); ok((await page.getByRole("link", { name:/How Palace works/ }).getAttribute("href")) === "palace-faq.html", "rules link"); ok(errors.length === 0, errors.join(" | ")); await context.close(); });
await test("Canadian entry copy", async () => { const { context, page } = await open("&lang=en-CA"); await page.evaluate(() => window.__PALACE_WEB_QA__.reset()); for (const text of ["PLAY PALACE, BUD", "One table. One full game.", "Deal ’em out", "How this thing works ↗"]) ok(await page.getByText(text, { exact:true }).isVisible(), text); await context.close(); });
await test("Corrupt-save recovery is bounded", async () => { const { context, page } = await open(); await page.evaluate(() => { localStorage.setItem("4oh_palace_web_v1", "{bad"); location.reload(); }); await page.waitForSelector("[data-recover]"); await page.getByRole("button", { name:"Clear invalid save" }).click(); ok(await page.getByRole("button", { name:"Deal the cards" }).isVisible(), "deal after recovery"); await context.close(); });
await test("In-progress game resumes after tab closure", async () => { const { context, page } = await open(); await page.evaluate(() => window.__PALACE_WEB_QA__.reset()); await page.getByRole("button", { name:"Deal the cards" }).click(); await page.waitForSelector(".palace-app-frame.is-setup"); await page.close(); const reopened = await context.newPage(); await reopened.goto("http://127.0.0.1:4217/palace-play.html?palaceQa=1&fast=1&seed=5", { waitUntil:"networkidle" }); await reopened.waitForSelector(".palace-app-frame.is-setup"); ok((await reopened.evaluate(() => window.__PALACE_WEB_QA__.snapshot().record.status)) === "inProgress", "closed tab did not resume"); await context.close(); });await test("Keyboard operation, dialog escape, and visible focus", async () => { const { context, page } = await open(); await page.evaluate(() => window.__PALACE_WEB_QA__.reset()); await page.getByRole("button", { name:"Deal the cards" }).focus(); await page.keyboard.press("Enter"); await page.getByRole("button", { name:"Start hand" }).focus(); ok(await page.getByRole("button", { name:"Start hand" }).evaluate((node) => getComputedStyle(node).outlineStyle !== "none"), "focus ring missing"); await page.keyboard.press("Enter"); await page.getByRole("button", { name:"View log" }).click(); ok(await page.getByRole("dialog").isVisible(), "log closed"); await page.keyboard.press("Escape"); ok(!(await page.getByRole("dialog").isVisible()), "escape did not dismiss"); await context.close(); });
await test("Reduced motion is honored", async () => { const { context, page } = await open("", { width:390, height:844 }, { reducedMotion:"reduce" }); await page.evaluate(() => window.__PALACE_WEB_QA__.reset()); await page.getByRole("button", { name:"Deal the cards" }).click(); const transition = await page.locator(".palace-card").first().evaluate((node) => getComputedStyle(node).transitionDuration); ok(transition === "0s", `transition ${transition}`); await context.close(); });

const widths = [[1440,900],[1366,768],[1024,768],[768,1024],[430,932],[390,844],[360,800]];
await test("Responsive entry and setup at seven required viewports", async () => { for (const [width,height] of widths) { const { context, page, errors } = await open("", { width,height }); await page.evaluate(() => window.__PALACE_WEB_QA__.reset()); ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `${width}: entry overflow`); await page.getByRole("button", { name:"Deal the cards" }).click(); await page.waitForSelector(".palace-app-frame.is-setup"); ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `${width}: setup overflow`); const clipped = await page.locator(".palace-app-frame button:visible").evaluateAll((nodes) => nodes.filter((node) => { const box=node.getBoundingClientRect(); return box.right > innerWidth + 1 || box.left < -1 || box.bottom > innerHeight + 1 || box.top < -1; }).map((node) => node.getAttribute("aria-label") || node.textContent.trim())); ok(!clipped.length, `${width}: clipped ${clipped.join(", ")}`); ok(errors.length === 0, `${width}: ${errors.join(" | ")}`); await context.close(); } });

await test("One complete game through rendered public controls", async () => {
  const { context, page, errors } = await open("", { width:390, height:844 });
  await page.evaluate(() => window.__PALACE_WEB_QA__.reset());
  await page.screenshot({ path:resolve(out,"web-entry-390x844.png"), fullPage:true });
  await page.getByRole("button", { name:"Deal the cards" }).click();
  await page.waitForSelector(".palace-app-frame.is-setup");
  await page.screenshot({ path:resolve(out,"web-01-setup.png") });
  const handCard = page.locator('.palace-hand [data-zone="hand"]').first();
  const upCard = page.locator('.palace-table-cards [data-zone="faceUp"]').first();
  await handCard.click(); await upCard.click();
  const afterSwap = await page.evaluate(() => window.__PALACE_WEB_QA__.snapshot().game.message);
  ok(afterSwap.includes("Swap made"), "setup swap did not use engine");
  await page.reload({ waitUntil:"networkidle" });
  const resumedPrivacy = page.locator("[data-continue-without-saving]");
  if (await resumedPrivacy.isVisible().catch(() => false)) await resumedPrivacy.click();
  await page.waitForSelector(".palace-app-frame.is-setup");
  ok((await page.evaluate(() => window.__PALACE_WEB_QA__.snapshot().record.status)) === "inProgress", "setup did not resume");
  await page.getByRole("button", { name:"Start hand" }).click();
  await page.screenshot({ path:resolve(out,"web-02-initial-hand.png") });
  const observed = new Set(["initial-hand"]);
  let actions = 0;
  let unchanged = 0;
  let priorFingerprint = "";
  while (!(await page.locator(".palace-complete").count()) && actions < 4000) {
    const snapshot = await page.evaluate(() => window.__PALACE_WEB_QA__.snapshot().game);
    if (!snapshot) break;
    const fingerprint = JSON.stringify([snapshot.currentPlayer, snapshot.status, snapshot.deck.length, snapshot.pile.map((card) => card.id), snapshot.players.map((player) => [player.hand.map((card) => card.id), player.faceUp.map((card) => card.id), player.faceDown.map((card) => card.id)])]);
    unchanged = fingerprint === priorFingerprint ? unchanged + 1 : 0;
    priorFingerprint = fingerprint;
    if (unchanged > 80) throw new Error(`rendered game stalled: ${JSON.stringify({ revision:snapshot.revision, currentPlayer:snapshot.currentPlayer, status:snapshot.status, pile:snapshot.pile.length, deck:snapshot.deck.length, message:snapshot.message, jumpInWindow:snapshot.jumpInWindow, players:snapshot.players.map((player) => ({ hand:player.hand.length, faceUp:player.faceUp.length, faceDown:player.faceDown.length })) })}`);
    const human = snapshot.players[0];
    const phase = human.hand.length ? "hand" : human.faceUp.length ? "face-up" : human.faceDown.length ? "face-down" : "out";
    if (snapshot.currentPlayer === 0) observed.add("human-turn"); else observed.add("bot-turn");
    if (snapshot.lastEvent?.type === "pickup") observed.add("pickup");
    if (["clear","reset"].includes(snapshot.lastEvent?.type)) observed.add("special");
    if (snapshot.deck.length <= 6) observed.add("draw-low");
    if (phase === "face-up") observed.add("face-up");
    if (phase === "face-down") observed.add("face-down");
    const shotMap = { "human-turn":"web-03-human-turn.png", "bot-turn":"web-04-bot-turn.png", special:"web-05-special.png", pickup:"web-06-pickup.png", "draw-low":"web-07-draw-nearly-exhausted.png", "face-up":"web-08-face-up.png", "face-down":"web-09-face-down.png" };
    for (const [state,name] of Object.entries(shotMap)) if (observed.has(state) && !observed.has(`shot-${state}`)) { await page.screenshot({ path:resolve(out,name) }); observed.add(`shot-${state}`); }
    if (snapshot.currentPlayer === 0) {
      const pickup = page.locator("[data-pickup]");
      const playSelected = page.locator("[data-play-selected]");
      const jump = page.locator("[data-jump]");
      if (await pickup.count()) await pickup.click();
      else if (await playSelected.count()) await playSelected.click();
      else if (await jump.count()) await jump.waitFor({ state:"detached", timeout:3500 });
      else {
        const cards = page.locator(".palace-human-zone .palace-card:not(:disabled)");
        const count = await cards.count();
        ok(count > 0, `no human control at action ${actions}: ${snapshot.message}`);
        await cards.first().focus();
        await page.keyboard.press("Enter");
        if (await page.locator("[data-play-selected]").count()) await page.locator("[data-play-selected]").click();
      }
    } else await page.waitForTimeout(12);
    actions += 1;
  }
  ok(await page.locator(".palace-complete").isVisible(), `game did not finish in ${actions} actions`);
  await page.screenshot({ path:resolve(out,"web-10-game-over.png") });
  const completed = await page.evaluate(() => window.__PALACE_WEB_QA__.snapshot().record);
  ok(completed.status === "completed", "completion not persisted");
  ok(Number.isInteger(completed.result.winnerIndex), "winner not persisted");
  await page.reload({ waitUntil:"networkidle" });
  ok(await page.getByText("GAME COMPLETE", { exact:true }).isVisible(), "completion missing after refresh");
  ok(await page.getByRole("button", { name:/Deal|Play Again/i }).count() === 0, "second game offered");
  ok(errors.length === 0, errors.join(" | "));
  writeFileSync(resolve(out,"e2e-observed-states.json"), JSON.stringify({ actions, observed:[...observed].filter((item) => !item.startsWith("shot-")), completed:completed.result }, null, 2));
  await context.close();
});

await test("Production interface does not expose QA reset", async () => { const context = await browser.newContext({ viewport:{ width:390,height:844 } }); const page = await context.newPage(); await page.goto("http://127.0.0.1:4217/palace-play.html", { waitUntil:"networkidle" }); ok(await page.evaluate(() => !("__PALACE_WEB_QA__" in window)), "QA hook exposed"); ok(await page.locator("text=Reset game").count() === 0, "reset UI exposed"); await context.close(); });

const report = { generatedAt:new Date().toISOString(), sourceCommit:"31c7578a3a15db6d3ac78a3c5d332d73a9353afd", passed:results.filter((item) => item.status === "pass").length, failed:failures.length, results };
writeFileSync(resolve(out,"browser-results.json"), JSON.stringify(report,null,2));
await browser.close();
await new Promise((resolveClose) => server.close(resolveClose));
if (failures.length) { console.error(JSON.stringify(failures,null,2)); process.exit(1); }
console.log(`Palace web browser QA passed: ${results.length} gates and one complete rendered game.`);