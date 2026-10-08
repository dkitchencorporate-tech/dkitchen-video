// scripts/generar_audio_envolvente.cjs
// Motor de Audio 3D Envolvente de DKitchen Studio (Nivel Agencia Gran Reserva)
// 1. Locución ElevenLabs calibrada (cadencia natural en UTF-8 nativo, corte seco antes de Mega-CTA).
// 2. Mezcla de música Lo-Fi gastronómica con ducking dinámico (-14dB bajo voz, subiendo +11dB en Mega-CTA).
// 3. Stems SFX sincronizados (Whoosh inicial, Clic táctil, Riser de tensión y Sub-Drop en CTA).
// 4. Duración exacta fijada para evitar cualquier truncado en el multiplexado FFmpeg.

const fs = require('fs');
const path = require('path');
const https = require('https');
const { execSync } = require('child_process');

const carpeta = path.resolve(process.argv[2] || 'reels/pieza-01');
const guionPath = path.join(carpeta, 'guion.json');
const audioVozTemp = path.join(carpeta, 'voz_temp.mp3');
const audioVozAcel = path.join(carpeta, 'voz.mp3');
const audioFinal = path.join(carpeta, 'audio.mp3');
const audioMasterCopy = path.join(carpeta, 'audio_master.mp3');
const musicaCopy = path.join(carpeta, 'musica_fondo.mp3');

const musicaPath = path.resolve('assets/audio/musica_fondo.mp3');
const whooshPath = path.resolve('assets/sfx/whoosh-cinematic.mp3');
const clickPath = path.resolve('assets/sfx/click.mp3');
const riserPath = path.resolve('assets/sfx/riser.mp3');
const boomPath = path.resolve('assets/sfx/impact-bass-1.mp3');

let ffmpeg = 'ffmpeg';
try {
  ffmpeg = require('ffmpeg-static') || 'ffmpeg';
} catch (e) {
  ffmpeg = 'ffmpeg';
}

if (!fs.existsSync(guionPath)) {
  console.log(`[Audio Envolvente] No existe ${guionPath}. Finalizando.`);
  process.exit(0);
}

const guionData = JSON.parse(fs.readFileSync(guionPath, 'utf8'));
const texto = guionData.locucion;
const voiceId = guionData.voice_id || 'bIHbv24MWmeRgasZH58o';
const duracionTotal = Number(guionData.duracion_total_video || 24.0);
const corteVoz = Number(guionData.corte_voz_segundo || 19.5);

console.log(`[Audio Envolvente] Preparando paisaje sonoro de ${path.basename(carpeta)}...`);
console.log(`[Audio Envolvente] Duración objetivo: ${duracionTotal}s | Corte voz: ${corteVoz}s`);

const apiKey = process.env.ELEVENLABS_API_KEY;

function copiarStemsParaEntrega() {
  try {
    if (fs.existsSync(audioFinal)) {
      fs.copyFileSync(audioFinal, audioMasterCopy);
    }
    if (fs.existsSync(musicaPath)) {
      fs.copyFileSync(musicaPath, musicaCopy);
    }

    const entregaDir = path.resolve('C:/Users/karc0/OneDrive/Desktop/5. Creacion de Contenido/trabajo/ultimo-video');
    if (fs.existsSync(entregaDir)) {
      if (fs.existsSync(audioFinal)) fs.copyFileSync(audioFinal, path.join(entregaDir, 'audio_master.mp3'));
      if (fs.existsSync(audioVozAcel)) fs.copyFileSync(audioVozAcel, path.join(entregaDir, 'voz.mp3'));
      if (fs.existsSync(musicaPath)) fs.copyFileSync(musicaPath, path.join(entregaDir, 'musica_fondo.mp3'));
      if (fs.existsSync(guionPath)) fs.copyFileSync(guionPath, path.join(entregaDir, 'guion.json'));
      console.log(`[Audio Envolvente] Stems copiados a carpeta de entrega: ${entregaDir}`);
    }
  } catch (e) {
    console.warn('[Audio Envolvente] Aviso copiando stems:', e.message);
  }
}

