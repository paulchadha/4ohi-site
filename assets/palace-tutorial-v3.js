(() => {
  "use strict";
  const mount = document.querySelector("#palace-tutorial");
  if (!mount) return;
  const experience = window.PALACE_EXPERIENCE;
  const t = experience?.t || {};
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const wait = (ms) => new Promise((resolve) => setTimeout(resolve, reduced ? 0 : ms));
  const suitNames = { "♥": "hearts", "♦": "diamonds", "♣": "clubs", "♠": "spades" };
  const state = { chapter: 0, layer: 0, locked: false, powers: new Set(), opponentCards: 3 };
  const chapters = ["match", "burn", "pickup", "powers", "levels", "win"];

  const card = (rank, suit, id, options = {}) => {
    const label = options.back ? "Face-down card" : `${rank} of ${suitNames[suit]}`;
    const tag = options.action ? "button" : "span";
    return `<${tag} class="match-card ${/[♥♦]/.test(suit) ? "red" : ""} ${options.back ? "card-back" : ""} ${options.power ? "power-card" : ""}"${options.action ? ` type="button" data-play="${id}"` : ""} aria-label="${label}">
      <span class="card-corner">${options.back ? "4OH" : `${rank}<i>${suit}</i>`}</span>
      <strong>${options.back ? "♥" : rank}</strong><span class="card-suit">${options.back ? "" : suit}</span>
    </${tag}>`;
  };
  const backs = (count) => Array.from({ length: count }, (_, i) => card("", "", `back-${i}`, { back: true })).join("");
  const progress = () => `<div class="match-progress" aria-label="Mini-match progress"><span style="--progress:${Math.min(100, (state.chapter / 5) * 100)}%"></span><b>${state.chapter < 5 ? `${state.chapter + 1} / 5` : "♛"}</b></div>`;
  const chrome = (table, instruction, action = "") => `<div class="mini-match-chrome">
    <header><div><img data-game-art src="assets/palace-hero-384.webp" alt="" width="76" height="58"><span><b data-game-name>${experience?.displayName() || "Palace"}</b><small>THE MINI-MATCH</small></span></div>${progress()}</header>

    ${table}
    <footer><p role="status" aria-live="polite" data-match-status>${instruction}</p>${action}</footer>
  </div>`;
  const foundation = () => `<section class="palace-foundation" aria-label="Your Palace setup: three face-up cards over three face-down cards and a draw deck">
    <div class="foundation-stack"><span class="foundation-label">YOUR PALACE · FACE-UP OVER FACE-DOWN</span><div class="foundation-row visible-row">${card("4", "?", "")}${card("8", "?", "", { power: true })}${card("K", "?", "")}</div><div class="foundation-row hidden-row">${backs(3)}</div></div>
    <div class="draw-deck"><span class="draw-deck-label">DRAW DECK</span>${card("", "", "deck", { back: true })}</div>
  </section>`;
  const table = ({ rival = backs(state.opponentCards), pile, hand, callout = "", layers = "" }) => `<div class="palace-app-table" data-chapter="${chapters[state.chapter]}">
    <div class="castle-silhouette" aria-hidden="true"><span>♜</span><span>♛</span><span>♜</span></div>
    <section class="seat rival-seat"><span class="seat-avatar" aria-hidden="true">N</span><label>${t.rival || "RIVAL"} · ${state.opponentCards} CARDS</label><div class="card-row">${rival}</div></section>
    <section class="central-pile"><label>${t.pile || "TOP OF PILE"}</label><div class="pile-cards">${pile}</div>${callout ? `<strong class="table-callout">${callout}</strong>` : ""}</section>
    ${layers || foundation()}
    <section class="seat player-seat"><span class="seat-avatar you" aria-hidden="true">YOU</span><label>${t.hand || "YOUR HAND"}</label><div class="card-row player-hand">${hand}</div></section>
  </div>`;
  const scene = () => {
    if (state.chapter === 0) return chrome(table({
      pile: card("6", "♣", "pile"),
      hand: card("4", "♦", "low", { action: true }) + card("6", "♥", "match", { action: true }) + card("9", "♠", "high", { action: true }) + card("10", "♣", "burn", { action: true, power: true }),
      callout: t.match || "MATCH OR BEAT"
    }), t.prompt || "Your Palace is built: hand, three face-up cards, three face-down cards, and a draw deck. Match the six, play higher, or use a power card.");
    if (state.chapter === 1) return chrome(table({
      pile: card("5", "♦", "pile") + card("7", "♣", "pile") + card("9", "♥", "pile"),
      hand: card("3", "♣", "low", { action: true }) + card("10", "♠", "burn", { action: true, power: true }) + card("K", "♦", "high", { action: true }),
      callout: "10 = BURN"
    }), "A ten clears everything. Burn the pile and keep control.");
    if (state.chapter === 2) return chrome(table({
      rival: card("3", "♠", "rival") + card("5", "♥", "rival"),
      pile: card("Q", "♣", "pile"),
      hand: card("4", "♦", "waiting") + card("8", "♣", "waiting", { power: true }),
      callout: "NO LEGAL CARD"
    }), "Your rival cannot match or beat the queen.", `<button class="match-action" type="button" data-action="pickup">${t.pickup || "PICK UP"}</button>`);
    if (state.chapter === 3) return chrome(table({
      pile: card("9", "♠", "pile"),
      hand: card("2", "♣", "2", { action: true, power: true }) + card("7", "♥", "7", { action: true, power: true }) + card("8", "♠", "8", { action: true, power: true }) + card("10", "♦", "10", { action: true, power: true }),
      callout: "CHANGE THE GAME"
    }), state.powers.size ? `${state.powers.size} / 4 power cards discovered.` : "Try every power card: reset, lower, transparent, burn.");
    if (state.chapter === 4) {
      const levels = `<div class="palace-level-deck" data-layer="${state.layer}"><div class="level-row hidden-row">${backs(3)}</div><div class="level-row visible-row">${card("4", "♥", "")}${card("8", "♣", "", { power: true })}${card("K", "♠", "")}</div></div>`;
      const hand = state.layer === 0 ? card("3", "♦", "level", { action: true }) + card("6", "♣", "level", { action: true }) + card("10", "♥", "level", { action: true, power: true }) :
        state.layer === 1 ? card("4", "♥", "level", { action: true }) + card("8", "♣", "level", { action: true, power: true }) + card("K", "♠", "level", { action: true }) :
        card("", "", "level", { action: true, back: true });
      return chrome(table({ pile: card("2", "♠", "pile", { power: true }), hand, layers: levels, callout: [t.levelHand || "HAND", t.levelUp || "FACE-UP", t.levelDown || "FACE-DOWN"][state.layer] }), "Clear the hand, then the face-up row, then trust the hidden finale.");
    }
    return chrome(`<div class="match-victory"><img data-game-art src="assets/palace-hero-640.webp" alt="" width="512" height="512"><span class="victory-crown">♛</span><p class="eyebrow">MINI-MATCH COMPLETE</p><h2>${t.won || "YOU RULE THE PALACE"}</h2><p>Hand cleared. Face-up cleared. Mystery card revealed. Now you know why one more game is never just one more game.</p><div class="victory-actions"><button class="button" type="button" data-action="replay">${t.replay || "Replay mini-match"}</button><a class="button secondary" href="index.html#rules">Full rules</a><a class="text-link" href="palace-story.html">The story</a></div></div>`, "");
  };
  const activateCountdown = () => {
    const node = mount.querySelector("[data-release-strip]");
    if (!node) return;
    const delta = Math.max(0, new Date("2026-10-17T00:00:00-05:00").getTime() - Date.now());
    const units = [Math.floor(delta / 86400000), Math.floor(delta / 3600000) % 24, Math.floor(delta / 60000) % 60, Math.floor(delta / 1000) % 60];
    node.innerHTML = `<span>${t.launch || "The gates open in"}</span><strong>${units.map((n) => String(n).padStart(2, "0")).join(" : ")}</strong>`;
  };
  const render = () => { mount.innerHTML = scene(); activateCountdown(); experience?.applyGame(); };
  const status = (message, good = false) => {
    const node = mount.querySelector("[data-match-status]");
    if (node) { node.textContent = message; node.classList.toggle("good", good); }
  };
  const advance = async (button) => {
    state.locked = true; button?.classList.add("played"); await wait(520); state.chapter += 1; state.locked = false; render(); mount.focus({ preventScroll: true });
  };
  mount.addEventListener("click", async (event) => {
    if (state.locked) return;
    const action = event.target.closest("[data-action]")?.dataset.action;
    const button = event.target.closest("[data-play]");
    if (action === "replay") { Object.assign(state, { chapter: 0, layer: 0, locked: false, opponentCards: 3 }); state.powers.clear(); render(); return; }
    if (action === "pickup" && state.chapter === 2) {
      state.locked = true; status("The rival picks up the entire pile…", true); mount.querySelector(".rival-seat")?.classList.add("receiving"); await wait(800);
      state.opponentCards = 7; state.chapter = 3; state.locked = false; render(); return;
    }
    if (!button) return;
    const play = button.dataset.play;
    if (state.chapter === 0) {
      if (play === "low") { status("Four is below six. Match the six, play higher, or use the ten."); button.classList.add("illegal"); await wait(400); button.classList.remove("illegal"); return; }
      await advance(button); return;
    }
    if (state.chapter === 1) {
      if (play !== "burn") { status("This is the ten’s moment. Burn the whole pile."); return; }
      mount.querySelector(".central-pile")?.classList.add("burning"); status("BOOM. The pile is gone—and you lead again.", true); await advance(button); return;
    }
    if (state.chapter === 3) {
      const rules = { "2": "2 resets. Anything may follow.", "7": "7 sends play lower.", "8": "8 is transparent. Read the card below.", "10": "10 burns the pile." };
      state.powers.add(play); button.classList.add("discovered"); status(rules[play], true);
      if (state.powers.size === 4) { await wait(700); state.chapter = 4; render(); }
      return;
    }
    if (state.chapter === 4) {
      button.classList.add("played"); await wait(350);
      if (state.layer < 2) { state.layer += 1; render(); } else { state.chapter = 5; render(); }
    }
  });
  render();
})();
