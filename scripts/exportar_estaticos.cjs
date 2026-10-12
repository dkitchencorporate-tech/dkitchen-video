// scripts/exportar_estaticos.cjs — exporta piezas estáticas en la VM de Actions (nunca en local).
// Cada HTML de estaticos/<lote>/ declara su salida con una meta:
//   <meta name="exportar" content="png 1080x1350">                       → <nombre>.png
//   <meta name="exportar" content="png 1080x1350 paginas=1,2,3">          → <nombre>-01.png … (usa location.hash)
//   <meta name="exportar" content="pdf">                                  → <nombre>.pdf (tamaño desde @page del CSS)
// También genera vistas PNG de cada página del PDF (escala 2) para revisar.
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const carpeta = path.resolve(process.argv[2] || '');
const salida = path.join(carpeta, 'salida');
fs.mkdirSync(salida, { recursive: true });
const url = (f, h) => 'file://' + path.join(carpeta, f) + (h ? '#' + h : '');

(async () => {
  const b = await chromium.launch();
  for (const f of fs.readdirSync(carpeta).filter((x) => x.endsWith('.html'))) {
    const base = f.replace(/\.html$/, '');
    const html = fs.readFileSync(path.join(carpeta, f), 'utf8');
    // Capturas de webs reales antes de exportar (12/10, flyer v3): <meta name="capturar" content="img/x.png 390x844 https://…">
    for (const [, cap] of html.matchAll(/<meta name="capturar" content="([^"]+)"/g)) {
      const [destino, dimCap, web] = cap.split(/\s+/);
      const [cw, ch] = dimCap.split('x').map(Number);
      const pc = await b.newPage({ viewport: { width: cw, height: ch }, deviceScaleFactor: 3, isMobile: true, hasTouch: true });
      await pc.goto(web, { waitUntil: 'networkidle', timeout: 90000 }).catch(() => {});
      await pc.waitForTimeout(2500);
      // Cierra avisos de cookies para que no salgan en la captura.
      for (const t of ['Solo esenciales', 'Rechazar', 'Aceptar', 'Entendido']) {
        const bt = pc.getByRole('button', { name: t }).first();
        if (await bt.isVisible().catch(() => false)) { await bt.click().catch(() => {}); break; }
      }
      await pc.waitForTimeout(1500);
      fs.mkdirSync(path.dirname(path.join(carpeta, destino)), { recursive: true });
      await pc.screenshot({ path: path.join(carpeta, destino) });
      fs.copyFileSync(path.join(carpeta, destino), path.join(salida, path.basename(destino)));
      console.log(`[Estáticos] captura ${destino} ← ${web}`);
      await pc.close();
    }
    const meta = (html.match(/<meta name="exportar" content="([^"]+)"/) || [])[1];
    if (!meta) { console.log(`[Estáticos] ${f}: sin meta exportar, se omite`); continue; }
    const [tipo, dim] = meta.split(/\s+/);
    if (tipo === 'png') {
      const [w, h] = dim.split('x').map(Number);
      const pags = ((meta.match(/paginas=([\d,]+)/) || [])[1] || '').split(',').filter(Boolean);
      for (const pg of pags.length ? pags : [null]) {
        const p = await b.newPage({ viewport: { width: w, height: h } });
        await p.goto(url(f, pg), { waitUntil: 'networkidle', timeout: 90000 });
        await p.evaluate(() => document.fonts.ready);
        await p.waitForTimeout(800);
        const nombre = pg ? `${base}-${String(pg).padStart(2, '0')}.png` : `${base}.png`;
        await p.screenshot({ path: path.join(salida, nombre) });
        console.log(`[Estáticos] ${nombre}`);
        await p.close();
      }
    } else if (tipo === 'pdf') {
      const p = await b.newPage();
      await p.goto(url(f), { waitUntil: 'networkidle', timeout: 90000 });
      await p.evaluate(() => document.fonts.ready);
      await p.waitForTimeout(1000);
      await p.pdf({ path: path.join(salida, `${base}.pdf`), printBackground: true, preferCSSPageSize: true });
      console.log(`[Estáticos] ${base}.pdf`);
      // Cada cara en su propio PDF (las imprentas suelen pedirlas por separado) y en PNG de alta resolución (~600 ppp).
      const caras = await p.$$('.cara');
      for (let i = 0; i < caras.length; i++) {
        await p.pdf({ path: path.join(salida, `${base}-cara${i + 1}.pdf`), printBackground: true, preferCSSPageSize: true, pageRanges: String(i + 1) });
      }
      await p.close();
      const hd = await (await b.newContext({ deviceScaleFactor: 6.3 })).newPage();
      await hd.goto(url(f), { waitUntil: 'networkidle', timeout: 90000 });
      await hd.evaluate(() => document.fonts.ready);
      await hd.waitForTimeout(800);
      const carasHd = await hd.$$('.cara');
      for (let i = 0; i < carasHd.length; i++) {
        await carasHd[i].screenshot({ path: path.join(salida, `${base}-cara${i + 1}.png`) });
      }
      await hd.close();
    }
  }
  await b.close();
})().catch((e) => { console.error('[Estáticos] ERROR', e); process.exit(1); });
