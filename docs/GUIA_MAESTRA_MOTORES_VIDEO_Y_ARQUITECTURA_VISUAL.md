# ⚠️ LECTURA OBLIGATORIA INMEDIATA PARA CUALQUIER AGENTE (HUMANO O IA) ⚠️
# GUÍA MAESTRA DE MOTORES DE VÍDEO, ARQUITECTURA VISUAL Y PROTOCOLO ANTI-SIMULACIÓN (DKITCHEN STUDIO)

> **FECHA DE ENTRADA EN VIGOR:** 07 de Octubre de 2026  
> **APLICACIÓN ESTRICTA:** Claude Code, Antigravity, Desarrolladores y Sistemas de Producción Automatizada.  
> **REGLA DE ORO INVIOLABLE:** Queda terminantemente PROHIBIDO intentar crear vídeos publicitarios o secuencias cinemáticas utilizando maquetaciones HTML/CSS planas capturadas con bucles de capturas de pantalla de Playwright (`page.screenshot()`) simulando ser motores de vídeo reales.

---

## 1. RESUMEN EJECUTIVO Y ANÁLISIS POST-MORTEM: ¿POR QUÉ FALLARON LOS INTENTOS ANTERIORES?

Durante múltiples iteraciones de las piezas de vídeo (especialmente Pieza 01 *«La Carta en Llamas»*), los resultados visuales entregados fueron calificados por Dirección como inaceptables (apenas un 10%-20% del estándar de 20.000 € requerido).

### 🔍 Auditoría Forense de los Errores Críticos Detectados en las Capturas:

1. **El Trap de la Falsa Integración en `renderizar.cjs`:**
   - En el repositorio existía un archivo `renderizar.cjs` que en su cabecera afirmaba ser *"Motor de renderizado HyperFrames + OpenMontage"*.
   - **La realidad:** El script no utilizaba el binario oficial de HyperFrames ni las composiciones WebGL de Remotion; abría Chromium con Playwright (`page.goto('file://...')`), ejecutaba un bucle `for` llamando a `page.screenshot({ type: 'jpeg' })` y enviaba los búferes por un pipe a `ffmpeg`.
   - **Consecuencia:** Se simulaba un renderizador cuando en realidad era un raspado de pantalla rudimentario.

2. **Corte y Mutilación por Z-Clipping en CSS 3D (Chromium bug):**
   - *Evidencia gráfica:* Capturas `media_1791347485965.jpg` y `media_1791347486136.jpg`.
   - Los mockups de los smartphones aparecían cortados por la mitad horizontal o verticalmente al girar.
   - **Causa técnica:** En CSS, combinar `transform: perspective(...) rotate3d(...)` con contenedores que tienen `overflow: hidden`, `border-radius`, filtros CSS o anidamiento de stacking contexts provoca que el rasterizador de Blink corte los planos 3D contra el frustum 2D de la caja.

3. **El DOM de HTML NO es un Compositor de Efectos Visuales (VFX):**
   - *Evidencia gráfica:* Capturas `media_1791347486388.jpg` y `media_1791347486397.jpg`.
   - Intentar simular "fuego, cenizas y desintegración de papel" mediante `<div>` con `linear-gradient` y `opacity` resulta en manchas rectangulares planas y opacas que tapan el texto de forma artificial.
   - Los tres teléfonos del abanico carecían de iluminación direccional, reflejos metálicos PBR, brillo de cristal OLED y sombras arrojadas realistas. Parecían rectángulos oscuros y muertos.

4. **Falsa Promesa de Herramientas Incompatibles (MCP After Effects):**
   - Se evaluó el repositorio `kumoproductions/mcp-aftereffects`. Se descubrió que dicho MCP es un puente vía ExtendScript que requiere tener instalado Adobe After Effects en una máquina de escritorio con interfaz gráfica (Windows/macOS con licencia Adobe activa).
   - Nuestro entorno de renderizado automatizado corre en una máquina virtual Linux Ubuntu Headless en GitHub Actions (7 GB RAM). Es técnicamente inviable ejecutar Adobe After Effects ahí. Intentar forzarlo sin comunicarlo de inmediato al usuario causó frustración y pérdida de tiempo.

---

## 2. EL ECOSISTEMA REAL DE MOTORES Y SUS ROLES EXACTOS

