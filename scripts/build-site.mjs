import { readFileSync, writeFileSync } from "node:fs";
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
    ["play", "palace-play.html", "How to Play"],
    ["news", "news.html", "News"],
    ["games", "games.html", "More Games"],
    ["about", "about.html", "About 4OH"],
    ["support", "support.html", "Support"]
  ];
  return `<header class="site-header">
    <div class="shell nav-wrap">
      <a class="brand" href="index.html"${current === "home" ? ' aria-current="page"' : ""}>
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
  const canonical = `${siteUrl}${path}`;
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${title}</title>
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
  <link rel="stylesheet" href="assets/palace-site.css">
  <script src="assets/site-config.js" defer></script>
  <script src="assets/site.js" defer></script>
  ${script}
  ${jsonLd ? `<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>` : ""}
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
  title: "Palace Card Game | Four of Hearts Interactive",
  description: "Meet Palace, the flagship Four of Hearts card game. Learn its three-layer rhythm, try an interactive preview, and follow Internal Alpha development.",
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
    <section class="hero" data-pointer-hero>
      <div class="shell hero-grid">
        <div class="hero-copy">
          <div class="status-line"><span class="alpha-badge">Internal Alpha</span> Four of Hearts presents</div>
          <h1>Rule the <span class="gold">table.</span></h1>
          <p class="lede">Palace is the card game every table remembers: simple to begin, full of momentum, and never quite finished until the last hidden card turns over.</p>
          <div class="actions">
            <a class="button" href="palace-play.html">Play the Palace preview</a>
            <a class="button secondary" href="palace.html">Discover Palace</a>
          </div>
        </div>
        <div class="palace-art" aria-label="Palace flagship artwork">
          <span class="floating-card one" aria-hidden="true">Q♠</span>
          <img src="assets/icon-palace-4hearts.webp" alt="Palace castle with blue towers and gold title" width="512" height="512" fetchpriority="high">
          <span class="floating-card two" aria-hidden="true">7♥</span>
        </div>
      </div>
    </section>

    <section class="section navy">
      <div class="shell palace-band">
        <div class="layer-stack" aria-label="Three layers of Palace" data-reveal>
          <div class="layer-card"><strong>Face-down finale</strong><span>The mystery waiting underneath.</span></div>
          <div class="layer-card"><strong>Face-up reserve</strong><span>Your visible plan for the endgame.</span></div>
          <div class="layer-card"><strong>Your hand</strong><span>Match, climb, and choose what to save.</span></div>
        </div>
        <div data-reveal>
          <p class="eyebrow">Three levels. One goal.</p>
          <h2>Clear every card in your Palace.</h2>
          <p class="lede">Play through your hand, unlock the cards everyone can see, then trust the hidden finale. Every layer changes what you know—and what you dare to play.</p>
          <div class="actions">
            <a class="button blue" href="palace-play.html">Learn by playing</a>
            <a class="text-link" href="palace-story.html">Follow the game’s story</a>
          </div>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="shell">
        <div class="section-heading">
          <div><p class="eyebrow">The Palace rhythm</p><h2>Easy first hand. Memorable last card.</h2></div>
          <p class="lede">The rules create a clean arc from control to uncertainty. Strategy matters, but the hidden cards keep every finish alive.</p>
        </div>
        <div class="feature-grid">
          <article class="panel feature-card" data-reveal><span class="number">01</span><h3>Read the pile</h3><p>Match the top rank or climb higher. A legal move is simple; the right move asks what comes next.</p></article>
          <article class="panel feature-card" data-reveal><span class="number">02</span><h3>Protect the ending</h3><p>Your face-up reserve is public information. Build a finish that can survive the table.</p></article>
          <article class="panel feature-card" data-reveal><span class="number">03</span><h3>Trust the unknown</h3><p>The final face-down cards arrive without a preview. That last reveal is pure Palace.</p></article>
        </div>
      </div>
    </section>

    <section class="section royal">
      <div class="shell">
        <div class="featured-news panel" data-reveal>
          <div class="news-art"><img src="${featured.image}" alt="${featured.imageAlt}" width="512" height="512" loading="lazy"></div>
          <div class="news-body">
            <div class="news-meta"><span>Featured · ${featured.category}</span><time datetime="${featured.date}">${formatDate(featured.date)}</time></div>
            <h2>${featured.title}</h2>
            <p>${featured.description}</p>
            <a class="button small" href="${articleFile(featured.slug)}">Read the story</a>
          </div>
        </div>
        <div class="actions"><a class="text-link" href="news.html">Visit the newsroom</a></div>
      </div>
    </section>

    <section class="section">
      <div class="shell">
        <div class="section-heading">
          <div><p class="eyebrow">More games from 4OH</p><h2>One flagship. A growing family.</h2></div>
          <p class="lede">Palace leads the way. Hearts, Spades, and Euchre bring three more timeless kinds of table strategy—all currently in Internal Alpha.</p>
        </div>
        <div class="game-grid">
          <article class="panel game-tile hearts" data-reveal><img src="assets/icon-hearts-4hearts.webp" alt="Hearts ruby artwork" width="512" height="512" loading="lazy"><div class="game-tile-content"><span class="alpha-badge">Internal Alpha</span><h3>Hearts</h3><p>Follow suit, duck the points, and know when to risk everything.</p><a class="text-link" href="hearts-play.html">Try the lesson</a></div></article>
          <article class="panel game-tile spades" data-reveal><img src="assets/icon-spades-4hearts.webp" alt="Spades royal purple artwork" width="512" height="512" loading="lazy"><div class="game-tile-content"><span class="alpha-badge">Internal Alpha</span><h3>Spades</h3><p>Bid with care, work with your partner, and let trump change the trick.</p><a class="text-link" href="spades-play.html">Try the lesson</a></div></article>
          <article class="panel game-tile euchre" data-reveal><img src="assets/icon-euchre-4hearts.webp" alt="Euchre green playing-card artwork" width="512" height="512" loading="lazy"><div class="game-tile-content"><span class="alpha-badge">Internal Alpha</span><h3>Euchre</h3><p>Make the call, trust your partner, and remember where the bowers rule.</p><a class="text-link" href="euchre-play.html">Try the lesson</a></div></article>
        </div>
      </div>
    </section>

    <section class="section compact navy">
      <div class="shell palace-band">
        <img src="assets/brand-mark-4oh.webp" alt="Four of Hearts Interactive emblem" width="570" height="365" loading="lazy">
        <div><p class="eyebrow">The studio behind Palace</p><h2>One Family. Many Games.</h2><p class="lede">Four of Hearts Interactive builds polished digital card tables with clear teaching, honest privacy choices, and room for the family to grow.</p><div class="actions"><a class="button secondary" href="about.html">Meet Four of Hearts</a></div></div>
      </div>
    </section>`
}));

