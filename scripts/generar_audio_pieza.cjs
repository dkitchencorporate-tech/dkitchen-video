// scripts/generar_audio_pieza.cjs
// Generación automatizada de voz con ElevenLabs para DKitchen Studio
// Lee guion.json dentro de la carpeta del reel si existe, o usa el texto de la pieza.

const fs = require('fs');
const path = require('path');
const https = require('https');

const carpeta = path.resolve(process.argv[2] || 'reels/reel-piloto');
const guionPath = path.join(carpeta, 'guion.json');
const salidaAudio = path.join(carpeta, 'audio.mp3');

const apiKey = process.env.ELEVENLABS_API_KEY;
if (!apiKey) {
  console.log('[ElevenLabs] No se detectó ELEVENLABS_API_KEY en variables de entorno. Omitiendo generación.');
  process.exit(0);
}

if (!fs.existsSync(guionPath)) {
  console.log(`[ElevenLabs] No existe ${guionPath}. Conservando pista de audio existente si la hay.`);
  process.exit(0);
}

const guionData = JSON.parse(fs.readFileSync(guionPath, 'utf8'));
const texto = guionData.locucion;
// Voz oficial Álvaro (Español Peninsular) o por defecto en guion.json
const voiceId = guionData.voice_id || 'bIHbv24MWmeRgasZH58o';

console.log(`[ElevenLabs] Generando locución de marca para ${path.basename(carpeta)}...`);
console.log(`[ElevenLabs] Voz ID: ${voiceId} | Longitud texto: ${texto.length} caracteres`);

const data = JSON.stringify({
  text: texto,
  model_id: "eleven_multilingual_v2",
  voice_settings: {
    stability: 0.50,
    similarity_boost: 0.85,
    style: 0.25,
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
    'Content-Length': Buffer.byteLength(data)
  }
};

const req = https.request(options, (res) => {
  if (res.statusCode !== 200) {
    console.error(`[ElevenLabs] Error HTTP: ${res.statusCode} ${res.statusMessage}`);
    res.setEncoding('utf8');
    res.on('data', chunk => console.error(chunk));
    process.exit(1);
  }

  const fileStream = fs.createWriteStream(salidaAudio);
  res.pipe(fileStream);

  fileStream.on('finish', () => {
    fileStream.close();
    console.log(`[ElevenLabs] Audio generado con éxito y guardado en ${salidaAudio}`);
  });
});

req.on('error', (e) => {
  console.error(`[ElevenLabs] Error en la petición: ${e.message}`);
  process.exit(1);
});

req.write(data);
req.end();
