// scripts/hf/audio_pistas.cjs — P6 DKitchen (31/10/2026, v2)
// Prepara las PISTAS SEPARADAS de un reel HyperFrames (no una mezcla): una locución por tramo
// (audio/voz-<id>.mp3) y la cama musical (audio/musica.mp3). La mezcla la hace HyperFrames (bus de voz + carve).
// Ajusta data-duration de cada <audio id="voz-<id>"> en index.html a la duración real.
//
// ORIGEN DEL AUDIO (decisión de karc0, 31/10): karc0 genera a mano en ElevenLabs y deja los archivos en
//   reels/<pieza>/audio/originales/voz-<id>.mp3  y  reels/<pieza>/audio/originales/musica.mp3
// (instrucciones por reel en su FICHA.md). Este script los procesa siempre desde los originales:
// recorta el silencio inicial y, si una locución no cabe en su ventana, la acelera (máx. 1,15; si no cabe, FALLA).
// La API de ElevenLabs solo se usa con USAR_API_ELEVENLABS=1 (desactivado por defecto).
// Uso: node scripts/hf/audio_pistas.cjs reels/<pieza>
'use strict';
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const carpeta = path.resolve(process.argv[2] || '');
const g = JSON.parse(fs.readFileSync(path.join(carpeta, 'guion.json'), 'utf8'));
const usarApi = process.env.USAR_API_ELEVENLABS === '1';
const key = process.env.ELEVENLABS_API_KEY;
const dirAudio = path.join(carpeta, 'audio');
const dirOrig = path.join(dirAudio, 'originales');
fs.mkdirSync(dirOrig, { recursive: true });
const log = [];
const L = (m) => { console.log('[Audio] ' + m); log.push(m); };
const ATEMPO_MAX = 1.15;
let fallos = 0;

function dur(f) {
  return Number(execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'default=nw=1:nk=1', f], { encoding: 'utf8' }).trim());
}
async function postBinario(ruta, cuerpo, salida) {
  const r = await fetch('https://api.elevenlabs.io' + ruta, { method: 'POST', headers: { 'xi-api-key': key, 'Content-Type': 'application/json', Accept: 'audio/mpeg' }, body: JSON.stringify(cuerpo) });
  if (!r.ok) { L(`ERROR ${ruta.split('?')[0]} → ${r.status} ${(await r.text()).slice(0, 160)}`); return false; }
  fs.writeFileSync(salida, Buffer.from(await r.arrayBuffer()));
  return true;
}
const v = g.voz || {};

(async () => {
  // 1. Locución por tramos
  let html = fs.readFileSync(path.join(carpeta, 'index.html'), 'utf8');
  for (const t of g.tramos_voz || []) {
    const orig = path.join(dirOrig, `voz-${t.id}.mp3`);
    const final = path.join(dirAudio, `voz-${t.id}.mp3`);
    const ventana = Number(t.fin_max) - Number(t.inicio);
    if (!fs.existsSync(orig) && usarApi && key) {
      await postBinario(`/v1/text-to-speech/${v.voice_id}?output_format=mp3_44100_128`, { text: t.texto, model_id: v.modelo || 'eleven_multilingual_v2', voice_settings: v.ajustes }, orig);
    }
    if (fs.existsSync(orig)) {
      const d0 = dur(orig);
      const filtros = ['silenceremove=start_periods=1:start_threshold=-50dB:start_silence=0.05'];
      const tempo = d0 / ventana;
      if (tempo > ATEMPO_MAX) { L(`FALLA tramo ${t.id}: dura ${d0.toFixed(2)} s y su ventana es ${ventana.toFixed(2)} s (habría que acelerarla ×${tempo.toFixed(2)}, máximo ×${ATEMPO_MAX}). Regenerar con más velocidad o pedir al director que amplíe la ventana.`); fallos++; }
      if (tempo > 1) filtros.push(`atempo=${Math.min(tempo, ATEMPO_MAX).toFixed(4)}`);
      execFileSync('ffmpeg', ['-y', '-v', 'error', '-i', orig, '-af', filtros.join(','), '-ar', '48000', '-b:a', '192k', final]);
      L(`Voz ${t.id}: original ${d0.toFixed(2)} s → ${dur(final).toFixed(2)} s (ventana ${ventana.toFixed(2)} s)`);
    } else if (fs.existsSync(final)) {
      L(`Voz ${t.id}: sin original nuevo, se reutiliza la ya procesada (${dur(final).toFixed(2)} s)`);
    } else {
      L(`FALLA: falta audio/originales/voz-${t.id}.mp3 («${t.texto}»). Generarlo en ElevenLabs según la FICHA.`); fallos++; continue;
    }
    const d = Math.min(dur(final), ventana + 0.05).toFixed(2);
    const re = new RegExp(`(<audio\\b[^>]*\\bid="voz-${t.id}"[^>]*>)`);
    const m = html.match(re);
    if (!m) { L(`FALLA: index.html no tiene <audio id="voz-${t.id}">`); fallos++; continue; }
    const inicio = (m[1].match(/data-start="([\d.]+)"/) || [])[1];
    if (Number(inicio) !== Number(t.inicio)) { L(`FALLA: voz-${t.id} empieza en ${inicio} en index.html y en ${t.inicio} en guion.json`); fallos++; }
    html = html.replace(re, m[1].replace(/data-duration="[\d.]+"/, `data-duration="${d}"`));
  }
  fs.writeFileSync(path.join(carpeta, 'index.html'), html);

  // 2. Música: original de karc0 (ElevenLabs Music) → si no, la ya procesada → si no, API opcional → si no, FALLA
  const musOrig = path.join(dirOrig, 'musica.mp3');
  const musica = path.join(dirAudio, 'musica.mp3');
  if (!fs.existsSync(musOrig) && !fs.existsSync(musica) && usarApi && key && g.musica && g.musica.prompt) {
    await postBinario('/v1/music', { prompt: g.musica.prompt, music_length_ms: Math.round(Number(g.duracion) * 1000) + 1000, force_instrumental: true }, musOrig);
  }
  if (fs.existsSync(musOrig)) {
    const dm = dur(musOrig);
    if (dm < Number(g.duracion)) { L(`FALLA: la música dura ${dm.toFixed(1)} s y el reel ${g.duracion} s. Generarla de al menos ${Math.ceil(g.duracion) + 1} s.`); fallos++; }
    fs.copyFileSync(musOrig, musica);
    L(`Música: original de karc0 (${dm.toFixed(1)} s)`);
  } else if (fs.existsSync(musica)) L(`Música: reutilizada (${dur(musica).toFixed(1)} s)`);
  else { L('FALLA: falta audio/originales/musica.mp3. Generarla en ElevenLabs Music según la FICHA.'); fallos++; }

  fs.writeFileSync(path.join(carpeta, 'audio_log.txt'), log.join('\n') + '\n');
  if (fallos) { console.error(`[Audio] ${fallos} fallo(s). Ver audio_log.txt`); process.exit(1); }
})();
