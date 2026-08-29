const arrow='<span aria-hidden="true">↗</span>';
const action=(game)=>game.key==='palace'?'Play now':game.primaryActionLabel;
const worldFeature=(game,index)=>`<article class="studio-world ${game.key}" data-reveal style="--world-accent:${game.theme.accent}">
  <a class="studio-world-art" href="${game.primaryAction}"><img src="${game.heroArtwork}" alt="${game.alt}" width="1600" height="1000" loading="lazy"></a>
  <div class="studio-world-copy"><p><span>0${index+1}</span> ${game.genre} · ${game.status}</p><h3><a href="${game.primaryAction}">${game.title}</a></h3><p>${game.shortDescription}</p><a class="world-action" href="${game.primaryAction}">${action(game)} ${arrow}</a></div>
</article>`;
const cardTable=(game)=>`<a class="table-game ${game.key}" href="${game.primaryAction}" data-reveal><img src="${game.artwork}" alt="" width="512" height="512" loading="lazy"><span><b>${game.title}</b><small>${game.shortDescription}</small></span>${arrow}</a>`;

export const studioPortfolioHomepage=({gameCatalog,gameByKey,news,articleFile,formatDate})=>{
 const originals=gameCatalog.filter(g=>g.group==='original-worlds');
 const table=gameCatalog.filter(g=>g.group==='card-table');
 const ticker=gameCatalog.map(g=>`<span>${g.title}</span>`).join('<i aria-hidden="true">♥</i>');
 return `<section class="studio-opening" aria-labelledby="studio-title">
  <div class="opening-orbit" aria-hidden="true"><i></i><i></i><i></i></div>
  <div class="shell opening-grid"><div class="opening-copy" data-reveal><p class="eyebrow">Independent software studio · South Dakota</p><h1 id="studio-title">Ten worlds.<br><em>One restless studio.</em></h1><p>Four of Hearts Interactive builds original games and playful software with clear ideas, memorable characters, and no patience for beige.</p><div class="actions"><a class="button" href="#studio-portfolio">Enter the worlds</a><a class="text-link" href="about.html">Meet 4OH ${arrow}</a></div></div>
  <div class="opening-constellation" aria-label="Featured Four of Hearts worlds"><a href="games/commander-thum-b/"><img src="${gameByKey['thumb-command'].heroArtwork}" alt="Commander Thum-B worldwide defense artwork"></a><a href="bobby-the-breadasaurus.html"><img src="${gameByKey.bobby.heroArtwork}" alt="Bobby the Breadasaurus tower defense artwork"></a><a href="heartstack-unicorn-blast.html"><img src="${gameByKey.heartstack.heroArtwork}" alt="HeartStack Unicorn Blast artwork"></a></div></div>
  <a class="scroll-cue" href="#palace-feature"><span>Meet the games</span><i aria-hidden="true"></i></a>
 </section>
 <div class="studio-ticker" aria-label="Four of Hearts portfolio"><div>${ticker}<i aria-hidden="true">♥</i>${ticker}</div></div>

 <section class="palace-feature" id="palace-feature" aria-labelledby="palace-feature-title"><div class="shell palace-feature-grid"><div class="palace-feature-art" data-reveal><img src="assets/palace-hero-1024.webp" alt="Palace castle rising beneath a bright sky" width="1024" height="1024"></div><div data-reveal><p class="eyebrow">Playable now · website mini-match</p><h2 id="palace-feature-title">The table legend.<br><em>One hidden finish.</em></h2><p>Match or beat the pile, spend four rule-changing cards wisely, then survive the cards nobody can see.</p><div class="actions"><a class="button" href="palace-play.html">Play Palace</a><a class="text-link" href="palace.html">See how it works ${arrow}</a></div></div></div></section>

 <section class="compact-powers" aria-labelledby="power-title"><div class="shell"><header data-reveal><p class="eyebrow">Four cards change the room</p><h2 id="power-title">Small cards. Large consequences.</h2></header><div class="compact-power-rail">
 <a href="palace.html#rules"><b>2♣</b><span>Reset</span><small>Anything follows.</small></a><a href="palace.html#rules"><b>7♦</b><span>Lower</span><small>Seven or lower.</small></a><a href="palace.html#rules"><b>8♠</b><span>Transparent</span><small>Read beneath it.</small></a><a href="palace.html#rules"><b>10♥</b><span>Burn</span><small>Clear the pile.</small></a>
 </div></div></section>

 <section class="studio-bridge" aria-labelledby="bridge-title"><div class="bridge-marquee" aria-hidden="true">4-OHHHH · 4-OHHHH · 4-OHHHH ·</div><div class="shell bridge-grid"><h2 id="bridge-title" data-reveal>4-OHHHH.<br><em>Now you get it.</em></h2><div data-reveal><p class="lede">Four of Hearts is an independent software studio building games—and the occasional useful lifestyle app—one strong idea at a time.</p><p>Palace is one game. So are the nine worlds around it. The 4OH mark is the thread, not the genre.</p><a class="text-link" href="games.html">See the complete studio portfolio ${arrow}</a></div></div></section>

 <section class="original-worlds" id="studio-portfolio" aria-labelledby="worlds-title"><div class="shell"><header class="editorial-head" data-reveal><p class="eyebrow">Original worlds</p><h2 id="worlds-title">No house style.<br><em>Only a house standard.</em></h2><p>Every world earns its own rules, colour, pace, and point of view.</p></header><div class="world-sequence">${originals.map(worldFeature).join('')}</div></div></section>

 <section class="card-table-section" aria-labelledby="table-title"><div class="shell"><header data-reveal><p class="eyebrow">The card table</p><h2 id="table-title">Three classics.<br>Three different arguments.</h2></header><div class="table-game-list">${table.map(cardTable).join('')}</div></div></section>

 <section class="studio-news-workbench" aria-labelledby="news-title"><div class="shell"><header class="editorial-head" data-reveal><p class="eyebrow">The workbench</p><h2 id="news-title">What moved this week.</h2><a href="news.html">Open the newsroom ${arrow}</a></header><div class="workbench-list">${news.slice(0,5).map((item,index)=>`<a href="${articleFile(item.slug)}" data-reveal><span>0${index+1}</span><div><small>${item.category} · ${formatDate(item.date)}</small><h3>${item.title}</h3></div>${arrow}</a>`).join('')}</div></div></section>

 <section class="home-about-short"><div class="shell" data-reveal><p class="eyebrow">About 4OH</p><h2>Built by a founder who has spent a lifetime asking why one more game becomes one more hour.</h2><p>Four daughters inspired the name. Curiosity keeps the studio moving.</p><a class="button" href="about.html">The human story</a></div></section>`;
};
