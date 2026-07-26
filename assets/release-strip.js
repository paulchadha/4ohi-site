(() => {
  "use strict";
  const target = Date.UTC(2026, 9, 17, 17, 0, 0);
  const format = (value) => String(value).padStart(2, "0");

  const render = () => {
    const remaining = Math.max(0, target - Date.now());
    const days = Math.floor(remaining / 86400000);
    const hours = Math.floor((remaining % 86400000) / 3600000);
    const minutes = Math.floor((remaining % 3600000) / 60000);
    const seconds = Math.floor((remaining % 60000) / 1000);
    document.querySelectorAll("[data-release-strip]").forEach((strip) => {
      strip.innerHTML = `<strong><span data-game-message="gameCountdown">Palace lands in</span> ${days} · ${format(hours)} · ${format(minutes)} · ${format(seconds)}</strong>`;
      strip.setAttribute("aria-label", `${window.FOUR_HEARTS_PRODUCT?.state.gameName ?? "Palace"} countdown: ${days} days, ${hours} hours, ${minutes} minutes`);
    });
    window.FOUR_HEARTS_PRODUCT?.render();
  };

  render();
  setInterval(render, 1000);
  document.addEventListener("fourOfHearts:gameNameChanged", render);
})();
