export const gameCatalog = Object.freeze([
  Object.freeze({
    key: "palace",
    title: "Palace",
    slug: "palace",
    description: "Match or beat the pile, master four power cards, and survive the final hidden card.",
    artwork: "assets/icon-palace-4hearts.webp",
    alt: "Palace castle artwork from Four of Hearts Interactive",
    status: "Interactive Preview",
    availability: "Website tutorial available",
    genre: "Card game",
    infoUrl: "palace.html",
    playUrl: "palace-play.html",
    playLabel: "Play Palace",
    featured: true,
    sortOrder: 10
  }),
  Object.freeze({
    key: "commander",
    title: "Commander ThumB",
    slug: "commander-thumb",
    description: "Defend Thum B from the invading fleets of Thum A in a colorful one-thumb arcade adventure spanning 1,000 levels.",
    artwork: "assets/commander-thumb-70s-hero-960.webp",
    alt: "Commander-Class ship defending Thum B in an original 1970s-inspired space illustration",
    status: "Coming Soon",
    availability: "In development",
    genre: "Arcade defense",
    infoUrl: "commander-thumb.html",
    playUrl: null,
    playLabel: null,
    featured: true,
    sortOrder: 20
  }),
  Object.freeze({
    key: "hearts",
    title: "Hearts",
    slug: "hearts",
    description: "Dodge the points—or take every one—in a focused teaching preview.",
    artwork: "assets/icon-hearts-4hearts.webp",
    alt: "Hearts ruby artwork from Four of Hearts Interactive",
    status: "Internal Alpha",
    availability: "Website lesson available",
    genre: "Card game",
    infoUrl: "hearts-play.html",
    playUrl: null,
    playLabel: null,
    featured: false,
    sortOrder: 30
  }),
  Object.freeze({
    key: "spades",
    title: "Spades",
    slug: "spades",
    description: "Bid together, read the table, and let trump speak.",
    artwork: "assets/icon-spades-4hearts.webp",
    alt: "Spades royal-purple artwork from Four of Hearts Interactive",
    status: "Internal Alpha",
    availability: "Website lesson available",
    genre: "Card game",
    infoUrl: "spades-play.html",
    playUrl: null,
    playLabel: null,
    featured: false,
    sortOrder: 40
  }),
  Object.freeze({
    key: "euchre",
    title: "Euchre",
    slug: "euchre",
    description: "Call it, find the bowers, and move fast through a short teaching preview.",
    artwork: "assets/icon-euchre-4hearts.webp",
    alt: "Euchre emerald artwork from Four of Hearts Interactive",
    status: "Internal Alpha",
    availability: "Website lesson available",
    genre: "Card game",
    infoUrl: "euchre-play.html",
    playUrl: null,
    playLabel: null,
    featured: false,
    sortOrder: 50
  })
]);

export const primaryGames = gameCatalog.filter(({ key }) => ["palace", "commander"].includes(key));
export const featuredGames = gameCatalog.filter(({ featured }) => featured);
export const gameByKey = Object.freeze(Object.fromEntries(gameCatalog.map((game) => [game.key, game])));

