import { Canvas } from "@react-three/fiber";
import { Preload, Environment } from "@react-three/drei";
import { Suspense } from "react";
import ParticleField from "./ParticleField";
import FloatingGeometry from "./FloatingGeometry";
import GridFloor from "./GridFloor";

export default function HeroScene() {
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
        camera={{ position: [0, 0, 8], fov: 60, near: 0.1, far: 100 }}
        dpr={[1, 1.5]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
        style={{ background: "transparent" }}
      >
        <Suspense fallback={null}>
          {/* Lighting */}
          <ambientLight intensity={0.3} />
          <directionalLight position={[5, 5, 5]} intensity={0.8} color="#ffffff" />
          <pointLight position={[-5, 3, -5]} intensity={0.6} color="#6366f1" />
          <pointLight position={[5, -3, 3]} intensity={0.4} color="#a78bfa" />
          <pointLight position={[0, 5, 0]} intensity={0.3} color="#60a5fa" />

          {/* 3D Elements */}
          <ParticleField count={1500} />
          <FloatingGeometry />
          <GridFloor />

          {/* Environment for reflections */}
          <Environment preset="night" />
          
          <Preload all />
        </Suspense>
      </Canvas>
    </div>
  );
}
