// Graba nuestras demos funcionando (fotograma a fotograma, 30 fps) en la VM de GitHub Actions.
// preparar.cjs del reel: require('../../scripts/…') no; este archivo se copia en el reel y exporta clips pedidos en clips.json.
const { chromium } = require(process.env.DK_PW || 'playwright');
const fs = require('fs'), path = require('path'); const { execFileSync } = require('child_process');
const R = __dirname, PRUEBA = process.env.PRUEBA === '1';
const pedir = JSON.parse(fs.readFileSync(path.join(R, 'clips.json'), 'utf8'));
const W = 393, H = 798;
const ease = (t) => t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
const LIMPIA = `(() => {
  const fuera = (re, max) => { const e = [...document.querySelectorAll('div,aside,section,nav')].filter(d => re.test(d.innerText || '') && d.innerText.length < max).pop(); if (!e) return; let x = e; while (x && x !== document.body && !/fixed|sticky/.test(getComputedStyle(x).position)) x = x.parentElement; (x && x !== document.body ? x : e).style.setProperty('display', 'none', 'important'); };
  fuera(/Usamos cookies propias/, 400); fuera(/Quieres tu carta así/, 120); fuera(/Cambiar diseño/, 80); fuera(/^Volver a DKitchen$/, 40); fuera(/Panel en vivo de Casa Brasa/, 220);
  const v = [...document.querySelectorAll('button')].find(b => b.innerText.trim() === 'Visto'); if (v) { let x = v; while (x && getComputedStyle(x).position !== 'fixed') x = x.parentElement; if (x) x.style.setProperty('visibility', 'hidden', 'important'); }
  if (!document.getElementById('dk-st')) { const s = document.createElement('style'); s.id = 'dk-st'; s.textContent = '::-webkit-scrollbar{display:none!important}html{scroll-behavior:auto!important}*{caret-color:transparent!important}'; document.head.append(s); }
})()`;
(async () => {
  const b = await chromium.launch(); const dir = path.join(R, 'assets/video'); fs.mkdirSync(dir, { recursive: true });
  for (const n of pedir) {
    const cx = await b.newContext({ viewport: { width: W, height: H }, deviceScaleFactor: PRUEBA ? 1 : 2.5, locale: 'es-ES', timezoneId: 'Europe/Madrid' });
    const p = await cx.newPage(); const tmp = path.join(R, '_f_' + n); fs.rmSync(tmp, { recursive: true, force: true }); fs.mkdirSync(tmp);
    let k = 0; const f = async () => p.screenshot({ path: path.join(tmp, String(k++).padStart(4, '0') + '.jpg'), type: 'jpeg', quality: 92, timeout: 60000 });
    const hold = async (c) => { for (let i = 0; i < (PRUEBA ? 1 : c); i++) await f(); };
    const scroll = async (a, z, c) => { const N = PRUEBA ? 2 : c; for (let i = 0; i < N; i++) { await p.evaluate((y) => window.scrollTo(0, y), a + (z - a) * ease(i / (N - 1))); await f(); } };
    const ir = async (u, w = 6000) => { await p.goto(u, { waitUntil: 'domcontentloaded', timeout: 90000 }); await p.waitForTimeout(w); await p.evaluate(LIMPIA); };
    // recorrido previo para que carguen las fotos diferidas
    const precarga = async (h) => { for (let y = 0; y < h; y += 500) { await p.evaluate((v) => window.scrollTo(0, v), y); await p.waitForTimeout(250); } await p.waitForTimeout(800); await p.evaluate(LIMPIA); };
    const clic = async (re, o = {}) => { const l = p.getByText(re, o); const c = await l.count(); let done = false; for (let i = o.ultimo ? c - 1 : 0; i >= 0 && i < c && !done; i += o.ultimo ? -1 : 1) { if (await l.nth(i).isVisible().catch(() => false)) { const q = await l.nth(i).boundingBox(); if (q) { const x = q.x + Math.min(q.width, 360) / 2, y = q.y + q.height / 2; for (let z = 0; z < (PRUEBA ? 0 : 9); z++) { await p.evaluate(([x, y, z]) => { let d = document.getElementById('dk-toque'); if (!d) { d = document.createElement('div'); d.id = 'dk-toque'; d.style.cssText = 'position:fixed;width:54px;height:54px;border-radius:50%;z-index:2147483647;pointer-events:none;background:rgba(255,255,255,.55);border:2px solid rgba(217,178,92,.95);box-shadow:0 4px 18px rgba(0,0,0,.35)'; document.body.append(d); } d.style.left = (x - 27) + 'px'; d.style.top = (y - 27) + 'px'; d.style.transform = 'scale(' + (z < 5 ? 1.35 - z * .1 : .85 + (z - 5) * .03) + ')'; d.style.opacity = Math.min(1, z / 3 + .2); }, [x, y, z]); await f(); } await p.evaluate(() => { const d = document.getElementById('dk-toque'); if (d) d.remove(); }); } await l.nth(i).click({ timeout: 4000 }); done = true; } } if (!done) throw new Error(n + ': no encuentro ' + re); };
    const top = (t) => p.evaluate((t) => { const e = [...document.querySelectorAll('h1,h2,h3,h4')].find(x => x.innerText.trim().toLowerCase().startsWith(t.toLowerCase())); return e ? e.getBoundingClientRect().top + scrollY : 0; }, t);
    const C = {
      baco: async () => { await ir('https://dkitchencorporate.es/demo/carta?plantilla=tapas&muestra=local'); await precarga(3500); const y = await top('Para Compartir'); await scroll(y - 60, y + 1500, 165); },
      bite: async () => { await ir('https://dkitchencorporate.es/demo/carta?plantilla=burger&muestra=local'); await precarga(3500); const y = await top('Entrantes'); await scroll(y - 60, y + 1500, 165); },
      sff: async () => { await ir('https://dkitchencorporate.es/m/seven-food-fries?preview=1'); await precarga(3500); const y = await top('Loaded fries'); await scroll(Math.max(0, y - 120), y + 1450, 165); },
      panel: async () => { await ir('https://dkitchencorporate.es/demo/panel?pestana=carta'); await p.evaluate(() => { const h = [...document.querySelectorAll('h1,h2,h3')].find(x => x.innerText.trim() === 'Platos'); window.scrollTo(0, h.getBoundingClientRect().top + scrollY - 130); }); await p.evaluate(LIMPIA); await hold(26); await clic('Editar', { exact: true }); await p.evaluate(LIMPIA); await hold(20); const i = p.locator('input[placeholder^="Precio"]').first(); await i.click(); await hold(6); for (const v of ['9.5', '9.', '9', '', '1', '10', '10.', '10.5', '10.50']) { await i.fill(v); await p.evaluate(LIMPIA); await hold(3); } await hold(40); },
      sala: async () => { await ir('https://dkitchencorporate.es/m/seven-food-fries?preview=1'); await precarga(2000); const y = await top('Loaded fries'); await scroll(y - 100, y + 120, 18); await clic('Camarero', { exact: true, ultimo: true }); await p.waitForTimeout(700); await hold(16); await p.locator('input[placeholder*="N"]').first().fill('4').catch(() => {}); await hold(34); await ir('https://dkitchencorporate.es/m/seven-food-fries?preview=1', 4500); await hold(5); await clic('Reservar', { exact: true, ultimo: true }); await p.waitForTimeout(700); await hold(45); },
      wb: async () => { await ir('https://wingboss.dkitchencorporate.es/', 8000); await precarga(4000); const y = await top('Combos'); await scroll(y - 110, y + 1500, 165); },
      sf: async () => { await ir('https://sevenfood.dkitchencorporate.es/', 8000); await precarga(4000); const y = await top('Patatas gourmet'); await scroll(y - 110, y + 1500, 165); },
      bk: async () => { await ir('https://bokadipan.dkitchencorporate.es/', 8000); await precarga(4000); const y = await top('Bocadillos'); await scroll(y - 110, y + 1500, 165); },
      flujo: async () => { await ir('https://bokadipan.dkitchencorporate.es/', 8000); await precarga(3000); const y = await top('Bokadi Serrano'); await scroll(y - 620, y - 330, 24); await hold(6); await clic(/PEDIR AHORA/i); await p.waitForTimeout(600); await hold(18); await clic(/Queso Fundido/, { ultimo: true }); await p.waitForTimeout(250); await hold(14); await clic(/Bacon Crujiente/, { ultimo: true }); await p.waitForTimeout(250); await hold(16); await clic(/AÑADIR AL PEDIDO/i); await p.waitForTimeout(900); await hold(34); await clic(/TRAMITAR/i); await p.waitForTimeout(1500); const g = await p.getByText(/PASARELA DE PAGO/i).first(); await g.click({ timeout: 4000 }); await p.waitForTimeout(2200); await hold(48); },
    };
    await C[n]();
    if (!PRUEBA) { execFileSync('ffmpeg', ['-y', '-v', 'error', '-framerate', '30', '-i', path.join(tmp, '%04d.jpg'), '-vf', 'scale=900:-2', '-c:v', 'libx264', '-preset', 'medium', '-crf', '17', '-g', '6', '-pix_fmt', 'yuv420p', '-an', path.join(dir, n + '.mp4')]); fs.rmSync(tmp, { recursive: true, force: true }); }
    console.log(n, k, 'fotogramas', (k / 30).toFixed(2) + ' s'); await cx.close();
  }
  await b.close();
})().catch((e) => { console.error('GRABACIÓN', e.message.slice(0, 400)); process.exit(1); });
