(() => {
  "use strict";

  const gallery = document.querySelector("[data-spatial-gallery]");
  if (!gallery) return;

  const worlds = [...gallery.querySelectorAll("[data-spatial-world]")];
  const selectors = [...gallery.querySelectorAll("[data-spatial-select]")];
  const previous = gallery.querySelector("[data-spatial-prev]");
  const next = gallery.querySelector("[data-spatial-next]");
  const count = gallery.querySelector("[data-spatial-count]");
  const title = gallery.querySelector("[data-spatial-title]");
  const description = gallery.querySelector("[data-spatial-description]");
  const status = gallery.querySelector("[data-spatial-status]");
  const link = gallery.querySelector("[data-spatial-link]");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let activeIndex = 0;
  let wheelLocked = false;
  let dragStart = null;

  const relativeOffset = (index) => {
    let offset = index - activeIndex;
    const midpoint = worlds.length / 2;
    if (offset > midpoint) offset -= worlds.length;
    if (offset < -midpoint) offset += worlds.length;
    return offset;
  };

  const update = (nextIndex, announce = true) => {
    activeIndex = (nextIndex + worlds.length) % worlds.length;
    worlds.forEach((world, index) => {
      const offset = relativeOffset(index);
      const depth = Math.abs(offset);
      const isActive = index === activeIndex;
      world.style.setProperty("--offset", String(offset));
      world.style.setProperty("--depth", String(depth));
      world.classList.add("is-positioned");
      world.classList.toggle("is-active", isActive);
      world.setAttribute("aria-hidden", isActive ? "false" : "true");
      const worldLink = world.querySelector("a");
      if (worldLink) worldLink.tabIndex = isActive ? 0 : -1;
    });
    selectors.forEach((button, index) => {
      if (index === activeIndex) button.setAttribute("aria-current", "true");
      else button.removeAttribute("aria-current");
    });
    const world = worlds[activeIndex];
    if (!world) return;
    count.textContent = String(activeIndex + 1).padStart(2, "0");
    title.textContent = world.dataset.title || "";
    description.textContent = world.dataset.description || "";
    status.textContent = world.dataset.status || "";
    link.href = world.dataset.href || "games.html";
    link.setAttribute("aria-label", `Explore ${world.dataset.title || "this game"}`);
    document.body.dataset.atmosphere = world.classList[1] || "";
    if (announce && !reducedMotion.matches) title.animate(
      [{ opacity: 0, transform: "translateY(20px)" }, { opacity: 1, transform: "translateY(0)" }],
      { duration: 520, easing: "cubic-bezier(.19,1,.22,1)" }
    );
  };

  const step = (direction) => update(activeIndex + direction);
  previous?.addEventListener("click", () => step(-1));
  next?.addEventListener("click", () => step(1));
  selectors.forEach((button, index) => button.addEventListener("click", () => update(index)));

  gallery.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      event.preventDefault();
      step(-1);
    }
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      event.preventDefault();
      step(1);
    }
    if (event.key === "Home") {
      event.preventDefault();
      update(0);
    }
    if (event.key === "End") {
      event.preventDefault();
      update(worlds.length - 1);
    }
  });

  gallery.addEventListener("wheel", (event) => {
    if (wheelLocked || Math.abs(event.deltaY) < 18 || Math.abs(event.deltaY) < Math.abs(event.deltaX)) return;
    const direction = event.deltaY > 0 ? 1 : -1;
    const atExit = (direction > 0 && activeIndex === worlds.length - 1) || (direction < 0 && activeIndex === 0);
    if (atExit) return;
    event.preventDefault();
    wheelLocked = true;
    step(direction);
    window.setTimeout(() => { wheelLocked = false; }, reducedMotion.matches ? 180 : 720);
  }, { passive: false });

  gallery.addEventListener("pointerdown", (event) => {
    if (event.target.closest("button, a")) return;
    if (event.pointerType === "mouse" && event.button !== 0) return;
    dragStart = { x: event.clientX, y: event.clientY, id: event.pointerId };
    gallery.setPointerCapture?.(event.pointerId);
  });
  gallery.addEventListener("pointerup", (event) => {
    if (!dragStart || dragStart.id !== event.pointerId) return;
    const dx = event.clientX - dragStart.x;
    const dy = event.clientY - dragStart.y;
    if (Math.max(Math.abs(dx), Math.abs(dy)) > 45) step(Math.abs(dx) > Math.abs(dy) ? (dx < 0 ? 1 : -1) : (dy < 0 ? 1 : -1));
    dragStart = null;
  });
  gallery.addEventListener("pointercancel", () => { dragStart = null; });

  update(0, false);
})();