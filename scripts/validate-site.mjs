import { existsSync, readFileSync, readdirSync } from "node:fs";
import { basename, dirname, join, resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const pages = readdirSync(root).filter((name) => name.endsWith(".html")).sort();
const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };

for (const page of pages) {
  const file = join(root, page);
  check(existsSync(file), `${page}: file is missing`);
  if (!existsSync(file)) continue;
  const html = readFileSync(file, "utf8");
  const legacyRedirect = /data-route-target=/i.test(html);
  check((html.match(/<h1\b/gi) || []).length === 1, `${page}: expected exactly one h1`);
  const headingLevels = [...html.matchAll(/<h([1-6])\b/gi)].map((match) => Number(match[1]));
  for (let i = 1; i < headingLevels.length; i += 1) {
    check(headingLevels[i] <= headingLevels[i - 1] + 1, `${page}: heading level jumps from h${headingLevels[i - 1]} to h${headingLevels[i]}`);
  }
  check(/<main\b/i.test(html), `${page}: main landmark is missing`);
  check(/<title>[^<]+<\/title>/i.test(html), `${page}: title is missing`);
  check(/<meta\s+name="description"/i.test(html), `${page}: description is missing`);
  check(/<meta\s+name="theme-color"/i.test(html), `${page}: theme color is missing`);
  check(/http-equiv="Content-Security-Policy"/i.test(html), `${page}: Content Security Policy is missing`);
  check(!/\son[a-z]+\s*=/i.test(html), `${page}: inline event handler found`);
  check(!/[A-Z]:\\Users\\/i.test(html), `${page}: internal filesystem path found`);
  check(!/\$\{game/i.test(html), `${page}: leaked product authoring token found`);
  check(!/Shithead/i.test(html.split("</head>")[0]), `${page}: private traditional name leaked into metadata`);
  check(/<link\s+rel="icon"/i.test(html), `${page}: favicon is missing`);
  check(!/[�]|â€”|â€™|Â©/.test(html), `${page}: text contains encoding artifacts`);
  if (legacyRedirect) check(/name="robots"\s+content="noindex/i.test(html), `${page}: noindex is missing from compatibility route`);
  else check(!/Commander\s+(?:Thumb|ThumB|Thumb-B)|Commander\s+Thum-B/i.test(html), `${page}: obsolete arcade branding remains visible`);
  const unsafeForms = [...html.matchAll(/<form\b([^>]*)>/gi)].filter(([, attrs]) => !/\bmethod="dialog"/i.test(attrs));
  check(unsafeForms.length === 0, `${page}: unexpected non-dialog form found`);
  check(!/(google-analytics|googletagmanager|facebook\.net|doubleclick|segment\.com)/i.test(html), `${page}: tracking code found`);
  check(!/\bhttp:\/\//i.test(html), `${page}: mixed-content URL found`);
  if (page !== "404.html") {
    check(/<link\s+rel="canonical"\s+href="https:\/\/4ohi\.com\//i.test(html), `${page}: canonical URL is missing or incorrect`);
    check(/property="og:title"/i.test(html) && /property="og:description"/i.test(html) && /property="og:url"/i.test(html), `${page}: Open Graph metadata is incomplete`);
    check(/<header\b/i.test(html) && /<nav\b/i.test(html) && /<footer\b/i.test(html), `${page}: header, nav, or footer landmark is missing`);
  } else {
    check(/name="robots"\s+content="noindex"/i.test(html), `${page}: noindex is missing`);
  }

  for (const match of html.matchAll(/<a\b[^>]*href="([^"]+)"/gi)) {
    const href = match[1];
    if (href.startsWith("mailto:")) {
      check(href.toLowerCase().startsWith("mailto:support@4ohi.com"), `${page}: unexpected email link ${href}`);
    } else if (!href.startsWith("#") && !href.startsWith("https://")) {
      const clean = href.split(/[?#]/)[0] || page;
      check(existsSync(join(root, clean)), `${page}: broken internal link ${href}`);
    }
  }

  for (const match of html.matchAll(/<script\b[^>]*src="([^"]+)"/gi)) { check(existsSync(join(root, match[1].split(/[?#]/)[0])), `${page}: missing script ${match[1]}`); }

  for (const match of html.matchAll(/<img\b([^>]*)>/gi)) {
    const attrs = match[1];
    const src = attrs.match(/src="([^"]+)"/i)?.[1];
    check(/\balt\s*=\s*(?:"[^"]*"|'[^']*')/i.test(attrs), `${page}: image is missing alt text`);
    if (src && !src.startsWith("https://")) check(existsSync(join(root, src.split(/[?#]/)[0])), `${page}: missing image ${src}`);
  }
}

const css = readFileSync(join(root, "assets", "palace-site.css"), "utf8");
check(/:focus-visible/.test(css), "CSS: visible focus styles are missing");
check(/prefers-reduced-motion/.test(css), "CSS: reduced-motion handling is missing");
check(/min-height:\s*44px/.test(css), "CSS: 44px touch-target rule is missing");
check(readFileSync(join(root, "CNAME"), "utf8").trim() === "4ohi.com", "CNAME: expected 4ohi.com");
const robots = readFileSync(join(root, "robots.txt"), "utf8");
check(robots.includes("https://4ohi.com/sitemap.xml"), "robots.txt: sitemap URL is missing");
const sitemap = readFileSync(join(root, "sitemap.xml"), "utf8");
const sitemapExcluded = new Set(["404.html", "palace.html", "thumb-command.html", "commander-thumb.html", "news-building-commander-thumb.html", "news-commander-thumb-is-coming.html", "news-welcome-to-the-thum-system.html", "news-shadow-run-enters-development.html"]);
for (const page of pages.filter((page) => !sitemapExcluded.has(page) && !/data-route-target=|name="robots"\s+content="noindex/i.test(readFileSync(join(root, page), "utf8")))) {
  const url = page === "index.html" ? "https://4ohi.com/" : `https://4ohi.com/${page}`;
  check(sitemap.includes(`<loc>${url}</loc>`), `sitemap.xml: missing ${url}`);
}
check(sitemap.includes("<loc>https://4ohi.com/games/thumb-command/</loc>"), "sitemap.xml: missing canonical Thumb Command route");

const allFiles = readdirSync(root, { recursive: true, withFileTypes: true })
  .filter((entry) => entry.isFile() && !entry.parentPath.includes(`${join(root, ".git")}`))
  .map((entry) => join(entry.parentPath, entry.name));
for (const file of allFiles) {
  if (!/\.(?:html|css|js|mjs|md|txt|xml)$/i.test(file)) continue;
  const text = readFileSync(file, "utf8");
  check(!/(-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----|gh[pousr]_[A-Za-z0-9_]{20,}|AIza[0-9A-Za-z_-]{30,})/.test(text), `${basename(file)}: possible secret found`);
  check(!/(\beval\s*\(|\bnew\s+Function\s*\()/i.test(text), `${basename(file)}: dynamic code execution found`);
}

if (failures.length) {
  console.error(`Site validation failed with ${failures.length} issue(s):`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}
console.log(`Site validation passed: ${pages.length} pages, internal links, email links, metadata, images, accessibility hooks, sitemap, CNAME, tracking, mixed content, and secret scan.`);
