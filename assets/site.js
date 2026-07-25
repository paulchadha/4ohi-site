(() => {
  "use strict";

  const menuButton = document.querySelector(".menu-toggle");
  const navigation = document.querySelector("#primary-navigation");

  if (menuButton && navigation) {
    const closeMenu = () => {
      navigation.dataset.open = "false";
      menuButton.setAttribute("aria-expanded", "false");
    };

    menuButton.addEventListener("click", () => {
      const open = navigation.dataset.open !== "true";
      navigation.dataset.open = String(open);
      menuButton.setAttribute("aria-expanded", String(open));
    });

    navigation.addEventListener("click", (event) => {
      if (event.target.closest("a")) closeMenu();
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeMenu();
        menuButton.focus();
      }
    });
  }

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const revealItems = [...document.querySelectorAll("[data-reveal]")];
  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealItems.forEach((item) => item.classList.add("revealed"));
  } else {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("revealed");
        observer.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: .08 });
    revealItems.forEach((item) => observer.observe(item));
  }

  const hero = document.querySelector(".hero");
  if (hero && !reduceMotion) {
    hero.addEventListener("pointermove", (event) => {
      const rect = hero.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 100;
      const y = ((event.clientY - rect.top) / rect.height) * 100;
      hero.style.setProperty("--pointer-x", `${Math.max(0, Math.min(100, x))}%`);
      hero.style.setProperty("--pointer-y", `${Math.max(0, Math.min(100, y))}%`);
    }, { passive: true });
  }

  const social = window.FOUR_HEARTS_CONFIG?.social ?? {};
  const approvedHosts = {
    facebook: new Set(["facebook.com", "www.facebook.com"]),
    x: new Set(["x.com", "www.x.com"])
  };
  const socialNames = { facebook: "Facebook", x: "X" };

  document.querySelectorAll("[data-social-slot]").forEach((slot) => {
    const links = document.createElement("div");
    links.className = "social-links";

    Object.entries(socialNames).forEach(([key, name]) => {
      const value = social[key];
      if (!value) return;
      try {
        const url = new URL(value);
        if (url.protocol !== "https:" || !approvedHosts[key].has(url.hostname)) return;
        const link = document.createElement("a");
        link.href = url.href;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        link.setAttribute("aria-label", `Four of Hearts Interactive on ${name}`);
        link.textContent = name === "Facebook" ? "f" : "X";
        links.append(link);
      } catch {
        // Invalid or unapproved values stay hidden.
      }
    });

    if (links.childElementCount) slot.append(links);
  });
})();
