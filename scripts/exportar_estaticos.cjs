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
      // vistas de revisión de cada cara
      const caras = await p.$$('.cara');
      await p.setViewportSize({ width: 1200, height: 1700 });
      for (let i = 0; i < caras.length; i++) {
        await caras[i].screenshot({ path: path.join(salida, `${base}-cara${i + 1}.png`) });
      }
      await p.close();
    }
  }
  await b.close();
})().catch((e) => { console.error('[Estáticos] ERROR', e); process.exit(1); });
