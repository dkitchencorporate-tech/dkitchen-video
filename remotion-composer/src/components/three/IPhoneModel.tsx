import React, { useMemo } from "react";
import * as THREE from "three";
import { interpolate, spring } from "remotion";

export interface IPhoneModelProps {
  frame: number;
  mode?: "menu" | "waiter" | "analytics";
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  highlightDishPop?: boolean; // For Scene 3 macro pop
}

export const IPhoneModel: React.FC<IPhoneModelProps> = ({
  frame,
  mode = "menu",
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1.0,
  highlightDishPop = false,
}) => {
  // Screen dimensions in Three.js world units
  const PHONE_WIDTH = 2.4;
  const PHONE_HEIGHT = 4.8;
  const PHONE_DEPTH = 0.22;
  const SCREEN_WIDTH = 2.22;
  const SCREEN_HEIGHT = 4.62;

  // Scene 3 animation factors:
  // Price jumps at frame 450 (15.0s)
  const priceSpring = spring({
    frame: frame - 450,
    fps: 30,
    config: { damping: 12, stiffness: 140, mass: 0.8 },
  });

  const cardPopZ = highlightDishPop
    ? interpolate(frame, [410, 440, 580, 610], [0, 0.45, 0.45, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 0;

  // Generate dynamic canvas texture for the OLED screen
  const screenTexture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 1080;
    canvas.height = 2250;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    // Dark luxury OLED background
    ctx.fillStyle = "#0A0B0E";
    ctx.fillRect(0, 0, 1080, 2250);

    // Subtle ambient gradient
    const bgGrad = ctx.createRadialGradient(540, 600, 50, 540, 600, 800);
    bgGrad.addColorStop(0, "rgba(30, 25, 45, 0.6)");
    bgGrad.addColorStop(1, "rgba(10, 11, 14, 0)");
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 1080, 2250);

    // Top status bar (PWA / iPhone notch safe)
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "bold 32px sans-serif";
    ctx.fillText("09:41", 80, 75);
    ctx.textAlign = "right";
    ctx.fillText("5G · 100%", 1000, 75);

    // Dynamic Island
    ctx.fillStyle = "#000000";
    ctx.beginPath();
    ctx.roundRect(420, 35, 240, 55, 27);
    ctx.fill();

    if (mode === "menu") {
      // 1. BRAND HEADER: DKitchen Kaiseki
      ctx.textAlign = "center";
      ctx.fillStyle = "#C59B27"; // Noble Gold
      ctx.font = "bold 38px serif";
      ctx.fillText("DKITCHEN KAISEKI", 540, 175);

      ctx.fillStyle = "#9CA3AF";
      ctx.font = "24px sans-serif";
      ctx.fillText("Carta Digital en Vivo · Mesa 4", 540, 215);

      // Gold badge "PWA ACTIVA"
      ctx.fillStyle = "rgba(197, 155, 39, 0.15)";
      ctx.strokeStyle = "#C59B27";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(380, 240, 320, 44, 22);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = "#F3E7C4";
      ctx.font = "bold 20px sans-serif";
      ctx.fillText("⚡ ACTUALIZADA EN TIEMPO REAL", 540, 269);

      // 2. DISH CARDS
      // Dish 1: Chuletón / Tartar Balfegó (Active Hero Dish)
      const dishY = 320;
      ctx.textAlign = "left";

      // Card Background (glow if popped)
      ctx.fillStyle = highlightDishPop ? "#1A1B24" : "#13141B";
      ctx.strokeStyle = highlightDishPop ? "#C59B27" : "#282A36";
      ctx.lineWidth = highlightDishPop ? 4 : 2;
      ctx.beginPath();
      ctx.roundRect(60, dishY, 960, 480, 28);
      ctx.fill();
      ctx.stroke();

      // Dish Image placeholder with luxury dark gradient
      const imgGrad = ctx.createLinearGradient(90, dishY + 30, 410, dishY + 310);
      imgGrad.addColorStop(0, "#2D1B1E");
      imgGrad.addColorStop(1, "#181419");
      ctx.fillStyle = imgGrad;
      ctx.beginPath();
      ctx.roundRect(90, dishY + 30, 320, 280, 20);
      ctx.fill();

      // Icon / Silhouette of gourmet dish
      ctx.fillStyle = "#E5A93C";
      ctx.font = "bold 64px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("🥩", 250, dishY + 185);

      // AI Badge over photo
      ctx.fillStyle = "rgba(0, 0, 0, 0.75)";
      ctx.beginPath();
      ctx.roundRect(110, dishY + 245, 280, 44, 12);
      ctx.fill();
      ctx.fillStyle = "#38BDF8";
      ctx.font = "bold 20px sans-serif";
      ctx.fillText("✨ FOTO IA ULTRA-HD", 250, dishY + 274);

      // Title & description
      ctx.textAlign = "left";
      ctx.fillStyle = "#FFFFFF";
      ctx.font = "bold 38px serif";
      ctx.fillText("Tartar Balfegó", 440, dishY + 80);

      ctx.fillStyle = "#9CA3AF";
      ctx.font = "24px sans-serif";
      ctx.fillText("Caviar Imperial & emulsión trufada.", 440, dishY + 125);
      ctx.fillText("Atún rojo salvaje de almadraba.", 440, dishY + 160);

      // Price update animation (24,00 € -> 29,00 €)
      const isPriceUpdated = frame >= 450;
      if (isPriceUpdated) {
        // Old price struck through
        ctx.fillStyle = "#6B7280";
        ctx.font = "26px sans-serif";
        ctx.fillText("24,00 €", 440, dishY + 225);
        const oldW = ctx.measureText("24,00 €").width;
        ctx.strokeStyle = "#EF4444";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(440, dishY + 217);
        ctx.lineTo(440 + oldW, dishY + 217);
        ctx.stroke();

        // New Price with Golden Pulse
        ctx.fillStyle = "#F59E0B";
        ctx.font = "bold 52px sans-serif";
        ctx.fillText("29,00 €", 580, dishY + 225);

        // Flash badge
        ctx.fillStyle = "rgba(245, 158, 11, 0.2)";
        ctx.strokeStyle = "#F59E0B";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(790, dishY + 185, 200, 46, 12);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = "#FDE68A";
        ctx.font = "bold 22px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("+5€ MARGEN", 890, dishY + 216);
      } else {
        ctx.fillStyle = "#FFFFFF";
        ctx.font = "bold 44px sans-serif";
        ctx.fillText("24,00 €", 440, dishY + 225);
      }

      // 14 Allergens Pill Row
      ctx.textAlign = "left";
      ctx.fillStyle = "rgba(16, 185, 129, 0.15)";
      ctx.strokeStyle = "#10B981";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(90, dishY + 340, 900, 95, 16);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = "#34D399";
      ctx.font = "bold 24px sans-serif";
      ctx.fillText("✓ 14 ALÉRGENOS AUDITADOS", 120, dishY + 382);

      ctx.fillStyle = "#E5E7EB";
      ctx.font = "22px sans-serif";
      ctx.fillText("Pescado · Soja · Sésamo · Sin Gluten verificado", 120, dishY + 418);

      // Dish 2: Wagyu A5
      const dish2Y = 840;
      ctx.fillStyle = "#13141B";
      ctx.strokeStyle = "#282A36";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(60, dish2Y, 960, 280, 24);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = "#FFFFFF";
      ctx.font = "bold 34px serif";
      ctx.fillText("Wagyu A5 Kagoshima", 100, dish2Y + 70);
      ctx.fillStyle = "#9CA3AF";
      ctx.font = "24px sans-serif";
      ctx.fillText("Maduración 45 días al carbón Binchotan", 100, dish2Y + 115);
      ctx.fillStyle = "#C59B27";
      ctx.font = "bold 40px sans-serif";
      ctx.fillText("48,00 €", 100, dish2Y + 185);

      // Dish 3: Rodaballo
      const dish3Y = 1160;
      ctx.fillStyle = "#13141B";
      ctx.strokeStyle = "#282A36";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(60, dish3Y, 960, 280, 24);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = "#FFFFFF";
      ctx.font = "bold 34px serif";
      ctx.fillText("Rodaballo Salvaje a la Brasa", 100, dish3Y + 70);
      ctx.fillStyle = "#9CA3AF";
      ctx.font = "24px sans-serif";
      ctx.fillText("Pil-pil emulsionado de sus espinas", 100, dish3Y + 115);
      ctx.fillStyle = "#C59B27";
      ctx.font = "bold 40px sans-serif";
      ctx.fillText("36,00 €", 100, dish3Y + 185);

      // Bottom bar
      ctx.fillStyle = "#1E0E14";
      ctx.fillRect(0, 2080, 1080, 170);
      ctx.fillStyle = "#C59B27";
      ctx.font = "bold 34px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("CARTA DIGITAL DITCHEN · 0% COMISIÓN", 540, 2170);
    } else if (mode === "waiter") {
      // WAITER COMMAND SCREEN
      ctx.textAlign = "center";
      ctx.fillStyle = "#38BDF8";
      ctx.font = "bold 44px sans-serif";
      ctx.fillText("COMANDERO DIGITAL", 540, 180);

      ctx.fillStyle = "#94A3B8";
      ctx.font = "26px sans-serif";
      ctx.fillText("Camarero 02 · Sala Principal", 540, 225);

      // Mesa Activa Card
      ctx.fillStyle = "#1E293B";
      ctx.strokeStyle = "#38BDF8";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.roundRect(60, 300, 960, 600, 28);
      ctx.fill();
      ctx.stroke();

      ctx.textAlign = "left";
      ctx.fillStyle = "#F8FAFC";
      ctx.font = "bold 48px sans-serif";
      ctx.fillText("MESA 4 (4 Pax)", 100, 380);

      ctx.fillStyle = "#10B981";
      ctx.font = "bold 26px sans-serif";
      ctx.fillText("● MARCHANDO COCINA", 680, 380);

      ctx.fillStyle = "#E2E8F0";
      ctx.font = "32px sans-serif";
      ctx.fillText("2x Tartar Balfegó (Sin gluten)", 100, 470);
      ctx.fillText("1x Chuletón Rubia Gallega", 100, 540);
      ctx.fillText("1x Rodaballo Salvaje", 100, 610);
      ctx.fillText("1x Vino Gran Reserva 2018", 100, 680);

      ctx.fillStyle = "#38BDF8";
      ctx.font = "bold 42px sans-serif";
      ctx.fillText("Total: 184,00 €", 100, 780);

      // Rotación metric
      ctx.fillStyle = "rgba(16, 185, 129, 0.2)";
      ctx.beginPath();
      ctx.roundRect(60, 950, 960, 240, 24);
      ctx.fill();
      ctx.fillStyle = "#34D399";
      ctx.font = "bold 42px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("ROTACIÓN +25% MÁS RÁPIDA", 540, 1050);
      ctx.font = "26px sans-serif";
      ctx.fillText("Cero esperas de carta · Marcha instantánea", 540, 1110);
    } else if (mode === "analytics") {
      // ANALYTICS / PROFIT SCREEN
      ctx.textAlign = "center";
      ctx.fillStyle = "#10B981";
      ctx.font = "bold 44px sans-serif";
      ctx.fillText("DASHBOARD DE RENTABILIDAD", 540, 180);

      ctx.fillStyle = "#94A3B8";
      ctx.font = "26px sans-serif";
      ctx.fillText("Métricas en Vivo · Octubre 2026", 540, 225);

      // Big Ticket Stat
      ctx.fillStyle = "#0F281E";
      ctx.strokeStyle = "#10B981";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.roundRect(60, 300, 960, 440, 28);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = "#34D399";
      ctx.font = "bold 84px sans-serif";
      ctx.fillText("+18,4 %", 540, 450);

      ctx.fillStyle = "#F8FAFC";
      ctx.font = "bold 36px sans-serif";
      ctx.fillText("AUMENTO TICKET MEDIO", 540, 530);

      ctx.fillStyle = "#94A3B8";
      ctx.font = "24px sans-serif";
      ctx.fillText("Fotos IA y sugerencias de maridaje automáticas", 540, 580);

      // Commission 0%
      ctx.fillStyle = "#2D1B1E";
      ctx.strokeStyle = "#E11D48";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.roundRect(60, 800, 960, 400, 28);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = "#FB7185";
      ctx.font = "bold 84px sans-serif";
      ctx.fillText("0,00 €", 540, 940);

      ctx.fillStyle = "#FFFFFF";
      ctx.font = "bold 36px sans-serif";
      ctx.fillText("COMISIONES POR VENTA", 540, 1020);

      ctx.fillStyle = "#FDA4AF";
      ctx.font = "24px sans-serif";
      ctx.fillText("El 100% de tu margen va directo a tu cuenta", 540, 1070);
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.generateMipmaps = true;
    texture.minFilter = THREE.LinearMipmapLinearFilter;
    return texture;
  }, [mode, frame, highlightDishPop]);

  if (!screenTexture) return null;

  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* 1. CHASSIS (Titanium Black Frame) */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[PHONE_WIDTH, PHONE_HEIGHT, PHONE_DEPTH]} />
        <meshStandardMaterial
          color="#18191E"
          metalness={0.92}
          roughness={0.22}
        />
      </mesh>

      {/* 2. BACK CERAMIC PLATE */}
      <mesh position={[0, 0, -PHONE_DEPTH / 2 - 0.002]}>
        <planeGeometry args={[PHONE_WIDTH - 0.04, PHONE_HEIGHT - 0.04]} />
        <meshStandardMaterial
          color="#0F1014"
          metalness={0.4}
          roughness={0.5}
        />
      </mesh>

      {/* 3. CAMERA BUMP ON BACK */}
      <mesh position={[-0.6, 1.4, -PHONE_DEPTH / 2 - 0.04]}>
        <boxGeometry args={[0.95, 0.95, 0.08]} />
        <meshStandardMaterial
          color="#16171C"
          metalness={0.88}
          roughness={0.25}
        />
      </mesh>

      {/* 4. OLED DISPLAY SCREEN */}
      <mesh position={[0, 0, PHONE_DEPTH / 2 + 0.002]}>
        <planeGeometry args={[SCREEN_WIDTH, SCREEN_HEIGHT]} />
        <meshStandardMaterial
          map={screenTexture}
          roughness={0.15}
          metalness={0.05}
          emissive="#FFFFFF"
          emissiveMap={screenTexture}
          emissiveIntensity={0.25}
        />
      </mesh>

      {/* 5. REFLECTIVE GLASS COAT */}
      <mesh position={[0, 0, PHONE_DEPTH / 2 + 0.006]}>
        <planeGeometry args={[SCREEN_WIDTH, SCREEN_HEIGHT]} />
        <meshPhysicalMaterial
          transparent
          opacity={0.12}
          roughness={0.05}
          metalness={0.1}
          clearcoat={1.0}
          clearcoatRoughness={0.1}
        />
      </mesh>

      {/* 6. FLOATING 3D DISH CARD POP (Scene 3 Z-Axis Pop) */}
      {highlightDishPop && cardPopZ > 0.01 && (
        <mesh position={[0, 0.45, PHONE_DEPTH / 2 + cardPopZ]}>
          <planeGeometry args={[SCREEN_WIDTH * 0.92, 1.15]} />
          <meshStandardMaterial
            color="#C59B27"
            metalness={0.7}
            roughness={0.2}
            transparent
            opacity={0.85}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      )}
    </group>
  );
};
