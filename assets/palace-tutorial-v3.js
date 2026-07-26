(() => {
  "use strict";
  const mount = document.querySelector("#palace-tutorial");
  if (!mount) return;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const wait = (ms) => new Promise((resolve) => window.setTimeout(resolve, reduced ? 0 : ms));
  const state = { scene: 0, locked: false, powerSeen: new Set(), layer: 0 };
  const scenes = ["Match or beat", "Ten burns", "Pickup", "Power cards", "Three levels"];
  const suitRed = /[♥♦]/;
  const card = (label, value, options = {}) => {
    const [rank, suit = ""] = [...label];
    const classes = ["v3-card", suitRed.test(suit) ? "red" : "", options.back ? "back" : "", options.power ? "power" : ""].filter(Boolean).join(" ");
    const tag = options.button === false ? "span" : "button";
    const attrs = options.button === false ? "" : ` type="button" data-card="${value}"`;
    const aria = options.back ? "Face-down card" : `${rank}${suit ? ` of ${suit === "♥" ? "hearts" : suit === "♦" ? "diamonds" : suit === "♣" ? "clubs" : "spades"}` : " power card"}`;
    return `<${tag} class="${classes}"${attrs} aria-label="${aria}"><span class="corner">${options.back ? "4OH" : `${rank}<i>${suit}</i>`}</span><strong>${options.back ? "♥" : rank}</strong><span class="suit">${options.back ? "" : suit}</span></${tag}>`;
  };
  const header = () => `<div class="v3-tutorial-head"><div><span class="live-dot" aria-hidden="true"></span>PALACE FIELD TRAINING</div><span>Scene ${Math.min(state.scene + 1, 5)} / 5</span></div><ol class="scene-rail" aria-label="Tutorial progress">${scenes.map((name, index) => `<li class="${index < state.scene ? "done" : index === state.scene ? "current" : ""}"><span>${index + 1}</span>${name}</li>`).join("")}</ol>`;
  const feedback = (text) => `<p class="v3-feedback" role="status" aria-live="polite">${text}</p>`;
  const table = (content, message) => `${header()}<div class="v3-table">${content}</div>${feedback(message)}`;
  const intro = () => `<div class="v3-tutorial-head"><div><span class="live-dot" aria-hidden="true"></span>PALACE FIELD TRAINING</div><span>NO ACCOUNT · NOTHING SAVED</span></div><div class="v3-intro"><p class="eyebrow">The whole game starts here</p><h2>Match it.<br>Beat it.<br><em>Rule the table.</em></h2><p>Play every card in your hand, then your face-up row, then the cards you cannot see. Power cards can change everything.</p><button class="button" type="button" data-action="start">Take your seat</button></div>`;
  const sceneMatch = () => table(`<div class="opponent-seat"><span>RIVAL · 3 CARDS</span><div>${card("", "", { back:true, button:false })}${card("", "", { back:true, button:false })}${card("", "", { back:true, button:false })}</div></div><div class="pile-seat"><span>TOP OF PILE</span><div class="pile-depth">${card("6♣", "pile", { button:false })}</div><b>MATCH 6 OR PLAY HIGHER</b></div><div class="player-seat"><span>YOUR HAND</span><div class="v3-hand">${card("4♦", "wrong")}${card("6♥", "match")}${card("9♠", "beat")}${card("10♣", "ten", {power:true})}</div></div>`, "Choose a card. Try the four first—you can recover from a mistake.");
  const sceneBurn = () => table(`<div class="opponent-seat"><span>RIVAL · WATCHING</span><div>${card("", "", {back:true,button:false})}${card("", "", {back:true,button:false})}</div></div><div class="pile-seat burn-target"><span>THE PILE IS GETTING HEAVY</span><div class="pile-depth">${card("5♦","",{button:false})}${card("7♣","",{button:false})}${card("9♥","",{button:false})}</div><b>TEN BURNS THE ENTIRE PILE</b></div><div class="player-seat"><span>YOUR HAND</span><div class="v3-hand">${card("3♣","wrong")}${card("10♠","burn",{power:true})}${card("K♦","beat")}</div></div>`, "Play the ten. The pile will disappear and you lead again.");
  const scenePickup = () => table(`<div class="opponent-seat opponent-thinking"><span>RIVAL · THINKING</span><div class="v3-hand compact">${card("3♠","",{button:false})}${card("5♥","",{button:false})}</div></div><div class="pile-seat pickup-target"><span>TOP OF PILE</span><div class="pile-depth">${card("Q♣","",{button:false})}</div><b>NO MATCH. NOTHING HIGHER.</b></div><div class="player-seat"><span>YOUR MOVE IS COMPLETE</span><button class="button secondary" type="button" data-action="opponent">Let the rival play</button></div>`, "When a player cannot match or beat the pile, they pick up every card in it.");
  const scenePowers = () => table(`<div class="power-stage"><div><p class="eyebrow">Change the game</p><h2>Four power cards.<br>Four ways out.</h2><p>Select each card to learn the Four of Hearts rule.</p></div><div class="power-grid">${card("2♣","2",{power:true})}${card("7♥","7",{power:true})}${card("8♠","8",{power:true})}${card("10♦","10",{power:true})}</div><div class="power-readout" data-power-readout><strong>Choose a power card</strong><span>2 resets · 7 requires lower · 8 is transparent · 10 burns</span></div></div>`, "Explore all four power cards to continue.");
  const sceneLayers = () => {
    const layerNames = ["Cards in hand", "Face-up cards", "Face-down cards"];
    return table(`<div class="levels-stage"><div><p class="eyebrow">The Palace finish</p><h2>Three levels.<br>One crown.</h2><p>Clear each level in order. The final cards stay hidden until you play them.</p></div><div class="level-stack" data-layer="${state.layer}"><button type="button" data-action="layer" aria-label="Reveal next Palace level"><span class="level face-down">${card("","",{back:true,button:false})}${card("","",{back:true,button:false})}${card("","",{back:true,button:false})}</span><span class="level face-up">${card("4♥","",{button:false})}${card("8♣","",{button:false,power:true})}${card("K♠","",{button:false})}</span><span class="level hand-level">${card("3♦","",{button:false})}${card("6♣","",{button:false})}${card("10♥","",{button:false,power:true})}</span></button><strong>${layerNames[state.layer]}</strong><small>${state.layer < 2 ? "Select the cards to move to the next level" : "The last reveal is pure Palace"}</small></div></div>`, "Hand first. Face-up next. Face-down last.");
  };
  const complete = () => `${header()}<div class="v3-complete"><span class="crown-burst" aria-hidden="true">♛</span><p class="eyebrow">Training complete</p><h2>You rule this Palace.</h2><p>You matched, climbed, burned a pile, watched a pickup, learned the power cards, and crossed all three levels.</p><div class="tutorial-controls"><button class="button" type="button" data-action="replay">Replay tutorial</button><a class="button secondary" href="palace.html#rules">Read full rules</a><a class="text-link" href="palace-story.html">Explore Palace history</a><a class="text-link" href="news.html">Read Palace news</a></div></div>`;
  const render = () => { mount.innerHTML = state.scene === -1 ? intro() : state.scene === 0 ? sceneMatch() : state.scene === 1 ? sceneBurn() : state.scene === 2 ? scenePickup() : state.scene === 3 ? scenePowers() : state.scene === 4 ? sceneLayers() : complete(); };
  const say = (text, good = false) => { const node = mount.querySelector(".v3-feedback"); if (node) { node.textContent = text; node.classList.toggle("good", good); } };
  const advance = async (selected, effect) => { state.locked = true; if (selected) selected.classList.add("played", effect || ""); await wait(760); state.scene += 1; state.locked = false; render(); mount.focus({preventScroll:true}); };
  mount.addEventListener("click", async (event) => {
    if (state.locked) return;
    const action = event.target.closest("[data-action]")?.dataset.action;
    const selected = event.target.closest("button[data-card]");
    if (action === "start") { state.scene = 0; render(); return; }
    if (action === "replay") { state.scene = -1; state.powerSeen.clear(); state.layer = 0; render(); return; }
    if (action === "opponent" && state.scene === 2) { state.locked = true; say("The rival checks the pile…"); await wait(650); mount.querySelector(".opponent-thinking")?.classList.add("picking-up"); mount.querySelector(".pickup-target")?.classList.add("picked-up"); say("Can’t match or beat it? Pick up the pile.", true); await wait(1200); state.scene = 3; state.locked = false; render(); return; }
    if (action === "layer" && state.scene === 4) { if (state.layer < 2) { state.layer += 1; render(); } else { await advance(null); } return; }
    if (!selected) return;
    const value = selected.dataset.card;
    if (state.scene === 0) {
      if (value === "wrong") { selected.classList.add("wrong"); say("Four is lower than six. Try again: match the six or beat it."); await wait(450); selected.classList.remove("wrong"); return; }
      await advance(selected, value === "match" ? "matched" : "climbed"); return;
    }
    if (state.scene === 1) {
      if (value !== "burn") { selected.classList.add("wrong"); say("Save that one. This scene is about the ten."); await wait(450); selected.classList.remove("wrong"); return; }
      mount.querySelector(".burn-target")?.classList.add("burning"); say("TEN BURNS THE PILE. You lead again.", true); await advance(selected, "burn-card"); return;
    }
    if (state.scene === 3) {
      const rules = { "2":["2 RESETS","Play anything next."], "7":["7 REQUIRES LOWER","The next ordinary card must be seven or lower."], "8":["8 IS TRANSPARENT","Ignore it when judging the next play."], "10":["10 BURNS","Sweep the pile away and lead again."] };
      state.powerSeen.add(value); selected.classList.add("seen"); const [title, body] = rules[value]; const out = mount.querySelector("[data-power-readout]"); out.innerHTML = `<strong>${title}</strong><span>${body}</span>`;
      say(`${state.powerSeen.size} of 4 power cards explored.`, true);
      if (state.powerSeen.size === 4) { await wait(900); state.scene = 4; render(); }
    }
  });
  state.scene = -1;
  render();
})();