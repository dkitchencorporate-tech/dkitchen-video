// scripts/audio_elevenlabs_completo.cjs
// Banda sonora 100 % ElevenLabs para una pieza: música original (Music API), efectos a medida
// (Sound Effects API) y locución por tramos (TTS) con una voz elegida en guion.json.
// Mezcla: la voz comprime la música (sidechain), efectos en cada corte, -14 LUFS.
// Uso: node scripts/audio_elevenlabs_completo.cjs reels/<pieza>
// Si una API falla, usa los recursos del repo (assets/audio, assets/sfx) y lo deja en audio_log.txt.
const fs = require('fs');
const path = require('path');
const https = require('https');
const { execFileSync } = require('child_process');

let ffmpeg = 'ffmpeg';
try { ffmpeg = require('ffmpeg-static') || 'ffmpeg'; } catch (e) {}

const carpeta = path.resolve(process.argv[2] || '');
const g = JSON.parse(fs.readFileSync(path.join(carpeta, 'guion.json'), 'utf8'));
const DUR = Number(g.duracion_total_video);
const key = process.env.ELEVENLABS_API_KEY;
const tmp = path.join(carpeta, '_audio'); fs.mkdirSync(tmp, { recursive: true });
const log = [];
const L = (m) => { console.log('[Audio11] ' + m); log.push(m); };

function post(ruta, cuerpo, salida) {
  return new Promise((resolve) => {
    const data = Buffer.from(JSON.stringify(cuerpo), 'utf8');
    const req = https.request({ hostname: 'api.elevenlabs.io', path: ruta, method: 'POST', timeout: 240000,
      headers: { 'xi-api-key': key, 'Content-Type': 'application/json', Accept: 'audio/mpeg', 'Content-Length': data.length } }, (res) => {
      if (res.statusCode !== 200) { let t = ''; res.on('data', (c) => (t += c)); res.on('end', () => { L(`${ruta} -> ${res.statusCode} ${t.slice(0, 200)}`); resolve(false); }); return; }
      const f = fs.createWriteStream(salida); res.pipe(f); f.on('finish', () => { f.close(); resolve(fs.statSync(salida).size > 1000); });
    });
    req.on('timeout', () => { L(`${ruta} timeout`); req.destroy(); resolve(false); });
    req.on('error', (e) => { L(`${ruta} error ${e.message}`); resolve(false); });
    req.write(data); req.end();
  });
}
function postJson(ruta, cuerpo) {
  return new Promise((resolve) => {
    const data = Buffer.from(JSON.stringify(cuerpo), "utf8");
    const req = https.request({ hostname: "api.elevenlabs.io", path: ruta, method: "POST", headers: { "xi-api-key": key, "Content-Type": "application/json", "Content-Length": data.length } }, (res) => { let t = ""; res.on("data", (c) => (t += c)); res.on("end", () => resolve(res.statusCode + " " + t.slice(0, 120))); });
    req.on("error", (e) => resolve("error " + e.message)); req.write(data); req.end();
  });
}
const dur = (f) => { try { const o = execFileSync(ffmpeg, ['-i', f], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }); return 0; } catch (e) { const m = String(e.stderr || '').match(/Duration:\s*(\d+):(\d+):([\d.]+)/); return m ? +m[1] * 3600 + +m[2] * 60 + +m[3] : 0; } };
const ff = (args) => execFileSync(ffmpeg, ['-y', '-loglevel', 'error', ...args]);

