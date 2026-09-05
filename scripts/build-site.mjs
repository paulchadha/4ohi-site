import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { resolve } from "node:path";
import { thumbCommandPage } from "./thumb-command-content.mjs";
import { appCatalog, featuredGames, gameByKey, gameCatalog, primaryGames, productCatalog, productGroups } from "./studio-product-manifest.mjs";
import { gamesPage, homepage, lifestylePage, productPage } from "./production-pages.mjs";
import { privacyCopy } from "./privacy-copy.mjs";
import { bobbyPage, evilDoomPage, heartStackPage, princessLandPage, unicornLandPage } from "./studio-world-pages.mjs";
import { gildenspirePageContent } from "./gildenspire-content.mjs";
import { booyangCityPage, funkyTownPage, sleepAmigoPage, whomlyPage } from "./studio-expansion-pages.mjs";

const root = resolve(import.meta.dirname, "..");
const assetVersion = (assetPath) => {
  const clean = assetPath.split("?")[0];
  const disk = resolve(root, clean);
  if (!existsSync(disk)) return assetPath;
  const hash = createHash("sha256").update(readFileSync(disk)).digest("hex").slice(0, 12);
  return `${clean}?v=${hash}`;
};
const fingerprintMarkup = (content) => content.replace(/\b(src|href)="(assets\/[^"?]+\.(?:css|js|png|webp|jpg|svg))"/g, (_, attribute, path) => `${attribute}="${assetVersion(path)}"`);
const news = JSON.parse(readFileSync(resolve(root, "content", "news.json"), "utf8"));
const siteUrl = "https://4ohi.com";
const company = "Four of Hearts Interactive, LLC";
const locales = ["en", "fr", "es", "hi", "zh-Hans", "he", "ar", "en-CA"];

const write = (file, content) => writeFileSync(resolve(root, file), `${(file.endsWith(".html") ? fingerprintMarkup(content) : content).trim().replace(/[ \t]+$/gm, "")}\n`, "utf8");
const formatDate = (date) => new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" }).format(new Date(`${date}T00:00:00Z`));
const articleFile = (slug) => `news-${slug}.html`;
const gameToken = (key = "gameName", fallback = "Palace") => `<span data-game-token="${key}">${fallback}</span>`;
const gameMessage = (key, fallback) => `<span data-game-message="${key}">${fallback}</span>`;
const productCopy = (value) => String(value).replaceAll("Palace", gameToken("gameName", "Palace"));
const brandMessage = (key, fallback) => `<span data-brand-message="${key}">${fallback}</span>`;
const localeCopy = (en, ca) => `<span data-copy-en="${en.replaceAll('"','&quot;')}" data-copy-ca="${ca.replaceAll('"','&quot;')}">${en}</span>`;
const assetManifest = Object.fromEntries(readdirSync(resolve(root, "assets"), { withFileTypes: true }).filter((entry) => entry.isFile() && entry.name !== "asset-manifest.js").map((entry) => [`assets/${entry.name}`, assetVersion(`assets/${entry.name}`)]));
write("assets/asset-manifest.js", `window.FOUR_HEARTS_ASSETS = Object.freeze(${JSON.stringify(assetManifest, null, 2)});`);

const nav = (current) => {
  const navItem = (product) => `<a href="${product.infoUrl}"${product.key === current ? ' aria-current="page"' : ""}><strong>${product.shortTitle}</strong><small>${product.type}</small></a>`;
  const group = (label, key) => `<section class="games-menu-section menu-${key}"><h2>${label}</h2><div>${productGroups[key].map(navItem).join("")}</div></section>`;
  const gamesMenu = `${group("Card Games","card-games")}${group("Arcade, Defense & Adventure","arcade-adventure")}${group("Puzzle & Creative Play","puzzle-creative")}<a class="view-all-games" href="games.html">View All Games →</a>`;
  const appsMenu = appCatalog.map(navItem).join("");
  return `<header class="site-header"><div class="shell nav-wrap"><a class="brand" href="index.html"${current === "home" ? ' aria-current="page"' : ""}><img class="brand-logo" src="assets/brand-mark-4oh.webp" alt="" width="76" height="58"><span class="brand-copy">Four of Hearts<small>Interactive</small></span><span class="sr-only">Four of Hearts Interactive home</span></a><button class="menu-toggle" type="button" aria-expanded="false" aria-controls="primary-navigation">Menu</button><nav class="site-nav" id="primary-navigation" data-open="false" aria-label="Primary"><details class="games-menu"${current === "games" ? " data-current=true" : ""}><summary>Games <span aria-hidden="true">+</span></summary><div class="games-menu-panel">${gamesMenu}</div></details><details class="nav-lifestyle"${current === "lifestyle" ? " data-current=true" : ""}><summary>Lifestyle Apps</summary><div class="nav-lifestyle-panel">${appsMenu}<a href="lifestyle-apps.html"><strong>View Lifestyle Apps</strong></a></div></details><a href="news.html"${current === "news" ? ' aria-current="page"' : ""}>News</a><a href="about.html"${current === "about" ? ' aria-current="page"' : ""}>About</a><a href="support.html"${current === "support" ? ' aria-current="page"' : ""}>Support</a><a class="nav-play-palace" href="palace-play.html"${current === "play" ? ' aria-current="page"' : ""}>Play Palace</a></nav><div class="header-tools" aria-label="Site preferences"><label class="header-language"><span class="sr-only">Language</span><select data-locale aria-label="Language"></select></label><button class="header-settings" type="button" data-open-settings aria-label="Open settings">⚙</button></div></div></header>`;
};
const globalDialogs = () => `
  <dialog class="site-dialog" data-settings-dialog aria-labelledby="settings-title">
    <form method="dialog"><button class="dialog-close" value="cancel" aria-label="Close settings">×</button>
      <p class="eyebrow">Site settings</p><h2 id="settings-title">Make the site comfortable.</h2>
      <label class="dialog-language"><span data-language-label>Language</span><select data-locale></select></label>
      <p>Language and table-name choices are not stored. The complete Palace browser game stores its progress and sound/motion choices only on this device. A privacy-choice cookie is used only if you ask us to remember that optional cookies must stay off.</p>
    </form>
  </dialog>
  <section class="privacy-banner" data-privacy-banner aria-labelledby="privacy-banner-title" hidden>
    <div><p class="eyebrow">Your privacy choices</p><h2 id="privacy-banner-title">Optional cookies are off.</h2><p>4OH does not load analytics, advertising, or cross-site tracking. You can ask us to remember that choice with one strictly necessary preference cookie.</p></div>
    <div class="privacy-banner-actions"><button class="button" type="button" data-reject-optional>Reject optional cookies</button><button class="button secondary" type="button" data-open-privacy>Review choices</button><button class="privacy-continue" type="button" data-continue-without-saving>Continue without saving</button></div>
  </section>
  <dialog class="site-dialog privacy-dialog" data-privacy-dialog aria-labelledby="privacy-dialog-title">
    <form method="dialog"><button class="dialog-close" value="cancel" aria-label="Close privacy choices">×</button>
      <p class="eyebrow">Privacy control center</p><h2 id="privacy-dialog-title">Your privacy choices</h2>
      <p data-gpc-status class="gpc-status" role="status"></p>
      <div class="privacy-choice-list">
        <label><span><strong>Strictly necessary</strong><small>Site delivery and, only when requested, your opt-out preference.</small></span><input type="checkbox" checked disabled aria-label="Strictly necessary cookies always active"></label>
        <label><span><strong>Analytics</strong><small>No analytics service is installed.</small></span><input type="checkbox" disabled aria-label="Analytics cookies off"></label>
        <label><span><strong>Advertising and cross-site tracking</strong><small>No advertising pixels, profiling, sale, or sharing are used.</small></span><input type="checkbox" disabled aria-label="Advertising cookies off"></label>
        <label><span><strong>Personalization</strong><small>Game and language choices remain in the page or URL, not a cookie.</small></span><input type="checkbox" disabled aria-label="Personalization cookies off"></label>
      </div>
      <p class="privacy-current" data-privacy-current aria-live="polite"></p>
      <div class="actions"><button class="button" value="save" data-reject-optional>Save optional cookies off</button><button class="button secondary" value="cancel">Cancel</button></div>
      <p><a href="privacy.html#california-notice">Read the California Privacy Policy and Notice at Collection</a></p>
    </form>
  </dialog>`;

const palaceDialogs = () => `
  <dialog class="site-dialog nsfw-dialog" data-nsfw-dialog aria-labelledby="traditional-name-title">
    <form method="dialog"><p class="eyebrow">Traditional table name</p><h2 id="traditional-name-title">Use the uncensored name?</h2>
      <p>Some adult tables call this game Shithead. This optional display name changes only this page URL and is never stored.</p>
      <div class="actions"><button class="button" value="yes">Yes, use it</button><button class="button secondary" value="no">No, keep Shed</button></div>
    </form>
  </dialog>`;

const gameNav = (game, section) => {
  const links = game === "palace"
    ? [["overview", "palace.html", "Overview"], ["rules", "palace-faq.html", "How to Play"], ["play", "palace-play.html", "Play Palace"], ["news", "news.html?tag=palace", "Palace News"]]
    : [["overview", "games/thumb-command/", "Overview"], ["mission", "games/thumb-command/#mission", "Mission"], ["gameplay", "games/thumb-command/#gameplay", "Gameplay"], ["cities", "games/thumb-command/#cities", "City Campaign"], ["gallery", "games/thumb-command/#gallery", "Gallery"], ["news", "news.html?tag=thumb-command", "News"]];
  return `<nav class="game-subnav" aria-label="${game === "palace" ? "Palace" : "Thumb Command"}">
    <div class="shell"><strong>${game === "palace" ? "Palace" : "Thumb Command"}</strong>
      <div>${links.map(([key, href, label]) => `<a href="${href}"${key === section ? ' aria-current="page"' : ""}>${label}</a>`).join("")}${game === "thumb-command" ? '<span class="status-badge">In Development</span>' : ""}</div>
    </div>
  </nav>`;
};

