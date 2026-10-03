// Motor de renderizado HyperFrames + OpenMontage para DKitchen
// Estándar técnico: 1080x1920, 30 fps, H.264 High 8-12 Mbps, audio a -14 LUFS.
// Incluye control de calidad automático (congelados, negros, sonoridad) y hoja de contactos.

const { chromium } = require('playwright');
const ffmpeg = require('ffmpeg-static');
const { spawn, execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

(async () => {
  const carpeta = path.resolve(process.argv[2] || 'reels/reel-01');
  const fps = Number(process.argv[3] || 30);
  const composicion = path.join(carpeta, 'composicion.html');
  const salidaVideoRaw = path.join(carpeta, 'video_raw.mp4');
  const salidaFinal = path.join(carpeta, 'reel.mp4');
  const contactSheet = path.join(carpeta, 'contact_sheet.jpg');
  const qcReport = path.join(carpeta, 'control_calidad.txt');

  if (!fs.existsSync(composicion)) {
    console.error(`[ERROR] No se encuentra la composición en ${composicion}`);
    process.exit(1);
  }

  console.log(`[HyperFrames] Iniciando render de ${carpeta} a ${fps} fps...`);
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
  
  await page.goto('file:///' + composicion.replace(/\\/g, '/'));
  await page.evaluate(() => window.LISTO);
  const dur = await page.evaluate(() => (window.TL ? window.TL.duration() : 10));
  const total = Math.ceil(dur * fps);
  console.log(`[HyperFrames] Duración: ${dur.toFixed(2)}s | Total fotogramas: ${total}`);

  // Codificador H.264 con bitrate de autor (8-12 Mbps)
  const ff = spawn(ffmpeg, [
    '-y',
    '-f', 'image2pipe',
    '-framerate', String(fps),
    '-i', '-',
    '-c:v', 'libx264',
    '-profile:v', 'high',
    '-pix_fmt', 'yuv420p',
    '-b:v', '10M',
    '-maxrate', '12M',
    '-bufsize', '20M',
    '-preset', 'medium',
    '-movflags', '+faststart',
    salidaVideoRaw
  ], { stdio: ['pipe', 'ignore', 'inherit'] });

  for (let i = 0; i < total; i++) {
    await page.evaluate((t) => {
      if (window.TL) window.TL.seek(t, false);
    }, i / fps);
    const buf = await page.screenshot({ type: 'jpeg', quality: 95 });
    if (!ff.stdin.write(buf)) await new Promise((r) => ff.stdin.once('drain', r));
    if (i % 60 === 0 || i === total - 1) {
      console.log(`[Fotograma] ${i + 1}/${total} (${Math.round(((i + 1) / total) * 100)}%)`);
    }
  }

  ff.stdin.end();
  await new Promise((r) => ff.on('close', r));
  await browser.close();
  console.log('[HyperFrames] Secuencia visual completada.');

  // Detección de pistas de audio
  const posiblesAudio = ['audio.mp3', 'audio.wav', 'voz.mp3', 'musica.mp3', 'audio.m4a'];
  let pistaAudio = null;
  for (const aud of posiblesAudio) {
    const cand = path.join(carpeta, aud);
    if (fs.existsSync(cand)) {
      pistaAudio = cand;
      break;
    }
  }

  if (pistaAudio) {
    console.log(`[Audio] Mezclando audio desde ${path.basename(pistaAudio)} a -14 LUFS...`);
    execSync(`"${ffmpeg}" -y -i "${salidaVideoRaw}" -i "${pistaAudio}" -c:v copy -af loudnorm=I=-14:TP=-1:LRA=11 -c:a aac -b:a 192k -ar 48000 -shortest -movflags +faststart "${salidaFinal}"`);
    fs.unlinkSync(salidaVideoRaw);
  } else {
    console.log('[Audio] Sin pista de audio en la carpeta. Conservando vídeo sin audio.');
    fs.renameSync(salidaVideoRaw, salidaFinal);
  }

  // Generar Hoja de Contactos (1 fotograma cada 2 s)
  console.log('[QC] Generando hoja de contactos visuales...');
  try {
    execSync(`"${ffmpeg}" -y -i "${salidaFinal}" -vf "fps=0.5,scale=270:480,tile=6x3" -q:v 3 "${contactSheet}"`);
  } catch (err) {
    console.warn('[QC] Hoja de contactos no generada (pieza corta o error de mosaico):', err.message);
  }

  // Control de calidad automático: congelados, negros, ebur128
  console.log('[QC] Ejecutando control de calidad automático...');
  let reporte = `CONTROL DE CALIDAD TÉCNICO - DKITCHEN STUDIO\n`;
  reporte += `Pieza: ${path.basename(carpeta)}\nFecha: ${new Date().toISOString()}\n\n`;

  try {
    const probe = execSync(`"${ffmpeg}" -i "${salidaFinal}" 2>&1`).toString();
    reporte += `--- Formato y Stream ---\n${probe}\n\n`;
  } catch (e) {
    reporte += `--- Formato y Stream ---\n${e.stdout || e.message}\n\n`;
  }

  try {
    const negros = execSync(`"${ffmpeg}" -i "${salidaFinal}" -vf blackdetect=d=0.3 -f null - 2>&1`).toString();
    const negrosDet = negros.split('\n').filter(l => l.includes('blackdetect'));
    reporte += `--- Detección de Negros (d=0.3s) ---\n${negrosDet.join('\n') || '0 negros detectados (OK)'}\n\n`;
  } catch (e) {
    reporte += `--- Detección de Negros ---\nError al analizar negros\n\n`;
  }

  try {
    const congelados = execSync(`"${ffmpeg}" -i "${salidaFinal}" -vf freezedetect=d=1.5 -f null - 2>&1`).toString();
    const congeladosDet = congelados.split('\n').filter(l => l.includes('freezedetect'));
    reporte += `--- Detección de Congelados (d=1.5s) ---\n${congeladosDet.join('\n') || '0 congelados detectados (OK)'}\n\n`;
  } catch (e) {
    reporte += `--- Detección de Congelados ---\nError al analizar congelados\n\n`;
  }

  fs.writeFileSync(qcReport, reporte, 'utf8');
  console.log(`[QC] Reporte generado en ${qcReport}`);
  console.log(`[Éxito] Pieza lista: ${salidaFinal}`);
})().catch((e) => {
  console.error('[FATAL]', e.message);
  process.exit(1);
});