function mezclarPistasFinales() {
  console.log('[Audio Envolvente] Ensamblando mezcla multipista con música duckeada y SFX...');

  const tieneVoz = fs.existsSync(audioVozAcel);
  const tieneMusica = fs.existsSync(musicaPath);
  const tieneWhoosh = fs.existsSync(whooshPath);
  const tieneClick = fs.existsSync(clickPath);
  const tieneRiser = fs.existsSync(riserPath);
  const tieneBoom = fs.existsSync(boomPath);

  // Si no hay voz ni música, crear pista muda con la duración exacta
  if (!tieneVoz && !tieneMusica) {
    console.log('[Audio Envolvente] Generando pista base de silencio...');
    execSync(`"${ffmpeg}" -y -f lavfi -i anullsrc=r=48000:cl=stereo -t ${duracionTotal} -b:a 192k "${audioFinal}"`);
    copiarStemsParaEntrega();
    return;
  }

  // Si solo hay voz y no música
  if (tieneVoz && !tieneMusica) {
    console.log('[Audio Envolvente] Solo voz disponible. Ajustando a duración completa con silencio...');
    execSync(`"${ffmpeg}" -y -i "${audioVozAcel}" -af "apad=whole_dur=${duracionTotal},loudnorm=I=-14:TP=-1:LRA=11" -t ${duracionTotal} -b:a 192k "${audioFinal}"`);
    copiarStemsParaEntrega();
    return;
  }

  // Mezcla completa con Ducking y SFX
  const riserTime = Math.max(0, corteVoz - 2.0); // 17.5s
  const boomTime = corteVoz; // 19.5s

  try {
    let filterComplex = '';
    const inputs = [];

    // Input 0: Música de fondo en loop
    inputs.push(`-stream_loop -1 -i "${musicaPath}"`);

    // Input 1: Voz limpia
    if (tieneVoz) {
      inputs.push(`-i "${audioVozAcel}"`);
    }

    // Input 2: Whoosh inicial
    if (tieneWhoosh) inputs.push(`-i "${whooshPath}"`);
    // Input 3: Click en el desarrollo (8.5s cuando entra PWA)
    if (tieneClick) inputs.push(`-i "${clickPath}"`);
    // Input 4: Riser antes de CTA
    if (tieneRiser) inputs.push(`-i "${riserPath}"`);
    // Input 5: Boom en CTA
    if (tieneBoom) inputs.push(`-i "${boomPath}"`);

    // Construcción de filtros
    let mixInputs = [];
    
    // Música con ducking: volumen 0.20 durante la voz, sube a 0.72 en silencio de voz (Mega-CTA)
    filterComplex += `[0:a]atrim=0:${duracionTotal},asetpts=PTS-STARTPTS,volume=enable='between(t,0.3,${corteVoz})':volume=0.20,volume=enable='gte(t,${corteVoz})':volume=0.72[a_musica];`;
    mixInputs.push('[a_musica]');

    let idx = 1;
    if (tieneVoz) {
      filterComplex += `[${idx}:a]adelay=300|300,apad=whole_dur=${duracionTotal},asetpts=PTS-STARTPTS,volume=1.0[a_voz];`;
      mixInputs.push('[a_voz]');
      idx++;
    }

    if (tieneWhoosh) {
      filterComplex += `[${idx}:a]adelay=60|60,apad=whole_dur=${duracionTotal},asetpts=PTS-STARTPTS,volume=0.42[a_whoosh];`;
      mixInputs.push('[a_whoosh]');
      idx++;
    }

    if (tieneClick) {
      const scenePhone = (guionData.escenas || []).find(e => (e.nombre || '').includes('HERO') || (e.nombre || '').includes('SMARTPHONE'));
      const clickTime = scenePhone ? (scenePhone.tiempo_inicio + 0.5) : 8.5;
      const clickMs = Math.round(clickTime * 1000);
      filterComplex += `[${idx}:a]adelay=${clickMs}|${clickMs},apad=whole_dur=${duracionTotal},asetpts=PTS-STARTPTS,volume=0.35[a_click];`;
      mixInputs.push('[a_click]');
      idx++;
    }

    if (tieneRiser) {
      const riserMs = Math.round(riserTime * 1000); // 17500 ms
      filterComplex += `[${idx}:a]adelay=${riserMs}|${riserMs},apad=whole_dur=${duracionTotal},asetpts=PTS-STARTPTS,volume=0.38[a_riser];`;
      mixInputs.push('[a_riser]');
      idx++;
    }

    if (tieneBoom) {
      const boomMs = Math.round(boomTime * 1000); // 19500 ms
      filterComplex += `[${idx}:a]adelay=${boomMs}|${boomMs},apad=whole_dur=${duracionTotal},asetpts=PTS-STARTPTS,volume=0.60[a_boom];`;
      mixInputs.push('[a_boom]');
      idx++;
    }

    filterComplex += `${mixInputs.join('')}amix=inputs=${mixInputs.length}:duration=first:dropout_transition=0,loudnorm=I=-14:TP=-1:LRA=11[a_out]`;

    const cmd = `"${ffmpeg}" -y ${inputs.join(' ')} -filter_complex "${filterComplex}" -map "[a_out]" -t ${duracionTotal} -b:a 192k -ar 48000 "${audioFinal}"`;
    execSync(cmd);
    console.log(`[Audio Envolvente] Mezcla multipista completada con éxito en ${audioFinal}`);

    // Limpieza de temporales
    if (fs.existsSync(audioVozTemp)) fs.unlinkSync(audioVozTemp);

    copiarStemsParaEntrega();
  } catch (err) {
    console.warn('[Audio Envolvente] Error en mezcla multipista, aplicando fallback:', err.message);
    if (fs.existsSync(audioVozAcel)) {
      execSync(`"${ffmpeg}" -y -i "${audioVozAcel}" -af "apad=whole_dur=${duracionTotal},loudnorm=I=-14:TP=-1" -t ${duracionTotal} -b:a 192k "${audioFinal}"`);
      copiarStemsParaEntrega();
    }
  }
}

