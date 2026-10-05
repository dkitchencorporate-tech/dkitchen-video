# DIRECTRICES CREATIVAS Y ESTÁNDAR AUDIOVISUAL INAMOVIBLE - DKITCHEN STUDIO

> **ESTATUS:** MANDATORIO Y VINCULANTE PARA TODOS LOS AGENTES Y PIPELINES (ANTIGRAVITY, CLAUDE, CODEX, CURSOR, RUNNERS).
> **PROHIBICIÓN ESTRICTA:** Queda terminantemente prohibido generar o entregar piezas planas, fondos negros mudos, tipografía sin movimiento cinético o montajes sin rigor audiovisual y sonoro.

---

## 1. PRINCIPIOS CREATIVOS DE MARCA ("GRAN RESERVA")

1. **Movimiento Continuo en Pantalla (Cero Estaticidad):**
   - La cámara nunca debe estar fija. Toda composición debe aplicar movimiento continuo (`Dolly`, `Parallax` en ejes Z/X/Y, zoom suave o rotación de 1.5° a 3°).
   - Ningún frame puede quedarse estático más de **0.6 segundos**.

2. **Fondos con Atmósfera y Luz Orgánica:**
   - Prohibido el uso de negros planos o lienzos sin profundidad.
   - Todo fondo debe componerse con:
     - Partículas orgánicas en movimiento continuo (polvo de oro, destellos vino, bokeh flotante en Canvas/WebGL).
     - Halos volumétricos (`ambient-glow`) con degradados radiales Gran Reserva (`#6E0C2B`, `#D9B25C`, `#160E18`, `#0E0C12`) pulsando con curvas sinusoidales.
     - Malla editorial de textura suave (puntos o rejilla sutil al 15% de opacidad).

3. **Caja Segura Estricta (TikTok, Instagram Reels, YouTube Shorts):**
   - **Dimensiones Canvas:** 1080 × 1920 px (9:16 vertical).
   - **Caja Segura Auditada:** 940 × 1280 px.
   - **Márgenes Obligatorios:**
     - Franja superior libre: **220 px mínimo** (avatares, historias y cabecera de la red social).
     - Franja inferior libre: **420 px mínimo** (caption, música, botones de me gusta y compartir).
     - Franja lateral derecha libre: **140 px** (botones de interacción de TikTok/Instagram).
   - *Ningún elemento interactivo, texto de gancho o precio puede invadir estas áreas.*

4. **Cinética Tipográfica de Alto Impacto:**
   - La tipografía debe dividirse por palabras (`SplitText` o spans independientes).
   - Entrada con máscaras cinéticas, rotación 3D en `rotateX` y curvas de rebote de autor (`back.out(1.5)` o `power3.out`).
   - Jerarquía cromática obligatoria:
     - Palabras de dolor/pérdida: Resalte en tono vino (`#FF5A82` / `#6E0C2B`).
     - Palabras de valor/beneficio: Oro de autor (`#E6C275` / `#D9B25C`) con tipografía serif de prestigio (`Cormorant Garamond`).
     - Cuerpo general: `Bricolage Grotesque` para números/titulares e `Inter` para subtítulos técnicos.

5. **Elementos 3D y Micro-interacciones Reales:**
   - Los mockups de producto (smartphones, comandero, cartas digitales) deben montarse en perspectiva 3D (`perspective: 1200px`, `rotateX`, `rotateY`, `transform-style: preserve-3d`).
   - Deben incluir elementos vivos: Dynamic Island, estados "EN DIRECTO", cursores táctiles animados con efecto onda (*ripple*) y transformaciones visuales dinámicas (ej: precios cambiando en vivo).
   - Integración de avatares UGC / portavoces en esquinas flotantes o transiciones directas para retención y humanización.

---

## 2. INGENIERÍA DE SONIDO Y LOUDNORM (EBU R128)

1. **Locución Obligatoria (Voz de Marca):**
   - Modelo: ElevenLabs Multilingual V2.
   - Voz oficial masculina enérgica peninsular: **Álvaro** (`voice_id: bIHbv24MWmeRgasZH58o` o compatible viral con entonación natural, rápida y comercial).
   - Velocidad (Speed): 1.05× a 1.12× para mantener ritmo ágil de retención en redes.

2. **Música Cinemática y Ducking:**
   - Fondo musical Lo-Fi cinemático o beat rítmico que acentúe los cortes.
   - **Sidechain / Ducking estricto:** La música debe atenuarse automáticamente entre −16 dB y −20 dB durante la locución y recuperar presencia (+6 dB) en las transiciones de escena.
   - **Normalización Final:** Medición estricta con filtro FFmpeg `loudnorm` a **−14 LUFS** (tolerancia ±1 LUFS), True Peak máx −1 dBFS, LRA ≤ 11.

---

## 3. ORQUESTACIÓN OBLIGATORIA DE APIS Y SERVICIOS

Ninguna herramienta debe quedar en desuso; cada pipeline debe combinar la potencia de la suite:

| Servicio | Rol Obligatorio en la Pipeline | Vía de Integración |
| :--- | :--- | :--- |
| **ElevenLabs API** | Generación de locución comercial ultra-realista y efectos de sala | API REST / SDK Node / Python en GitHub Actions |
| **CapCut API / Engine** | Postproducción, efectos de tendencia, subtítulos cinéticos con plantillas de autor y stickers nativos | API Token / Webhook / PySceneDetect pipeline |
| **Nano Banana / Flow** | B-Roll hiperrealista gastronómico, planos detalle de cocina en marcha y fotografía de platos | API REST de generación y caching en `/assets` |
| **Playwright + GSAP (HyperFrames)** | Composición 3D Motion, Canvas orgánico y renderizado frame a frame sin pérdidas a 30 fps | Runner GitHub Actions (`renderizar.cjs`) |
| **Vercel Engine** | Despliegue inmediato del panel de control multi-dispositivo y visualizador de piezas | GitHub Actions (`deploy-admin.yml`) |

---

## 4. CHECKLIST DE CONTROL DE CALIDAD (QC) ANTES DE ENTREGA

Antes de solicitar aprobación a la dirección (karc0), la pieza debe superar:
- [ ] 0 fotogramas negros detectados (`blackdetect`).
- [ ] 0 fotogramas congelados detectados (`freezedetect`).
- [ ] Caja segura 940×1280 cumplida al 100%.
- [ ] Sonoridad medida entre −14 y −15.5 LUFS con locución activa y clara.
- [ ] Presencia de elementos 3D / interacción viva y cero estaticidad visual.
- [ ] Hoja de contactos `contact_sheet.jpg` generada y legible.
- [ ] Publicación en el panel administrativo Vercel con selector funcional.
