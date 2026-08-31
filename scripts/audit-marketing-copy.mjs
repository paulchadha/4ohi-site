import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
const files=["index.html","games.html","lifestyle-apps.html","about.html","privacy.html","news.html","thumb-command.html","bobby-the-breadasaurus.html","evil-doom-adventures.html","heartstack-unicorn-blast.html","princess-land-adventures.html","unicorn-land-adventures.html","people-lens.html"];
const clean=s=>s.replace(/<script[\s\S]*?<\/script>/gi," ").replace(/<style[\s\S]*?<\/style>/gi," ").replace(/<[^>]+>/g," ").replace(/&[a-z#0-9]+;/gi," ").replace(/\s+/g," ").trim();
const sentences=[]; const headings=[];
for(const file of files){const html=readFileSync(resolve(file),"utf8"); const body=clean(html); for(const sentence of body.split(/(?<=[.!?])\s+/)){const normalized=sentence.toLowerCase().replace(/[^a-z0-9' ]/g,"").trim(); if(normalized.split(/\s+/).length>=5)sentences.push({file,text:sentence,normalized});} for(const match of html.matchAll(/<h[1-3][^>]*>([\s\S]*?)<\/h[1-3]>/gi))headings.push({file,text:clean(match[1])});}
const by=new Map(); for(const row of sentences){if(!by.has(row.normalized))by.set(row.normalized,[]);by.get(row.normalized).push(row.file)}
const duplicates=[...by].filter(([,locations])=>new Set(locations).size>1).map(([text,locations])=>({text,locations:[...new Set(locations)]}));
const report={generatedAt:new Date().toISOString(),filesReviewed:files,headingCount:headings.length,sentenceCount:sentences.length,duplicateMarketingSentences:duplicates,notes:["Shared navigation, footer, availability, and legal disclosures are intentionally excluded from enforcement.","This is a warning tool; editorial review decides whether repetition is purposeful."]};
writeFileSync(resolve("docs","copy-quality-results.json"),JSON.stringify(report,null,2)+"\n");
console.log(JSON.stringify({files:files.length,headings:headings.length,sentences:sentences.length,duplicates:duplicates.length},null,2));