Para no volver a equivocarse, cada agente debe entender qué herramienta hace qué:

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           ARQUITECTURA DE PRODUCCIÓN                             │
├────────────────────────┬───────────────────────────────┬────────────────────────┤
│     COMPONENTE         │          TECNOLOGÍA           │        FUNCIÓN         │
├────────────────────────┼───────────────────────────────┼────────────────────────┤
│ Opción A:              │ @remotion/three + Three.js    │ Geometría 3D real,     │
│ 3D & Shaders WebGL     │ + WebGL Canvas                │ materiales PBR metal/  │
│                        │                               │ cristal, partículas GPU│
├────────────────────────┼───────────────────────────────┼────────────────────────┤
│ Opción B:              │ HyperFrames Native CLI        │ Timeline determinista, │
│ Motion & Typography    │ (@hyperframes/cli + GSAP)     │ layouts de producto,   │
│                        │                               │ sync tipográfica       │
├────────────────────────┼───────────────────────────────┼────────────────────────┤
│ OpenMontage Timeline   │ OpenMontage Engine            │ Multi-track compositor,│
│                        │                               │ audio ducking, cortes  │
├────────────────────────┼───────────────────────────────┼────────────────────────┤
│ Audio & Master Voice   │ ElevenLabs SDK + EBU R128     │ Locución hiperrealista,│
│                        │ loudnorm (-14 LUFS)           │ Lo-Fi estéreo y SFX    │
├────────────────────────┼───────────────────────────────┼────────────────────────┤
│ Entorno de Ejecución   │ GitHub Actions Ubuntu VM      │ 0 renders locales;     │
│                        │ (7 GB RAM, runner headless)   │ entrega 100% en cloud  │
└────────────────────────┴───────────────────────────────┴────────────────────────┘
```

---

## 3. COMPARATIVA Y PLAN DE PRUEBAS CRUZADAS (OPCIÓN A vs. OPCIÓN B)

Siguiendo las instrucciones directas de `karc0`, ambas tecnologías deben someterse a una prueba real en la **Pieza 01 (`v1-la-carta-en-llamas`, 35 segundos)** para documentar resultados y evaluar si conviven o se fusionan:

### 🅰️ Opción A: Remotion + Three.js (`@remotion/three`)
- **Cómo opera:**
  - Monta un `<ThreeCanvas>` dentro de una composición de Remotion a 1080x1920 (30 fps).
  - Utiliza una `PerspectiveCamera` matemática pura de Three.js.
  - Los smartphones son mallas 3D (`Mesh` / `Group`) con materiales `MeshStandardMaterial` / `MeshPhysicalMaterial`:
    - Chasis: Titanio satinado (`roughness: 0.2`, `metalness: 0.85`).
    - Pantalla: Emisivo OLED con textura dinámica en vivo de la carta de DKitchen Kaiseki.
    - Cristal: Índice de refracción y reflejos especulares dinámicos.
  - El fuego y las cenizas: Sistema de partículas WebGL (`Points` o `ShaderMaterial`) con emisión aleatoria, dispersión en el eje Z y desvanecimiento físico.
  - Despliegue de los 3 teléfonos: Interpolación matemática con `spring()` o `interpolate()` en espacio 3D euclídeo, sin ningún tipo de `overflow: hidden` que pueda recortar la geometría.
- **Puntos fuertes:** Cero clipping Z, iluminación y profundidad cinematográfica real de estudio, calidad visual máxima.
- **Riesgos a controlar:** Consumo de memoria en el runner de GitHub Actions (debe optimizarse para mantenerse bajo 4 GB).

### 🅱️ Opción B: HyperFrames Native
- **Cómo opera:**
  - Proyecto estructurado bajo el estándar oficial de HyperFrames (`hyperframes.json` o scripts modulares de compilación).
  - Uso de timelines deterministas con interpolación por frames GSAP.
  - Componentes del registry oficial de HyperFrames para kinetic typography, reveal de interfaces y tarjetas flotantes.
- **Puntos fuertes:** Renderizado muy rápido, precisión tipográfica de milisegundo, curvas elásticas nativas de GSAP.
- **Riesgos a controlar:** No genera geometría 3D pura por sí solo; requiere capas WebGL pre-renderizadas o canvas dedicados para efectos 3D profundos.

---

## 4. INVARIANTE DE COMUNICACIÓN INTERACTIVA (NORMA INAMOVIBLE DE KARC0)

Si en cualquier momento del proyecto:
1. Una herramienta, librería o repositorio **no es viable** en el entorno actual (por ejemplo, dependencias que exigen GUI de Windows en un runner de Linux, o tokens/APIs inexistentes).
2. O una aproximación técnica **no alcanza la calidad exigida**:

**QUEDA ESTRICTAMENTE PROHIBIDO:**
- Ser condescendiente y dar por bueno un resultado mediocre.
- Prometer que se está usando una herramienta cuando en realidad se está usando un script alternativo simulado.
- Mantener al usuario esperando por una solución que técnicamente no va a ocurrir.

**ES OBLIGATORIO:**
- Detenerse inmediatamente.
- Utilizar la herramienta interactiva `ask_question` para presentar de forma transparente el estado real de la situación.
- Ofrecer al menos dos alternativas técnicas viables con la recomendación del asistente.

---

## 5. CHECKLIST OBLIGATORIO ANTES DE DAR CUALQUIER ENTREGA POR BUENA

Antes de que cualquier agente suba o etiquete un vídeo como "listo":
- [ ] **Auditoría visual frame a frame:** ¿Hay teléfonos cortados a la mitad? ¿El texto se empasta? ¿Hay cajas de gradiente planas? Si la respuesta es sí, **NO SE ENTREGA**.
- [ ] **Zonas Seguras Estrictas:** Caja 940x1280 px (cabecera libre > 220px, pie libre > 420px, lateral derecho libre > 140px).
- [ ] **Sincronización Sonora:** Audio master a -14.0 LUFS EBU R128 con locución clara, música Lo-Fi envolvente en estéreo y remate al segundo 35 con mega-CTA.
- [ ] **Motor Auténtico Verificado:** El log de compilación en GitHub Actions debe certificar la ejecución de `@remotion/three` o `hyperframes render`, no un bucle de capturas de Playwright.
