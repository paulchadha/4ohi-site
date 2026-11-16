export const palaceLeaderboardOrigin='https://plankton-app-qgwhz.ondigitalocean.app';
export const palaceLeaderboardPage=()=>`<section class="palace-board-scene" aria-labelledby="palace-board-title">
  <div class="palace-board-shell">
    <a class="palace-board-back" href="palace.html">← Palace</a>
    <header class="palace-board-heading"><p>— PALACE —</p><h1 id="palace-board-title">LEADERBOARD</h1><span>Official ranked standings</span></header>
    <div class="palace-board-grid" data-palace-leaderboard>
      <section class="palace-board-panel palace-board-global" aria-labelledby="palace-global-title" aria-busy="true" data-board-panel>
        <header class="palace-board-panel-heading"><h2 id="palace-global-title"><span aria-hidden="true">♜</span> GLOBAL TOP 25</h2><span>Ranked rating</span></header>
        <p class="palace-board-status" role="status" aria-live="polite" data-board-status>Loading official standings…</p>
        <div class="palace-board-table-wrap" tabindex="0" aria-label="Scroll the Global Top 25"><table class="palace-board-table" aria-label="Palace public ranked leaderboard"><thead><tr><th scope="col">Rank</th><th scope="col">Player</th><th scope="col">Rating</th></tr></thead><tbody data-board-rows></tbody></table></div>
      </section>
      <aside class="palace-board-side" aria-label="Leaderboard details">
        <section class="palace-board-panel palace-board-champion" aria-labelledby="palace-champion-title"><img src="assets/palace-leaderboard/crown.png" alt="" width="145" height="94"><h2 id="palace-champion-title">TOP PLAYER</h2><p class="palace-board-champion-name" data-board-champion-name>—</p><p class="palace-board-champion-score" data-board-champion-rating>—</p><p class="palace-board-rating-label">RATING</p></section>
        <section class="palace-board-panel palace-board-points" aria-labelledby="palace-points-title" data-points-explainer>
          <p class="palace-points-kicker">PLAYER VS PLAYER</p><h2 id="palace-points-title">Ranked match points</h2>
          <p class="palace-points-intro">Fixed points for accepted ranked matches between players.</p>
          <table class="palace-points-table"><caption>Placement points per accepted ranked match between players</caption><thead><tr><th scope="col">Players</th><th scope="col">1st</th><th scope="col">2nd</th><th scope="col">3rd</th><th scope="col">4th</th></tr></thead><tbody>
            <tr data-ranked-points-players="2"><th scope="row">2 players</th><td class="palace-points-win">+8</td><td>-8</td><td class="palace-points-na" aria-label="Not applicable">—</td><td class="palace-points-na" aria-label="Not applicable">—</td></tr>
            <tr data-ranked-points-players="3"><th scope="row">3 players</th><td class="palace-points-win">+8</td><td>-7</td><td>-8</td><td class="palace-points-na" aria-label="Not applicable">—</td></tr>
            <tr data-ranked-points-players="4"><th scope="row">4 players</th><td class="palace-points-win">+8</td><td>-6</td><td>-7</td><td>-8</td></tr>
          </tbody></table>
          <p class="palace-points-note">Bot matches do not change public standings.</p>
        </section>
      </aside>
    </div>
    <noscript><p class="palace-board-noscript">Enable JavaScript to load current standings, then refresh this page. Scores are read live from the Palace game service.</p></noscript>
  </div>
</section>`;