const palaceTableTools = () => `<aside class="palace-table-tools" data-palace-context aria-label="Palace table preferences">
  <span data-table-label>This table calls it</span>
  <details><summary><span data-current-game>Palace</span></summary><div>
    <button type="button" data-name-choice="Palace" aria-pressed="true">Palace</button>
    <button type="button" data-name-choice="Shed" aria-pressed="false">Shed</button>
  </div></details>
  <p data-name-status class="sr-only" aria-live="polite">Palace is used at this table. Nothing is stored.</p>
  ${palaceDialogs()}
</aside>`;

const footer = () => `<footer class="site-footer">
  <div class="shell"><div class="footer-grid footer-grid-editorial">
    <div class="footer-brand"><div class="footer-title"><span aria-hidden="true">♥</span><strong>${company}</strong></div><p class="footer-promise">Games with heart. Apps with purpose.</p><p class="footer-copy">Independent software from South Dakota.</p><a href="mailto:support@4ohi.com">support@4ohi.com</a><div class="social-slot" data-social-slot aria-label="Official social profiles"></div></div>
    <nav class="footer-group" aria-label="Games"><h2>Games</h2><a href="gildenspire.html">GildenSpire</a><a href="games/thumb-command/">Thumb Command</a><a href="bobby-the-breadasaurus.html">Bobby the Breadasaurus</a><a href="games/evil-doom-boy/">Evil Doom Boy</a><a href="heartstack-unicorn-blast.html">HeartStack Unicorn Blast</a><a href="princess-land-adventures.html">Princess Land</a><a href="unicorn-land-adventures.html">Unicorn Land</a><a href="booyang-city.html">BooYang City</a><a href="funky-town.html">Funky Town</a></nav>
    <nav class="footer-group" aria-label="Card games"><h2>Card Games</h2><a href="palace.html">Palace</a><a href="hearts-play.html">Hearts</a><a href="spades-play.html">Spades</a><a href="euchre-play.html">Euchre</a><a href="solitaire.html">Solitaire</a><a href="war.html">War</a></nav>
    <nav class="footer-group" aria-label="Applications"><h2>Apps</h2><a href="lifestyle-apps.html">All Apps</a><a href="whomly.html">Whomly</a><a href="sleep-amigo.html">Sleep Amigo</a></nav>
    <nav class="footer-group" aria-label="Company"><h2>Company</h2><a href="about.html">About</a><a href="about.html#south-dakota">South Dakota</a><a href="news.html">News</a><a href="support.html">Support</a><a href="contact.html">Contact</a></nav>
    <nav class="footer-group footer-trust" aria-label="Trust"><h2>Trust</h2><a href="privacy.html">Privacy Approach</a><button class="footer-privacy-button" type="button" data-open-privacy>Your Privacy Choices</button><a href="privacy.html#do-not-sell">Do Not Sell or Share</a><a href="security.html">Security</a><a href="terms.html">Terms</a></nav>
  </div><div class="footer-bottom"><span>© 2026 ${company}. All rights reserved.</span><span>Thanks for playing.</span></div></div>
</footer>`;

