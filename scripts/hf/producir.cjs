// scripts/hf/producir.cjs — P6 DKitchen (31/10/2026). SOLO se ejecuta en GitHub Actions.
// Flujo de un reel que es un proyecto HyperFrames propio (reels/<pieza>/hyperframes.json):
//   marca → pistas de audio → carve de la música → hyperframes check → render → masterizado EBU R128 → QC REAL.
// El QC mide; no escribe «aprobado» por defecto. Si algo falla, sale con código 1 y el flujo queda en rojo.
// Uso: node scripts/hf/producir.cjs reels/<pieza> [fps]
'use strict';
const fs = require('fs');
const path = require('path');
const { execFileSync, spawnSync } = require('child_process');

const HF = 'hyperframes@0.8.223';
const raiz = path.resolve(__dirname, '../..');
const carpeta = path.resolve(process.argv[2] || '');
const fps = Number(process.argv[3] || 30);
const g = JSON.parse(fs.readFileSync(path.join(carpeta, 'guion.json'), 'utf8'));
const qc = Object.assign({ lufs: -14, tolerancia_lufs: 1, true_peak_max: -1, lra_max: 11, congelado_max_s: 0.6, negro_max_s: 0.1 }, g.qc || {});
const resultados = [];
const anota = (ok, nombre, detalle) => { resultados.push({ ok, nombre, detalle }); console.log(`[QC] ${ok ? 'OK   ' : 'FALLA'} ${nombre}: ${detalle}`); };

