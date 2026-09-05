import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const files = ["index.html","games.html","lifestyle-apps.html","about.html","privacy.html","news.html","thumb-command.html","bobby-the-breadasaurus.html","evil-doom-adventures.html","heartstack-unicorn-blast.html","princess-land-adventures.html","unicorn-land-adventures.html","booyang-city.html","funky-town.html","whomly.html","sleep-amigo.html"];
const decode = (value) => value.replace(/&rsquo;/g,"’").replace(/&amp;/g,"&").replace(/&#39;/g,"'").replace(/&[a-z#0-9]+;/gi," ");
const clean = (value) => decode(value.replace(/<script[\s\S]*?<\/script>/gi," ").replace(/<style[\s\S]*?<\/style>/gi," ").replace(/<[^>]+>/g," ")).replace(/\s+/g," ").trim();
const norm = (value) => value.toLowerCase().replace(/[^a-z0-9'’ ]/g," ").replace(/\s+/g," ").trim();
const grouped = (rows, key) => {
  const map = new Map();
  for (const row of rows) { const value=key(row); if(!value) continue; if(!map.has(value)) map.set(value,[]); map.get(value).push(row); }
  return [...map].filter(([,items])=>new Set(items.map(item=>item.file)).size>1).map(([text,items])=>({text,locations:[...new Set(items.map(item=>item.file))],count:items.length})).sort((a,b)=>b.count-a.count||a.text.localeCompare(b.text));
};

const sentences=[]; const headings=[]; const ctas=[]; const openingVerbs=[]; const phraseRows=[]; const adjectiveCounts=new Map();
const adjectiveWatch=["independent","useful","thoughtful","original","creative","clear","focused","playful","practical","privacy-minded","strange","great","fun"];
for (const file of files) {
  const html=readFileSync(resolve(file),"utf8");
  const main=html.match(/<main[^>]*>([\s\S]*?)<\/main>/i)?.[1] ?? html;
  const body=clean(main);
  for (const sentence of body.split(/(?<=[.!?])\s+/)) {
    const normalized=norm(sentence); const words=normalized.split(/\s+/).filter(Boolean);
    if(words.length>=5) sentences.push({file,text:sentence,normalized});
    if(words[0]) openingVerbs.push({file,text:words[0]});
    for(let size=3;size<=6;size+=1) for(let i=0;i<=words.length-size;i+=1) phraseRows.push({file,text:words.slice(i,i+size).join(" ")});
    for(const adjective of adjectiveWatch) if(words.includes(adjective)) adjectiveCounts.set(adjective,(adjectiveCounts.get(adjective)||0)+1);
  }
  for(const match of main.matchAll(/<h[1-3][^>]*>([\s\S]*?)<\/h[1-3]>/gi)) headings.push({file,text:clean(match[1])});
  for(const match of main.matchAll(/<(?:a|button)\b(?=[^>]*class="[^"]*(?:button|text-link)[^"]*")[^>]*>([\s\S]*?)<\/(?:a|button)>/gi)){const label=clean(match[1]).replace(/\s*[↗→]\s*$/," ").trim();if(label)ctas.push({file,text:label});}
  for(const match of main.matchAll(/<em>([\s\S]*?)<\/em>/gi)){const label=clean(match[1]).replace(/\s*[↗→]\s*$/," ").trim();if(label)ctas.push({file,text:label});}
}
const duplicateSentences=grouped(sentences,row=>row.normalized);
const duplicateTaglines=grouped(headings,row=>norm(row.text));
const repeatedOpeningVerbs=[...new Map(openingVerbs.map(row=>[row.text,0])).keys()].map(text=>({text,count:openingVerbs.filter(row=>row.text===text).length,locations:[...new Set(openingVerbs.filter(row=>row.text===text).map(row=>row.file))]})).filter(row=>row.count>=3).sort((a,b)=>b.count-a.count);
const repeatedCtas=grouped(ctas,row=>norm(row.text)).filter(row=>row.count>=2);
const repeatedPhrases=grouped(phraseRows,row=>row.text).filter(row=>row.count>=3&&!/^(four of hearts|in development no|the current product|back to games|read the related)$/.test(row.text)).slice(0,75);
const overusedAdjectives=[...adjectiveCounts].map(([text,count])=>({text,count})).filter(row=>row.count>=4).sort((a,b)=>b.count-a.count);
const report={generatedAt:new Date().toISOString(),filesReviewed:files,headingCount:headings.length,sentenceCount:sentences.length,duplicateMarketingSentences:duplicateSentences,duplicateTaglines,repeatedOpeningVerbs,repeatedCallToActionText:repeatedCtas,repeatedThreeToSixWordPhrases:repeatedPhrases,overusedAdjectives,notes:["Main marketing content is scanned; shared navigation and footer copy are excluded.","This is a warning tool. Editorial review decides whether repetition is purposeful, especially for legal and availability language."]};
writeFileSync(resolve("docs","copy-quality-results.json"),JSON.stringify(report,null,2)+"\n");
console.log(JSON.stringify({files:files.length,headings:headings.length,sentences:sentences.length,duplicateSentences:duplicateSentences.length,duplicateTaglines:duplicateTaglines.length,repeatedCtas:repeatedCtas.length,repeatedPhrases:repeatedPhrases.length,overusedAdjectives:overusedAdjectives.length},null,2));
