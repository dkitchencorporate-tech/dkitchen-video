import React, { useMemo } from "react";
import * as THREE from "three";

interface EmberParticlesProps {
  frame: number;
  count?: number;
  opacity?: number;
}

export const EmberParticles: React.FC<EmberParticlesProps> = ({
  frame,
  count = 160,
  opacity = 1.0,
}) => {
  // Generate deterministic seed data for particles
  const particleSeeds = useMemo(() => {
    const seeds = [];
    for (let i = 0; i < count; i++) {
      // Pseudo-random based on index
      const seedX = (Math.sin(i * 12.9898) * 43758.5453) % 1;
      const seedY = (Math.sin(i * 78.233) * 43758.5453) % 1;
      const seedZ = (Math.sin(i * 45.164) * 43758.5453) % 1;
      const speed = 0.04 + Math.abs(seedX) * 0.06;
      const radius = 0.8 + Math.abs(seedY) * 2.2;
      const phase = Math.abs(seedZ) * Math.PI * 2;
      const size = 6 + Math.abs(seedX) * 14;
      seeds.push({ seedX, seedY, seedZ, speed, radius, phase, size });
    }
    return seeds;
  }, [count]);

  const { positions, colors, sizes } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const sz = new Float32Array(count);

    // Warm embers: #FFD54F (gold), #FF7043 (orange), #D32F2F (ember red)
    const colorGold = new THREE.Color("#FFD54F");
    const colorOrange = new THREE.Color("#FF7043");
    const colorRed = new THREE.Color("#E53935");

    for (let i = 0; i < count; i++) {
      const s = particleSeeds[i];
      // Vertical progress loops every ~120 frames with an offset
      const progress = ((frame * s.speed + Math.abs(s.seedY) * 4) % 4) / 4;
      
      // Upward movement
      const y = -2.5 + progress * 6.5;
      // Swirl around Y
      const angle = s.phase + frame * 0.03 + progress * 2.0;
      const x = Math.cos(angle) * s.radius * (0.6 + progress * 0.8);
      const z = Math.sin(angle) * (s.radius * 0.5) + (s.seedZ * 0.8);

      pos[i * 3] = x;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = z;

      // Color shifts from bright gold at birth to deep red as it rises
      const tempColor = new THREE.Color();
      if (progress < 0.4) {
        tempColor.lerpColors(colorGold, colorOrange, progress / 0.4);
      } else {
        tempColor.lerpColors(colorOrange, colorRed, (progress - 0.4) / 0.6);
      }

      col[i * 3] = tempColor.r;
      col[i * 3 + 1] = tempColor.g;
      col[i * 3 + 2] = tempColor.b;

      // Particle size shrinks near end of life
      const lifeFade = progress < 0.1 ? progress * 10 : 1 - progress;
      sz[i] = s.size * Math.max(0, lifeFade);
    }

    return { positions: pos, colors: col, sizes: sz };
  }, [frame, count, particleSeeds]);

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    return geo;
  }, [positions, colors]);

  if (opacity <= 0.01) return null;

  return (
    <points geometry={geometry}>
      <pointsMaterial
        size={0.12}
        vertexColors
        transparent
        opacity={opacity * 0.9}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
};
