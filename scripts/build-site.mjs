import { readFileSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const news = JSON.parse(readFileSync(resolve(root, "content", "news.json"), "utf8"));
const siteUrl = "https://4ohi.com";
const company = "Four of Hearts Interactive, LLC";

const write = (file, content) => writeFileSync(resolve(root, file), `${content.trim().replace(/[ \t]+$/gm, "")}\n`, "utf8");
const formatDate = (date) => new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" }).format(new Date(`${date}T00:00:00Z`));
const articleFile = (slug) => `news-${slug}.html`;

const nav = (current) => {
  const items = [
    ["palace", "palace.html", "Palace"],
    ["play", "palace-play.html", "Play Palace"],
    ["news", "news.html", "News"],
    ["games", "games.html", "More Games"],
    ["about", "about.html", "About 4OH"],
    ["support", "support.html", "Support"]
  ];
  return `<header class="site-header">
    <div class="shell nav-wrap">
      <a class="brand" href="index.html"${current === "home" ? ' aria-current="page"' : ""}>
        <img class="brand-logo" src="assets/brand-mark-4oh.webp" alt="Four of Hearts Interactive" width="76" height="58">
        <span class="brand-mark" aria-hidden="true">4♥</span>
        <span class="brand-copy">Four of Hearts<small>Interactive</small></span>
      </a>
      <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="primary-navigation">Menu</button>
      <nav class="site-nav" id="primary-navigation" data-open="false" aria-label="Primary">
        ${items.map(([key, href, label]) => `<a${key === current ? ' aria-current="page"' : ""}${key === "play" ? ' class="nav-play"' : ""} href="${href}">${label}</a>`).join("")}
      </nav>
    </div>
  </header>`;
};

const footer = () => `<footer class="site-footer">
  <div class="shell">
    <div class="footer-grid">
      <div>
        <div class="footer-title"><span aria-hidden="true">♥</span><strong>${company}</strong></div>
        <p class="footer-copy">Palace leads a growing family of timeless card games. One Family. Many Games.</p>
        <a href="mailto:support@4ohi.com">support@4ohi.com</a>
        <div class="social-slot" data-social-slot aria-label="Official social profiles"></div>
      </div>
      <nav class="footer-links" aria-label="Footer">
        <a href="palace.html">Palace</a><a href="palace-play.html">Palace tutorial</a>
        <a href="palace-story.html">Palace story</a><a href="news.html">News</a>
        <a href="games.html">More Games</a><a href="about.html">About 4OH</a>
        <a href="support.html">Support</a><a href="privacy.html">Privacy</a>
        <a href="security.html">Security</a><a href="terms.html">Terms</a>
        <a href="contact.html">Contact</a>
      </nav>
    </div>
    <div class="footer-bottom">
      <span>© 2026 ${company}. All rights reserved.</span>
      <span>Palace and all current games are in Internal Alpha.</span>
    </div>
  </div>
</footer>`;

const head = ({ title, description, path, image = "assets/og-brand.jpg", imageAlt = "Four of Hearts Interactive", type = "website", jsonLd, noindex = false, script = "" }) => {
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
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${description}">
  <meta property="og:type" content="${type}">
  <meta property="og:url" content="${canonical}">
  <meta property="og:image" content="${siteUrl}/${image}">
  <meta property="og:image:alt" content="${imageAlt}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="theme-color" content="#000512">
  <link rel="icon" type="image/png" href="assets/favicon.png">
  <link rel="apple-touch-icon" href="assets/apple-touch-icon.png">
  <link rel="stylesheet" href="assets/palace-site.css">
  <link rel="stylesheet" href="assets/palace-launch.css">
  <link rel="stylesheet" href="assets/founder-redesign.css">
  <script src="assets/site-config.js" defer></script>
  <script src="assets/site.js" defer></script>
  <script src="assets/palace-name.js" defer></script>
  <script src="assets/launch-countdown.js" defer></script>
  ${script}
  ${structuredData ? `<script type="application/ld+json">${structuredData}</script>` : ""}
</head>`;
};

const page = ({ title, description, path, current, content, image, imageAlt, type, jsonLd, noindex, script, bodyClass = "" }) => `${head({ title, description, path, image, imageAlt, type, jsonLd, noindex, script })}
<body class="${bodyClass}">
  <a class="skip-link" href="#main">Skip to content</a>
  ${nav(current)}
  <main id="main">${content}</main>
  ${footer()}
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

const newsCard = (item) => `<a class="panel news-card" href="${articleFile(item.slug)}" data-reveal>
  <div class="news-art"><img src="${item.image}" alt="${item.imageAlt}" width="512" height="512" loading="lazy"></div>
  <div class="news-body">
    <div class="news-meta"><span>${item.category}</span><time datetime="${item.date}">${formatDate(item.date)}</time></div>
    <h3>${item.title}</h3>
    <p>${item.description}</p>
    <span class="read-more">Read story →</span>
  </div>
</a>`;

const featured = news.find((item) => item.featured) ?? news[0];
const otherNews = news.filter((item) => item !== featured);

write("index.html", page({
  title: "Palace Is Coming | Four of Hearts Interactive",
  description: "The card-table legend known as Palace is finally becoming a Four of Hearts app. Learn the game in 60 seconds and watch the countdown.",
  path: "/",
  current: "home",
  image: "assets/og-brand.jpg",
  imageAlt: "Palace and the Four of Hearts Interactive game family",
  jsonLd: {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: company,
    url: `${siteUrl}/`,
    logo: `${siteUrl}/assets/brand-mark-4oh.webp`,
    email: "support@4ohi.com",
    address: { "@type": "PostalAddress", addressRegion: "South Dakota", addressCountry: "US" },
    description: "Four of Hearts Interactive creates Palace and a growing family of timeless card games."
  },
  bodyClass: "home-page",
  content: `
    <section class="hero palace-world" data-pointer-hero>
      <div class="palace-world-backdrop" aria-hidden="true"></div>
      <picture class="palace-world-art">
        <source media="(max-width: 520px)" srcset="assets/palace-hero-384.webp">
        <source media="(max-width: 900px)" srcset="assets/palace-hero-640.webp">
        <img src="assets/palace-hero-1024.webp" alt="Palace castle rising above the gold Palace title" width="1024" height="1024" fetchpriority="high">
      </picture>
      <span class="world-card world-card-one" aria-hidden="true"><b>Q</b>♠</span>
      <span class="world-card world-card-two red" aria-hidden="true"><b>7</b>♥</span>
      <span class="world-card world-card-three" aria-hidden="true"><b>9</b>♣</span>
      <div class="shell hero-stage">
        <div class="hero-topline"><span class="transmission-badge">Transmission 001</span><span>Four of Hearts Interactive presents</span></div>
        <a class="hero-news-link" href="news.html"><span>Latest</span>${featured.title}<b aria-hidden="true">→</b></a>
        <div class="hero-copy">
          <p class="hero-game-name">The hottest card game in the galaxy</p>
          <h1><span data-game-name>Palace</span> is finally <span class="gold">coming home.</span></h1>
          <p class="launch-deckline">Three levels. One pile. One crown. <strong>The table legend is finally becoming an app—built by Four of Hearts.</strong></p>
          <div class="launch-countdown" data-launch-countdown role="timer"><span class="launch-countdown-label">The Palace opens in<br>October 17, 2026</span><span class="countdown-unit"><strong data-countdown="days">83</strong><span>Days</span></span><i class="countdown-separator" aria-hidden="true">:</i><span class="countdown-unit"><strong data-countdown="hours">00</strong><span>Hours</span></span><i class="countdown-separator" aria-hidden="true">:</i><span class="countdown-unit"><strong data-countdown="minutes">00</strong><span>Min</span></span><i class="countdown-separator" aria-hidden="true">:</i><span class="countdown-unit"><strong data-countdown="seconds">00</strong><span>Sec</span></span></div>
          <div class="actions">
            <a class="button" href="palace-play.html">Play the Palace tutorial</a>
            <a class="button secondary" href="palace.html">Discover Palace</a>
          </div>
          <div class="hero-status-line"><span>Internal Alpha</span><span>Currently in testing</span><a href="news.html">News from the table →</a></div>
        </div>
        <div class="hero-layer-rail" aria-label="The three Palace layers"><span><b>01</b>Your hand</span><span><b>02</b>Face-up reserve</span><span><b>03</b>Hidden finale</span></div>
        <a class="hero-scroll" href="#palace-rhythm">Enter the Palace <span aria-hidden="true">↓</span></a>
      </div>
    </section>

    <div class="myth-strip" aria-label="Names used for the Palace card-game family"><div class="myth-strip-track">PALACE /// SHED /// KARMA /// CHINA HAND /// PASSED HAND TO HAND /// BUILT FOR ANY TABLE /// PALACE /// SHED /// KARMA ///</div></div>

    <section class="section story-chapter" id="palace-rhythm"><div class="shell story-split">
      <div class="story-copy" data-reveal><p class="eyebrow">The game in one breath</p><h2>Match it. Beat it. Change the game.</h2><p class="lede">Play the same rank, climb higher, or turn the table with a power card. Clear your hand, your face-up cards, and then the cards nobody has seen—not even you.</p><div class="actions"><a class="button blue" href="palace-play.html">Learn by playing</a><a class="text-link" href="palace.html#rules">See the full rules</a></div></div>
      <div class="palace-levels" aria-label="The three levels of Palace" data-reveal><article class="palace-level"><b>Level 01</b><strong>Cards in hand</strong><span>Your plan begins here.</span></article><article class="palace-level"><b>Level 02</b><strong>Face-up cards</strong><span>Everyone sees your ending.</span></article><article class="palace-level"><b>Level 03</b><strong>Face-down cards</strong><span>Now trust the Palace.</span></article></div>
    </div></section>

    <section class="rule-ribbon" id="rules" aria-labelledby="power-title"><h2 class="sr-only" id="power-title">Palace power cards</h2><article><b>2</b><h3>Resets</h3><p>Drop a two and the next player may start fresh with any card.</p></article><article><b>7</b><h3>Requires lower</h3><p>The next ordinary card must be seven or lower. High cards suddenly have nowhere to go.</p></article><article><b>8</b><h3>Is transparent</h3><p>Ignore the eight when reading the pile. The card beneath still sets the challenge.</p></article><article><b>10</b><h3>Burns</h3><p>Clear the entire pile, take control, and lead the next play.</p></article></section>

    <section class="section navy"><div class="shell quote-stage"><div class="quote-mark" aria-hidden="true">“</div><blockquote>Easy enough to teach in a minute. Wild enough to become the story everyone remembers.<cite>Why Palace survives every table</cite></blockquote></div></section>

    <section class="section royal"><div class="shell story-split"><div><p class="eyebrow">Featured from the newsroom</p><h2>${featured.title}</h2><p class="lede">${featured.description}</p><div class="actions"><a class="button" href="${articleFile(featured.slug)}">Read the story</a><a class="text-link" href="news.html">All Palace news</a></div></div><a class="news-art cinematic-news" href="${articleFile(featured.slug)}"><img src="${featured.image}" alt="${featured.imageAlt}" width="512" height="512" loading="lazy"></a></div></section>

    <section class="section family-story"><div class="shell story-split"><div><p class="eyebrow">The four hearts behind the name</p><h2>Built from one family for many.</h2><div class="four-heart-line" aria-label="Four hearts"><span>♥</span><span>♥</span><span>♥</span><span>♥</span></div></div><div><p class="lede">Four daughters created the spark. Four hearts became the name. The company grew from a family table and one stubborn belief: life is short, playing together matters, and the best measure of a game is the smiles it leaves around the table.</p><p><strong>One Family. Many Games.</strong></p><a class="text-link" href="about.html">Meet Four of Hearts</a></div></div></section>

    <section class="section"><div class="shell"><div class="section-heading"><div><p class="eyebrow">More games from Four of Hearts</p><h2>Three more seats are waiting.</h2></div><p class="lede">Palace leads. Hearts, Spades, and Euchre bring three more distinct table traditions—each currently in Internal Alpha.</p></div><div class="game-grid"><article class="panel game-tile hearts"><img src="assets/icon-hearts-4hearts.webp" alt="Hearts ruby artwork" width="512" height="512" loading="lazy"><div class="game-tile-content"><span class="alpha-badge">Internal Alpha</span><h3>Hearts</h3><a class="text-link" href="hearts-play.html">Try Quick Play</a></div></article><article class="panel game-tile spades"><img src="assets/icon-spades-4hearts.webp" alt="Spades purple artwork" width="512" height="512" loading="lazy"><div class="game-tile-content"><span class="alpha-badge">Internal Alpha</span><h3>Spades</h3><a class="text-link" href="spades-play.html">Try Quick Play</a></div></article><article class="panel game-tile euchre"><img src="assets/icon-euchre-4hearts.webp" alt="Euchre green artwork" width="512" height="512" loading="lazy"><div class="game-tile-content"><span class="alpha-badge">Internal Alpha</span><h3>Euchre</h3><a class="text-link" href="euchre-play.html">Try Quick Play</a></div></article></div></div></section>
    <section class="section compact navy">
      <div class="shell palace-band">
        <img src="assets/brand-mark-4oh.webp" alt="Four of Hearts Interactive emblem" width="570" height="365" loading="lazy">
        <div><p class="eyebrow">The studio behind Palace</p><h2>One Family. Many Games.</h2><p class="lede">Four of Hearts Interactive builds polished digital card tables with clear teaching, honest privacy choices, and room for the family to grow.</p><div class="actions"><a class="button secondary" href="about.html">Meet Four of Hearts</a></div></div>
      </div>
    </section>`
}));

write("palace.html", page({
  title: "Palace | The Flagship Game from Four of Hearts",
  description: "Discover Palace: match, beat, burn, and clear three levels in the flagship Four of Hearts card game now in Internal Alpha.",
  path: "/palace.html", current: "palace", image: "assets/icon-palace-4hearts.webp", imageAlt: "Palace castle artwork", bodyClass: "palace-product",
  jsonLd: { "@context":"https://schema.org", "@type":"Game", name:"Palace", description:"A three-level shedding card game in Internal Alpha at Four of Hearts Interactive.", publisher:{"@type":"Organization",name:company}, url:`${siteUrl}/palace.html`, gameItem:"Standard playing cards" },
  content: `
    ${pageHero("The Four of Hearts flagship", '<span data-game-name>Palace</span> is calling.', "Match it. Beat it. Burn it. Rule the table. The card-table legend is finally becoming an app.", '<div class="hero-status-line"><span>Internal Alpha</span><span>Founder testing underway</span></div><div class="actions"><a class="button" href="palace-play.html">Play the Palace tutorial</a><a class="button secondary" href="#rules">How to play</a></div>')}
    <section class="product-manifesto"><div class="shell"><div class="manifesto-line"><b>01</b><div><p class="eyebrow">Immediate</p><h2>Match it or climb higher.</h2><p>Read the top card. Play the same rank or anything higher. One rule gets everyone into the game; every card you save shapes the ending.</p></div></div><div class="manifesto-line"><b>02</b><div><p class="eyebrow">Explosive</p><h2>Power cards rewrite the table.</h2><p>Two resets. Seven forces lower. Eight turns transparent. Ten burns the pile. These are the Four of Hearts rules.</p></div></div><div class="manifesto-line"><b>03</b><div><p class="eyebrow">Unforgettable</p><h2>The last cards are a mystery.</h2><p>Finish your hand, then your face-up row, then reveal the face-down finale one card at a time.</p></div></div></div></section>
    <section class="rule-ribbon" id="rules"><h2 class="sr-only">Palace power cards</h2><article><b>2</b><h3>Reset</h3><p>Anything may follow.</p></article><article><b>7</b><h3>Lower</h3><p>Seven or lower must follow.</p></article><article><b>8</b><h3>Transparent</h3><p>Read through to the card below.</p></article><article><b>10</b><h3>Burn</h3><p>Clear the pile and lead again.</p></article></section>
    <section class="section navy"><div class="shell story-split"><div><p class="eyebrow">Same game. Different tables.</p><h2>What do you call it?</h2><p class="lede">Palace and Shed are names used for the same wider game family. Change the displayed name for this page session; nothing is stored.</p></div><div class="name-console"><h3>Table name</h3><div class="name-options" role="group" aria-label="Choose the displayed game name"><button type="button" data-name-choice="Palace" aria-pressed="true">Palace</button><button type="button" data-name-choice="Shed" aria-pressed="false">Shed</button></div><p data-name-status role="status">Palace is used at this table. This choice resets when you refresh.</p><p class="name-secret" data-name-secret tabindex="-1" hidden>You found the name some tables whisper. Welcome to the founder’s table.</p></div></div></section>
    <section class="section"><div class="shell story-split"><img src="assets/icon-palace-4hearts.webp" alt="Palace castle with blue towers" width="512" height="512" loading="lazy"><div><p class="eyebrow">A game built to travel</p><h2>Passed hand to hand.</h2><p class="lede">Palace belongs to a folk shedding-game family with many regional names and house rules. The exact origin remains uncertain. The Four of Hearts edition gives that living tradition one clear rule set and a world of its own.</p><div class="actions"><a class="button" href="palace-play.html">Take your seat</a><a class="text-link" href="palace-story.html">Fact, folklore & legend</a></div></div></div></section>`
}));
write("palace-play.html", page({
  title: "How to Play Palace | Interactive Five-Scene Tutorial",
  description: "Play a polished Palace tutorial: match or beat, burn with ten, watch a pile pickup, learn power cards, and clear all three levels.",
  path: "/palace-play.html", current: "play", image: "assets/icon-palace-4hearts.webp", imageAlt: "Palace interactive tutorial", bodyClass: "palace-play-page",
  script: '<script src="assets/palace-tutorial-v3.js" defer></script>',
  content: `${pageHero("Learn inside the action", "Take your seat at the Palace.", "Five focused scenes teach the real Four of Hearts table: match or beat, ten burns, blocked players pick up, power cards change play, and every Palace ends across three levels.", '<div class="hero-status-line"><span>Keyboard + touch</span><span>No account</span><span>Nothing saved</span></div>')}<section class="section navy"><div class="shell"><div id="palace-tutorial" class="tutorial-stage" tabindex="-1" aria-label="Interactive five-scene Palace tutorial"></div><noscript><div class="notice">JavaScript is required for the interactive table. The full rules remain available on the Palace page.</div></noscript></div></section>`
}));
write("palace-story.html", page({
  title: "Palace: Fact, Folklore & Legend | Four of Hearts",
  description: "Explore what is documented about Palace, what players pass along, and the clearly labeled legends that travel with the game.",
  path: "/palace-story.html", current: "palace", image: "assets/icon-palace-4hearts.webp", imageAlt: "Palace castle artwork",
  content: `${pageHero("Fact · folklore · legend", "A game carried by memory.", "Palace has no single box, rulebook, or universally proven origin. Its history lives in sources, table tradition, and the stories players tell.")}<section class="history-triad"><article><p class="eyebrow">What we know</p><h2>A shedding game with many names.</h2><p>Published rules references describe a beating or shedding game usually played through cards in hand, face-up cards, and face-down cards. Names include Palace, Shed, Karma, Shithead, China Hand, and regional variants.</p><p><a class="text-link" href="https://www.pagat.com/beating/shithead.html" rel="noopener noreferrer">Read the Pagat source notes</a></p></article><article><p class="eyebrow">What players tell</p><h2>Every table changes it.</h2><p>House rules—especially the effects of special ranks—are part of the tradition. Players teach the game from memory, adapt it locally, and pass it to the next table. Exact origins remain uncertain.</p></article><article><p class="eyebrow">The legend of Palace</p><h2>A deck fits anywhere.</h2><p>In a barracks before dawn. Below deck, weeks from shore. Between flights. In a hostel, a dorm, a kitchen, or the last table still awake.</p><p><em>This is founder-supplied table lore and atmospheric storytelling—not verified historical reporting.</em></p></article></section><section class="section navy"><div class="narrow prose"><h2>The Four of Hearts rule set</h2><p>Four of Hearts uses a documented product rule set: 2 resets, 7 requires lower, 8 is transparent, and 10 burns. That consistency belongs to this adaptation; it is not presented as the only traditional way to play.</p><p class="notice">History and founder-biography language remain marked for founder and qualified editorial/legal review before commercial reliance.</p></div></section>`
}));
write("news.html", page({
  title: "News | Four of Hearts Interactive",
  description: "Palace development stories, studio updates, and honest Internal Alpha news from Four of Hearts Interactive.",
  path: "/news.html",
  current: "news",
  content: `
    ${pageHero("Four of Hearts newsroom", "The table is taking shape.", "Palace development leads the news, with honest updates from the wider Four of Hearts family. No invented launch dates, player counts, or partnerships.")}
    <section class="section navy"><div class="shell">
      <a class="featured-news panel news-card" href="${articleFile(featured.slug)}" data-reveal>
        <div class="news-art"><img src="${featured.image}" alt="${featured.imageAlt}" width="512" height="512"></div>
        <div class="news-body"><div class="news-meta"><span>Featured · ${featured.category}</span><time datetime="${featured.date}">${formatDate(featured.date)}</time></div><h2>${featured.title}</h2><p>${featured.description}</p><span class="read-more">Read featured story →</span></div>
      </a>
      <div class="news-grid">${otherNews.map(newsCard).join("")}</div>
      <div class="actions"><a class="text-link" href="feed.xml">Subscribe via RSS</a></div>
    </div></section>`
}));

news.forEach((item, index) => {
  const previous = news[(index - 1 + news.length) % news.length];
  const next = news[(index + 1) % news.length];
  const body = item.body.map((section) => `<h2>${section.heading}</h2>${section.paragraphs.map((paragraph) => `<p>${paragraph}</p>`).join("")}`).join("");
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
          <h1>${item.title}</h1><p class="lede">${item.description}</p>
        </header>
        <div class="shell"><img class="article-art" src="${item.image}" alt="${item.imageAlt}" width="1200" height="630"></div>
        <section class="section"><div class="shell article-layout">
          <div class="prose">${body}</div>
          <aside class="article-aside"><strong>Development status</strong><p>Palace and every current Four of Hearts game remain in Internal Alpha. This article does not announce public availability.</p></aside>
        </div></section>
      </article>
      <section class="section navy"><div class="shell"><p class="eyebrow">Keep reading</p><div class="related-grid">
        <a class="panel feature-card text-link" href="${articleFile(previous.slug)}">${previous.title}</a>
        <a class="panel feature-card text-link" href="${articleFile(next.slug)}">${next.title}</a>
      </div></div></section>`
  }));
});

write("games.html", page({
  title: "More Games from Four of Hearts",
  description: "Meet Hearts, Spades, and Euchre—the growing game family behind flagship Palace—and try an accessible Internal Alpha teaching moment for each.",
  path: "/games.html",
  current: "games",
  content: `
    ${pageHero("More games from Four of Hearts", "Three more seats at the table.", "Palace is the flagship. Hearts, Spades, and Euchre bring their own color, pace, and strategy to the same growing studio family.")}
    <section class="section"><div class="shell">
      <div class="game-grid">
        <article class="panel game-tile hearts"><img src="assets/icon-hearts-4hearts.webp" alt="Hearts ruby artwork" width="512" height="512"><div class="game-tile-content"><span class="alpha-badge">Internal Alpha</span><h2>Hearts</h2><p>Follow suit, avoid point cards, and learn when taking a trick is the wrong kind of victory.</p><a class="button small" href="hearts-play.html">Play the Hearts lesson</a></div></article>
        <article class="panel game-tile spades"><img src="assets/icon-spades-4hearts.webp" alt="Spades royal purple artwork" width="512" height="512"><div class="game-tile-content"><span class="alpha-badge">Internal Alpha</span><h2>Spades</h2><p>Partnership, bidding, and permanent trump turn every hand into a shared promise.</p><a class="button small" href="spades-play.html">Play the Spades lesson</a></div></article>
        <article class="panel game-tile euchre"><img src="assets/icon-euchre-4hearts.webp" alt="Euchre green card artwork" width="512" height="512"><div class="game-tile-content"><span class="alpha-badge">Internal Alpha</span><h2>Euchre</h2><p>Short hands, decisive calls, and the two bowers make this partnership game move fast.</p><a class="button small" href="euchre-play.html">Play the Euchre lesson</a></div></article>
      </div>
      <div class="future-card" data-reveal><div><p class="eyebrow">The family will grow</p><h2>More games are joining the table.</h2><p class="lede">No unapproved title or date is being announced today. When another game is ready to meet the family, it will have a proper introduction.</p></div></div>
    </div></section>
    <section class="section navy"><div class="shell palace-band"><img src="assets/icon-palace-4hearts.webp" alt="Palace castle artwork" width="512" height="512" loading="lazy"><div><p class="eyebrow">Start with the flagship</p><h2>Palace leads the family.</h2><p class="lede">Try the deeper interactive preview and see why the three-layer shedding game anchors Four of Hearts.</p><a class="button" href="palace-play.html">Play Palace</a></div></div></section>`
}));

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
  description: "Start the flagship Palace preview or try short Hearts, Spades, and Euchre teaching moments from Four of Hearts Interactive.",
  path: "/play.html",
  current: "play",
  content: `
    ${pageHero("Quick Play", "Choose your table.", "Palace receives the full flagship preview. Hearts, Spades, and Euchre each offer two friendly teaching decisions.")}
    <section class="section"><div class="shell">
      <div class="featured-news panel">
        <div class="news-art"><img src="assets/icon-palace-4hearts.webp" alt="Palace castle artwork" width="512" height="512"></div>
        <div class="news-body"><span class="alpha-badge">Flagship preview</span><h2>Palace</h2><p>Clear three layers through legal play, matching, pickup, special-card awareness, and one final hidden reveal.</p><a class="button" href="palace-play.html">Play Palace</a></div>
      </div>
      <div class="game-grid">
        <article class="panel game-tile hearts"><img src="assets/icon-hearts-4hearts.webp" alt="Hearts ruby artwork" width="512" height="512" loading="lazy"><div class="game-tile-content"><h3>Hearts</h3><a class="text-link" href="hearts-play.html">Follow suit</a></div></article>
        <article class="panel game-tile spades"><img src="assets/icon-spades-4hearts.webp" alt="Spades purple artwork" width="512" height="512" loading="lazy"><div class="game-tile-content"><h3>Spades</h3><a class="text-link" href="spades-play.html">Play trump</a></div></article>
        <article class="panel game-tile euchre"><img src="assets/icon-euchre-4hearts.webp" alt="Euchre green artwork" width="512" height="512" loading="lazy"><div class="game-tile-content"><h3>Euchre</h3><a class="text-link" href="euchre-play.html">Find the bowers</a></div></article>
      </div>
    </div></section>`
}));

write("about.html", page({
  title: "About Four of Hearts Interactive | One Family. Many Games.",
  description: "Four daughters inspired Four of Hearts Interactive—a family-rooted game studio that measures success in smiles around the table.",
  path: "/about.html", current: "about", bodyClass: "about-page",
  content: `${pageHero("The studio behind Palace", "Four daughters. Four hearts. One idea worth building.", "Four of Hearts began at a family table: four daughters who love to play, and a belief that the best games leave people smiling long after the cards are put away.")}<section class="section family-story"><div class="shell story-split"><div><img src="assets/brand-mark-4oh.webp" alt="Four of Hearts Interactive four-heart logo" width="512" height="512"><div class="four-heart-line" aria-hidden="true"><span>♥</span><span>♥</span><span>♥</span><span>♥</span></div></div><div><p class="eyebrow">Why we exist</p><h2>We measure fun in smiles.</h2><p class="lede">Life is short. Playing together matters. Four daughters created the spark, four hearts became the name, and one family’s table became a studio promise for many families.</p><p><strong>One Family. Many Games.</strong></p></div></div></section><section class="section navy"><div class="shell quote-stage"><div class="quote-mark" aria-hidden="true">♛</div><div><p class="eyebrow">The founder</p><blockquote>Never stop asking why a game keeps people at the table.<cite>A lifelong student of games</cite></blockquote><p class="lede">Founder-supplied biography describes more than five decades playing, studying, teaching, testing, and thinking about games, plus more than two decades examining strategic interaction in a university environment. At Four of Hearts, “gameologist” is a playful word for that lifelong curiosity—not a license or academic credential.</p><p class="notice">These biography statements are founder-supplied and remain subject to final factual approval. No degree, professorship, employer, or publication claim is made.</p></div></div></section><section class="section"><div class="shell story-split"><div><p class="eyebrow">The flagship</p><h2>Palace deserves its definitive digital table.</h2><p class="lede">Its rules are immediate, its decisions stay interesting, and its hidden finish creates the kind of story families retell. That is why Palace leads Four of Hearts.</p></div><img src="assets/icon-palace-4hearts.webp" alt="Palace castle artwork" width="512" height="512" loading="lazy"></div></section>`
}));
write("support.html", page({
  title: "Support | Four of Hearts Interactive",
  description: "Contact Four of Hearts Interactive support and learn what to include in a useful Internal Alpha test report.",
  path: "/support.html",
  current: "support",
  content: `
    ${pageHero("Player support", "Let’s get you back to the table.", "If something went wrong while testing Palace or another Four of Hearts game, a clear report helps the team understand and improve it.")}
    <section class="section"><div class="shell support-layout">
      <aside class="panel support-card"><p class="eyebrow">Contact support</p><h2>Email the team.</h2><p>Use one message per issue and include the game name in the subject line.</p><p><a class="button small" href="mailto:support@4ohi.com?subject=Internal%20Alpha%20support%20request">support@4ohi.com</a></p><p>Do not send passwords, authentication codes, private keys, or unrelated personal information.</p></aside>
      <div class="prose"><h2>What to include</h2><ul class="checklist"><li>Game name and app version</li><li>Device model and operating-system version</li><li>Steps that reproduce the issue</li><li>What you expected and what happened instead</li><li>A screenshot or short recording when it is safe and useful</li></ul>
      <h2>Helpful categories</h2><div class="values-grid"><div class="status-card"><div><h3>Installation</h3><p>Opening, updating, or device compatibility.</p></div></div><div class="status-card"><div><h3>Gameplay</h3><p>Rules, turns, cards, scoring, or visual state.</p></div></div><div class="status-card"><div><h3>Ranked or reconnect</h3><p>Match status, ratings, table return, or session recovery.</p></div></div><div class="status-card"><div><h3>Accessibility or other</h3><p>Focus, contrast, text, motion, audio, controls, or anything else.</p></div></div></div>
      <p class="notice">Support is provided for current testing without a guaranteed response time. Do not include private information that is not needed to understand the issue.</p></div>
    </div></section>`
}));

write("privacy.html", page({
  title: "Privacy Choices & Policy | Four of Hearts Interactive",
  description: "Four of Hearts designed this website to avoid optional tracking: no analytics, advertising, cookies, browser storage, or visitor profiles.",
  path: "/privacy.html", current: "",
  content: `${pageHero("Privacy choices", "Collect nothing the website does not need.", "We designed this website to avoid optional tracking rather than asking visitors to accept it. The controls below report the current technical state; they are not a decorative consent banner.")}<section class="section navy"><div class="shell"><div class="privacy-dashboard" aria-label="Website privacy status"><div class="privacy-row"><div><b>Strictly necessary</b><p>Only ordinary hosting and internet delivery.</p></div><span>Infrastructure only</span></div><div class="privacy-row"><div><b>Analytics</b><p>No analytics scripts or visitor measurement.</p></div><span>Not used</span></div><div class="privacy-row"><div><b>Advertising</b><p>No ads, pixels, or targeted advertising.</p></div><span>Not used</span></div><div class="privacy-row"><div><b>Personalization tracking</b><p>No visitor profile or persisted tutorial progress.</p></div><span>Not used</span></div><div class="privacy-row"><div><b>Cross-site tracking</b><p>No third-party embeds or social widgets.</p></div><span>Not used</span></div><div class="privacy-row"><div><b>Sale or sharing</b><p>Website visitor information is not sold or shared for advertising.</p></div><span>Not performed</span></div><div class="privacy-row"><div><b>Tutorial progress</b><p>Held in page memory and discarded on refresh.</p></div><span>Not stored</span></div><div class="privacy-row"><div><b>Palace name setting</b><p>Current page session only.</p></div><span>Not persisted</span></div></div></div></section><section class="section"><div class="narrow prose"><h2>Your choices and rights</h2><p>Because the website does not activate optional trackers, there is nothing to accept or reject. Global Privacy Control and Do Not Track signals do not need to disable optional website tracking because none is loaded. If optional storage is ever introduced, it must remain off by default until any required affirmative choice is made.</p><p>Depending on where you live and whether a law applies, you may have rights to ask about, access, correct, or delete personal information. Email <a href="mailto:support@4ohi.com?subject=Privacy%20rights%20request">support@4ohi.com</a>. Four of Hearts does not sell or share website visitor information for cross-context behavioral advertising.</p><h2>Normal infrastructure</h2><p>GitHub Pages and ordinary internet providers may process request metadata needed to deliver and protect the site. Four of Hearts does not claim control over provider logs it does not operate.</p><h2>Support email</h2><p>If you contact support, the company receives the address, message, and attachments you choose to send. Include only what is needed.</p><p class="notice">This privacy text is designed for later California, European, and UK legal review. It does not claim formal certification or that every privacy law necessarily applies.</p></div></section>`
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
      <h2>Website security posture</h2><p>The site is static, uses local scripts and assets, has no form backend, account, analytics, ad code, cookie, social widget, dynamic HTML from visitors, or evaluation of supplied code. GitHub Pages does not expose arbitrary custom response-header controls, so the site does not claim headers the host cannot configure.</p>
    </div></section>`
}));

write("terms.html", page({
  title: "Internal Alpha Terms | Four of Hearts Interactive",
  description: "Conservative terms for invited Internal Alpha use of Four of Hearts Interactive games and website tutorials.",
  path: "/terms.html",
  current: "",
  content: `
    ${pageHero("Internal Alpha", "Terms of Use", "Last technically reviewed July 25, 2026. These plain-language terms describe a testing-stage website and game family, not a public commercial release.")}
    <section class="section"><div class="narrow prose">
      <h2>Current availability</h2><p>Palace, Hearts, Spades, and Euchre are in Internal Alpha. Access may be limited, changed, interrupted, or withdrawn. The website tutorials are short teaching previews, not complete matches and not gambling.</p>
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
      <div class="prose"><h2>Choose a clear subject</h2><ul><li><strong>Palace or game support:</strong> include the game name and Internal Alpha version.</li><li><strong>Privacy:</strong> describe the question without sending unnecessary personal information.</li><li><strong>Security:</strong> follow the safe guidance on the Security page.</li><li><strong>Company:</strong> state the purpose of the inquiry plainly.</li></ul><p>No home address or personal telephone number is published. The site does not use a contact-form backend.</p></div>
    </div></section>`
}));

write("404.html", page({
  title: "Page Not Found | Four of Hearts Interactive",
  description: "The requested Four of Hearts page could not be found.",
  path: "/404.html",
  current: "",
  noindex: true,
  content: `<section class="page-hero"><div class="shell"><p class="eyebrow">404 · Card not found</p><h1>This card isn’t in the deck.</h1><p class="lede">The page may have moved, but the Palace table is still waiting.</p><div class="actions"><a class="button" href="index.html">Return home</a><a class="button secondary" href="palace-play.html">Play Palace</a></div></div></section>`
}));

const sitemapFiles = [
  "index.html", "palace.html", "palace-play.html", "palace-story.html", "news.html",
  ...news.map((item) => articleFile(item.slug)),
  "games.html", "play.html", "hearts-play.html", "spades-play.html", "euchre-play.html",
  "about.html", "support.html", "privacy.html", "security.html", "terms.html", "contact.html"
];

write("sitemap.xml", `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapFiles.map((file) => `  <url><loc>${siteUrl}/${file === "index.html" ? "" : file}</loc></url>`).join("\n")}
</urlset>`);

write("feed.xml", `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Four of Hearts Interactive News</title>
    <link>${siteUrl}/news.html</link>
    <description>Palace development and studio news from Four of Hearts Interactive.</description>
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
