(() => {
  "use strict";

  const root = document.documentElement;
  const body = document.body;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  const progress = document.createElement("div");
  progress.className = "ambient-progress";
  progress.setAttribute("aria-hidden", "true");
  body.prepend(progress);

  const updateProgress = () => {
    const distance = root.scrollHeight - window.innerHeight;
    root.style.setProperty("--scroll-progress", distance > 0 ? String(window.scrollY / distance) : "0");
  };
  updateProgress();
  window.addEventListener("scroll", updateProgress, { passive: true });
  window.addEventListener("resize", updateProgress, { passive: true });

  const revealTargets = [
    ...document.querySelectorAll(
      ".section-heading, .catalog-card, .news-card, .manifesto-line, .story-split, .about-beats > *, .article-layout, .support-layout > *, .privacy-row"
    )
  ];
  revealTargets.forEach((element) => element.setAttribute("data-nl-reveal", ""));

  if (!reducedMotion.matches && "IntersectionObserver" in window) {
    body.classList.add("experience-ready");
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px -7% 0px", threshold: 0.08 });
    revealTargets.forEach((element) => observer.observe(element));
  } else {
    revealTargets.forEach((element) => element.classList.add("is-visible"));
  }

  const orbit = document.querySelector(".hero-orbit");
  const finePointer = window.matchMedia("(pointer: fine)");
  if (orbit && finePointer.matches && !reducedMotion.matches) {
    orbit.addEventListener("pointermove", (event) => {
      const bounds = orbit.getBoundingClientRect();
      orbit.style.setProperty("--mx", String((event.clientX - bounds.left) / bounds.width - 0.5));
      orbit.style.setProperty("--my", String((event.clientY - bounds.top) / bounds.height - 0.5));
    });
    orbit.addEventListener("pointerleave", () => {
      orbit.style.setProperty("--mx", "0");
      orbit.style.setProperty("--my", "0");
    });
  }

  document.querySelectorAll("[data-game-key]").forEach((card) => {
    const key = card.getAttribute("data-game-key");
    const enter = () => { if (key) body.dataset.atmosphere = key; };
    const leave = () => { delete body.dataset.atmosphere; };
    card.addEventListener("pointerenter", enter);
    card.addEventListener("pointerleave", leave);
    card.addEventListener("focusin", enter);
    card.addEventListener("focusout", leave);
  });
})();
