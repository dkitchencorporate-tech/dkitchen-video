// Diagnóstico paso a paso (cada paso con límite de tiempo).
const { chromium } = require('playwright');
const path = require('path');
const paso = (n, pr, ms = 30000) => Promise.race([pr.then((v) => (console.log('OK', n), v)), new Promise((_, r) => setTimeout(() => r(new Error('TIEMPO AGOTADO en ' + n)), ms))]);
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  p.on('console', (m) => console.log('consola:', m.text()));
  p.on('pageerror', (e) => console.log('error página:', e.message));
  p.on('requestfailed', (r) => console.log('falló:', r.url().slice(0, 100)));
  await paso('goto', p.goto('file://' + path.resolve('reels/reel-01/composicion.html')));
  await paso('TL', p.evaluate(() => typeof window.TL).then((t) => console.log('TL es', t)));
  await paso('LISTO', p.evaluate(() => window.LISTO));
  await paso('duracion', p.evaluate(() => window.TL.duration()).then((d) => console.log('dura', d)));
  await paso('captura sin seek', p.screenshot({ type: 'jpeg' }));
  await paso('seek 0.5', p.evaluate(() => { window.TL.seek(0.5, false); return 1; }));
  await paso('captura 0.5', p.screenshot({ type: 'jpeg' }));
  await paso('seek 5', p.evaluate(() => { window.TL.seek(5, false); return 1; }));
  await paso('captura 5', p.screenshot({ type: 'jpeg' }));
  await b.close();
})().catch((e) => { console.log('FALLO:', e.message); process.exit(1); });
