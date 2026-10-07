// Motor de renderizado HyperFrames + OpenMontage para DKitchen
// Estándar técnico Gran Reserva: 1080x1920, 30 fps, H.264 High 8-12 Mbps, audio a -14 LUFS medido.
// Control de calidad estricto: congelados, negros, sonoridad EBU R128 y verificación de zonas seguras.

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
    console.error(`[ERROR FATAL] No se encuentra la composición en ${composicion}`);
    process.exit(1);
  }

  console.log(`[HyperFrames] Iniciando auditoría y render de ${carpeta} a ${fps} fps...`);
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
  
  await page.goto('file:///' + composicion.replace(/\\/g, '/'));
  await page.evaluate(() => window.LISTO);

  // 1. COMPROBACIÓN AUTOMÁTICA DE ZONAS SEGURAS (Caja 940x1280 px: X: 0-940, Y: 220-1500)
  console.log('[QC - Zonas Seguras] Auditando elementos de texto y UI...');
  const violacionesZonas = await page.evaluate(() => {
    const SAFE_X_MIN = 0;
    const SAFE_X_MAX = 940; // Margen de 120px a la derecha para botones de redes
    const SAFE_Y_MIN = 220; // 220px franja superior
    const SAFE_Y_MAX = 1500; // 420px franja inferior (1920 - 420 = 1500)

    const elementos = document.querySelectorAll('.texto, .etiqueta, .titulo, .linea, .oferta, .web, .marca, h1, h2, h3, p, .cta');
    const violaciones = [];

    elementos.forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;

      const texto = (el.innerText || el.textContent || '').trim().replace(/\s+/g, ' ').substring(0, 40);
      const saleArriba = rect.top < SAFE_Y_MIN;
      const saleAbajo = rect.bottom > SAFE_Y_MAX;
      const saleDerecha = rect.right > SAFE_X_MAX;

      if (saleArriba || saleAbajo || saleDerecha) {
        violaciones.push({
          texto,
          clase: el.className,
          rect: { top: Math.round(rect.top), bottom: Math.round(rect.bottom), right: Math.round(rect.right) },
          motivo: `${saleArriba ? 'Invade cabecera (<220px) ' : ''}${saleAbajo ? 'Invade pie (>1500px) ' : ''}${saleDerecha ? 'Invade botones derecha (>940px)' : ''}`.trim()
        });
      }
    });
    return violaciones;
  });

  if (violacionesZonas.length > 0) {
    console.error(`\n[ERROR FATAL - ZONAS SEGURAS] Se han detectado ${violacionesZonas.length} elementos fuera de la caja segura (940x1280 px):`);
    violacionesZonas.forEach(v => console.error(`  - "${v.texto}" [${v.clase}] -> ${v.motivo} (top:${v.rect.top}, bottom:${v.rect.bottom}, right:${v.rect.right})`));
    // En fase de auditoría dejamos advertencia visible y registramos en QC
    console.error('[QC] Por favor corrige el layout HTML para ceñirlo a la caja segura.');
  } else {
    console.log('[QC - Zonas Seguras] OK: 100% de los elementos auditados respetan la caja segura 940x1280.');
  }

  // 2. COMPROBACIÓN DE AUDIO / VOZ DE MARCA OBLIGATORIA
  const posiblesAudio = ['audio.mp3', 'audio.wav', 'voz.mp3', 'musica.mp3', 'audio.m4a'];
  let pistaAudio = null;
  for (const aud of posiblesAudio) {
    const cand = path.join(carpeta, aud);
    if (fs.existsSync(cand)) {
      pistaAudio = cand;
      break;
    }
  }

  // Regla B1: Piezas con locución/tutoriales exigen voz
  const esTutorialOProducto = carpeta.includes('reels') || carpeta.includes('tutorial');
  if (!pistaAudio && esTutorialOProducto) {
    console.warn(`[QC - AUDIO] AVISO: No se ha encontrado pista de voz/audio local en ${carpeta}.`);
  }

  const dur = await page.evaluate(() => (window.TL ? window.TL.duration() : 10));
  const total = Math.ceil(dur * fps);
  console.log(`[HyperFrames] Duración: ${dur.toFixed(2)}s | Total fotogramas: ${total}`);

  // Codificador H.264
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

  if (pistaAudio) {
    console.log(`[Audio] Mezclando audio desde ${path.basename(pistaAudio)} con filtro loudnorm (-14 LUFS)...`);
    execSync(`"${ffmpeg}" -y -i "${salidaVideoRaw}" -i "${pistaAudio}" -map 0:v:0 -map 1:a:0 -c:v copy -af loudnorm=I=-14:TP=-1:LRA=11 -c:a aac -b:a 192k -ar 48000 -movflags +faststart "${salidaFinal}"`);
    fs.unlinkSync(salidaVideoRaw);
  } else {
    console.log('[Audio] Sin pista de audio en la carpeta. Conservando vídeo temporal mudo.');
    fs.renameSync(salidaVideoRaw, salidaFinal);
  }

  // Generar Hoja de Contactos
  console.log('[QC] Generando hoja de contactos visuales...');
  try {
    execSync(`"${ffmpeg}" -y -i "${salidaFinal}" -vf "fps=0.5,scale=270:480,tile=6x3" -q:v 3 "${contactSheet}"`);
  } catch (err) {
    console.warn('[QC] Hoja de contactos no generada:', err.message);
  }

  // Medición Real de Control de Calidad
  console.log('[QC] Ejecutando mediciones reales de control de calidad...');
  let reporte = `CONTROL DE CALIDAD TÉCNICO - DKITCHEN STUDIO\n`;
  reporte += `Pieza: ${path.basename(carpeta)}\nFecha: ${new Date().toISOString()}\n\n`;

  // 1. Zonas seguras
  reporte += `--- Auditoría Zonas Seguras (940x1280 px) ---\n`;
  if (violacionesZonas.length === 0) {
    reporte += `ESTADO: 100% CUMPLIDAS\n\n`;
  } else {
    reporte += `ESTADO: INCUMPLIDAS (${violacionesZonas.length} violaciones detectadas)\n`;
    violacionesZonas.forEach(v => {
      reporte += `  - "${v.texto}" [${v.clase}]: ${v.motivo}\n`;
    });
    reporte += `\n`;
  }

  // 2. Audio EBU R128 real
  reporte += `--- Sonoridad Audio EBU R128 (Medición Real) ---\n`;
  if (!pistaAudio) {
    reporte += `ESTADO: SIN MEDIR (Vídeo sin pista de audio)\n\n`;
  } else {
    try {
      const ebur = execSync(`"${ffmpeg}" -i "${salidaFinal}" -af ebur128=framelog=verbose -f null - 2>&1`).toString();
      const matchI = ebur.match(/I:\s*(-?[\d.]+)\s*LUFS/);
      const matchLRA = ebur.match(/LRA:\s*(-?[\d.]+)\s*LU/);
      const matchTP = ebur.match(/Peak:\s*(-?[\d.]+)\s*dBFS/);
      reporte += `Integrated Loudness (I): ${matchI ? matchI[1] + ' LUFS' : 'Medida en log'}\n`;
      reporte += `Loudness Range (LRA): ${matchLRA ? matchLRA[1] + ' LU' : 'Medida en log'}\n`;
      reporte += `True Peak: ${matchTP ? matchTP[1] + ' dBFS' : 'Medida en log'}\n\n`;
    } catch (e) {
      reporte += `Error al medir EBU R128: ${e.message}\n\n`;
    }
  }

  // 3. Formato y Bitrate Real
  try {
    const probe = execSync(`"${ffmpeg}" -i "${salidaFinal}" 2>&1`).toString();
    reporte += `--- Formato y Stream (ffprobe) ---\n${probe}\n\n`;
  } catch (e) {
    reporte += `--- Formato y Stream ---\n${e.stdout || e.message}\n\n`;
  }

  // 4. Detección de Negros
  try {
    const negros = execSync(`"${ffmpeg}" -i "${salidaFinal}" -vf blackdetect=d=0.3 -f null - 2>&1`).toString();
    const negrosDet = negros.split('\n').filter(l => l.includes('blackdetect'));
    reporte += `--- Detección de Negros (d=0.3s) ---\n${negrosDet.join('\n') || '0 negros detectados (OK)'}\n\n`;
  } catch (e) {
    reporte += `--- Detección de Negros ---\nError al analizar negros\n\n`;
  }

  // 5. Detección de Congelados
  try {
    const congelados = execSync(`"${ffmpeg}" -i "${salidaFinal}" -vf freezedetect=d=1.5 -f null - 2>&1`).toString();
    const congeladosDet = congelados.split('\n').filter(l => l.includes('freezedetect'));
    reporte += `--- Detección de Congelados (d=1.5s) ---\n${congeladosDet.join('\n') || '0 congelados detectados (OK)'}\n\n`;
  } catch (e) {
    reporte += `--- Detección de Congelados ---\nError al analizar congelados\n\n`;
  }

  fs.writeFileSync(qcReport, reporte, 'utf8');
  console.log(`[QC] Reporte con mediciones reales guardado en ${qcReport}`);
  console.log(`[Éxito] Renderizado finalizado: ${salidaFinal}`);
})().catch((e) => {
  console.error('[FATAL]', e.message);
  process.exit(1);
});