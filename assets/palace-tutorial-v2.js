(() => {
  "use strict";

  const mount = document.querySelector("#palace-tutorial");
  if (!mount) return;

  const state = {
    phase: "intro",
    move: 0,
    locked: false
  };

  const redSuit = /[♥♦]/;
  const card = (label, options = {}) => {
    const classes = [
      "playing-card",
      redSuit.test(label) ? "red" : "",
      options.back ? "back" : "",
      options.wild ? "wild" : ""
    ].filter(Boolean).join(" ");
    const content = options.back ? "Hidden card" : label;
    if (options.button === false) {
      return `<span class="${classes}" data-card="${options.value || ""}" aria-label="${options.ariaLabel || content}">${content}</span>`;
    }
    return `<button class="${classes}" type="button" data-card="${options.value || label}" aria-label="${options.ariaLabel || `Play ${label}`}">${content}</button>`;
  };

  const progress = () => `<div class="tutorial-head">
    <span class="transmission-badge">Palace training table</span>
    <span class="tutorial-progress"><span class="turn-light">● Your move</span> ${state.move + 1} / 3</span>
  </div>`;

  const meter = () => `<div class="move-meter" aria-label="${state.move} of 3 moves complete">
    ${[0, 1, 2].map((index) => `<span class="${index < state.move ? "done" : index === state.move ? "current" : ""}"></span>`).join("")}
  </div>`;

  const rivalCards = () => `<div class="card-row compact">
    ${card("", { button: false, back: true, ariaLabel: "Rival hidden card" })}
    ${card("", { button: false, back: true, ariaLabel: "Rival hidden card" })}
    ${card("", { button: false, back: true, ariaLabel: "Rival hidden card" })}
  </div>`;

  const rounds = [
    {
      title: "Match it.",
      rule: "Same rank. Clean escape.",
      pile: "6♣",
      hand: [
        ["3♦", "low"],
        ["6♥", "correct"],
        ["Q♠", "high"],
        ["W", "wild", true]
      ],
      success: "Perfect match. You kept your power cards for later.",
      error: "That card cannot answer the six. Match it, beat it, or go wild."
    },
    {
      title: "Beat it.",
      rule: "Higher rank takes the pile.",
      pile: "9♦",
      hand: [
        ["4♠", "low"],
        ["7♥", "low"],
        ["Q♣", "correct"],
        ["W", "wild", true]
      ],
      success: "Queen over nine. The table is yours.",
      error: "Too low. Play a higher card—or use the wild."
    },
    {
      title: "Go wild.",
      rule: "Locked out? Break the rule.",
      pile: "K♠",
      hand: [
        ["5♣", "low"],
        ["8♦", "low"],
        ["J♣", "low"],
        ["W", "correct", true]
      ],
      success: "Wild card. The pile resets and the Palace opens.",
      error: "Nothing ordinary beats the king. This is your wild-card moment."
    }
  ];

  const renderIntro = () => `
    <div class="tutorial-head">
      <span class="transmission-badge">60-second training table</span>
      <span class="tutorial-progress">No account · Nothing saved</span>
    </div>
    <div class="tutorial-board">
      <div class="arena-intro">
        <p class="eyebrow">Palace is simpler than the legend</p>
        <h2>One pile. Three moves.</h2>
        <p>Get rid of every card before your rival. On your turn, make one smart choice:</p>
        <div class="rule-trinity" aria-label="The three basic Palace moves"><span>Match</span><span>Beat</span><span>Go wild</span></div>
        <button class="button" type="button" data-action="deal">Deal the cards</button>
      </div>
    </div>`;

  const renderRound = () => {
    const round = rounds[state.move];
    return `
      ${progress()}
      ${meter()}
      <div class="tutorial-board">
        <div class="palace-arena">
          <div class="arena-rival">
            <span class="zone-label">Rival · 3 cards</span>
            ${rivalCards()}
          </div>
          <div class="arena-center">
            <div class="arena-rule"><h2>${round.title}</h2><span>${round.rule}</span></div>
            <div class="arena-pile">
              <span class="zone-label">Top of pile</span>
              ${card(round.pile, { button: false })}
            </div>
            <div class="arena-status"><b>Fast rule</b>Play the same rank, any higher rank, or a marked wild card.</div>
          </div>
          <div class="arena-player">
            <span class="zone-label">Your hand</span>
            <div class="card-row">
              ${round.hand.map(([label, value, wild]) => card(label, {
                value,
                wild,
                ariaLabel: wild ? "Play wild card" : `Play ${label}`
              })).join("")}
            </div>
          </div>
        </div>
        <div class="tutorial-feedback" role="status" aria-live="polite">Choose your move: match, beat, or go wild.</div>
      </div>`;
  };

  const renderComplete = () => `
    <div class="tutorial-head">
      <span class="transmission-badge">Training complete</span>
      <span class="tutorial-progress">3 / 3</span>
    </div>
    <div class="tutorial-board">
      <div class="arena-complete">
        <span class="victory-crown" aria-hidden="true">♛</span>
        <p class="eyebrow">You own the table</p>
        <h2>You cleared the Palace.</h2>
        <p>That is the heartbeat of the game: match the pile, beat the pile, or break free with a wild card. The full Palace adds the famous three-layer finish—hand, face-up cards, then the final hidden cards.</p>
        <div class="rule-trinity"><span>Match</span><span>Beat</span><span>Go wild</span></div>
        <div class="tutorial-controls">
          <button class="button" type="button" data-action="replay">Play again</button>
          <a class="button secondary" href="palace.html">Enter the Palace</a>
        </div>
      </div>
    </div>`;

  let rendered = false;
  const render = () => {
    mount.innerHTML = state.phase === "intro"
      ? renderIntro()
      : state.phase === "complete"
        ? renderComplete()
        : renderRound();
    if (rendered) mount.focus({ preventScroll: true });
    rendered = true;
  };

  const announce = (message, good = false) => {
    const feedback = mount.querySelector(".tutorial-feedback");
    if (!feedback) return;
    feedback.innerHTML = good ? `<strong>${message}</strong>` : message;
  };

  mount.addEventListener("click", (event) => {
    const action = event.target.closest("[data-action]")?.dataset.action;
    const selected = event.target.closest("button[data-card]");

    if (action === "deal") {
      state.phase = "round";
      state.move = 0;
      state.locked = false;
      render();
      return;
    }

    if (action === "replay") {
      state.phase = "intro";
      state.move = 0;
      state.locked = false;
      render();
      return;
    }

    if (!selected || state.locked) return;
    const round = rounds[state.move];
    const value = selected.dataset.card;
    const correct = value === "correct" || value === "wild";

    if (!correct) {
      selected.classList.add("wrong");
      announce(round.error);
      window.setTimeout(() => selected.classList.remove("wrong"), 360);
      return;
    }

    state.locked = true;
    mount.querySelectorAll("button[data-card]").forEach((button) => { button.disabled = true; });
    selected.classList.add("correct", "played");
    announce(round.success, true);

    window.setTimeout(() => {
      state.move += 1;
      state.locked = false;
      if (state.move >= rounds.length) state.phase = "complete";
      render();
    }, window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 680);
  });

  render();
})();
