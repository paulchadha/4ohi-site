const arrow='<span aria-hidden="true">↗</span>';
const lineupOrder=["evil-doom","bobby","thumb-command","heartstack","princess-land","unicorn-land"];
const lineupClass={"evil-doom":"lineup-lead",bobby:"lineup-medium", "thumb-command":"lineup-medium",heartstack:"lineup-wide","princess-land":"lineup-small","unicorn-land":"lineup-small"};

const lineupFeature=(game)=>`<article class="lineup-feature ${lineupClass[game.key]}" data-lineup-game="${game.key}" data-reveal style="--lineup-accent:${game.theme.accent}">
  <a class="lineup-art-link" href="${game.primaryAction}" aria-label="Open ${game.title}"><img src="${game.heroArtwork}" alt="${game.alt}" width="1600" height="1000" loading="lazy"></a>
  <div class="lineup-copy"><p>${game.status} · ${game.genre}</p><h3><a href="${game.primaryAction}">${game.title}</a></h3><p>${game.shortDescription}</p><a class="lineup-action" href="${game.primaryAction}">${game.primaryActionLabel} ${arrow}</a></div>
</article>`;

const cardTable=(game)=>`<a class="table-game ${game.key}" href="${game.primaryAction}" data-reveal><img src="${game.artwork}" alt="" width="512" height="512" loading="lazy"><span><b>${game.title}</b><small>${game.shortDescription}</small></span>${arrow}</a>`;

