// SOLO en la VM de GitHub Actions (paso «Preparar recursos de la pieza»).
// Captura pantallas reales y anonimizadas (/m/<slug> + /demo/panel?local=<slug>) sin nombres de locales ni ciudades.
'use strict';
const { chromium, devices } = require('playwright');
const fs = require('fs');
const path = require('path');

const SALIDA = path.join(__dirname, 'assets', 'capturas');
const DEMOS = [
  ['la-parra-baza', 'Restaurante La Parra'],
  ['dama-de-baza', 'Hotel Restaurante Dama de Baza'],
  ['bar-sebas', 'Restaurante Bar Sebas'],
  ['cafe-bar-urbano', 'Café Bar Urbano'],
  ['pizzeria-venecia', 'Pizzería Venecia'],
];

async function anonimizar(p, nombre) {
  await p.evaluate((nombreLocal) => {
    const partes = [nombreLocal, ...nombreLocal.split(/\s+/).filter((w) => w.length > 4 && !/^(Restaurante|Hotel|Bar|Café|Pizzería)$/i.test(w))];
    const esc = (s) => s.replace(/[.*+?^$${}()|[\]\\]/g, '\\$&');
    const re = new RegExp(partes.map(esc).join('|'), 'gi');
    const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    let n;
    while ((n = w.nextNode())) {
      if (re.test(n.nodeValue)) {
        re.lastIndex = 0;
        n.nodeValue = n.nodeValue.replace(re, 'Tu restaurante').replace(/(Tu restaurante\s*)+/g, 'Tu restaurante ');
      }
      if (/\bBaza\b|perdiz|Cúllar|Cullar|Guadix|Almería|Jaén|Granada/i.test(n.nodeValue)) {
        n.nodeValue = n.nodeValue
          .replace(/\s*en\s+(Baza|Cúllar|Cullar|Guadix|Almería|Jaén|Granada)\b/gi, '')
          .replace(/\.?\s*La perdiz,?\s*nuestra especialidad\.?/gi, '')
          .replace(/\b(Baza|Cúllar|Cullar|Guadix|Almería|Jaén|Granada)\b/gi, '');
      }
    }
    for (const img of document.querySelectorAll('img')) {
      const a = (img.alt || '') + ' ' + (img.src || '');
      if (/logo/i.test(a) || partes.some((s) => a.toLowerCase().includes(s.toLowerCase()))) img.style.visibility = 'hidden';
    }
    document.title = 'Carta Digital';
  }, nombre);
}

(async () => {
  fs.mkdirSync(SALIDA, { recursive: true });
  const b = await chromium.launch();
  const ctx = await b.newContext({ ...devices['iPhone 13'], deviceScaleFactor: 3, locale: 'es-ES' });
  const p = await ctx.newPage();
  let usada = null;

  for (const [slug, nombre] of DEMOS) {
    try {
      await p.goto(`https://dkitchencorporate.es/m/${slug}?mesa=4`, { waitUntil: 'domcontentloaded', timeout: 60000 });
      await p.waitForTimeout(2500);
      await p.getByRole('button', { name: /Solo esenciales|Rechazar|Aceptar todo/i }).first().click({ timeout: 2500 }).catch(() => {});
      for (let y = 0; y < 4800; y += 350) { await p.evaluate((pos) => scrollTo(0, pos), y); await p.waitForTimeout(160); }
      await p.evaluate(() => scrollTo(0, 0)); await p.waitForTimeout(700);
      const fotos = await p.evaluate(() => [...document.images].filter((i) => i.naturalWidth > 200).length);
      const boton = await p.getByRole('button', { name: /^Pedir/ }).count();
      console.log(`[Preparar] ${slug}: ${fotos} fotos, boton ${boton}`);
      if (fotos >= 4 && boton > 0) { usada = [slug, nombre]; break; }
    } catch (e) { console.log(`[Preparar] ${slug}: ${e.message}`); }
  }
  if (!usada) { console.error('[Preparar] ninguna demo valida'); process.exit(1); }

  const [slug, nombre] = usada;
  const URL_CARTA = `https://dkitchencorporate.es/m/${slug}?mesa=4`;
  await p.goto(URL_CARTA, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await p.waitForTimeout(2500);
  await p.getByRole('button', { name: /Solo esenciales|Rechazar|Aceptar todo/i }).first().click({ timeout: 2500 }).catch(() => {});
  await anonimizar(p, nombre);
  await p.screenshot({ path: path.join(SALIDA, 'inicio.jpg'), type: 'jpeg', quality: 90 });

  const dlg = p.locator('[aria-labelledby="pedido-titulo"]');
  await p.getByRole('button', { name: /^Pedir$/ }).last().click();
  await p.waitForTimeout(1400);
  const mesaIn = dlg.getByRole('textbox', { name: 'Número de mesa' });
  if (!(await mesaIn.inputValue())) { await mesaIn.click(); await p.keyboard.type('4', { delay: 80 }); }
  await p.waitForTimeout(500);
  const anadir = dlg.getByRole('button', { name: /^Añadir$/ });
  const n = await anadir.count();
  const idx = n > 8 ? [4, 6] : [0, 1];
  await anadir.nth(idx[0]).click(); await p.waitForTimeout(350);
  await anadir.nth(Math.max(0, idx[1] - 1)).click(); await p.waitForTimeout(350);
  await dlg.getByRole('button', { name: /Añadir otro/ }).first().click().catch(() => {});
  await p.evaluate(() => {
    for (const el of document.querySelectorAll('[role=dialog] p')) {
      if (/Demostración/.test(el.textContent)) el.textContent = 'Lo confirma tu equipo en sala al momento.';
    }
  });
  await p.waitForTimeout(450);
  await p.screenshot({ path: path.join(SALIDA, 'pedido.jpg'), type: 'jpeg', quality: 90 });
  await dlg.getByRole('button', { name: /Enviar al camarero/ }).click({ timeout: 8000 });
  await p.waitForTimeout(1400);
  await dlg.locator('div.bg-white', { hasText: 'Confirmar' }).first().screenshot({ path: path.join(SALIDA, 'camarero.png') });

  await p.goto(URL_CARTA, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await p.waitForTimeout(2200);
  for (let y = 0; y < 4800; y += 350) { await p.evaluate((pos) => scrollTo(0, pos), y); await p.waitForTimeout(140); }
  await p.evaluate(() => scrollTo(0, 0));
  await anonimizar(p, nombre);
  await p.evaluate(() => {
    for (const el of document.querySelectorAll('*')) {
      const s = getComputedStyle(el);
      if (s.position === 'fixed' || s.position === 'sticky') el.style.visibility = 'hidden';
    }
  });
  await p.waitForTimeout(600);
  await p.screenshot({ path: path.join(SALIDA, 'carta.jpg'), type: 'jpeg', quality: 88, fullPage: true });

  await p.goto(`https://dkitchencorporate.es/demo/panel?local=${slug}`, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await p.waitForTimeout(2500);
  await p.getByRole('button', { name: /Solo esenciales|Rechazar|Aceptar todo/i }).first().click({ timeout: 2500 }).catch(() => {});
  await anonimizar(p, nombre);
  await p.screenshot({ path: path.join(SALIDA, 'panel.jpg'), type: 'jpeg', quality: 88 });

  fs.writeFileSync(path.join(SALIDA, 'demo.txt'), `${slug}\n`);
  console.log(`[Preparar] capturas listas desde ${slug}`);
  await b.close();
})().catch((e) => {
  console.error('[Preparar] ERROR:', e.message);
  process.exit(1);
});
