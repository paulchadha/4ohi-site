(() => {
  "use strict";
  const list = document.querySelector("[data-workbench-listing]");
  const language = new URL(location.href).searchParams.get("lang") || "en";
  document.querySelectorAll("[data-workbench-language]").forEach(node => { node.hidden = language === "en" || language === "en-CA"; });
  if (!list) return;
  const controls = list.querySelector("[data-workbench-controls]");
  const stories = [...list.querySelectorAll("[data-workbench-story]")];
  const container = list.querySelector("[data-workbench-stories]");
  const more = list.querySelector("[data-workbench-more]");
  const count = list.querySelector("[data-workbench-count]");
  const empty = list.querySelector("[data-workbench-empty]");
  const featured = list.querySelector("[data-workbench-featured]");
  const type = list.querySelector("[data-workbench-type]");
  const product = list.querySelector("[data-workbench-product]");
  const order = list.querySelector("[data-workbench-order]");
  const tag = list.querySelector("[data-workbench-tag]");
  const reset = list.querySelector("[data-workbench-reset]");
  const defaultSections = [...list.querySelectorAll("[data-journal-default]")];
  const filterPanel = list.querySelector("[data-journal-filter-panel]");
  const topics = [...list.querySelectorAll("[data-journal-topic]")];
  const pageSize = 8;
  let limit = pageSize;
  const aliases = window.FOUR_HEARTS_WORKBENCH_PRODUCT_ALIASES || {};
  const has = (node,key,value) => (node.dataset[key] || "").split(/\s+/).includes(value);
  const choose = (select,value,fallback) => { if (select) select.value = [...select.options].some(o => o.value === value) ? value : fallback; };
  function readUrl() {
    const params = new URL(location.href).searchParams;
    const requested = (params.get("product") || params.get("tag") || "").toLowerCase();
    choose(product,aliases[requested] || requested,"all");
    choose(type,params.get("type"),"all");
    choose(tag,params.get("tag"),"all");
    choose(order,params.get("order"),list.dataset.defaultOrder);
    const pageNumber = Number(params.get("page"));
    limit = Number.isInteger(pageNumber) && pageNumber > 0 ? Math.min(pageNumber*pageSize, Math.max(pageSize,stories.length)) : pageSize;
  }
  function render(writeUrl = false) {
    const productId = product?.value || "all", articleType = type?.value || "all", collection = tag?.value || "all";
    const readingOrder = order?.value || list.dataset.defaultOrder;
    const matched = stories.filter(n => (productId === "all" || has(n,"productIds",productId)) && (articleType === "all" || n.dataset.articleType === articleType) && (collection === "all" || has(n,"tags",collection)));
    // The static DOM supplies all published text; enhancement only reorders and hides it.
    // Static product archives and curated series already supply their intended order.
    const key = n => n.dataset.publishedAt || n.dataset.date;
    if (controls) matched.sort((a,b) => readingOrder === "oldest" ? key(a).localeCompare(key(b)) : key(b).localeCompare(key(a)));
    stories.forEach(n => { n.hidden = true; });
    matched.forEach((n,i) => { container.append(n); n.hidden = i >= limit; });
    const shown = Math.min(limit,matched.length);
    more.hidden = shown >= matched.length;
    empty.hidden = matched.length !== 0;
    count.hidden = false;
    count.textContent = `${shown} of ${matched.length} published ${matched.length === 1 ? "note" : "notes"}`;
    const filtered = productId !== "all" || articleType !== "all" || collection !== "all" || readingOrder !== "newest";
    if (featured) featured.hidden = filtered;
    defaultSections.forEach(n => { n.hidden = filtered; });
    if (reset) reset.disabled = !filtered && limit === pageSize;
    if (filterPanel && filtered) filterPanel.open = true;
    topics.forEach(n => { const active = n.dataset.journalTopic === articleType || (n.dataset.journalTopic === "all" && !filtered); if (active) n.setAttribute("aria-current", "true"); else n.removeAttribute("aria-current"); });
    if (writeUrl) {
      const url = new URL(location.href);
      [["product",productId],["type",articleType],["tag",collection],["order",readingOrder],["page",String(Math.ceil(limit/pageSize))]].forEach(([key,value]) => {
        if (value === "all" || (key === "order" && value === list.dataset.defaultOrder) || (key === "page" && value === "1")) url.searchParams.delete(key); else url.searchParams.set(key,value);
      });
      history.pushState({},"",url.pathname+url.search+url.hash);
    }
  }
  if (reset) reset.addEventListener("click", () => { choose(product,"all","all"); choose(type,"all","all"); choose(tag,"all","all"); choose(order,list.dataset.defaultOrder,list.dataset.defaultOrder); limit = pageSize; render(true); });
  readUrl();
  if (controls) { controls.hidden = false; controls.addEventListener("change", () => {limit = pageSize; render(true);}); }
  more.addEventListener("click", () => {
    const previous = limit;
    limit += pageSize;
    render(true);
    const next = [...container.querySelectorAll("[data-workbench-story]:not([hidden])")][previous]?.querySelector("h3 a");
    next?.focus({preventScroll:true});
  });
  addEventListener("popstate", () => {readUrl();render();});
  render();
})();
