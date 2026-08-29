(()=>{"use strict";
 const root=document.querySelector("[data-doom-dual]");if(!root)return;
 const panels=[...root.querySelectorAll("[data-doom-hero]")];const buttons=[...root.querySelectorAll("[data-doom-select]")];
 let active="girl",timer=null,paused=false;
 const show=(hero,manual=false)=>{active=hero;root.dataset.activeHero=hero;panels.forEach(panel=>{const on=panel.dataset.doomHero===hero;panel.setAttribute("aria-hidden",String(!on));});buttons.forEach(button=>button.setAttribute("aria-pressed",String(button.dataset.doomSelect===hero)));if(manual){paused=true;clearInterval(timer);}};
 buttons.forEach(button=>button.addEventListener("click",()=>show(button.dataset.doomSelect,true)));
 root.addEventListener("focusin",()=>{paused=true;clearInterval(timer)});
 if(!matchMedia("(prefers-reduced-motion: reduce)").matches){timer=setInterval(()=>{if(!paused)show(active==="girl"?"boy":"girl")},8500);}
 show(active);
})();
