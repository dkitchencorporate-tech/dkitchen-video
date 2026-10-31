# P6 · Guía única de producción de vídeo DKitchen (31/10/2026)
Fuente de verdad para producir reels en este repo. Si otro documento (README de OpenMontage, AGENT_GUIDE, planes antiguos de `docs/`) dice otra cosa, **manda esta guía**. La redacta y la mantiene el director técnico (Claude Code); Antigravity la ejecuta sin reinterpretarla.

## 1. Reglas que no se discuten
1. **Render solo en GitHub Actions** (`Renderizar reel`). Nada de `render`, `preview`, `npm install` ni Chromium en el portátil (3,8 GB de RAM). En local solo se editan HTML/JSON y, como mucho, `node --check`.
2. **Un reel = un proyecto HyperFrames propio** en `reels/<pieza>/`, creado copiando `reels/plantilla-p6/`. Nunca se edita `hyperframes-studio/index.html` (es del modo heredado).
3. **HyperFrames 0.8.223**, fijado en `package.json` del reel y en `scripts/hf/producir.cjs`. Subir de versión solo lo decide el director.
4. **QC medido y bloqueante.** El informe `control_calidad.txt` lo escribe `producir.cjs` con valores reales. Prohibido escribir a mano «aprobado», «100 % cumplidas», cifras de WCAG o LUFS. Un reel con el flujo en rojo no se entrega.
5. **Marca única en `/marca`** (tokens, fuentes locales, sonidos). El flujo la copia en cada reel; no se duplica ni se edita dentro del reel.
6. **Precios** solo los de la web (`src/lib/pricing-config.ts` del repo de la web): hoy Carta 9 €, Local 29 € (entrada por 1 €), Sala 79 €. **Acción única** del lote 1: «Escríbenos CARTA». Nombres de locales ocultos.
7. **Imágenes, clips y música**: los genera karc0 a mano (Flow y ElevenLabs Music) con prompts cerrados del director. **Voz y efectos de sonido (karc0, 31/10 noche):** se generan con la API de ElevenLabs **solo** mediante el flujo «Voz y efectos (ElevenLabs)» (`scripts/hf/voz_api.cjs`): se dispara subiendo `reels/<pieza>/audio/pedir_voz.txt` y lee `guion.json` (`tramos_voz`, `voz`, `sfx_api`); recorta silencios y comprueba que cada frase cabe en su hueco. Ningún agente llama a la API por su cuenta. **La música la genera karc0 a mano**; imágenes y clips, karc0 en Flow.

## 1 bis. Nivel de diseño exigido (karc0, 31/10) — lo primero que se revisa
- **Suelo de calidad:** el reel de 40 s `reels/reel-40-hypermotion` (aprobado por karc0 como excepción; los demás tienen que ser **mejores**). Un reel por debajo de ese nivel no se entrega aunque el QC técnico pase.
- **Prohibido:** escenas de solo texto sobre un fondo de color. Como máximo, un golpe tipográfico de ≤ 2 s por reel, y siempre sobre imagen o vídeo.
- **Obligatorio en cada reel:** material real que se mueve (clips de vídeo de Flow, grabaciones reales de la web o de las demos hechas con Playwright, capturas del panel), producto en **3D** (móvil o tableta con perspectiva y grabación dentro), **cifras animadas** (contadores, barras, comparativas) cuando haya dato, y un ejemplo de **cómo funciona de verdad**.
- **Ritmo:** un cambio de plano cada 1,5–3 s; golpe visual en el segundo 0 (miniatura) y gancho en los primeros 1,5 s.
- **Clips de vídeo:** los genera karc0 en Flow (o Antigravity) con prompts cerrados del director (`Alex-DK`); 9:16, 4–8 s, sin texto ni logotipos.
- **Antes del render final:** storyboard con los fotogramas clave de cada escena, aprobado por karc0.
- `reels/plantilla-p6/` es solo el **esqueleto técnico** (audio, carve, QC). Su aspecto no es una referencia de diseño.
- Textos, precios y funciones: solo los de `05 REFERENCIA/MAPA_PRECIOS_Y_FUNCIONES.md` (en el repo de la web: `src/lib/pricing-config.ts`). Ejemplo: «Desde 1 €» = plan Local → 2 idiomas, pedido desde la mesa; nunca 3 idiomas.

