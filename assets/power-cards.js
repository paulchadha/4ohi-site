(() => {
  "use strict";
  const stage = document.querySelector("[data-power-showcase]");
  if (!stage) return;
  const rules = {
    "2": ["RESET", "Play anything next.", "The table takes a breath. Any rank may follow."],
    "7": ["LOWER", "Seven or lower must follow.", "High cards wait their turn. The pressure heads down."],
    "8": ["TRANSPARENT", "Read the card beneath it.", "The eight is there—but the pile looks straight through it."],
    "10": ["BURN", "The whole pile disappears.", "Clean table. Fresh lead. Extremely satisfying."]
  };
  const live = stage.querySelector("[data-power-live]");
  stage.addEventListener("click", (event) => {
    const card = event.target.closest("[data-power]");
    if (!card) return;
    const rank = card.dataset.power;
    stage.querySelectorAll("[data-power]").forEach((item) => item.setAttribute("aria-pressed", String(item === card)));
    stage.dataset.activePower = rank;
    const [title, short, detail] = rules[rank];
    live.innerHTML = `<b>${rank} · ${title}</b><span>${short}</span><small>${detail}</small>`;
  });
})();
