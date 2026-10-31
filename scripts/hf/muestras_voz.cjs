// scripts/hf/muestras_voz.cjs — P6 DKitchen (31/10/2026). Solo en Actions (flujo muestras-voz.yml).
// Genera la misma frase con Álvaro y con las mejores voces de España de la biblioteca de ElevenLabs,
// para que karc0 elija la voz del lote 1. Salida: muestras/<n>-<nombre>.mp3 y muestras/voces.json.
'use strict';
const fs = require('fs');
const path = require('path');
const key = process.env.ELEVENLABS_API_KEY;
const frase = process.env.FRASE || '¿Tu carta sigue en papel? Escríbenos CARTA y te la hacemos gratis en veinticuatro horas.';
const extra = (process.env.VOCES || '').split(',').map((s) => s.trim()).filter(Boolean);
const N = Number(process.env.NUM_ALTERNATIVAS || 2);
const out = path.resolve('muestras');
fs.mkdirSync(out, { recursive: true });
const H = { 'xi-api-key': key, 'Content-Type': 'application/json' };
const slug = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-zA-Z0-9]+/g, '-').toLowerCase().slice(0, 30);

(async () => {
  if (!key) { console.error('Falta ELEVENLABS_API_KEY'); process.exit(1); }
  const voces = [{ voice_id: 'bIHbv24MWmeRgasZH58o', name: 'Alvaro (actual)' }];
  for (const id of extra) voces.push({ voice_id: id, name: 'elegida-' + id.slice(0, 6) });
  if (!extra.length) {
    const q = new URLSearchParams({ page_size: '30', language: 'es', sort: 'trending' });
    const r = await fetch('https://api.elevenlabs.io/v1/shared-voices?' + q, { headers: H });
    const j = r.ok ? await r.json() : { voices: [] };
    console.log(`Biblioteca: ${r.status}, ${(j.voices || []).length} voces en español`);
    const personaje = /creature|monster|terrif|dark|scary|villain|demon|horror|child|kid|cartoon|robot|old|anciano|whisper|asmr|anime/i;
    const esp = (j.voices || []).filter((v) => /spain|peninsular|castil|españ|es-ES/i.test(`${v.accent} ${v.locale}`) && !personaje.test(`${v.name} ${v.description} ${v.use_case}`) && v.voice_id !== voces[0].voice_id);
    const elegidas = [esp.find((v) => v.gender === 'male' && v.name !== 'Javi Rojas'), esp.find((v) => v.gender === 'female'), esp.find((v) => v.name && /Javi Rojas/.test(v.name))].filter(Boolean);
    const unicas = [...new Map(elegidas.map((v) => [v.voice_id, v])).values()];
    for (const v of unicas.slice(0, Math.max(N, 3))) {
      const a = await fetch(`https://api.elevenlabs.io/v1/voices/add/${v.public_owner_id}/${v.voice_id}`, { method: 'POST', headers: H, body: JSON.stringify({ new_name: v.name }) });
      console.log(`Alta ${v.name} (${v.accent}/${v.locale}): ${a.status}`);
      voces.push({ voice_id: v.voice_id, public_owner_id: v.public_owner_id, name: v.name, accent: v.accent, locale: v.locale, gender: v.gender, age: v.age, description: (v.description || '').slice(0, 160) });
    }
  }
  let n = 0, fallos = 0;
  for (const v of voces) {
    n++;
    const r = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${v.voice_id}?output_format=mp3_44100_128`, { method: 'POST', headers: Object.assign({ Accept: 'audio/mpeg' }, H), body: JSON.stringify({ text: frase, model_id: 'eleven_multilingual_v2', voice_settings: { stability: 0.45, similarity_boost: 0.8, style: 0.35, use_speaker_boost: true, speed: 1.08 } }) });
    if (!r.ok) { console.log(`TTS ${v.name}: ${r.status} ${(await r.text()).slice(0, 120)}`); fallos++; continue; }
    v.archivo = `${n}-${slug(v.name)}.mp3`;
    fs.writeFileSync(path.join(out, v.archivo), Buffer.from(await r.arrayBuffer()));
    console.log(`Muestra ${v.archivo}`);
  }
  fs.writeFileSync(path.join(out, 'voces.json'), JSON.stringify({ frase, voces }, null, 2));
  if (fallos === voces.length) process.exit(1);
})();