write("palace.html", page({
  title: "Palace | Flagship Card Game from Four of Hearts",
  description: "Explore Palace, the flagship Four of Hearts shedding card game: three layers, readable strategy, hidden-card drama, and an honest Internal Alpha status.",
  path: "/palace.html",
  current: "palace",
  image: "assets/icon-palace-4hearts.webp",
  imageAlt: "Palace castle artwork",
  jsonLd: {
    "@context": "https://schema.org",
    "@type": "Game",
    name: "Palace",
    description: "A three-layer shedding card game currently in Internal Alpha at Four of Hearts Interactive.",
    publisher: { "@type": "Organization", name: company },
    url: `${siteUrl}/palace.html`,
    gameItem: "Standard playing cards"
  },
  content: `
    ${pageHero("The flagship experience", 'Welcome to <span class="metal-gold">Palace.</span>', "A shedding game with a visible plan, a hidden ending, and the kind of table story people teach to the next person.", '<div class="actions"><a class="button" href="palace-play.html">Play the preview</a><a class="button secondary" href="palace-story.html">Read the story</a></div>')}
    <section class="section navy"><div class="shell palace-band">
      <img src="assets/icon-palace-4hearts.webp" alt="Palace castle with blue towers" width="512" height="512">
      <div data-reveal><span class="alpha-badge">Founder testing underway</span><p class="eyebrow">Distinctly Palace</p><h2>Control gives way to mystery.</h2><p class="lede">You begin with cards in hand, move to a visible reserve, and finish with cards no one has seen—not even you. The goal is to get rid of every card before the table catches you.</p></div>
    </div></section>
    <section class="section"><div class="shell">
      <div class="section-heading"><div><p class="eyebrow">Why it stays with you</p><h2>A small rule set with a long memory.</h2></div><p class="lede">Palace creates tension without demanding a long explanation. The pile is readable, the choices are immediate, and the ending refuses to be predictable.</p></div>
      <div class="feature-grid">
        <article class="panel feature-card" data-reveal><span class="number">A</span><h3>Accessible</h3><p>Match or climb is an approachable first habit. Friendly contextual teaching handles the rest.</p></article>
        <article class="panel feature-card" data-reveal><span class="number">K</span><h3>Strategic</h3><p>Strong cards solve today’s problem but may leave tomorrow’s pile harder to escape.</p></article>
        <article class="panel feature-card" data-reveal><span class="number">?</span><h3>Uncertain</h3><p>Hidden cards turn a planned finish into a final act of nerve and luck.</p></article>
      </div>
    </div></section>
    <section class="section royal"><div class="shell">
      <div class="section-heading"><div><p class="eyebrow">Learn inside the action</p><h2>Your first Palace takes about a minute.</h2></div><p class="lede">Deal the three layers, make legal plays, take a pile, notice special cards, and clear the hidden finale. No account and nothing saved.</p></div>
      <a class="button" href="palace-play.html">Start the Palace preview</a>
    </div></section>
    <section class="section"><div class="shell palace-band">
      <div data-reveal><p class="eyebrow">A folk game, not a fixed artifact</p><h2>Passed from table to table.</h2><p class="lede">Palace belongs to a wider shedding-game family known by several regional names and house-rule traditions. Our story separates documented references from uncertain origins—and the Four of Hearts adaptation from both.</p><div class="actions"><a class="button secondary" href="palace-story.html">Explore the history</a></div></div>
      <div class="panel feature-card" data-reveal><span class="number">4♥</span><h3>The modern table</h3><p>Four of Hearts is shaping a clear, responsive Palace for contemporary phones and future real-time play. It remains in Internal Alpha.</p></div>
    </div></section>`
}));

