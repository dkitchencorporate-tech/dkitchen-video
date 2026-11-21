# P6 · Guía única de producción de vídeo DKitchen (actualizada 21/11/2026)

> Fuente de verdad técnica para producir Reels en `dkitchen-video` (rama activa: **`main`**). Si cualquier otro documento heredado de OpenMontage (`AGENTS.md`, `AGENT_GUIDE.md`, `CODEX.md`) dice otra cosa, **manda esta guía**. Mantenida bajo gobernanza **Alex (Dirección) + Agente DK** (agnóstico de modelo).

## 1. Reglas que no se discuten
1. **Render solo en GitHub Actions (`Renderizar reel`, rama `main`).** Prohibido ejecutar `render`, `preview`, `npm install` ni Chromium en equipos locales ligeros. En local solo se editan HTML/JSON/scripts y comprobaciones ligeras (`node --check`).
2. **Un reel = un proyecto HyperFrames propio** en `reels/<pieza>/`, partiendo de `reels/plantilla-p6/`. Nunca se edita `hyperframes-studio/index.html`.
3. **HyperFrames `0.8.223`**, fijado en `package.json` del reel y en `scripts/hf/producir.cjs`. En `producir.cjs` se mantiene **`-shortest`** en el masterizado FFmpeg para evitar falsos rechazos IEEE-754 por `+0,10 s` de cola AAC en piezas `>= 16 s`.
4. **QC medido y bloqueante.** `control_calidad.txt` lo genera `producir.cjs` con medidas reales (`blackdetect`, `freezedetect`, LUFS, pico real, LRA, duración). Prohibido falsificar resultados o entregar una pieza en rojo.
5. **Revisión visual obligatoria de `contact_sheet.jpg`.** Aunque `control_calidad.txt` salga `APTO TÉCNICAMENTE`, **Agente DK** inspecciona los fotogramas reales para verificar nitidez, fotos cargadas dentro de los mockups 3D, caja segura roja y ausencia de restos rotos.
6. **Capturas y fotos sin adulterar:** prohibido hacer reemplazos destructivos de texto sobre capturas de pantalla reales en `preparar.cjs`. Toda fotografía en escenas y dentro de mockups de móviles debe ser nítida, realista (cero caricaturas o dibujos) y coherente con la propuesta comercial.
7. **Marca única en `/marca`** (`tokens.css`, `fuentes.css`, `logo.svg`, `sonido/`). No se duplica dentro de cada reel.
8. **Precios y canon comercial:** siempre sincronizados con `src/lib/pricing-config.ts` (`Carta 9 €/mes`, `Local 29 €/mes` con `1 €` primer mes, `Sala 79 €/mes`, `Fundador QR 49 €/mes` / `147 €` trimestre, `Signature` desde `700 €` o `500 €` Fundador). **Cero emojis** y **cero menciones visibles a `"IA"`** hacia hosteleros. Acción clara (`Escríbenos CARTA`) y cero nombres privados de terceros no autorizados.
9. **Repositorios públicos sin secretos:** nunca incluir tokens, claves, emails privados ni datos personales en archivos del repo.

## 1 bis. Nivel de diseño exigido — lo primero que se revisa
- **Suelo de calidad:** `reels/reel-40-hypermotion` (y estándar reciente en `reels/lote1-r2-comision`, `lote2-r4-universal-carta-pedidos` y `lote2-r5-gastro-carta-autor`). Todo reel nuevo debe igualar o superar ese nivel.
- **Hook claro en los primeros `1,5 s`:** identificar explícitamente a quién va dirigido (por ejemplo: *Hostelero*, *Dueño de bar*, *Restaurante con carta de autor*) con gancho visual y de audio directo, evitando empezar todos los Reels del mismo lote con idéntico arranque o plano estático.
- **Prohibido:** escenas planas de solo texto sobre color liso. Todo golpe tipográfico vive sobre fotografía gastronómica o grabación/entorno real con profundidad.
- **Obligatorio en cada reel:** material real o fotografía de alto impacto en movimiento, mockups **3D con imágenes reales visibles dentro de la pantalla**, cifras animadas o comparativas reales cuando aporten valor, y demostración clara de funcionamiento y CTA.
- **Ritmo:** cambio de plano cada `1,5–2,8 s`; fotograma `0` listo como miniatura de portada en IG/FB/TikTok.

## 1 ter. PUERTA DE CALIDAD INNEGOCIABLE
- **Sin avatar hablante por defecto:** foco en producto real, fotografía editorial gastronómica y mockups 3D.
- **7 pilares visuales y sonoros:** (1) fotografía o vídeo realista con grade editorial; (2) profundidad por capas y atmósfera viva; (3) UI o mockup 3D nítido con datos y fotos reales cargadas; (4) tipografía Gran Reserva (`Bricolage 800` + `Cormorant` itálica + `Inter`); (5) transiciones motivadas; (6) diseño sonoro sincronizado por corte (`whoosh`, `pop`, `tick`, `impacto-suave`); (7) ritmo sostenido de `1,5–3 s`.
- **Autorrevisión previa:** puntuar del 0 al 10 gancho en `1,5 s`, legibilidad móvil dentro de la caja roja, nitidez en mockups, coherencia de precios y audio claro; **por debajo de `9/10` no se entrega**.

