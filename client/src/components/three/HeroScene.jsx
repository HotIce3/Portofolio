import { Canvas } from "@react-three/fiber";
import { Preload, Environment, Stars } from "@react-three/drei";
import { Suspense } from "react";
import ParticleField from "./ParticleField";
import FloatingGeometry from "./FloatingGeometry";
import GridFloor from "./GridFloor";
import { useSceneQuality } from "./useSceneQuality";
import * as THREE from "three";

export default function HeroScene() {
  const { canvasDpr, isLowPower } = useSceneQuality();
  const starCount = isLowPower ? 720 : 3000;
  const particleCount = isLowPower ? 900 : 2000;

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
      }}
    >
      <Canvas
        camera={{
          position: isLowPower ? [0, 1.35, 8.2] : [0, 1.5, 9],
          fov: isLowPower ? 62 : 58,
          near: 0.1,
          far: 200,
        }}
        dpr={canvasDpr}
        gl={{
          antialias: !isLowPower,
          alpha: true,
          powerPreference: "high-performance",
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.1,
        }}
        style={{ background: "transparent" }}
      >
        <Suspense fallback={null}>
          {/* Deep space stars */}
          <Stars
            radius={isLowPower ? 55 : 80}
            depth={isLowPower ? 28 : 50}
            count={starCount}
            factor={isLowPower ? 2.4 : 4}
            saturation={0.45}
            fade
            speed={isLowPower ? 0.25 : 0.5}
          />

          {/* Lighting setup */}
          <ambientLight intensity={0.25} color="#1a0a3f" />
          <directionalLight
            position={[8, 8, 5]}
            intensity={0.6}
            color="#ffffff"
          />
          <pointLight
            position={[-6, 4, -4]}
            intensity={1.2}
            color="#6366f1"
            distance={20}
          />
          <pointLight
            position={[6, -3, 3]}
            intensity={0.8}
            color="#a78bfa"
            distance={18}
          />
          <pointLight
            position={[0, 6, -2]}
            intensity={0.5}
            color="#60a5fa"
            distance={15}
          />
          <pointLight
            position={[-2, -4, 5]}
            intensity={0.4}
            color="#34d399"
            distance={12}
          />

          {/* 3D Elements */}
          <ParticleField count={particleCount} />
          <FloatingGeometry compact={isLowPower} />
          {!isLowPower && <GridFloor />}

          {/* Environment for reflections */}
          {!isLowPower && <Environment preset="night" />}

          {!isLowPower && <Preload all />}
        </Suspense>
      </Canvas>
    </div>
  );
}
