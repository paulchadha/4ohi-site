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

export const commanderPage = ({ page, company, siteUrl }) => page({
  title: "Commander Thum-B | Four of Hearts Interactive",
  description: "Enter the distant Thum System, defend the people of Thum B, and battle the invading fleets of Thum A in Commander Thum-B—an original one-thumb arcade adventure from Four of Hearts Interactive.",
  path: "/commander-thumb.html",
  current: "commander",
  image: "assets/og-commander-thumb.png",
  imageAlt: "Commander Thum-B flies above a defended base as colorful enemy fleets descend",
  bodyClass: "commander-page",
  jsonLd: {
    "@context": "https://schema.org",
    "@type": "VideoGame",
    name: "Commander Thum-B",
    description: "An upcoming original one-thumb arcade-defense adventure set in the fictional Thum System.",
    gamePlatform: "Mobile",
    applicationCategory: "Game",
    publisher: { "@type": "Organization", name: company },
    url: `${siteUrl}/commander-thumb.html`
  },
  content: `
    <section class="ct-hero" aria-labelledby="ct-hero-title">
      <picture class="ct-hero-art">
        <source media="(max-width: 640px)" srcset="assets/commander-thumb-hero-960.webp">
        <img src="assets/commander-thumb-hero-1600.webp" alt="Commander-Class ThumB Ship defending a futuristic base from descending enemy fleets in the Thum System" width="1600" height="900" fetchpriority="high">
      </picture>
      <div class="ct-shell ct-hero-copy">
        <img class="ct-hero-logo" src="assets/commander-thumb-logo.webp" alt="" width="900" height="323">
        <p class="ct-kicker">The hottest game in the galaxy!</p>
        <h1 id="ct-hero-title">Commander Thum-B</h1>
        <p class="ct-hero-message">Save the base. Save the ThumBs from disaster. <strong>Only you can do it!</strong></p>
        <p class="ct-lede">Far beyond Earth, beneath the light of the star Thum, a peaceful world is under attack.</p>
        <div class="actions"><span class="ct-status">Coming Soon</span><a class="ct-button" href="#mission">Follow the mission</a></div>
      </div>
    </section>

    <section class="ct-section ct-story" id="story" aria-labelledby="ct-story-title"><div class="ct-shell">
      <header class="ct-section-header"><div><p class="ct-kicker">A star. Three worlds. One unanswered question.</p><h2 class="ct-title" id="ct-story-title">The Thum System</h2></div><p class="ct-lede">Far beyond anything visible from Earth burns a brilliant star named Thum. Three inhabited planets orbit its light. Their people share an ancient ancestry—and the rounded, unmistakable form of the ThumBs—but their civilizations could not be more different.</p></header>
      <div class="ct-story-grid">
        <div><h3>Thum A has crossed the darkness.</h3><p>Thum A forged itself into a harsh military power ruled through fear, conquest, and strength. Its sharper armor, darker machines, and enormous fleets now bear down on neighboring Thum B.</p><h3>Thum B refuses to surrender.</h3><p>Thum B is bright, peaceful, and inventive: a world of communities, cities, families, pilots, engineers, and defenders. Its people never sought a war. Now they turn to their greatest pilot and protector—Commander Thum-B.</p></div>
        <div><h3>Thum C is watching.</h3><p>Thum C is devoted to science, learning, medicine, exploration, and education. Its leaders have not entered the war. They observe, record, calculate, and debate what role they should play.</p><p>Commander Thum-B must defend Thum B while uncovering why the invasion began, what Thum C knows, and whether a greater danger threatens every world orbiting Thum.</p><p><strong>The future of all three worlds may depend upon one pilot.</strong></p></div>
      </div>
    </div></section>

    <section class="ct-section" id="system-map" aria-labelledby="ct-map-title"><div class="ct-shell">
      <header class="ct-section-header"><div><p class="ct-kicker">Stylized mission map</p><h2 class="ct-title" id="ct-map-title">Three worlds orbit Thum.</h2></div><p class="ct-lede">This fictional map is designed for storytelling, not scientific scale. It shows the conflict that now divides the Thum System.</p></header>
      <div class="ct-system-wrap">
        <div class="ct-system-map" role="img" aria-label="The fictional Thum System contains the central star Thum and three inhabited planets: militarized Thum A, peaceful Thum B under attack, and scientific Thum C observing the conflict.">
          <span class="ct-map-disclaimer">Fictional system map · not to scale</span>
          <span class="ct-orbit ct-orbit-a" aria-hidden="true"></span><span class="ct-orbit ct-orbit-b" aria-hidden="true"></span><span class="ct-orbit ct-orbit-c" aria-hidden="true"></span>
          <span class="ct-star">Thum</span>
          <span class="ct-planet ct-planet-a"><b>Thum A</b><small>The Invading World</small></span>
          <span class="ct-planet ct-planet-b"><b>Thum B</b><small>The World Under Siege</small></span>
          <span class="ct-planet ct-planet-c"><b>Thum C</b><small>The World of Knowledge</small></span>
          <span class="ct-attack" aria-hidden="true">Invasion fleet</span>
          <span class="ct-observe" aria-hidden="true">Observing</span>
        </div>
        <div class="ct-map-key">
          <article class="a"><h3>Thum A</h3><p>Militarized, aggressive, industrial. Home of the invading forces.</p></article>
          <article class="b"><h3>Thum B</h3><p>Heroic, inventive, peaceful but capable. Home of Commander Thum-B and the base being defended.</p></article>
          <article class="c"><h3>Thum C</h3><p>Scientific, educational, analytical, and mysterious. Watching the conflict from afar.</p></article>
        </div>
      </div>
    </div></section>

    <section class="ct-section ct-civilizations" id="worlds" aria-labelledby="ct-worlds-title"><div class="ct-shell">
      <header class="ct-section-header"><div><p class="ct-kicker">Meet the three civilizations</p><h2 class="ct-title" id="ct-worlds-title">Related by ancestry. Divided by destiny.</h2></div><p class="ct-lede">Every inhabitant belongs to the wider ThumB civilization. Each world shaped that shared beginning into something entirely its own.</p></header>
      <div class="ct-civ-grid">
        <article class="ct-civilization thum-a"><figure><img src="assets/commander-thumb-rocket.svg" alt="A stern armored ThumB representing the militarized civilization of Thum A" width="240" height="280" loading="lazy"></figure><div><p class="ct-kicker">Thum A · The Conquerors</p><h3>Power sharpened into conquest.</h3><p>The ThumBs of Thum A forged their world into a massive military power. Now their fleets have crossed the darkness between the planets, bringing an invasion that could destroy the peace of the entire Thum System.</p></div></article>
        <article class="ct-civilization thum-b"><figure><img src="assets/commander-thumb-character.svg" alt="Commander Thum-B representing the brave and welcoming defenders of Thum B" width="240" height="280" loading="lazy"></figure><div><p class="ct-kicker">Thum B · The Defenders</p><h3>A community worth protecting.</h3><p>The people of Thum B are builders, explorers, families, and dreamers. They never asked for this war—but with Commander Thum-B in the sky and the planet standing together, they will fight to save their home.</p></div></article>
        <article class="ct-civilization thum-c"><figure><img src="assets/commander-thumb-nova.svg" alt="A calm ThumB researcher representing the scholars and scientists of Thum C" width="240" height="280" loading="lazy"></figure><div><p class="ct-kicker">Thum C · The Scholars</p><h3>Knowledge behind a veil.</h3><p>The scientists and scholars of Thum C have spent centuries studying the universe. They watch the invasion from afar, searching for answers—and perhaps concealing discoveries that could change the fate of every world orbiting Thum.</p></div></article>
      </div>
    </div></section>

    <section class="ct-section ct-commander" id="commander" aria-labelledby="ct-commander-title"><div class="ct-shell ct-commander-stage">
      <div class="ct-character-lockup" aria-label="Commander Thum-B, the Commander-Class ship, and the defended base">
        <img class="character" src="assets/commander-thumb-character.svg" alt="Commander Thum-B, the daring pilot and protector of Thum B" width="320" height="360" loading="lazy">
        <img class="ship" src="assets/commander-thumb-ship.svg" alt="The Commander-Class ThumB Ship" width="512" height="512" loading="lazy">
        <img class="base" src="assets/commander-thumb-base.svg" alt="A shielded defense base on Thum B" width="420" height="240" loading="lazy">
      </div>
      <div><p class="ct-kicker">Meet Commander Thum-B</p><h2 class="ct-title" id="ct-commander-title">The last great defense force has a commander.</h2><p class="ct-lede">Commander Thum-B is the most daring pilot on Thum B. Piloting the Commander-Class ThumB Ship, the commander must intercept the invading fleets of Thum A before they reach the bases, cities, and citizens below.</p><p>The controls may be simple, but the mission is enormous. Move with your thumb. Fire automatically. Build your ship. Recruit Wing ThumBs. Unlock missiles, rockets, shields, smart bombs, and base defenses. Face changing enemy formations and major threat concepts as the campaign grows through development.</p><div class="ct-mission-callout">One thumb.<br>One ship.<br>A growing campaign.<br>The entire Thum System is counting on you.</div></div>
    </div></section>

    <section class="ct-section ct-conflict" aria-labelledby="ct-conflict-title"><div class="ct-shell">
      <header class="ct-section-header"><div><p class="ct-kicker">The three-world conflict</p><h2 class="ct-title" id="ct-conflict-title">The line has been drawn.</h2></div><p class="ct-lede">The invasion is real. The reason is not. The mystery stays open for the missions ahead.</p></header>
      <div class="ct-conflict-flow" aria-label="Thum A invades, Thum B defends, and Thum C observes">
        <article class="a"><b>Thum A</b><span>Invades</span></article><span class="ct-flow-arrow" aria-hidden="true">→</span>
        <article class="b"><b>Thum B</b><span>Defends</span></article><span class="ct-flow-arrow" aria-hidden="true">→</span>
        <article class="c"><b>Thum C</b><span>Observes</span></article>
      </div>
      <p class="ct-question"><strong>Why did Thum A attack—and what does Thum C know?</strong></p>
    </div></section>

    <section class="ct-section ct-gameplay" id="mission" aria-labelledby="ct-gameplay-title"><div class="ct-shell ct-gameplay-panel">
      <header class="ct-section-header"><div><p class="ct-kicker">Your mission</p><h2 class="ct-title" id="ct-gameplay-title">Defend Thum B</h2></div><p class="ct-lede">Drag with your thumb to move. Keep touching the screen to fire automatically. Destroy formations before they reach the cities and bases below. Dodge missiles, bombs, lasers, and enemy ships while collecting upgrades.</p></header>
      <div class="ct-feature-grid">
        <article class="ct-feature"><b>01</b><h3>One-Thumb Control</h3><p>Drag anywhere to guide the Commander-Class ship while keeping the action visible.</p></article>
        <article class="ct-feature"><b>02</b><h3>Automatic Fire</h3><p>Keep contact with the screen and the ship keeps firing.</p></article>
        <article class="ct-feature"><b>03</b><h3>Wing ThumBs</h3><p>Recruit loyal support ships that fight beside you and absorb danger.</p></article>
        <article class="ct-feature"><b>04</b><h3>Base Defense</h3><p>Strengthen shields, repairs, turrets, and the defenses protecting Thum B.</p></article>
        <article class="ct-feature"><b>05</b><h3>Power-Ups</h3><p>Unlock missiles, ThumB rockets, shields, smart bombs, and more.</p></article>
        <article class="ct-feature"><b>10</b><h3>Ten Major Bosses</h3><p>A completely new major battle arrives every 100 levels.</p></article>
        <article class="ct-feature"><b>1K</b><h3>One Thousand Levels</h3><p>Cross ten escalating sectors of the Thum System.</p></article>
        <article class="ct-feature"><b>?</b><h3>The Mystery of Thum C</h3><p>Fight forward without surrendering the story’s biggest unanswered question.</p></article>
      </div>
      <div class="ct-wing-row" aria-label="Wing ThumB support ships">
        <figure><img src="assets/commander-thumb-wing-azure.svg" alt="Azure Wing ThumB support ship" width="160" height="160" loading="lazy"><figcaption>Azure Wing ThumB</figcaption></figure>
        <figure><img src="assets/commander-thumb-wing-verdant.svg" alt="Verdant Wing ThumB support ship" width="160" height="160" loading="lazy"><figcaption>Verdant Wing ThumB</figcaption></figure>
        <figure><img src="assets/commander-thumb-wing-nova.svg" alt="Nova Wing ThumB support ship" width="160" height="160" loading="lazy"><figcaption>Nova Wing ThumB</figcaption></figure>
        <figure><img src="assets/commander-thumb-wing-rocket.svg" alt="Rocket Wing ThumB support ship" width="160" height="160" loading="lazy"><figcaption>Rocket Wing ThumB</figcaption></figure>
      </div>
    </div></section>

    <section class="ct-section ct-bosses" id="bosses" aria-labelledby="ct-boss-title"><div class="ct-shell">
      <header class="ct-section-header"><div><p class="ct-kicker">Major battle milestones</p><h2 class="ct-title" id="ct-boss-title">Ten sectors. Ten legends.</h2></div><p class="ct-lede">Mini-bosses guard the route. Every 100 levels, an entirely new major boss waits at the edge of the next sector. Their secrets remain classified.</p></header>
      <div class="ct-boss-grid">${bosses.map(([level, name, file]) => `<article class="ct-boss-card"><img src="assets/commander-thumb-boss-${file}.svg" alt="${name}, the major boss at Level ${level}" width="220" height="220" loading="lazy"><div><b>Level ${level}</b><h3>${name}</h3></div></article>`).join("")}</div>
    </div></section>

    <section class="ct-section ct-mystery" id="mystery" aria-labelledby="ct-mystery-title"><div class="ct-shell"><div class="ct-mystery-copy">
      <p class="ct-kicker">The mystery of Thum C</p><h2 class="ct-title" id="ct-mystery-title">They are watching. They are calculating. They have not chosen a side.</h2>
      <p class="ct-lede">Thum C may possess knowledge that matters to the fate of all three worlds. What its scholars know—and why they remain outside the war—will be revealed only when the story is ready.</p>
      <p class="ct-hero-message">Thum A invades. Thum B defends. Thum C watches. <strong>Commander Thum-B must save them all.</strong></p>
      <div class="actions"><span class="ct-status">Coming Soon</span><a class="ct-button" href="#story">Review the briefing</a></div>
    </div></div></section>`
});
