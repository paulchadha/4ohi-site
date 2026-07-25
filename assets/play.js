(() => {
  const gameOrder = ["palace", "hearts", "spades", "euchre"];
  const games = {
    palace: {
      name: "Palace",
      color: "#1398f5",
      icon: "assets/icon-palace-4hearts.webp",
      intro: "In this tiny Palace lesson, climb the pile by matching or playing higher.",
      rounds: [
        {
          title: "Climb the pile",
          prompt: "The pile shows 6♣. Play any card equal to or higher than six.",
          contextLabel: "Top of pile",
          table: ["6♣"],
          choices: [
            { label: "3♦", correct: false, hint: "Three is lower than six. Try a card that matches or climbs." },
            { label: "7♥", correct: true },
            { label: "Q♠", correct: true }
          ],
          success: "Nice climb! Seven and queen are both legal because each is higher than six."
        },
        {
          title: "Match or rise",
          prompt: "Now the pile shows J♦. Match the jack or play higher.",
          contextLabel: "Top of pile",
          table: ["J♦"],
          choices: [
            { label: "4♣", correct: false, hint: "Four cannot climb over a jack." },
            { label: "J♥", correct: true },
            { label: "K♠", correct: true }
          ],
          success: "Exactly. Matching the jack or climbing to the king keeps you in the round."
        }
      ]
    },
    hearts: {
      name: "Hearts",
      color: "#f04444",
      icon: "assets/icon-hearts-4hearts.webp",
      intro: "Hearts is a trick-taking game. The first habit is simple: follow the suit that was led when you can.",
      rounds: [
        {
          title: "Follow suit",
          prompt: "Clubs were led. You have one club in your hand. Which card must you play?",
          contextLabel: "Card led",
          table: ["8♣"],
          choices: [
            { label: "4♣", correct: true },
            { label: "A♥", correct: false, hint: "You still hold a club, so you must follow clubs." },
            { label: "Q♠", correct: false, hint: "Save the queen for now—you must follow clubs." }
          ],
          success: "You followed suit. That one habit keeps every Hearts trick fair and readable."
        },
        {
          title: "Duck the points",
          prompt: "Hearts were led and this trick is already point-heavy. Play the safest heart.",
          contextLabel: "Trick so far",
          table: ["5♥", "9♥", "K♥"],
          choices: [
            { label: "2♥", correct: true },
            { label: "A♥", correct: false, hint: "The ace would take this trick—and all those points. Go low." },
            { label: "7♣", correct: false, hint: "You have hearts, so you must follow hearts." }
          ],
          success: "Perfect duck. The two follows suit without winning the point-heavy trick."
        }
      ]
    },
    spades: {
      name: "Spades",
      color: "#a64ef2",
      icon: "assets/icon-spades-4hearts.webp",
      intro: "In Spades, every spade is trump. A small trump card can beat a high card from another suit.",
      rounds: [
        {
          title: "Trump the trick",
          prompt: "A heart was led, but you have no hearts. Which card can beat the king of hearts?",
          contextLabel: "Card led",
          table: ["K♥"],
          choices: [
            { label: "4♠", correct: true },
            { label: "A♣", correct: false, hint: "The ace is high, but clubs are not trump. Try a spade." },
            { label: "K♦", correct: false, hint: "Matching the rank does not beat the led suit. Spades are trump." }
          ],
          success: "Trumped! Even the four of spades beats the king of hearts here."
        },
        {
          title: "Climb in trump",
          prompt: "A spade was led. Which card can beat the 9♠?",
          contextLabel: "Card led",
          table: ["9♠"],
          choices: [
            { label: "Q♠", correct: true },
            { label: "A♥", correct: false, hint: "Spades were led. A heart cannot beat a spade here." },
            { label: "K♣", correct: false, hint: "The king is high, but it is not a spade." }
          ],
          success: "Right again. When trump is led, follow trump and climb when you can."
        }
      ]
    },
    euchre: {
      name: "Euchre",
      color: "#79c83d",
      icon: "assets/icon-euchre-4hearts.webp",
      intro: "Euchre gives the two jacks around trump special jobs: the right bower and the left bower.",
      rounds: [
        {
          title: "Meet the right bower",
          prompt: "Hearts are trump. Which card is the most powerful trump card?",
          contextLabel: "Trump suit",
          table: [{ label: "♥", trump: true, note: "trump" }],
          choices: [
            { label: "J♥", correct: true },
            { label: "J♦", correct: false, hint: "Very close—that is the left bower and second-highest trump." },
            { label: "A♥", correct: false, hint: "The ace is strong, but the right bower ranks above it." }
          ],
          success: "Right bower! The jack of the trump suit is the strongest card in Euchre."
        },
        {
          title: "Find the left bower",
          prompt: "Hearts are still trump. Which card is the second-highest trump?",
          contextLabel: "Trump suit",
          table: [{ label: "♥", trump: true, note: "trump" }],
          choices: [
            { label: "J♦", correct: true },
            { label: "A♥", correct: false, hint: "The ace comes after both bowers." },
            { label: "K♥", correct: false, hint: "The king is strong, but the left bower ranks above it." }
          ],
          success: "Left bower found! The jack of the same-color suit joins trump and ranks second."
        }
      ]
    }
  };

  const panel = document.querySelector("#tutorial-panel");
  const tabs = [...document.querySelectorAll(".tour-tab")];
  const scoreText = document.querySelector("#score-text");
  if (!panel || !tabs.length || !scoreText) return;

  const state = { game: "palace", round: 0, completed: new Set() };
  const params = new URLSearchParams(window.location.search);
  const requested = params.get("game");
  if (requested && games[requested]) state.game = requested;

  const isRed = (label) => /[♥♦]/.test(label);
  const cardMarkup = (card, index) => {
    const data = typeof card === "string" ? { label: card } : card;
    const classes = ["card-face", isRed(data.label) ? "red" : "", data.trump ? "trump" : ""].filter(Boolean).join(" ");
    const tilt = `${(index - 1) * 3}deg`;
    return `<span class="${classes}" style="--tilt:${tilt}" aria-label="${data.label}${data.note ? `, ${data.note}` : ""}">${data.label}${data.note ? `<small>${data.note}</small>` : ""}</span>`;
  };

  const updateTabs = () => {
    tabs.forEach((tab) => {
      const game = tab.dataset.game;
      const selected = game === state.game;
      tab.setAttribute("aria-selected", String(selected));
      tab.tabIndex = selected ? 0 : -1;
      tab.style.setProperty("--game-color", games[game].color);
      const oldDone = tab.querySelector(".done");
      if (oldDone) oldDone.remove();
      if (state.completed.has(game)) tab.insertAdjacentHTML("beforeend", '<span class="done" aria-label="complete">✓</span>');
    });
    const count = state.completed.size;
    scoreText.textContent = `${count} of 4 tables complete`;
  };

  const roundDots = (game) => game.rounds.map((_, index) => `<span class="round-dot ${index < state.round ? "done" : index === state.round ? "active" : ""}" aria-hidden="true"></span>`).join("");

  const renderRound = () => {
    const game = games[state.game];
    const round = game.rounds[state.round];
    panel.style.setProperty("--game-color", game.color);
    panel.innerHTML = `
      <div class="lesson-layout">
        <aside class="lesson-info">
          <img class="lesson-icon" src="${game.icon}" alt="${game.name} artwork" width="512" height="512">
          <div><p class="lesson-kicker">${game.name} · Lesson ${state.round + 1} of ${game.rounds.length}</p><h2>${round.title}</h2></div>
          <p>${game.intro}</p>
          <div class="round-dots" aria-label="Lesson ${state.round + 1} of ${game.rounds.length}">${roundDots(game)}</div>
        </aside>
        <div class="lesson-board">
          <div class="lesson-prompt"><h3>${round.prompt}</h3><p>Choose a card. If you miss, you will get a friendly hint.</p></div>
          <div class="table-cards"><span class="table-label">${round.contextLabel}</span>${round.table.map(cardMarkup).join("")}</div>
          <p class="choice-label">Your choice</p>
          <div class="choice-grid">${round.choices.map((choice, index) => `<button class="choice-card ${isRed(choice.label) ? "red" : ""}" type="button" data-choice="${index}" aria-label="Play ${choice.label}">${choice.label}</button>`).join("")}</div>
          <div class="feedback" id="lesson-feedback" role="status" aria-live="polite"><span>Pick the card that best fits the lesson.</span></div>
        </div>
      </div>`;
    panel.querySelectorAll(".choice-card").forEach((button) => button.addEventListener("click", () => chooseCard(button)));
  };

  const chooseCard = (button) => {
    const game = games[state.game];
    const round = game.rounds[state.round];
    const choice = round.choices[Number(button.dataset.choice)];
    const feedback = panel.querySelector("#lesson-feedback");
    if (!choice.correct) {
      button.classList.add("wrong");
      button.setAttribute("aria-pressed", "false");
      feedback.className = "feedback";
      feedback.innerHTML = `<span><strong>Good try.</strong> ${choice.hint}</span>`;
      window.setTimeout(() => button.classList.remove("wrong"), 400);
      return;
    }

    panel.querySelectorAll(".choice-card").forEach((card) => { card.disabled = true; });
    button.classList.add("correct");
    button.setAttribute("aria-pressed", "true");
    const lastRound = state.round === game.rounds.length - 1;
    feedback.className = "feedback good";
    feedback.innerHTML = `<span><strong>That works!</strong> ${round.success}</span><button class="next-button" type="button">${lastRound ? "Collect this heart" : "Next lesson"}</button>`;
    feedback.querySelector(".next-button").addEventListener("click", () => {
      if (lastRound) completeGame();
      else { state.round += 1; renderRound(); panel.focus(); }
    });
  };

  const nextUnfinished = () => gameOrder.find((game) => !state.completed.has(game));

  const completeGame = () => {
    state.completed.add(state.game);
    updateTabs();
    const game = games[state.game];
    const next = nextUnfinished();
    panel.innerHTML = `<div class="tour-complete"><div class="tour-complete-inner"><span class="big-heart" aria-hidden="true">♥</span><p class="lesson-kicker">${game.name} table complete</p><h2>You collected a heart!</h2><div class="celebration-sparks" aria-hidden="true"><span></span><span></span><span></span><span></span></div><p>You just learned two real ideas from ${game.name}. ${next ? `Three cheers—and another table is waiting.` : `You have visited the whole Four of Hearts family.`}</p><div class="actions" style="justify-content:center"><button class="next-button" id="continue-tour" type="button">${next ? `Visit ${games[next].name}` : "See my table legend"}</button><button class="next-button" id="replay-game" type="button">Replay ${game.name}</button></div></div></div>`;
    panel.querySelector("#continue-tour").addEventListener("click", () => {
      if (next) setGame(next, true);
      else renderTourComplete();
    });
    panel.querySelector("#replay-game").addEventListener("click", () => { state.round = 0; renderRound(); panel.focus(); });
  };

  const renderTourComplete = () => {
    panel.innerHTML = `<div class="tour-complete"><div class="tour-complete-inner"><span class="big-heart" aria-hidden="true">4♥</span><p class="lesson-kicker">Four-table tour complete</p><h2>You are a table legend.</h2><div class="celebration-sparks" aria-hidden="true"><span></span><span></span><span></span><span></span></div><p>You climbed in Palace, followed suit in Hearts, played trump in Spades, and found the bowers in Euchre. That is a fine first hand.</p><div class="actions" style="justify-content:center"><button class="next-button" id="reset-tour" type="button">Play the tour again</button><a class="button light" href="games.html">Meet the games</a></div></div></div>`;
    panel.querySelector("#reset-tour").addEventListener("click", () => { state.completed.clear(); setGame("palace", true); });
  };

  const setGame = (game, moveFocus = false) => {
    state.game = game;
    state.round = 0;
    updateTabs();
    if (state.completed.has(game)) completeGame();
    else renderRound();
    history.replaceState(null, "", `?game=${game}`);
    if (moveFocus) panel.focus();
  };

  tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => setGame(tab.dataset.game));
    tab.addEventListener("keydown", (event) => {
      if (!["ArrowRight", "ArrowLeft", "Home", "End"].includes(event.key)) return;
      event.preventDefault();
      let nextIndex = index;
      if (event.key === "ArrowRight") nextIndex = (index + 1) % tabs.length;
      if (event.key === "ArrowLeft") nextIndex = (index - 1 + tabs.length) % tabs.length;
      if (event.key === "Home") nextIndex = 0;
      if (event.key === "End") nextIndex = tabs.length - 1;
      tabs[nextIndex].focus();
      setGame(tabs[nextIndex].dataset.game);
    });
  });

  updateTabs();
  renderRound();
})();