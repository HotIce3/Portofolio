import { useRef, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import {
  MeshDistortMaterial,
  MeshWobbleMaterial,
  Float,
  Trail,
} from "@react-three/drei";
import * as THREE from "three";

// Animated crystalline icosahedron with dynamic lighting
function GlassSphere({ position, scale = 1, color = "#6366f1", speed = 1 }) {
  const meshRef = useRef();
  const lightRef = useRef();
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (meshRef.current) {
      meshRef.current.rotation.x = t * 0.25 * speed;
      meshRef.current.rotation.z = t * 0.18 * speed;
    }
    if (lightRef.current) {
      lightRef.current.intensity = 0.5 + Math.sin(t * 2 + position[0]) * 0.3;
    }
  });

  return (
    <Float speed={2.2 * speed} rotationIntensity={0.4} floatIntensity={1.8}>
      <group position={position}>
        <mesh
          ref={meshRef}
          scale={hovered ? scale * 1.15 : scale}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
        >
          <icosahedronGeometry args={[1, 2]} />
          <MeshDistortMaterial
            color={color}
            envMapIntensity={0.8}
            clearcoat={1}
            clearcoatRoughness={0}
            metalness={0.15}
            roughness={0.05}
            transparent
            opacity={hovered ? 0.85 : 0.65}
            distort={0.3}
            speed={1.8}
          />
        </mesh>
        {/* Inner glow orb */}
        <mesh scale={0.4}>
          <sphereGeometry args={[1, 16, 16]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={0.15}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
        <pointLight
          ref={lightRef}
          position={[0, 0, 0]}
          intensity={0.5}
          color={color}
          distance={5}
        />
      </group>
    </Float>
  );
}

// Energy torus with electric trail effect
function WobbleTorus({ position, scale = 1, color = "#a78bfa", speed = 1 }) {
  const meshRef = useRef();
  const ringRef = useRef();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (meshRef.current) {
      meshRef.current.rotation.x = t * 0.2 * speed;
      meshRef.current.rotation.y = t * 0.15 * speed;
    }
    if (ringRef.current) {
      ringRef.current.rotation.z = t * 0.4;
    }
  });

  return (
    <Float speed={1.8 * speed} rotationIntensity={0.6} floatIntensity={2.2}>
      <group position={position} scale={scale}>
        <mesh ref={meshRef}>
          <torusGeometry args={[1, 0.35, 20, 48]} />
          <MeshWobbleMaterial
            color={color}
            metalness={0.6}
            roughness={0.05}
            transparent
            opacity={0.7}
            factor={0.5}
            speed={1.5}
          />
        </mesh>
        {/* Rotating inner ring */}
        <mesh ref={ringRef}>
          <torusGeometry args={[0.7, 0.05, 8, 32]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={0.5}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      </group>
    </Float>
  );
}

// Crystal octahedron gem with shiny reflections
function OctahedronGem({ position, scale = 1, color = "#34d399" }) {
  const meshRef = useRef();
  const wireMeshRef = useRef();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (meshRef.current) {
      meshRef.current.rotation.y = t * 0.5;
      meshRef.current.rotation.x = Math.sin(t * 0.35) * 0.5;
    }
    if (wireMeshRef.current) {
      wireMeshRef.current.rotation.y = -t * 0.3;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.9} floatIntensity={1.6}>
      <group position={position} scale={scale}>
        <mesh ref={meshRef}>
          <octahedronGeometry args={[1, 0]} />
          <meshPhysicalMaterial
            color={color}
            metalness={0.4}
            roughness={0}
            transparent
            opacity={0.7}
            clearcoat={1}
            clearcoatRoughness={0}
            iridescence={0.8}
            iridescenceIOR={1.5}
          />
        </mesh>
        {/* Wire overlay */}
        <mesh ref={wireMeshRef}>
          <octahedronGeometry args={[1.08, 0]} />
          <meshBasicMaterial
            color={color}
            wireframe
            transparent
            opacity={0.15}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      </group>
    </Float>
  );
}

// Pulsing energy orb with rings
function EnergyOrb({ position, scale = 1, color = "#60a5fa" }) {
  const outerRef = useRef();
  const innerRef = useRef();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (outerRef.current) {
      const pulse = 1 + Math.sin(t * 2.5 + position[0]) * 0.07;
      outerRef.current.scale.setScalar(pulse);
    }
    if (innerRef.current) {
      innerRef.current.rotation.y = t * 0.8;
      innerRef.current.rotation.z = t * 0.5;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={1.2}>
      <group position={position} scale={scale}>
        {/* Core */}
        <mesh>
          <sphereGeometry args={[0.6, 32, 32]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={0.5}
            transparent
            opacity={0.8}
          />
        </mesh>
        {/* Outer shell */}
        <mesh ref={outerRef}>
          <sphereGeometry args={[1, 32, 32]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={0.08}
            blending={THREE.AdditiveBlending}
            side={THREE.BackSide}
          />
        </mesh>
        {/* Orbit ring */}
        <mesh ref={innerRef}>
          <torusGeometry args={[0.9, 0.02, 8, 64]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={0.4}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
        <pointLight
          position={[0, 0, 0]}
          intensity={0.8}
          color={color}
          distance={4}
        />
      </group>
    </Float>
  );
}

export default function FloatingGeometry({ compact = false }) {
  if (compact) {
    return (
      <group>
        <GlassSphere
          position={[2.8, 0.2, -2.2]}
          scale={1.35}
          color="#6366f1"
          speed={0.6}
        />
        <EnergyOrb position={[-2.4, -1.3, -3.1]} scale={0.65} color="#60a5fa" />
        <WobbleTorus
          position={[2.3, -3.2, -5.2]}
          scale={0.35}
          color="#a78bfa"
          speed={0.7}
        />
      </group>
    );
  }

  return (
    <group>
      {/* Main hero sphere - right side, large and prominent */}
      <GlassSphere
        position={[3.8, 0.3, -2.5]}
        scale={2.0}
        color="#6366f1"
        speed={0.65}
      />

      {/* Supporting shapes with varied positions */}
      <WobbleTorus
        position={[-4.5, 2.5, -5.5]}
        scale={0.85}
        color="#a78bfa"
        speed={0.5}
      />
      <OctahedronGem position={[5.5, -2, -4.5]} scale={0.7} color="#34d399" />
      <EnergyOrb position={[-3.2, -1.5, -3.5]} scale={0.8} color="#60a5fa" />

      {/* Accent shapes */}
      <OctahedronGem position={[6.5, 3.5, -7]} scale={0.35} color="#f472b6" />
      <GlassSphere
        position={[-6.5, -3, -6.5]}
        scale={0.45}
        color="#fbbf24"
        speed={0.6}
      />
      <WobbleTorus
        position={[2, -4.5, -8]}
        scale={0.4}
        color="#f97316"
        speed={0.8}
      />
      <EnergyOrb position={[-2, 4, -6]} scale={0.5} color="#818cf8" />
    </group>
  );
}
