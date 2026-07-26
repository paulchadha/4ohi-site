(() => {
  "use strict";

  const mount = document.querySelector("#palace-tutorial");
  if (!mount) return;

  const state = {
    step: 0,
    ready: false,
    layerPhase: 0
  };

  const symbols = /[♥♦]/;
  const card = (label, options = {}) => {
    const button = options.button !== false;
    const classes = [
      "playing-card",
      symbols.test(label) ? "red" : "",
      options.back ? "back" : "",
      options.special ? "special" : ""
    ].filter(Boolean).join(" ");
    if (!button) {
      return `<span class="${classes}" aria-label="${options.ariaLabel || label}">${options.back ? "Hidden card" : label}</span>`;
    }
    return `<button class="${classes}" type="button" data-card="${options.value || label}" aria-label="${options.ariaLabel || `Play ${label}`}">${label}</button>`;
  };

  const progress = () => `<div class="tutorial-head">
    <span class="alpha-badge">Interactive preview</span>
    <span class="tutorial-progress"><span class="turn-light">● Your turn</span> Chapter ${Math.min(state.step + 1, 6)} of 6</span>
  </div>`;

  const controls = (label = "Continue") => `<div class="tutorial-controls"><button class="button" type="button" data-action="next"${state.ready ? "" : " disabled"}>${label}</button></div>`;

  const renderIntro = () => `
    ${progress()}
    <div class="tutorial-board">
      <div class="tutorial-copy">
        <p class="eyebrow">Your first Palace</p>
        <h2>Three layers. One way out.</h2>
        <p>Clear your hand, then your visible cards, then the hidden cards underneath. This short preview teaches the rhythm without accounts, stakes, or saved progress.</p>
        <div class="layer-demo" aria-label="The three Palace card layers">
          <div><strong>1 · Hand</strong><small>Play these first and keep drawing while the deck remains.</small></div>
          <div><strong>2 · Face-up</strong><small>Your visible reserve unlocks when your hand is empty.</small></div>
          <div><strong>3 · Face-down</strong><small>The final cards are revealed only when you play them.</small></div>
        </div>
        <div class="tutorial-controls"><button class="button" type="button" data-action="deal">Deal my Palace</button></div>
      </div>
    </div>`;

  const renderLegalPlay = () => `
    ${progress()}
    <div class="tutorial-board">
      <div class="tutorial-copy">
        <p class="eyebrow">Hand layer</p>
        <h2>Match or climb.</h2>
        <p>The pile shows six. Choose a card equal to or higher than six.</p>
      </div>
      <div class="play-area">
        <div class="player-zone">
          <span class="zone-label">Your hand</span>
          <div class="card-row">${card("3♦")}${card("6♥")}${card("Q♠")}</div>
        </div>
        <div class="opponent-zone">
          <span class="zone-label">Rival · 4 cards left</span>
          <div class="card-row compact">${card("Hidden", { button: false, back: true, ariaLabel: "Opponent card" })}${card("Hidden", { button: false, back: true, ariaLabel: "Opponent card" })}</div>
        </div>
        </div>
        <div class="pile-zone">
          <span class="zone-label">Top of pile</span>
          <div class="card-row">${card("6♣", { button: false })}</div>
        </div>
      </div>
      <div class="tutorial-feedback" role="status" aria-live="polite">Pick a legal card. Palace rewards timing as much as raw card strength.</div>
      ${controls()}
    </div>`;

  const renderMatching = () => `
    ${progress()}
    <div class="tutorial-board">
      <div class="tutorial-copy">
        <p class="eyebrow">Equal ranks count</p>
        <h2>A match keeps you moving.</h2>
        <p>The pile shows nine. You do not need to spend a higher card when you can match it.</p>
      </div>
      <div class="play-area">
        <div class="player-zone">
          <span class="zone-label">Your hand</span>
          <div class="card-row">${card("4♠")}${card("9♣")}</div>
        </div>
        <div class="opponent-zone">
          <span class="zone-label">Rival · watching the pile</span>
          <div class="card-row compact">${card("Hidden", { button: false, back: true, ariaLabel: "Opponent card" })}</div>
        </div>
        <div class="pile-zone">
          <span class="zone-label">Top of pile</span>
          <div class="card-row">${card("9♦", { button: false })}</div>
        </div>
      </div>
      <div class="tutorial-feedback" role="status" aria-live="polite">Find the matching rank.</div>
      ${controls()}
    </div>`;

  const renderPickup = () => `
    ${progress()}
    <div class="tutorial-board">
      <div class="tutorial-copy">
        <p class="eyebrow">The table turns</p>
        <h2>Sometimes you take the pile.</h2>
        <p>Your opponent played a king. None of your ordinary cards can match or climb, so the pile comes into your hand.</p>
      </div>
      <div class="play-area">
        <div class="player-zone">
          <span class="zone-label">Your hand</span>
          <div class="card-row">${card("4♣", { value: "blocked" })}${card("7♥", { value: "blocked" })}${card("J♠", { value: "blocked" })}</div>
        </div>
        <div class="pile-zone">
          <span class="zone-label">Opponent played</span>
          <div class="card-row">${card("K♣", { button: false })}</div>
        </div>
        <div class="opponent-zone">
          <span class="zone-label">Rival just played</span>
          <div class="card-row compact">${card("Hidden", { button: false, back: true, ariaLabel: "Opponent reserve" })}</div>
        </div>
      </div>
      <div class="tutorial-feedback" role="status" aria-live="polite">No ordinary play is legal. Choose the table action that keeps the game honest.</div>
      <div class="tutorial-controls"><button class="button secondary" type="button" data-action="pickup">Pick up the pile</button></div>
    </div>`;

  const renderSpecial = () => `
    ${progress()}
    <div class="tutorial-board">
      <div class="tutorial-copy">
        <p class="eyebrow">Watch the marked ranks</p>
        <h2>Special cards change the plan.</h2>
        <p>Palace traditions use special ranks, and table rules vary. Four of Hearts marks every exception clearly. Which card should make you pause and plan?</p>
      </div>
      <div class="player-zone">
        <span class="zone-label">Your hand</span>
        <div class="card-row">${card("5♦")}${card("★", { value: "special", special: true, ariaLabel: "Marked special card" })}${card("Q♣")}</div>
      </div>
      <div class="tutorial-feedback" role="status" aria-live="polite">Look for the gold marker. The full game teaches each approved effect at the moment it matters.</div>
      ${controls()}
    </div>`;

  const renderLayers = () => {
    const faceUpDisabled = state.layerPhase !== 0;
    const faceDownDisabled = state.layerPhase !== 1;
    return `
      ${progress()}
      <div class="tutorial-board">
        <div class="tutorial-copy">
          <p class="eyebrow">The endgame</p>
          <h2>Hand. Face-up. Face-down.</h2>
          <p>Your hand is empty. Clear the visible reserve before trusting the final hidden card.</p>
        </div>
        <div class="layer-demo">
          <div><strong>Hand cleared</strong><div class="card-row"><span class="playing-card back" aria-label="Empty hand">✓</span></div></div>
          <div><strong>Face-up reserve</strong><div class="card-row"><button class="playing-card${state.layerPhase > 0 ? " correct" : ""}" type="button" data-layer="face-up"${faceUpDisabled ? " disabled" : ""}>8♠</button></div></div>
          <div><strong>Face-down finale</strong><div class="card-row"><button class="playing-card back${state.layerPhase > 1 ? " correct" : ""}" type="button" data-layer="face-down"${faceDownDisabled ? " disabled" : ""}>Hidden card</button></div></div>
        </div>
        <div class="tutorial-feedback" role="status" aria-live="polite">${state.layerPhase === 0 ? "Play the visible reserve first." : state.layerPhase === 1 ? "Now reveal and play the hidden card." : "<strong>All three layers are clear.</strong> That is the goal of Palace."}</div>
        ${controls("Finish the preview")}
      </div>`;
  };

  const renderComplete = () => `
    ${progress()}
    <div class="tutorial-board">
      <div class="tutorial-copy">
        <span aria-hidden="true" style="display:block;font-size:5rem;color:var(--gold-light)">♛</span>
        <p class="eyebrow">Palace preview complete</p>
        <h2>You cleared the Palace.</h2>
        <p>You learned the three layers, legal matching and climbing, pickup, special-card awareness, and the race to play every last card.</p>
        <ul class="lesson-list">
          <li>Play from your hand before the cards on the table.</li>
          <li>Match or climb when an ordinary card is on top.</li>
          <li>Pick up when no ordinary play is available.</li>
          <li>Notice marked special ranks and learn their approved effects in context.</li>
          <li>Clear hand, face-up reserve, and face-down finale to finish.</li>
        </ul>
        <div class="tutorial-controls">
          <button class="button" type="button" data-action="replay">Play again</button>
          <a class="button secondary" href="palace-story.html">Read the Palace story</a>
        </div>
      </div>
    </div>`;

  const templates = [renderIntro, renderLegalPlay, renderMatching, renderPickup, renderSpecial, renderLayers, renderComplete];

  let hasRendered = false;
  const render = () => {
    mount.innerHTML = templates[state.step]();
    if (hasRendered) mount.focus({ preventScroll: true });
    hasRendered = true;
  };

  const feedback = (message, good = false) => {
    const target = mount.querySelector(".tutorial-feedback");
    if (!target) return;
    target.innerHTML = good ? `<strong>${message}</strong>` : message;
  };

  const markReady = () => {
    state.ready = true;
    const next = mount.querySelector('[data-action="next"]');
    if (next) next.disabled = false;
  };

  mount.addEventListener("click", (event) => {
    const action = event.target.closest("[data-action]")?.dataset.action;
    const selectedCard = event.target.closest("[data-card]");
    const selectedLayer = event.target.closest("[data-layer]")?.dataset.layer;

    if (action === "deal") {
      state.step = 1;
      state.ready = false;
      render();
      return;
    }

    if (action === "next" && state.ready) {
      state.step += 1;
      state.ready = false;
      render();
      return;
    }

    if (action === "replay") {
      state.step = 0;
      state.ready = false;
      state.layerPhase = 0;
      render();
      return;
    }

    if (action === "pickup") {
      feedback("Good read. The pile joins your hand, and the next player begins a new pile.", true);
      event.target.disabled = true;
      window.setTimeout(() => {
        state.step = 4;
        state.ready = false;
        render();
      }, window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 650);
      return;
    }

    if (selectedLayer) {
      if (selectedLayer === "face-up" && state.layerPhase === 0) {
        state.layerPhase = 1;
        render();
      } else if (selectedLayer === "face-down" && state.layerPhase === 1) {
        state.layerPhase = 2;
        markReady();
        render();
      }
      return;
    }

    if (!selectedCard) return;
    const value = selectedCard.dataset.card;
    let correct = false;
    if (state.step === 1) correct = value === "6♥" || value === "Q♠";
    if (state.step === 2) correct = value === "9♣";
    if (state.step === 4) correct = value === "special";

    if (state.step === 3) {
      selectedCard.classList.add("wrong");
      feedback("That card cannot match or climb over the king. Pick up the pile.");
      window.setTimeout(() => selectedCard.classList.remove("wrong"), 380);
      return;
    }

    if (!correct) {
      selectedCard.classList.add("wrong");
      feedback(state.step === 1 ? "That card is lower than six. Match the six or climb higher." : state.step === 2 ? "Four is lower than nine. Match the nine." : "The gold star marks the card that changes the usual plan.");
      window.setTimeout(() => selectedCard.classList.remove("wrong"), 380);
      return;
    }

    mount.querySelectorAll("[data-card]").forEach((button) => { button.disabled = true; });
    selectedCard.classList.add("correct", "played");
    if (state.step === 1) feedback("Legal play. Equal or higher keeps the turn moving.", true);
    if (state.step === 2) feedback("Smart match. You kept the higher card for later.", true);
    if (state.step === 4) feedback("Exactly. Special cards deserve a plan before you commit them.", true);
    markReady();
  });

  render();
})();
