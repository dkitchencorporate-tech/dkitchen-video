// scripts/hf/audio_pistas.cjs — P6 DKitchen (31/10/2026)
// Genera las PISTAS SEPARADAS de un reel HyperFrames (no una mezcla): una locución por tramo
// (audio/voz-<id>.mp3), la cama musical (audio/musica.mp3) y deja la mezcla a HyperFrames
// (bus de voz + carve + automatización). Ajusta data-duration de cada <audio id="voz-<id>"> en index.html.
// Uso: node scripts/hf/audio_pistas.cjs reels/<pieza>
// Si audio/voz-<id>.mp3 ya existe (generado y guardado en un render anterior) se reutiliza: misma voz y cero créditos.
// FORZAR_AUDIO=1 regenera todo.
'use strict';
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const carpeta = path.resolve(process.argv[2] || '');
const g = JSON.parse(fs.readFileSync(path.join(carpeta, 'guion.json'), 'utf8'));
const key = process.env.ELEVENLABS_API_KEY;
const forzar = process.env.FORZAR_AUDIO === '1';
const dirAudio = path.join(carpeta, 'audio');
fs.mkdirSync(dirAudio, { recursive: true });
const log = [];
const L = (m) => { console.log('[Audio] ' + m); log.push(m); };
const ATEMPO_MAX = 1.15;
let fallos = 0;

function dur(f) {
  return Number(execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'default=nw=1:nk=1', f], { encoding: 'utf8' }).trim());
}

async function postBinario(ruta, cuerpo, salida) {
  const r = await fetch('https://api.elevenlabs.io' + ruta, {
    method: 'POST',
    headers: { 'xi-api-key': key, 'Content-Type': 'application/json', Accept: 'audio/mpeg' },
    body: JSON.stringify(cuerpo),
  });
  if (!r.ok) { L(`ERROR ${ruta.split('?')[0]} → ${r.status} ${(await r.text()).slice(0, 160)}`); return false; }
  fs.writeFileSync(salida, Buffer.from(await r.arrayBuffer()));
  return true;
}

(async () => {
  if (!key) { console.error('[Audio] Falta ELEVENLABS_API_KEY'); process.exit(1); }
  const v = g.voz || {};
  if (!v.voice_id) { console.error('[Audio] guion.json sin voz.voice_id'); process.exit(1); }
  if (v.public_owner_id) {
    const r = await fetch(`https://api.elevenlabs.io/v1/voices/add/${v.public_owner_id}/${v.voice_id}`, { method: 'POST', headers: { 'xi-api-key': key, 'Content-Type': 'application/json' }, body: JSON.stringify({ new_name: v.nombre || 'Voz DKitchen' }) });
    L(`Alta de voz pública ${v.nombre}: ${r.status}`);
  }

  // 1. Locución por tramos
  let html = fs.readFileSync(path.join(carpeta, 'index.html'), 'utf8');
  for (const t of g.tramos_voz || []) {
    const final = path.join(dirAudio, `voz-${t.id}.mp3`);
    const ventana = Number(t.fin_max) - Number(t.inicio);
    if (forzar || !fs.existsSync(final)) {
      const crudo = path.join(dirAudio, `_crudo-${t.id}.mp3`);
      const ok = await postBinario(`/v1/text-to-speech/${v.voice_id}?output_format=mp3_44100_128`, { text: t.texto, model_id: v.modelo || 'eleven_multilingual_v2', voice_settings: v.ajustes || { stability: 0.45, similarity_boost: 0.8, style: 0.35, use_speaker_boost: true, speed: 1.08 } }, crudo);
      if (!ok) { fallos++; continue; }
      const d0 = dur(crudo);
      const filtros = ['silenceremove=start_periods=1:start_threshold=-50dB:start_silence=0.05'];
      const tempo = d0 / ventana;
      if (tempo > ATEMPO_MAX) { L(`FALLA tramo ${t.id}: dura ${d0.toFixed(2)} s y su ventana es ${ventana.toFixed(2)} s (haría falta atempo ${tempo.toFixed(2)} > ${ATEMPO_MAX}). Acorta el texto o amplía la ventana.`); fallos++; }
      if (tempo > 1) filtros.push(`atempo=${tempo.toFixed(4)}`);
      execFileSync('ffmpeg', ['-y', '-v', 'error', '-i', crudo, '-af', filtros.join(','), '-ar', '48000', '-b:a', '192k', final]);
      fs.unlinkSync(crudo);
      L(`Voz ${t.id}: ${d0.toFixed(2)} s → ${dur(final).toFixed(2)} s (ventana ${ventana.toFixed(2)} s)`);
    } else {
      L(`Voz ${t.id}: reutilizada (${dur(final).toFixed(2)} s)`);
    }
    // Ajustar el clip en la composición: mismo inicio que el guion y duración real
    const d = Math.min(dur(final), ventana + 0.05).toFixed(2);
    const re = new RegExp(`(<audio\\b[^>]*\\bid="voz-${t.id}"[^>]*>)`);
    const m = html.match(re);
    if (!m) { L(`FALLA: index.html no tiene <audio id="voz-${t.id}">`); fallos++; continue; }
    const inicio = (m[1].match(/data-start="([\d.]+)"/) || [])[1];
    if (Number(inicio) !== Number(t.inicio)) { L(`FALLA: voz-${t.id} empieza en ${inicio} en index.html y en ${t.inicio} en guion.json`); fallos++; }
    html = html.replace(re, m[1].replace(/data-duration="[\d.]+"/, `data-duration="${d}"`));
  }
  fs.writeFileSync(path.join(carpeta, 'index.html'), html);

  // 2. Música (ElevenLabs Music, licencia comercial del plan) con reserva del repo
  const musica = path.join(dirAudio, 'musica.mp3');
  if (g.musica && (forzar || !fs.existsSync(musica))) {
    const ok = g.musica.prompt && await postBinario('/v1/music', { prompt: g.musica.prompt, music_length_ms: Math.round(Number(g.duracion) * 1000) + 1000, force_instrumental: true }, musica);
    if (ok) L(`Música ElevenLabs: ${dur(musica).toFixed(1)} s`);
    else if (g.musica.fallback && fs.existsSync(path.resolve(g.musica.fallback))) { fs.copyFileSync(path.resolve(g.musica.fallback), musica); L(`Música: reserva ${g.musica.fallback} (revisar licencia antes de publicar)`); }
    else { L('FALLA: sin música'); fallos++; }
  } else if (fs.existsSync(musica)) L(`Música: reutilizada (${dur(musica).toFixed(1)} s)`);

  fs.writeFileSync(path.join(carpeta, 'audio_log.txt'), log.join('\n') + '\n');
  if (fallos) { console.error(`[Audio] ${fallos} fallo(s). Ver audio_log.txt`); process.exit(1); }
})();