(async () => {
  if (!key) { L('Sin ELEVENLABS_API_KEY: no se genera audio nuevo'); process.exit(0); }

  // 1. Música original
  const musica = path.join(tmp, 'musica.mp3');
  const m = g.musica11 || {};
  let okMus = await post('/v1/music', { prompt: m.prompt, music_length_ms: Math.round(DUR * 1000), force_instrumental: true }, musica);
  if (!okMus) { fs.copyFileSync(path.resolve('assets/audio/musica_fondo.mp3'), musica); L('Música: fallback a assets/audio/musica_fondo.mp3'); }
  else L(`Música ElevenLabs OK (${dur(musica).toFixed(1)} s)`);

  // 2. Efectos a medida (se generan una vez por tipo y se colocan en cada corte)
  const sfxFiles = {};
  for (const [nombre, def] of Object.entries(g.sfx11 || {})) {
    const f = path.join(tmp, `sfx_${nombre}.mp3`);
    const ok = await post('/v1/sound-generation', { text: def.prompt, duration_seconds: Math.min(30, Math.max(0.5, Number(def.segundos) || 1)), prompt_influence: 0.6 }, f);
    if (ok) { sfxFiles[nombre] = f; L(`SFX ${nombre} OK`); }
    else if (def.fallback && fs.existsSync(path.resolve(def.fallback))) { sfxFiles[nombre] = path.resolve(def.fallback); L(`SFX ${nombre}: fallback ${def.fallback}`); }
  }

  // 3. Locución por tramos (si la voz es de la biblioteca pública, se añade a la cuenta una vez)
  if (g.voz11 && g.voz11.public_owner_id) {
    const okAdd = await postJson(`/v1/voices/add/${g.voz11.public_owner_id}/${g.voz11.voice_id}`, { new_name: g.voz11.nombre || "Voz DKitchen" });
    L(`Alta de voz ${g.voz11.nombre}: ${okAdd}`);
  }
  // cada tramo se ajusta a su ventana (atempo máx. 1.22)
  const v = g.voz11 || {};
  const tramos = g.tramos_voz || [];
  const vozPartes = [];
  for (let i = 0; i < tramos.length; i++) {
    const t = tramos[i];
    const raw = path.join(tmp, `voz_${i}.mp3`);
    let ok = await post(`/v1/text-to-speech/${v.voice_id}?output_format=mp3_44100_128`, { text: t.texto, model_id: v.modelo || 'eleven_v3', voice_settings: v.ajustes || { stability: 0.4, similarity_boost: 0.8, style: 0.6, use_speaker_boost: true } }, raw);
    if (!ok && v.modelo_reserva) ok = await post(`/v1/text-to-speech/${v.voice_id}?output_format=mp3_44100_128`, { text: t.texto.replace(/\[[^\]]+\]\s*/g, ''), model_id: v.modelo_reserva, voice_settings: { stability: 0.45, similarity_boost: 0.8, style: 0.5, use_speaker_boost: true } }, raw);
    if (!ok) continue;
    const ventana = (i + 1 < tramos.length ? tramos[i + 1].tiempo_inicio : (g.corte_voz_segundo || DUR)) - t.tiempo_inicio - 0.08;
    const d = dur(raw);
    const tempo = d > ventana ? Math.min(1.22, d / ventana) : 1;
    const fit = path.join(tmp, `vozfit_${i}.wav`);
    ff(['-i', raw, '-af', `atempo=${tempo.toFixed(3)},afade=t=out:st=${Math.max(0, d / tempo - 0.06).toFixed(2)}:d=0.06`, fit]);
    vozPartes.push({ f: fit, t: t.tiempo_inicio });
    L(`Voz ${i}: ${d.toFixed(2)} s, ventana ${ventana.toFixed(2)} s, tempo ${tempo.toFixed(2)}`);
  }

  // 4. Mezcla
  const ins = ['-stream_loop', '-1', '-i', musica];
  let fc = `[0:a]atrim=0:${DUR},asetpts=PTS-STARTPTS,volume=${m.volumen ?? 0.55},afade=t=out:st=${DUR - 0.8}:d=0.8[mus];`;
  let n = 1; const voces = [];
  for (const p of vozPartes) { ins.push('-i', p.f); const ms = Math.round(p.t * 1000); fc += `[${n}:a]adelay=${ms}|${ms},apad=whole_dur=${DUR}[v${n}];`; voces.push(`[v${n}]`); n++; }
  const efectos = [];
  for (const ev of g.eventos_sfx || []) {
    const f = sfxFiles[ev.sfx]; if (!f) continue;
    ins.push('-i', f); const ms = Math.round(ev.t * 1000);
    fc += `[${n}:a]adelay=${ms}|${ms},apad=whole_dur=${DUR},volume=${ev.vol ?? 0.5}[e${n}];`; efectos.push(`[e${n}]`); n++;
  }
  if (voces.length) {
    fc += `${voces.join('')}amix=inputs=${voces.length}:normalize=0,volume=${v.volumen ?? 1.6},asplit=2[voz][sc];`;
    fc += `[mus][sc]sidechaincompress=threshold=0.04:ratio=8:attack=15:release=250[musd];`;
    fc += `[musd][voz]${efectos.join('')}amix=inputs=${2 + efectos.length}:normalize=0:duration=first,loudnorm=I=-14:TP=-1.2:LRA=9[out]`;
  } else {
    fc += `[mus]${efectos.join('')}amix=inputs=${1 + efectos.length}:normalize=0:duration=first,loudnorm=I=-14:TP=-1.2:LRA=9[out]`;
  }
  ff([...ins, '-filter_complex', fc, '-map', '[out]', '-t', String(DUR), '-ar', '48000', '-b:a', '256k', path.join(carpeta, 'audio.mp3')]);
  L('audio.mp3 listo');
  fs.writeFileSync(path.join(carpeta, 'audio_log.txt'), log.join('\n') + '\n');
})().catch((e) => { L('ERROR ' + e.message); fs.writeFileSync(path.join(carpeta, 'audio_log.txt'), log.join('\n') + '\n'); process.exit(1); });
