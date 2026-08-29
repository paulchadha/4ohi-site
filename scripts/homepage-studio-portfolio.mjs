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
  <div class="shell opening-grid"><div class="opening-copy" data-reveal><p class="eyebrow">Independent software studio · South Dakota</p><h1 id="studio-title">Games, apps<br><em>and strong opinions.</em></h1><p>We like old games. We like new games. Mostly, we like making games—and the occasional useful lifestyle app.</p><div class="actions"><a class="button" href="#studio-lineup">See what we're making</a><a class="text-link" href="about.html">Meet 4OH ${arrow}</a></div></div>
  <div class="opening-constellation" aria-label="Featured Four of Hearts games"><a href="evil-doom-adventures.html"><img src="${gameByKey["evil-doom"].artwork}" alt="Evil Doom Girl and Evil Doom Boy"></a><a href="games/thumb-command/"><img src="${gameByKey["thumb-command"].heroArtwork}" alt="Thumb Command arcade defense artwork"></a><a href="heartstack-unicorn-blast.html"><img src="${gameByKey.heartstack.artwork}" alt="HeartStack Unicorn Blast unicorn key art"></a></div></div>
  <a class="scroll-cue" href="#palace-feature"><span>Meet the games</span><i aria-hidden="true"></i></a>
 </section>
 <div class="studio-ticker" aria-label="Four of Hearts game lineup"><div>${ticker}<i aria-hidden="true">♥</i>${ticker}</div></div>

 <section class="palace-feature" id="palace-feature" aria-labelledby="palace-feature-title"><div class="shell palace-feature-grid"><div class="palace-feature-art" data-reveal><img src="assets/palace-hero-1024.webp" alt="Palace castle rising beneath a bright sky" width="1024" height="1024"></div><div data-reveal><p class="eyebrow">Playable now · website mini-match</p><h2 id="palace-feature-title">The table legend.<br><em>One hidden finish.</em></h2><p>Match or beat the pile, spend four rule-changing cards wisely, then survive the cards nobody can see.</p><div class="actions"><a class="button" href="palace-play.html">Play Palace</a><a class="text-link" href="palace.html">See how it works ${arrow}</a></div></div></div></section>

 <section class="compact-powers" aria-labelledby="power-title"><div class="shell"><header data-reveal><p class="eyebrow">Four cards change the room</p><h2 id="power-title">Small cards. Large consequences.</h2></header><div class="compact-power-rail">
 <a href="palace.html#rules"><b>2♣</b><span>Reset</span><small>Anything follows.</small></a><a href="palace.html#rules"><b>7♦</b><span>Lower</span><small>Seven or lower.</small></a><a href="palace.html#rules"><b>8♠</b><span>Transparent</span><small>Read beneath it.</small></a><a href="palace.html#rules"><b>10♥</b><span>Burn</span><small>Clear the pile.</small></a>
 </div></div></section>

 <section class="studio-bridge" aria-labelledby="bridge-title"><div class="bridge-marquee" aria-hidden="true">4-OHHHH · 4-OHHHH · 4-OHHHH ·</div><div class="shell bridge-grid"><h2 id="bridge-title" data-reveal>4-OHHHH.<br><em>Now you get it.</em></h2><div data-reveal><p class="lede">Four of Hearts is an independent software studio building games—and the occasional useful lifestyle app—one strong idea at a time.</p><p>Cards, thumbs, bread dinosaurs, doom ninjas and unicorn explosions. It made sense at the time.</p><a class="text-link" href="games.html">See the complete lineup ${arrow}</a></div></div></section>

 <section class="studio-lineup" id="studio-lineup" aria-labelledby="lineup-title"><div class="shell"><header class="editorial-head" data-reveal><p class="eyebrow">The lineup</p><h2 id="lineup-title">What we're making.</h2><p>Independent software. Strong opinions. Too many games in progress.</p></header><div class="lineup-grid">${lineup.map(lineupFeature).join("")}</div></div></section>

 <section class="card-table-section" aria-labelledby="table-title"><div class="shell"><header data-reveal><p class="eyebrow">The card table</p><h2 id="table-title">Classics are classics<br>for a reason.</h2></header><div class="table-game-list">${table.map(cardTable).join("")}</div></div></section>

 <section class="studio-news-workbench" aria-labelledby="news-title"><div class="shell"><header class="editorial-head" data-reveal><p class="eyebrow">From the workbench</p><h2 id="news-title">What moved this week.</h2><a href="news.html">Open the newsroom ${arrow}</a></header><div class="workbench-list">${news.slice(0,5).map((item,index)=>`<a href="${articleFile(item.slug)}" data-reveal><span>0${index+1}</span><div><small>${item.category} · ${formatDate(item.date)}</small><h3>${item.title}</h3></div>${arrow}</a>`).join("")}</div></div></section>

 <section class="home-about-short"><div class="shell" data-reveal><p class="eyebrow">About 4OH</p><h2>Built by a founder who has spent a lifetime asking why one more game becomes one more hour.</h2><p>Four daughters inspired the name. Curiosity keeps the studio moving.</p><a class="button" href="about.html">The human story</a></div></section>`;
};
