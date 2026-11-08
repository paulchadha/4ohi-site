// Browser QA uses isolated intercepted responses; no production records are created.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {chromium}=require('playwright');
const root=path.resolve(__dirname,'..'),output=path.resolve(process.env.LEADERBOARD_QA_OUT||path.join(root,'docs/visual-evidence/palace-leaderboard'));
const api='https://plankton-app-qgwhz.ondigitalocean.app/games/palace/v1/public-leaderboard?mode=ranked&limit=25';
const player=i=>({playerId:`00000000-0000-4000-8000-${String(i).padStart(12,'0')}`,name:i===2?'A long fixture display name that must fit the mobile table':`Fixture Player ${i}`,avatar:'♠',rank:i<4?1:i,rating:i<4?1606:1607-i,wins:1,matches:2});
const board=(rows=Array.from({length:25},(_,i)=>player(i+1)),version=1)=>({apiVersion:1,game:'palace',mode:'ranked',metric:'rating',metricLabel:'Ranked rating',ordering:'rating-desc,wins-desc,account-id-asc',tiePolicy:'shared-rank-rating-wins',eligibleCount:rows.length===25?32:rows.length,snapshotAt:new Date().toISOString(),activatedAt:'2026-11-01T18:00:00Z',version:String(version),rulesVersion:'palace-v2',policyVersion:'palace-pairwise-12-v1',rows,topPlayer:rows[0]||null});
const mime=file=>({'.html':'text/html','.mjs':'text/javascript','.js':'text/javascript','.css':'text/css','.png':'image/png','.webp':'image/webp','.svg':'image/svg+xml','.xml':'application/xml'})[path.extname(file)]||'application/octet-stream';
(async()=>{
  fs.mkdirSync(output,{recursive:true});
  const browser=await chromium.launch({headless:true,...(process.env.CHROME_PATH?{executablePath:process.env.CHROME_PATH}:{})}),results=[];
  const context=await browser.newContext();
  try{
    await context.route('https://4ohi.com/**',async route=>{
      const url=new URL(route.request().url()),file=path.resolve(root,'.'+url.pathname+(url.pathname.endsWith('/')?'index.html':''));
      if(!file.startsWith(root+path.sep)||!fs.existsSync(file))return route.fulfill({status:404,body:'Not found'});
      return route.fulfill({status:200,contentType:mime(file),body:fs.readFileSync(file)});
    });
    let response=()=>({status:200,value:board()}),calls=0;
    await context.route(api,async route=>{
      calls++;const request=route.request(),headers=request.headers();
      assert.equal(request.method(),'GET');assert.equal(headers.authorization,undefined);assert.equal(headers.cookie,undefined);assert.equal(headers.referer,undefined);
      const result=await response();
      await route.fulfill({status:result.status,headers:{'Content-Type':'application/json','Access-Control-Allow-Origin':'https://4ohi.com','Cache-Control':'no-store'},body:JSON.stringify(result.value)});
    });
    for(const [width,height]of [[320,740],[390,844],[768,1024],[844,390],[1024,768],[1440,900]]){
      response=()=>({status:200,value:board()});const page=await context.newPage();await page.setViewportSize({width,height});
      await page.goto('https://4ohi.com/palace-leaderboard.html',{waitUntil:'domcontentloaded'});
      await page.waitForFunction(()=>document.querySelectorAll('[data-board-rows] tr').length===25);
      const privacy=page.locator('[data-continue-without-saving]');if(await privacy.isVisible())await privacy.click();
      await page.locator('.palace-board-scene img').evaluateAll(nodes=>Promise.all(nodes.map(n=>n.decode())));
      assert.equal(await page.locator('[data-board-rows] tr').count(),25);
      assert.match(await page.locator('[data-board-count]').textContent(),/25 of 32/);
      assert.equal(await page.locator('[data-board-rows] tr').first().locator('td').first().textContent(),'1');
      assert.equal(await page.locator('[data-board-rows] tr').nth(1).locator('td').first().textContent(),'1');
      const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1);assert.equal(overflow,false,`Overflow at ${width}x${height}`);
      const badImages=await page.locator('.palace-board-scene img').evaluateAll(nodes=>nodes.filter(n=>!n.complete||!n.naturalWidth).length);assert.equal(badImages,0);
      await page.screenshot({path:path.join(output,`leaderboard-${width}x${height}.png`),fullPage:true});
      results.push({test:'populated layout',width,height,rows:25,tiesPreserved:true,overflow:false});await page.close();
    }
    const page=await context.newPage();
    let release;response=()=>new Promise(resolve=>release=()=>resolve({status:200,value:board()}));
    await page.goto('https://4ohi.com/palace-leaderboard.html',{waitUntil:'domcontentloaded'});
    await page.waitForFunction(()=>document.querySelector('[data-board-status]').textContent.includes('Loading official'));
    assert.equal(await page.locator('[data-board-rows] tr').count(),0);while(!release)await new Promise(r=>setTimeout(r,10));release();
    await page.waitForFunction(()=>document.querySelectorAll('[data-board-rows] tr').length===25);
    results.push({test:'loading is distinct from empty',passed:true});
    response=()=>({status:503,value:{message:'Service unavailable'}});await page.locator('[data-board-refresh]').click();
    await page.waitForFunction(()=>document.querySelector('[data-board-status]').dataset.state==='stale');
    assert.equal(await page.locator('[data-board-rows] tr').count(),25);assert.match(await page.locator('[data-board-time]').textContent(),/STALE/);assert.equal(await page.locator('[data-board-refresh]').textContent(),'Retry');
    results.push({test:'service failure preserves and labels prior standings',passed:true});
    response=()=>({status:200,value:board([],2)});await page.locator('[data-board-refresh]').click();
    await page.waitForFunction(()=>document.querySelector('[data-board-status]').dataset.state==='empty');assert.equal(await page.locator('[data-board-rows] tr').count(),0);
    results.push({test:'retry handles genuinely empty results',passed:true});
    response=()=>({status:200,value:board([{...player(1),name:'<img src=x onerror="window.leaderboardXss=true">'}],3)});await page.locator('[data-board-refresh]').click();
    await page.waitForFunction(()=>document.querySelector('[data-board-time]').textContent.includes('Version 3'));
    assert.equal(await page.locator('[data-board-rows] img').count(),0);assert.equal(await page.evaluate(()=>window.leaderboardXss),undefined);assert.match(await page.locator('[data-board-rows]').textContent(),/<img src=x/);
    results.push({test:'player names render as text',passed:true});
    response=()=>({status:200,value:board(undefined,4)});const started=Date.now();
    await page.waitForFunction(()=>document.querySelector('[data-board-time]').textContent.includes('Version 4'),null,{timeout:7500});
    results.push({test:'visible automatic refresh',elapsedMs:Date.now()-started,targetMs:10000});
    await page.evaluate(()=>{window.qaVisibility='hidden';Object.defineProperty(document,'visibilityState',{configurable:true,get:()=>window.qaVisibility});document.dispatchEvent(new Event('visibilitychange'));});
    const hiddenCalls=calls;await page.waitForTimeout(5500);assert.equal(calls,hiddenCalls);
    response=()=>({status:200,value:board(undefined,5)});await page.evaluate(()=>{window.qaVisibility='visible';document.dispatchEvent(new Event('visibilitychange'));});
    await page.waitForFunction(()=>document.querySelector('[data-board-time]').textContent.includes('Version 5'));
    results.push({test:'hidden pages pause and foreground refreshes immediately',passed:true});
    await page.close();
    for(const [name,result]of [['initial HTTP failure',{status:503,value:{error:'unavailable'}}],['private payload rejected',{status:200,value:{...board(),own:{rank:32,email:'private@example.invalid'}}}]]){
      response=()=>result;const p=await context.newPage();await p.goto('https://4ohi.com/palace-leaderboard.html',{waitUntil:'domcontentloaded'});
      await p.waitForFunction(()=>document.querySelector('[data-board-status]').dataset.state==='error');assert.equal(await p.locator('[data-board-rows] tr').count(),0);assert.doesNotMatch(await p.locator('.palace-board-scene').textContent(),/private@example|No ranked players yet/);
      results.push({test:name,passed:true});await p.close();
    }
    const nav=await context.newPage();await nav.goto('https://4ohi.com/palace.html',{waitUntil:'domcontentloaded'});assert.equal(new URL(await nav.getByRole('link',{name:'Ranked leaderboard',exact:true}).getAttribute('href'),nav.url()).pathname,'/palace-leaderboard.html');await nav.close();
    results.push({test:'Palace page exposes the actual leaderboard route',passed:true});
    fs.writeFileSync(path.join(output,'results.json'),JSON.stringify({scope:'Local actual-source browser QA with isolated API responses; not live deployment evidence',api,results},null,2)+'\n');
    console.log(JSON.stringify({passed:results.length,failed:0,output,scope:'isolated browser responses'},null,2));
  }finally{await context.close();await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
