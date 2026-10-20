import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
export const utcToday = () => new Date().toISOString().slice(0,10);
export function publishDue(records, today) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(today)) throw Error('Expected an ISO publication day');
  const due=records.filter(a=>a.status==='draft' && a.scheduledFor && a.scheduledFor<=today);
  for (const a of records.filter(a=>a.scheduledFor)) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(a.scheduledFor) || new Date(a.scheduledFor).toISOString().slice(0,10)!==a.scheduledFor) throw Error('Invalid planned date: '+a.slug);
  }
  if (!due.length) return [];
  records.forEach(a=>a.featured=false);
  for (const a of due) {a.status='published';a.date=today;}
  due.sort((a,b)=>b.scheduledFor.localeCompare(a.scheduledFor))[0].featured=true;
  return due.map(a=>({slug:a.slug,planned:a.scheduledFor,published:a.date}));
}
if(import.meta.url===pathToFileURL(process.argv[1]||'').href) {
  const file=resolve(import.meta.dirname,'../content/news.json'), records=JSON.parse(readFileSync(file,'utf8'));
  const due=publishDue(records,utcToday());
  if(process.argv.includes('--publish') && due.length) writeFileSync(file,JSON.stringify(records,null,2)+'\n');
  console.log(JSON.stringify({mode:process.argv.includes('--publish')?'published':'preview',today:utcToday(),due},null,2));
}
