const fs = require('fs');
const path = require('path');

function compilarPieza(carpetaPiezaRelativa) {
  const rootDir = path.resolve(__dirname);
  const carpetaPieza = path.resolve(rootDir, carpetaPiezaRelativa);
  const piezaJsonPath = path.join(carpetaPieza, 'pieza.json');

  if (!fs.existsSync(piezaJsonPath)) {
    console.error(`[ERROR] No existe ${piezaJsonPath}`);
    process.exit(1);
  }

  const config = JSON.parse(fs.readFileSync(piezaJsonPath, 'utf8'));
  const escenasDir = path.join(rootDir, 'escenas');
  const tokensCssPath = path.join(rootDir, 'marca', 'tokens.css');
  const tokensCss = fs.existsSync(tokensCssPath) ? fs.readFileSync(tokensCssPath, 'utf8') : '';

  let htmlEscenas = '';
  let timelineCode = '';
  let currentTime = 0;

  config.escenas.forEach((escena, idx) => {
    const plantillaPath = path.join(escenasDir, `${escena.plantilla}.html`);
    if (!fs.existsSync(plantillaPath)) {
      console.error(`[AVISO] Plantilla no encontrada: ${escena.plantilla}`);
      return;
    }

    let contenido = fs.readFileSync(plantillaPath, 'utf8');
    const id = `escena_${idx}_${escena.id || escena.plantilla}`;
    
    // Sustituir variables
    contenido = contenido.replace(/\{\{id\}\}/g, id);
    contenido = contenido.replace(/\{\{bg\}\}/g, escena.parametros.bg || 'var(--negro)');
    contenido = contenido.replace(/\{\{color\}\}/g, escena.parametros.color || '#FFFFFF');

    for (const [key, val] of Object.entries(escena.parametros)) {
      contenido = contenido.replace(new RegExp(`\\{\\{${key}\\}\\}`, 'g'), val);
    }

    htmlEscenas += `\n<!-- Bloque Escena ${idx}: ${escena.plantilla} -->\n` + contenido + '\n';

    // Generar timeline de GSAP
    const dur = escena.duracion || 3;
    timelineCode += `
    // Escena ${idx}: ${id} (de ${currentTime.toFixed(2)}s a ${(currentTime + dur).toFixed(2)}s)
    tl.to('#${id}', { display: 'block', duration: 0.01 }, ${currentTime.toFixed(2)});
    tl.fromTo('#${id} .contenedor-seguro', 
      { opacity: 0, y: 30 }, 
      { opacity: 1, y: 0, duration: 0.45, ease: 'power3.out' }, 
      ${currentTime.toFixed(2)}
    );
    tl.to('#${id} .contenedor-seguro', 
      { opacity: 0, y: -20, duration: 0.3, ease: 'power2.in' }, 
      ${(currentTime + dur - 0.3).toFixed(2)}
    );
    tl.to('#${id}', { display: 'none', duration: 0.01 }, ${(currentTime + dur).toFixed(2)});
    `;

    currentTime += dur;
  });

  // Generar subtítulos si existen
  let subsCode = '';
  if (config.subtitulos && Array.isArray(config.subtitulos)) {
    config.subtitulos.forEach(sub => {
      subsCode += `
      tl.call(() => {
        const el = document.getElementById('subtitulo-texto');
        if (el) { el.innerText = "${sub.texto.replace(/"/g, '\\"')}"; }
      }, null, ${sub.inicio});
      tl.call(() => {
        const el = document.getElementById('subtitulo-texto');
        if (el && el.innerText === "${sub.texto.replace(/"/g, '\\"')}") { el.innerText = ''; }
      }, null, ${sub.fin});
      `;
    });
  }

  const subtitulosHtmlPath = path.join(escenasDir, 'subtitulos.html');
  const capaSubtitulos = fs.existsSync(subtitulosHtmlPath) ? fs.readFileSync(subtitulosHtmlPath, 'utf8') : '';

  const composicionFinal = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>${config.titulo || 'Dカンitchen Video Piece'}</title>
  <style>
    ${tokensCss}
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      width: 1080px;
      height: 1920px;
      overflow: hidden;
      background: var(--negro);
      color: #FFFFFF;
      font-family: var(--font-body);
      position: relative;
    }
    .contenedor-seguro {
      position: absolute;
      top: var(--safe-top);
      bottom: var(--safe-bottom);
      left: var(--safe-left);
      right: var(--safe-right);
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
  </style>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>
</head>
<body>

  <!-- ESCENAS GENERADAS -->
  ${htmlEscenas}

  <!-- CAPA SUBTITULOS -->
  ${capaSubtitulos}

  <script>
    window.LISTO = false;
    const tl = gsap.timeline({
      paused: false,
      onComplete: () => { console.log('Fin de animacion'); }
    });

    ${timelineCode}
    ${subsCode}

    window.LISTO = true;
    window.TL = tl;
  </script>
</body>
</html>`;

  const outputPath = path.join(carpetaPieza, 'composicion.html');
  fs.writeFileSync(outputPath, composicionFinal, 'utf8');
  console.log(`[CONSTRUIR] Composicion compilada exitosamente en: ${outputPath}`);
}

const objetivo = process.argv[2] || 'piezas/2026-10-09-carta-qr-20s';
compilarPieza(objetivo);