write("palace-play.html", page({
  title: "How to Play Palace | Interactive Preview",
  description: "Learn the three layers, legal play, matching ranks, pickup, special-card awareness, and the goal of Palace in an accessible browser tutorial.",
  path: "/palace-play.html",
  current: "play",
  image: "assets/icon-palace-4hearts.webp",
  imageAlt: "Palace interactive tutorial",
  script: '<script src="assets/palace-tutorial.js" defer></script>',
  content: `
    ${pageHero("Learn by playing", "Build your first Palace.", "A 60–120 second interactive preview of the flagship game’s core rhythm. It is a teaching experience, not a production match.", '<div class="actions"><span class="alpha-badge">No account · No stakes · Nothing saved</span></div>')}
    <section class="section navy"><div class="shell"><div id="palace-tutorial" class="tutorial-stage" tabindex="-1" aria-label="Interactive Palace tutorial"></div><noscript><div class="notice">JavaScript is required for the interactive preview. The Palace story and product pages remain available without it.</div></noscript></div></section>
    <section class="section compact"><div class="shell"><h2>Designed for every player.</h2><div class="values-grid">
      <div class="status-card"><span class="icon" aria-hidden="true">⌨</span><div><h3>Keyboard and touch ready</h3><p>Every choice is a real button with visible focus and a generous target.</p></div></div>
      <div class="status-card"><span class="icon" aria-hidden="true">◌</span><div><h3>Your pace</h3><p>No timer, no penalty, and motion reduces automatically when your device asks.</p></div></div>
    </div></div></section>`
}));

