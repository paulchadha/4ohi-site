import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { productCatalog } from "./studio-product-manifest.mjs";

export const articleTypes = Object.freeze({
  "studio-story": "Studio story", "developer-diary": "Developer diary",
  retrospective: "Retrospective", "release-notes": "Release notes",
  "design-diary": "Design diary", "workbench-brief": "Workbench brief"
});
export const articleFile = (slug) => `news-${slug}.html`;
export const escapeHtml = (value) => String(value).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
export const formatDate = (date) => new Intl.DateTimeFormat("en-US", { month:"long", day:"numeric", year:"numeric", timeZone:"UTC" }).format(new Date(`${date}T00:00:00Z`));
const byId = new Map(productCatalog.map(p => [p.id, p]));
const aliases = new Map(productCatalog.flatMap(p => [p.id, p.key, p.slug, p.title, ...(p.aliases || []), ...(p.legacyNames || [])].map(name => [name.toLowerCase(), p.id])));
export const productAliases = Object.freeze(Object.fromEntries(aliases));
export const resolveProductId = (value) => aliases.get(String(value).toLowerCase());
const validDate = (value) => /^\d{4}-\d{2}-\d{2}$/.test(value || "") && !Number.isNaN(Date.parse(value)) && new Date(value).toISOString().slice(0,10) === value;

export function loadArticles(root) {
  const records = JSON.parse(readFileSync(resolve(root, "content/news.json"), "utf8"));
  const ids = new Set(), slugs = new Set(), seriesOrders = new Set();
  const today = new Intl.DateTimeFormat("en-CA", {timeZone:"America/Chicago", year:"numeric", month:"2-digit", day:"2-digit"}).format(new Date());
  for (const a of records) {
    const fail = message => { throw new Error(`Article ${a.slug || "(no slug)"}: ${message}`); };
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(a.id || "") || ids.has(a.id)) fail("stable, unique ID required");
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(a.slug || "") || slugs.has(a.slug)) fail("stable, unique slug required");
    ids.add(a.id); slugs.add(a.slug);
    if (["archive","origins"].includes(a.slug) || a.slug.startsWith("product-")) fail("slug reserved for journal navigation");
    if (!["draft","published"].includes(a.status)) fail("explicit draft or published status required");
    if (a.language !== "en") fail("only English article bodies are currently supported; do not label an untranslated post as a translation");
    if (!articleTypes[a.articleType]) fail("unknown article type");
    if (![a.title,a.description,a.author].every(x => typeof x === "string" && x.trim())) fail("title, excerpt (description), and author required");
    if (!Array.isArray(a.body) || !a.body.length || a.body.some(s => !s.heading || !Array.isArray(s.paragraphs) || !s.paragraphs.length || s.paragraphs.some(p => typeof p !== "string" || !p.trim()))) fail("body sections required");
    if (!Array.isArray(a.productIds) || new Set(a.productIds).size !== a.productIds.length || a.productIds.some(id => !byId.has(id))) fail("productIds must use unique canonical stable IDs");
    if (a.status === "published" && (!validDate(a.date) || a.date > today)) fail("real, non-future publication date required");
    if (a.revisedDate && (!validDate(a.revisedDate) || a.revisedDate < a.date || a.revisedDate > today)) fail("invalid genuine revision date");
    if (a.seriesId && (!/^[a-z0-9-]+$/.test(a.seriesId) || !Number.isInteger(a.seriesOrder) || a.seriesOrder < 1)) fail("series ID and positive order required together");
    if (a.seriesOrder && !a.seriesId) fail("series order requires a series ID");
    if (a.status === "published" && a.seriesId) {
      const position = `${a.seriesId}:${a.seriesOrder}`;
      if (seriesOrders.has(position)) fail("duplicate published position in reading series");
      seriesOrders.add(position);
    }
    if (a.image && (!/^assets\/[a-zA-Z0-9/_\-.]+$/.test(a.image) || !existsSync(resolve(root,a.image)) || !a.imageAlt)) fail("approved local image and alt text required");
  }
  const published = records.filter(a => a.status === "published").sort((a,b) => b.date.localeCompare(a.date));
  if (published.filter(a => a.featured).length > 1) throw new Error("Feature at most one published story");
  return published;
}

