const arrow = '<span aria-hidden="true">↗</span>';

const countdown = () => `<div class="launch-countdown" data-launch-countdown role="timer" aria-live="off">
  <span class="launch-countdown-label">Palace app target · October 17, 2026</span>
  <span class="countdown-unit"><b data-countdown="days">00</b><small>days</small></span>
  <span class="countdown-unit"><b data-countdown="hours">00</b><small>hours</small></span>
  <span class="countdown-unit"><b data-countdown="minutes">00</b><small>min</small></span>
  <span class="countdown-unit"><b data-countdown="seconds">00</b><small>sec</small></span>
</div>`;

const portfolioGame = (game, index) => `<a class="portfolio-link ${game.key}" href="${game.primaryAction}" data-portfolio-game="${game.key}" style="--game-accent:${game.theme.accent}" data-reveal>
  <span class="portfolio-index">0${index + 1}</span>
  <img src="${game.heroArtwork || game.artwork}" alt="${game.alt}" width="1600" height="1000" loading="lazy">
  <div class="portfolio-copy"><span data-canadian-key="${game.key}.status">${game.status} · ${game.genre}</span><h3>${game.title}</h3><p>${game.shortDescription}</p><b>${game.primaryActionLabel} ${arrow}</b></div>
</a>`;

const newsFeature = (item, articleFile, formatDate, productCopy, className = "") => `<a class="studio-news-story ${className}" href="${articleFile(item.slug)}" data-reveal>
  <img src="${item.image}" alt="" width="1200" height="630" loading="lazy">
  <div><p class="news-meta"><span>${item.category}</span><time datetime="${item.date}">${formatDate(item.date)}</time></p><h3>${productCopy(item.title)}</h3><p>${productCopy(item.description)}</p><b>Read the story ${arrow}</b></div>
</a>`;