const head = ({ title, description, path, image = "assets/og-palace-app-world.jpg", imageAlt = "Four of Hearts Interactive", type = "website", jsonLd, noindex = false, script = "" }) => {
  const structuredData = jsonLd ? JSON.stringify(jsonLd) : "";
  const structuredDataHash = structuredData ? createHash("sha256").update(structuredData).digest("base64") : "";
  const contentPolicy = `default-src 'self'; base-uri 'self'; object-src 'none'; form-action 'none'; img-src 'self' data:; style-src 'self' 'unsafe-inline'; script-src 'self'${structuredDataHash ? ` 'sha256-${structuredDataHash}'` : ""}; connect-src 'self'; media-src 'self'; font-src 'self'; upgrade-insecure-requests`;
  const canonical = `${siteUrl}${path}`;
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${title}</title>
  <meta http-equiv="Content-Security-Policy" content="${contentPolicy}">
  <meta name="description" content="${description}">
  ${noindex ? '<meta name="robots" content="noindex">' : ""}
  <link rel="canonical" href="${canonical}">
  ${locales.map((locale) => `<link rel="alternate" hreflang="${locale}" href="${canonical}?lang=${locale}">`).join("\n  ")}
  <link rel="alternate" hreflang="x-default" href="${canonical}">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${description}">
  <meta property="og:type" content="${type}">
  <meta property="og:url" content="${canonical}">
  <meta property="og:image" content="${siteUrl}/${image}">
  <meta property="og:image:alt" content="${imageAlt}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="theme-color" content="#26b7f2">
  <link rel="icon" type="image/png" href="assets/favicon.png">
  <link rel="apple-touch-icon" href="assets/apple-touch-icon.png">
  <link rel="stylesheet" href="assets/studio-reconstruction.css">
  <link rel="stylesheet" href="assets/playable-studio.css">
  <link rel="stylesheet" href="assets/studio-portfolio.css">
  <link rel="stylesheet" href="assets/studio-catalog.css">
  <link rel="stylesheet" href="assets/studio-fixes.css">
  <link rel="stylesheet" href="assets/founder-corrections.css">
  <link rel="stylesheet" href="assets/thumb-command.css">
  <link rel="stylesheet" href="assets/privacy-center.css">
  <link rel="stylesheet" href="assets/production-2026.css">
  <link rel="stylesheet" href="assets/gildenspire.css">
  <link rel="stylesheet" href="assets/studio-expansion.css">
  <script src="assets/asset-manifest.js" defer></script>
  <script src="assets/site-config.js" defer></script>
  <script src="assets/site.js" defer></script>
  <script src="assets/privacy-center.js" defer></script>
  <script src="assets/canadian-copy.js" defer></script>
  <script src="assets/canadian-copy-v2.js" defer></script>
  <script src="assets/launch-countdown.js" defer></script>
  <script src="assets/product-authority.js" defer></script>
  <script src="assets/release-strip.js" defer></script>
  <script src="assets/power-cards.js" defer></script>
  <script src="assets/studio-reconstruction.js" defer></script>
  <script src="assets/playable-studio.js" defer></script>
  <script src="assets/studio-portfolio.js" defer></script>
  <script src="assets/canadian-mode.js" defer></script>
  <script src="assets/production-locales.js" defer></script>
  ${script}
  ${structuredData ? `<script type="application/ld+json">${structuredData}</script>` : ""}
</head>`;
};

const page = ({ title, description, path, current, content, image, imageAlt, type, jsonLd, noindex, script, bodyClass = "" }) => `${head({ title, description, path, image, imageAlt, type, jsonLd, noindex, script })}
<body class="${bodyClass}">
  <a class="skip-link" href="#main">Skip to content</a>
  ${nav(current)}
  ${["palace", "play"].includes(current) ? `<div class="release-strip" data-release-strip role="timer"></div>` : ""}
  <main id="main">${content}</main>
  ${footer()}
  ${globalDialogs()}
</body>
</html>`;

const pageHero = (eyebrow, title, lede, actions = "") => `<header class="page-hero">
  <div class="shell">
    <p class="eyebrow">${eyebrow}</p>
    <h1>${title}</h1>
    <p class="lede">${lede}</p>
    ${actions}
  </div>
</header>`;

const availabilityCopy = (item) => {
  if (item.gameKey === "palace") return "Palace has a complete, single-game browser edition and remains in founder review.";
  if (item.gameKey === "gildenspire") return "GildenSpire is in development and is not publicly downloadable. No release date or platform has been announced.";
  if (item.gameKey === "thumb-command") return "Thumb Command is in development with no public build or announced release date. This article documents the current creative direction.";
  if (item.gameKey === "bobby") return "Bobby the Breadasaurus is in concept development and is not publicly playable. No release date or platform has been announced.";
  if (item.gameKey === "evil-doom") return "Evil Doom Boy is one action-adventure game with two selectable heroes. It is in development and is not publicly playable. No release date or platform has been announced.";
  return "This article reports current company work and does not announce public availability.";
};

const newsCard = (item) => `<a class="panel news-card" href="${articleFile(item.slug)}" data-news-tags="${[item.category, item.gameKey, ...(item.tags ?? [])].filter(Boolean).join(" ").toLowerCase()}" data-reveal>
  <div class="news-art"><img src="${item.image}" alt="${item.imageAlt}" width="512" height="512" loading="lazy"></div>
  <div class="news-body">
    <div class="news-meta"><span>${item.category}${item.gameKey ? ` · ${gameByKey[item.gameKey]?.title ?? item.gameKey}` : ""}</span><time datetime="${item.date}">${formatDate(item.date)}</time></div>
    <h2>${productCopy(item.title)}</h2>
    <p>${productCopy(item.description)}</p>
    <span class="read-more">Read story →</span>
  </div>
</a>`;

const gameCard = (game, heading = "h2") => `<article class="catalog-card ${game.key}" data-game-key="${game.key}">
  <a class="catalog-art" href="${game.infoUrl}"><img src="${game.artwork}" alt="${game.alt}" width="960" height="${960}" loading="lazy"></a>
  <div class="catalog-copy"><div class="catalog-meta"><span class="status-badge">${game.status}</span><span>${game.genre}</span></div>
  <${heading}><a href="${game.infoUrl}">${game.title}</a></${heading}><p>${game.description}</p><p class="availability">${game.availability}</p>
  <div class="actions"><a class="button small" href="${game.infoUrl}">Overview</a>${game.playUrl ? `<a class="button small secondary" href="${game.playUrl}">${game.playLabel}</a>` : ""}</div></div>
</article>`;

const spatialWorld = (game, index) => `<article class="spatial-world ${game.key}${index === 0 ? " is-active" : ""}" data-spatial-world data-world-index="${index}" data-game-key="${game.key}" data-title="${game.title}" data-description="${game.description}" data-status="${game.status}" data-href="${game.key === "palace" ? game.playUrl : game.infoUrl}" data-action="${game.key === "palace" ? "Play Palace" : game.key === "thumb-command" ? "Meet Thumb Command" : "See " + game.title}"${index === 0 ? "" : ' aria-hidden="true"'}>
  <a href="${game.key === "palace" ? game.playUrl : game.infoUrl}" class="world-art-link"${index === 0 ? "" : ' tabindex="-1"'}>
    <span class="world-number">0${index + 1}</span>
    <img src="${game.artwork}" alt="${game.alt}" width="960" height="${960}"${index === 0 ? ' fetchpriority="high"' : ' loading="lazy"'}>
  </a>
</article>`;

const worldIndexRow = (game, index) => `<a class="world-index-row" href="${game.infoUrl}" data-game-key="${game.key}"><span>0${index + 1}</span><strong>${game.title}</strong><em>${game.genre}</em><small>${game.status}</small><img src="${game.artwork}" alt="" width="240" height="240" loading="lazy"></a>`;

const featured = news.find((item) => item.featured) ?? news[0];
const otherNews = news.filter((item) => item !== featured);

write("index.html", page({
  title: "Four of Hearts Interactive | Games, Software Solutions & Custom Apps",
  description: "Four of Hearts Interactive is an independent South Dakota software studio building original games, practical software solutions, and custom applications.",
  path: "/",
  current: "home",
  bodyClass: "company-home playable-studio-home",
  image: "assets/portfolio-2026/four-of-hearts-studio-portfolio-board.webp",
  imageAlt: "Four of Hearts Interactive game and application portfolio",
  jsonLd: { "@context":"https://schema.org", "@type":"Organization", name:company, alternateName:"4OH", slogan:"Independent software. Built with a point of view.", url:siteUrl + "/", logo:siteUrl + "/assets/brand-mark-4oh.webp", email:"support@4ohi.com", description:"An independent South Dakota software studio creating original games, practical software solutions, and custom applications." },
  content: homepage({ groups:productGroups, apps:appCatalog, news, articleFile, formatDate })
}));

write("palace.html", page({
  title: "Palace | Four of Hearts Interactive",
  description: "Discover Palace from Four of Hearts Interactive: match or beat, master four power cards, and survive the final hidden card.",
  path: "/palace.html", current: "palace", image: "assets/icon-palace-4hearts.webp", imageAlt: "Palace castle artwork", bodyClass: "palace-product",
  jsonLd: { "@context":"https://schema.org", "@type":"Game", name:"Palace", description:"A three-level shedding card game in Internal Alpha at Four of Hearts Interactive.", publisher:{"@type":"Organization",name:company}, url:`${siteUrl}/palace.html`, gameItem:"Standard playing cards" },
  content: `
    ${pageHero("The Four of Hearts flagship", gameToken("gameName", "Palace") + " is calling.", "Match it. Beat it. Burn it. Rule the table. The card-table legend is finally becoming an app.", `<div class="hero-status-line"><span>Internal Alpha</span><span>Founder testing underway</span></div><div class="actions"><a class="button" href="palace-play.html">${gameMessage("playGame", "Play Palace")}</a><a class="button secondary" href="#rules">How to play</a></div>`)}
    <section class="product-manifesto"><div class="shell"><div class="manifesto-line"><b>01</b><div><p class="eyebrow">Immediate</p><h2>Match it or climb higher.</h2><p>Read the top card. Play the same rank or anything higher. One rule gets everyone into the game; every card you save shapes the ending.</p></div></div><div class="manifesto-line"><b>02</b><div><p class="eyebrow">Explosive</p><h2>Power cards rewrite the table.</h2><p>Two resets. Seven forces lower. Eight turns transparent. Ten burns the pile. These are the Four of Hearts rules.</p></div></div><div class="manifesto-line"><b>03</b><div><p class="eyebrow">Unforgettable</p><h2>The last cards are a mystery.</h2><p>Finish your hand, then your face-up row, then reveal the face-down finale one card at a time.</p></div></div></div></section>
    <section class="power-card-world compact-power-section" id="rules" aria-labelledby="product-power-title"><div class="shell">
      <div class="power-heading"><p class="eyebrow">The cards that change everything</p><h2 id="product-power-title">Power Cards</h2><p>Special powers follow the rank, whatever suit is printed on the card.</p></div>
      <div class="power-showcase" data-power-showcase data-active-power="2">
        <div class="power-card-fan" role="group" aria-label="Interactive power cards">
          <button class="power-playing-card" type="button" data-power="2" aria-pressed="true" aria-label="2 of clubs. Reset. Anything may follow."><span class="rank">2<small>♣</small></span><span class="pip">♣</span><span class="rule"><b>RESET</b><span>Anything may follow.</span></span><span class="rank bottom">2<small>♣</small></span></button>
          <button class="power-playing-card red" type="button" data-power="7" aria-pressed="false" aria-label="7 of diamonds. Lower. Seven or lower must follow."><span class="rank">7<small>♦</small></span><span class="pip">♦</span><span class="rule"><b>LOWER</b><span>Seven or lower follows.</span></span><span class="rank bottom">7<small>♦</small></span></button>
          <button class="power-playing-card" type="button" data-power="8" aria-pressed="false" aria-label="8 of spades. Transparent. Read through to the card below."><span class="rank">8<small>♠</small></span><span class="pip">♠</span><span class="rule"><b>TRANSPARENT</b><span>Read the card beneath.</span></span><span class="rank bottom">8<small>♠</small></span></button>
          <button class="power-playing-card red" type="button" data-power="10" aria-pressed="false" aria-label="10 of hearts. Burn. Clear the pile and lead again."><span class="rank">10<small>♥</small></span><span class="pip">♥</span><span class="rule"><b>BURN</b><span>Clear it. Lead again.</span></span><span class="rank bottom">10<small>♥</small></span></button>
        </div>
        <div class="power-live" data-power-live aria-live="polite"><b>2 resets the pile.</b><span>Anything may follow.</span><small>Control returns to the table.</small></div>
      </div>
    </div></section>
    <section class="section navy"><div class="shell story-split"><div><p class="eyebrow">Same game. Different tables.</p><h2>What do you call it?</h2><p class="lede">Palace and Shed are names used for the same wider game family. Change the displayed name for this page session; nothing is stored.</p></div><div class="name-console"><h3>Table name</h3><div class="name-options" role="group" aria-label="Choose the displayed game name"><button type="button" data-name-choice="Palace" aria-pressed="true">Palace</button><button type="button" data-name-choice="Shed" aria-pressed="false">Shed</button></div><p data-name-status role="status">Palace is used at this table. This choice resets when you refresh.</p><p class="name-secret" data-name-secret tabindex="-1" hidden>You found the name some tables whisper. Welcome to the founder’s table.</p></div></div></section>
    <section class="section"><div class="shell story-split"><img src="assets/icon-palace-4hearts.webp" alt="Palace castle with blue towers" width="512" height="512" loading="lazy"><div><p class="eyebrow">A game built to travel</p><h2>Passed hand to hand.</h2><p class="lede">Palace belongs to a folk shedding-game family with many regional names and house rules. The exact origin remains uncertain. The Four of Hearts edition gives that living tradition one clear rule set and an identity of its own.</p><div class="actions"><a class="button" href="palace-play.html">Take your seat</a><a class="text-link" href="palace-story.html">Fact, folklore & legend</a></div></div></div></section>
    <section class="section ct-home-feature"><div class="shell story-split"><picture><source media="(max-width:600px)" srcset="assets/thumb-command/thumb-command-app-icon-384.webp"><img src="assets/thumb-command/thumb-command-app-icon-768.webp" alt="Thumb Command Blueguard interceptor defending Earth" width="768" height="768" loading="lazy"></picture><div><p class="ct-kicker">In development at Four of Hearts</p><h2>Thumb Command</h2><p class="lede">Take command of Earth's last interceptor. Defend Chicago, San Francisco, New York, London, Tokyo, and cities around the world from a relentless alien invasion.</p><a class="ct-button" href="games/thumb-command/">Meet Thumb Command</a></div></div></section>`
}));
write("palace-play.html", page({
  title: "Play Palace | Complete Browser Game | Four of Hearts Interactive",
  description: "Play one complete game of Palace in your browser using the real Four of Hearts rules engine, local bots, and on-device progress saving.",
  path: "/palace-play.html", current: "play", image: "assets/icon-palace-4hearts.webp", imageAlt: "Palace castle and card-game artwork", bodyClass: "palace-play-page palace-web-page",
  script: '<link rel="stylesheet" href="assets/palace-web.css"><script type="module" src="assets/palace-web.js"></script>',
  content: `${gameNav("palace", "play")}${palaceTableTools()}<h1 class="sr-only">Play one complete game of Palace</h1><section class="palace-web-shell" aria-label="Palace browser game"><div id="palace-web-game" class="palace-web-game" tabindex="-1" aria-busy="true"><p class="palace-web-loading" role="status">Preparing the Palace table…</p></div><noscript><div class="notice">JavaScript is required for the complete Palace browser game. The full rules remain available on the Palace page.</div></noscript></section>`
}));write("palace-story.html", page({
  title: "Palace: Fact, Folklore & Legend | Four of Hearts",
  description: "Explore what is documented about Palace, what players pass along, and the clearly labeled legends that travel with the game.",
  path: "/palace-story.html", current: "palace", image: "assets/icon-palace-4hearts.webp", imageAlt: "Palace castle artwork",
  content: `${gameNav("palace", "story")}${pageHero("Fact · folklore · legend", "A game carried by memory.", "Palace has no single box, rulebook, or universally proven origin. Its history lives in sources, table tradition, and the stories players tell.")}<section class="history-triad"><article><p class="eyebrow">What we know</p><h2>A shedding game with many names.</h2><p>Published rules references describe a beating or shedding game usually played through cards in hand, face-up cards, and face-down cards. Names include Palace, Shed, Karma, China Hand, and regional variants. One traditional adult alternate name remains behind the site's opt-in Easter egg.</p><p><a class="text-link" href="https://www.pagat.com/beating/shithead.html" rel="noopener noreferrer">Read the Pagat source notes</a></p></article><article><p class="eyebrow">What players tell</p><h2>Every table changes it.</h2><p>House rules—especially the effects of special ranks—are part of the tradition. Players teach the game from memory, adapt it locally, and pass it to the next table. Exact origins remain uncertain.</p></article><article><p class="eyebrow">The legend of Palace</p><h2>A deck fits anywhere.</h2><p>In a barracks before dawn. Below deck, weeks from shore. Between flights. In a hostel, a dorm, a kitchen, or the last table still awake.</p><p><em>This is founder-supplied table lore and atmospheric storytelling—not verified historical reporting.</em></p></article></section><section class="section navy"><div class="narrow prose"><h2>The Four of Hearts rule set</h2><p>Four of Hearts uses a documented product rule set: 2 resets, 7 requires lower, 8 is transparent, and 10 burns. That consistency belongs to this adaptation; it is not presented as the only traditional way to play.</p><p class="notice">History and founder-biography language remain marked for founder and qualified editorial/legal review before commercial reliance.</p></div></section>`
}));
write("news.html", page({
  title: "News | Four of Hearts Interactive",
  description: "Company and game news from Four of Hearts Interactive, with accurate development and availability status.",
  path: "/news.html", current: "news", bodyClass: "news-page",
  content: `
    <section class="news-page-intro"><div class="shell"><header class="compact-page-heading"><p class="eyebrow">Four of Hearts Interactive newsroom</p><h1>News from the studio.</h1><p class="lede">Honest company and product updates—without invented dates, releases, player counts, or partnerships.</p></header>
      <div class="news-filters" role="group" aria-label="Filter news"><button type="button" data-news-filter="all" aria-pressed="true">All</button><button type="button" data-news-filter="games" aria-pressed="false">Games</button><button type="button" data-news-filter="card-table" aria-pressed="false">Card Table</button><button type="button" data-news-filter="lifestyle-apps" aria-pressed="false">Lifestyle Apps</button><button type="button" data-news-filter="company" aria-pressed="false">Company</button></div>
      <div class="news-grid company-news-grid">${[featured, ...otherNews].map(newsCard).join("")}</div>
      <p data-news-empty hidden>No stories match this filter.</p>
      <div class="actions"><a class="text-link" href="feed.xml">Subscribe via RSS</a></div>
    </div></section>`
}));