## 1 ter. PUERTA DE CALIDAD INNEGOCIABLE (karc0, 31/10 noche) — no se salta nunca
- El nivel de edición, diseño y efectos es **el más alto siempre**, con o sin avatar. karc0 no quiere rechazar ediciones una y otra vez: **el director rechaza antes que él** todo lo que no impacte.
- **Sin avatar hablante por ahora:** primero una base de reels sin avatar; los personajes son una decisión posterior. La voz es **Álvaro** en todos.
- **Storyboard = styleframes reales:** fotogramas renderizados en la nube con el material real (clips o fotos de Flow, grabaciones), los efectos, el grade y la tipografía finales. **Nunca bocetos de cajas o CSS** (el storyboard v1 del Reel 2 se rechazó por eso).
- Cada reel combina como mínimo: (1) material real en movimiento con grade de cine; (2) **profundidad por capas**: tipografía o elementos detrás de la persona u objeto (`tools/effects`, segmentación); (3) UI de cristal o producto 3D con **cifras reales animadas**; (4) tipografía editorial con jerarquía (Bricolage 800 + Cormorant itálica); (5) transiciones motivadas (match-cut, whip, push-in); (6) diseño sonoro por golpe sincronizado (whoosh, tick, impacto, riser); (7) cambio de plano cada 1,5–3 s.
- **Referencias:** `reels/reel-40-hypermotion` (suelo) + el estilo de `tools/effects` (capas detrás del sujeto, cristal, notificaciones, interruptores, push-in lentos).
- **Autorrevisión del director** antes de enseñar nada: los 7 puntos anteriores + gancho en 1,5 s + legibilidad en móvil + coherencia con precios; cada punto 0–1; **menos de 9/10 no se enseña a karc0**.

## 2. Marca (Gran Reserva)
- **Colores** (`marca/tokens.css`): vino `#6E0C2B` (oscuro `#4A081D`), oro `#D9B25C` (brillante `#F0C96F`), negro `#0A080C`/`#050406`, papel `#F7F5F2`. Dolor/pérdida en `#FF5A82`; valor/beneficio en oro.
- **Tipografía** (`marca/fuentes.css`, local, OFL): Bricolage Grotesque 800 para titulares y cifras · Inter para texto técnico · Cormorant Garamond itálica para la palabra de valor. No se cargan fuentes de internet.
- **Logotipo**: el SVG de `compositions/cta.html` (cuadrado vino con «D» en oro + «DKitchen»). No se deforma ni se recolorea.
- **Sonidos de marca**: `marca/sonido/` (whoosh, pop, tick, impacto-suave, cierre). Efectos extra: `assets/sfx/` (Pixabay, uso comercial libre).

## 3. Formato y zona segura (fuente única: `marca/tokens.css`)
- 1080 × 1920, 9:16, 30 fps, 15–30 s.
- Márgenes: **arriba 250 px · abajo 420 px · derecha 140 px · izquierda 60 px** → caja segura x 60–940, y 250–1500.
- Todo texto, precio, CTA y subtítulo va dentro de un contenedor con `left: var(--safe-left); right: var(--safe-right); top: var(--safe-top); bottom: var(--safe-bottom)`. Fuera de la caja solo puede haber atmósfera, fotos a sangre y partículas.
- **Margen de cámara:** lo que va dentro de `#camara` crece hasta un 4,5 % por el dolly; deja **40 px libres** dentro de la caja (titulares ≤ 760 px de ancho). Las animaciones de entrada no pueden cruzar el borde (recorridos de 20–30 px cerca de los límites).
- **Fotograma 0 = miniatura en redes:** la imagen o el titular clave ya está en pantalla en 0 s (el check avisa con `first_frame_empty`).
- La hoja de contactos dibuja la caja en rojo: el director la revisa fotograma a fotograma.

