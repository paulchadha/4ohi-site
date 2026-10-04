import { cpSync, mkdtempSync, readdirSync, readFileSync, writeFileSync, rmSync } from 'node:fs';
import { join, resolve, extname, sep } from 'node:path';
import { tmpdir } from 'node:os';
import { execFileSync } from 'node:child_process';
import { createServer } from 'node:http';
import { pathToFileURL } from 'node:url';
export async function previewPost(slug, source=resolve(import.meta.dirname,'..'), port=0) {
 const records=JSON.parse(readFileSync(join(source,'content/news.json'),'utf8'));
 const selected=records.find(a=>a.slug===slug);if(!selected)throw Error('Unknown article slug');
 const scratch=mkdtempSync(join(tmpdir(),'4ohi-private-post-'));
 try {
  for(const entry of readdirSync(source,{withFileTypes:true})) {
   if(entry.name.startsWith('.') || ['account-app','node_modules','docs'].includes(entry.name))continue;
   cpSync(join(source,entry.name),join(scratch,entry.name),{recursive:entry.isDirectory()});
  }
  const draft=selected.status==='draft';selected.status='published';selected.featured=false;
  if(draft)selected.date=new Intl.DateTimeFormat('en-CA',{timeZone:'America/Chicago'}).format(new Date());
  writeFileSync(join(scratch,'content/news.json'),JSON.stringify(records));
  execFileSync(process.execPath,['scripts/build-site.mjs'],{cwd:scratch,stdio:'pipe'});
  const route=`news-${slug}.html`, file=join(scratch,route);
  let html=readFileSync(file,'utf8');html=html.replace(/<meta name="robots"[^>]*>/g,'').replace('</head>','<meta name="robots" content="noindex,nofollow"></head>').replace('<main id="main">',`<main id="main"><p class="notice" role="status">Private ${draft?'draft':'article'} preview. This copy is not published.</p>`);
  writeFileSync(file,html);
  const server=createServer((request,response)=>{
   try {
    const raw=decodeURIComponent(new URL(request.url,'http://local').pathname).replace(/^\//,'');
    if(raw!==route && !raw.startsWith('assets/'))throw Error('private');
    const target=resolve(scratch,raw);if(!target.startsWith(scratch+sep))throw Error('outside');
    const type={'.html':'text/html','.css':'text/css','.js':'text/javascript','.png':'image/png','.webp':'image/webp','.svg':'image/svg+xml','.jpg':'image/jpeg'}[extname(target)] || 'application/octet-stream';
    response.writeHead(200,{'Content-Type':type,'Cache-Control':'no-store','X-Robots-Tag':'noindex,nofollow'});response.end(readFileSync(target));
   } catch {response.writeHead(404);response.end('Not found');}
  });
  await new Promise(r=>server.listen(port,'127.0.0.1',r));
  return {url:`http://127.0.0.1:${server.address().port}/${route}`,close:async()=>{await new Promise(r=>server.close(r));rmSync(scratch,{recursive:true,force:true});}};
 } catch(error){rmSync(scratch,{recursive:true,force:true});throw error;}
}
if(import.meta.url===pathToFileURL(process.argv[1] || '').href) {
 const preview=await previewPost(process.argv[2],undefined,4174);console.log(`Private preview: ${preview.url}\nPress Ctrl+C to close and remove the preview.`);
 for(const signal of ['SIGINT','SIGTERM'])process.on(signal,async()=>{await preview.close();process.exit(0);});
}