news.forEach((item, index) => {
  const previous = news[(index - 1 + news.length) % news.length];
  const next = news[(index + 1) % news.length];
  const body = item.body.map((section) => `<h2>${productCopy(section.heading)}</h2>${section.paragraphs.map((paragraph) => `<p>${productCopy(paragraph)}</p>`).join("")}`).join("");
  write(articleFile(item.slug), page({
    title: `${item.title} | Four of Hearts News`,
    description: item.description,
    path: `/${articleFile(item.slug)}`,
    current: "news",
    image: item.image,
    imageAlt: item.imageAlt,
    type: "article",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "NewsArticle",
      headline: item.title,
      description: item.description,
      datePublished: item.date,
      dateModified: item.date,
      image: `${siteUrl}/${item.image}`,
      author: { "@type": "Organization", name: company },
      publisher: { "@type": "Organization", name: company, logo: { "@type": "ImageObject", url: `${siteUrl}/assets/brand-mark-4oh.webp` } },
      mainEntityOfPage: `${siteUrl}/${articleFile(item.slug)}`
    },
    content: `
      <article>
        <header class="article-header shell">
          <div class="news-meta"><span>${item.category}</span><time datetime="${item.date}">${formatDate(item.date)}</time></div>
          <h1>${productCopy(item.title)}</h1><p class="lede">${productCopy(item.description)}</p>
        </header>
        <div class="shell"><img class="article-art" src="${item.image}" alt="${item.imageAlt}" width="1200" height="630"></div>
        <section class="section"><div class="shell article-layout">
          <div class="prose">${body}</div>
          <aside class="article-aside"><strong>Availability</strong><p>${availabilityCopy(item)}</p>${item.gameKey ? `<a class="text-link" href="${gameByKey[item.gameKey]?.infoUrl ?? "games.html"}">Visit ${gameByKey[item.gameKey]?.title ?? "the game"} →</a>` : ""}</aside>
        </div></section>
      </article>
      <section class="section navy"><div class="shell"><p class="eyebrow">Keep reading</p><div class="related-grid">
        <a class="panel feature-card text-link" href="${articleFile(previous.slug)}">${productCopy(previous.title)}</a>
        <a class="panel feature-card text-link" href="${articleFile(next.slug)}">${productCopy(next.title)}</a>
      </div></div></section>`
  }));
});

write("games.html", page({
  title: "Games | Four of Hearts Interactive",
  description: "Explore thirteen independent card, arcade, defense, adventure, puzzle, and creative games from 4OH Interactive.",
  path: "/games.html", current: "games", bodyClass: "production-page games-page",
  content: gamesPage({groups:productGroups})
}));

const relatedFor = (product) => productCatalog.filter((candidate) => candidate.key !== product.key && candidate.category === product.category).slice(0,3);
const productMarkup = (product) => page({
  title:`${product.title} | 4OH Interactive`,
  description:product.description,
  path:`/${product.infoUrl.replace(/index\.html$/,"")}`,
  current:product.category === "game" ? product.key : "lifestyle",
  bodyClass:`production-page product-${product.key}`,
  image:product.artwork, imageAlt:product.alt,
  jsonLd:{"@context":"https://schema.org","@type":product.category === "game" ? "VideoGame" : "SoftwareApplication",name:product.title,description:product.description,applicationCategory:product.type,operatingSystem:"In development",publisher:{"@type":"Organization",name:company},url:`${siteUrl}/${product.infoUrl}`},
  content:productPage({product,related:relatedFor(product),newsHref:product.secondaryAction})
});
const gildenspire = gameByKey.gildenspire;
const gildenspireMarkup = page({
  title:"GildenSpire | Flight or Fight | Four of Hearts Interactive",
  description:"GildenSpire is a new dragon flight-and-fight adventure from Four of Hearts Interactive. Raise your dragon, explore an enormous fantasy world, take to the skies, and fight your way toward legendary dragons.",
  path:"/gildenspire.html", current:"gildenspire", bodyClass:"production-page product-gildenspire",
  image:"assets/gildenspire/gildenspire-social-1200x630.jpg", imageAlt:gildenspire.alt,
  jsonLd:{"@context":"https://schema.org","@type":"VideoGame",name:"GildenSpire",description:gildenspire.description,genre:["Flight","Combat","Adventure"],gamePlatform:"In development",publisher:{"@type":"Organization",name:company},url:siteUrl+"/gildenspire.html"},
  content:gildenspirePageContent()
});
write("gildenspire.html", gildenspireMarkup);
const thumbCommandMarkup = productMarkup(gameByKey["thumb-command"]);
write("thumb-command.html", thumbCommandMarkup);
write("games/thumb-command/index.html", thumbCommandMarkup.replace("<head>", '<head><base href="../../">'));

