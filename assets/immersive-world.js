(() => {
  "use strict";

  const body = document.body;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  body.classList.add("page-arriving");
  window.setTimeout(() => body.classList.remove("page-arriving"), 700);

  const revealTargets = document.querySelectorAll(
    ".home-thesis h2, .thesis-notes, .world-index-row, .news-card, .manifesto-line, .power-heading, .power-showcase, .story-split, .catalog-card, .about-beats > *, .history-triad article, .article-header, .article-art, .article-layout"
  );
  revealTargets.forEach((target) => target.setAttribute("data-immersive-reveal", ""));
  if (!reduced.matches && "IntersectionObserver" in window) {
    body.classList.add("immersive-ready");
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-immersive-visible");
        observer.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px -5% 0px", threshold: 0.06 });
    revealTargets.forEach((target) => observer.observe(target));
  } else {
    revealTargets.forEach((target) => target.classList.add("is-immersive-visible"));
  }

  const portal = document.querySelector("[data-spatial-gallery]");
  const palaceTools = document.querySelector("[data-palace-portal-tools]");
  const spatialLink = document.querySelector("[data-spatial-link]");
  const syncPortal = () => {
    const active = portal?.querySelector("[data-spatial-world].is-active");
    if (!active) return;
    const isPalace = active.dataset.gameKey === "palace";
    if (palaceTools) {
      palaceTools.hidden = !isPalace;
      palaceTools.setAttribute("aria-hidden", String(!isPalace));
    }
    if (spatialLink) {
      spatialLink.innerHTML = `${active.dataset.action || "Enter this world"} <span aria-hidden="true">↗</span>`;
    }
  };
  portal?.addEventListener("click", () => requestAnimationFrame(syncPortal));
  portal?.addEventListener("keydown", () => requestAnimationFrame(syncPortal));
  portal?.addEventListener("pointerup", () => requestAnimationFrame(syncPortal));
  portal?.addEventListener("wheel", () => requestAnimationFrame(syncPortal), { passive: true });
  syncPortal();

  const powerStage = document.querySelector("[data-power-showcase]");
  if (powerStage) {
    const cards = [...powerStage.querySelectorAll("[data-power]")];
    cards.forEach((card, index) => card.addEventListener("keydown", (event) => {
      const direction = event.key === "ArrowRight" || event.key === "ArrowDown" ? 1 : event.key === "ArrowLeft" || event.key === "ArrowUp" ? -1 : 0;
      if (!direction) return;
      event.preventDefault();
      const next = cards[(index + direction + cards.length) % cards.length];
      next.focus();
      next.click();
    }));
  }

  document.addEventListener("click", (event) => {
    const link = event.target.closest("a[href]");
    if (!link || reduced.matches || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const url = new URL(link.href, location.href);
    if (url.origin !== location.origin || url.hash || link.target || link.hasAttribute("download")) return;
    body.classList.add("page-leaving");
  });
})();
