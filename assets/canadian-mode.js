(() => {
  "use strict";
  const system = window.FOUR_HEARTS_CANADIAN_COPY;
  if (!system) return;
  const url = new URL(location.href);
  const active = url.searchParams.get("lang") === system.locale;
  document.documentElement.toggleAttribute("data-canadian", active);
  const apply = (node, key) => {
    if (!node || !system.copy[key]) return;
    node.dataset.defaultCopy ||= node.textContent.trim();
    node.textContent = active ? system.copy[key] : node.dataset.defaultCopy;
  };
  document.querySelectorAll("[data-canadian-key]").forEach((node) => apply(node, node.dataset.canadianKey));
  const page = location.pathname.split("/").pop() || "index.html";
  (system.routes[page] || []).forEach(([selector, key]) => document.querySelectorAll(selector).forEach((node) => apply(node, key)));
  if (active) {
    const metadata = system.metadata[page];
    if (metadata) {
      document.title = metadata[0];
      const description = document.querySelector('meta[name="description"]');
      if (description) description.content = metadata[1];
    }
    document.querySelectorAll("a[href]").forEach((link) => {
      const raw = link.getAttribute("href");
      if (!raw || raw.startsWith("#") || /^(?:mailto:|tel:|https?:)/i.test(raw)) return;
      const next = new URL(raw, location.href);
      next.searchParams.set("lang", system.locale);
      link.href = `${next.pathname.split("/").pop() || "index.html"}${next.search}${next.hash}`;
    });
  }
  document.dispatchEvent(new CustomEvent("fourOfHearts:canadianReady", { detail: { active } }));
})();