write("palace-story.html", page({
  title: "The Story of Palace | Four of Hearts Interactive",
  description: "Explore Palace as a folk shedding-game tradition with many names and regional rules, then see how Four of Hearts is building its modern adaptation.",
  path: "/palace-story.html",
  current: "palace",
  image: "assets/icon-palace-4hearts.webp",
  imageAlt: "Palace castle artwork",
  content: `
    ${pageHero("The Palace story", "A game carried by memory.", "No single box owns Palace’s history. It lives in a family of shedding games passed between travelers, students, friends, and households—often under different names and rules.")}
    <section class="section"><div class="shell">
      <h2>A history with many hands.</h2>
      <div class="timeline">
        <article class="timeline-item" data-reveal><span class="timeline-dot">01</span><div><h3>Passed from table to table</h3><p>Palace is commonly documented as a shedding or beating game: players try to get rid of their cards, and ordinary play usually matches or exceeds the pile. Its informal transmission makes a single point of invention difficult to establish.</p></div></article>
        <article class="timeline-item" data-reveal><span class="timeline-dot">02</span><div><h3>Different names, shared spirit</h3><p>Reference sources record names including Palace, Karma, Shed, China Hand, and Ten-Two Slide. The names and details shift by region; the recognizable family resemblance remains.</p></div></article>
        <article class="timeline-item" data-reveal><span class="timeline-dot">03</span><div><h3>A traveler’s game</h3><p>Pagat describes the family as widely spread by young travelers and backpackers in the late twentieth century, with possible connections to Scandinavian games. That is a documented theory, not a proven single origin.</p></div></article>
        <article class="timeline-item" data-reveal><span class="timeline-dot">04</span><div><h3>Why families remember it</h3><p>A standard deck, a quick explanation, and three visible layers are enough to begin. House rules are part of the culture, especially around special ranks and pile-clearing effects.</p></div></article>
        <article class="timeline-item" data-reveal><span class="timeline-dot">05</span><div><h3>The Four of Hearts rule set</h3><p>Four of Hearts is turning a passed-along game into a deliberate product: consistent rules, in-context teaching, readable feedback, and a visual world centered on the Palace castle. Exact special-card effects remain subject to founder approval before public documentation.</p></div></article>
        <article class="timeline-item" data-reveal><span class="timeline-dot">06</span><div><h3>The next table</h3><p>Founder testing is underway. The goal is a definitive modern Palace experience for phones and future real-time play—without claiming a public release before one exists.</p></div></article>
      </div>
    </div></section>
    <section class="section navy"><div class="narrow prose">
      <p class="eyebrow">Source notes</p><h2>What we know—and what we do not.</h2>
      <p>The historical account intentionally avoids a definitive inventor or date. The strongest accessible rules reference reviewed for this page is <a href="https://www.pagat.com/beating/shithead.html" rel="noopener noreferrer">Pagat’s account of the game family</a>, which records regional names, backpacker transmission, common three-layer structure, and extensive variants.</p>
      <p><a href="https://en.wikipedia.org/wiki/Shithead_(card_game)" rel="noopener noreferrer">The reference trail for the related game family</a> points readers toward David Parlett’s published card-game work and a 2008 Guardian rules article. It is treated here as a bibliography lead rather than proof of a single origin.</p>
      <p class="note"><strong>Founder review:</strong> approve the exact Four of Hearts special-card table before those effects are published in the tutorial or history. The public site currently teaches only verified core structure and explicitly labels the unresolved boundary.</p>
    </div></section>`
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
  title: "About Four of Hearts Interactive",
  description: "Meet the South Dakota software studio behind flagship Palace and a growing family of polished card-table games.",
  path: "/about.html",
  current: "about",
  content: `
    ${pageHero("The studio behind Palace", "One Family. Many Games.", "Four of Hearts Interactive, LLC is a South Dakota software company building welcoming digital card games with product honesty, thoughtful teaching, and room to grow.")}
    <section class="section navy"><div class="shell palace-band">
      <img src="assets/brand-mark-4oh.webp" alt="Four of Hearts Interactive logo" width="570" height="365">
      <div class="prose"><h2>Built around the table.</h2><p>Palace is our flagship experience. Hearts, Spades, and Euchre are additional games in Internal Alpha, and future games may join the family when there is something real to share.</p><p>The approved brand board gives each game a jewel-tone identity inside one midnight, blue, gold, and silver studio system.</p></div>
    </div></section>
    <section class="section"><div class="shell values-grid">
      <article class="status-card"><span class="icon" aria-hidden="true">♥</span><div><h3>Welcoming by design</h3><p>Clear teaching, readable interfaces, and no casino framing.</p></div></article>
      <article class="status-card"><span class="icon" aria-hidden="true">✓</span><div><h3>Honest about status</h3><p>Internal Alpha means testing—not a fake public launch or store listing.</p></div></article>
      <article class="status-card"><span class="icon" aria-hidden="true">⌨</span><div><h3>Accessible in practice</h3><p>Keyboard, touch, reduced motion, contrast, and readable structure are product requirements.</p></div></article>
      <article class="status-card"><span class="icon" aria-hidden="true">◌</span><div><h3>Privacy-minded</h3><p>The public site avoids accounts, forms, analytics, ads, cookies, and social widgets.</p></div></article>
    </div></section>`
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
  title: "Privacy Policy | Four of Hearts Interactive",
  description: "Plain-language privacy information for the Four of Hearts website and current Internal Alpha game testing.",
  path: "/privacy.html",
  current: "",
  content: `
    ${pageHero("Privacy", "Privacy Policy", "Last technically reviewed July 25, 2026. This policy describes the current public website and Internal Alpha testing state; it will change before broader release if the products change.")}
    <section class="section"><div class="narrow prose">
      <h2>The public website</h2><p>This static website does not provide user accounts, collect form submissions, run analytics or advertising, set first-party cookies, use browser storage, or load social widgets. Its interactive tutorials keep progress only in page memory and discard it when the page closes or reloads.</p>
      <p>GitHub Pages and normal internet infrastructure may process standard request information needed to deliver the site. Four of Hearts does not claim unsupported control over provider logs or response headers.</p>
      <h2>Internal Alpha games</h2><p>Current test builds may process a chosen player name, avatar, optional profile-photo reference, preferences, generated identifier, rankings or ratings, table and session information, game actions and results, reconnect information, and operational diagnostics needed to run and improve a match.</p>
      <p>The current architecture has been described as using temporary in-memory multiplayer sessions and rankings rather than a durable production account database. There is no production account system represented as active. Those statements require revalidation for every shipping build and server revision.</p>
      <h2>Support communications</h2><p>If you email support, the company receives the address, message, and attachments you choose to provide. Send only what is needed. Retention and deletion procedures require formal approval before wider launch.</p>
      <h2>Children and families</h2><p>The company’s family-friendly positioning does not replace legal review, age-appropriate design work, or any consent and disclosure requirements that may apply. No public commercial availability is claimed.</p>
      <h2>Questions</h2><p>Email <a href="mailto:support@4ohi.com?subject=Privacy%20question">support@4ohi.com</a>. Do not send passwords or authentication material.</p>
      <p class="notice">Qualified privacy and legal review remains required before public commercial launch.</p>
    </div></section>`
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
