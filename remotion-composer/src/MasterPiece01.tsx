import React from "react";
import {
  AbsoluteFill,
  Audio,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { ThreeScene } from "./components/three/ThreeScene";

export const MasterPiece01: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // === TIMELINE SEGMENTS (Total: 35.0s = 1050 frames at 30 fps) ===
  // Scene 1: 0.0s - 5.0s   (Frames 0 - 150)
  // Scene 2: 5.0s - 13.0s  (Frames 150 - 390)
  // Scene 3: 13.0s - 21.0s (Frames 390 - 630)
  // Scene 4: 21.0s - 30.5s (Frames 630 - 915)
  // Scene 5: 30.5s - 35.0s (Frames 915 - 1050)

  // Subtle camera shake on Sub-Drop at frame 915 (Scene 5 transition)
  const shake =
    frame >= 915 && frame <= 935
      ? Math.sin((frame - 915) * 1.5) *
        interpolate(frame, [915, 935], [12, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })
      : 0;

  // Scene 1 Overlays
  const s1Opacity = interpolate(frame, [0, 15, 135, 150], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const s1TitleScale = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 100, mass: 0.8 },
  });

  // Scene 2 Overlays
  const s2Opacity = interpolate(frame, [155, 175, 370, 390], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const s2Spring = spring({
    frame: frame - 160,
    fps,
    config: { damping: 14, stiffness: 90, mass: 0.8 },
  });

  // Scene 3 Overlays
  const s3Opacity = interpolate(frame, [395, 415, 610, 630], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const s3Spring = spring({
    frame: frame - 400,
    fps,
    config: { damping: 14, stiffness: 90, mass: 0.8 },
  });

  // Scene 4 Overlays
  const s4Opacity = interpolate(frame, [635, 655, 895, 915], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const s4Spring = spring({
    frame: frame - 640,
    fps,
    config: { damping: 14, stiffness: 85, mass: 0.9 },
  });

  // Scene 5 (Mega-CTA Vault) Overlays
  const s5Opacity = interpolate(frame, [915, 935], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const s5Scale = spring({
    frame: frame - 915,
    fps,
    config: { damping: 12, stiffness: 120, mass: 0.8 },
  });
  const s5Pulse = Math.sin(frame * 0.15) * 0.04 + 1.0;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#07080B",
        overflow: "hidden",
        transform: `translate(${shake}px, ${shake * 0.5}px)`,
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      }}
    >
      {/* 1. MASTER SYNCHRONIZED AUDIO (35.00s Alvaro Voice + Lo-Fi + SFX) */}
      <Audio src={staticFile("audio-v1.mp3")} volume={1} />

      {/* 2. CINEMATIC BACKGROUND VIGNETTE & AMBIENCE */}
      <div
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          background:
            "radial-gradient(circle at 50% 45%, #181924 0%, #0B0C10 65%, #050608 100%)",
          opacity: 0.9,
        }}
      />

      {/* Gold Ambient Dust Orbs */}
      <div
        style={{
          position: "absolute",
          top: "15%",
          left: "20%",
          width: 500,
          height: 500,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(197,155,39,0.12) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "20%",
          right: "15%",
          width: 600,
          height: 600,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(110,12,43,0.14) 0%, transparent 70%)",
          filter: "blur(70px)",
        }}
      />

      {/* 3. THREE.JS REAL WebGL 3D WORLD (PerspectiveCamera, PBR, Embers, Phones) */}
      <ThreeScene frame={frame} width={width} height={height} />

      {/* 4. SAFE-ZONE COMPLIANT 2D KINETIC TYPOGRAPHY OVERLAY */}
      {/* Safe Box: 940x1280 px (Top: 240px, Bottom: 1480px, Left: 70px, Right: 940px) */}
      <div
        style={{
          position: "absolute",
          top: 240,
          left: 70,
          width: 870,
          height: 1240,
          pointerEvents: "none",
        }}
      >
        {/* === SCENE 1: HOOK DE DOLOR (0 - 5s) === */}
        {s1Opacity > 0.01 && (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              opacity: s1Opacity,
              transform: `scale(${s1TitleScale})`,
              transformOrigin: "top center",
            }}
          >
            {/* Tag */}
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                padding: "8px 20px",
                borderRadius: 24,
                background: "rgba(239, 68, 68, 0.15)",
                border: "1px solid rgba(239, 68, 68, 0.5)",
                color: "#FCA5A5",
                fontSize: 22,
                fontWeight: 700,
                letterSpacing: 2,
                marginBottom: 20,
              }}
            >
              🔥 EL COSTE INVISIBLE DEL PAPEL
            </div>

            {/* Kinetic Title */}
            <h1
              style={{
                margin: 0,
                fontSize: 66,
                fontWeight: 900,
                lineHeight: 1.1,
                color: "#FFFFFF",
                textShadow: "0 8px 30px rgba(0,0,0,0.8)",
                letterSpacing: -1,
              }}
            >
              ¿QUEMAS TU <br />
              <span
                style={{
                  background: "linear-gradient(90deg, #F59E0B, #FDE68A)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                BENEFICIO DIRECTO?
              </span>
            </h1>

            <p
              style={{
                margin: "24px 0 0 0",
                fontSize: 26,
                color: "#D1D5DB",
                lineHeight: 1.4,
                maxWidth: 720,
              }}
            >
              Cada vez que reimprimes tu carta física por cambiar un plato o un precio, pierdes cientos de euros en imprenta.
            </p>
          </div>
        )}

        {/* === SCENE 2: ESCANEO QR & REVEAL (5 - 13s) === */}
        {s2Opacity > 0.01 && (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              opacity: s2Opacity,
              transform: `translateY(${interpolate(s2Spring, [0, 1], [30, 0])}px)`,
            }}
          >
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                padding: "8px 20px",
                borderRadius: 24,
                background: "rgba(197, 155, 39, 0.15)",
                border: "1px solid #C59B27",
                color: "#F3E7C4",
                fontSize: 22,
                fontWeight: 700,
                letterSpacing: 2,
                marginBottom: 16,
              }}
            >
              ⚡ TECNOLOGÍA DKITCHEN 3D
            </div>

            <h1
              style={{
                margin: 0,
                fontSize: 62,
                fontWeight: 900,
                lineHeight: 1.15,
                color: "#FFFFFF",
                textShadow: "0 8px 30px rgba(0,0,0,0.8)",
              }}
            >
              TU CARTA DIGITAL <br />
              <span style={{ color: "#FBBF24" }}>EN MENOS DE 60 SEGUNDOS</span>
            </h1>

            <div
              style={{
                display: "flex",
                gap: 12,
                marginTop: 20,
              }}
            >
              <div
                style={{
                  padding: "8px 18px",
                  borderRadius: 16,
                  background: "rgba(15, 23, 42, 0.8)",
                  border: "1px solid rgba(255, 255, 255, 0.15)",
                  color: "#94A3B8",
                  fontSize: 20,
                  fontWeight: 600,
                }}
              >
                📱 CERO APPS
              </div>
              <div
                style={{
                  padding: "8px 18px",
                  borderRadius: 16,
                  background: "rgba(15, 23, 42, 0.8)",
                  border: "1px solid rgba(255, 255, 255, 0.15)",
                  color: "#38BDF8",
                  fontSize: 20,
                  fontWeight: 600,
                }}
              >
                ✨ 100% PWA DIRECTA
              </div>
            </div>
          </div>
        )}

        {/* === SCENE 3: EDICIÓN EN VIVO & IA (13 - 21s) === */}
        {s3Opacity > 0.01 && (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              opacity: s3Opacity,
              transform: `translateY(${interpolate(s3Spring, [0, 1], [30, 0])}px)`,
            }}
          >
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                padding: "8px 20px",
                borderRadius: 24,
                background: "rgba(16, 185, 129, 0.15)",
                border: "1px solid #10B981",
                color: "#34D399",
                fontSize: 22,
                fontWeight: 700,
                letterSpacing: 2,
                marginBottom: 16,
              }}
            >
              ⚙️ CONTROL EN TIEMPO REAL
            </div>

            <h1
              style={{
                margin: 0,
                fontSize: 60,
                fontWeight: 900,
                lineHeight: 1.15,
                color: "#FFFFFF",
                textShadow: "0 8px 30px rgba(0,0,0,0.8)",
              }}
            >
              MODIFICA PRECIOS <br />
              <span style={{ color: "#34D399" }}>AL INSTANTE Y SIN COSTE</span>
            </h1>

            <p
              style={{
                margin: "18px 0 0 0",
                fontSize: 24,
                color: "#CBD5E1",
                lineHeight: 1.35,
              }}
            >
              Sube fotos profesionales con IA y audita tus 14 alérgenos con total seguridad legal.
            </p>
          </div>
        )}

        {/* === SCENE 4: ABANICO DE SALA & COMISIONES 0% (21 - 30.5s) === */}
        {s4Opacity > 0.01 && (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              opacity: s4Opacity,
              transform: `translateY(${interpolate(s4Spring, [0, 1], [30, 0])}px)`,
            }}
          >
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                padding: "8px 20px",
                borderRadius: 24,
                background: "rgba(56, 189, 248, 0.15)",
                border: "1px solid #38BDF8",
                color: "#7DD3FC",
                fontSize: 22,
                fontWeight: 700,
                letterSpacing: 2,
                marginBottom: 16,
              }}
            >
              🚀 MÁXIMA RENTABILIDAD EN SALA
            </div>

            <h1
              style={{
                margin: 0,
                fontSize: 58,
                fontWeight: 900,
                lineHeight: 1.15,
                color: "#FFFFFF",
                textShadow: "0 8px 30px rgba(0,0,0,0.8)",
              }}
            >
              ROTACIÓN MÁS RÁPIDA <br />
              <span
                style={{
                  background: "linear-gradient(90deg, #F43F5E, #FB7185)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                0% COMISIONES POR VENTA
              </span>
            </h1>

            <p
              style={{
                margin: "18px 0 0 0",
                fontSize: 24,
                color: "#E2E8F0",
                lineHeight: 1.35,
              }}
            >
              Tus camareros marchan comandas al instante. El 100% de tu facturación es tuya.
            </p>
          </div>
        )}

        {/* === SCENE 5: SILENCIO SAGRADO & MEGA-CTA GRAN RESERVA (30.5 - 35s) === */}
        {s5Opacity > 0.01 && (
          <div
            style={{
              position: "absolute",
              top: 100,
              left: 0,
              width: "100%",
              opacity: s5Opacity,
              transform: `scale(${s5Scale})`,
              transformOrigin: "center center",
              textAlign: "center",
            }}
          >
            {/* Luxury Glass Vault Box */}
            <div
              style={{
                padding: "50px 36px",
                borderRadius: 36,
                background:
                  "linear-gradient(145deg, rgba(20, 22, 32, 0.95), rgba(8, 9, 14, 0.98))",
                border: "3px solid #C59B27",
                boxShadow:
                  "0 24px 80px rgba(0,0,0,0.9), 0 0 60px rgba(197, 155, 39, 0.35)",
              }}
            >
              {/* Lacre Gold Emblem */}
              <div
                style={{
                  width: 90,
                  height: 90,
                  margin: "0 auto 24px auto",
                  borderRadius: "50%",
                  background: "radial-gradient(circle, #F3E7C4 0%, #C59B27 60%, #8C6D18 100%)",
                  boxShadow: "0 8px 24px rgba(197, 155, 39, 0.6)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#0A0B0E",
                  fontSize: 42,
                  fontWeight: 900,
                  fontFamily: "serif",
                  transform: `scale(${s5Pulse})`,
                }}
              >
                DK
              </div>

              {/* Tag */}
              <div
                style={{
                  display: "inline-block",
                  padding: "6px 20px",
                  borderRadius: 20,
                  background: "rgba(197, 155, 39, 0.2)",
                  color: "#FDE68A",
                  fontSize: 22,
                  fontWeight: 800,
                  letterSpacing: 2,
                  marginBottom: 18,
                }}
              >
                OFERTA EXCLUSIVA DE LANZAMIENTO
              </div>

              {/* Big Offer */}
              <h2
                style={{
                  margin: "0 0 16px 0",
                  fontSize: 54,
                  fontWeight: 900,
                  lineHeight: 1.15,
                  color: "#FFFFFF",
                }}
              >
                PRUÉBALO 30 DÍAS <br />
                <span
                  style={{
                    fontSize: 72,
                    background: "linear-gradient(90deg, #FBBF24, #FDE68A)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  POR SOLO 1,00 €
                </span>
              </h2>

              {/* Interactive URL Button */}
              <div
                style={{
                  margin: "24px auto",
                  maxWidth: 580,
                  padding: "20px 32px",
                  borderRadius: 22,
                  background: "linear-gradient(90deg, #C59B27, #E5B943)",
                  boxShadow: "0 10px 30px rgba(197, 155, 39, 0.4)",
                  color: "#0A0B0E",
                  fontSize: 32,
                  fontWeight: 900,
                  letterSpacing: 0.5,
                  transform: `scale(${s5Pulse})`,
                }}
              >
                dkitchencorporate.es/qr
              </div>

              {/* Guarantees */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: 16,
                  color: "#94A3B8",
                  fontSize: 18,
                  fontWeight: 600,
                  marginTop: 16,
                }}
              >
                <span>✓ Sin permanencia</span>
                <span>·</span>
                <span>✓ Alta en 60s</span>
                <span>·</span>
                <span>✓ Soporte VIP</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 5. BRAND FOOTER (Persistent subtle logo at very bottom, within safe zone) */}
      <div
        style={{
          position: "absolute",
          bottom: 440, // 440px from bottom, safely inside Y <= 1500 limit
          left: 70,
          display: "flex",
          alignItems: "center",
          gap: 10,
          opacity: 0.7,
        }}
      >
        <span
          style={{
            color: "#C59B27",
            fontWeight: 800,
            fontSize: 18,
            letterSpacing: 1.5,
          }}
        >
          DKITCHEN CORPORATE
        </span>
        <span style={{ color: "#4B5563" }}>|</span>
        <span style={{ color: "#9CA3AF", fontSize: 16 }}>
          Estudio Gastronómico Gran Reserva
        </span>
      </div>
    </AbsoluteFill>
  );
};
