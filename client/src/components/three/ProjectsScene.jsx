import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial } from "@react-three/drei";
import { Suspense } from "react";
import * as THREE from "three";

function FloatingCard({ position, color, delay = 0 }) {
  const meshRef = useRef();

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 0.3 + delay) * 0.2;
      meshRef.current.rotation.x = Math.cos(state.clock.getElapsedTime() * 0.2 + delay) * 0.1;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.5}>
      <mesh ref={meshRef} position={position}>
        <boxGeometry args={[2.2, 1.5, 0.05]} />
        <meshPhysicalMaterial
          color={color}
          metalness={0.1}
          roughness={0.2}
          transparent
          opacity={0.3}
          clearcoat={1}
          clearcoatRoughness={0}
          side={THREE.DoubleSide}
        />
      </mesh>
    </Float>
  );
}

function CentralOrb() {
  const meshRef = useRef();

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.3;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <mesh ref={meshRef}>
        <sphereGeometry args={[0.8, 32, 32]} />
        <MeshDistortMaterial
          color="#6366f1"
          metalness={0.3}
          roughness={0}
          transparent
          opacity={0.6}
          distort={0.4}
          speed={3}
        />
      </mesh>
    </Float>
  );
}

export default function ProjectsScene() {
  return (
    <div style={{ width: "100%", height: "300px" }}>
      <Canvas
        camera={{ position: [0, 0, 6], fov: 45 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.4} />
          <pointLight position={[5, 5, 5]} intensity={0.5} color="#6366f1" />
          <pointLight position={[-5, -3, 3]} intensity={0.3} color="#a78bfa" />

          <CentralOrb />
          <FloatingCard position={[-3, 0.5, -1]} color="#6366f1" delay={0} />
          <FloatingCard position={[3, -0.3, -1]} color="#a78bfa" delay={1} />
          <FloatingCard position={[0, -1, -2]} color="#60a5fa" delay={2} />
        </Suspense>
      </Canvas>
    </div>
  );
}
