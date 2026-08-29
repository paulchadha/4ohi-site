(() => {
  "use strict";
  const root = document.documentElement;
  root.classList.add("enhanced");

  const header = document.querySelector(".site-header");
  const updateHeader = () => header?.classList.toggle("is-scrolled", scrollY > 12);
  updateHeader();
  addEventListener("scroll", updateHeader, { passive: true });

  const items = [...document.querySelectorAll("[data-reveal]")];
  if (!items.length) return;

  if (matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) {
    items.forEach((item) => item.classList.add("revealed"));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("revealed");
      observer.unobserve(entry.target);
    });
  }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });

  items.forEach((item) => observer.observe(item));
})();