const legacyRedirectPage = (title, target) => page({
  title: `${title} | Moved`, description: "This Four of Hearts Interactive page has moved to its canonical product route.",
  path: `/${target}`, current: "thumb-command", noindex: true,
  script: '<script src="assets/route-redirect.js" defer></script>',
  content: `<section class="page-hero"><div class="shell" data-route-target="${target}"><p class="eyebrow">Mission rerouted</p><h1>This page has moved.</h1><p class="lede">Continue to the canonical Four of Hearts product page.</p><a class="button" href="${target}">Continue</a></div></section>`
});
write("games/commander-thum-b/index.html", legacyRedirectPage("Old game route", "games/thumb-command/").replace("<head>", '<head><base href="../../">') );
write("commander-thumb.html", legacyRedirectPage("Game page", "games/thumb-command/"));
write("people-lens.html", legacyRedirectPage("Whomly", "whomly.html"));
write("news-meet-sleep-amigo.html", legacyRedirectPage("Sleep Amigo development story", "news-making-sleep-data-feel-human.html"));
write("news-people-lens-joins-the-lifestyle-line.html", legacyRedirectPage("Whomly development story", "news-people-lens-is-becoming-whomly.html"));
write("news-commander-thumb-is-coming.html", legacyRedirectPage("Game announcement", "news-thumb-command-save-planet-earth.html"));
write("news-welcome-to-the-thum-system.html", legacyRedirectPage("World story", "news-the-city-is-the-base.html"));
write("news-building-commander-thumb.html", legacyRedirectPage("Development story", "news-meet-the-blueguard.html"));
write("news-shadow-run-enters-development.html", legacyRedirectPage("Development story", "news-evil-doom-two-heroes-one-route.html"));
write("evil-doom-adventures.html", legacyRedirectPage("Legacy Evil Doom route", "games/evil-doom-boy/"));
write("evil-doom-boy-adventures.html", legacyRedirectPage("Legacy Evil Doom Boy route", "games/evil-doom-boy/"));
write("evil-doom-girl-adventures.html", legacyRedirectPage("Legacy Evil Doom Girl route", "games/evil-doom-boy/"));
write("news-bobby-the-breadasaurus-joins-the-family.html", legacyRedirectPage("Bobby story", "news-bobby-and-the-breadstone.html"));
write("news-bobby-tower-defense-takes-shape.html", legacyRedirectPage("Bobby development story", "news-bobby-and-the-breadstone.html"));
write("news-building-a-safer-card-table.html", legacyRedirectPage("Card-table story", "news-card-table-adds-solitaire-war.html"));
write("news-designing-the-alien-invasion.html", legacyRedirectPage("Thumb Command design story", "news-thumb-command-save-planet-earth.html"));
write("news-evil-doom-girl-enters-development.html", legacyRedirectPage("Evil Doom story", "news-evil-doom-two-heroes-one-route.html"));
write("news-evil-doom-two-heroes-one-adventure.html", legacyRedirectPage("Evil Doom story", "news-evil-doom-two-heroes-one-route.html"));
write("news-heartstack-unicorn-blast-development.html", legacyRedirectPage("HeartStack story", "news-heartstack-joins-the-workbench.html"));
write("news-meet-the-blueguard.html", legacyRedirectPage("Thumb Command story", "news-thumb-command-save-planet-earth.html"));
write("news-meet-the-four-games.html", legacyRedirectPage("Studio lineup", "games.html"));
write("news-palace-enters-founder-testing.html", legacyRedirectPage("Palace review", "news-palace-019-founder-review.html"));
write("news-princess-land-adventures-development.html", legacyRedirectPage("Princess Land story", "news-inside-princess-land-adventures.html"));
write("news-the-city-is-the-base.html", legacyRedirectPage("Thumb Command story", "news-thumb-command-save-planet-earth.html"));
write("news-thumb-command-world-tour.html", legacyRedirectPage("Thumb Command story", "news-thumb-command-save-planet-earth.html"));
write("news-unicorn-land-adventures-development.html", legacyRedirectPage("Unicorn Land story", "news-building-unicorn-land-adventures.html"));
write("news-welcome-to-four-of-hearts.html", legacyRedirectPage("Studio news", "news.html"));
write("news-why-were-building-palace.html", legacyRedirectPage("Palace story", "news-palace-019-founder-review.html"));
["bobby","heartstack","princess-land","unicorn-land","solitaire","war"].forEach((key) => write(gameByKey[key].infoUrl, productMarkup(gameByKey[key])));
write("booyang-city.html", booyangCityPage({page,company,siteUrl,game:gameByKey["booyang-city"]}));
write("funky-town.html", funkyTownPage({page,company,siteUrl,game:gameByKey["funky-town"]}));
const evilDoomMarkup = evilDoomPage({ page, company, siteUrl, game: gameByKey["evil-doom"] });
mkdirSync(resolve(root, "games/evil-doom-boy"), { recursive: true });
write("games/evil-doom-boy/index.html", evilDoomMarkup.replace("<head>", '<head><base href="../../">'));
write("lifestyle-apps.html", page({
  title:"Lifestyle Apps | 4OH Interactive",
  description:"Whomly and Sleep Amigo are purposeful lifestyle applications in development at Four of Hearts Interactive.",
  path:"/lifestyle-apps.html", current:"lifestyle", bodyClass:"production-page lifestyle-page",
  content:lifestylePage({apps:appCatalog})
}));
write("whomly.html", whomlyPage({page,company,siteUrl,product:gameByKey.whomly}));
write("sleep-amigo.html", sleepAmigoPage({page,company,siteUrl,product:gameByKey["sleep-amigo"]}));

const secondaryPages = [
  ["hearts", "Hearts", "Follow suit. Duck the points.", "assets/icon-hearts-4hearts.webp", "Hearts ruby artwork"],
  ["spades", "Spades", "Bid together. Let trump speak.", "assets/icon-spades-4hearts.webp", "Spades purple artwork"],
  ["euchre", "Euchre", "Call trump. Find the bowers.", "assets/icon-euchre-4hearts.webp", "Euchre green artwork"]
];

secondaryPages.forEach(([key, name, headline, image, imageAlt]) => {
  write(`${key}-play.html`, page({
    title: `${name} Quick Play | Four of Hearts Interactive`,
    description: `Try two accessible ${name} teaching decisions from Four of Hearts Interactive. No account, cookies, tracking, or saved progress.`,
    path: `/${key}-play.html`,
    current: "games",
    image,
    imageAlt,
    script: '<script src="assets/more-games-tutorial.js" defer></script>',
    content: `
      ${pageHero(`${name} quick play`, headline, `Two small table decisions from the ${name} Internal Alpha. This is a teaching preview, not a full game or public release.`)}
      <section class="section navy"><div class="shell secondary-tutorial" data-theme="${key}"><div class="tutorial-stage" data-secondary-tutorial="${key}" tabindex="-1" aria-label="${name} interactive lesson"></div></div></section>`
  }));
});

write("play.html", page({
  title: "Quick Play | Four of Hearts Interactive",
  description: "Play one complete browser game of Palace or try short Hearts, Spades, and Euchre teaching moments from the Four of Hearts portfolio.",
  path: "/play.html",
  current: "play",
  content: `
    ${pageHero("Quick Play", "Choose your table.", "Palace offers one complete browser game. Hearts, Spades, and Euchre each offer two friendly teaching decisions.")}
    <section class="section"><div class="shell">
      <div class="featured-news panel">
        <div class="news-art"><img src="assets/icon-palace-4hearts.webp" alt="Palace castle artwork" width="512" height="512"></div>
        <div class="news-body"><span class="alpha-badge">Complete browser game</span><h2>${gameToken("gameName", "Palace")}</h2><p>Clear all three layers through legal play, matching, pickup, special-card awareness, and one final hidden reveal.</p><a class="button" href="palace-play.html">${gameMessage("playGame", "Play Palace")}</a></div>
      </div>
      <div class="game-grid">
        <article class="panel game-tile hearts"><img src="assets/icon-hearts-4hearts.webp" alt="Hearts ruby artwork" width="512" height="512" loading="lazy"><div class="game-tile-content"><h3>Hearts</h3><a class="text-link" href="hearts-play.html">Follow suit</a></div></article>
        <article class="panel game-tile spades"><img src="assets/icon-spades-4hearts.webp" alt="Spades purple artwork" width="512" height="512" loading="lazy"><div class="game-tile-content"><h3>Spades</h3><a class="text-link" href="spades-play.html">Play trump</a></div></article>
        <article class="panel game-tile euchre"><img src="assets/icon-euchre-4hearts.webp" alt="Euchre green artwork" width="512" height="512" loading="lazy"><div class="game-tile-content"><h3>Euchre</h3><a class="text-link" href="euchre-play.html">Find the bowers</a></div></article><article class="panel game-tile thumb-command-tile"><picture><source media="(max-width:600px)" srcset="assets/thumb-command/thumb-command-app-icon-384.webp"><img src="assets/thumb-command/thumb-command-app-icon-768.webp" alt="Thumb Command Blueguard interceptor defending Earth" width="768" height="768" loading="lazy"></picture><div class="game-tile-content"><h3>Thumb Command</h3><a class="text-link" href="games/thumb-command/">Follow the mission</a></div></article>
      </div>
    </div></section>`
}));