export const notesFor = (articles, product) => articles.filter(a => a.productIds.includes(product.id));
export const productArchive = product => `news-product-${product.id}.html`;
const meta = a => `<div class="workbench-meta"><span>${articleTypes[a.articleType]}</span><time datetime="${a.date}">${formatDate(a.date)}</time></div>`;
export const notePreview = (a, heading = "h3") => `<article class="workbench-note" lang="en" data-original-language translate="no">${meta(a)}<${heading}><a href="${articleFile(a.slug)}">${escapeHtml(a.title)}</a></${heading}><p>${escapeHtml(a.description)}</p><a class="text-link" href="${articleFile(a.slug)}">Read the development diary <span aria-hidden="true">→</span></a></article>`;

export const workbenchGoals = Object.freeze({
  "sling-nouveau": [
    "Design direction",
    "The immediate priority is the slingshot. It should be easy to grab, satisfying to pull, and simple to position. Your thumb should be planning the shot, not negotiating access to the controls."
  ],
  "palace": [
    "Design direction",
    "Same starting cards. Same challenge. Different decisions—and, ideally, an increasingly suspicious look at the move you made three turns ago."
  ],
  "euchre": [
    "Design direction",
    "Our current design direction is a clearer table, easier-to-read information, and indicators that explain the game without parking themselves on top of it."
  ],
  "hearts": [
    "Design direction",
    "The design brief is to keep that drama at the table: readable hands, understandable turns, and enough visual clarity to follow what is happening without wrestling the screen."
  ],
  "spades": [
    "Design direction",
    "The bid, the score, the current trick, and your next action should be easy to understand. Everything else needs a good reason to occupy the screen."
  ],
  "solitaire": [
    "Design direction",
    "The current direction is cleaner presentation, more comfortable card sizes, and smoother movement. The board should feel calm without looking asleep."
  ],
  "war": [
    "Design direction",
    "The development priority is getting that basic rhythm right: stable play, readable cards, and battles that feel lively rather than sluggish."
  ],
  "gildenspire": [
    "Design direction",
    "The current direction puts the emphasis on easier flight, clearer combat controls, a world worth moving through, and fire that deserves the name."
  ],
  "thumb-command": [
    "Design direction",
    "The interface needs to respect that. We’re aiming for a brighter, cleaner presentation, stronger ship selection, more distinctive enemies and bases, and less clutter between the player and the action."
  ],
  "bobby": [
    "Design direction",
    "The current direction includes a more expressive home screen, stronger battlefield artwork, easier zooming, and more interesting approaches for incoming enemies."
  ],
  "evil-doom-boy": [
    "Design direction",
    "That is the creative direction we want more of: towers with distinct behavior and personality, not a row of interchangeable objects politely firing at things."
  ],
  "booyang-city": [
    "Design direction",
    "The direction is a connected, full-screen place with destinations that feel like part of a neighborhood: the bakery, boutique, school, zoo, and the next interesting door."
  ],
  "funky-town": [
    "Design direction",
    "The current design push is toward a less cramped play space, more expressive buildings, and a town that feels like somewhere you are making—not a control panel you are filling out."
  ],
  "heartstack": [
    "Design direction",
    "The development direction is brighter, smoother, and easier to understand: stronger home and campaign screens, satisfying effects, and tools that explain what they do before you have to guess."
  ],
  "princess-land": [
    "Design direction",
    "The current priorities include better-aligned outfits, a stronger wardrobe, more expressive princess presentation, and a home screen where the surrounding world actually surrounds her."
  ],
  "unicorn-land": [
    "Design direction",
    "It is a separate game from Unicorn Blast, with a different pace and a different kind of play."
  ],
  "sleep-amigo": [
    "Design direction",
    "We’re shaping a sleep companion that can react to the information actually available, offer a useful observation, and sound like someone you would willingly hear from in the morning."
  ],
  "sovinto": [
    "Design direction",
    "The current foundation includes local preparation and general prewritten help. Richer practice and live AI guidance remain development work unless a newer build verifies otherwise."
  ],
  "whomly": [
    "Design direction",
    "Who is relevant? What supports that conclusion? What would make a thoughtful next conversation?"
  ],
  "gin-rummy": [
    "Design direction",
    "A clear two-player table, readable sets and runs, and reliable match recovery. Online play is still in development."
  ]
});

