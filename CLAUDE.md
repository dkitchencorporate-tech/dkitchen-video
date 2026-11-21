# `dkitchen-video` · Instrucciones para Agente DK

> **DKitchen · Motor P6 HyperFrames (actualizado 21/11/2026):** para cualquier vídeo o reel de DKitchen, lee primero **`00_LEEME_AGENTES.md`** y **`P6_GUIA_PRODUCCION.md`** y trabaja solo con `reels/plantilla-p6/`, `reels/<pieza>/`, `scripts/hf/` y `marca/` sobre la rama **`main`**. Esas guías mandan sobre `AGENT_GUIDE.md` y el código heredado de OpenMontage.

## Reglas esenciales
- Gobernanza **Alex (Dirección) + Agente DK** (agnóstico de modelo: Antigravity, Claude o el agente que elija Dirección).
- Todo render ocurre en GitHub Actions (**nunca** render local en equipos de baja RAM).
- `scripts/hf/producir.cjs` conserva `-shortest` para evitar falsos fallos `+0,10 s` de cola AAC.
- Cero emojis, cero menciones `"IA"` hacia clientes, cero reemplazos destructivos de texto sobre capturas reales y prohibido subir secretos o datos privados a este repositorio público.