export const playableStudioHomepage = ({ gameCatalog, gameByKey, news, articleFile, formatDate, productCopy }) => {
  const palace = gameByKey.palace;
  const featuredNews = news.slice(0, 4);
  return `
  <section class="palace-campaign-hero" aria-labelledby="home-palace-title">
    <picture class="palace-hero-environment" aria-hidden="true">
      <source media="(max-width:600px)" srcset="assets/palace-hero-640.webp">
      <img src="assets/palace-hero-1024.webp" alt="" width="1024" height="1024" fetchpriority="high">
    </picture>
    <div class="palace-hero-sky" aria-hidden="true"></div>
    <div class="shell palace-campaign-grid">
      <div class="palace-campaign-copy" data-reveal>
        <p class="campaign-kicker">Four of Hearts Interactive presents</p>
        <h1 id="home-palace-title"><span>Palace</span> is finally coming home.</h1>
        <p class="campaign-deck">Three levels. One pile. One crown. The card-table legend is becoming an app—built by Four of Hearts.</p>
        <div class="campaign-status"><span>Internal Alpha</span><span>Founder testing</span><span>No public app build yet</span></div>
        <div class="actions"><a class="button campaign-primary" href="palace-play.html">Play the web mini-match</a><a class="button campaign-secondary" href="palace.html">Enter Palace</a></div>
      </div>
      <div class="palace-countdown-wrap" data-reveal>
        ${countdown()}
        <a href="news-why-were-building-palace.html">Why we’re building Palace ${arrow}</a>
      </div>
    </div>
    <a class="scroll-cue" href="#palace-play-now"><span>Scroll to play</span><i aria-hidden="true"></i></a>
  </section>

  <section class="palace-play-now" id="palace-play-now" aria-labelledby="play-now-title">
    <div class="shell play-now-grid">
      <div class="play-now-art" data-reveal><img src="${palace.artwork}" alt="Palace castle game artwork" width="768" height="768" loading="lazy"></div>
      <div class="play-now-copy" data-reveal>
        <p class="eyebrow">Learn it by playing it</p>
        <h2 id="play-now-title">Match. Beat. Burn. Win.</h2>
        <p class="lede">Play the same rank, climb higher, or change the whole table with a power card. The last hidden cards decide whether your plan survives.</p>
        <ol class="play-rhythm"><li><b>01</b><span>Match the pile or play higher.</span></li><li><b>02</b><span>Use 2, 7, 8, and 10 to change the rules.</span></li><li><b>03</b><span>Clear your hand, face-up row, then the mystery cards.</span></li></ol>
        <div class="actions"><a class="button" href="palace-play.html">Take your seat</a><a class="text-link" href="palace-faq.html">Read the full rules ${arrow}</a></div>
      </div>
    </div>
  </section>

  <section class="home-power-world" aria-labelledby="home-power-title">
    <div class="shell home-power-heading" data-reveal><p class="eyebrow">Four cards change everything</p><h2 id="home-power-title">Meet the troublemakers.</h2><p>Every suit has the power. The rank makes the rule.</p></div>
    <div class="power-river" aria-label="Palace power cards">
      <a href="palace.html#rules" class="river-card river-card--2" data-reveal><span>2♣</span><strong>Reset</strong><small>Anything may follow.</small></a>
      <a href="palace.html#rules" class="river-card river-card--7 red" data-reveal><span>7♦</span><strong>Lower</strong><small>Seven or lower follows.</small></a>
      <a href="palace.html#rules" class="river-card river-card--8" data-reveal><span>8♠</span><strong>Transparent</strong><small>Read the card beneath.</small></a>
      <a href="palace.html#rules" class="river-card river-card--10 red" data-reveal><span>10♥</span><strong>Burn</strong><small>Clear it. Lead again.</small></a>
    </div>
  </section>

  <section class="home-story-beat">
    <div class="shell story-beat-grid">
      <p class="story-beat-number" aria-hidden="true">4♥</p>
      <div data-reveal><p class="eyebrow">Passed hand to hand</p><h2>No box. No single rulebook. Just one more game.</h2><p>Palace belongs to a living family of shedding games carried through kitchens, dorms, ships, barracks, hostels, and late-night tables. Four of Hearts is giving that tradition a clear digital home.</p><a class="text-link" href="palace-story.html">Fact, folklore & the stories tables tell ${arrow}</a></div>
    </div>
  </section>

  <section class="home-news-editorial" aria-labelledby="home-news-title">
    <div class="shell">
      <header class="home-editorial-head" data-reveal><p class="eyebrow">From the studio</p><h2 id="home-news-title">What we’re making.<br>What we’re learning.</h2><a href="news.html">All news ${arrow}</a></header>
      <div class="home-news-layout">
        ${featuredNews.map((item, index) => newsFeature(item, articleFile, formatDate, productCopy, index === 0 ? "is-featured" : "")).join("")}
      </div>
    </div>
  </section>

  <section class="home-portfolio" id="game-worlds" aria-labelledby="home-worlds-title">
    <div class="shell portfolio-intro" data-reveal><p class="eyebrow">One family. Many games.</p><h2 id="home-worlds-title">Seven worlds.<br>Every one plays differently.</h2><p>Palace wears the crown. The rest of the family refuses to sit quietly.</p></div>
    <div class="portfolio-stage">${gameCatalog.map(portfolioGame).join("")}</div>
  </section>

  <section class="home-family-story" aria-labelledby="home-family-title">
    <div class="family-color-field" aria-hidden="true"><i></i><i></i><i></i><i></i></div>
    <div class="shell family-story-grid">
      <div data-reveal><p class="eyebrow">Why Four of Hearts?</p><h2 id="home-family-title">Four daughters.<br>Four hearts.<br>One family table.</h2></div>
      <div data-reveal><p class="family-belief">Life is short. Play something that makes people smile.</p><p>We make games with clear rules, memorable worlds, and enough surprise to keep everyone at the table for one more round.</p><div class="actions"><a class="button" href="about.html">Meet Four of Hearts</a><a class="text-link" href="support.html">Talk to the studio ${arrow}</a></div></div>
    </div>
  </section>

  <section class="founder-signoff"><div class="shell" data-reveal><p class="eyebrow">A founder’s point of view</p><blockquote>“A lifetime watching what happens when rules meet people.”</blockquote><a href="about.html#founder">Read the story ${arrow}</a></div></section>
  `;
};