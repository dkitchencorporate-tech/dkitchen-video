# FICHA · Lote 1 · Reel 3 «Así funciona en 15 segundos» — 15 s
Encargo cerrado del director (31/10/2026). Base: `reels/plantilla-p6/` + `P6_GUIA_PRODUCCION.md`. Nivel de diseño: igual o por encima del reel de 40 s hypermotion (referencia aprobada por karc0).
**Decisión de karc0 (31/10):** recorrido original con pedido desde la mesa: entra en el plan Local (migración 0100), así que «Desde 1 €» es verdad. Nunca enseñar 3 idiomas ni el carrito de Signature. Fuente: `05 REFERENCIA/MAPA_PRECIOS_Y_FUNCIONES.md`.

## Recorrido
| # | Archivo | Tiempo | Imagen y movimiento | Texto en pantalla |
|---|---|---|---|---|
| 1 | `compositions/escanea.html` | 0–3 | Clip de Flow: mano que escanea el QR de la mesa → corte a móvil 3D con onda táctil | «Escanea» |
| 2 | `compositions/elige.html` | 3–6,8 | `assets/demo.mp4` en el móvil 3D: bajar por la carta, abrir un plato con foto y alérgenos | «Elige con foto y alérgenos» |
| 3 | `compositions/pide.html` | 6,8–9,6 | Grabación: añadir el plato y pulsar «Pedir» (pedido desde la mesa del plan Local) | «Pide desde la mesa» |
| 4 | `compositions/camarero.html` | 9,6–12,8 | Segundo móvil 3D (app del camarero, grabación real del panel) que recibe la comanda con vibración y la confirma con un toque | «La comanda, al camarero al momento» |
| 5 | `compositions/cta.html` | 12,8–15 | CTA de marca | «Sin apps. Sin papel. Desde 1 € el primer mes · Escríbenos CARTA» |

`assets/demo.mp4` y `assets/camarero.mp4`: los graba `preparar.cjs` (Playwright en Actions, 390×844) sobre una demo con el pedido desde la mesa activado; nombre y logotipo del local ocultos con CSS inyectado.

## Audio
Tramos en `guion.json`; `pop` en cada toque, whoosh en cada corte, `cierre` en 14,2.