write("about.html", page({ title: "About Four of Hearts Interactive | Independent Software Studio", description: "Four of Hearts Interactive is an independent software studio in South Dakota making original games and useful lifestyle apps.", path: "/about.html", current: "about", bodyClass: "about-page", content: `<section class="studio-bridge about-studio-hero" id="south-dakota"><div class="shell bridge-grid"><h1>Four of Hearts<br><em>Interactive.</em></h1><div><p class="eyebrow">Independent software from South Dakota.</p><p class="lede">${localeCopy("Four of Hearts Interactive is an independent software studio in South Dakota. We make original games and useful lifestyle apps with strong ideas, careful code, and respect for the people using them.","Four of Hearts Interactive is an independent software studio in South Dakota. We make original games and useful lifestyle apps with strong ideas, careful code, and respect for the people using them. Beauty.")}</p></div></div></section><section class="about-editorial"><div class="shell about-editorial-grid"><div><p class="eyebrow">What we make</p><h2>Fun games. Great apps.</h2><p>Original games, familiar card tables, productivity and lifestyle applications, plus fast custom builds for clients with a clear problem to solve.</p></div><div><p class="eyebrow">What we believe</p><h2>Care is part of the code.</h2><p>Customers deserve respect. Independent companies should still be allowed to make wonderfully strange things.</p><p>${localeCopy("Useful software does not need to know everything about you. We design for usefulness, not surveillance.","Useful software does not need to know everything about you. We design for usefulness, not surveillance. Seems fair.")}</p></div><div><p class="eyebrow">How we work</p><h2>Make it. Test it. Improve it.</h2><p>Careful engineering, thoughtful design, documentation, physical-device testing, accessibility, direct feedback, iteration, and privacy by design.</p></div><div id="the-name"><p class="eyebrow">Why Four of Hearts</p><h2>${localeCopy("4. Ohhh. I get it.","4. Ohhh. Beauty.")}</h2><p>${localeCopy("Four of Hearts became 4OH when somebody said it out loud and the name worked. No secret acronym. No corporate mythology. Just Four of Hearts said out loud.","Four of Hearts became 4OH when somebody said it out loud. We gave a polite little nod and kept the name. No secret acronym, bud.")}</p></div><div><p class="eyebrow">How we make money</p><h2>Customers pay for software.</h2><p>Good products cost money to build and maintain. We would rather charge clearly for useful work than let advertisers pay us to study the people using it.</p><a class="text-link" href="privacy.html#how-we-make-money">Read the business model →</a></div><div><p class="eyebrow">Old-school values</p><h2>Modern ambitions.</h2><p>Do the work carefully. Tell the truth about what is ready. Respect people’s time. Build for the long haul without losing the fun.</p><a class="text-link" href="privacy.html">Read our privacy approach →</a></div></div></section><section class="studio-services" aria-labelledby="about-services-title"><div class="shell services-grid"><div><p class="eyebrow">Creative technology studio</p><h2 id="about-services-title">Strong idea.<br><em>Working software.</em></h2></div><div class="services-copy"><p class="lede">Need a custom application or interactive prototype? We can move from a useful problem to working software quickly.</p><p>Clear scope. Direct communication. No inflated process theatre.</p><div class="actions"><a class="button" href="mailto:support@4ohi.com?subject=Custom%20application%20project">Talk about a project</a></div></div></div></section>` }));write("support.html", page({
  title: "Support | Four of Hearts Interactive",
  description: "Contact Four of Hearts Interactive support and learn what to include in a useful Internal Alpha test report.",
  path: "/support.html",
  current: "support",
  content: `
    ${pageHero("Player support", "Let’s get you back to the table.", brandMessage("supportIntro", "Something broke? Blame the dealer for thirty seconds, then tell us what happened."))}
    <section class="section"><div class="shell support-layout">
      <aside class="panel support-card"><p class="eyebrow">Contact support</p><h2>Email the team.</h2><p>Use one message per issue and include the game name in the subject line.</p><p><a class="button small" href="mailto:support@4ohi.com?subject=Internal%20Alpha%20support%20request">support@4ohi.com</a></p><p>Do not send passwords, authentication codes, private keys, or unrelated personal information.</p></aside>
      <div class="prose"><h2>What to include</h2><ul class="checklist"><li>Game name and app version</li><li>Device model and operating-system version</li><li>Steps that reproduce the issue</li><li>What you expected and what happened instead</li><li>A screenshot or short recording when it is safe and useful</li></ul>
      <h2>Helpful categories</h2><div class="values-grid"><div class="status-card"><div><h3>Installation</h3><p>Opening, updating, or device compatibility.</p></div></div><div class="status-card"><div><h3>Gameplay</h3><p>Rules, turns, cards, scoring, or visual state.</p></div></div><div class="status-card"><div><h3>Ranked or reconnect</h3><p>Match status, ratings, table return, or session recovery.</p></div></div><div class="status-card"><div><h3>Accessibility or other</h3><p>Focus, contrast, text, motion, audio, controls, or anything else.</p></div></div></div>
      <p class="notice">Support is provided for current testing without a guaranteed response time. Do not include private information that is not needed to understand the issue.</p></div>
    </div></section>`
}));

