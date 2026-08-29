const arrow = '<span aria-hidden="true">→</span>';

const majorWorld = (game, className, options = {}) => `<a class="world-spread ${className}" href="${options.href ?? game.infoUrl}" data-home-game="${game.key}" style="--game-accent:${game.theme.accent}">
  <img src="${options.art ?? game.heroArtwork}" alt="${game.alt}" width="1600" height="1000" ${options.priority ? 'fetchpriority="high"' : 'loading="lazy"'}>
  <div class="world-spread-copy"><span data-canadian-key="${game.key}.status">${game.status} · ${game.genre}</span><h3>${game.title}</h3><p data-canadian-key="${game.key}.short">${game.shortDescription}</p><b data-canadian-key="${game.key}.action">${options.action ?? game.primaryActionLabel}</b> ${arrow}</div>
</a>`;

const portfolioGame = (game) => `<a class="portfolio-link ${game.key}" href="${game.primaryAction}" data-portfolio-game="${game.key}" style="--game-accent:${game.theme.accent}">
  <img src="${game.artwork}" alt="${game.alt}" width="960" height="960" loading="lazy">
  <div><span data-canadian-key="${game.key}.status">${game.status}</span><h3>${game.title}</h3><b>${game.primaryActionLabel} ${arrow}</b></div>
</a>`;

export const playableStudioHomepage = ({ gameCatalog, gameByKey, news, articleFile, formatDate, productCopy }) => {
  const palace = gameByKey.palace;
  const bobby = gameByKey.bobby;
  const doom = gameByKey["evil-doom"];
  const thumbCommand = gameByKey["thumb-command"];
  return `<section class="studio-marquee" aria-labelledby="studio-marquee-title"><div class="shell marquee-grid">
    <div class="marquee-copy"><p class="marquee-kicker" data-canadian-key="home.marqueeKicker">Independent games. Distinct worlds.</p><h1 id="studio-marquee-title" data-canadian-key="home.marqueeTitle">Four of Hearts <span>Interactive</span></h1><p data-canadian-key="home.marqueeStatement">Seven original game worlds from one independent studio.</p><div class="actions"><a class="button" href="#game-worlds" data-canadian-key="home.explore">Explore the Games</a><a class="button secondary" href="palace-play.html" data-canadian-key="home.play">Play Palace</a></div></div>
    <div class="marquee-art" aria-label="Featured game worlds">
      <a class="art-palace" href="palace.html" aria-label="Explore Palace"><img src="${palace.heroArtwork}" alt="" width="900" height="620" fetchpriority="high"></a>
      <a class="art-bobby" href="${bobby.infoUrl}" aria-label="Meet Bobby the Breadasaurus"><img src="${bobby.artwork}" alt="" width="720" height="720"></a>
      <a class="art-doom" href="${doom.infoUrl}" aria-label="Enter Evil Doom Adventures: Shadow Run"><img src="${doom.artwork}" alt="" width="1200" height="620"></a>
      <a class="art-thumb-command" href="${thumbCommand.infoUrl}" aria-label="Explore Thumb Command"><img src="${thumbCommand.artwork}" alt="" width="960" height="960"></a>
    </div>
  </div></section>
  <section class="editorial-worlds" id="game-worlds" aria-labelledby="worlds-title"><div class="shell editorial-heading"><h2 id="worlds-title" data-canadian-key="home.worldsTitle">Choose your next world.</h2><p data-canadian-key="home.worldsIntro">Card-table competition, colorful adventure, shadow-running rescue, and one-thumb arcade defense.</p></div><div class="shell">
    ${majorWorld(palace, "world-spread--palace", { href: palace.infoUrl, action: "Explore Palace", priority: true })}
    <div class="world-interlock">
      ${majorWorld(bobby, "world-spread--bobby", { art: bobby.artwork })}
      ${majorWorld(doom, "world-spread--doom", { art: doom.artwork })}
    </div>
    ${majorWorld(thumbCommand, "world-spread--thumb-command")}
  </div></section>
  <section class="palace-play-band" aria-labelledby="play-palace-title"><div class="shell palace-band-grid"><img src="${palace.artwork}" alt="Palace castle game artwork" width="320" height="320" loading="lazy"><div><p class="eyebrow">Playable on 4ohi.com</p><h2 id="play-palace-title">Rule the table.</h2><p data-canadian-key="palace.detail">Match or beat the pile, master four power cards, and survive the final hidden card.</p></div><div class="actions"><a class="button" href="palace-play.html" data-canadian-key="palace.action">Play Palace</a><a class="button secondary" href="palace.html">About Palace</a></div></div></section>
  <section class="portfolio-reel-section" aria-labelledby="portfolio-title"><div class="shell"><header class="reel-head"><div><h2 id="portfolio-title" data-canadian-key="home.portfolioTitle">All seven games.</h2><p data-canadian-key="home.portfolioIntro">Every current Four of Hearts world, with honest development status.</p></div><div class="reel-controls" aria-label="Scroll games"><button type="button" data-portfolio-prev aria-label="Previous games">←</button><button type="button" data-portfolio-next aria-label="Next games">→</button></div></header><div class="portfolio-reel" data-portfolio-reel>${gameCatalog.map(portfolioGame).join("")}</div></div></section>
  <section class="studio-news-compact" aria-labelledby="latest-title"><div class="shell"><header class="editorial-heading"><h2 id="latest-title" data-canadian-key="home.newsTitle">Latest from the studio.</h2><p data-canadian-key="home.newsIntro">Honest development notes from the worlds currently taking shape.</p></header><div class="studio-news-list">${news.slice(0, 3).map((item) => `<a class="studio-news-card" href="${articleFile(item.slug)}"><img src="${item.image}" alt="" width="320" height="180" loading="lazy"><div><div class="news-meta"><span>${item.category}</span><time datetime="${item.date}">${formatDate(item.date)}</time></div><h3>${productCopy(item.title)}</h3><p>${productCopy(item.description)}</p></div><span aria-hidden="true">→</span></a>`).join("")}</div><div class="actions"><a class="text-link" href="news.html">All studio news →</a></div></div></section>
  <section class="studio-signoff"><div class="shell"><p data-canadian-key="home.signoff">Four of Hearts Interactive makes original games that are easy to start and worth coming back to.</p></div></section>`;
};
