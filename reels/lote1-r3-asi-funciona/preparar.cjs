// reels/lote1-r3-asi-funciona/preparar.cjs — SOLO en la VM de Actions (paso «Preparar recursos de la pieza»).
// Captura pantallas REALES del pedido desde la mesa en una demo interna de la tanda 1 (plan Local):
//   carta.jpg (carta a página completa) · pedido.jpg (2 platos elegidos) · camarero.jpg («Así le llega al camarero»).
// El nombre del local se sustituye por «Tu restaurante» y se ocultan logotipos (nunca nombres de locales en público).
'use strict';
const { chromium, devices } = require('playwright');
const fs = require('fs');
const path = require('path');

const SALIDA = path.join(__dirname, 'assets', 'capturas');
// Demos internas con plan Local (ampliado): «Desde 1 €» es verdad. Se usa la primera que cargue con fotos.
const DEMOS = [
  ['la-parra-baza', 'Restaurante La Parra'], ['dama-de-baza', 'Hotel Restaurante Dama de Baza'],
  ['jardines-las-conchas', 'Restaurante Jardines Las Conchas'], ['bar-sebas', 'Restaurante Bar Sebas'],
  ['cafe-bar-urbano', 'Café Bar Urbano'], ['pizzeria-venecia', 'Pizzería Venecia'], ['umami-baza', 'UMAMI Sushi & Poke'],
];
const elegida = process.env.R3_DEMO || '';

