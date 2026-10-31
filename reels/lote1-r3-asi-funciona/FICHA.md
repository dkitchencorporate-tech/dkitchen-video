# FICHA · Lote 1 · Reel 3 «Así funciona en 15 segundos» — 15 s
Encargo cerrado del director (31/10/2026). Base: `reels/plantilla-p6/` + `P6_GUIA_PRODUCCION.md`.
**Bloqueo:** pendiente de la decisión de karc0 sobre el recorrido (el pedido desde la mesa es exclusivo de Signature y no puede acabar en «desde 1 €»). Hasta entonces, recorrido provisional solo con funciones de Carta QR.

## Recorrido provisional (funciones de Carta QR)
| # | Archivo | Tiempo | Imagen y movimiento | Texto en pantalla |
|---|---|---|---|---|
| 1 | `compositions/escanea.html` | 0–3 | Móvil 3D que se inclina hacia un QR (SVG de la plantilla) con onda táctil | «Escanea» |
| 2 | `compositions/carta.html` | 3–7,5 | `assets/demo.mp4` en el móvil: bajar por la carta, abrir un plato con foto y alérgenos | «Elige con fotos y alérgenos» |
| 3 | `compositions/idioma.html` | 7,5–10,5 | Cambio a inglés en la grabación; chips ES · EN · FR | «En su idioma» |
| 4 | `compositions/camarero.html` | 10,5–13 | Toque en «Llamar al camarero» → segundo móvil (panel del camarero, maqueta HTML) recibe el aviso con vibración | «Y el camarero, al momento» |
| 5 | `compositions/cta.html` | 13–15 | CTA de la plantilla | «Sin apps. Sin papel. Desde 1 €. Escríbenos CARTA» |

`assets/demo.mp4`: lo graba `preparar.cjs` (Playwright en Actions, 390×844, nombre y logotipo del local ocultos con CSS inyectado) sobre la misma demo del Reel 1.

## Audio
Tramos en `guion.json`; `pop` en cada toque, whoosh en cada corte, `cierre` en 14,2.
