# FICHA · Lote 1 · Reel 3 «Así funciona en 15 segundos» — 15 s
Encargo cerrado del director (31/10/2026). Base: `reels/plantilla-p6/` + `P6_GUIA_PRODUCCION.md`. Nivel de diseño: igual o por encima del reel de 40 s hypermotion (referencia aprobada por karc0).
**Decisión de karc0 (31/10):** recorrido original con pedido desde la mesa: entra en el plan Local (migración 0100), así que «Desde 1 €» es verdad. Nunca enseñar 3 idiomas ni el carrito de Signature. Fuente: `05 REFERENCIA/MAPA_PRECIOS_Y_FUNCIONES.md`.

## Recorrido
| # | Archivo | Tiempo | Imagen y movimiento | Texto en pantalla |
|---|---|---|---|---|
| 1 | `compositions/escanea.html` | 0–3 | Móvil 3D con la cámara apuntando al QR real de la tarjeta (assets/qr-tarjeta.png), láser de lectura, esquinas que se cierran, aviso «Mesa 4», toque, destello y se abre la carta real (sin clip de Flow: decisión del director 02/11 para no depender de material externo) | «Escanea» |
| 2 | `compositions/elige.html` | 3–6,8 | `assets/demo.mp4` en el móvil 3D: bajar por la carta, abrir un plato con foto y alérgenos | «Elige con foto y alérgenos» |
| 3 | `compositions/pide.html` | 6,8–9,6 | Grabación: añadir el plato y pulsar «Pedir» (pedido desde la mesa del plan Local) | «Pide desde la mesa» |
| 4 | `compositions/camarero.html` | 9,6–12,8 | Segundo móvil 3D (app del camarero, grabación real del panel) que recibe la comanda con vibración y la confirma con un toque | «La comanda, al camarero al momento» |
| 5 | `compositions/cta.html` | 12,8–15 | CTA de marca | «Sin apps. Sin papel. Desde 1 € el primer mes · Escríbenos CARTA» |

Material: `preparar.cjs` (Playwright en Actions, iPhone 13 ×3) captura en producción una demo interna del plan Local: `inicio.jpg`, `carta.jpg` (página completa), `pedido.jpg` (3 platos, 62 €) y `camarero.png` («Así le llega al camarero»). Nombre del local → «Tu restaurante»; ciudad y especialidad fuera. Revisión previa con el flujo «Preparar capturas». Música por API (Alex, 02/11).

## Audio
Tramos en `guion.json`; `pop` en cada toque, whoosh en cada corte, `cierre` en 14,2.