write("privacy.html", page({
  title: "California Privacy Policy & Choices | Four of Hearts Interactive",
  description: "California Privacy Policy, Notice at Collection, cookie choices, and consumer-rights information for Four of Hearts Interactive.",
  path: "/privacy.html", current: "",
  content: `${pageHero("Privacy and trust", privacyCopy.headline, privacyCopy.shortStatement, '<div class="actions"><button class="button" type="button" data-open-privacy>Open Your Privacy Choices</button><a class="button secondary" href="#formal-policy">Read the formal policy</a></div>')}<section class="privacy-human"><div class="shell privacy-human-grid"><article><p class="eyebrow">Why we chose this model</p><h2>Privacy isn’t a setting we buried somewhere.</h2><p>It is part of the architecture. Whenever we can keep something on your device, we do. We love data. We just do not think all of yours belongs to us. We make apps, not dossiers.</p></article><article><p class="eyebrow">What we don’t do</p><ul><li>No behavioral advertising on this website</li><li>No tracking pixels or cross-site profiling</li><li>No sale of personal data</li><li>No profiling children for advertising</li></ul></article><article><p class="eyebrow">What products may need</p><p>${privacyCopy.games}</p><p>Whomly, for example, would need to send a public-information search request to servers or providers. We will disclose vendors, purposes, retention, and controls before release.</p></article><article><p class="eyebrow">Kids</p><h2>Play should not become a profile.</h2><p>${privacyCopy.children}</p></article></div></section><section class="privacy-business" id="how-we-make-money"><div class="shell privacy-business-grid"><div><p class="eyebrow">How we make money</p><h2>${privacyCopy.businessModel}</h2><p>${privacyCopy.businessDetail}</p></div><div><h3>Buy the software. Keep it current.</h3><p>${privacyCopy.pricing}</p></div></div></section><section class="section navy"><div class="shell"><div class="privacy-dashboard" aria-label="Website privacy status"><div class="privacy-row"><div><b>Strictly necessary</b><p>Ordinary site delivery plus one opt-out cookie only when you ask us to remember your choice.</p></div><span>Limited</span></div><div class="privacy-row"><div><b>Analytics</b><p>No analytics scripts or visitor measurement.</p></div><span>Off</span></div><div class="privacy-row"><div><b>Advertising</b><p>No ads, pixels, or targeted advertising.</p></div><span>Off</span></div><div class="privacy-row"><div><b>Sale or sharing</b><p>No sale of personal information or sharing for cross-context behavioral advertising.</p></div><span>Not performed</span></div><div class="privacy-row"><div><b>Global Privacy Control</b><p>A browser GPC signal is treated as an opt-out request.</p></div><span data-gpc-summary>Recognized</span></div><div class="privacy-row"><div><b>Game progress</b><p>Palace stores one game and sound/motion choices in this browser so play can resume. Other website lessons reset on refresh. Nothing is uploaded.</p></div><span>On device</span></div></div></div></section><section class="section" id="formal-policy"><div class="narrow prose"><p class="notice"><strong>Website privacy:</strong> ${privacyCopy.website}</p></div></section><section class="section" id="california-notice"><div class="narrow prose legal-policy"><p class="policy-meta"><strong>California Privacy Policy and Notice at Collection</strong><br>Effective and last updated: August 30, 2026</p><p class="notice"><strong>Legal-review status:</strong> This is a detailed, lawyer-ready operational draft based on the website’s current data practices. It was not written or approved by an attorney and is not legal advice. Qualified California privacy counsel should review it before the company represents it as attorney-approved.</p>
  <h2>1. Scope and who we are</h2><p>This policy describes how Four of Hearts Interactive, LLC (“4OH,” “we,” “us,” or “our”) handles personal information through 4ohi.com, website game previews, and messages sent to support@4ohi.com. It does not automatically describe a separately distributed game or service with its own notice.</p><p>The California Consumer Privacy Act, as amended (“CCPA”), applies only when statutory thresholds and other requirements are met. Whether or not the CCPA applies to 4OH, this policy explains our practices and we intend to honor the California requests described below when reasonably possible.</p>
  <h2>2. Notice at collection</h2><p>We may collect the categories below for the stated purposes. We do not collect more information than reasonably necessary and proportionate for those purposes.</p><div class="policy-table-wrap"><table class="policy-table"><thead><tr><th>Category</th><th>Examples and source</th><th>Purpose</th><th>Retention criterion</th></tr></thead><tbody><tr><td>Identifiers and contact information</td><td>Email address, name, and other details you choose to include in a support, privacy, security, or project message; collected directly from you.</td><td>Respond, authenticate a request when appropriate, troubleshoot, maintain request records, and protect the service.</td><td>General correspondence is kept only as long as reasonably needed. If the CCPA applies, consumer-request and response records are kept for at least 24 months as required by regulation.</td></tr><tr><td>Internet or other electronic network activity</td><td>IP address, browser or device type, requested page, date/time, referring information, and security events that hosting and network providers may process when delivering the site.</td><td>Deliver, secure, troubleshoot, and maintain the website.</td><td>Controlled by the relevant infrastructure provider under its applicable logs and retention practices; 4OH does not operate an analytics database of this activity.</td></tr><tr><td>Support and correspondence content</td><td>Message text, attachments, screenshots, device details, and issue information you voluntarily send.</td><td>Provide support, investigate defects or security reports, improve products, and respond to requests.</td><td>Kept only as long as reasonably necessary for the request, product quality, security, legal obligations, or disputes.</td></tr><tr><td>Privacy preference</td><td>A first-party value indicating that optional cookies must remain off.</td><td>Remember and honor your choice.</td><td>180 days, unless you clear it sooner. No identifier, advertising ID, or browsing history is stored in this value.</td></tr><tr><td>On-device Palace state</td><td>One game state, including cards, turns, local bots, result, and sound/motion preferences stored in your browser. The page does not send this state to 4OH.</td><td>Resume the same game after refresh or tab closure, remember completion, and honor accessibility and sound choices.</td><td>Remains on the device until site data is cleared or a future incompatible schema safely invalidates it.</td></tr></tbody></table></div><p>We do not intentionally collect sensitive personal information through this website. Do not send passwords, government identifiers, payment data, precise location, health information, or other sensitive data.</p>
  <h2>3. Cookies and similar technologies</h2><p>The site does not use analytics, advertising, cross-site tracking, fingerprinting, or third-party social widgets. Optional cookies are off by default. If you select “Reject optional cookies,” we set one strictly necessary first-party cookie named <code>4oh_privacy_choice</code> with the value <code>optional_off</code>. It exists only to remember your request, is sent only to 4ohi.com, uses Secure and SameSite=Lax attributes, and expires after 180 days. “Continue without saving” closes the notice for that page view without creating the cookie.</p><p>The complete Palace browser game uses local storage keys <code>4oh_palace_web_v1</code> for one game and <code>4oh_palace_web_preferences_v1</code> for sound and motion choices. These values are required for resume and one-game-limit behavior, remain on the device, contain no account or direct identifier, and are not transmitted by the page. Clearing site data removes them.</p><p>You can reopen the control center through “Your Privacy Choices” in the footer. Browser settings can also delete the preference cookie. If optional technology is introduced later, it must remain blocked until the controls and this notice are updated and any legally required choice is obtained.</p>
  <h2 id="do-not-sell">4. Do not sell or share my personal information</h2><p>4OH does not sell personal information and does not share personal information for cross-context behavioral advertising. We have not done so in the preceding 12 months. We therefore have no knowledge that we sell or share the personal information of consumers under 16. Selecting “Reject optional cookies,” enabling Global Privacy Control, or emailing us will still be recorded or treated as an opt-out direction.</p><p><a class="button small" href="mailto:support@4ohi.com?subject=Do%20Not%20Sell%20or%20Share%20Request">Submit a Do Not Sell or Share request</a></p>
  <h2>5. How we use personal information</h2><p>We use personal information to deliver and secure the site; respond to support, privacy, security, and business inquiries; diagnose defects; maintain records required by law; prevent abuse; establish or defend legal claims; and improve our products using feedback you choose to provide. We do not use website information for targeted advertising or automated decisions that produce legal or similarly significant effects.</p>
  <h2>6. Disclosure to service providers</h2><p>GitHub Pages and ordinary internet infrastructure providers may process request metadata to host, deliver, and protect the site. Our email provider processes messages sent to support@4ohi.com. Professional advisers or authorities may receive information when reasonably necessary for legal compliance, security, or claims. We do not authorize these recipients to use personal information for cross-context behavioral advertising.</p>
  <h2>7. California categories disclosed in the preceding 12 months</h2><p>Identifiers, internet/network activity, and correspondence content may have been disclosed for a business purpose to hosting, communications, security, and professional-service providers as described above. No category was sold or shared for cross-context behavioral advertising. We did not use or disclose sensitive personal information for purposes that require a “Limit the Use of My Sensitive Personal Information” link.</p>
  <h2>8. California privacy rights</h2><p>Subject to law and applicable exceptions, California residents may request: (a) the categories or specific pieces of personal information collected; (b) sources, purposes, and recipient categories; (c) deletion; (d) correction; (e) opt-out of sale or sharing; (f) limitation of certain uses of sensitive personal information; and (g) freedom from discrimination for exercising privacy rights. We do not offer financial incentives for personal information.</p>
  <h2>9. How to submit a request</h2><p>Email <a href="mailto:support@4ohi.com?subject=California%20Privacy%20Rights%20Request">support@4ohi.com</a> with the subject “California Privacy Rights Request.” State the right you want to exercise and enough context for us to locate relevant correspondence. Because this is an online-only website with a direct consumer relationship, email is the primary request method. We will confirm receipt and respond within the periods required by applicable law.</p><p>We will verify only to the degree appropriate for the request and the sensitivity of the information. We may ask you to reply from the email address involved or provide information already associated with your message. We will use verification information only for verification, security, fraud prevention, and legal compliance. If we cannot verify a request, we will explain the decision where permitted.</p>
  <h2>10. Authorized agents</h2><p>An authorized agent may submit a request for you. We may require proof of signed authorization and may ask you to verify your identity or confirm that you gave the agent permission. Opt-out requests generally do not require identity verification, although we may request limited information needed to apply the request.</p>
  <h2>11. Global Privacy Control</h2><p>When the browser exposes a Global Privacy Control signal, the site treats it as a request to keep sale, sharing, advertising, analytics, and other optional tracking off. Those technologies are already absent. We do not require you to create an account or provide extra information to use GPC.</p>
  <h2>12. Children</h2><p>The company website is a general-audience service and is not directed to children under 13. We do not knowingly collect personal information from children through accounts or forms, and we do not sell or share personal information of people we know are under 16. A parent or guardian who believes a child sent personal information may contact us for review and deletion.</p>
  <h2>13. Security and data minimization</h2><p>We use a static-site architecture, local assets, a restrictive Content Security Policy, and no visitor accounts or form backend. No method of transmission or storage is completely secure. Please send only information necessary for your request.</p>
  <h2>14. Retention</h2><p>We retain each category only for the period reasonably necessary and proportionate to the disclosed purpose, considering the duration of the relationship, request status, legal and accounting obligations, security needs, limitation periods, and the need to establish or defend claims. The privacy-choice cookie has the fixed 180-day period described above. Palace game state remains locally until site data is cleared or an incompatible schema invalidates it; the page never uploads it. Infrastructure-provider logs are governed by the provider practices.</p>
  <h2>15. Changes to this policy</h2><p>We will post material changes here, update the date above, and provide additional notice when required. Materially different uses of previously collected personal information require the notice or consent required by applicable law.</p>
  <h2>16. Contact and accessibility</h2><p>Questions, accessibility requests, and privacy requests may be sent to <a href="mailto:support@4ohi.com?subject=Privacy%20question">support@4ohi.com</a>. If you need this policy in another format, tell us the format that works for you.</p><p><button class="button secondary" type="button" data-forget-privacy>Clear saved privacy choice</button></p></div></section>`
}));
write("security.html", page({
  title: "Security | Four of Hearts Interactive",
  description: "Responsible security-reporting guidance for Four of Hearts Interactive products and website.",
  path: "/security.html",
  current: "",
  content: `
    ${pageHero("Responsible disclosure", "Help us keep the table safe.", "If you believe you found a security issue in a Four of Hearts product or website, share enough detail for the team to investigate safely.")}
    <section class="section"><div class="narrow prose">
      <h2>Report privately</h2><p>Email <a href="mailto:support@4ohi.com?subject=Security%20report">support@4ohi.com</a> with the affected game or page, a concise description, reproduction steps, expected impact, and safe supporting evidence.</p>
      <h2>Please do not</h2><ul><li>Access, change, or retain data that is not yours.</li><li>Disrupt service, automate destructive traffic, or attempt social engineering.</li><li>Publish sensitive details before the company has had a reasonable opportunity to investigate.</li><li>Send credentials, private keys, recovery codes, or unrelated personal information.</li></ul>
      <h2>Current program limits</h2><p>Four of Hearts does not promise a bug bounty, payment, guaranteed response time, or protection for activity that breaks the law or harms other people. Internal Alpha services and policies may change.</p>
      <h2>Website security posture</h2><p>The site is static, uses local scripts and assets, and has no form backend, visitor account, analytics, ad code, social widget, dynamic HTML from visitors, or evaluation of supplied code. One first-party preference cookie is created only when a visitor asks us to remember that optional cookies remain off. GitHub Pages does not expose arbitrary custom response-header controls, so the site does not claim headers the host cannot configure.</p>
    </div></section>`
}));

write("terms.html", page({
  title: "Internal Alpha Terms | Four of Hearts Interactive",
  description: "Conservative terms for invited Internal Alpha use of Four of Hearts Interactive games and website experiences.",
  path: "/terms.html",
  current: "",
  content: `
    ${pageHero("Internal Alpha", "Terms of Use", "Last technically reviewed July 25, 2026. These plain-language terms describe a testing-stage website and game family, not a public commercial release.")}
    <section class="section"><div class="narrow prose">
      <h2>Current availability</h2><p>GildenSpire is in development with no public build or announced release date. Palace, Hearts, Spades, and Euchre are in internal testing. The Palace website includes one complete local browser game; it is not a public app-store release. The Hearts, Spades, and Euchre website lessons are short teaching previews, not complete matches. Thumb Command, Bobby the Breadasaurus, and Evil Doom Boy are in development and are not publicly playable. Access may be limited, changed, interrupted, or withdrawn. None of these experiences involves gambling.</p>
      <h2>Use the products responsibly</h2><p>Do not interfere with service, attempt unauthorized access, misuse reconnect or ranking behavior, reverse engineer where prohibited by law, harass other testers, or use the products for unlawful activity.</p>
      <h2>Testing information</h2><p>Feedback may be used to improve the games. Do not include confidential information, passwords, or third-party material you lack permission to share.</p>
      <h2>No promise of release</h2><p>Features, rules, visual design, rankings, data behavior, and availability may change. Participation in testing does not guarantee a future download, account, entitlement, purchase, or permanent record.</p>
      <h2>Contact</h2><p>Questions may be sent to <a href="mailto:support@4ohi.com?subject=Terms%20question">support@4ohi.com</a>.</p>
      <p class="notice">These terms require qualified legal review before public commercial launch.</p>
    </div></section>`
}));

