// Se ejecuta en la VM de Actions antes del render (paso «Preparar recursos de la pieza»).
// Captura la carta real (diseño Bar & Tapas) a página completa para el scroll del móvil 3D.
const { chromium, devices } = require('playwright');
const path = require('path');
(async () => {
  const salida = path.resolve('hyperframes-studio/assets/v40/carta-larga.jpg');
  const b = await chromium.launch();
  const c = await b.newContext({ ...devices['iPhone 13'], deviceScaleFactor: 2 });
  const p = await c.newPage();
  await p.goto('https://dkitchencorporate.es/demo/carta', { waitUntil: 'networkidle', timeout: 90000 });
  await p.waitForTimeout(2000);
  await p.getByRole('button', { name: /Solo esenciales/i }).click({ timeout: 3000 }).catch(() => {});
  await p.getByRole('button', { name: /Cambiar diseño/i }).click();
  await p.waitForTimeout(800);
  await p.getByText('Bar & Tapas').click();
  await p.waitForTimeout(2500);
  await p.getByRole('button', { name: /^CERRAR$/i }).click({ timeout: 2000 }).catch(() => {});
  // bajar despacio para que carguen todas las imágenes perezosas
  for (let y = 0; y < 6000; y += 300) { await p.evaluate((y) => scrollTo(0, y), y); await p.waitForTimeout(250); }
  await p.evaluate(() => scrollTo(0, 0));
  await p.waitForTimeout(1000);
  await p.evaluate(() => {
    for (const el of document.querySelectorAll('*')) {
      const s = getComputedStyle(el);
      if ((s.position === 'fixed' || s.position === 'sticky') && /Cambiar diseño|Volver a DKitchen/.test(el.innerText || '')) el.style.display = 'none';
    }
  });
  const alto = await p.evaluate(() => document.documentElement.scrollHeight);
  await p.setViewportSize({ width: 390, height: Math.min(alto, 4800) });
  await p.waitForTimeout(1500);
  await p.screenshot({ path: salida, type: 'jpeg', quality: 86, clip: { x: 0, y: 0, width: 390, height: Math.min(alto, 4800) } });
  console.log('[Preparar] carta-larga.jpg capturada', Math.min(alto, 4800), 'px');
  await b.close();
})().catch((e) => { console.error('[Preparar] aviso:', e.message); process.exit(0); });
