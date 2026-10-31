# 00 · LÉEME PRIMERO — Cómo se producen los vídeos de DKitchen (para cualquier agente de IA)
Válido para Antigravity, Jules (Google), Claude Code en la nube o cualquier otro agente. **Este documento manda sobre AGENTS.md, AGENT_GUIDE.md, CLAUDE.md, CODEX.md y el resto de guías heredadas del repo** (son de OpenMontage y del modo antiguo). Actualizado 31/10/2026 por Claude Code (director).

## 0. Quién hace qué
- **Agente ejecutor (tú):** produces el reel completo en una rama propia: composiciones, plan de efectos, sincronía con el audio y ajustes hasta que el QC pase. Haces el trabajo pesado.
- **Director (Claude Code):** escribe la ficha y el plano a plano, revisa tus fotogramas y el render contra la guía, da el APROBADO y fusiona. Solo él fusiona a `main` o a `claude/p6-config`.
- **karc0 (Alex, dueño):** genera a mano en Flow (imágenes y clips) y en ElevenLabs (voz y música) y aprueba la pieza final. **Nunca sale en cámara.** No usa terminales.
- **Prohibido:** llamar a la API de ElevenLabs; generar imágenes, voces o música con IA desde el flujo; inventar precios; tocar otros repos.

## 1. Lee en este orden (completos)
1. `P6_GUIA_PRODUCCION.md`: reglas, **§1 bis nivel de diseño** y **§1 ter PUERTA DE CALIDAD INNEGOCIABLE**, marca, formato y zona segura, audio y checklist.
2. La carpeta de tu pieza: `reels/<pieza>/FICHA.md` y `guion.json` (y el plano a plano si existe).
3. `reels/reel-40-hypermotion/`: **el suelo de calidad**; tu pieza tiene que ser mejor.
4. `tools/effects/DKITCHEN.md`: efectos con seguimiento de cara y capas detrás de la persona.
5. `reels/plantilla-p6/`: esqueleto técnico (solo técnica; su aspecto NO es referencia de diseño).

## 2. Mapa del repositorio (solo lo que se usa)
| Ruta | Qué es | Cómo se usa |
|---|---|---|
| `marca/` | `tokens.css` (colores, zona segura), `fuentes.css` + fuentes locales, `logo.svg`, `sonido/` (whoosh, pop, tick, impacto-suave, cierre) | Se copia sola a cada reel. **No se edita ni se duplica.** |
| `reels/plantilla-p6/` | Proyecto HyperFrames mínimo: `index.html` (raíz con la cámara y las escenas), `compositions/*.html` (una escena por archivo), `guion.json`, `hyperframes.json`, `package.json`, `audio/` | Se copia entera para crear un reel nuevo. |
| `reels/<pieza>/` | Un reel = un proyecto HyperFrames propio | Todo lo de tu pieza vive aquí. |
| `reels/<pieza>/audio/originales/` | `voz-t1.mp3…voz-tN.mp3` y `musica.mp3` que deja karc0 | No se tocan: el flujo los mide, recorta y mezcla. |
| `reels/<pieza>/assets/` | Clips y fotos de Flow (`f1-….mp4`), grabaciones reales (`g1-….mp4`), capturas | Nombres en minúsculas y sin espacios. |
| `reels/<pieza>/efectos/plan.json` | Plan de efectos de `tools/effects` por clip | Lo procesa el flujo «Aplicar efectos». |
| `scripts/hf/producir.cjs` | marca → pistas de audio → carve de la música bajo la voz → `hyperframes check` → render → máster −14 LUFS → **QC medido que bloquea** | Lo ejecuta el flujo «Renderizar reel». |
| `tools/effects/` | 45 efectos (claude-video-effects, MIT): palabra gigante detrás de la persona, spotlight, cristal con gráficas, notificaciones, interruptores, swipe antes/después, push-in… | Lo ejecuta el flujo «Aplicar efectos». |
| `.github/workflows/render.yml` | «Renderizar reel» (entrada `carpeta` = `reels/<pieza>`) | Render final + QC. Artefactos: mp4, hoja de contactos y `control_calidad.txt`. |
| `.github/workflows/efectos.yml` | «Aplicar efectos» (entradas `carpeta` y `solo_stills`) | `solo_stills=true` → fotogramas de control para el storyboard; `false` → clips procesados guardados en la rama. |
| Todo lo demás (`hyperframes-studio/`, `piezas/`, `escenas/`, `remotion-composer/`, `pipeline_defs/`…) | Modo heredado | **No se usa ni se edita.** |