write("contact.html", page({
  title: "Contact | Four of Hearts Interactive",
  description: "Contact Four of Hearts Interactive, LLC in South Dakota about Palace, support, privacy, or security.",
  path: "/contact.html",
  current: "",
  content: `
    ${pageHero("Contact Four of Hearts", "We’d love to hear from you.", "Palace questions, Internal Alpha feedback, privacy inquiries, and responsible security reports currently share one professional contact.")}
    <section class="section"><div class="shell support-layout">
      <div class="panel support-card"><p class="eyebrow">Company</p><h2>${company}</h2><p>South Dakota, United States</p><p><a class="button small" href="mailto:support@4ohi.com">support@4ohi.com</a></p></div>
      <div class="prose"><h2>Choose a clear subject</h2><ul><li><strong>${gameToken("gameName", "Palace")} or game support:</strong> include the game name and Internal Alpha version.</li><li><strong>Privacy:</strong> describe the question without sending unnecessary personal information.</li><li><strong>Security:</strong> follow the safe guidance on the Security page.</li><li><strong>Company:</strong> state the purpose of the inquiry plainly.</li></ul><p>No home address or personal telephone number is published. The site does not use a contact-form backend.</p></div>
    </div></section>`
}));

write("palace-faq.html", page({
  title: "Palace Card Game Rules, Power Cards & FAQ | Four of Hearts",
  description: "Learn how to play Palace: match or beat, clear three levels, use the 2, 7, 8, and 10 power cards, and understand common alternate names and house rules.",
  path: "/palace-faq.html", current: "palace", image: "assets/icon-palace-4hearts.webp", imageAlt: "Palace castle and playing-card artwork",
  jsonLd: {
    "@context": "https://schema.org", "@type": "FAQPage", mainEntity: [
      {"@type":"Question","name":"How do you play Palace?","acceptedAnswer":{"@type":"Answer","text":"Play a card that matches or beats the top rank. If you cannot, pick up the pile. Clear cards in hand, then face-up cards, then face-down cards."}},
      {"@type":"Question","name":"What do 2, 7, 8, and 10 do in Palace?","acceptedAnswer":{"@type":"Answer","text":"In the Four of Hearts rule set, 2 resets, 7 requires seven or lower, 8 is transparent, and 10 burns the pile."}},
      {"@type":"Question","name":"Is Palace also called Shed?","acceptedAnswer":{"@type":"Answer","text":"Palace belongs to a wider shedding-game family with many table names, including Shed, Karma, China Hand, and an uncensored traditional adult name."}}
    ]
  },
  content: `${gameNav("palace", "rules")}${pageHero("Rules · strategy · table names", "How to play Palace.", "Match the rank or play higher. If you cannot, pick up. Power cards bend the rules; three levels make the ending unforgettable.", '<div class="actions"><a class="button" href="palace-play.html">Learn by playing</a><a class="button secondary" href="#faq">Read the FAQ</a></div>')}
    <section class="section"><div class="narrow prose"><h2>Palace in one minute</h2><ol><li>Play the same rank as the top card or a higher rank.</li><li>If you cannot make a legal play, pick up the pile.</li><li>Use the Four of Hearts power cards: 2 resets, 7 requires lower, 8 is transparent, and 10 burns.</li><li>Clear your hand, then your visible face-up cards, then the hidden face-down finale.</li></ol><h2>Simple strategy</h2><p>Save flexibility for the end. Low cards can become traps; a 2 escapes almost anything; a 10 clears danger; and the cards everyone can see tell rivals how your finish may unfold.</p></div></section>
    <section class="section navy" id="faq"><div class="narrow prose"><h2>Frequently asked questions</h2><h3>Is Palace a shedding game?</h3><p>Yes. The goal is to shed every card across three levels before the other players.</p><h3>Is Palace also called Shed?</h3><p>Palace is part of a folk game family with names that vary by table and region. Shed, Karma, and China Hand appear in published rules references. House rules also vary.</p><h3>Are these the only traditional power-card rules?</h3><p>No. This site teaches the clear Four of Hearts rule set. Other tables may assign different powers or use different ranks.</p><h3>How many people can play?</h3><p>Palace is commonly taught as a small-group card game. Exact setup and deck use can vary by the number of players and local rules.</p><p><a class="text-link" href="https://www.pagat.com/beating/shithead.html" rel="noopener noreferrer">Read the Pagat rules and history notes</a></p></div></section>`
}));

write("404.html", page({
  title: "Page Not Found | Four of Hearts Interactive",
  description: "The requested Four of Hearts page could not be found.",
  path: "/404.html",
  current: "",
  noindex: true,
  content: `<section class="page-hero"><div class="shell"><p class="eyebrow">404 · Card not found</p><h1>${brandMessage("notFound", "This card fell under the table.")}</h1><p class="lede">The page may have moved, but the Four of Hearts lineup is still here.</p><div class="actions"><a class="button" href="index.html">Return home</a><a class="button secondary" href="games.html">Explore the games</a></div></div></section>`
}));


const routeAliases = {
  "games/index.html": "../games.html",
  "games/palace/index.html": "../../palace.html",
  "games/gildenspire/index.html": "../../gildenspire.html",
  "games/booyang-city/index.html": "../../booyang-city.html",
  "games/funky-town/index.html": "../../funky-town.html",
  "games/bobby-the-breadasaurus/index.html": "../../bobby-the-breadasaurus.html",
  "games/evil-doom-adventures-shadow-run/index.html": "../evil-doom-boy/",
  "games/evil-doom-adventures/index.html": "../evil-doom-boy/",
  "games/evil-doom-boy-adventures/index.html": "../evil-doom-boy/",
  "games/evil-doom-girl-adventures/index.html": "../evil-doom-boy/",
  "games/hearts/index.html": "../../hearts-play.html",
  "games/spades/index.html": "../../spades-play.html",
  "games/euchre/index.html": "../../euchre-play.html",
  "games/solitaire/index.html": "../../solitaire.html",
  "games/war/index.html": "../../war.html",
  "games/evil-doom-girl/index.html": "../evil-doom-boy/",
  "lifestyle-apps/index.html": "../lifestyle-apps.html",
  "lifestyle-apps/people-lens/index.html": "../../whomly.html",
  "lifestyle-apps/whomly/index.html": "../../whomly.html",
  "lifestyle-apps/sleep-amigo/index.html": "../../sleep-amigo.html",
  "play/index.html": "../palace-play.html",
  "news/index.html": "../news.html",
  "about/index.html": "../about.html",
  "support/index.html": "../support.html",
  "privacy/index.html": "../privacy.html"
};

Object.entries(routeAliases).forEach(([file, target]) => {
  mkdirSync(resolve(root, file, ".."), { recursive: true });
  const isRetiredThumbCommandRoute = file === "games/commander-thum-b/index.html";
  const canonicalPath = file === "lifestyle-apps/people-lens/index.html"
    ? "whomly.html"
    : file.startsWith("games/evil-doom")
    ? "games/evil-doom-boy/"
    : isRetiredThumbCommandRoute
      ? "games/thumb-command/"
      : `${file.replace(/\/index\.html$/, "")}/`;
  const robots = '<meta name="robots" content="noindex,follow">';
  write(file, `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">${robots}<meta http-equiv="refresh" content="0; url=${target}"><title>Moving to Four of Hearts Interactive</title><link rel="canonical" href="${siteUrl}/${canonicalPath}"></head><body><main><h1>Continue to Four of Hearts Interactive</h1><p><a href="${target}">Open the requested page</a>.</p></main></body></html>`);
});
const sitemapFiles = [
  "index.html", "gildenspire.html", "booyang-city.html", "funky-town.html", "palace.html", "palace-play.html", "palace-story.html", "thumb-command.html", "solitaire.html", "war.html", "bobby-the-breadasaurus.html", "games/evil-doom-boy/index.html", "heartstack-unicorn-blast.html", "princess-land-adventures.html", "unicorn-land-adventures.html", "lifestyle-apps.html", "whomly.html", "sleep-amigo.html", "news.html",
  ...news.map((item) => articleFile(item.slug)),
  "games.html", "play.html", "hearts-play.html", "spades-play.html", "euchre-play.html",
  "palace-faq.html", "about.html", "support.html", "privacy.html", "security.html", "terms.html", "contact.html"
];

write("sitemap.xml", `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapFiles.map((file) => `  <url><loc>${siteUrl}/${file === "index.html" ? "" : file === "thumb-command.html" ? "games/thumb-command/" : file === "games/evil-doom-boy/index.html" ? "games/evil-doom-boy/" : file}</loc></url>`).join("\n")}
</urlset>`);

write("feed.xml", `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Four of Hearts Interactive News</title>
    <link>${siteUrl}/news.html</link>
    <description>Company and game news from Four of Hearts Interactive.</description>
    <language>en-us</language>
${news.map((item) => `    <item>
      <title>${item.title.replaceAll("&", "&amp;")}</title>
      <link>${siteUrl}/${articleFile(item.slug)}</link>
      <guid>${siteUrl}/${articleFile(item.slug)}</guid>
      <pubDate>${new Date(`${item.date}T12:00:00Z`).toUTCString()}</pubDate>
      <description>${item.description.replaceAll("&", "&amp;")}</description>
    </item>`).join("\n")}
  </channel>
</rss>`);

console.log(`Generated ${sitemapFiles.length + 2} public documents from shared templates and ${news.length} news records.`);