if (!apiKey) {
  console.log('[Audio Envolvente] No se detectó ELEVENLABS_API_KEY. Usando pistas existentes.');
  if (fs.existsSync(audioFinal)) {
    // Asegurar duración
    execSync(`"${ffmpeg}" -y -i "${audioFinal}" -af "apad=whole_dur=${duracionTotal}" -t ${duracionTotal} -b:a 192k "${audioFinal}.tmp"`);
    fs.renameSync(`${audioFinal}.tmp`, audioFinal);
  } else {
    mezclarPistasFinales();
  }
  process.exit(0);
}

// Llamada a ElevenLabs
console.log(`[Audio Envolvente] Invocando ElevenLabs (Voz: Álvaro / ${voiceId})...`);
const payload = JSON.stringify({
  text: texto,
  model_id: "eleven_multilingual_v2",
  voice_settings: {
    stability: 0.65,
    similarity_boost: 0.85,
    style: 0.20,
    use_speaker_boost: true
  }
});

const payloadBuffer = Buffer.from(payload, 'utf8');

const options = {
  hostname: 'api.elevenlabs.io',
  port: 443,
  path: `/v1/text-to-speech/${voiceId}`,
  method: 'POST',
  headers: {
    'xi-api-key': apiKey,
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': payloadBuffer.length
  }
};

const req = https.request(options, (res) => {
  if (res.statusCode !== 200) {
    console.error(`[Audio Envolvente] Error ElevenLabs: ${res.statusCode}`);
    res.setEncoding('utf8');
    res.on('data', chunk => console.error(chunk));
    mezclarPistasFinales();
    return;
  }

  const fileStream = fs.createWriteStream(audioVozTemp);
  res.pipe(fileStream);

  fileStream.on('finish', () => {
    fileStream.close();
    console.log(`[Audio Envolvente] Locución descargada en ${audioVozTemp}`);
    
    // Medir la duración exacta de la locución generada
    let duracionVozGenerada = 0;
    try {
      const probeDur = execSync(`"${ffmpeg}" -i "${audioVozTemp}" 2>&1`, { encoding: 'utf8' });
      const matchDur = probeDur.match(/Duration:\s*(\d+):(\d+):([0-9.]+)/);
      if (matchDur) {
        duracionVozGenerada = parseInt(matchDur[1]) * 3600 + parseInt(matchDur[2]) * 60 + parseFloat(matchDur[3]);
      }
    } catch (e) {}

    console.log(`[Audio Envolvente] Duración locución cruda: ${duracionVozGenerada.toFixed(2)}s | Corte objetivo: ${corteVoz}s`);

    // Cadencia natural: la locución de 45 palabras dura ~18.8s y encaja naturalmente antes de 19.5s.
    const duracionObjetivoVoz = corteVoz - 0.5; // 19.5 - 0.5 = 19.0s
    let tempoFactor = 1.0;
    if (duracionVozGenerada > duracionObjetivoVoz) {
      tempoFactor = Math.min(1.05, Math.max(1.01, duracionVozGenerada / duracionObjetivoVoz));
    }
    console.log(`[Audio Envolvente] Factor de aceleración dinámico: ${tempoFactor.toFixed(3)}x`);

    try {
      if (tempoFactor > 1.01) {
        execSync(`"${ffmpeg}" -y -i "${audioVozTemp}" -filter:a "atempo=${tempoFactor.toFixed(3)}" "${audioVozAcel}"`);
        console.log(`[Audio Envolvente] Voz calibrada suavemente al ${Math.round(tempoFactor * 100)}% lista.`);
      } else {
        fs.copyFileSync(audioVozTemp, audioVozAcel);
        console.log('[Audio Envolvente] Voz a tempo natural 1.0x (100% fidelidad acústica).');
      }
    } catch (err) {
      console.warn('[Audio Envolvente] Error al procesar tempo de voz:', err.message);
      fs.copyFileSync(audioVozTemp, audioVozAcel);
    }

    mezclarPistasFinales();
  });
});

req.on('error', (e) => {
  console.error(`[Audio Envolvente] Error de conexión: ${e.message}`);
  mezclarPistasFinales();
});

req.write(payloadBuffer);
req.end();
