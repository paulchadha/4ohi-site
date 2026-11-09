const escapeHtml = value => String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#39;");

export function validateArticleProse(article) {
  if (article.intro !== undefined && (!Array.isArray(article.intro) || article.intro.some(p => typeof p !== "string" || !p.trim()))) throw Error("Article intro must contain plain-text paragraphs");
  if (article.inlineLinks === undefined) return;
  if (!Array.isArray(article.inlineLinks)) throw Error("Article inline links must be an array");
  const labels = new Set();
  for (const link of article.inlineLinks) {
    if (!link || typeof link.text !== "string" || !link.text.trim() || labels.has(link.text) || typeof link.href !== "string") throw Error("Article inline link needs a unique label and URL");
    const url = new URL(link.href);
    if (url.origin !== "https://4ohi.com" || url.username || url.password || /[\u0000-\u0020]/.test(link.href)) throw Error("Article inline links must use the public 4ohi.com HTTPS origin");
    labels.add(link.text);
  }
}

export function articleParagraph(text, links = []) {
  let html = "", cursor = 0;
  while (cursor < text.length) {
    const next = links.map(link => ({...link, index:text.indexOf(link.text, cursor)})).filter(link => link.index >= 0).sort((a,b) => a.index-b.index || b.text.length-a.text.length)[0];
    if (!next) break;
    html += escapeHtml(text.slice(cursor, next.index));
    html += `<a href="${escapeHtml(next.href)}">${escapeHtml(next.text)}</a>`;
    cursor = next.index + next.text.length;
  }
  return html + escapeHtml(text.slice(cursor));
}

export function articleBody(article) {
  validateArticleProse(article);
  const paragraph = text => `<p>${articleParagraph(text, article.inlineLinks)}</p>`;
  return (article.intro || []).map(paragraph).join("") + article.body.map(section => `<h2>${escapeHtml(section.heading)}</h2>${section.paragraphs.map(paragraph).join("")}`).join("");
}
