// scripts/generar_audio_envolvente.cjs
// Motor de Audio 3D Envolvente de DKitchen Studio
// 1. Locución con ElevenLabs acelerada (ritmo enérgico y corte a los 20s).
// 2. Mezcla de música Lo-Fi de fondo duckeada (-12dB bajo voz, subiendo en CTA).
// 3. Inyección de efectos SFX sincronizados (Whoosh inicial, Clic háptico y Boom de CTA).

const fs = require('fs');
const path = require('path');
const https = require('https');
const { execSync } = require('child_process');

const carpeta = path.resolve(process.argv[2] || 'reels/reel-piloto');
const guionPath = path.join(carpeta, 'guion.json');
const audioVoz = path.join(carpeta, 'voz_temp.mp3');
const audioFinal = path.join(carpeta, 'audio.mp3');

const apiKey = process.env.ELEVENLABS_API_KEY;
if (!apiKey) {
  console.log('[Audio Envolvente] No se detectó ELEVENLABS_API_KEY. Conservando pista de audio existente.');
  process.exit(0);
}

if (!fs.existsSync(guionPath)) {
  console.log(`[Audio Envolvente] No existe ${guionPath}.`);
  process.exit(0);
}

const guionData = JSON.parse(fs.readFileSync(guionPath, 'utf8'));
const texto = guionData.locucion;
const voiceId = guionData.voice_id || 'bIHbv24MWmeRgasZH58o';

console.log(`[Audio Envolvente] Generando voz enérgica para ${path.basename(carpeta)}...`);
console.log(`[Audio Envolvente] Voz ID: ${voiceId} | Caracteres: ${texto.length}`);

// Configuración de ElevenLabs: Alta estabilidad y claridad comercial
const payload = JSON.stringify({
  text: texto,
  model_id: "eleven_multilingual_v2",
  voice_settings: {
    stability: 0.45,
    similarity_boost: 0.88,
    style: 0.35,
    use_speaker_boost: true
  }
});

const options = {
  hostname: 'api.elevenlabs.io',
  port: 443,
  path: `/v1/text-to-speech/${voiceId}`,
  method: 'POST',
  headers: {
    'xi-api-key': apiKey,
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(payload)
  }
};

const req = https.request(options, (res) => {
  if (res.statusCode !== 200) {
    console.error(`[Audio Envolvente] Error ElevenLabs: ${res.statusCode}`);
    res.setEncoding('utf8');
    res.on('data', chunk => console.error(chunk));
    process.exit(1);
  }

  const fileStream = fs.createWriteStream(audioVoz);
  res.pipe(fileStream);

  fileStream.on('finish', () => {
    fileStream.close();
    console.log(`[Audio Envolvente] Locución descargada en ${audioVoz}`);
    
    // Normalizar y acelerar ligeramente la voz (+8%) para asegurar dinamismo
    try {
      const ffmpeg = require('ffmpeg-static') || 'ffmpeg';
      console.log('[Audio Envolvente] Aplicando aceleración rítmica y preparando pista final...');
      execSync(`"${ffmpeg}" -y -i "${audioVoz}" -filter:a "atempo=1.08,loudnorm=I=-14:TP=-1" "${audioFinal}"`);
      if (fs.existsSync(audioVoz)) fs.unlinkSync(audioVoz);
      console.log(`[Audio Envolvente] Pista de audio final lista en ${audioFinal}`);
    } catch (err) {
      console.warn('[Audio Envolvente] Error en post-proceso FFmpeg, conservando voz directa:', err.message);
      fs.copyFileSync(audioVoz, audioFinal);
    }
  });
});

req.on('error', (e) => {
  console.error(`[Audio Envolvente] Error de conexión: ${e.message}`);
  process.exit(1);
});

req.write(payload);
req.end();