async function anonimizar(p, nombre) {
  await p.evaluate((nombre) => {
    const partes = [nombre, ...nombre.split(/\s+/).filter((w) => w.length > 4 && !/^(Restaurante|Hotel|Bar|Café)$/i.test(w))];
    const re = new RegExp(partes.map((s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|'), 'gi');
    const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    let n; let primero = true;
    while ((n = w.nextNode())) if (re.test(n.nodeValue)) { re.lastIndex = 0; n.nodeValue = n.nodeValue.replace(re, () => (primero ? ((primero = false), 'Tu restaurante') : 'Tu restaurante')).replace(/(Tu restaurante\s*)+/g, 'Tu restaurante '); }
    for (const img of document.querySelectorAll('img')) {
      const a = (img.alt || '') + ' ' + (img.src || '');
      if (/logo/i.test(a) || partes.some((s) => a.toLowerCase().includes(s.toLowerCase()))) img.style.visibility = 'hidden';
    }
    // Nunca la ciudad ni la especialidad del local: frases con «Baza», «La Perdiz»…
    const w2 = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT); let m;
    while ((m = w2.nextNode())) { if (/\bBaza\b|perdiz|Cúllar|Cullar/i.test(m.nodeValue)) { m.nodeValue = m.nodeValue.replace(/\s*en\s+(Baza|Cúllar|Cullar)\b/gi, '').replace(/\.?\s*La perdiz,?\s*nuestra especialidad\.?/gi, '').replace(/\b(Baza|Cúllar|Cullar)\b/gi, ''); } }
    document.title = 'Carta';
  }, nombre);
}

(async () => {
  fs.mkdirSync(SALIDA, { recursive: true });
  const b = await chromium.launch();
  const ctx = await b.newContext({ ...devices['iPhone 13'], deviceScaleFactor: 3, locale: 'es-ES' });
  const p = await ctx.newPage();
  let usada = null;
  for (const [slug, nombre] of DEMOS.filter(([s]) => !elegida || s === elegida)) {
    try {
      await p.goto(`https://dkitchencorporate.es/m/${slug}?mesa=4`, { waitUntil: 'domcontentloaded', timeout: 60000 });
      await p.waitForTimeout(2500);
      await p.getByRole('button', { name: /Solo esenciales|Rechazar|Aceptar todo/i }).first().click({ timeout: 2500 }).catch(() => {});
      for (let y = 0; y < 5000; y += 350) { await p.evaluate((y) => scrollTo(0, y), y); await p.waitForTimeout(180); }
      await p.evaluate(() => scrollTo(0, 0)); await p.waitForTimeout(800);
      const fotos = await p.evaluate(() => [...document.images].filter((i) => i.naturalWidth > 200).length);
      const boton = await p.getByRole('button', { name: /^Pedir/ }).count();
      console.log(`[Preparar] ${slug}: ${fotos} fotos, botón pedir ${boton}`);
      if (fotos >= 4 && boton > 0) { usada = [slug, nombre]; break; }
    } catch (e) { console.log(`[Preparar] ${slug}: ${e.message}`); }
  }
  if (!usada) { console.error('[Preparar] ninguna demo válida'); process.exit(1); }
  const [slug, nombre] = usada;
  const URL = `https://dkitchencorporate.es/m/${slug}?mesa=4`;
  const dbg = async (n) => p.screenshot({ path: path.join(SALIDA, `dbg-${n}.jpg`), type: 'jpeg', quality: 60 }).catch(() => {});
  await p.goto(URL, { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(3000);
  await p.getByRole('button', { name: /Solo esenciales|Rechazar|Aceptar todo/i }).first().click({ timeout: 2500 }).catch(() => {});
  await anonimizar(p, nombre);
  await p.screenshot({ path: path.join(SALIDA, 'inicio.jpg'), type: 'jpeg', quality: 90 });

  // 1) Pedido desde la mesa en la página recién cargada (sin tocar estilos)
  const dlg = p.locator('[aria-labelledby="pedido-titulo"]');
  const botones = await p.evaluate(() => [...document.querySelectorAll('button')].map((b) => b.innerText.trim()).filter((t) => /pedir/i.test(t)));
  console.log('[Preparar] botones con «pedir»:', JSON.stringify(botones));
  await p.getByRole('button', { name: /^Pedir$/ }).last().click();
  await p.waitForTimeout(1500); await dbg('1-abierto');
  console.log('[Preparar] diálogo visible:', await dlg.isVisible());
  const mesaIn = dlg.getByRole('textbox', { name: 'Número de mesa' });
  if (!(await mesaIn.inputValue())) { await mesaIn.click(); await p.keyboard.type('4', { delay: 80 }); }
  await p.waitForTimeout(500); await dbg('0-mesa');
  console.log('[Preparar] tras la mesa, diálogo visible:', await dlg.isVisible());
  const anadir = dlg.getByRole('button', { name: /^Añadir$/ });
  const n = await anadir.count(); console.log('[Preparar] platos con Añadir:', n);
  const idx = n > 8 ? [4, 6] : [0, 1];
  await anadir.nth(idx[0]).click(); await p.waitForTimeout(400); await dbg('2-uno');
  await anadir.nth(idx[1] - 1).click(); await p.waitForTimeout(400); await dbg('2b-dos');
  await dlg.getByRole('button', { name: /Añadir otro/ }).first().click().catch(() => {});
  await p.waitForTimeout(400); await dbg('2c-mas');
  await p.evaluate(() => { for (const el of document.querySelectorAll('[role=dialog] p')) if (/Demostración/.test(el.textContent)) el.textContent = 'Lo confirma el camarero. Se paga en la barra.'; });
  await p.waitForTimeout(500);
  await p.screenshot({ path: path.join(SALIDA, 'pedido.jpg'), type: 'jpeg', quality: 90 });
  await dlg.getByRole('button', { name: /Enviar al camarero/ }).click({ timeout: 8000 });
  await p.waitForTimeout(1500); await dbg('3-enviado');
  await dlg.locator('div.bg-white', { hasText: 'Confirmar' }).first().screenshot({ path: path.join(SALIDA, 'camarero.png') });

  // 2) Carta larga en una carga nueva, sin las barras flotantes
  await p.goto(URL, { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(2500);
  for (let y = 0; y < 5200; y += 350) { await p.evaluate((y) => scrollTo(0, y), y); await p.waitForTimeout(160); }
  await p.evaluate(() => scrollTo(0, 0)); await anonimizar(p, nombre);
  const alto = Math.min(await p.evaluate(() => document.documentElement.scrollHeight), 5200);
  await p.evaluate(() => { for (const el of document.querySelectorAll('*')) { const s = getComputedStyle(el); if (s.position === 'fixed' || s.position === 'sticky') el.style.visibility = 'hidden'; } });
  await p.setViewportSize({ width: 390, height: alto }); await p.waitForTimeout(1200);
  await p.screenshot({ path: path.join(SALIDA, 'carta.jpg'), type: 'jpeg', quality: 88, clip: { x: 0, y: 0, width: 390, height: alto } });
  fs.writeFileSync(path.join(SALIDA, 'demo.txt'), `${slug}\n`);
  console.log(`[Preparar] capturas de ${slug} listas (carta ${alto} px)`);
  await b.close();
})().catch(async (e) => { console.error('[Preparar] ERROR:', e.message.slice(0, 300)); process.exit(1); });
