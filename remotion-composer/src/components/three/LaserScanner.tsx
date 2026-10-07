import React, { useMemo } from "react";
import * as THREE from "three";
import { interpolate } from "remotion";

interface LaserScannerProps {
  frame: number;
}

export const LaserScanner: React.FC<LaserScannerProps> = ({ frame }) => {
  // Laser scan operates between frames 150 and 260
  const scanProgress = interpolate(frame, [160, 240], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Fade out as the iPhone takes over
  const opacity = interpolate(frame, [250, 280], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Generate dynamic QR pedestal texture
  const qrTexture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    // Obsidian base plate
    ctx.fillStyle = "#0A0B0E";
    ctx.fillRect(0, 0, 1024, 1024);

    // Gold borders
    ctx.strokeStyle = "#C59B27";
    ctx.lineWidth = 12;
    ctx.strokeRect(40, 40, 944, 944);

    ctx.lineWidth = 2;
    ctx.strokeRect(60, 60, 904, 904);

    // Header
    ctx.fillStyle = "#C59B27";
    ctx.font = "bold 44px serif";
    ctx.textAlign = "center";
    ctx.fillText("DKITCHEN KAISEKI", 512, 140);

    ctx.fillStyle = "#E5E7EB";
    ctx.font = "26px sans-serif";
    ctx.fillText("ESCANEA CON TU MÓVIL", 512, 190);

    // QR Code Container Box
    ctx.fillStyle = "#FFFFFF";
    ctx.beginPath();
    ctx.roundRect(212, 240, 600, 600, 24);
    ctx.fill();

    // Stylized high-density QR pattern
    ctx.fillStyle = "#0A0B0E";
    // 3 Corner Finders
    const drawFinder = (x: number, y: number) => {
      ctx.fillRect(x, y, 120, 120);
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(x + 20, y + 20, 80, 80);
      ctx.fillStyle = "#0A0B0E";
      ctx.fillRect(x + 36, y + 36, 48, 48);
    };
    drawFinder(240, 268);
    drawFinder(664, 268);
    drawFinder(240, 692);

    // QR Data modules
    for (let r = 0; r < 14; r++) {
      for (let c = 0; c < 14; c++) {
        if ((r < 4 && c < 4) || (r < 4 && c > 9) || (r > 9 && c < 4)) continue;
        if ((r * 7 + c * 13) % 3 === 0 || (r * 11 + c * 5) % 2 === 0) {
          ctx.fillRect(260 + c * 36, 288 + r * 36, 28, 28);
        }
      }
    }

    // Central DKitchen Gold emblem inside QR
    ctx.fillStyle = "#C59B27";
    ctx.beginPath();
    ctx.arc(512, 540, 48, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#0A0B0E";
    ctx.font = "bold 32px serif";
    ctx.textAlign = "center";
    ctx.fillText("DK", 512, 552);

    // Bottom claim
    ctx.fillStyle = "#9CA3AF";
    ctx.font = "24px sans-serif";
    ctx.fillText("Sin apps · Carta 3D · 100% Instantánea", 512, 900);

    const texture = new THREE.CanvasTexture(canvas);
    texture.generateMipmaps = true;
    texture.minFilter = THREE.LinearMipmapLinearFilter;
    return texture;
  }, []);

  if (frame < 140 || frame > 290 || !qrTexture || opacity <= 0.01) return null;

  // Laser beam Y position (from top 1.8 to bottom -1.8)
  const laserY = 1.4 - scanProgress * 2.8;

  return (
    <group position={[0, 0, 0]} scale={opacity}>
      {/* 3D Pedestal Body */}
      <mesh position={[0, 0, 0]} rotation={[0.1, 0, 0]}>
        <boxGeometry args={[3.2, 3.2, 0.16]} />
        <meshStandardMaterial
          map={qrTexture}
          roughness={0.25}
          metalness={0.8}
        />
      </mesh>

      {/* Gold Rim Edge */}
      <mesh position={[0, 0, -0.09]} rotation={[0.1, 0, 0]}>
        <boxGeometry args={[3.3, 3.3, 0.08]} />
        <meshStandardMaterial
          color="#C59B27"
          roughness={0.2}
          metalness={0.9}
        />
      </mesh>

      {/* Sweeping Laser Line Beam */}
      {scanProgress > 0 && scanProgress < 1 && (
        <group position={[0, laserY, 0.12]} rotation={[0.1, 0, 0]}>
          {/* Main Laser Line */}
          <mesh>
            <planeGeometry args={[2.9, 0.06]} />
            <meshBasicMaterial
              color="#FFD700"
              blending={THREE.AdditiveBlending}
            />
          </mesh>
          {/* Glowing Laser Halo */}
          <mesh>
            <planeGeometry args={[2.9, 0.35]} />
            <meshBasicMaterial
              color="#FFA500"
              transparent
              opacity={0.65}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
        </group>
      )}
    </group>
  );
};
