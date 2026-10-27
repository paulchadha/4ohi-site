import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
const esc = s => String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const root=resolve(import.meta.dirname,'..');
const cardEvidence=JSON.parse(readFileSync(resolve(root,'assets/card-apps/provenance.json'),'utf8'));
export const carouselMarkup=({id,label,slides,kind='gallery'}) => `<div class="swipe-carousel swipe-${kind}" data-carousel data-carousel-interval="15000" role="region" aria-roledescription="carousel" aria-label="${esc(label)}"><div class="swipe-track" id="${id}-track" data-carousel-track tabindex="0" aria-label="${esc(label)}. Swipe or use the left and right arrow keys.">${slides.map((s,i)=>`<div class="swipe-slide" data-carousel-slide role="group" aria-roledescription="slide" aria-label="${i+1} of ${slides.length}">${s}</div>`).join('')}</div><div class="swipe-controls" data-carousel-controls hidden><div class="swipe-buttons"><button type="button" data-carousel-prev aria-controls="${id}-track" aria-label="Previous slide"><span aria-hidden="true">&#8592;</span></button><button type="button" data-carousel-next aria-controls="${id}-track" aria-label="Next slide"><span aria-hidden="true">&#8594;</span></button><button type="button" class="swipe-pause" data-carousel-pause>Pause automatic rotation</button></div><p class="swipe-counter" data-carousel-counter aria-live="off" aria-atomic="true">1 / ${slides.length}</p><div class="swipe-dots" data-carousel-dots role="group" aria-label="Choose a slide">${slides.map((_,i)=>`<button type="button" data-carousel-dot="${i}" aria-label="Show slide ${i+1}" aria-pressed="${i===0}" tabindex="${i===0?0:-1}"><span></span></button>`).join('')}</div></div><p class="swipe-hint">Swipe left or right. Take the scenic route.</p></div>`;

export function productShowcase(products,{kind='games',id='game-showcase'}={}) {
 const priority=kind==='apps'?['sleep-amigo','sovinto','whomly']:['palace','press-ahead','sling-nouveau','gildenspire'];
 const ordered=[...products].sort((a,b)=>(priority.indexOf(a.key)<0?99:priority.indexOf(a.key))-(priority.indexOf(b.key)<0?99:priority.indexOf(b.key)));
 const slides=ordered.map(p=>`<article class="showcase-card" data-showcase-product="${p.id}" style="--showcase-accent:${p.theme.accent}"><div class="showcase-copy"><p class="showcase-kicker">${esc(p.type)} · ${esc(p.status)}</p><h3>${esc(p.title)}</h3><p class="showcase-tagline">${esc(p.summary)}</p><p class="showcase-availability">${esc(p.availability)}.</p><a class="button showcase-link" href="${p.infoUrl}">${esc(p.cta)}</a></div><a class="showcase-art" href="${p.infoUrl}" aria-label="Explore ${esc(p.title)}"><img src="${p.heroArtwork||p.artwork}" alt="${esc(p.alt)}" width="1200" height="900" loading="lazy" draggable="false"></a></article>`);
 return `<section class="studio-showcase studio-showcase-${kind}" aria-labelledby="${id}-title"><div class="production-shell"><header class="showcase-heading"><p class="production-eyebrow">${kind==='apps'?'FOR THE REST OF THE DAY':'GAMES WITH HEART'}</p><h2 id="${id}-title">${kind==='apps'?'Useful company. Less fuss.':'Find your next good distraction.'}</h2><p>${kind==='apps'?'Sleep Amigo, SOVINTO, and Whomly. A little help for the parts of life without a pause button.':'Big skies, small victories, and the occasional hat with a job. Every game has a place on the shelf.'}</p></header>${carouselMarkup({id,label:kind==='apps'?'Lifestyle apps':'4OH games',slides,kind:'showcase'})}</div></section>`;
}

