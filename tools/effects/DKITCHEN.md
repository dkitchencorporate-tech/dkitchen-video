# tools/effects — copia adoptada por DKitchen (31/10/2026)
Origen: github.com/Vibha-Ramprakash/claude-video-effects (MIT, © 2026 Vibha Ramprakash). Fuentes y modelos con sus licencias (fonts/*.txt, models/NOTICE.md). Se conserva LICENSE.
Cambios de DKitchen: quitada la carga de `fx_private.py` (exec de código no versionado) y `assets/preview.jpg`.
**Solo se ejecuta en GitHub Actions** (flujo «Aplicar efectos»), nunca en el portátil.

## Uso en un reel
`reels/<pieza>/efectos/plan.json`:
```json
{"clips": [
  {"entrada": "assets/f4-bar-vacio.mp4", "salida": "assets/fx/f4.mp4", "stills": "1.0,2.5",
   "efectos": [{"fx": "backdrop-word", "start": 0.4, "end": 2.6, "text": "2.700 €", "color": "#FF5A82", "font": "bold"}]}
]}
```
El flujo aplica los efectos clip a clip, deja los clips en `salida` (commit a la rama) y los fotogramas de control (`stills`) como artefacto para el storyboard. Los efectos que siguen la cara necesitan una persona en plano (clip de Flow); el resto (grade, swipe, slow-push, messages, toggles, liquid-glass-graph, countdown-flip, timeline, dot-reveal…) funcionan sobre cualquier clip. Colores y textos: siempre los de `marca/` y la guía P6. Las fuentes del paquete no sustituyen a las de marca en titulares.
