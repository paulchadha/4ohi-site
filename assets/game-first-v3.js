(() => {
  "use strict";
  const stage = document.querySelector("[data-feature-stage]");
  if (!stage) return;
  const panels = [...stage.querySelectorAll("[data-feature-panel]")];
  const tabs = [...stage.querySelectorAll("[data-feature-selector]")];
  const select = (index, focus = false) => {
    const bounded = (index + panels.length) % panels.length;
    panels.forEach((panel, panelIndex) => {
      const active = panelIndex === bounded;
      panel.classList.toggle("is-active", active);
      panel.hidden = !active;
      panel.setAttribute("aria-hidden", String(!active));
    });
    tabs.forEach((tab, tabIndex) => {
      const active = tabIndex === bounded;
      tab.setAttribute("aria-selected", String(active));
      tab.tabIndex = active ? 0 : -1;
      if (active && focus) tab.focus();
    });
    stage.dataset.activeGame = panels[bounded].dataset.gameKey;
  };
  tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => select(index));
    tab.addEventListener("keydown", (event) => {
      if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
      event.preventDefault();
      const next = event.key === "Home" ? 0 : event.key === "End" ? tabs.length - 1 : index + (event.key === "ArrowRight" ? 1 : -1);
      select(next, true);
    });
  });
  select(Math.max(0, tabs.findIndex((tab) => tab.getAttribute("aria-selected") === "true")));
})();