export function productJournal(product, articles) {
  const latest = notesFor(articles,product)[0];
  const [label, goal] = workbenchGoals[product.id];
  return `<section class="product-journal" id="from-the-developers" data-product-journal="${product.id}" lang="en" dir="ltr" translate="no"><div class="production-shell"><header><p class="production-eyebrow">THE WORKSHOP · ${escapeHtml(product.title)}</p><h2>From the developers</h2><p>What we’re building, what we’re improving, and what made us laugh.</p></header><div class="product-journal-grid"><div class="workbench-goal"><h3>On the workbench</h3><p class="workbench-meta">${label}</p><p>${escapeHtml(goal)}</p><p class="workbench-availability"><strong>Availability:</strong> ${escapeHtml(product.availability)}.</p></div>${latest ? notePreview(latest) : ""}</div>${latest ? `<a class="workbench-archive-link" href="${productArchive(product)}">Older updates for ${escapeHtml(product.title)} <span aria-hidden="true">→</span></a>` : ""}</div></section>`;
}

export const slingTreatment = (compact = false) => `<span class="sling-type-art${compact ? " compact" : ""}" aria-hidden="true"><span>SLING</span><span>NOUVEAU<span class="sling-dot">.</span></span><small>Modern art. Meet gravity.</small></span>`;
export const slingFeature = () => `<section class="sling-workbench-feature" aria-labelledby="sling-feature-title" lang="en"><div class="production-shell sling-feature-grid"><div><p class="production-eyebrow">NEW ON THE WORKBENCH · IN DEVELOPMENT</p><h2 id="sling-feature-title">Sling Nouveau</h2><p>Modern art. Meet gravity.</p><p>A colorful physics playground where a better angle makes all the difference.</p><a class="button" href="sling-nouveau.html">Meet Sling Nouveau</a></div>${slingTreatment()}</div></section>`;
export function slingPage(product) {
  return `<article class="sling-product"><header class="sling-product-hero"><div class="production-shell sling-feature-grid"><div><p class="production-eyebrow">PHYSICS PLAYGROUND · IN DEVELOPMENT</p><h1>Sling Nouveau</h1><p class="sling-tagline">Modern art. Meet gravity.</p><p>${escapeHtml(product.description)}</p><div class="actions"><a class="button" href="#from-the-developers">Follow development</a><a class="button secondary" href="games.html">Explore all games</a></div><p>No public build or release date has been announced.</p></div>${slingTreatment()}</div></header><section class="sling-product-direction"><div class="production-shell"><p class="production-eyebrow">THE DESIGN DIRECTION</p><h2>A shot worth lining up.</h2><p>Expressive art, responsive slingshot controls, and the pleasure of finding a better angle. The priorities below describe what we’re building.</p><a class="text-link" href="funky-town.html">Also exploring art and play: Funky Town →</a></div></section></article>`;
}

