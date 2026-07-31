export const bobbyPage = ({ page, company, siteUrl }) => page({
  title: "Bobby the Breadasaurus | Four of Hearts Interactive",
  description: "Meet Bobby the Breadasaurus, a warm family adventure in development at Four of Hearts Interactive.",
  path: "/bobby-the-breadasaurus.html",
  current: "bobby",
  bodyClass: "portfolio-game bobby-world",
  image: "assets/bobby/bobby-hero-1200.webp",
  imageAlt: "Bobby the Breadasaurus in a colorful prehistoric bread world",
  jsonLd: {
    "@context": "https://schema.org", "@type": "VideoGame", name: "Bobby the Breadasaurus",
    description: "A family adventure game in development at Four of Hearts Interactive.",
    publisher: { "@type": "Organization", name: company }, url: siteUrl + "/bobby-the-breadasaurus.html",
    gamePlatform: "In development"
  },
  content: `
    <section class="world-hero bobby-hero">
      <div class="world-hero-art" aria-hidden="true"><img src="assets/bobby/bobby-hero-1200.webp" alt=""></div>
      <div class="shell world-hero-grid">
        <div class="world-hero-copy"><p class="world-status">In development · Family adventure</p><p class="eyebrow">A new world from Four of Hearts Interactive</p>
          <h1>Bobby the<br><span>Breadasaurus</span></h1>
          <p class="world-lede">Small dinosaur. Big heart. An entire world of bread to bring home.</p>
          <div class="actions"><a class="button" href="#meet-bobby">Meet Bobby</a><a class="button secondary" href="news-bobby-the-breadasaurus-joins-the-family.html">Read the development note</a></div>
        </div>
        <figure class="world-hero-poster"><img src="assets/bobby/bobby-character-720.webp" alt="Bobby, a cheerful little bread dinosaur" width="720" height="720" fetchpriority="high"><figcaption>Concept artwork · Visual direction may evolve</figcaption></figure>
      </div>
      <p class="world-scroll-cue" aria-hidden="true">Follow the crumbs ↓</p>
    </section>
    <section class="bobby-story" id="meet-bobby"><div class="shell">
      <p class="chapter-mark">Chapter one · A loaf away from home</p>
      <div class="story-intro"><h2>Brave enough<br>to wander.<br><em>Kind enough to return.</em></h2><p>Bobby’s adventure begins far from the herd. The way home winds through crumbled lands, strange creatures, and more bread than one tiny dinosaur should reasonably be able to carry.</p></div>
      <div class="bread-beats" aria-label="Bobby game ideas">
        <article><span>01</span><h3>Collect</h3><p>Follow a trail of loaves, rolls, and crumbs through a playful prehistoric world.</p></article>
        <article><span>02</span><h3>Dodge</h3><p>Leap past hazards and outsmart the creatures standing between Bobby and home.</p></article>
        <article><span>03</span><h3>Reunite</h3><p>Find the herd and bring everyone back together. That is the heart of the adventure.</p></article>
      </div>
    </div></section>
    <section class="bobby-panorama"><img src="assets/bobby/bobby-world-960.webp" alt="A colorful landscape of floating islands, waterfalls, volcanoes, and bread-shaped places" width="960" height="560" loading="lazy"><div class="shell"><p>Every horizon promises a new flavor of trouble.</p></div></section>
    <section class="world-feature bobby-feature"><div class="shell feature-split">
      <div><p class="eyebrow">The adventure takes shape</p><h2>A world made to feel warm, surprising, and wonderfully edible.</h2><p>We are exploring responsive platforming, bread collecting, memorable creatures, and the simple emotional pull of finding your way back to the people who matter.</p><p class="honesty-note">Bobby the Breadasaurus is in concept development. Final gameplay, platforms, release timing, and character details have not been announced.</p></div>
      <figure><img src="assets/bobby/bobby-concept-board-960.webp" alt="Bobby the Breadasaurus concept board showing visual exploration of the hero, environments, and game ideas" width="960" height="640" loading="lazy"><figcaption>Founder concept board · names and labels inside the board are exploratory, not product announcements</figcaption></figure>
    </div></section>
    <section class="world-next"><div class="shell"><p>Another doorway is open.</p><h2>Run toward the shadows.</h2><a href="evil-doom-adventures.html">Enter Evil Doom Adventures <span aria-hidden="true">→</span></a></div></section>`
});

