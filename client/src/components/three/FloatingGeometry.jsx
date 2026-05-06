import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { MeshDistortMaterial, MeshWobbleMaterial, Float } from "@react-three/drei";
import * as THREE from "three";

function GlassSphere({ position, scale = 1, color = "#6366f1", speed = 1 }) {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.3 * speed;
      meshRef.current.rotation.z = state.clock.getElapsedTime() * 0.2 * speed;
    }
  });

  return (
    <Float speed={2 * speed} rotationIntensity={0.5} floatIntensity={1.5}>
      <mesh
        ref={meshRef}
        position={position}
        scale={hovered ? scale * 1.15 : scale}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <icosahedronGeometry args={[1, 1]} />
        <MeshDistortMaterial
          color={color}
          envMapIntensity={0.6}
          clearcoat={1}
          clearcoatRoughness={0}
          metalness={0.2}
          roughness={0.1}
          transparent
          opacity={0.7}
          distort={0.35}
          speed={2}
        />
      </mesh>
    </Float>
  );
}

function WobbleTorus({ position, scale = 1, color = "#a78bfa", speed = 1 }) {
  const meshRef = useRef();

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.2 * speed;
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.15 * speed;
    }
  });

  return (
    <Float speed={1.5 * speed} rotationIntensity={0.8} floatIntensity={2}>
      <mesh ref={meshRef} position={position} scale={scale}>
        <torusGeometry args={[1, 0.4, 16, 32]} />
        <MeshWobbleMaterial
          color={color}
          metalness={0.5}
          roughness={0.1}
          transparent
          opacity={0.6}
          factor={0.6}
          speed={1}
        />
      </mesh>
    </Float>
  );
}

function GlowRing({ position, scale = 1, color = "#60a5fa" }) {
  const meshRef = useRef();

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.PI / 2 + Math.sin(state.clock.getElapsedTime() * 0.5) * 0.3;
      meshRef.current.rotation.z = state.clock.getElapsedTime() * 0.3;
    }
  });

  return (
    <Float speed={1} rotationIntensity={0.3} floatIntensity={1}>
      <mesh ref={meshRef} position={position} scale={scale}>
        <torusGeometry args={[1.5, 0.05, 16, 64]} />
        <meshBasicMaterial color={color} transparent opacity={0.8} />
      </mesh>
    </Float>
  );
}

function OctahedronGem({ position, scale = 1, color = "#34d399" }) {
  const meshRef = useRef();

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.5;
      meshRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.3) * 0.5;
    }
  });

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={1.5}>
      <mesh ref={meshRef} position={position} scale={scale}>
        <octahedronGeometry args={[1, 0]} />
        <meshPhysicalMaterial
          color={color}
          metalness={0.3}
          roughness={0}
          transparent
          opacity={0.65}
          clearcoat={1}
          clearcoatRoughness={0}
        />
      </mesh>
    </Float>
  );
}

export default function FloatingGeometry() {
  return (
    <group>
      {/* Main hero sphere - right side */}
      <GlassSphere position={[3.5, 0.5, -2]} scale={1.8} color="#6366f1" speed={0.7} />
      
      {/* Supporting shapes */}
      <WobbleTorus position={[-4, 2, -5]} scale={0.8} color="#a78bfa" speed={0.5} />
      <OctahedronGem position={[5, -2, -4]} scale={0.6} color="#34d399" speed={0.9} />
      <GlassSphere position={[-3, -1.5, -3]} scale={0.7} color="#60a5fa" speed={1.2} />
      
      {/* Decorative rings */}
      <GlowRing position={[3.5, 0.5, -2]} scale={1.2} color="#818cf8" />
      <GlowRing position={[-4, 2, -5]} scale={0.6} color="#c084fc" />
      
      {/* Small accent shapes */}
      <OctahedronGem position={[6, 3, -7]} scale={0.3} color="#f472b6" speed={1.5} />
      <GlassSphere position={[-6, -3, -6]} scale={0.4} color="#fbbf24" speed={0.6} />
      <WobbleTorus position={[2, -4, -8]} scale={0.4} color="#f97316" speed={0.8} />
    </group>
  );
}
