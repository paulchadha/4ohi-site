const bosses = [
  ["100", "Dread Hive Master", "01-dread-hive-master"],
  ["200", "Crimson Colossus", "02-crimson-colossus"],
  ["300", "Void Reaver", "03-void-reaver"],
  ["400", "Xenothum Overlord", "04-xenothumb-overlord"],
  ["500", "Nebula Destroyer", "05-nebula-destroyer"],
  ["600", "The Great Thum Emperor", "06-great-thumb-emperor"],
  ["700", "Phantom Armada", "07-phantom-armada"],
  ["800", "Graviton Titan", "08-graviton-titan"],
  ["900", "Swarm Queen", "09-swarm-queen"],
  ["1000", "The Final Thumbination", "10-final-thumbination"]
];

const commanderNews = [
  ["commander-thumb-is-coming", "Commander ThumB Is Coming to Four of Hearts Interactive"],
  ["welcome-to-the-thum-system", "Welcome to the Thum System"],
  ["building-commander-thumb", "Building Commander ThumB: One Thumb, One Ship, 1,000 Levels"]
];

export const commanderPage = ({ page, company, siteUrl, gameNav }) => page({
  title: "Commander ThumB | Four of Hearts Interactive",
  description: "Enter the distant Thum System, defend the people of Thum B, and battle the invading fleets of Thum A in Commander ThumB—an original one-thumb arcade adventure from Four of Hearts Interactive.",
  path: "/commander-thumb.html",
  current: "commander",
  image: "assets/og-commander-thumb-70s.jpg",
  imageAlt: "Commander-Class ship defending Thum B in an original 1970s-inspired space illustration",
  bodyClass: "commander-page commander-promo",
  jsonLd: {
    "@context": "https://schema.org",
    "@type": "VideoGame",
    name: "Commander ThumB",
    description: "An upcoming original one-thumb arcade-defense adventure set in the fictional Thum System.",
    gamePlatform: "Mobile",
    applicationCategory: "Game",
    publisher: { "@type": "Organization", name: company },
    url: `${siteUrl}/commander-thumb.html`
  },
  content: `
    ${gameNav("commander", "overview")}
    <section class="retro-hero" id="overview" aria-labelledby="commander-title">
      <picture class="retro-hero-art">
        <source media="(max-width: 640px)" srcset="assets/commander-thumb-70s-hero-960.webp">
        <img src="assets/commander-thumb-70s-hero-1600.webp" alt="Commander-Class ship races above Thum B while a crimson invasion fleet descends and distant Thum C observes" width="1600" height="1067" fetchpriority="high">
      </picture>
      <div class="retro-hero-shade" aria-hidden="true"></div>
      <div class="shell retro-hero-copy">
        <p class="retro-issue">A Four of Hearts Interactive original · Mission File 001</p>
        <h1 id="commander-title"><span>Commander</span> ThumB</h1>
        <p class="retro-kicker">The hottest game in the galaxy!</p>
        <p class="retro-slogan">Save the base.<br>Save the ThumBs from disaster.<br><strong>Only you can do it!</strong></p>
        <div class="retro-actions"><span class="status-badge coming">Coming Soon</span><a class="button" href="#mission">Follow the mission</a></div>
      </div>
    </section>

    <section class="retro-story" id="story" aria-labelledby="story-title">
      <div class="shell">
        <header class="retro-section-heading"><p>Previously, in the Thum System…</p><h2 id="story-title">Three worlds. One war. One silence.</h2></header>
        <div class="retro-story-reel">
          <article><span>01</span><p class="retro-label">Thum A · Invades</p><h3>The red world strikes.</h3><p>The related ThumBs of harsh, industrial Thum A have sent an armored fleet across the darkness. No one yet knows why.</p></article>
          <article><span>02</span><p class="retro-label">Thum B · Defends</p><h3>A bright world stands together.</h3><p>Families, pilots, builders, and dreamers defend their peaceful home. Their last great hope is Commander ThumB.</p></article>
          <article><span>03</span><p class="retro-label">Thum C · Watches</p><h3>The scholars keep their counsel.</h3><p>Scientific Thum C observes, calculates, and refuses to choose a side. What do its leaders know about the war?</p></article>
        </div>
        <p class="retro-cliffhanger">Beneath the light of the star Thum, one pilot must save the base—and uncover the truth.</p>
      </div>
    </section>

    <section class="retro-mission" id="mission" aria-labelledby="mission-title">
      <div class="shell retro-mission-layout">
        <div>
          <p class="retro-label">Pilot’s manual</p>
          <h2 id="mission-title">One thumb. One ship. 1,000 levels.</h2>
          <p>Drag to move. Keep contact to fire. Break enemy formations before they reach Thum B, collect power-ups, recruit Wing ThumBs, and reinforce the base below.</p>
          <div class="retro-feature-grid">
            <article><b>MOVE</b><span>One-thumb control</span></article>
            <article><b>FIRE</b><span>Automatic action</span></article>
            <article><b>BUILD</b><span>Ship and base upgrades</span></article>
            <article><b>RECRUIT</b><span>Four Wing ThumBs</span></article>
            <article><b>SURVIVE</b><span>Ten escalating sectors</span></article>
            <article><b>DISCOVER</b><span>The mystery of Thum C</span></article>
          </div>
        </div>
        <figure class="retro-commander-card">
          <img src="assets/commander-thumb-character.svg" alt="Commander ThumB, defender of Thum B" width="320" height="360" loading="lazy">
          <figcaption>Commander ThumB<br><small>Thum B Defense Force</small></figcaption>
        </figure>
      </div>
    </section>

    <section class="retro-bosses" id="bosses" aria-labelledby="boss-title">
      <div class="shell">
        <header class="retro-section-heading"><p>Ten sectors · ten major threats</p><h2 id="boss-title">A new legend every 100 levels.</h2></header>
        <div class="retro-boss-reel">${bosses.map(([level, name, file]) => `<article><img src="assets/commander-thumb-boss-${file}.svg" alt="${name}, major boss at Level ${level}" width="150" height="150" loading="lazy"><b>Level ${level}</b><span>${name}</span></article>`).join("")}</div>
      </div>
    </section>

    <section class="retro-news" id="news" aria-labelledby="commander-news-title">
      <div class="shell">
        <header class="retro-section-heading"><p>Transmissions from mission control</p><h2 id="commander-news-title">The story is just beginning.</h2></header>
        <div class="retro-news-grid">${commanderNews.map(([slug, title]) => `<a href="news-${slug}.html"><span><b class="game-title-case">Commander ThumB</b> · Development</span><strong>${title}</strong><em>Read transmission →</em></a>`).join("")}</div>
        <div class="retro-final"><p>Thum A invades. Thum B defends. Thum C watches.</p><strong>Commander ThumB must save them all.</strong><span class="status-badge coming">Coming Soon</span></div>
      </div>
    </section>`
});