## 3. Cómo se produce un reel (paso a paso)
1. **Rama:** `agente/<pieza>`, creada desde `claude/p6-config`. Nunca trabajes en `main` ni en `claude/p6-config`.
2. **Crear la pieza:** si `reels/<pieza>/` no tiene `hyperframes.json`, copia dentro `reels/plantilla-p6/` y conserva `FICHA.md` y `guion.json` del director.
3. **Material:** comprueba que están en `assets/` y `audio/originales/` todos los archivos que pide la ficha. Si falta alguno, **para** y deja en el reporte la lista exacta («falta f4-dueno-solo.mp4»); no lo sustituyas por otra cosa.
4. **Efectos (si la ficha los pide):** escribe `efectos/plan.json` (formato en `tools/effects/DKITCHEN.md`) con colores de marca. Los efectos de cara solo sobre clips con persona; ventanas de 1,5–4 s.
5. **Composición:** una escena por plano en `compositions/`, todo dentro de la caja segura (`var(--safe-*)`), animación GSAP en la línea de tiempo pausada (determinista: nada de `Math.random` sin semilla ni de relojes), contadores con un objeto animado y `toLocaleString('es-ES')`, y fotograma 0 = miniatura (titular o imagen ya en pantalla).
6. **Sincronía:** los tiempos de cada plano salen de `guion.json` (`tramos_voz`). Golpes de sonido en cada corte y en cada cifra.
7. **Autorrevisión (§1 ter):** puntúa los 10 puntos (material real, capas, cristal o 3D con cifras, tipografía, transiciones, sonido, ritmo de 1,5–3 s, gancho en 1,5 s, legibilidad en móvil y precios correctos). **Con menos de 9/10 no entregues: mejora.**
8. **Entrega:** push de la rama y PR contra `claude/p6-config` con el reporte (§5). El director lanza «Aplicar efectos» y «Renderizar reel» sobre tu rama, revisa y aprueba o devuelve.

## 4. Reglas que no se negocian
- **Nivel de diseño máximo siempre** (§1 bis y §1 ter). Prohibido: texto sobre fondo plano, plantillas genéricas, bocetos presentados como storyboard, cajas detrás del texto, logotipos o colores de terceros (plataformas de reparto) y nombres de locales reales.
- **Precios, funciones y condiciones:** solo los de la ficha, que el director comprueba contra la web (`src/lib/pricing-config.ts`). Cifras orientativas con su nota legal. No inventes ninguna oferta.
- **CTA única:** la que diga la ficha (lote 1: «Escríbenos CARTA…»).
- **Voz:** la de la ficha (hoy Álvaro; se irá alternando). **Sin avatar hablante** hasta que el director lo indique.
- **El render oficial solo en GitHub Actions**, nunca en el portátil de karc0. Si eres un agente en la nube (Jules), en tu VM puedes hacer previsualizaciones (`npx hyperframes check` o `snapshot`), pero el render que vale es el del flujo.
- **QC:** `control_calidad.txt` lo escribe el flujo con medidas reales. Prohibido escribir a mano «aprobado», LUFS o cifras de pruebas.
- **Secretos:** ninguno en archivos. El repo es público.

## 5. Reporte de entrega (en la descripción del PR y en `reels/<pieza>/REPORTE.md`)
Rama y commit · lista de planos con su archivo y sus tiempos · material usado (archivo por plano) · plan de efectos · autorrevisión de 10 puntos con nota · lo **no** comprobado, dicho claramente · dudas para el director. Sin capturas inventadas.

## 6. Configuración para Jules (jules.google)
- Repositorio `dkitchencorporate-tech/dkitchen-video`, rama base `claude/p6-config`.
- **Initial Setup** (Configuration → Run and Snapshot):
  ```bash
  sudo apt-get update && sudo apt-get install -y ffmpeg
  npm i --no-save playwright ffmpeg-static
  npx playwright install --with-deps chromium
  pip install -r tools/effects/requirements.txt
  ```
- Encargo tipo (lo escribe el director): «Produce `reels/<pieza>` siguiendo 00_LEEME_AGENTES.md y la ficha de la pieza. Rama `agente/<pieza>`. PR contra `claude/p6-config` con el reporte del §5.»
