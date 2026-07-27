(() => {
  "use strict";

  const mount = document.querySelector("[data-secondary-tutorial]");
  if (!mount) return;

  const canadian = document.documentElement.dataset.locale === "en-CA-fun";
  const lessons = {
    hearts: {
      name: "Hearts",
      status: "HEARTS BROKEN · POINTS 3 · TRICKS 2",
      intro: "Follow the suit that was led when you can, then learn to duck a point-heavy trick.",
      rounds: [
        {
          title: "Follow suit",
          prompt: "Clubs were led, and you hold one club. Which card must you play?",
          pile: ["8♣"],
          choices: [
            { label: "4♣", correct: true, success: "You followed clubs. That keeps the trick fair and readable." },
            { label: "A♥", correct: false, hint: "You still hold a club, so you must follow clubs." },
            { label: "Q♠", correct: false, hint: "Save the queen. Clubs were led." }
          ]
        },
        {
          title: "Duck the points",
          prompt: "Hearts were led and the trick is point-heavy. Choose the safest heart.",
          pile: ["5♥", "9♥", "K♥"],
          choices: [
            { label: "2♥", correct: true, success: "Perfect duck. You followed suit without taking the points." },
            { label: "A♥", correct: false, hint: "The ace would take the whole point-heavy trick." },
            { label: "7♣", correct: false, hint: "You have a heart, so you must follow hearts." }
          ]
        }
      ]
    },
    spades: {
      name: "Spades",
      status: "BID 4 · BOOKS 2 · BAGS 1",
      intro: "Every spade is trump. A small spade can beat a high card from another suit.",
      rounds: [
        {
          title: "Trump the trick",
          prompt: "A heart was led, but you have no hearts. Which card beats the king?",
          pile: ["K♥"],
          choices: [
            { label: "4♠", correct: true, success: "Trumped. Even a small spade beats a non-spade here." },
            { label: "A♣", correct: false, hint: "The ace is high, but clubs are not trump." },
            { label: "K♦", correct: false, hint: "Matching the rank does not beat the suit that was led." }
          ]
        },
        {
          title: "Climb in trump",
          prompt: "A spade was led. Which card can beat the nine of spades?",
          pile: ["9♠"],
          choices: [
            { label: "Q♠", correct: true, success: "Right. Follow trump and climb when the trick calls for it." },
            { label: "A♥", correct: false, hint: "Spades were led. A heart cannot beat a spade." },
            { label: "K♣", correct: false, hint: "The king is high, but it is not a spade." }
          ]
        }
      ]
    },
    euchre: {
      name: "Euchre",
      status: "TRUMP ♥ · MAKER YOU · DEALER MAYA",
      intro: "The two jacks around trump become the right and left bowers.",
      rounds: [
        {
          title: "Meet the right bower",
          prompt: "Hearts are trump. Which card is the strongest trump?",
          pile: ["♥ trump"],
          choices: [
            { label: "J♥", correct: true, success: "Right bower. The jack of trump is the strongest card." },
            { label: "J♦", correct: false, hint: "Close. That is the left bower and second-highest trump." },
            { label: "A♥", correct: false, hint: "The ace follows both bowers." }
          ]
        },
        {
          title: "Find the left bower",
          prompt: "Hearts are still trump. Which card is the second-highest trump?",
          pile: ["♥ trump"],
          choices: [
            { label: "J♦", correct: true, success: "Left bower found. The same-color jack joins trump." },
            { label: "A♥", correct: false, hint: "The ace comes after both bowers." },
            { label: "K♥", correct: false, hint: "The king is strong, but the left bower ranks above it." }
          ]
        }
      ]
    }
  };

  const gameKey = mount.dataset.secondaryTutorial;
  const game = lessons[gameKey];
  if (!game) return;
  const tableDetails = {
    hearts: { seats: ["Nora · 1/13", "Maya · 3/13", "Vaughn · 0/13", "You · 2/13"], chips: ["4 SEATS", "HEARTS BROKEN", "Q? STILL OUT", "POINTS 3"], center: "CURRENT TRICK", decision: "YOUR HAND · AVOID THE POINTS" },
    spades: { seats: ["Nora · Them", "Maya · Us", "Vaughn · Them", "You · Us"], chips: ["PARTNERSHIPS", "CONTRACT 4", "BOOKS 2", "BAGS 1", "NIL AVAILABLE"], center: "CURRENT TRICK", decision: "YOUR HAND · MAKE THE CONTRACT" },
    euchre: { seats: ["Nora · Them", "Maya · Dealer", "Vaughn · Them", "You · Maker"], chips: ["PARTNERSHIPS", "DEALER MAYA", "UPCARD 9?", "TRUMP HEARTS", "MAKER YOU"], center: "UPCARD / CURRENT TRICK", decision: "YOUR HAND · ORDER UP OR PLAY" }
  };
  const table = tableDetails[gameKey];
  let round = 0;

  const red = (label) => /[♥♦]/.test(label);
  const card = (label, index, button = true) => {
    const classes = `playing-card${red(label) ? " red" : ""}`;
    if (!button) return `<span class="${classes}" aria-label="${label}">${label}</span>`;
    return `<button class="${classes}" type="button" data-choice="${index}" aria-label="Play ${label}">${label}</button>`;
  };

  const renderRound = () => {
    const data = game.rounds[round];
    mount.innerHTML = `
      <div class="tutorial-head">
        <span class="alpha-badge">Internal Alpha lesson</span>
        <span class="tutorial-progress">Lesson ${round + 1} of ${game.rounds.length}</span>
      </div>
      <div class="table-hud"><strong class="game-badge">${game.name}</strong><span class="table-score">${game.status}</span></div>
      <div class="table-avatars" aria-label="Four teaching-table seats">${table.seats.map((seat, index) => index === 3 ? `<strong>${seat}</strong>` : `<span>${seat}</span>`).join("")}</div>
      <div class="game-specific-status" aria-label="${game.name} table status">${table.chips.map((chip) => `<span>${chip}</span>`).join("")}</div>
      <div class="tutorial-board">
        <div class="tutorial-copy">
          <p class="eyebrow">${game.name} quick play</p>
          <h2>${data.title}</h2>
          <p>${canadian ? `${data.prompt} Take your time, bud.` : data.prompt}</p>
        </div>
        <div class="play-area">
          <div class="player-zone table-decision"><span class="zone-label">${table.decision}</span><div class="card-row">${data.choices.map((choice, index) => card(choice.label, index)).join("")}</div></div>
          <div class="pile-zone table-trick"><span class="zone-label">${table.center}</span><div class="card-row">${data.pile.map((label) => card(label, 0, false)).join("")}</div></div>
        </div>
        <div class="tutorial-feedback" role="status" aria-live="polite">${canadian ? `${game.intro} One more hand, eh?` : game.intro}</div>
        <div class="tutorial-controls"><button class="button" type="button" data-next disabled>${round + 1 === game.rounds.length ? "Finish lesson" : "Next lesson"}</button></div>
      </div>`;

    mount.querySelectorAll("[data-choice]").forEach((button) => {
      button.addEventListener("click", () => choose(button));
    });
    mount.querySelector("[data-next]").addEventListener("click", next);
  };

  const choose = (button) => {
    const choice = game.rounds[round].choices[Number(button.dataset.choice)];
    const feedback = mount.querySelector(".tutorial-feedback");
    if (!choice.correct) {
      button.classList.add("wrong");
      feedback.textContent = `Good try. ${choice.hint}`;
      window.setTimeout(() => button.classList.remove("wrong"), 380);
      return;
    }
    mount.querySelectorAll("[data-choice]").forEach((item) => { item.disabled = true; });
    button.classList.add("correct", "played");
    feedback.innerHTML = `<strong>${choice.success}</strong>`;
    mount.querySelector("[data-next]").disabled = false;
  };

  const next = () => {
    if (round + 1 < game.rounds.length) {
      round += 1;
      renderRound();
      mount.focus({ preventScroll: true });
      return;
    }
    mount.innerHTML = `
      <div class="tutorial-board">
        <div class="tutorial-copy">
          <span aria-hidden="true" style="display:block;font-size:4.5rem;color:var(--tutorial-accent)">♥</span>
          <p class="eyebrow">${game.name} lesson complete</p>
          <h2>Nice play.</h2>
          <p>You made two real table decisions. The full ${game.name} experience is still in Internal Alpha.</p>
          <div class="tutorial-controls"><button class="button" type="button" data-replay>Play again</button><a class="button secondary" href="games.html">More games</a></div>
        </div>
      </div>`;
    mount.querySelector("[data-replay]").addEventListener("click", () => {
      round = 0;
      renderRound();
      mount.focus({ preventScroll: true });
    });
  };

  renderRound();
})();
