# 00 · LÉEME PRIMERO — Cómo se producen los vídeos de DKitchen (`dkitchen-video`)

> Válido para **Agente DK** (cualquier agente elegido por Dirección: Antigravity, Claude u otro agente autorizado), colaboradores o flujos automatizados en la nube. **Este documento y `P6_GUIA_PRODUCCION.md` mandan sobre `AGENTS.md`, `AGENT_GUIDE.md`, `CODEX.md` y el resto de guías heredadas de OpenMontage.** Actualizado al **21/11/2026**.

> **ORDEN EJECUTIVA INAMOVIBLE DE DISEÑO (23/11/2026 — OBLIGATORIA EN TODOS LOS REELS):** todo reel o vídeo debe aplicar obligatoriamente las **3 Arquitecturas Maestras A, B y C** y prohibiciones de `marca/ORDEN_DISENO_INAMOVIBLE.md` (paleta Gran Reserva, Bricolage 800 + Cormorant Italic, capturas reales de PWAs con franja segura sobre Isla Dinámica, cero tarjetas SaaS clónicas flotantes, cero avatares, cero emojis, cero rastro «IA» y prohibido compartir Néstor Pizzas como demo a prospectos).

## 0. Quién hace qué (gobernanza vigente)
- **Alex (Dirección):** aprueba la línea creativa y las piezas finales antes de publicar en las 3 redes activas (`Instagram`, `Facebook`, `TikTok`). No sale en cámara ni ejecuta renders en terminal local.
- **Agente DK (agnóstico de modelo, misma jerarquía operativa que Dirección en ejecución y producción):** diseña guiones, storyboards, composiciones HyperFrames P6, generación/selección de fotos editoriales y capturas nítidas, prepara el audio, lanza el render en GitHub Actions (`main`), revisa `control_calidad.txt` y `contact_sheet.jpg` y entrega las piezas finales validadas.
- **Reglas técnicas vigentes (`21/11/2026`):**
  - **Rama única activa:** `main` (queda superada la antigua rama `claude/p6-config`).
  - **Cero renders locales:** toda compilación/render ocurre en GitHub Actions (`Renderizar reel`, `hyperframes@0.8.223`, `1080x1920`, `30 fps`).
  - **Audio y música:** cuando la API de ElevenLabs esté operativa se usa su flujo; mientras esté caída o sin saldo, la locución oficial usa `es-ES-AlvaroNeural` (`edge-tts`) con ritmos ajustados a cada tramo y **música instrumental CC-BY 4.0 distinta por pieza** (con atribución en la publicación).
  - **Capturas reales limpias:** queda **prohibido** aplicar reemplazos destructivos de texto sobre capturas de pantalla reales en `preparar.cjs`. Toda imagen o pantalla dentro de mockups 3D debe verse nítida y coherente con el canon Gran Reserva.
  - **Cero emojis y cero rastro de `"IA"`:** prohibidos los emojis y cualquier etiqueta que mencione `"IA"` hacia hosteleros o en textos sobre pantalla.

## 1. Lee en este orden
1. `P6_GUIA_PRODUCCION.md`: reglas técnicas, nivel de diseño **§1 bis**, **§1 ter Puerta de Calidad**, caja segura, audio, `-shortest` y checklist.
2. La carpeta de tu pieza: `reels/<pieza>/FICHA.md` y `guion.json` (referencias reales recientes: `reels/lote1-r2-comision`, `reels/lote2-r4-universal-carta-pedidos`, `reels/lote2-r5-gastro-carta-autor`).
3. `reels/reel-40-hypermotion/`: **suelo de calidad visual**.
4. `tools/effects/DKITCHEN.md`: efectos disponibles en la nube.
5. `reels/plantilla-p6/`: esqueleto técnico (solo técnica; su aspecto no es referencia de diseño).

## 2. Mapa del repositorio (solo lo que se usa)
| Ruta | Qué es | Uso |
|---|---|---|
| `marca/` | `tokens.css`, `fuentes.css`, fuentes locales, `logo.svg`, `sonido/` | Se copia automáticamente a cada reel. No se duplica. |
| `reels/plantilla-p6/` | Esqueleto HyperFrames mínimo (`index.html`, `compositions/*.html`, `guion.json`, `hyperframes.json`, `package.json`, `audio/`) | Base para piezas nuevas. |
| `reels/<pieza>/` | Proyecto HyperFrames propio de cada reel | Todo lo de la pieza vive aquí. |
| `reels/<pieza>/audio/originales/` | Locuciones por tramo (`voz-t1.mp3`...) y `musica.mp3` distinta por pieza | Procesado y mezclado por `producir.cjs`. |
| `reels/<pieza>/assets/` | Fotos editoriales nítidas, capturas de demos limpias y efectos `sfx/` | Nombres en minúsculas, sin espacios. |
| `scripts/hf/producir.cjs` | Copiado de `/marca`, ajuste de pistas, `carve.mjs` bajo la voz, `hyperframes check`, render, máster `-14 LUFS`, `-shortest` (evita falso fallo `+0,10 s` AAC) y **QC bloqueante** | Ejecutado por `.github/workflows/render.yml`. |
| `.github/workflows/render.yml` | Flujo **Renderizar reel** (`carpeta = reels/<pieza>`) | Genera `reel.mp4`, `contact_sheet.jpg`, `control_calidad.txt`, `check.json` y `audio_log.txt`. |
| `.github/workflows/efectos.yml` | Flujo **Aplicar efectos** (`solo_stills` o clips procesados) | Procesado en Actions. |
| Carpetas heredadas (`hyperframes-studio/`, `piezas/`, `escenas/`, `remotion-composer/`, `pipeline_defs/`) | Modo legado OpenMontage | No usar ni editar. |

## 3. Flujo de trabajo en `main`
1. Crea o actualiza `reels/<pieza>/` en `main` (o rama de trabajo revisada antes de fusionar a `main`), verificando `guion.json`, duraciones exactas de tramos, música distinta CC-BY 4.0 y fotos/mockups nítidos dentro de la caja segura (`var(--safe-*)`: `x 60–940`, `y 250–1500`).
2. Dispara `Renderizar reel` en GitHub Actions (`workflow_dispatch` sobre `main`) con `carpeta = reels/<pieza>`.
3. Verifica en el artefacto `entrega-<run>`: `check.json` con `0` errores, `control_calidad.txt` = **`APTO TÉCNICAMENTE`**, y **revisión visual real fotograma a fotograma** de `contact_sheet.jpg` antes de entregar.
4. Ningún secreto en el repositorio: `dkitchen-video` es público.