export const evilDoomPage = ({ page, company, siteUrl }) => page({
  title: "Evil Doom Adventures: Shadow Run | Four of Hearts Interactive",
  description: "Enter Evil Doom Adventures: Shadow Run, an action-platforming rescue story in development at Four of Hearts Interactive.",
  path: "/evil-doom-adventures.html",
  current: "evil-doom",
  bodyClass: "portfolio-game doom-world",
  image: "assets/evil-doom/evil-doom-hero-purple-1200.webp",
  imageAlt: "Evil Doom Boy and Evil Doom Girl in a moonlit shadow world",
  jsonLd: {
    "@context": "https://schema.org", "@type": "VideoGame", name: "Evil Doom Adventures: Shadow Run",
    description: "An action-platforming rescue story in development at Four of Hearts Interactive.",
    publisher: { "@type": "Organization", name: company }, url: siteUrl + "/evil-doom-adventures.html",
    gamePlatform: "In development"
  },
  content: `
    <section class="world-hero doom-hero">
      <div class="doom-moon" aria-hidden="true"></div><div class="doom-scratch" aria-hidden="true"></div>
      <div class="shell world-hero-grid">
        <div class="world-hero-copy"><p class="world-status">In development · Action platformer</p><p class="eyebrow">Two shadows. One way through.</p>
          <h1><span>Evil Doom</span><br>Adventures</h1><h2>Shadow Run</h2>
          <p class="world-lede">Trust is dangerous. Leaving each other behind is worse.</p>
          <div class="actions"><a class="button" href="#the-run">Start the story</a><a class="button secondary" href="news-shadow-run-enters-development.html">Development dispatch</a></div>
        </div>
        <figure class="world-hero-poster"><img src="assets/evil-doom/evil-doom-heroes-purple-1200.webp" alt="Evil Doom Boy and Evil Doom Girl, two shadow heroes" width="1200" height="620" fetchpriority="high"><figcaption>Concept artwork · Evil Girl direction uses 4OH deep purple</figcaption></figure>
      </div>
      <p class="world-scroll-cue" aria-hidden="true">Stay in the shadows ↓</p>
    </section>
    <section class="doom-oath" id="the-run"><div class="shell"><p class="chapter-mark">The rescue begins</p><h2>One will save.<br>The other will<br><em>return the favor.</em></h2><p>Choose Evil Doom Boy or Evil Doom Girl, then move through a world that wants them separated. Every jump, dash, and narrow escape pulls them closer to the same truth: neither gets out alone.</p></div></section>
    <section class="shadow-runners"><div class="shell">
      <article class="runner boy"><div class="runner-number">01</div><h2>Evil Doom Boy</h2><p>Fast, quiet, relentless. A shadow built for narrow ledges and impossible escapes.</p><ul><li>Run</li><li>Jump</li><li>Duck</li><li>Slide</li></ul></article>
      <div class="runner-vow" aria-hidden="true">×</div>
      <article class="runner girl"><div class="runner-number">02</div><h2>Evil Doom Girl</h2><p>Fierce, agile, fearless. Deep purple cuts through the dark wherever she moves.</p><ul><li>Dash</li><li>Climb</li><li>Rope</li><li>Swing</li></ul></article>
    </div></section>
    <section class="doom-worlds"><div class="shell"><p class="eyebrow">A world built from danger</p><h2>Keep moving.<br><span>The dark keeps score.</span></h2><figure><img src="assets/evil-doom/evil-doom-worlds-purple-1440.webp" alt="Shadow Run environment concepts including forests, caves, frozen peaks, a fortress, and a doom tower" width="1440" height="760" loading="lazy"><figcaption>Environment exploration · final worlds and level structure remain in development</figcaption></figure></div></section>
    <section class="world-feature doom-feature"><div class="shell feature-split">
      <div><p class="eyebrow">The movement promise</p><h2>A rescue story told at full speed.</h2><p>Shadow Run is being shaped around readable silhouettes, responsive movement, escalating obstacles, and two heroes whose differences become the way forward.</p><p class="honesty-note">Evil Doom Adventures: Shadow Run is in concept development. No public build, release date, platform list, level count, or age rating has been announced.</p></div>
      <figure><img src="assets/evil-doom/evil-doom-concept-board-a-purple-1280.webp" alt="Purple-accented Evil Doom Adventures concept board with heroes, worlds, enemies, and interface ideas" width="1280" height="854" loading="lazy"><figcaption>Founder concept board · selective color treatment by Four of Hearts Interactive</figcaption></figure>
    </div></section>
    <section class="world-next doom-next"><div class="shell"><p>Need a little sunlight?</p><h2>Follow the bread home.</h2><a href="bobby-the-breadasaurus.html">Meet Bobby the Breadasaurus <span aria-hidden="true">→</span></a></div></section>`
});
