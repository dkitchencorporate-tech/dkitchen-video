# Integración Oficial: MCP After Effects (kumoproductions/mcp-aftereffects)
## DKitchen Studio · Arquitectura de Motion Graphics y Control de Efectos

Este documento establece la auditoría técnica y la integración del servidor MCP `@kumoproductions/mcp-aftereffects` dentro del pipeline audiovisual de **DKitchen Studio** (OpenMontage + HyperFrames + After Effects).

---

### 1. Auditoría del Repositorio (`kumoproductions/mcp-aftereffects`)

* **Repositorio Oficial:** `https://github.com/kumoproductions/mcp-aftereffects`
* **Licencia:** MIT (Open Source / Gratuito)
* **Tecnología:** TypeScript / Node.js 24+
* **Compatibilidad:** Adobe After Effects 2024, 2025 y 2026.
* **Paradigma de Conexión:** Servidor MCP (Model Context Protocol) basado en stdio y File IPC para comunicarse directamente con el motor de After Effects sin requerir instalación de plugins externos ni paneles CEP/UXP.

#### Capacidades Principales:
1. **Introspección Completa de Proyectos:** El modelo de IA puede leer la jerarquía de composiciones, capas de vídeo/forma/texto, efectos aplicados, keyframes, curvas de animación y expresiones.
2. **Operaciones Atómicas con Deshacer:** Todas las manipulaciones (añadir capas, modificar keyframes, aplicar efectos) se agrupan en bloques atómicos reversibles (`app.beginUndoGroup()` / `app.endUndoGroup()`).
3. **Importación y Exportación JSON:** Puente bidireccional para exportar estructuras de motion design a JSON y consumirlas o sincronizarlas con pipelines basados en código.
4. **Renderizado de Fotogramas Individuales:** Capacidad de renderizar y capturar fotogramas específicos vía IPC para inspección y control de calidad visual en tiempo real.
5. **Ejecución de ExtendScript Arbitrario:** Capacidad opcional (deshabilitada por defecto por seguridad) para ejecutar scripts avanzados de automatización.

---

### 2. Configuración en Clientes MCP (Claude Code, Claude Desktop, Antigravity)

Para habilitar el servidor MCP en el entorno de desarrollo:

#### Requisitos Previos en Adobe After Effects:
1. Abrir Adobe After Effects (versión 2024–2026).
2. Ir a **Preferencias → Scripting y expresiones** (**Preferences → Scripting & Expressions**).
3. Activar la casilla obligatoria: **«Permitir que los scripts escriban archivos y accedan a la red»** (*Allow Scripts to Write Files and Access Network*).

#### Configuración del Servidor (`claude_desktop_config.json` o configuración MCP):
```json
{
  "mcpServers": {
    "aftereffects": {
      "command": "npx",
      "args": ["-y", "@kumoproductions/mcp-aftereffects"]
    }
  }
}
```

---

### 3. Modelo Operativo Híbrido en DKitchen

DKitchen opera en un **modelo de doble motor**:

| Nivel | Motor | Entorno de Ejecución | Casos de Uso |
| :--- | :--- | :--- | :--- |
| **Motor Web/Headless** | **HyperFrames + OpenMontage (HTML/GSAP/FFmpeg)** | **GitHub Actions VM (7 GB RAM)** | Producción automatizada a gran escala, renders de reels 9:16 sin software propietario, 100% cloud. |
| **Motor Broadcast/Studio** | **Adobe After Effects + MCP Server** | **Estación de Trabajo Local / VM GPU** | Efectos visuales de cine avanzado (VFX), simulaciones de fluidos 3D, composición multipase y plantillas MOGRT de alta complejidad. |

Ambos motores comparten la misma dirección de arte oficial de DKitchen: paleta Gran Reserva (`#6E0C2B`, `#C59B27`, `#0A080C`), tipografías oficiales (*Bricolage Grotesque*, *Outfit*, *Cormorant Garamond*), fotogrametría gastronómica real y respeto a las zonas seguras (940×1280 px).
