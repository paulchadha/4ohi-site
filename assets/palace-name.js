(() => {
  "use strict";
  const controls = [...document.querySelectorAll("[data-name-choice]")];
  if (!controls.length) return;

  let taps = [];
  const applyName = (name) => {
    document.querySelectorAll("[data-game-name]").forEach((node) => { node.textContent = name; });
    controls.forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.nameChoice === name)));
    const status = document.querySelector("[data-name-status]");
    if (status) status.textContent = `${name} is used at this table. This choice resets when you refresh.`;
  };

  controls.forEach((button) => {
    button.addEventListener("click", () => {
      const requested = button.dataset.nameChoice;
      applyName(requested);
      if (requested !== "Shed") { taps = []; return; }
      const now = performance.now();
      taps = [...taps.filter((time) => now - time <= 4000), now];
      if (taps.length < 10) return;
      taps = [];
      applyName("Shithead");
      const secret = document.querySelector("[data-name-secret]");
      if (secret) { secret.hidden = false; secret.focus({ preventScroll: true }); }
    });
  });

  applyName("Palace");
})();