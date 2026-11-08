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
        <footer class="palace-board-footer"><div><p data-board-count>Official Palace standings</p><p data-board-time>Waiting for the game service</p></div><button type="button" data-board-refresh>Refresh</button></footer>
      </section>
      <aside class="palace-board-side" aria-label="Leaderboard details">
        <section class="palace-board-panel palace-board-champion" aria-labelledby="palace-champion-title"><img src="assets/palace-leaderboard/crown.png" alt="" width="145" height="94"><h2 id="palace-champion-title">TOP PLAYER</h2><p class="palace-board-champion-name" data-board-champion-name>—</p><p class="palace-board-champion-score" data-board-champion-rating>—</p><p class="palace-board-rating-label">RATING</p></section>
        <section class="palace-board-panel palace-board-private"><h2>YOUR RANK</h2><p>Your personal standing stays private.</p><p>Sign in to Palace and open the Leaderboard room to see your rank.</p><a href="palace.html">About the Palace app →</a></section>
        <p class="palace-board-policy">Accepted ranked matches only. Local bot games stay separate. Equal ratings and wins share a rank.</p>
      </aside>
    </div>
    <noscript><p class="palace-board-noscript">Enable JavaScript to load current standings, then refresh this page. Scores are read live from the Palace game service.</p></noscript>
  </div>
</section>`;
