// SOLO en la VM de GitHub Actions (paso «Preparar recursos de la pieza»).
'use strict';
const { chromium, devices } = require('playwright');
const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const SALIDA = path.join(__dirname, 'assets', 'capturas');
const DEMOS = [["cuevas-al-jatib","Cuevas Al-Jatib"],["marisqueria-el-pato-rojo","Marisquería El Pato Rojo"],["cafe-bar-reina-monica","Café Bar Reina Mónica"],["la-parra-baza","Restaurante La Parra"]];
const EXTRA = ["Al-Jatib","Jatib","Pato Rojo","Reina Mónica"];

async function anonimizar(p, nombre) {
  await p.evaluate(({ nombreLocal, extras }) => {
    const rawParts = [
      nombreLocal,
      ...extras,
      ...nombreLocal.split(/\s+/).filter((w) => w.length > 3 && !/^(Restaurante|Hotel|Bar|Café|Cafe|Pizzería|Pizzeria|Tortillería|Tortilleria|Marisquería|Marisqueria|The|Las|Los)$/i.test(w)),
    ].filter(Boolean);
    const spChars = '.*+?^()|[]\\' + '{' + '}' + '$';
    const esc = (s) => s.split('').map((ch) => (spChars.indexOf(ch) >= 0 ? '\\' + ch : ch)).join('');
    const re = new RegExp(rawParts.map(esc).join('|'), 'gi');
    const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    let n;
    while ((n = w.nextNode())) {
      if (re.test(n.nodeValue)) {
        re.lastIndex = 0;
        n.nodeValue = n.nodeValue.replace(re, 'Tu local').replace(/(Tu local\s*)+/g, 'Tu local ');
      }
      if (/\bBaza\b|perdiz|Cúllar|Cullar|Guadix|Almería|Jaén|Granada|Caniles|Huéscar|Zújar/i.test(n.nodeValue)) {
        n.nodeValue = n.nodeValue
          .replace(/\s*en\s+(Baza|Cúllar|Cullar|Guadix|Almería|Jaén|Granada|Caniles|Huéscar|Zújar)\b/gi, '')
          .replace(/\.?\s*La perdiz,?\s*nuestra especialidad\.?/gi, '')
          .replace(/\b(Baza|Cúllar|Cullar|Guadix|Almería|Jaén|Granada|Caniles|Huéscar|Zújar)\b/gi, '');
      }
    }
    for (const img of document.querySelectorAll('img')) {
      const a = (img.alt || '') + ' ' + (img.src || '');
      if (/logo|emblema/i.test(a) || rawParts.some((s) => a.toLowerCase().includes(s.toLowerCase()))) {
        img.style.visibility = 'hidden';
      }
    }
    document.title = 'Carta Digital';
  }, { nombreLocal: nombre, extras: EXTRA });
}

(async () => {
  fs.mkdirSync(SALIDA, { recursive: true });

  // Si falta musica.mp3 propia o es más corta de guion, extender limpiamente desde la cama musical de R4
  const musDst = path.join(__dirname, 'audio', 'originales', 'musica.mp3');
  const musSrc = path.resolve(__dirname, '../lote2-r4-universal-carta-pedidos/audio/originales/musica.mp3');
  const g = JSON.parse(fs.readFileSync(path.join(__dirname, 'guion.json'), 'utf8'));
  const targetSec = Math.ceil(Number(g.duracion || 15) + 1.5);
  if (!fs.existsSync(musDst) && fs.existsSync(musSrc)) {
    fs.mkdirSync(path.dirname(musDst), { recursive: true });
    execFileSync('ffmpeg', [
      '-y', '-v', 'error', '-stream_loop', '2', '-i', musSrc,
      '-t', String(targetSec),
      '-af', `afade=t=in:st=0:d=0.4,afade=t=out:st=${(targetSec - 1.2).toFixed(2)}:d=1.2`,
      '-ar', '48000', '-b:a', '192k', musDst,
    ]);
    console.log('[Preparar] musica.mp3 generada (' + targetSec + ' s)');
  }

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
      if (/Demostración/.test(el.textContent)) el.textContent = 'Lo confirma tu equipo al momento.';
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

  await p.goto(`https://dkitchencorporate.es/demo/panel?local=${slug}&preview=1`, { waitUntil: 'domcontentloaded', timeout: 60000 });
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