export const studioPortfolioHomepage=({gameCatalog,gameByKey,news,articleFile,formatDate})=>{
 const lineup=lineupOrder.map((key)=>gameByKey[key]);
 const table=[gameByKey.palace,...gameCatalog.filter((game)=>game.group==="card-table")];
 const ticker=gameCatalog.map((game)=>`<span>${game.title}</span>`).join('<i aria-hidden="true">♥</i>');
 return `<section class="studio-opening" aria-labelledby="studio-title">
  <div class="opening-orbit" aria-hidden="true"><i></i><i></i><i></i></div>
  <div class="shell opening-grid"><div class="opening-copy" data-reveal><p class="eyebrow">Independent software · Built in South Dakota</p><h1 id="studio-title">Games we love.<br><em>Code we trust.</em></h1><p>Four of Hearts Interactive builds original games, practical software solutions, and custom applications with care.</p><div class="actions"><a class="button" href="#studio-lineup">Explore our work</a><a class="text-link" href="#studio-services">Build with 4OH ${arrow}</a></div></div>
  <figure class="opening-portfolio-board" data-reveal><a href="games.html" aria-label="Explore the Four of Hearts Interactive portfolio"><img src="assets/portfolio-2026/four-of-hearts-studio-portfolio-board.webp" alt="Four of Hearts Interactive portfolio board featuring Thumb Command, Bobby the Breadasaurus, Evil Doom Girl, Evil Doom Boy, HeartStack Unicorn Blast, Princess Land, Unicorn Land, Hearts, Spades, Euchre, and the People Lens application concept" width="1536" height="1024"></a><figcaption>Games, card-table classics, and application concepts from Four of Hearts Interactive.</figcaption></figure></div>
  <a class="scroll-cue" href="#studio-lineup"><span>See the lineup</span><i aria-hidden="true"></i></a>
 </section>
 <div class="studio-ticker" aria-label="Four of Hearts game lineup"><div>${ticker}<i aria-hidden="true">♥</i>${ticker}</div></div>

 <section class="palace-feature" id="palace-feature" aria-labelledby="palace-feature-title"><div class="shell palace-feature-grid"><div class="palace-feature-art" data-reveal><img src="assets/palace-hero-1024.webp" alt="Palace castle rising beneath a bright sky" width="1024" height="1024"></div><div data-reveal><p class="eyebrow">Playable now · website mini-match</p><h2 id="palace-feature-title">The table legend.<br><em>One hidden finish.</em></h2><p>Match or beat the pile, spend four rule-changing cards wisely, then survive the cards nobody can see.</p><div class="actions"><a class="button" href="palace-play.html">Play Palace</a><a class="text-link" href="palace.html">See how it works ${arrow}</a></div></div></div></section>

 <section class="compact-powers" aria-labelledby="power-title"><div class="shell"><header data-reveal><p class="eyebrow">Four cards change the room</p><h2 id="power-title">Small cards. Large consequences.</h2></header><div class="compact-power-rail">
 <a href="palace.html#rules"><b>2♣</b><span>Reset</span><small>Anything follows.</small></a><a href="palace.html#rules"><b>7♦</b><span>Lower</span><small>Seven or lower.</small></a><a href="palace.html#rules"><b>8♠</b><span>Transparent</span><small>Read beneath it.</small></a><a href="palace.html#rules"><b>10♥</b><span>Burn</span><small>Clear the pile.</small></a>
 </div></div></section>

 <section class="studio-bridge" aria-labelledby="bridge-title"><div class="bridge-marquee" aria-hidden="true">4-OHHHH · 4-OHHHH · 4-OHHHH ·</div><div class="shell bridge-grid"><h2 id="bridge-title" data-reveal>Independent.<br><em>On purpose.</em></h2><div data-reveal><p class="lede">Four of Hearts is a serious independent software studio with room for strong ideas and the discipline to ship them.</p><p>Games, useful apps, custom software, and the occasional bread dinosaur. It made sense at the time.</p><a class="text-link" href="about.html">How we work ${arrow}</a></div></div></section>

 <section class="studio-lineup" id="studio-lineup" aria-labelledby="lineup-title"><div class="shell"><header class="editorial-head" data-reveal><p class="eyebrow">The lineup</p><h2 id="lineup-title">What we're making.</h2><p>Independent software. Strong opinions. Too many games in progress.</p></header><div class="lineup-grid">${lineup.map(lineupFeature).join("")}</div></div></section>

 <section class="card-table-section" aria-labelledby="table-title"><div class="shell"><header data-reveal><p class="eyebrow">The card table</p><h2 id="table-title">Classics are classics<br>for a reason.</h2></header><div class="table-game-list">${table.map(cardTable).join("")}</div></div></section>

 <section class="studio-services" id="studio-services" aria-labelledby="services-title"><div class="shell services-grid"><div data-reveal><p class="eyebrow">Software solutions</p><h2 id="services-title">Need an app?<br><em>We build those too.</em></h2></div><div class="services-copy" data-reveal><p class="lede">Our creative technology studio designs and builds custom apps, interactive prototypes, branded experiences, and practical internal tools.</p><p>Small team. Direct communication. Fast, focused iteration—from a strong first concept to software people can actually use.</p><div class="services-list" role="list"><span role="listitem">Custom applications</span><span role="listitem">Interactive prototypes</span><span role="listitem">Product and UX design</span><span role="listitem">Creative technology</span></div><div class="actions"><a class="button" href="mailto:support@4ohi.com?subject=Custom%20application%20project">Start a project</a><a class="text-link" href="about.html">Meet the studio ${arrow}</a></div></div></div></section>

 <section class="studio-news-workbench" aria-labelledby="news-title"><div class="shell"><header class="editorial-head" data-reveal><p class="eyebrow">From the workbench</p><h2 id="news-title">What moved this week.</h2><a href="news.html">Open the newsroom ${arrow}</a></header><div class="workbench-list">${news.slice(0,5).map((item,index)=>`<a href="${articleFile(item.slug)}" data-reveal><span>0${index+1}</span><div><small>${item.category} · ${formatDate(item.date)}</small><h3>${item.title}</h3></div>${arrow}</a>`).join("")}</div></div></section>

 <section class="home-about-short"><div class="shell" data-reveal><p class="eyebrow">About 4OH</p><h2>Games made with care. Software built to solve something.</h2><p>Four of Hearts became 4OH when somebody said it out loud. The name stuck. Curiosity, craft, and respect for people keep the studio moving.</p><a class="button" href="about.html">The human story</a></div></section>`;
};
