import React, { useMemo } from "react";
import * as THREE from "three";
import { interpolate } from "remotion";

interface BurningPaperProps {
  frame: number;
}

export const BurningPaper: React.FC<BurningPaperProps> = ({ frame }) => {
  // Scene 1 lasts frames 0 to 150
  const burnProgress = interpolate(frame, [15, 140], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Dynamic canvas texture for the physical printed restaurant menu
  const menuTexture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 1440;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    // Paper background: Premium textured off-white / parchment
    ctx.fillStyle = "#FAF8F5";
    ctx.fillRect(0, 0, 1024, 1440);

    // Subtle paper grain / borders
    ctx.strokeStyle = "#D6C7B2";
    ctx.lineWidth = 4;
    ctx.strokeRect(40, 40, 944, 1360);
    ctx.lineWidth = 1;
    ctx.strokeRect(48, 48, 928, 1344);

    // Header: Restaurant Physical Menu
    ctx.fillStyle = "#6E0C2B"; // Vino Tinto
    ctx.font = "bold 52px serif";
    ctx.textAlign = "center";
    ctx.fillText("CARTA FÍSICA TRADICIONAL", 512, 140);

    ctx.fillStyle = "#8C7A6B";
    ctx.font = "italic 26px serif";
    ctx.fillText("Impresión Offset · Tarifas 2024", 512, 185);

    // Divider
    ctx.strokeStyle = "#C59B27";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(300, 215);
    ctx.lineTo(724, 215);
    ctx.stroke();

    // Menu items
    const items = [
      { name: "Chuletón de Rubia Gallega (1 kg)", price: "48,00 €", oldPrice: "42,00 €" },
      { name: "Tartar de Atún Balfegó con Aguacate", price: "24,00 €", oldPrice: "21,00 €" },
      { name: "Arroz Meloso de Bogavante del Cantábrico", price: "28,50 €", oldPrice: "26,00 €" },
      { name: "Jamón Ibérico 100% Bellota D.O.", price: "29,00 €", oldPrice: "27,00 €" },
      { name: "Lubina Salvaje a la Espalda", price: "26,00 €", oldPrice: "24,00 €" },
      { name: "Tarta de Queso Idiazábal Horneada", price: "8,50 €", oldPrice: "7,50 €" },
    ];

    let y = 300;
    items.forEach((item, idx) => {
      ctx.fillStyle = "#1E1E24";
      ctx.font = "600 32px sans-serif";
      ctx.textAlign = "left";
      ctx.fillText(item.name, 90, y);

      ctx.textAlign = "right";
      // Crossed out old price
      ctx.fillStyle = "#B71C1C";
      ctx.font = "24px sans-serif";
      ctx.fillText(item.oldPrice, 810, y);
      const textW = ctx.measureText(item.oldPrice).width;
      ctx.strokeStyle = "#B71C1C";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(810 - textW, y - 8);
      ctx.lineTo(810, y - 8);
      ctx.stroke();

      // Current printed price
      ctx.fillStyle = "#1E1E24";
      ctx.font = "bold 32px sans-serif";
      ctx.fillText(item.price, 930, y);

      // Warning note on physical changes
      ctx.fillStyle = "#8C7A6B";
      ctx.font = "italic 20px sans-serif";
      ctx.textAlign = "left";
      ctx.fillText(`* Tarifa desactualizada · Coste reimpresión 1.200 € / lote`, 90, y + 32);

      // Dotted line
      ctx.strokeStyle = "#E0D7CC";
      ctx.setLineDash([4, 6]);
      ctx.beginPath();
      ctx.moveTo(90, y + 55);
      ctx.lineTo(934, y + 55);
      ctx.stroke();
      ctx.setLineDash([]);

      y += 115;
    });

    // Stamp: "REIMPRESIÓN OBLIGADA - COSTE ELEVADO"
    ctx.save();
    ctx.translate(512, 1150);
    ctx.rotate(-0.15);
    ctx.strokeStyle = "#D32F2F";
    ctx.lineWidth = 6;
    ctx.strokeRect(-280, -45, 560, 90);
    ctx.fillStyle = "rgba(211, 47, 47, 0.08)";
    ctx.fillRect(-280, -45, 560, 90);
    ctx.fillStyle = "#D32F2F";
    ctx.font = "bold 34px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("BENEFICIO QUEMADO EN PAPEL", 0, 10);
    ctx.restore();

    const texture = new THREE.CanvasTexture(canvas);
    texture.generateMipmaps = true;
    texture.minFilter = THREE.LinearMipmapLinearFilter;
    return texture;
  }, []);

  // Paper curl and curl rotation
  const rotX = 0.12 + Math.sin(frame * 0.03) * 0.04;
  const rotY = -0.22 + Math.cos(frame * 0.025) * 0.06;
  const rotZ = 0.03 - burnProgress * 0.15;
  const posY = -burnProgress * 1.5;
  const scale = Math.max(0.01, 1 - burnProgress * 0.85);

  if (!menuTexture || frame > 155) return null;

  return (
    <group position={[0, posY, 0]} rotation={[rotX, rotY, rotZ]} scale={scale}>
      {/* Front Menu Surface */}
      <mesh position={[0, 0, 0]}>
        <planeGeometry args={[3.2, 4.5, 32, 32]} />
        <meshStandardMaterial
          map={menuTexture}
          roughness={0.75}
          metalness={0.05}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Burning Edge Glowing Border */}
      {burnProgress > 0.05 && (
        <mesh position={[0, -2.1 + burnProgress * 3.8, 0.02]}>
          <planeGeometry args={[3.3, 0.25]} />
          <meshBasicMaterial
            color="#FF8A00"
            transparent
            opacity={0.85 * (1 - burnProgress * 0.5)}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      )}
    </group>
  );
};
