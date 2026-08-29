(() => {
  "use strict";

  const LOCALES = Object.freeze({
    en: { label: "English", dir: "ltr", status: "Founder approved" },
    fr: { label: "Français", dir: "ltr", status: "Machine-assisted · review required" },
    es: { label: "Español", dir: "ltr", status: "Machine-assisted · review required" },
    hi: { label: "हिन्दी", dir: "ltr", status: "Machine-assisted · review required" },
    "zh-Hans": { label: "简体中文", dir: "ltr", status: "Machine-assisted · review required" },
    he: { label: "עברית", dir: "rtl", status: "Machine-assisted · review required" },
    ar: { label: "العربية", dir: "rtl", status: "Machine-assisted · review required" },
    "en-CA-fun": { label: "Canadian fun", dir: "ltr", status: "Founder-approved playful variant" }
  });

  const COPY = Object.freeze({
    en: {
      settings: "Settings", language: "Language", tableName: "Table name", close: "Close",
      palace: "Palace", shed: "Shed", launch: "The gates open in", days: "Days", hours: "Hours", minutes: "Min", seconds: "Sec",
      privacy: "Nothing here is stored. Language and table name travel only in this page’s URL.",
      nsfw: "NOT SAFE FOR WORK", tradition: "The traditional alternate name is “Shithead.”",
      yes: "Yes, use the traditional name", no: "No, keep Shed", changed: "Table name changed to",
      match: "MATCH OR BEAT", pickup: "PICK UP", pile: "TOP OF PILE", hand: "YOUR HAND", rival: "RIVAL",
      prompt: "Match the rank, play higher, or use a power card.", replay: "Replay mini-match",
      won: "YOU RULE THE PALACE", levelHand: "HAND", levelUp: "FACE-UP", levelDown: "FACE-DOWN"
    },
    fr: {
      settings: "Réglages", language: "Langue", tableName: "Nom du jeu", close: "Fermer",
      palace: "Palace", shed: "Shed", launch: "Les portes s’ouvrent dans", days: "Jours", hours: "H", minutes: "Min", seconds: "Sec",
      privacy: "Rien n’est enregistré. La langue et le nom restent uniquement dans l’URL.",
      nsfw: "DÉCONSEILLÉ AU TRAVAIL", tradition: "Le nom alternatif traditionnel est « Shithead ».",
      yes: "Oui, utiliser le nom traditionnel", no: "Non, garder Shed", changed: "Nom du jeu :",
      match: "ÉGALER OU DÉPASSER", pickup: "RAMASSER", pile: "PILE", hand: "VOTRE MAIN", rival: "ADVERSAIRE",
      prompt: "Même valeur, carte plus forte ou carte spéciale.", replay: "Rejouer", won: "VOUS RÉGNEZ SUR LE PALACE",
      levelHand: "MAIN", levelUp: "VISIBLE", levelDown: "CACHÉ"
    },
    es: {
      settings: "Ajustes", language: "Idioma", tableName: "Nombre del juego", close: "Cerrar",
      palace: "Palace", shed: "Shed", launch: "Las puertas se abren en", days: "Días", hours: "H", minutes: "Min", seconds: "Seg",
      privacy: "No se guarda nada. El idioma y el nombre solo viajan en la URL.",
      nsfw: "NO APTO PARA EL TRABAJO", tradition: "El nombre alternativo tradicional es «Shithead».",
      yes: "Sí, usar el nombre tradicional", no: "No, mantener Shed", changed: "Nombre del juego:",
      match: "IGUALA O SUPERA", pickup: "RECOGE", pile: "PILA", hand: "TU MANO", rival: "RIVAL",
      prompt: "Iguala, juega una carta mayor o usa una carta especial.", replay: "Jugar de nuevo", won: "DOMINAS EL PALACE",
      levelHand: "MANO", levelUp: "BOCA ARRIBA", levelDown: "BOCA ABAJO"
    },
    hi: {
      settings: "सेटिंग्स", language: "भाषा", tableName: "खेल का नाम", close: "बंद करें",
      palace: "पैलेस", shed: "शेड", launch: "दरवाज़े खुलने में", days: "दिन", hours: "घंटे", minutes: "मिनट", seconds: "सेकंड",
      privacy: "कुछ भी सहेजा नहीं जाता। भाषा और नाम केवल URL में रहते हैं।",
      nsfw: "काम के लिए सुरक्षित नहीं", tradition: "पारंपरिक वैकल्पिक नाम “Shithead” है।",
      yes: "हाँ, पारंपरिक नाम", no: "नहीं, शेड रखें", changed: "खेल का नाम:",
      match: "बराबर या बड़ा", pickup: "उठाएँ", pile: "ऊपरी पत्ता", hand: "आपके पत्ते", rival: "प्रतिद्वंद्वी",
      prompt: "रैंक मिलाएँ, बड़ा पत्ता चलें या पावर कार्ड खेलें।", replay: "फिर खेलें", won: "पैलेस आपका है",
      levelHand: "हाथ", levelUp: "खुले पत्ते", levelDown: "बंद पत्ते"
    },
    "zh-Hans": {
      settings: "设置", language: "语言", tableName: "游戏名称", close: "关闭",
      palace: "宫殿", shed: "Shed", launch: "城门开启倒计时", days: "天", hours: "时", minutes: "分", seconds: "秒",
      privacy: "本站不存储选择；语言和名称只保留在网址中。",
      nsfw: "不适合工作场合", tradition: "传统别名是“Shithead”。",
      yes: "使用传统名称", no: "保留 Shed", changed: "游戏名称：",
      match: "同点或更高", pickup: "收起牌堆", pile: "牌堆顶部", hand: "你的手牌", rival: "对手",
      prompt: "同点、更高，或打出功能牌。", replay: "再玩一次", won: "你统治了宫殿",
      levelHand: "手牌", levelUp: "明牌", levelDown: "暗牌"
    },
    he: {
      settings: "הגדרות", language: "שפה", tableName: "שם המשחק", close: "סגירה",
      palace: "Palace", shed: "Shed", launch: "השערים נפתחים בעוד", days: "ימים", hours: "שעות", minutes: "דקות", seconds: "שניות",
      privacy: "דבר אינו נשמר. השפה והשם נשארים רק בכתובת העמוד.",
      nsfw: "לא מתאים לעבודה", tradition: "השם החלופי המסורתי הוא “Shithead”.",
      yes: "כן, להשתמש בשם המסורתי", no: "לא, להשאיר Shed", changed: "שם המשחק:",
      match: "להתאים או לעבור", pickup: "לאסוף", pile: "ראש הערימה", hand: "היד שלך", rival: "יריב",
      prompt: "התאימו, שחקו גבוה יותר או השתמשו בקלף כוח.", replay: "לשחק שוב", won: "הארמון בידיכם",
      levelHand: "יד", levelUp: "גלויים", levelDown: "נסתרים"
    },
    ar: {
      settings: "الإعدادات", language: "اللغة", tableName: "اسم اللعبة", close: "إغلاق",
      palace: "القصر", shed: "Shed", launch: "تُفتح البوابات خلال", days: "يوم", hours: "ساعة", minutes: "دقيقة", seconds: "ثانية",
      privacy: "لا يتم حفظ أي شيء. تبقى اللغة والاسم في عنوان الصفحة فقط.",
      nsfw: "غير مناسب للعمل", tradition: "الاسم البديل التقليدي هو “Shithead”.",
      yes: "نعم، استخدم الاسم التقليدي", no: "لا، أبقِ Shed", changed: "اسم اللعبة:",
      match: "طابق أو تجاوز", pickup: "التقط الكومة", pile: "أعلى الكومة", hand: "أوراقك", rival: "المنافس",
      prompt: "طابق الرتبة أو العب أعلى أو استخدم ورقة قوة.", replay: "العب من جديد", won: "أنت تحكم القصر",
      levelHand: "اليد", levelUp: "مكشوف", levelDown: "مخفي"
    },
    "en-CA-fun": {
      settings: "Settings, eh?", language: "Language", tableName: "What d’you call it?", close: "All good",
      palace: "Palace", shed: "Shed", launch: "Give ’er—the gates open in", days: "Days", hours: "Hours", minutes: "Min", seconds: "Sec",
      privacy: "Sorry, eh? Nothing’s stored. These choices just ride along in the URL.",
      nsfw: "NOT SAFE FOR WORK", tradition: "The traditional alternate name is “Shithead.”",
      yes: "Oh yeah, use it", no: "No worries—keep Shed", changed: "At this table:",
      match: "MATCH OR BEAT", pickup: "PICK ’EM UP", pile: "TOP OF PILE", hand: "YOUR HAND", rival: "THE OTHER HOSER",
      prompt: "Match it, beat it, or let a power card rip.", replay: "Give ’er again", won: "BEAUTY. YOU RULE THE PALACE.",
      levelHand: "HAND", levelUp: "FACE-UP", levelDown: "FACE-DOWN"
    }
  });

  const params = new URLSearchParams(location.search);
  const locale = LOCALES[params.get("lang")] ? params.get("lang") : "en";
  const t = COPY[locale];
  let game = ["palace", "shed", "shithead"].includes(params.get("game")) ? params.get("game") : "palace";
  document.documentElement.lang = locale;
  document.documentElement.dir = LOCALES[locale].dir;
  document.documentElement.dataset.locale = locale;

  const displayName = () => game === "shithead" ? "Shithead" : game === "shed" ? t.shed : t.palace;
  const setParams = (next, replace = false) => {
    const url = new URL(location.href);
    Object.entries(next).forEach(([key, value]) => value ? url.searchParams.set(key, value) : url.searchParams.delete(key));
    (replace ? history.replaceState : history.pushState).call(history, {}, "", `${url.pathname}${url.search}${url.hash}`);
    params.set("lang", locale);
  };
  const rewriteLinks = () => {
    document.querySelectorAll("a[href]").forEach((link) => {
      const raw = link.getAttribute("href");
      if (!raw || raw.startsWith("#") || raw.startsWith("mailto:") || raw.startsWith("http")) return;
      const url = new URL(raw, location.href);
      url.searchParams.set("lang", locale);
      if (game !== "palace") url.searchParams.set("game", game); else url.searchParams.delete("game");
      link.href = `${url.pathname}${url.search}${url.hash}`;
    });
  };
  const applyGame = () => {
    document.querySelectorAll("[data-game-name]").forEach((node) => { node.textContent = displayName(); });
    document.querySelectorAll("[data-name-choice]").forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.nameChoice.toLowerCase() === game)));
    const status = document.querySelector("[data-name-status]");
    if (status) status.textContent = `${t.changed} ${displayName()}`;
    rewriteLinks();
  };

  const shell = document.createElement("div");
  shell.innerHTML = `<button class="experience-settings" type="button" aria-haspopup="dialog">${t.settings}</button>
    <dialog class="experience-dialog" data-settings-dialog aria-labelledby="settings-title">
      <form method="dialog"><button class="dialog-close" value="close" aria-label="${t.close}">×</button>
      <p class="eyebrow">4OH TABLE</p><h2 id="settings-title">${t.settings}</h2>
      <label>${t.language}<select data-locale>${Object.entries(LOCALES).map(([key, item]) => `<option value="${key}"${key === locale ? " selected" : ""}>${item.label}</option>`).join("")}</select></label>
      <fieldset><legend>${t.tableName}</legend><div class="name-options">
        <button type="button" data-name-choice="palace" aria-pressed="${game === "palace"}">${t.palace}</button>
        <button type="button" data-name-choice="shed" aria-pressed="${game === "shed"}">${t.shed}</button>
      </div></fieldset><p>${t.privacy}</p><small>${LOCALES[locale].status}</small></form>
    </dialog>
    <dialog class="experience-dialog nsfw-dialog" data-nsfw-dialog aria-labelledby="nsfw-title">
      <form method="dialog"><p class="eyebrow">${t.nsfw}</p><h2 id="nsfw-title">${t.tradition}</h2>
      <div class="dialog-actions"><button class="button" value="yes">${t.yes}</button><button class="button secondary" value="no">${t.no}</button></div></form>
    </dialog>`;
  document.body.append(shell);
  const settings = shell.querySelector("[data-settings-dialog]");
  const nsfw = shell.querySelector("[data-nsfw-dialog]");
  shell.querySelector(".experience-settings").addEventListener("click", () => settings.showModal());
  shell.querySelector("[data-locale]").addEventListener("change", (event) => {
    const url = new URL(location.href);
    url.searchParams.set("lang", event.target.value);
    if (game !== "palace") url.searchParams.set("game", game);
    location.assign(url);
  });
  let shedTaps = [];
  const choose = (requested) => {
    game = requested;
    setParams({ game: game === "palace" ? "" : game });
    applyGame();
  };
  document.addEventListener("click", (event) => {
    const button = event.target.closest("[data-name-choice]");
    if (!button) return;
    const requested = button.dataset.nameChoice.toLowerCase();
    choose(requested);
    if (requested !== "shed") { shedTaps = []; return; }
    const now = performance.now();
    shedTaps = [...shedTaps.filter((stamp) => now - stamp < 4000), now];
    if (shedTaps.length === 10) { shedTaps = []; nsfw.showModal(); }
  });
  nsfw.addEventListener("close", () => choose(nsfw.returnValue === "yes" ? "shithead" : "shed"));

  const target = new Date("2026-10-17T00:00:00-05:00").getTime();
  document.querySelectorAll("[data-release-strip]").forEach((node) => {
    node.innerHTML = `<span>${t.launch}</span><strong data-release-value>-- : -- : -- : --</strong>`;
    const tick = () => {
      const delta = Math.max(0, target - Date.now());
      const units = [Math.floor(delta / 86400000), Math.floor(delta / 3600000) % 24, Math.floor(delta / 60000) % 60, Math.floor(delta / 1000) % 60];
      node.querySelector("[data-release-value]").textContent = units.map((unit) => String(unit).padStart(2, "0")).join(" : ");
      node.setAttribute("aria-label", `${t.launch} ${units[0]} ${t.days}, ${units[1]} ${t.hours}, ${units[2]} ${t.minutes}, ${units[3]} ${t.seconds}`);
    };
    tick(); window.setInterval(tick, 1000);
  });
  const LOCALIZED_SHELL = {
    en: { nav:["Palace","Play Palace","News","More Games","About 4OH","Support"], pages:{} },
    fr: { nav:["Palace","Jouer à Palace","Actualités","Plus de jeux","À propos","Assistance"], pages:{
      "/palace.html":["Le jeu phare de Four of Hearts","Palace vous appelle.","Égalez. Dépassez. Brûlez la pile. La légende de la table devient enfin une application."],
      "/palace-story.html":["Faits · tradition · légende","Un jeu transmis de mémoire.","Palace n’a ni boîte unique, ni règle universelle, ni origine entièrement prouvée."],
      "/news.html":["Salle de presse Four of Hearts","La table prend forme.","Palace ouvre les nouvelles, avec des mises à jour honnêtes de toute la famille Four of Hearts."],
      "/about.html":["Le studio derrière Palace","Quatre filles. Quatre cœurs. Une passion très sérieuse pour les soirées jeux.","Tout a commencé autour d’une table familiale, avec beaucoup d’avis et assez de rires pour jouer encore une manche."],
      "/privacy.html":["Confidentialité par conception","Choix de confidentialité","Pas de compte, pas de publicité, pas d’analytique, pas de cookie et pas de vente de données visiteur."]} },
    es: { nav:["Palace","Jugar Palace","Noticias","Más juegos","Acerca de 4OH","Soporte"], pages:{
      "/news.html":["Noticias de Four of Hearts","La mesa está tomando forma.","Palace encabeza las noticias con actualizaciones honestas de toda la familia Four of Hearts."],
      "/about.html":["El estudio detrás de Palace","Cuatro hijas. Cuatro corazones. Una maravillosa obsesión por jugar.","Todo empezó alrededor de una mesa familiar, con muchas opiniones y risas para otra mano."],
      "/privacy.html":["Privacidad por diseño","Opciones de privacidad","Sin cuenta, anuncios, analítica, cookies ni venta de datos de visitantes."]} },
    hi: { nav:["पैलेस","पैलेस खेलें","समाचार","और खेल","4OH के बारे में","सहायता"], pages:{
      "/about.html":["पैलेस के पीछे का स्टूडियो","चार बेटियाँ। चार दिल। खेल की एक प्यारी-सी गंभीर दीवानगी।","यह कहानी पारिवारिक मेज़ से शुरू हुई—ढेरों राय, हँसी और एक और बाज़ी के साथ।"],
      "/news.html":["फोर ऑफ हार्ट्स समाचार","मेज़ तैयार हो रही है।","पैलेस से शुरू होकर पूरे फोर ऑफ हार्ट्स परिवार की ईमानदार खबरें।"],
      "/privacy.html":["डिज़ाइन से गोपनीयता","गोपनीयता विकल्प","न खाता, न विज्ञापन, न एनालिटिक्स, न कुकी और न आगंतुक डेटा की बिक्री।"]} },
    "zh-Hans": { nav:["宫殿","试玩宫殿","新闻","更多游戏","关于 4OH","支持"], pages:{
      "/palace.html":["四心旗舰游戏","宫殿在召唤。","同点、压过、烧掉牌堆。这款桌上传奇终于要成为应用。"],
      "/news.html":["四心新闻室","牌桌正在成形。","以宫殿为主角，带来四心游戏家族真实透明的开发消息。"],
      "/about.html":["宫殿背后的工作室","四个女儿。四颗心。一份认真又快乐的游戏热爱。","故事始于家庭牌桌：许多主意、许多笑声，还有再来一局。"],
      "/privacy.html":["隐私源于设计","隐私选择","没有账户、广告、分析、Cookie，也不出售访客数据。"]} },
    he: { nav:["Palace","שחקו Palace","חדשות","משחקים נוספים","על 4OH","תמיכה"], pages:{
      "/palace-story.html":["עובדה · מסורת · אגדה","משחק שעובר מזיכרון לזיכרון.","ל-Palace אין קופסה אחת, ספר חוקים יחיד או מקור מוכח לחלוטין."],
      "/about.html":["הסטודיו שמאחורי Palace","ארבע בנות. ארבעה לבבות. אהבה רצינית ומשמחת למשחקים.","הכול התחיל סביב שולחן משפחתי, עם דעות, צחוק ועוד סיבוב אחד."],
      "/privacy.html":["פרטיות מהעיצוב","בחירות פרטיות","בלי חשבון, פרסומות, ניתוח, עוגיות או מכירת נתוני מבקרים."]} },
    ar: { nav:["القصر","العب القصر","الأخبار","ألعاب أخرى","عن 4OH","الدعم"], pages:{
      "/palace.html":["لعبة Four of Hearts الرئيسية","القصر يناديك.","طابقها. تجاوزها. احرق الكومة. أسطورة الطاولة تتحول أخيرًا إلى تطبيق."],
      "/palace-story.html":["حقيقة · تقليد · أسطورة","لعبة تحملها الذاكرة.","ليس للقصر صندوق واحد أو كتاب قواعد موحد أو أصل مثبت بالكامل."],
      "/news.html":["غرفة أخبار Four of Hearts","الطاولة تتشكل.","القصر يتصدر الأخبار مع تحديثات صادقة من عائلة Four of Hearts."],
      "/about.html":["الاستوديو وراء القصر","أربع بنات. أربعة قلوب. شغف مرح وجاد بالألعاب.","بدأ كل شيء حول طاولة عائلية، مع آراء كثيرة وضحكات تكفي لجولة أخرى."],
      "/privacy.html":["الخصوصية في التصميم","خيارات الخصوصية","لا حساب ولا إعلانات ولا تحليلات ولا ملفات تعريف ارتباط ولا بيع لبيانات الزوار."]} },
    "en-CA-fun": { nav:["Palace","Give ’er","News, eh?","More Games","About 4OH","Help, please"], pages:{
      "/palace.html":["The Four of Hearts flagship","Palace is calling, eh?","Match it. Beat it. Burn it. Beauty—the table legend is finally becoming an app."],
      "/news.html":["News from the table","Things are taking shape, bud.","Honest Palace updates from the whole Four of Hearts family. No tall tales, promise."],
      "/about.html":["The folks behind Palace","Four daughters. Four hearts. One beauty of a game night.","It started at the family table: lots of opinions, plenty of laughs, and one more hand before we call ’er."],
      "/privacy.html":["Privacy by design","Privacy choices, eh?","Sorry—nothing creepy here. No account, ads, analytics, cookies, or visitor-data sales."]} }
  };
  const localizeShell = () => {
    const pack = LOCALIZED_SHELL[locale] || LOCALIZED_SHELL.en;
    document.querySelectorAll("#primary-navigation a").forEach((link, index) => { if (pack.nav[index]) link.textContent = pack.nav[index]; });
    const pageCopy = pack.pages[location.pathname] || pack.pages[`/${location.pathname.split("/").pop()}`];
    if (pageCopy) {
      const hero = document.querySelector(".page-hero");
      if (hero) {
        const eyebrow = hero.querySelector(".eyebrow"); const title = hero.querySelector("h1"); const lede = hero.querySelector(".lede");
        if (eyebrow) eyebrow.textContent = pageCopy[0]; if (title) { const gameToken = title.querySelector("[data-game-name]"); if (gameToken) { const tail = { fr:" vous appelle.", ar:" يناديك.", "en-CA-fun":" is calling, eh?" }[locale] || " is calling."; title.innerHTML = `<span data-game-name>${displayName()}</span>${tail}`; } else title.textContent = pageCopy[1]; } if (lede) lede.textContent = pageCopy[2];
      }
    }
    document.querySelectorAll("[data-game-name]").forEach((node) => { node.textContent = displayName(); });
  };
  localizeShell();
  window.PALACE_EXPERIENCE = Object.freeze({ locale, t, get game() { return game; }, displayName, applyGame });
  applyGame();
})();
