# FICHA · Lote 1 · Reel 2 v2 «El ticket» (Lo que te cuestan las plataformas) — 20 s, 9:16, 30 fps
Encargo cerrado del director (31/10/2026, noche). **Sustituye a la v1 «motion graphics puro», rechazada por karc0.** Cumple `P6_GUIA_PRODUCCION.md` §1 bis y §1 ter. Lee antes `00_LEEME_AGENTES.md`.
**Voz:** Álvaro (narrador fuera de plano). **Sin avatar hablante.** Sin marcas, logotipos ni colores de plataformas de reparto («plataformas de reparto»). Cifras orientativas con la nota legal obligatoria.

## Hilo visual y look
El ticket de papel: sale de la impresora, se convierte en la factura de la comisión y termina como el pedido propio, sin comisión. Cine nocturno, cálido, grano fino, vino `#6E0C2B` y oro `#D9B25C`; dolor en `#FF5A82`. Titulares y cifras en Bricolage 800; palabra de valor en Cormorant itálica.

## Material (karc0 lo deja en `assets/`; G1 lo graba el flujo)
`ref-dueno.png` (solo referencia) · `f1-impresora.mp4` · `f2-dueno-ticket.mp4` · `f3-cocina.mp4` · `f4-dueno-solo.mp4` · `f5-local-lleno.mp4` · `f6-plato.mp4` (Flow, 9:16, 8 s) · `g1-signature.mp4` = grabación real con Playwright de https://sevenfood.dkitchencorporate.es/ en 390 × 844 (scroll de la carta con fotos y un plato al carrito), **recortada para que no se vea el nombre ni el logotipo del local**; la hace `preparar.cjs` dentro del flujo.

## Planos (tiempos en `guion.json` → `planos`)
| # | Tiempo | Material | Qué se ve | Efecto y edición | Sonido |
|---|---|---|---|---|---|
| 1 | 0,0–1,8 | f1 | Macro del ticket saliendo; «20 €» en Cormorant itálica oro ya en el fotograma 0 | push-in lento + grano; el número se imprime con el papel | zumbido + golpe sordo |
| 2 | 1,8–3,4 | f2 → `assets/fx/f2.mp4` | El dueño mira el ticket largo | `backdrop-word` «−30 %» rosa DETRÁS de él; el «20 €» baja a «14 €» | impacto + tick |
| 3 | 3,4–5,2 | f3 | Fuego y vapor | tarjeta de cristal líquido: contador 0 → **300 €/día** con gráfica | tick por salto |
| 4 | 5,2–6,8 | f3 (match-cut por el vapor) | Hojas de calendario 3D cruzan la cocina | **× 30 días = 9.000 €** | whoosh por hoja |
| 5 | 6,8–9,2 | f4 → `assets/fx/f4.mp4` | El dueño solo tras la barra | `spotlight` con «2.700 €» brillando DETRÁS; nota legal pequeña dentro de la caja segura | riser → golpe → 0,2 s de silencio |
| 6 | 9,2–10,6 | f4 → f5 | De vacío y frío a lleno y cálido | `swipe` con cambio de grade (moody → warm) | drop de la música |
| 7 | 10,6–12,4 | g1 en móvil 3D + f5 desenfocado | La app Signature real | sello −30 % gira y queda **0 %** en oro | whoosh + pop |
| 8 | 12,4–14,0 | f5 | Local lleno | notificaciones de cristal: «Nuevo pedido · 0 % comisión», «Cliente nuevo · tuyo», «Reseña ★★★★★» | pop por notificación |
| 9 | 14,0–15,6 | f6 | Plato con vapor girando | interruptores: «Tu carta» · «Tu app» · «0 % comisión» | clic por interruptor |
| 10 | 15,6–18,0 | f6 desenfocado | Barra de comentario que escribe sola «CARTA» y se envía | tipografía de marca | tecleo + envío |
| 11 | 18,0–20,0 | f1 | Ticket en blanco con el logotipo DKitchen y «Escríbenos CARTA» | cierre de marca sin congelado | «cierre» en 19,0 |

Textos fijos: nota legal «Cálculo orientativo con una comisión media del 30 %; depende de tu contrato.» · CTA «Escríbenos CARTA y te enseñamos cuánto ahorras».
Efectos de los planos 2 y 5: `efectos/plan.json` (formato en `tools/effects/DKITCHEN.md`). Los de los planos 3, 4, 7, 8, 9 y 10 se construyen en HyperFrames (GSAP) con la marca, porque los del paquete usan otra tipografía y otra paleta.

## Audio
Voz en `audio/originales/voz-t1…t4.mp3` (tramos en `guion.json`), música `audio/originales/musica.mp3` con el drop en 9,2 s; sonidos de `marca/sonido/`.

## Texto del post
Haz la cuenta con tus números 👇 Si vendes 300 € al día por plataformas, pagas unos 2.700 € al mes de comisión. Escríbenos CARTA y te enseñamos cuánto ahorras con tu propia carta. *Cálculo orientativo con una comisión media del 30 %; depende de tu contrato.*
