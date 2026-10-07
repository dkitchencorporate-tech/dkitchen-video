import React from "react";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import { interpolate, spring } from "remotion";
import { EmberParticles } from "./EmberParticles";
import { BurningPaper } from "./BurningPaper";
import { LaserScanner } from "./LaserScanner";
import { IPhoneModel } from "./IPhoneModel";

interface ThreeSceneProps {
  frame: number;
  width: number;
  height: number;
}

// Inner 3D World component placed inside ThreeCanvas
const World: React.FC<{ frame: number }> = ({ frame }) => {
  const { camera } = useThree();

  // === CAMERA & ORBIT DYNAMICS ===
  // Scene 1: frames 0 - 150
  // Scene 2: frames 150 - 390
  // Scene 3: frames 390 - 630
  // Scene 4: frames 630 - 915
  // Scene 5: frames 915 - 1050

  // Camera Z distance choreography
  const camZ = interpolate(
    frame,
    [0, 140, 240, 390, 430, 580, 630, 680, 915, 1050],
    [7.5, 7.5, 6.8, 6.8, 4.6, 4.6, 6.8, 8.2, 8.2, 8.6],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const camY = interpolate(
    frame,
    [390, 430, 580, 630],
    [0, 0.45, 0.45, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Update Three.js camera position each frame
  camera.position.set(0, camY, camZ);
  camera.lookAt(0, camY * 0.4, 0);

  // Scene 1 Ember Particles opacity
  const emberOpacity = interpolate(
    frame,
    [0, 15, 130, 160],
    [0.2, 1.0, 0.9, 0.0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Scene 2 & 3: Hero iPhone animation
  const heroPhoneOpacity = interpolate(
    frame,
    [220, 260, 620, 640],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Hero phone rotation (enters with dynamic 3D angle, straightens for reading)
  const heroRotY = interpolate(
    frame,
    [220, 310, 390, 450, 580, 630],
    [0.65, 0.05, 0.0, -0.06, 0.0, 0.15],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const heroRotX = interpolate(
    frame,
    [220, 310, 410, 450],
    [0.18, 0.04, 0.02, 0.0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const heroScale = spring({
    frame: frame - 220,
    fps: 30,
    config: { damping: 14, stiffness: 90, mass: 0.9 },
  });

  // Scene 4: 3-Phone Fan-Out
  const fanProgress = spring({
    frame: frame - 630,
    fps: 30,
    config: { damping: 15, stiffness: 85, mass: 1.0 },
  });

  const fanOpacity = interpolate(
    frame,
    [630, 650, 905, 925],
    [0, 1, 1, 0.25],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <>
      {/* Volumetric Studio Lighting */}
      <ambientLight intensity={0.65} />
      {/* Key Light (Crisp White Highlights) */}
      <directionalLight position={[4, 7, 5]} intensity={2.2} color="#FFFFFF" />
      {/* Rim Light (Noble Gold back-glint on titanium chamfers) */}
      <directionalLight position={[-5, -3, -4]} intensity={3.0} color="#C59B27" />
      {/* Fill Light (Soft cool navy) */}
      <directionalLight position={[-4, 4, 3]} intensity={1.2} color="#90CAF9" />

      {/* SCENE 1: Burning Paper Menu + Embers */}
      {frame <= 165 && (
        <>
          <BurningPaper frame={frame} />
          <EmberParticles frame={frame} opacity={emberOpacity} count={180} />
          <pointLight position={[0, -1.2, 2]} intensity={2.0} color="#FF6F00" />
        </>
      )}

      {/* SCENE 2: Laser Scanner Pedestal */}
      {frame >= 145 && frame <= 290 && <LaserScanner frame={frame} />}

      {/* SCENE 2 & 3: Hero Single iPhone Pro */}
      {heroPhoneOpacity > 0.01 && (
        <IPhoneModel
          frame={frame}
          mode="menu"
          position={[0, 0, 0]}
          rotation={[heroRotX, heroRotY, 0]}
          scale={Math.max(0.01, heroScale * heroPhoneOpacity)}
          highlightDishPop={frame >= 390 && frame <= 620}
        />
      )}

      {/* SCENE 4: 3-Phone 3D Fan-Out */}
      {fanOpacity > 0.01 && (
        <group position={[0, 0, 0]} scale={fanOpacity}>
          {/* Left Phone: Waiter Command Device */}
          <IPhoneModel
            frame={frame}
            mode="waiter"
            position={[-2.7 * fanProgress, -0.15, -0.4 * fanProgress]}
            rotation={[0.06, 0.35 * fanProgress, -0.06 * fanProgress]}
            scale={0.92}
          />

          {/* Center Phone: Kaiseki Digital Menu */}
          <IPhoneModel
            frame={frame}
            mode="menu"
            position={[0, 0.1, 0.35 * fanProgress]}
            rotation={[0, 0, 0]}
            scale={1.0}
          />

          {/* Right Phone: Profit Analytics Dashboard */}
          <IPhoneModel
            frame={frame}
            mode="analytics"
            position={[2.7 * fanProgress, -0.15, -0.4 * fanProgress]}
            rotation={[0.06, -0.35 * fanProgress, 0.06 * fanProgress]}
            scale={0.92}
          />
        </group>
      )}
    </>
  );
};

export const ThreeScene: React.FC<ThreeSceneProps> = ({
  frame,
  width,
  height,
}) => {
  return (
    <div style={{ width: "100%", height: "100%", position: "absolute", top: 0, left: 0 }}>
      <ThreeCanvas
        width={width}
        height={height}
        camera={{ fov: 45, position: [0, 0, 7.5] }}
        style={{ width: "100%", height: "100%" }}
      >
        <World frame={frame} />
      </ThreeCanvas>
    </div>
  );
};
