# FICHA · Lote 1 · Reel 2 «Lo que te cuestan las plataformas» — 20 s
Encargo cerrado del director (31/10/2026). Base: `reels/plantilla-p6/` + `P6_GUIA_PRODUCCION.md`. **Motion graphics puro: sin fotos ni grabaciones.** Es el primero que se produce (no depende de fotos ni demos); solo espera la voz elegida por karc0.
**Marcas de terceros:** sin logotipos ni nombres en pantalla; se dice «plataformas de reparto». La cifra es orientativa y la nota legal es obligatoria.

## Escenas
| # | Archivo | Tiempo | Imagen y movimiento | Texto en pantalla |
|---|---|---|---|---|
| 1 | `compositions/ticket.html` | 0–3,2 | Ticket de pedido en 3D (rotateX 12°) que cae y se asienta; el total **20,00 €** se tacha y aparece un sello **−30 %** en `#FF5A82` con impacto (impacto-suave) | «¿Cuánto te quedas de cada pedido de 20 €?» |
| 2 | `compositions/cuenta.html` | 3,2–9,2 | Contadores que suben con tick: **300 €/día** × **30 días** = **9.000 €** → la barra se tiñe de vino y queda **2.700 € al mes** (gigante, Bricolage 800, `#FF5A82`) | «≈ 2.700 € al mes en comisiones» + nota legal pequeña: «Cálculo orientativo con una comisión media del 30 %; depende de tu contrato.» |
| 3 | `compositions/propia.html` | 9,2–15,2 | Móvil 3D con tu propia carta: el sello pasa de −30 % a **0 %** en oro; las monedas (partículas oro con semilla) caen dentro de un icono de local | «0 % de comisión. El dinero se queda en tu local.» |
| 4 | `compositions/cta.html` | 15,2–20,0 | CTA de la plantilla | «Escríbenos CARTA y te enseñamos cuánto ahorras» |

Los contadores se animan con un objeto `{v: 0}` tween-eado y un `onUpdate` que escribe el texto con `toLocaleString('es-ES')` (determinista, sin reloj).

## Audio
Tramos en `guion.json`; whoosh en cada corte, `tick` en cada salto de contador, `cierre` en 19,0.

## Texto del post
Haz la cuenta con tus números 👇 Si vendes 300 € al día por plataformas, pagas unos 2.700 € al mes de comisión. Escríbenos CARTA y te enseñamos cuánto ahorras con tu propia carta. *Cálculo orientativo con una comisión media del 30 %; depende de tu contrato.*
