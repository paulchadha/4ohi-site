const art = (stem, alt, { eager = false, className = "" } = {}) => `
  <picture${className ? ` class="${className}"` : ""}>
    <source type="image/webp" srcset="assets/thumb-command/${stem}-720.webp 720w, assets/thumb-command/${stem}-1280.webp 1280w, assets/thumb-command/${stem}-1600.webp 1600w" sizes="(max-width: 760px) 100vw, 90vw">
    <img src="assets/thumb-command/${stem}-1600.jpg" alt="${alt}" width="1600" height="900"${eager ? ' fetchpriority="high"' : ' loading="lazy"'} decoding="async">
  </picture>`;

const gameplay = [
  ["01", "Move on instinct", "Guide the Blueguard with direct thumb control. Fast response keeps the interceptor between the invasion and the city."],
  ["02", "Keep the sky clear", "Weapons answer the pressure while formations change shape, split, dive, and test every opening in the defensive line."],
  ["03", "Protect what matters", "The city shield absorbs what you miss. Repair it, reinforce it, and stop the next strike before city health is exposed."],
  ["04", "Turn power into momentum", "Collect energy cores, widen the attack spread, add missiles, and carry stronger systems into the next wave."],
  ["05", "Outlast the campaign", "Every wave increases the pace. Enemy combinations become less predictable and defensive decisions matter more."],
  ["06", "Break the bosses", "Survive the formations, expose the mothership, and defeat the force directing the assault before it reaches Earth."],
];

const cities = [
  ["chicago-gameplay", "Chicago", "Hold the line over Lake Michigan as alien forces descend on the Chicago skyline.", "The Blueguard interceptor flies toward a purple alien fleet above Chicago while a cyan shield protects the city."],
  ["city-san-francisco", "San Francisco", "Protect the bay and the Golden Gate as the invasion arrives at sunset.", "The Blueguard interceptor defends San Francisco and the Golden Gate Bridge beneath a glowing city shield at sunset."],
  ["city-new-york", "New York City", "Defend Manhattan through lightning, rain, and a full-scale aerial assault.", "The Blueguard interceptor crosses New York Harbor in a rainstorm while alien ships attack Manhattan's shield."],
  ["city-london", "London", "Keep the shield alive over the Thames as alien forces close in from the storm.", "The Blueguard interceptor protects London, Tower Bridge, and the Thames from alien ships in a storm."],
  ["city-tokyo", "Tokyo", "Battle through neon skies as portals open above the city.", "The Blueguard interceptor climbs over Tokyo as purple portals and alien ships open above the protected skyline."],
];

const enemies = ["Stingray", "Voidripper", "Hexblade", "Skitterer", "Wraith", "Bloodbite"];
const defenses = ["Energy core", "Repair module", "Shield power-up", "Weapon spread", "Missile upgrade", "Plasma turret", "Missile battery", "Shield projector"];