## 4. Estructura de un reel (copiar `reels/plantilla-p6/`)
```
reels/<pieza>/
  hyperframes.json   package.json (pin 0.8.223 + @hyperframes/core)
  guion.json         ← duración, voz, tramos de voz con ventanas, prompt de música, umbrales de QC
  FICHA.md           ← encargo cerrado del director (escenas, tiempos, textos, recursos)
  index.html         ← raíz: pistas, cámara, subtítulos y audio
  compositions/<escena>.html   ← una subcomposición por escena (<template>, estilos y script dentro)
  assets/            ← fotos de Flow y capturas (las capturas de pantalla las hace preparar.cjs en Actions)
  preparar.cjs       ← opcional: grabaciones/capturas de las demos con Playwright, en la VM
  audio/             ← lo genera y lo guarda el flujo (no se sube a mano)
```
**Pistas (data-track-index):** 0 atmósfera · 1 escenas · 2 subtítulos · 3 superposiciones (cursor táctil, sellos) · 10 voz · 11 música · 12 efectos. Un tipo de elemento por pista; una sola pista de subtítulos.

## 5. Reglas de composición (hyperframes-core)
- Raíz: `data-composition-id`, `data-width="1080"`, `data-height="1920"`, `data-duration` = `guion.json.duracion`. `#raiz` con `width/height: 100%`.
- **Un solo `gsap.timeline({ paused: true })` por composición**, registrado al final en `window.__timelines["<id>"]` (id = `data-composition-id`).
- Subcomposiciones: host con `data-composition-id` + `data-composition-src` + `data-start` + `data-duration` + `data-track-index` + tamaño; el archivo envuelve todo en `<template>` (estilos y script dentro). Ids internos con prefijo de la escena (`#gancho-cifra`).
- **Prohibido**: `Math.random`, `Date.now`, `performance.now`, red en tiempo de render, `repeat: -1`, tweens de `display`/`visibility`/`autoAlpha` sobre un `.clip`, `transform` en CSS más tween del mismo eje (usar `fromTo`), animar `width/height/top/left` (usar `x/y/scale/scaleX`), `<br>` en texto, `crossorigin` en audio o vídeo, `<audio>` sin `id`, `getBoundingClientRect()` dentro de un tween.
- Aleatoriedad visual solo con semilla (`mulberry32(20261031)` de la plantilla).
- Antes de dar un reel por terminado, `hyperframes check` tiene que salir sin errores: lo ejecuta el flujo y deja `check.json`. Con un error de lint, las auditorías de diseño y contraste no se ejecutan; no hay que fiarse de un «0/0».

## 6. Movimiento (hyperframes-animation)
- **Cero estaticidad**: la cámara (`#camara`) hace dolly + giro de 1,5° durante todo el reel; atmósfera viva (halos sinusoidales, polvo de oro, rejilla al 15 %). Nada quieto más de 0,6 s: el QC lo mide con `freezedetect`.
- **Texto cinético**: palabra a palabra (`<span>` por palabra), entrada `rotationX` −70/−80° → 0 con `back.out(1.5)` o `power3.out`, stagger 0,10–0,14 s.
- **Mockups de producto** en 3D (`perspective: 1200px`, `rotateY/rotateX`, `preserve-3d`), con vida: cursor táctil con onda (registry `touch-indicator`), estado «EN DIRECTO», precio que cambia.
- **Transiciones**: corte con whoosh o salida en `power2.in` de 0,3–0,4 s. Antes de hacer a mano un efecto con nombre (grano, brillo, glitch, confeti) se busca en el registry (`hyperframes add`), en la nube.
- Componer 2–4 reglas atómicas por escena; los blueprints solo si la escena encaja entera.

