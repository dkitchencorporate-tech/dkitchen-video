// scripts/hf/voz_api.cjs — P6 DKitchen. SOLO en Actions (flujo voz-api.yml). Orden expresa de karc0 (31/10/2026):
// la voz y los efectos de sonido se generan con la API de ElevenLabs; la música la sigue haciendo karc0 a mano.
// Lee reels/<pieza>/guion.json: tramos_voz (+ voz.ajustes) y sfx_api. Si una frase dura más que su hueco,
// la repite más rápida (hasta 1.15). Salida: <pieza>/audio/originales/voz-tN.mp3, <pieza>/assets/sfx/*.mp3 e informe.
'use strict';
const fs = require('fs'); const path = require('path'); const { execFileSync } = require('child_process');
const carpeta = process.argv[2]; const key = process.env.ELEVENLABS_API_KEY;
if (!key || !/^reels\/[a-z0-9-]+$/.test(carpeta || '')) { console.error('Uso: node voz_api.cjs reels/<pieza> (con ELEVENLABS_API_KEY)'); process.exit(1); }
const g = JSON.parse(fs.readFileSync(path.join(carpeta, 'guion.json'), 'utf8'));
const H = { 'xi-api-key': key, 'Content-Type': 'application/json' };
const dur = (f) => Number(execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f]).toString().trim());
const informe = []; let fallos = 0;
(async () => {
  const dVoz = path.join(carpeta, 'audio', 'originales'); fs.mkdirSync(dVoz, { recursive: true });
  const tr = g.tramos_voz || [];
  for (let i = 0; i < tr.length; i++) {
    const t = tr[i]; const hueco = t.fin_max - t.inicio; const f = path.join(dVoz, `voz-${t.id}.mp3`);
    let ok = false;
    for (const speed of [g.voz.ajustes.speed || 1.08, 1.12, 1.15]) {
      const body = {
        text: t.texto, model_id: g.voz.modelo || 'eleven_multilingual_v2', voice_settings: Object.assign({}, g.voz.ajustes, { speed }),
        previous_text: i > 0 ? tr[i - 1].texto : undefined, next_text: i < tr.length - 1 ? tr[i + 1].texto : undefined,
      };
      const r = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${g.voz.voice_id}?output_format=mp3_44100_128`, { method: 'POST', headers: Object.assign({ Accept: 'audio/mpeg' }, H), body: JSON.stringify(body) });
      if (!r.ok) { informe.push(`voz ${t.id}: ERROR ${r.status} ${(await r.text()).slice(0, 160)}`); break; }
      fs.writeFileSync(f, Buffer.from(await r.arrayBuffer()));
      const d = dur(f);
      informe.push(`voz ${t.id}: ${d.toFixed(2)} s (hueco ${hueco.toFixed(2)} s, speed ${speed}) ${d <= hueco ? 'CABE' : 'NO CABE'}`);
      if (d <= hueco) { ok = true; break; }
    }
    if (!ok) fallos++;
  }
  const dSfx = path.join(carpeta, 'assets', 'sfx'); fs.mkdirSync(dSfx, { recursive: true });
  for (const s of g.sfx_api || []) {
    const r = await fetch('https://api.elevenlabs.io/v1/sound-generation?output_format=mp3_44100_128', { method: 'POST', headers: H, body: JSON.stringify({ text: s.prompt, duration_seconds: s.segundos, prompt_influence: 0.6 }) });
    if (!r.ok) { informe.push(`sfx ${s.id}: ERROR ${r.status} ${(await r.text()).slice(0, 160)}`); fallos++; continue; }
    const f = path.join(dSfx, `${s.id}.mp3`); fs.writeFileSync(f, Buffer.from(await r.arrayBuffer()));
    informe.push(`sfx ${s.id}: ${dur(f).toFixed(2)} s`);
  }
  fs.writeFileSync(path.join(carpeta, 'audio', 'informe_voz_api.txt'), informe.join('\n') + '\n');
  console.log(informe.join('\n'));
  if (fallos) { console.error(`${fallos} fallo(s): revisar el informe`); process.exit(1); }
})();
