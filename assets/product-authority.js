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
    "en-CA": {
      label: "Canadian", dir: "ltr", tableLabel: "This table calls it", languageLabel: "Language",
      templates: {
        playGame: (n) => `Give ${n} a go, eh?`, gameNews: (n) => `${n} News from the table`,
        gameRules: (n) => `${n} Rules`, gameHistory: (n) => `${n}'s table stories`,
        gameCountdown: (n) => `${n} opens soon. Sorry for the wait.`, discoverGame: (n) => `Meet ${n}, bud`,
        aboutGame: (n) => `About ${n}`, latestFromGame: (n) => `Fresh from the ${n} table`,
        whyBuildingGame: (n) => `Why We're Building ${n}`, tutorialTitle: (n) => `${n} Mini-Match`,
        flagship: (n) => `${n} gets the crown. Beauty.`, supportGame: (n) => `${n} help, please`,
        status: (n) => `This table calls it ${n}. Nothing is stored. Very polite.`
      },
      brand: {
        navNews: "Table Talk", navGames: "More Games", navAbout: "Our Family", navSupport: "Help, Please",
        heroKicker: "The hottest card game in the galaxy, now dressed for a long winter",
        heroDeck: (n) => `Three levels. One pile. One crown. ${n} is finally becoming an app - worth waiting through at least one snow day.`,
        heroStatus: "News from the table, with fewer weather warnings than expected",
        powerIntro: "Four cards change everything. The ten clears the pile very responsibly.",
        newsIntro: "News from the table. Some of it is even useful, bud.",
        gamesIntro: (n) => `${n} gets the crown. Hearts, Spades, and Euchre brought snacks.`,
        aboutIntro: "Four of Hearts became 4OH when somebody said it out loud. The name stuck.",
        supportIntro: "Something broke? Blame the dealer politely for thirty seconds, then tell us.",
        notFound: "This card fell under the table. We checked near the toque.",
        footer: "Built for long winters, warm tables, and one more game."
      }
    }
  });

  const allowedModes = new Set(["palace", "shed", "shithead"]);
  const url = new URL(location.href);
  let locale = localeCatalog[url.searchParams.get("lang")] ? url.searchParams.get("lang") : "en";
  const palaceContext = Boolean(document.querySelector("[data-palace-context]"));
  let mode = palaceContext && allowedModes.has(url.searchParams.get("game")) ? url.searchParams.get("game") : "palace";
  if (!palaceContext && url.searchParams.has("game")) {
    url.searchParams.delete("game");
    history.replaceState({}, "", `${url.pathname}${url.search}${url.hash}`);
  }
  const versionedAsset = (path) => window.FOUR_HEARTS_ASSETS?.[path] || path;
  const artByMode = Object.freeze({
    palace: Object.freeze({ small: versionedAsset("assets/palace-hero-384.webp"), medium: versionedAsset("assets/palace-hero-640.webp"), large: versionedAsset("assets/palace-hero-1024.webp") }),
    shed: Object.freeze({ small: versionedAsset("assets/shed-identity-384.webp"), medium: versionedAsset("assets/shed-identity-640.webp"), large: versionedAsset("assets/shed-identity-1024.webp") }),
    shithead: Object.freeze({ small: versionedAsset("assets/shithead-identity-384.webp"), medium: versionedAsset("assets/shithead-identity-640.webp"), large: versionedAsset("assets/shithead-identity-1024.webp") })
  });
  const canonicalName = "Palace";
  const modeName = () => ({ palace: "Palace", shed: "Shed", shithead: "Shithead" })[mode];

  const resolve = () => {
    const name = modeName();
    const templates = localeCatalog[locale].templates;
    return Object.freeze({
      mode, locale, canonicalName,
      gameName: name,
      gameNameUpper: name.toLocaleUpperCase(locale === "en-CA" ? "en-CA" : locale),
      gameNameLower: name.toLocaleLowerCase(locale === "en-CA" ? "en-CA" : locale),
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
    if (!palaceContext || nextMode === "palace") next.searchParams.delete("game");
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
      const palaceRoute = /^(palace(?:-play|-story|-faq)?\.html)$/.test(next.pathname.split("/").pop() || "index.html");
      if (!palaceContext || !palaceRoute || mode === "palace") next.searchParams.delete("game"); else next.searchParams.set("game", mode);
      link.href = `${next.pathname}${next.search}${next.hash}`;
    });
  };

  const render = ({ announce = false } = {}) => {
    const state = resolve();
    document.documentElement.lang = locale;
    document.documentElement.dir = localeCatalog[locale].dir;
    document.documentElement.dataset.gameMode = mode;
    document.documentElement.dataset.locale = locale;
    const art = artByMode[mode];
    document.documentElement.style.setProperty("--active-game-art", `url("../${art.large}")`);
    if (palaceContext) document.querySelectorAll("img[data-game-art], img[src*='icon-palace-4hearts'], img[src*='palace-hero-']").forEach((image) => {
      image.src = art.large;
      image.srcset = `${art.small} 384w, ${art.medium} 640w, ${art.large} 1024w`;
      image.sizes = image.closest(".palace-world-art") ? "(max-width: 600px) 300px, min(61vw, 780px)" : "(max-width: 600px) 90vw, 512px";
      image.alt = `${state.gameName} game artwork from Four of Hearts Interactive`;
      image.dataset.gameArt = mode;
    });
    if (palaceContext) document.querySelectorAll(".palace-world-art source").forEach((source) => {
      source.srcset = source.media.includes("520") ? art.small : art.medium;
    });
    document.querySelectorAll("[data-brand-message]").forEach((node) => {
      if (!node.dataset.brandDefault) node.dataset.brandDefault = node.textContent.trim();
      const copy = localeCatalog[locale].brand?.[node.dataset.brandMessage];
      node.textContent = typeof copy === "function" ? copy(state.gameName) : (copy || node.dataset.brandDefault);
    });
    if (palaceContext) document.querySelectorAll("[data-game-token]").forEach((node) => {
      const key = node.dataset.gameToken;
      node.textContent = state[key] ?? state.gameName;
    });
    if (palaceContext) document.querySelectorAll("[data-game-message]").forEach((node) => {
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
    if (palaceContext && mode !== "shithead") document.title = fixedTitle.replace(/\bPalace\b/g, state.gameName);
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
    if (!palaceContext || mode === "palace") next.searchParams.delete("game"); else next.searchParams.set("game", mode);
    location.assign(next);
  });
  nsfw?.addEventListener("close", () => {
    mode = nsfw.returnValue === "yes" ? "shithead" : "shed";
    setUrlState(mode);
    render({ announce: true });
  });
  addEventListener("popstate", () => {
    const current = new URL(location.href);
    mode = palaceContext && allowedModes.has(current.searchParams.get("game")) ? current.searchParams.get("game") : "palace";
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
    get t() { return { launch: resolve().message("gameCountdown"), rival: "RIVAL", pile: "TOP OF PILE", hand: "YOUR HAND", match: "MATCH OR BEAT", prompt: locale === "en-CA" ? "Match the rank, play higher, or use a power card, bud." : "Match the rank, play higher, or use a power card.", pickup: locale === "en-CA" ? "PICK IT UP. SORRY." : "PICK UP", replay: locale === "en-CA" ? "One more hand, eh?" : "Replay mini-match", won: locale === "en-CA" ? `BEAUTY. YOU RULE ${resolve().gameNameUpper}` : `YOU RULE ${resolve().gameNameUpper}`, levelHand: "HAND", levelUp: "FACE-UP", levelDown: "FACE-DOWN" }; },
    get game() { return mode; },
    displayName: () => resolve().gameName,
    applyGame: render
  });
})();
