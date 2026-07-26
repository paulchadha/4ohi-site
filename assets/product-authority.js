(() => {
  "use strict";

  const localeCatalog = Object.freeze({
    en: {
      label: "English", dir: "ltr", tableLabel: "This table calls it", languageLabel: "Language",
      templates: {
        playGame: (n) => `Play ${n}`, gameNews: (n) => `${n} News`,
        gameRules: (n) => `${n} Rules`, gameHistory: (n) => `${n} History`,
        gameCountdown: (n) => `${n} lands in`, discoverGame: (n) => `Discover ${n}`,
        aboutGame: (n) => `About ${n}`, latestFromGame: (n) => `The latest from ${n}`,
        whyBuildingGame: (n) => `Why We’re Building ${n}`, tutorialTitle: (n) => `${n} Mini-Match`,
        flagship: (n) => `${n} gets the crown.`, supportGame: (n) => `${n} support`,
        status: (n) => `This table calls it ${n}. Nothing is stored.`
      }
    },
    fr: {
      label: "Français", dir: "ltr", tableLabel: "À cette table", languageLabel: "Langue",
      templates: {
        playGame: (n) => `Jouer à ${n}`, gameNews: (n) => `Actualités ${n}`,
        gameRules: (n) => `Règles de ${n}`, gameHistory: (n) => `Histoire de ${n}`,
        gameCountdown: (n) => `${n} arrive dans`, discoverGame: (n) => `Découvrir ${n}`,
        aboutGame: (n) => `À propos de ${n}`, latestFromGame: (n) => `Les nouvelles de ${n}`,
        whyBuildingGame: (n) => `Pourquoi nous créons ${n}`, tutorialTitle: (n) => `Mini-partie ${n}`,
        flagship: (n) => `${n} porte la couronne.`, supportGame: (n) => `Assistance ${n}`,
        status: (n) => `À cette table, le jeu s’appelle ${n}. Rien n’est enregistré.`
      }
    },
    es: {
      label: "Español", dir: "ltr", tableLabel: "En esta mesa", languageLabel: "Idioma",
      templates: {
        playGame: (n) => `Jugar a ${n}`, gameNews: (n) => `Noticias de ${n}`,
        gameRules: (n) => `Reglas de ${n}`, gameHistory: (n) => `Historia de ${n}`,
        gameCountdown: (n) => `${n} llega en`, discoverGame: (n) => `Descubre ${n}`,
        aboutGame: (n) => `Acerca de ${n}`, latestFromGame: (n) => `Lo último de ${n}`,
        whyBuildingGame: (n) => `Por qué estamos creando ${n}`, tutorialTitle: (n) => `Minipartida de ${n}`,
        flagship: (n) => `${n} lleva la corona.`, supportGame: (n) => `Soporte de ${n}`,
        status: (n) => `En esta mesa se llama ${n}. No guardamos nada.`
      }
    },
    hi: {
      label: "हिन्दी", dir: "ltr", tableLabel: "इस मेज़ पर नाम", languageLabel: "भाषा",
      templates: {
        playGame: (n) => `${n} खेलें`, gameNews: (n) => `${n} समाचार`,
        gameRules: (n) => `${n} के नियम`, gameHistory: (n) => `${n} का इतिहास`,
        gameCountdown: (n) => `${n} आने में`, discoverGame: (n) => `${n} जानें`,
        aboutGame: (n) => `${n} के बारे में`, latestFromGame: (n) => `${n} की ताज़ा खबर`,
        whyBuildingGame: (n) => `हम ${n} क्यों बना रहे हैं`, tutorialTitle: (n) => `${n} मिनी-मैच`,
        flagship: (n) => `ताज ${n} का है।`, supportGame: (n) => `${n} सहायता`,
        status: (n) => `इस मेज़ पर इसे ${n} कहते हैं। कुछ भी सहेजा नहीं जाता।`
      }
    },
    "zh-Hans": {
      label: "简体中文", dir: "ltr", tableLabel: "本桌称它为", languageLabel: "语言",
      templates: {
        playGame: (n) => `试玩 ${n}`, gameNews: (n) => `${n} 新闻`,
        gameRules: (n) => `${n} 规则`, gameHistory: (n) => `${n} 历史`,
        gameCountdown: (n) => `${n} 上线倒计时`, discoverGame: (n) => `了解 ${n}`,
        aboutGame: (n) => `关于 ${n}`, latestFromGame: (n) => `${n} 最新消息`,
        whyBuildingGame: (n) => `我们为什么打造 ${n}`, tutorialTitle: (n) => `${n} 迷你对局`,
        flagship: (n) => `${n} 戴上王冠。`, supportGame: (n) => `${n} 支持`,
        status: (n) => `本桌称它为 ${n}。不会保存任何选择。`
      }
    },
    he: {
      label: "עברית", dir: "rtl", tableLabel: "בשולחן הזה", languageLabel: "שפה",
      templates: {
        playGame: (n) => `לשחק ${n}`, gameNews: (n) => `חדשות ${n}`,
        gameRules: (n) => `החוקים של ${n}`, gameHistory: (n) => `הסיפור של ${n}`,
        gameCountdown: (n) => `${n} מגיע בעוד`, discoverGame: (n) => `לגלות את ${n}`,
        aboutGame: (n) => `על ${n}`, latestFromGame: (n) => `החדש מ־${n}`,
        whyBuildingGame: (n) => `למה אנחנו בונים את ${n}`, tutorialTitle: (n) => `מיני־משחק ${n}`,
        flagship: (n) => `${n} מקבל את הכתר.`, supportGame: (n) => `תמיכה ב־${n}`,
        status: (n) => `בשולחן הזה קוראים למשחק ${n}. שום דבר לא נשמר.`
      }
    },
    ar: {
      label: "العربية", dir: "rtl", tableLabel: "نسميها على هذه الطاولة", languageLabel: "اللغة",
      templates: {
        playGame: (n) => `العب ${n}`, gameNews: (n) => `أخبار ${n}`,
        gameRules: (n) => `قواعد ${n}`, gameHistory: (n) => `تاريخ ${n}`,
        gameCountdown: (n) => `يصل ${n} خلال`, discoverGame: (n) => `اكتشف ${n}`,
        aboutGame: (n) => `عن ${n}`, latestFromGame: (n) => `آخر أخبار ${n}`,
        whyBuildingGame: (n) => `لماذا نبني ${n}`, tutorialTitle: (n) => `مباراة ${n} المصغرة`,
        flagship: (n) => `${n} يحمل التاج.`, supportGame: (n) => `دعم ${n}`,
        status: (n) => `نسمي اللعبة ${n} على هذه الطاولة. لا يتم حفظ أي شيء.`
      }
    },
    "en-CA-fun": {
      label: "Canadian — Just for Fun", dir: "ltr", tableLabel: "This table calls it", languageLabel: "Language, eh?",
      templates: {
        playGame: (n) => `Give ${n} a go`, gameNews: (n) => `${n} News, eh?`,
        gameRules: (n) => `${n} Rules`, gameHistory: (n) => `${n}’s table stories`,
        gameCountdown: (n) => `${n} lands in`, discoverGame: (n) => `Meet ${n}, bud`,
        aboutGame: (n) => `About ${n}`, latestFromGame: (n) => `Fresh from ${n}`,
        whyBuildingGame: (n) => `Why We’re Building ${n}`, tutorialTitle: (n) => `${n} Mini-Match`,
        flagship: (n) => `${n} gets the crown. Beauty.`, supportGame: (n) => `${n} help, please`,
        status: (n) => `This table calls it ${n}. No storage—sorry, eh?`
      }
    }
  });

  const allowedModes = new Set(["palace", "shed", "shithead"]);
  const url = new URL(location.href);
  let locale = localeCatalog[url.searchParams.get("lang")] ? url.searchParams.get("lang") : "en";
  let mode = allowedModes.has(url.searchParams.get("game")) ? url.searchParams.get("game") : "palace";
  const canonicalName = "Palace";
  const modeName = () => ({ palace: "Palace", shed: "Shed", shithead: "Shithead" })[mode];

  const resolve = () => {
    const name = modeName();
    const templates = localeCatalog[locale].templates;
    return Object.freeze({
      mode, locale, canonicalName,
      gameName: name,
      gameNameUpper: name.toLocaleUpperCase(locale === "en-CA-fun" ? "en-CA" : locale),
      gameNameLower: name.toLocaleLowerCase(locale === "en-CA-fun" ? "en-CA" : locale),
      gameNamePossessive: locale.startsWith("en") ? `${name}’s` : templates.aboutGame(name),
      playGameLabel: templates.playGame(name),
      aboutGameLabel: templates.aboutGame(name),
      gameHistoryLabel: templates.gameHistory(name),
      gameRulesLabel: templates.gameRules(name),
      message: (key) => templates[key]?.(name) ?? name
    });
  };

  const setUrlState = (nextMode, replace = false) => {
    const next = new URL(location.href);
    if (nextMode === "palace") next.searchParams.delete("game");
    else next.searchParams.set("game", nextMode);
    next.searchParams.set("lang", locale);
    history[replace ? "replaceState" : "pushState"]({}, "", `${next.pathname}${next.search}${next.hash}`);
  };

  const updateLinks = () => {
    document.querySelectorAll("a[href]").forEach((link) => {
      const raw = link.getAttribute("href");
      if (!raw || raw.startsWith("#") || raw.startsWith("mailto:") || raw.startsWith("tel:") || /^https?:/i.test(raw)) return;
      const next = new URL(raw, location.href);
      next.searchParams.set("lang", locale);
      if (mode === "palace") next.searchParams.delete("game"); else next.searchParams.set("game", mode);
      link.href = `${next.pathname.split("/").pop() || "index.html"}${next.search}${next.hash}`;
    });
  };

  const render = ({ announce = false } = {}) => {
    const state = resolve();
    document.documentElement.lang = locale;
    document.documentElement.dir = localeCatalog[locale].dir;
    document.documentElement.dataset.gameMode = mode;
    document.documentElement.dataset.locale = locale;
    document.querySelectorAll("[data-game-token]").forEach((node) => {
      const key = node.dataset.gameToken;
      node.textContent = state[key] ?? state.gameName;
    });
    document.querySelectorAll("[data-game-message]").forEach((node) => {
      node.textContent = state.message(node.dataset.gameMessage);
    });
    document.querySelectorAll("[data-current-game]").forEach((node) => { node.textContent = state.gameName; });
    document.querySelectorAll("[data-table-label]").forEach((node) => { node.textContent = localeCatalog[locale].tableLabel; });
    document.querySelectorAll("[data-language-label]").forEach((node) => { node.textContent = localeCatalog[locale].languageLabel; });
    document.querySelectorAll("[data-name-choice]").forEach((button) => {
      button.setAttribute("aria-pressed", String(button.dataset.nameChoice.toLowerCase() === mode));
    });
    document.querySelectorAll("[data-name-status]").forEach((node) => {
      node.textContent = localeCatalog[locale].templates.status(state.gameName);
    });
    document.querySelectorAll("[data-locale]").forEach((select) => { select.value = locale; });
    document.querySelectorAll("[data-dynamic-game-alt]").forEach((image) => {
      image.alt = image.dataset.dynamicGameAlt.replace("{{GAME_NAME}}", state.gameName);
    });
    const fixedTitle = document.querySelector('meta[property="og:title"]')?.content || document.title;
    if (mode !== "shithead") document.title = fixedTitle.replace(/\bPalace\b/g, state.gameName);
    updateLinks();
    if (announce) {
      document.querySelector("[data-global-name-status]")?.replaceChildren(document.createTextNode(localeCatalog[locale].templates.status(state.gameName)));
      document.dispatchEvent(new CustomEvent("fourOfHearts:gameNameChanged", { detail: state }));
    }
  };

  const populateLocales = () => {
    document.querySelectorAll("[data-locale]").forEach((select) => {
      select.replaceChildren(...Object.entries(localeCatalog).map(([key, item]) => {
        const option = document.createElement("option");
        option.value = key; option.textContent = item.label; option.selected = key === locale;
        return option;
      }));
    });
  };

  let shedTaps = [];
  const nsfw = document.querySelector("[data-nsfw-dialog]");
  document.addEventListener("click", (event) => {
    const choice = event.target.closest("[data-name-choice]");
    if (choice) {
      const requested = choice.dataset.nameChoice.toLowerCase();
      mode = requested;
      setUrlState(mode);
      render({ announce: true });
      if (requested !== "shed") { shedTaps = []; return; }
      const now = performance.now();
      shedTaps = [...shedTaps.filter((stamp) => now - stamp <= 4000), now];
      if (shedTaps.length === 10) { shedTaps = []; nsfw?.showModal(); }
      return;
    }
    if (event.target.closest("[data-open-settings]")) document.querySelector("[data-settings-dialog]")?.showModal();
  });
  document.addEventListener("change", (event) => {
    if (!event.target.matches("[data-locale]")) return;
    const nextLocale = event.target.value;
    if (!localeCatalog[nextLocale]) return;
    const next = new URL(location.href);
    next.searchParams.set("lang", nextLocale);
    if (mode === "palace") next.searchParams.delete("game"); else next.searchParams.set("game", mode);
    location.assign(next);
  });
  nsfw?.addEventListener("close", () => {
    mode = nsfw.returnValue === "yes" ? "shithead" : "shed";
    setUrlState(mode);
    render({ announce: true });
  });
  addEventListener("popstate", () => {
    const current = new URL(location.href);
    mode = allowedModes.has(current.searchParams.get("game")) ? current.searchParams.get("game") : "palace";
    render({ announce: true });
  });

  populateLocales();
  render();
  window.FOUR_HEARTS_PRODUCT = Object.freeze({
    get state() { return resolve(); },
    locales: localeCatalog,
    render
  });
  window.PALACE_EXPERIENCE = Object.freeze({
    get locale() { return locale; },
    get t() { return { launch: resolve().message("gameCountdown"), rival: "RIVAL", pile: "TOP OF PILE", hand: "YOUR HAND", match: "MATCH OR BEAT", prompt: "Match the rank, play higher, or use a power card.", pickup: "PICK UP", replay: "Replay mini-match", won: `YOU RULE ${resolve().gameNameUpper}`, levelHand: "HAND", levelUp: "FACE-UP", levelDown: "FACE-DOWN" }; },
    get game() { return mode; },
    displayName: () => resolve().gameName,
    applyGame: render
  });
})();
