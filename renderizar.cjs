// Renderizador ligero estilo HyperFrames (OpenMontage): abre la composición HTML en Chrome sin
// ventana, coloca la línea de tiempo GSAP (window.TL) en cada fotograma, hace captura y la
// pasa a ffmpeg. Uso: node renderizar.cjs <carpeta-del-reel> [fps=30]
// Requisitos (una vez, en una carpeta de trabajo): npm i playwright ffmpeg-static
const { chromium } = require('playwright');
const ffmpeg = require('ffmpeg-static');
const { spawn } = require('child_process');
const path = require('path');

(async () => {
  const carpeta = path.resolve(process.argv[2] || 'reels/reel-01');
  const fps = Number(process.argv[3] || 30);
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  await p.goto('file:///' + path.join(carpeta, 'composicion.html').replace(/\\/g, '/'));
  await p.evaluate(() => window.LISTO);
  const dur = await p.evaluate(() => window.TL.duration());
  const total = Math.ceil(dur * fps);
  const salida = path.join(carpeta, 'reel.mp4');
  const ff = spawn(ffmpeg, ['-y', '-f', 'image2pipe', '-framerate', String(fps), '-i', '-', '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-preset', 'medium', '-crf', '20', '-movflags', '+faststart', salida], { stdio: ['pipe', 'ignore', 'inherit'] });
  for (let i = 0; i < total; i++) {
    await p.evaluate((t) => window.TL.seek(t, false), i / fps);
    const buf = await p.screenshot({ type: 'jpeg', quality: 92 });
    if (!ff.stdin.write(buf)) await new Promise((r) => ff.stdin.once('drain', r));
    if (i % 60 === 0) console.log(`fotograma ${i}/${total}`);
  }
  ff.stdin.end();
  await new Promise((r) => ff.on('close', r));
  await b.close();
  console.log('listo:', salida, `(${dur.toFixed(1)} s, ${total} fotogramas)`);
})().catch((e) => { console.error('ERROR', e.message); process.exit(1); });
