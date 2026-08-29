(() => {
  "use strict";
  const marker = document.querySelector("[data-route-target]");
  if (!marker) return;
  const next = new URL(marker.dataset.routeTarget, location.href);
  next.search = location.search;
  next.hash = location.hash;
  location.replace(next.href);
})();
