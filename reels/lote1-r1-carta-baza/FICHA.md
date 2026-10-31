# FICHA · Lote 1 · Reel 1 «Le hicimos la carta a un bar de Baza» — 25 s
Encargo cerrado del director (31/10/2026). Base: `reels/plantilla-p6/` + `P6_GUIA_PRODUCCION.md`. Guion aprobado: `02 PUBLICAR/NUEVA LINEA/LOTE_1_GUIONES.md`.
**Bloqueo:** no se empieza hasta que (1) karc0 elija la voz (se cambia `guion.json.voz`), (2) las fotos de la tanda 1 estén colocadas en la demo elegida y (3) estén en `assets/` las 2 fotos de Flow de abajo.

## Escenas (pista 1, una subcomposición por fila)
| # | Archivo | Tiempo | Imagen y movimiento | Texto en pantalla |
|---|---|---|---|---|
| 1 | `compositions/papel.html` | 0–2,2 | `assets/carta-papel.jpg` a sangre, Ken Burns lento (scale 1,0→1,08) + viñeta; grano sutil (registry) | «Esta era la carta de un bar de Baza.» |
| 2 | `compositions/qr.html` | 2,2–6,0 | Corte seco con whoosh. `assets/movil-qr.jpg` con zoom de entrada (punch-in 1,15→1) | «En 24 h le hicimos esta.» |
| 3 | `compositions/demo.html` | 6,0–16,0 | Móvil 3D (rotateY −18°→8°, preserve-3d) con `assets/demo.mp4` (grabación de preparar.cjs) dentro de la pantalla; `touch-indicator` en cada toque | Chips que entran uno a uno: «Fotos · Alérgenos · Inglés · Llamar al camarero» (Local = español + inglés; nunca «3 idiomas»: `05 REFERENCIA/MAPA_PRECIOS_Y_FUNCIONES.md`) |
| 4 | `compositions/panel.html` | 16,0–21,0 | Maqueta HTML del panel del local en un segundo móvil: el precio pasa de **12,50 €** a **13,00 €** (contador) y en el primer móvil la carta se actualiza con un destello oro | «La cambia él mismo, desde el móvil.» |
| 5 | `compositions/cta.html` | 21,0–25,0 | CTA de la plantilla (velo vino, logotipo, botón CARTA) | «Escríbenos CARTA · tu carta hecha en 24 h, gratis» |

## Recursos
- `assets/demo.mp4`: lo graba `preparar.cjs` en Actions con Playwright (viewport 390×844, deviceScaleFactor 2, `recordVideo`), sobre la demo `dkitchencorporate.es/m/<demo>` que fije el director al colocar las fotos. Recorrido: bajar por la carta con fotos → abrir un plato → alérgenos → cambiar a inglés → pulsar «Llamar al camarero». **Antes de grabar, inyectar CSS que oculte el nombre y el logotipo del local** (cabecera, título, pie); sin nombre en ningún fotograma.
- Fotos de Flow (las genera karc0, 9:16, guardar con este nombre):
  - `carta-papel.jpg`: *Close-up photo of a hand holding a worn, creased paper restaurant menu with coffee and oil stains, in a traditional Spanish bar, warm tungsten light, shallow depth of field, vertical 9:16, the menu text is blurred and unreadable, no logos, no watermark, no faces.*
  - `movil-qr.jpg`: *Photo of a smartphone held over a wooden bar table scanning a small QR code stand, the phone screen glowing, cozy Spanish tapas bar at night in the background with bokeh, warm light, vertical 9:16, no readable text, no logos, no watermark, no faces.*

## Audio
Tramos en `guion.json` (voz por tramo, música con carve, whoosh en 2,2 / 6,0 / 16,0 / 21,0; `cierre` en 24,0).

## Texto del post (lo publica karc0)
¿Tu carta sigue en papel? Le hicimos esta a un bar de Baza en 24 h: fotos, alérgenos, en inglés y botón para llamar al camarero. Escríbenos CARTA y en 24 h te enseñamos la tuya hecha, gratis. 👉 dkitchencorporate.es/carta-de-autor #hosteleria #baza #granada #cartadigital
