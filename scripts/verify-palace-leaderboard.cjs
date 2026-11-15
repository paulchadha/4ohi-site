// Browser QA uses isolated intercepted responses; no production records are created.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {chromium}=require('playwright');
const root=path.resolve(__dirname,'..'),output=path.resolve(process.env.LEADERBOARD_QA_OUT||path.join(root,'docs/visual-evidence/palace-leaderboard'));
const live=process.env.LEADERBOARD_QA_LIVE==='1';
const api='https://plankton-app-qgwhz.ondigitalocean.app/games/palace/v1/public-leaderboard?mode=ranked&limit=25';
const player=i=>({playerId:`00000000-0000-4000-8000-${String(i).padStart(12,'0')}`,name:i===2?'A long fixture display name that must fit the mobile table':`Fixture Player ${i}`,avatar:'♠',rank:i<4?1:i,rating:i<4?1606:1607-i,wins:1,matches:2});
const board=(rows=Array.from({length:25},(_,i)=>player(i+1)),version=1)=>({apiVersion:1,game:'palace',mode:'ranked',metric:'rating',metricLabel:'Ranked rating',ordering:'rating-desc,wins-desc,account-id-asc',tiePolicy:'shared-rank-rating-wins',eligibleCount:rows.length===25?32:rows.length,snapshotAt:new Date().toISOString(),activatedAt:'2026-11-01T18:00:00Z',version:String(version),rulesVersion:'palace-v2',policyVersion:'palace-pairwise-12-v1',rows,topPlayer:rows[0]||null});
const mime=file=>({'.html':'text/html','.mjs':'text/javascript','.js':'text/javascript','.css':'text/css','.png':'image/png','.webp':'image/webp','.svg':'image/svg+xml','.xml':'application/xml'})[path.extname(file)]||'application/octet-stream';
(async()=>{
  fs.mkdirSync(output,{recursive:true});
  const browser=await chromium.launch({headless:true,...(process.env.CHROME_PATH?{executablePath:process.env.CHROME_PATH}:{})}),results=[];
  const context=await browser.newContext();
  try{
    if(!live)await context.route('https://4ohi.com/**',async route=>{
      const url=new URL(route.request().url()),file=path.resolve(root,'.'+url.pathname+(url.pathname.endsWith('/')?'index.html':''));
      if(!file.startsWith(root+path.sep)||!fs.existsSync(file))return route.fulfill({status:404,body:'Not found'});
      return route.fulfill({status:200,contentType:mime(file),body:fs.readFileSync(file)});
    });
    let response=()=>({status:200,value:board()}),calls=0;
    await context.route(api,async route=>{
      calls++;const request=route.request(),headers=request.headers();
      assert.equal(request.method(),'GET');assert.equal(headers.authorization,undefined);assert.equal(headers.cookie,undefined);assert.equal(headers.referer,undefined);
      const result=await response();
      try{await route.fulfill({status:result.status,headers:{'Content-Type':'application/json','Access-Control-Allow-Origin':'https://4ohi.com','Cache-Control':'no-store'},body:JSON.stringify(result.value)});}
      catch(error){if(!request.failure())throw error;}
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
      results.push({test:'populated layout',width,height,rows:25,tiesPreserved:true,overflow:false});
      if(width===390){
        let finishMobile;response=()=>new Promise(resolve=>finishMobile=()=>resolve({status:200,value:board(undefined,2)}));
        const stable=await page.evaluate(()=>{const root=document.querySelector('[data-palace-leaderboard]'),rect=root.getBoundingClientRect();window.qaMobileRow=root.querySelector('[data-board-rows] tr');return{text:root.innerText,top:rect.top+scrollY,height:rect.height};});
        await page.locator('[data-board-refresh]').click();await page.waitForTimeout(200);
        assert.deepEqual(await page.evaluate(()=>{const root=document.querySelector('[data-palace-leaderboard]'),rect=root.getBoundingClientRect();return{text:root.innerText,top:rect.top+scrollY,height:rect.height};}),stable);
        assert.equal(await page.evaluate(()=>document.querySelector('[data-board-rows] tr')===window.qaMobileRow),true);assert.ok(finishMobile);
        await page.screenshot({path:path.join(output,'quiet-pending-mobile-390.png'),fullPage:true});finishMobile();await page.waitForFunction(()=>document.querySelector('[data-board-time]').textContent.includes('Version 2'));
        results.push({test:'mobile pending refresh retains rows, text and document layout',width,height,passed:true});
      }
      await page.close();
    }
    const page=await context.newPage();
    let release;response=()=>new Promise(resolve=>release=()=>resolve({status:200,value:board()}));
    await page.goto('https://4ohi.com/palace-leaderboard.html',{waitUntil:'domcontentloaded'});
    await page.waitForFunction(()=>document.querySelector('[data-board-status]').textContent.includes('Loading official'));
    assert.equal(await page.locator('[data-board-rows] tr').count(),0);while(!release)await new Promise(r=>setTimeout(r,10));release();
    await page.waitForFunction(()=>document.querySelectorAll('[data-board-rows] tr').length===25);
    results.push({test:'loading is distinct from empty',passed:true});
    const privacy=page.locator('[data-continue-without-saving]');if(await privacy.isVisible())await privacy.click();
    await page.locator('.palace-board-scene img').evaluateAll(nodes=>Promise.all(nodes.map(n=>n.decode())));
    await page.evaluate(()=>document.fonts.ready);
    const before=await page.evaluate(()=>{
      const root=document.querySelector('[data-palace-leaderboard]');window.qaFirstRow=root.querySelector('[data-board-rows] tr');window.qaRowMutations=0;
      window.qaRowObserver=new MutationObserver(mutations=>window.qaRowMutations+=mutations.length);window.qaRowObserver.observe(root.querySelector('[data-board-rows]'),{childList:true,subtree:true,characterData:true});
      const rect=root.getBoundingClientRect();return{text:root.innerText,rect:{top:rect.top+scrollY,left:rect.left+scrollX,width:rect.width,height:rect.height}};
    });
    let finishRefresh;response=()=>new Promise(resolve=>finishRefresh=()=>resolve({status:200,value:board(undefined,101)}));
    const startCalls=calls;await page.locator('[data-board-refresh]').click();
    await page.waitForTimeout(1000);assert.ok(finishRefresh);await page.evaluate(()=>{window.dispatchEvent(new Event('online'));window.dispatchEvent(new Event('online'));});
    assert.equal(calls,startCalls+1);
    assert.deepEqual(await page.evaluate(()=>{const root=document.querySelector('[data-palace-leaderboard]'),rect=root.getBoundingClientRect();return{text:root.innerText,rect:{top:rect.top+scrollY,left:rect.left+scrollX,width:rect.width,height:rect.height}};}),before);
    assert.equal(await page.locator('[data-board-panel]').getAttribute('aria-busy'),'false');assert.equal(await page.locator('[data-board-refresh]').textContent(),'Refresh');
    assert.equal(await page.evaluate(()=>document.querySelector('[data-board-rows] tr')===window.qaFirstRow),true);
    await page.screenshot({path:path.join(output,'quiet-pending-refresh.png'),fullPage:true});
    results.push({test:'slow refresh is silent, coalesces repeated requests and has no layout shift',passed:true,heldMs:1000});
    finishRefresh();await page.waitForFunction(()=>document.querySelector('[data-board-time]').textContent.includes('Version 101'));
    for(const version of [102,103]){response=()=>({status:200,value:board(undefined,version)});await page.locator('[data-board-refresh]').click();await page.waitForFunction(v=>document.querySelector('[data-board-time]').textContent.includes('Version '+v),version);}
    assert.equal(await page.evaluate(()=>window.qaRowMutations),0);assert.equal(await page.evaluate(()=>document.querySelector('[data-board-rows] tr')===window.qaFirstRow),true);
    results.push({test:'repeated unchanged standings retain the original row nodes',passed:true});
    await page.evaluate(()=>window.qaRowObserver.disconnect());
    response=()=>({status:503,value:{message:'Service unavailable'}});await page.locator('[data-board-refresh]').click();
    await page.waitForFunction(()=>document.querySelector('[data-board-status]').dataset.state==='stale');
    assert.equal(await page.locator('[data-board-rows] tr').count(),25);assert.match(await page.locator('[data-board-time]').textContent(),/STALE/);assert.equal(await page.locator('[data-board-refresh]').textContent(),'Retry');
    results.push({test:'service failure preserves and labels prior standings',passed:true});
    const staleText=await page.locator('[data-palace-leaderboard]').innerText();let recover;
    response=()=>new Promise(resolve=>recover=()=>resolve({status:200,value:board([],2)}));await page.locator('[data-board-refresh]').click();await page.waitForTimeout(150);
    assert.equal(await page.locator('[data-palace-leaderboard]').innerText(),staleText);assert.equal(await page.locator('[data-board-status]').getAttribute('data-state'),'stale');
    assert.equal(await page.locator('[data-board-refresh]').textContent(),'Retry');assert.ok(recover);recover();
    results.push({test:'pending retry retains the stale warning and original timestamp',passed:true});
    await page.waitForFunction(()=>document.querySelector('[data-board-status]').dataset.state==='empty');assert.equal(await page.locator('[data-board-rows] tr').count(),0);
    results.push({test:'retry handles genuinely empty results',passed:true});
    let finishEmpty;const emptyText=await page.locator('[data-palace-leaderboard]').innerText();response=()=>new Promise(resolve=>finishEmpty=()=>resolve({status:200,value:board([],2)}));await page.locator('[data-board-refresh]').click();await page.waitForTimeout(150);assert.equal(await page.locator('[data-palace-leaderboard]').innerText(),emptyText);assert.ok(finishEmpty);finishEmpty();await page.waitForTimeout(100);
    results.push({test:'an empty board stays honestly empty during refresh',passed:true});
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
    let oldResponse;response=()=>new Promise(resolve=>oldResponse=()=>resolve({status:200,value:board(undefined,999)}));await page.locator('[data-board-refresh]').click();await page.waitForTimeout(100);assert.ok(oldResponse);
    await page.evaluate(()=>{window.qaNavigationRow=document.querySelector('[data-board-rows] tr');window.dispatchEvent(new PageTransitionEvent('pagehide',{persisted:true}));});
    response=()=>({status:200,value:board(undefined,6)});await page.evaluate(()=>{window.dispatchEvent(new PageTransitionEvent('pageshow',{persisted:true}));if(document.querySelector('[data-board-rows] tr')!==window.qaNavigationRow)throw Error('Cached navigation discarded accepted rows');});
    await page.waitForFunction(()=>document.querySelector('[data-board-time]').textContent.includes('Version 6'));oldResponse();await page.waitForTimeout(150);assert.match(await page.locator('[data-board-time]').textContent(),/Version 6/);
    results.push({test:'cached navigation retains rows and rejects an obsolete in-flight response',passed:true});
    await page.goto('https://4ohi.com/palace.html',{waitUntil:'domcontentloaded'});await page.goBack({waitUntil:'domcontentloaded'});await page.waitForFunction(()=>document.querySelector('[data-board-time]')?.textContent.includes('Version 6'));
    assert.equal(await page.locator('[data-board-rows] tr').count(),25);results.push({test:'real navigation away and back reloads the valid board',passed:true});
    await page.close();
    for(const [name,result]of [['initial HTTP failure',{status:503,value:{error:'unavailable'}}],['private payload rejected',{status:200,value:{...board(),own:{rank:32,email:'private@example.invalid'}}}]]){
      response=()=>result;const p=await context.newPage();await p.goto('https://4ohi.com/palace-leaderboard.html',{waitUntil:'domcontentloaded'});
      await p.waitForFunction(()=>document.querySelector('[data-board-status]').dataset.state==='error');assert.equal(await p.locator('[data-board-rows] tr').count(),0);assert.doesNotMatch(await p.locator('.palace-board-scene').textContent(),/private@example|No ranked players yet/);
      results.push({test:name,passed:true});await p.close();
    }
    const nav=await context.newPage();await nav.goto('https://4ohi.com/palace.html',{waitUntil:'domcontentloaded'});assert.equal(new URL(await nav.getByRole('link',{name:'Ranked leaderboard',exact:true}).getAttribute('href'),nav.url()).pathname,'/palace-leaderboard.html');await nav.close();
    results.push({test:'Palace page exposes the actual leaderboard route',passed:true});
    fs.writeFileSync(path.join(output,'results.json'),JSON.stringify({scope:live?'Live website browser QA with isolated API responses; no production records changed':'Local actual-source browser QA with isolated API responses; not live deployment evidence',api,results},null,2)+'\n');
    console.log(JSON.stringify({passed:results.length,failed:0,output,scope:'isolated browser responses'},null,2));
  }finally{await context.close();await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