## 7. Audio (hyperframes-audio) — la mezcla la hace HyperFrames
- **Origen del audio:** **Voz y efectos de sonido (karc0, 31/10 noche):** se generan con la API de ElevenLabs **solo** mediante el flujo «Voz y efectos (ElevenLabs)» (`scripts/hf/voz_api.cjs`): se dispara subiendo `reels/<pieza>/audio/pedir_voz.txt` y lee `guion.json` (`tramos_voz`, `voz`, `sfx_api`); recorta silencios y comprueba que cada frase cabe en su hueco. Ningún agente llama a la API por su cuenta. **La música la genera karc0 a mano**; imágenes y clips, karc0 en Flow.
- **Voz**: Multilingual v2, la voz elegida por karc0. Un `<audio id="voz-<tramo>" data-audio-group="voz">` por tramo, con la misma `data-start` que `guion.json`. `audio_pistas.cjs` recorta el silencio inicial, la ajusta a su ventana (acelera ×1,15 como mucho; si no cabe, **falla** y se pide a karc0 que la regenere más rápida) y escribe la `data-duration` real.
- **Bus de voz** `<hf-audio-group id="voz">` con la cadena de la plantilla (equivale a `voice-clean`: highpass 80 → menos barro 250 Hz → compresor 3:1 → claridad 3 kHz → limitador −1).
- **Música**: ElevenLabs Music instrumental (licencia del plan; la genera karc0, al menos 1 s más larga que el reel) en `<audio id="musica" data-audio-group="musica">`, con fundido de entrada y salida en `data-automation`. **Voiceover carve obligatorio** contra el grupo `voz` (fuerza 0,8): lo escribe `carve.mjs` en Actions. Nunca carve sobre la voz; nunca música ni efectos dentro del grupo `voz`.
- **Efectos**: grupo `sfx`, uno en cada corte, volumen 0,6–0,8.
- **Máster**: `producir.cjs` normaliza a **−14 LUFS ±1, pico real ≤ −1 dBTP, LRA ≤ 11** (loudnorm en dos pasadas) y lo mide después.

## 8. Cómo se renderiza (lo lanza Antigravity o el director, nunca en local)
GitHub → Actions → **Renderizar reel** → rama del encargo → `carpeta = reels/<pieza>` → Run.
Salida (artefacto `entrega-<run>`): `reel.mp4`, `contact_sheet.jpg`, `control_calidad.txt`, `check.json`, `audio_log.txt`. Si todo pasa, se entrega a Drive y al panel de piezas.

## 9. Checklist de entrega (lo que el director comprueba antes del APROBADO)
- [ ] Flujo en verde y `control_calidad.txt` «APTO TÉCNICAMENTE» (formato, fps, duración, audio, 0 negros, 0 congelados > 0,6 s, −14 ±1 LUFS, pico ≤ −1, LRA ≤ 11).
- [ ] `check.json` sin errores (lint, runtime, layout, contraste).
- [ ] Hoja de contactos: nada fuera de la caja roja; nada plano; marca correcta.
- [ ] Voz legible sobre la música (carve aplicado) y subtítulos sincronizados con cada tramo.
- [ ] Textos y precios idénticos a la FICHA; acción única «Escríbenos CARTA»; ningún nombre de local.
- [ ] Reporte de Antigravity en `07 ANTIGRAVITY DKITCHEN/REPORTES` con el enlace del run y la rama.

## 10. Fuera de alcance para P6
Pipelines Python de OpenMontage (`tools/`, `pipeline_defs/`, `backlot/`, `ink-theater/`, `remotion-composer/`), CapCut, Kling, avatares y `hyperframes-studio/` (modo heredado). No se borran; no se usan.