export const thumbCommandPage = ({ page, company, siteUrl, gameNav }) => page({
  title: "Commander Thum-B — Save Planet Earth | Four of Hearts Interactive",
  description: "Command the Blueguard interceptor, defend cities around the world, and stop a massive alien invasion in Commander Thum-B from Four of Hearts Interactive.",
  path: "/games/thumb-command/",
  current: "thumb-command",
  image: "assets/thumb-command/thumb-command-social-1200x630.jpg",
  imageAlt: "The Blueguard interceptor defending Chicago from a purple alien fleet in Commander Thum-B",
  bodyClass: "thumb-command-page",
  jsonLd: {
    "@context": "https://schema.org",
    "@type": "VideoGame",
    name: "Commander Thum-B",
    description: "A fast, colorful space-defense arcade game about protecting the cities of Earth from an alien invasion.",
    applicationCategory: "Game",
    playMode: "SinglePlayer",
    publisher: { "@type": "Organization", name: company },
    url: `${siteUrl}/games/thumb-command/`,
    image: `${siteUrl}/assets/thumb-command/thumb-command-social-1200x630.jpg`,
  },
  content: `
    ${gameNav("thumb-command", "overview")}
    <section class="tc-hero" id="overview" aria-labelledby="thumb-command-title">
      ${art("thumb-command-chicago-gameplay", "The Blueguard interceptor races to defend Chicago beneath a glowing shield as the alien mothership advances.", { eager: true, className: "tc-hero-art" })}
      <div class="tc-hero-scrim" aria-hidden="true"></div>
      <div class="tc-stars" aria-hidden="true"></div>
      <div class="shell tc-hero-layout">
        <div class="tc-hero-copy">
          <p class="tc-eyebrow">A Four of Hearts Interactive Game</p>
          <h1 id="thumb-command-title"><span>Thumb</span> Command</h1>
          <p class="tc-tagline">Save Planet Earth</p>
          <p class="tc-lede">Alien forces are descending on the cities of Earth. Take control of the Blueguard interceptor, hold the defensive line, and stop the invasion before it reaches the people below.</p>
          <div class="tc-actions"><a class="tc-button" href="#mission">See the Mission</a><a class="tc-button ghost" href="#cities">Explore the Cities</a></div>
          <p class="tc-status">In development · mission briefing available now</p>
        </div>
        <img class="tc-app-icon" src="assets/thumb-command/thumb-command-app-icon-768.webp" alt="Commander Thum-B app artwork showing the Blueguard interceptor rising toward a purple alien fleet" width="768" height="768">
      </div>
    </section>

    <section class="tc-section tc-mission" id="mission" aria-labelledby="mission-title">
      <div class="shell tc-split">
        <div class="tc-copy"><p class="tc-kicker">Mission doctrine</p><h2 id="mission-title">The city is the base.</h2><p class="tc-lead">There is no distant fortress and no expendable outpost. Every shot that gets past you threatens a real city.</p><p>Destroy incoming formations, protect the shield, collect upgrades, and keep the invasion from reaching Earth.</p><dl class="tc-mission-stats"><div><dt>Front line</dt><dd>The sky above every city</dd></div><div><dt>Defense</dt><dd>Shield integrity and city health</dd></div><div><dt>Objective</dt><dd>Stop every wave</dd></div></dl></div>
        <figure class="tc-frame tc-frame-chicago">${art("thumb-command-chicago-gameplay", "Chicago glows beneath a cyan defensive dome while the Blueguard meets an alien fleet above Lake Michigan.")}<figcaption>Chicago is the first line of defense—and the first city in the worldwide campaign.</figcaption></figure>
      </div>
    </section>

    <section class="tc-section tc-gameplay" id="gameplay" aria-labelledby="gameplay-title">
      <div class="shell"><header class="tc-section-head"><p class="tc-kicker">Arcade defense</p><h2 id="gameplay-title">One ship. An entire planet.</h2><p>Simple control meets escalating pressure. Read the formation, own the space, and keep the city shield alive.</p></header>
        <div class="tc-feature-grid">${gameplay.map(([number, title, copy]) => `<article><b>${number}</b><h3>${title}</h3><p>${copy}</p></article>`).join("")}</div>
      </div>
    </section>

    <section class="tc-section tc-blueguard" id="blueguard" aria-labelledby="blueguard-title">
      <div class="shell"><header class="tc-section-head"><p class="tc-kicker">Earth defense craft</p><h2 id="blueguard-title">Command the Blueguard.</h2><p>Build speed, firepower, shields, and attack spread as the Blueguard evolves from a fast interceptor into Earth's most powerful defensive weapon.</p></header>
        <figure class="tc-wide-art">${art("thumb-command-blueguard-upgrades", "Four blue-white-gold Blueguard interceptor stages and eight Earth defense modules displayed in an orbital hangar.")}<figcaption>The Blueguard progression: base interceptor, Vanguard, Sentinel, and Paladin.</figcaption></figure>
        <ol class="tc-upgrade-line"><li><span>Base</span><strong>Interceptor</strong></li><li><span>Level 2</span><strong>Vanguard</strong></li><li><span>Level 3</span><strong>Sentinel</strong></li><li><span>Level 4</span><strong>Paladin</strong></li></ol>
      </div>
    </section>

    <section class="tc-section tc-aliens" id="aliens" aria-labelledby="aliens-title">
      <div class="shell tc-split reverse">
        <figure class="tc-frame">${art("thumb-command-alien-fleet", "Six distinct purple and magenta alien ship classes surround a vast mothership above Earth.")}<figcaption>The mothership directs a fleet built to break Earth's defensive line.</figcaption></figure>
        <div class="tc-copy"><p class="tc-kicker">Alien threat index</p><h2 id="aliens-title">They came for Earth.</h2><p class="tc-lead">Every silhouette signals a different danger. Scouts probe the shield. Bladed fighters cut across your path. The mothership turns the whole sky into a boss arena.</p><ul class="tc-enemy-list">${enemies.map((enemy) => `<li>${enemy}</li>`).join("")}</ul><p>No long speeches. No graphic violence. Just a vivid invading force, readable attack patterns, and the next target already moving.</p></div>
      </div>
    </section>

    <section class="tc-section tc-cities" id="cities" aria-labelledby="cities-title">
      <div class="shell"><header class="tc-section-head"><p class="tc-kicker">Worldwide campaign</p><h2 id="cities-title">Defend the world.</h2><p>Every city changes the atmosphere of the fight while keeping the stakes unmistakable: protect the people below.</p></header>
        <div class="tc-city-grid">${cities.map(([slug, city, copy, alt], index) => `<article class="tc-city-card${index === 0 ? " flagship" : ""}">${art(`thumb-command-${slug}`, alt)}<div><span>${index === 0 ? "Flagship mission" : `Mission 0${index + 1}`}</span><h3>${city}</h3><p>${copy}</p></div></article>`).join("")}</div>
      </div>
    </section>

    <section class="tc-section tc-defense" id="defense" aria-labelledby="defense-title">
      <div class="shell"><header class="tc-section-head"><p class="tc-kicker">Power-ups and structures</p><h2 id="defense-title">Build Earth's last line of defense.</h2><p>Collect the systems that turn a desperate interception into a controlled counterattack.</p></header>
        <div class="tc-defense-layout"><figure>${art("thumb-command-blueguard-upgrades", "Blueguard interceptors displayed with shield, repair, weapon, missile, turret, and projector systems.")}</figure><ul>${defenses.map((item, index) => `<li><span>${String(index + 1).padStart(2, "0")}</span>${item}</li>`).join("")}</ul></div>
      </div>
    </section>

    <section class="tc-section tc-gallery" id="gallery" aria-labelledby="gallery-title">
      <div class="shell"><header class="tc-section-head"><p class="tc-kicker">Mission gallery</p><h2 id="gallery-title">Earth under a brighter sky.</h2><p>Open any frame for the full-resolution mission artwork. The gallery never advances without you.</p></header>
        <div class="tc-gallery-grid">${cities.map(([slug, city, , alt]) => `<a href="assets/thumb-command/thumb-command-${slug}-1600.jpg" aria-label="Open ${city} mission artwork">${art(`thumb-command-${slug}`, alt)}<span>${city}</span></a>`).join("")}<a href="assets/thumb-command/thumb-command-alien-fleet-1600.jpg" aria-label="Open alien fleet artwork">${art("thumb-command-alien-fleet", "The purple and magenta alien fleet and its central mothership above Earth.")}<span>Alien Fleet</span></a></div>
      </div>
    </section>

    <section class="tc-news-callout" aria-labelledby="tc-news-title"><div class="shell"><div><p class="tc-kicker">Mission control</p><h2 id="tc-news-title">Follow the campaign.</h2><p>Meet the Blueguard, visit the battlefields, and see how the alien invasion took shape.</p></div><div><a href="news-thumb-command-save-planet-earth.html">Introducing Commander Thum-B</a><a href="news-the-city-is-the-base.html">Building the battlefields</a><a href="news-meet-the-blueguard.html">Meet the Blueguard</a><a href="news-designing-the-alien-invasion.html">Designing the invasion</a><a href="news-thumb-command-world-tour.html">Tour the cities</a></div></div></section>

    <section class="tc-final" aria-labelledby="tc-final-title"><div class="shell"><p class="tc-kicker">Incoming transmission</p><h2 id="tc-final-title">Earth is under attack.</h2><p>Take command of the Blueguard. Protect the cities. Stop the invasion.</p><a class="tc-button" href="news.html?tag=thumb-command">Prepare for Launch</a><small>Commander Thum-B is in development. Follow verified mission updates—no fake download button.</small></div></section>`
});
