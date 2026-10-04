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
    if (controls) matched.sort((a,b) => readingOrder === "oldest" ? a.dataset.date.localeCompare(b.dataset.date) : b.dataset.date.localeCompare(a.dataset.date));
    stories.forEach(n => { n.hidden = true; });
    matched.forEach((n,i) => { container.append(n); n.hidden = i >= limit; });
    const shown = Math.min(limit,matched.length);
    more.hidden = shown >= matched.length;
    empty.hidden = matched.length !== 0;
    count.hidden = false;
    count.textContent = `${shown} of ${matched.length} published ${matched.length === 1 ? "note" : "notes"}`;
    if (featured) featured.hidden = productId !== "all" || articleType !== "all" || collection !== "all" || readingOrder !== "newest";
    if (writeUrl) {
      const url = new URL(location.href);
      [["product",productId],["type",articleType],["tag",collection],["order",readingOrder],["page",String(Math.ceil(limit/pageSize))]].forEach(([key,value]) => {
        if (value === "all" || (key === "order" && value === list.dataset.defaultOrder) || (key === "page" && value === "1")) url.searchParams.delete(key); else url.searchParams.set(key,value);
      });
      history.pushState({},"",url.pathname+url.search+url.hash);
    }
  }
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
