const { chromium, devices } = require('playwright');
const path = require('path');
const fs = require('fs');
(async () => {
  const dir = path.resolve('reels/lote1-r2-comision/assets');
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  const salida = path.resolve('reels/lote1-r2-comision/assets/g1-signature.mp4');
  const b = await chromium.launch();
  const c = await b.newContext({
    ...devices['iPhone 13'],
    deviceScaleFactor: 2,
    recordVideo: { dir: dir, size: { width: 390, height: 844 } }
  });
  const p = await c.newPage();
  await p.goto('https://sevenfood.dkitchencorporate.es/', { waitUntil: 'networkidle', timeout: 90000 });
  await p.waitForTimeout(2000);
  await p.evaluate(() => {
    for (const el of document.querySelectorAll('*')) {
      const s = getComputedStyle(el);
      if ((s.position === 'fixed' || s.position === 'sticky' || el.tagName === 'HEADER')) el.style.display = 'none';
      if (el.innerText && /SevenFood/.test(el.innerText)) el.style.display = 'none';
    }
  });
  await p.evaluate(async () => {
      const scrollHeight = document.body.scrollHeight;
      let scrolled = 0;
      while (scrolled < scrollHeight / 3) {
          window.scrollBy(0, 50);
          scrolled += 50;
          await new Promise(r => setTimeout(r, 100));
      }
  });
  await p.waitForTimeout(1000);
  const btns = await p.$$('button');
  for (const btn of btns) {
     const text = await btn.innerText();
     if(text.toLowerCase().includes('añadir') || text.toLowerCase().includes('agregar') || text.includes('+')) {
         await btn.click({ timeout: 2000 }).catch(() => {});
         break;
     }
  }
  await p.waitForTimeout(2000);
  await p.close();
  const videoPath = await p.video().path();
  await b.close();
  fs.renameSync(videoPath, salida);
  console.log('[Preparar] g1-signature.mp4 grabado', salida);
})().catch((e) => { console.error('[Preparar] aviso:', e.message); process.exit(0); });
