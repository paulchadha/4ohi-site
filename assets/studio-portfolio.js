(()=>{"use strict";
 const root=document.querySelector("[data-doom-dual]");if(!root)return;
 const panels=[...root.querySelectorAll("[data-doom-hero]")];const buttons=[...root.querySelectorAll("[data-doom-select]")];
 const params=new URLSearchParams(location.search);const requested=params.get("hero");let active=requested==="girl"?"girl":"boy";
 const show=(hero,{updateUrl=false}={})=>{active=hero;root.dataset.activeHero=hero;panels.forEach(panel=>{const on=panel.dataset.doomHero===hero;panel.setAttribute("aria-hidden",String(!on));});buttons.forEach(button=>button.setAttribute("aria-pressed",String(button.dataset.doomSelect===hero)));if(updateUrl){const next=new URL(location.href);if(hero==="boy")next.searchParams.delete("hero");else next.searchParams.set("hero",hero);history.replaceState(null,"",`${next.pathname}${next.search}${next.hash}`);}};
 buttons.forEach(button=>button.addEventListener("click",()=>show(button.dataset.doomSelect,{updateUrl:true})));
 show(active);
})();