## 2. Marca (Gran Reserva)
- **Colores (`marca/tokens.css`):** vino `#6E0C2B` (oscuro `#4A081D`), oro `#D9B25C` (`#F0C96F`), negro `#0A080C`/`#050406`, papel `#F7F5F2`. Dolor/pérdida `#FF5A82`; beneficio en oro.
- **Tipografía (`marca/fuentes.css`, local, OFL):** Bricolage Grotesque 800, Inter y Cormorant Garamond itálica. No cargar fuentes externas en render.
- **Sonidos de marca:** `marca/sonido/` + efectos libres en `assets/sfx/`.

## 3. Formato y zona segura (`marca/tokens.css`)
- `1080 × 1920` (`9:16`), `30 fps`, `15–25 s`.
- Márgenes caja segura: **arriba `250 px` · abajo `420 px` · derecha `140 px` · izquierda `60 px`** (`x 60–940`, `y 250–1500`).
- Todo titular, precio, CTA y subtítulo va dentro de `var(--safe-*)` con margen adicional frente al dolly de cámara (`titulares <= 760 px` de ancho).
- **Fotograma 0 = miniatura:** nunca dejar el frame 0 en negro o vacío (`first_frame_empty`).

## 4. Estructura de un reel (copiar `reels/plantilla-p6/`)
```text
reels/<pieza>/
  hyperframes.json   package.json (hyperframes 0.8.223)
  guion.json         duración, tramos de voz, música y umbrales de QC
  FICHA.md           guion y plano a plano completo
  index.html         raíz con cámara, pistas, subtítulos y audio
  compositions/<escena>.html
  assets/            fotos nítidas, capturas limpias, assets/sfx/
  audio/             originales/ (voz-t*.mp3 + musica.mp3) y procesados del flujo
```
**Pistas (`data-track-index`):** `0` atmósfera · `1` escenas · `2` subtítulos · `3` superposiciones · `10` voz · `11` música · `12` efectos.

## 5. Reglas de composición (`hyperframes-core`)
- Raíz: `data-composition-id`, `data-width="1080"`, `data-height="1920"`, `data-duration` = `guion.json.duracion`.
- **Un solo `gsap.timeline({ paused: true })` por composición**, registrado en `window.__timelines["<id>"]`.
- **Prohibido:** `Math.random`, `Date.now`, `performance.now`, red durante el render, `repeat: -1`, tweens de `display`/`visibility`/`autoAlpha` sobre `.clip`, animar `width/height/top/left` (usar transformaciones GPU), `<br>` en texto, `crossorigin` en audio/vídeo, `<audio>` sin `id`, `getBoundingClientRect()` dentro de tweens.
- Aleatoriedad visual solo determinista con semilla (`mulberry32`).
- `hyperframes check` debe finalizar con `0` errores antes de dar el render por válido.

## 6. Movimiento (`hyperframes-animation`)
- Cámara `#camara` viva (dolly suave + giro sutil) y atmósfera dinámica; nada congelado `> 0,6 s` (`freezedetect`).
- Mockups en 3D con perspectiva (`1200 px`), cursor táctil e imágenes visibles de platos/UI en pantalla.

## 7. Audio (`hyperframes-audio`)
- **Locución:** voz masculina en español **Álvaro**. Si el flujo ElevenLabs (`scripts/hf/voz_api.cjs`) está disponible y activo se usa; **si la API devuelve error de pago/cuota, generar con `es-ES-AlvaroNeural` (`edge-tts`)** ajustando el ritmo para que cada tramo quepa exactamente en su ventana (`ratios <= 1,10`, sin cortes).
- **Música:** pista instrumental distinta por cada reel del lote (banco libre CC-BY 4.0 con atribución documentada en la entrega, e.g., Incompetech Kevin MacLeod, duración superior al reel). Obligatorio **`carve.mjs` contra el grupo `voz`** (fuerza `0,8`).
- **Máster:** `scripts/hf/producir.cjs` masteriza en dos pasadas a **`-14 LUFS ± 1`**, pico real **`<= -1 dBTP`**, `LRA <= 11` y aplica `-shortest` para clavar la duración exacta del vídeo.

## 8. Cómo se renderiza
GitHub -> Actions -> **Renderizar reel** -> rama `main` -> `carpeta = reels/<pieza>` -> Run workflow.
Artefacto descargable `entrega-<run>`: `reel.mp4`, `contact_sheet.jpg`, `control_calidad.txt`, `check.json`, `audio_log.txt`.

## 9. Checklist previo a entregar a Dirección
- [ ] Run de Actions en verde y `control_calidad.txt` = `APTO TÉCNICAMENTE`.
- [ ] `check.json` con `0` errores.
- [ ] `contact_sheet.jpg` revisada visualmente fotograma a fotograma: caja roja respetada, mockups 3D con fotos nítidas visibles, hook claro para el público objetivo en `<= 1,5 s`.
- [ ] Audio nítido sobre música distinta al resto del lote (carve aplicado) y subtítulos sincronizados.
- [ ] Precios y textos alineados con `pricing-config.ts`, cero emojis y cero rastro `"IA"`.
- [ ] Entrega final acompañada de textos e instrucciones listas por red (`Instagram`, `Facebook`, `TikTok`) + licencia/atribución musical si es CC-BY.

## 10. Fuera de alcance para P6
Pipelines Python heredados (`tools/` antiguos, `pipeline_defs/`, `backlot/`, `ink-theater/`, `remotion-composer/`), CapCut y `hyperframes-studio/`. No se usan.
