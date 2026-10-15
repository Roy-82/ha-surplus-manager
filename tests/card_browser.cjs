// Run: npm install --no-save playwright@1.51.1 && npx playwright install chromium
// Then: node tests/card_browser.cjs
const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const path = require('node:path');

(async () => {
  const browser = await chromium.launch({headless:true});
  try {
    const page = await browser.newPage({viewport:{width:1440,height:1100}});
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    // Give localStorage an origin without making a network request.
    await page.route('http://card.test/**', route => route.fulfill({contentType:'text/html',body:`
      <style>body{margin:0;font-family:Arial;background:#eef2f6} #mount{width:390px;margin:20px;
      --primary-text-color:#172033;--secondary-text-color:#526178;--primary-color:#1574c5;
      --secondary-background-color:#f2f5f9;--card-background-color:white;--error-color:#d32f2f}
      ha-card{display:block;background:white;border-radius:16px} ha-icon{display:inline-block;width:var(--mdc-icon-size,24px);height:var(--mdc-icon-size,24px);flex-shrink:0}
      </style><div id="mount"></div>`}));
    await page.goto('http://card.test/');
    await page.addScriptTag({path:path.resolve('custom_components/surplus_manager/frontend/surplus-manager-card.js')});
    await page.evaluate(() => {
      window.calls = [];
      window.attrs = {config_entry_id:'demo',language:'de',enabled:true,grid_valid:true,mode:'auto',export_w:7500,import_w:0,total_active_power_w:800,battery_guards:[],consumers:[
        {id:'a',name:'Klimaanlage Wohnzimmer mit einem besonders langen Namen',entity_id:'switch.a',enabled:true,is_on:true,power_w:800,current_power_w:752,reason:'Wartet auf höhere Priorität: Poolpumpe mit langer Bezeichnung',start_priority:1,stop_priority:2},
        {id:'b',name:'Poolpumpe',entity_id:'switch.b',enabled:true,is_on:false,power_w:300,reason:'Mindestpause',countdown_s:60,start_priority:2,stop_priority:1}
      ]};
      window.card = document.createElement('surplus-manager-card');
      document.querySelector('#mount').append(card);
      window.refresh = () => {card.hass={language:'de',states:{'sensor.manager':{attributes:attrs},'switch.a':{state:'on'},'switch.b':{state:'off'}},callService:async (...args)=>{calls.push(args)}};card._render();};
      card.setConfig({entity:'sensor.manager'});
      refresh();
      window.originalCard = card.shadowRoot.querySelector('ha-card');
      window.originalRow = card.shadowRoot.querySelector('.row[data-id="a"]');
      window.injected = document.createElement('card-mod');
      const shadow = injected.attachShadow({mode:'open'});
      shadow.innerHTML='<style>:host{display:none}</style>';
      originalCard.append(injected);
      window.injectedStyle = document.createElement('style');
      injectedStyle.textContent='.name { color: rgb(123, 45, 67) !important; }';
      card.shadowRoot.append(injectedStyle);
      window.nestedStyle = document.createElement('style');
      nestedStyle.textContent='.reason { font-weight: 700 !important; }';
      originalRow.append(nestedStyle);
    });
    const persistence = await page.evaluate(() => {
      for(let i=0;i<30;i++){attrs.export_w=1000+i;attrs.consumers[0].current_power_w=500+i;refresh();}
      return {
        card:originalCard===card.shadowRoot.querySelector('ha-card'),
        row:originalRow===card.shadowRoot.querySelector('.row[data-id="a"]'),
        injected:injected.parentNode===originalCard,
        rootStyle:injectedStyle.parentNode===card.shadowRoot,
        nestedStyle:nestedStyle.parentNode===originalRow,
        color:getComputedStyle(originalRow.querySelector('.name')).color,
        power:originalRow.querySelector('.meta').textContent,
      };
    });
    assert(persistence.card && persistence.row && persistence.injected && persistence.rootStyle && persistence.nestedStyle);
    assert.equal(persistence.color,'rgb(123, 45, 67)');
    assert.match(persistence.power,/529/);
    // A listener must not accumulate on a node that survives many refreshes.
    await page.evaluate(() => card.shadowRoot.querySelector('#masterToggle').click());
    assert.equal(await page.evaluate(()=>calls.filter(c=>c[1]==='set_enabled').length),1);
    // Reordering keeps the consumer node and its injected styles.
    await page.evaluate(()=>{card._orderMode='stop';refresh();});
    assert.deepEqual(await page.evaluate(()=>[...card.shadowRoot.querySelectorAll('.row')].map(x=>x.dataset.id)),['b','a']);
    assert(await page.evaluate(()=>originalRow===card.shadowRoot.querySelector('.row[data-id="a"]')));
    // Unsaved input survives incoming HA updates and resizing.
    await page.evaluate(()=>card._openEditor(attrs.consumers[0]));
    await page.locator('#fName').fill('Unsaved edit');
    await page.evaluate(()=>{attrs.export_w=900;card.hass={...card._hass};});
    assert.equal(await page.locator('#fName').inputValue(),'Unsaved edit');
    await page.locator('#closeEditor').click();
    // All five languages, narrow cards inside a desktop viewport and wide layout.
    for(const language of ['de','en','fr','es','nl']) {
      for(const width of [280,320,390,650,651,1000]) {
        await page.evaluate(({width,language})=>{document.querySelector('#mount').style.width=width+'px';attrs.language=language;refresh();}, {width,language});
        const layout = await page.evaluate(()=>{
          const root=card.shadowRoot, host=card.getBoundingClientRect();
          const nodes=[...root.querySelectorAll('.header,.title,.pill,.list,.row,.main,.name,.status,.toolbar,.toolbar button,.orderTabs button')];
          return {overflow:nodes.filter(el=>{const r=el.getBoundingClientRect();return r.width>0&&(r.right>host.right+1||r.left<host.left-1||(el.scrollWidth>el.clientWidth+1 && getComputedStyle(el).textOverflow!=='ellipsis'));}).map(el=>el.className||el.id),
            toolbar:getComputedStyle(root.querySelector('.toolbar')).flexDirection};
        });
        assert.deepEqual(layout.overflow,[],`${language} ${width}px: ${layout.overflow}`);
        assert.equal(layout.toolbar,width<=650?'row':'column');
      }
    }
    await page.evaluate(()=>{document.querySelector('#mount').style.width='390px';attrs.language='de';refresh();});
    if(process.env.CARD_SCREENSHOT) await page.locator('#mount').screenshot({path:process.env.CARD_SCREENSHOT});
    // Also check real phone viewport and the modal form, not only narrow columns.
    await page.setViewportSize({width:390,height:844});
    await page.evaluate(()=>{document.querySelector('#mount').style.width='350px';card._openEditor(attrs.consumers[0]);});
    assert(await page.evaluate(()=>{const d=card.shadowRoot.querySelector('#editor');const r=d.getBoundingClientRect();return r.left>=0 && r.right<=innerWidth && d.scrollWidth<=d.clientWidth+1;}));
    await page.locator('#closeEditor').click();
    // Removing a consumer removes only its row, not styles on retained nodes.
    await page.evaluate(()=>{attrs.consumers=attrs.consumers.filter(c=>c.id==='a');refresh();});
    assert.equal(await page.locator('.row').count(),1);
    assert(await page.evaluate(()=>nestedStyle.parentNode===originalRow && originalRow.isConnected));
    assert.deepEqual(errors,[]);
    console.log('PASS: persistent DOM/styles, current values, single service calls, row reordering/removal, unsaved form and 30 responsive language/width combinations');
  } finally { await browser.close(); }
})().catch(err=>{console.error(err);process.exitCode=1;});
