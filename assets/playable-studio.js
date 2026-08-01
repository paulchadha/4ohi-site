(() => {
  "use strict";
  const reel = document.querySelector("[data-portfolio-reel]");
  if (!reel) return;
  const move = (direction) => reel.scrollBy({ left: direction * Math.max(280, reel.clientWidth * .82), behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  document.querySelector("[data-portfolio-prev]")?.addEventListener("click", () => move(-1));
  document.querySelector("[data-portfolio-next]")?.addEventListener("click", () => move(1));
})();
