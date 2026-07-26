(() => {
  "use strict";
  const next = new URL("index.html", location.href);
  next.search = location.search;
  next.hash = location.hash;
  location.replace(next.href);
})();