export function newsListing(articles, {oldest = false, origins = false, product = null} = {}) {
  let items = product ? notesFor(articles,product) : origins ? articles.filter(a => a.seriesId === "product-origins") : articles;
  if (origins) items = [...items].sort((a,b) => a.seriesOrder-b.seriesOrder);
  else if (oldest) items = [...items].reverse();
  const featured = !product && !oldest && !origins ? articles.find(a => a.featured) || articles[0] : null;
  const title = product ? `${product.title}: From the developers` : origins ? "Start at the beginning" : oldest ? "The workbench archive" : "Notes from the Workbench";
  const filters = !product && !origins ? `<div class="workbench-controls" data-workbench-controls hidden><label>Article type<select data-workbench-type><option value="all">All article types</option>${Object.entries(articleTypes).map(([id,label]) => `<option value="${id}">${label}</option>`).join("")}</select></label><label>Product<select data-workbench-product><option value="all">All products</option>${productCatalog.map(p => `<option value="${p.id}">${escapeHtml(p.title)}</option>`).join("")}</select></label><label>Reading order<select data-workbench-order><option value="newest"${!oldest ? " selected" : ""}>Newest first</option><option value="oldest"${oldest ? " selected" : ""}>Oldest first</option></select></label><label>Collection<select data-workbench-tag><option value="all">All collections</option><option value="games">Games</option><option value="card-table">Card Table</option><option value="lifestyle-apps">Lifestyle Apps</option><option value="company">Company</option><option value="development">Development</option></select></label></div>` : "";
  return `<section class="workbench-listing" data-workbench-listing data-default-order="${oldest || origins ? "oldest" : "newest"}" lang="en" dir="ltr" translate="no"><div class="production-shell"><header class="workbench-intro"><p class="production-eyebrow">THE 4OH WORKSHOP</p><h1>${escapeHtml(title)}</h1><p class="lede">${product ? "What we’re building, what we’re improving, and what made us laugh." : "Games, glitches, and the occasional international spelling incident."}</p><p class="workbench-language" data-workbench-language hidden>These notes are available in English. Your selected language still applies to the site controls.</p><nav class="workbench-reading" aria-label="Journal reading routes"><a href="news.html">Newest first</a><a href="news-archive.html">Oldest first</a><a href="news-origins.html">Start at the beginning →</a><a href="feed.xml">RSS feed</a></nav></header>${featured ? `<section class="workbench-featured" data-workbench-featured aria-labelledby="featured-note-heading"><div><p class="production-eyebrow">FEATURED STORY</p>${meta(featured)}<h2 id="featured-note-heading"><a href="${articleFile(featured.slug)}">${escapeHtml(featured.title)}</a></h2><p>${escapeHtml(featured.description)}</p><a class="text-link" href="${articleFile(featured.slug)}">Read the story →</a></div>${featured.image ? `<img src="${featured.image}" alt="${escapeHtml(featured.imageAlt)}" width="960" height="720">` : ""}</section>` : ""}<section aria-labelledby="recent-notes-heading"><h2 id="recent-notes-heading">${origins ? "The origin stories, in order" : oldest ? "From the earliest notes" : product ? "Published development notes" : "Recent updates"}</h2>${filters}<p data-workbench-count role="status" aria-live="polite" hidden></p><div class="workbench-stories" data-workbench-stories>${items.map(a => `<article class="workbench-story" data-workbench-story data-date="${a.date}" data-article-type="${a.articleType}" data-product-ids="${a.productIds.join(" ")}" data-tags="${(a.tags || []).join(" ")}" lang="en" data-original-language translate="no">${a.seriesRole ? `<p class="workbench-meta">${escapeHtml(a.seriesRole)}</p>` : ""}${a.image ? `<a class="workbench-story-art" href="${articleFile(a.slug)}" tabindex="-1" aria-hidden="true"><img src="${a.image}" alt="" width="480" height="320" loading="lazy"></a>` : ""}<div>${meta(a)}<h3><a href="${articleFile(a.slug)}">${escapeHtml(a.title)}</a></h3><p>${escapeHtml(a.description)}</p><small>${escapeHtml(a.author)}${a.productIds.length ? " · " + a.productIds.map(id => escapeHtml(byId.get(id).title)).join(" · ") : ""}</small></div></article>`).join("")}</div>${!items.length && product ? `<div class="workbench-goal"><h3>On the workbench</h3><p>${escapeHtml(workbenchGoals[product.id][1])}</p><a href="${product.infoUrl}">Meet ${escapeHtml(product.title)} →</a></div>` : ""}<p data-workbench-empty hidden>No published notes match these filters. Try another product or article type.</p><button class="button workbench-more" data-workbench-more type="button" hidden>Load more updates</button></section></div></section>`;
}