function paso(titulo, cmd, args, opts = {}) {
  console.log(`\n=== ${titulo} ===\n$ ${cmd} ${args.join(' ')}`);
  const r = spawnSync(cmd, args, Object.assign({ cwd: carpeta, stdio: 'inherit', shell: process.platform === 'win32' }, opts));
  return r.status === 0;
}
function ff(args) {
  const r = spawnSync('ffmpeg', ['-hide_banner', '-nostats', ...args], { cwd: carpeta, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
  return (r.stderr || '') + (r.stdout || '');
}
function informe(final) {
  const fallos = resultados.filter((r) => !r.ok).length;
  const txt = [
    '================================================================',
    ' DKITCHEN · CONTROL DE CALIDAD MEDIDO (scripts/hf/producir.cjs)',
    '================================================================',
    `Pieza: ${g.pieza || path.basename(carpeta)} · Motor: ${HF} · ${fps} fps · ${new Date().toISOString()}`,
    `Resultado: ${final ? (fallos ? `NO APTO (${fallos} fallo/s)` : 'APTO TÉCNICAMENTE — pendiente de revisión visual de dirección') : 'INTERRUMPIDO'}`,
    '',
    ...resultados.map((r) => `[${r.ok ? 'OK' : 'FALLA'}] ${r.nombre}: ${r.detalle}`),
    '',
    'Revisión manual obligatoria (no automatizable): contact_sheet.jpg lleva dibujada la caja segura (rojo, x 60–940, y 250–1500);',
    'ningún texto, precio ni CTA puede tocar la franja exterior. La da por buena el director, no este script.',
  ].join('\n');
  fs.writeFileSync(path.join(carpeta, 'control_calidad.txt'), txt + '\n');
  console.log('\n' + txt);
  return fallos;
}
const corta = (motivo) => { anota(false, 'Flujo', motivo); informe(false); process.exit(1); };

// 0. Estructura mínima
for (const f of ['hyperframes.json', 'index.html', 'guion.json']) if (!fs.existsSync(path.join(carpeta, f))) corta(`falta ${f}`);
const html0 = fs.readFileSync(path.join(carpeta, 'index.html'), 'utf8');
const durRaiz = Number((html0.match(/data-composition-id="[^"]+"[^>]*data-duration="([\d.]+)"/) || html0.match(/data-duration="([\d.]+)"/) || [])[1]);
if (Math.abs(durRaiz - Number(g.duracion)) > 0.01) corta(`data-duration de la raíz (${durRaiz}) ≠ guion.json.duracion (${g.duracion})`);

// 1. Marca (fuente única en /marca; se copia, no se edita en el reel)
fs.rmSync(path.join(carpeta, 'marca'), { recursive: true, force: true });
fs.cpSync(path.join(raiz, 'marca'), path.join(carpeta, 'marca'), { recursive: true });

// 2. Pistas de audio (voz por tramos + música)
if (!paso('Pistas de audio', 'node', [path.join(raiz, 'scripts/hf/audio_pistas.cjs'), carpeta], { cwd: raiz })) corta('fallo al generar las pistas de audio (ver audio_log.txt)');
anota(true, 'Pistas de audio', 'voz por tramos y música generadas o reutilizadas (audio_log.txt)');

// 3. Dependencias del proyecto (@hyperframes/core, necesario para el carve)
if (!paso('Dependencias del reel', 'npm', ['install', '--no-audit', '--no-fund'])) corta('npm install del reel');

// 4. Carve de la música contra el grupo de voz (hyperframes-audio, fuerza 0,8)
if (/<audio\b[^>]*\bid="musica"/.test(html0)) {
  const ok = paso('Voiceover carve', 'node', [path.join(raiz, 'scripts/hf/carve.mjs'), '--comp', 'index.html', '--bed', 'musica', '--strength', String(g.carve_fuerza || 0.8)]);
  anota(ok, 'Voiceover carve', ok ? 'escrito en <audio id="musica"> (data-fx-carve + cadena + automatización)' : 'carve.mjs falló');
  if (!ok) corta('carve');
}

// 5. hyperframes check (lint + runtime + layout + movimiento + contraste WCAG)
const chk = spawnSync('npx', ['--yes', HF, 'check', '--json'], { cwd: carpeta, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024, shell: process.platform === 'win32' });
fs.writeFileSync(path.join(carpeta, 'check.json'), chk.stdout || '');
let chkOk = chk.status === 0;
try { const j = JSON.parse(chk.stdout); chkOk = chkOk && j.ok !== false; } catch (e) { /* salida no JSON: vale el código */ }
anota(chkOk, 'hyperframes check', chkOk ? 'sin hallazgos que bloqueen (check.json)' : `con errores (código ${chk.status}); ver check.json`);
if (!chkOk) corta('hyperframes check');

// 6. Render
const crudo = path.join(carpeta, 'reel_crudo.mp4');
if (!paso('Render', 'npx', ['--yes', HF, 'render', '--quality', 'delivery', '--fps', String(fps), '--strict', '-o', crudo])) corta('render');

// 7. Masterizado EBU R128 en dos pasadas (solo el audio; el vídeo se copia)
const salida = path.join(carpeta, 'reel.mp4');
const m1 = ff(['-i', crudo, '-af', `loudnorm=I=${qc.lufs}:TP=${qc.true_peak_max - 0.5}:LRA=${qc.lra_max}:print_format=json`, '-f', 'null', '-']);
const js = m1.slice(m1.lastIndexOf('{'), m1.lastIndexOf('}') + 1);
let med; try { med = JSON.parse(js); } catch (e) { corta('no se pudo medir la sonoridad del render (¿sin audio?)'); }
ff(['-y', '-i', crudo, '-c:v', 'copy', '-af', `loudnorm=I=${qc.lufs}:TP=${qc.true_peak_max - 0.5}:LRA=${qc.lra_max}:measured_I=${med.input_i}:measured_TP=${med.input_tp}:measured_LRA=${med.input_lra}:measured_thresh=${med.input_thresh}:offset=${med.target_offset}:linear=true`, '-ar', '48000', '-c:a', 'aac', '-b:a', '192k', '-movflags', '+faststart', salida]);
if (!fs.existsSync(salida)) corta('masterizado');
fs.unlinkSync(crudo);

// 8. QC medido sobre reel.mp4
const pr = JSON.parse(execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'stream=codec_type,width,height,r_frame_rate:format=duration', '-of', 'json', salida], { encoding: 'utf8' }));
const v = pr.streams.find((s) => s.codec_type === 'video') || {};
const a = pr.streams.find((s) => s.codec_type === 'audio');
const [fn, fd] = String(v.r_frame_rate || '0/1').split('/').map(Number);
const durReal = Number(pr.format.duration);
anota(v.width === 1080 && v.height === 1920, 'Formato', `${v.width}x${v.height} (exigido 1080x1920)`);
anota(Math.abs(fn / fd - fps) < 0.01, 'FPS', `${(fn / fd).toFixed(2)} (exigido ${fps})`);
anota(Math.abs(durReal - g.duracion) <= 0.1, 'Duración', `${durReal.toFixed(2)} s (guion ${g.duracion} s)`);
anota(!!a, 'Pista de audio', a ? 'presente' : 'AUSENTE');

const negros = [...ff(['-i', salida, '-vf', `blackdetect=d=${qc.negro_max_s}:pix_th=0.10`, '-an', '-f', 'null', '-']).matchAll(/black_start:([\d.]+) black_end:([\d.]+)/g)].map((x) => `${x[1]}–${x[2]} s`);
anota(negros.length === 0, 'Fotogramas negros', negros.length ? negros.join(', ') : 'ninguno');

const fz = ff(['-i', salida, '-vf', `freezedetect=n=-60dB:d=${qc.congelado_max_s}`, '-an', '-f', 'null', '-']);
const congelados = [...fz.matchAll(/freeze_start: ([\d.]+)[\s\S]*?freeze_duration: ([\d.]+)/g)].map((x) => `${Number(x[1]).toFixed(2)} s (${Number(x[2]).toFixed(2)} s)`);
anota(congelados.length === 0, `Imagen congelada > ${qc.congelado_max_s} s`, congelados.length ? congelados.join(', ') : 'ninguna');

const eb = ff(['-i', salida, '-vn', '-af', 'ebur128=peak=true', '-f', 'null', '-']);
const resumen = eb.slice(eb.lastIndexOf('Summary:'));
const I = Number((resumen.match(/I:\s+(-?[\d.]+) LUFS/) || [])[1]);
const LRA = Number((resumen.match(/LRA:\s+(-?[\d.]+) LU/) || [])[1]);
const TP = Number((resumen.match(/Peak:\s+(-?[\d.]+) dBFS/) || [])[1]);
anota(Number.isFinite(I) && Math.abs(I - qc.lufs) <= qc.tolerancia_lufs, 'Sonoridad integrada', Number.isFinite(I) ? `${I} LUFS (objetivo ${qc.lufs} ±${qc.tolerancia_lufs})` : 'no medible');
anota(Number.isFinite(TP) && TP <= qc.true_peak_max, 'Pico real', Number.isFinite(TP) ? `${TP} dBTP (máx. ${qc.true_peak_max})` : 'no medible');
anota(Number.isFinite(LRA) && LRA <= qc.lra_max, 'Rango de sonoridad', Number.isFinite(LRA) ? `${LRA} LU (máx. ${qc.lra_max})` : 'no medible');

// 9. Hoja de contactos con la caja segura dibujada (15 fotogramas)
const paso_s = Math.max(1, g.duracion / 15);
ff(['-y', '-i', salida, '-vf', `fps=1/${paso_s.toFixed(3)},drawbox=x=60:y=250:w=880:h=1250:color=red@0.9:t=6,scale=270:480,tile=5x3`, '-frames:v', '1', '-q:v', '3', path.join(carpeta, 'contact_sheet.jpg')]);
anota(fs.existsSync(path.join(carpeta, 'contact_sheet.jpg')), 'Hoja de contactos', 'contact_sheet.jpg (5x3, caja segura en rojo)');
anota(true, 'Tamaño', `${(fs.statSync(salida).size / 1048576).toFixed(2)} MB`);

process.exit(informe(true) ? 1 : 0);