const attr=(tag,name)=>{const m=tag.match(new RegExp(`\\b${name}=(['"])(.*?)\\1`,'i'));return m?.[2]?.replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/&amp;/g,'&');};
function productImages(product,content){
 const images=[];const seen=new Set();
 const add=(src,alt,caption)=>{if(!src||!alt||!src.startsWith('assets/')||!existsSync(resolve(root,src.split('?')[0])))return;src=src.split('?')[0];const key=src.replace(/-(?:384|512|640|720|960|1024|1200|1440|1536|1600)(?=\.)/,'').replace(/\.(?:png|jpe?g|webp)$/,'');if(seen.has(key))return;seen.add(key);const evidence=cardEvidence.find(a=>a.path===src);images.push({src,alt,caption:caption||evidence?.kind||(/press-ahead\/(?:board|map|scout)-browser/.test(src)?'Actual browser development capture; not a physical-phone installation.':'Existing product development artwork; not a gameplay screenshot.')});};
 const ownContent=content.split('<section class="production-related">')[0];
 for(const m of ownContent.matchAll(/<img\b[^>]*>/gi)){const src=attr(m[0],'src'),alt=attr(m[0],'alt');if(product.key==='press-ahead'&&!/browser\.webp/.test(src||''))continue;add(src,alt,attr(m[0],'data-gallery-caption')||(src==='assets/gin-rummy/development-phone.webp'?'Actual development build capture; public internet play is not yet available.':undefined));}
 const extra={bobby:['assets/portfolio-2026/bobby-gameplay.webp','Bobby the Breadasaurus development reference artwork'],heartstack:['assets/heartstack-2026/heartstack-key-art.webp','Unicorn Blast original key artwork'],'thumb-command':['assets/thumb-command/thumb-command-alien-fleet-1280.webp','The Thumb Command alien fleet and mothership development artwork'],'princess-land':['assets/portfolio-2026/princess-land-world.webp','Princess Land Adventures world development artwork'],'unicorn-land':['assets/portfolio-2026/unicorn-land-world.webp','Unicorn Land Adventures habitat development artwork']}[product.key];
 if(extra)add(...extra);
 if(product.key==='thumb-command')add('assets/thumb-command/thumb-command-blueguard-upgrades-1280.webp','Thumb Command Blueguard interceptor upgrade concept artwork');
 if(images.length===1&&['palace','hearts','spades','euchre'].includes(product.key))add(product.heroArtwork,product.alt,'Original promotional artwork, shown separately from the app capture.');
 return images;
}
export function withProductGallery(product,content){
 const images=productImages(product,content);
 if(images.length<2)return content;
 const id=product.key==='press-ahead'?'preview':product.key==='evil-doom'?'doom-gallery':'product-gallery-'+product.key;
 const slides=images.map(m=>`<figure class="carousel-media"><a class="carousel-media-frame" href="${m.src}" aria-label="Open full-size image: ${esc(m.alt)}"><img src="${m.src}" alt="${esc(m.alt)}" width="1600" height="1000" loading="lazy" draggable="false"></a><figcaption><strong>${esc(m.alt)}</strong><span>${esc(m.caption)}</span></figcaption></figure>`);
 const gallery=carouselMarkup({id,label:product.title+' image gallery',slides});
 if(product.key==='sling-nouveau')content=content.replace(/<div class="bling-worlds">[\s\S]*?<\/div>/,gallery);
 else {
 const section=`<section class="product-swipe-gallery" id="${id}" aria-labelledby="${id}-title"><div class="production-shell"><header><p class="production-eyebrow">${esc(product.title)} · THE GALLERY</p><h2 id="${id}-title">${product.key==='press-ahead'?'Postcards from development.':'The current picture.'}</h2><p>Browse existing artwork and development captures. Each caption explains what you are seeing; previews may evolve.</p></header>${gallery}</div></section>`;
 if(product.key==='press-ahead')content=content.replace(/<section class="pa-preview"[\s\S]*?<\/section>/,section);
 else if(product.key==='evil-doom'&&content.includes('<div id="doom-gallery" data-doom-gallery-slot></div>'))content=content.replace('<div id="doom-gallery" data-doom-gallery-slot></div>',section);
 else if(content.includes('</header>'))content=content.replace('</header>','</header>'+section);
 else content=content.replace('</section>','</section>'+section);
 }
 return content;
}
