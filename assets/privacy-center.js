(() => {
  "use strict";
  const name = "4oh_privacy_choice";
  const value = "optional_off";
  const banner = document.querySelector("[data-privacy-banner]");
  const dialog = document.querySelector("[data-privacy-dialog]");
  const gpc = navigator.globalPrivacyControl === true;
  let dismissedForView = false;
  const readChoice = () => document.cookie.split(";").map((item) => item.trim()).includes(`${name}=${value}`);
  const render = () => {
    const saved = readChoice();
    if (banner) banner.hidden = saved || gpc || dismissedForView;
    document.querySelectorAll("[data-gpc-status]").forEach((node) => { node.textContent = gpc ? "Global Privacy Control is on. Your opt-out signal is honored." : "No Global Privacy Control signal was detected. Optional cookies are still off."; });
    document.querySelectorAll("[data-privacy-current]").forEach((node) => { node.textContent = saved ? "Saved: optional cookies remain off for 180 days." : gpc ? "GPC is active; optional cookies remain off without a site preference cookie." : "Optional cookies are off. No saved preference cookie is present."; });
    document.querySelectorAll("[data-gpc-summary]").forEach((node) => { node.textContent = gpc ? "Signal honored" : "Supported"; });
  };
  const saveChoice = () => { document.cookie = `${name}=${value}; Max-Age=15552000; Path=/; SameSite=Lax; Secure`; dismissedForView = true; render(); };
  const clearChoice = () => { document.cookie = `${name}=; Max-Age=0; Path=/; SameSite=Lax; Secure`; dismissedForView = false; render(); };
  document.querySelectorAll("[data-open-privacy]").forEach((button) => button.addEventListener("click", () => dialog?.showModal()));
  document.querySelectorAll("[data-reject-optional]").forEach((button) => button.addEventListener("click", () => { saveChoice(); if (dialog?.open) dialog.close("save"); }));
  document.querySelectorAll("[data-continue-without-saving]").forEach((button) => button.addEventListener("click", () => { dismissedForView = true; render(); }));
  document.querySelectorAll("[data-forget-privacy]").forEach((button) => button.addEventListener("click", () => { clearChoice(); button.textContent = "Saved choice cleared"; }));
  render();
})();