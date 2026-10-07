import { Config } from "@remotion/cli/config";

// En máquinas virtuales sin GPU (GitHub Actions Ubuntu runner), swangle proporciona
// aceleración WebGL por software con ANGLE + SwiftShader sin fallos de contexto.
Config.setChromiumOpenGlRenderer(
  process.env.CI || process.platform === "linux" ? "swangle" : "angle"
);
