import { useRef, useState, useMemo, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, Html, Billboard, Stars } from "@react-three/drei";
import { Suspense } from "react";
import * as THREE from "three";

// Animated connection beam between nodes
function Beam({ start, end, color, opacity = 0.12 }) {
  const ref = useRef();
  const geo = useMemo(() => {
    const pts = [new THREE.Vector3(...start), new THREE.Vector3(...end)];
    return new THREE.BufferGeometry().setFromPoints(pts);
  }, [start, end]);

  useFrame((state) => {
    if (ref.current) {
      ref.current.material.opacity = opacity + Math.sin(state.clock.getElapsedTime() * 1.5) * 0.05;
    }
  });

  return (
    <line ref={ref} geometry={geo}>
      <lineBasicMaterial
        color={color}
        transparent
        opacity={opacity}
        blending={THREE.AdditiveBlending}
      />
    </line>
  );
}

// Individual skill node with label
function SkillNode({ position, name, color, scale = 1 }) {
  const meshRef = useRef();
  const glowRef = useRef();
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (meshRef.current) {
      meshRef.current.rotation.y = t * 0.6;
      meshRef.current.rotation.x = Math.sin(t * 0.4) * 0.25;
    }
    if (glowRef.current) {
      glowRef.current.material.opacity = hovered
        ? 0.25 + Math.sin(t * 3) * 0.1
        : 0.08 + Math.sin(t * 2 + position[0]) * 0.04;
    }
  });

  return (
    <Float speed={1.8} rotationIntensity={0.25} floatIntensity={0.9}>
      <group position={position}>
        {/* Core gem */}
        <mesh
          ref={meshRef}
          scale={hovered ? scale * 1.35 : scale}
          onPointerOver={() => { setHovered(true); document.body.style.cursor = "pointer"; }}
          onPointerOut={() => { setHovered(false); document.body.style.cursor = "default"; }}
        >
          <dodecahedronGeometry args={[0.38, 0]} />
          <meshPhysicalMaterial
            color={color}
            metalness={0.3}
            roughness={0.05}
            transparent
            opacity={hovered ? 0.95 : 0.75}
            clearcoat={1}
            clearcoatRoughness={0}
            emissive={color}
            emissiveIntensity={hovered ? 0.6 : 0.2}
            iridescence={hovered ? 0.5 : 0}
          />
        </mesh>

        {/* Glow sphere */}
        <mesh ref={glowRef} scale={1.8}>
          <sphereGeometry args={[0.38, 16, 16]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={0.08}
            blending={THREE.AdditiveBlending}
          />
        </mesh>

        {/* Orbit ring (visible on hover) */}
        {hovered && (
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.55, 0.02, 8, 32]} />
            <meshBasicMaterial
              color={color}
              transparent
              opacity={0.6}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
        )}

        {/* Point light on hover */}
        {hovered && (
          <pointLight position={[0, 0, 0]} intensity={0.8} color={color} distance={4} />
        )}

        {/* Label */}
        <Billboard follow lockX={false} lockY={false} lockZ={false}>
          <Html position={[0, -0.65, 0]} center>
            <div
              style={{
                color: hovered ? "#ffffff" : "rgba(226,232,240,0.85)",
                fontSize: hovered ? "15px" : "13px",
                fontWeight: "700",
                fontFamily: "Inter, sans-serif",
                whiteSpace: "nowrap",
                textShadow: `0 2px 8px rgba(0,0,0,0.9), 0 0 12px ${color}80`,
                pointerEvents: "none",
                transition: "all 0.2s",
                letterSpacing: "0.02em",
              }}
            >
              {name}
            </div>
          </Html>
        </Billboard>
      </group>
    </Float>
  );
}

const skillNodesData = [
  { name: "React",       position: [-2.8, 1.8, 0.2],    color: "#61DAFB" },
  { name: "Node.js",     position: [2.8, 1.4, -1.2],    color: "#339933" },
  { name: "TypeScript",  position: [-1.2, -1.8, 0.6],   color: "#3178C6" },
  { name: "PostgreSQL",  position: [1.8, -1.2, -0.6],   color: "#4169E1" },
  { name: "JavaScript",  position: [0.2, 2.4, -0.6],    color: "#F7DF1E" },
  { name: "Python",      position: [-3.2, -0.6, -1.2],  color: "#3776AB" },
  { name: "Next.js",     position: [3.2, 0.2, 0.6],     color: "#a78bfa" },
  { name: "Tailwind",    position: [-1.8, 0.6, 1.2],    color: "#06B6D4" },
  { name: "Docker",      position: [0.6, -2.6, 0.2],    color: "#2496ED" },
  { name: "Git",         position: [-3.0, 0.2, 0.6],    color: "#F05032" },
  { name: "MongoDB",     position: [2.2, 2.4, 0.6],     color: "#47A248" },
  { name: "Vue.js",      position: [-0.6, 1.2, -1.8],   color: "#4FC08D" },
];

function ConstellationLines() {
  const lines = useMemo(() => {
    const result = [];
    for (let i = 0; i < skillNodesData.length; i++) {
      for (let j = i + 1; j < skillNodesData.length; j++) {
        const a = skillNodesData[i];
        const b = skillNodesData[j];
        const dist = Math.sqrt(
          (a.position[0] - b.position[0]) ** 2 +
          (a.position[1] - b.position[1]) ** 2 +
          (a.position[2] - b.position[2]) ** 2
        );
        if (dist < 4.2) {
          result.push({
            start: a.position,
            end: b.position,
            color: a.color,
            opacity: Math.max(0.04, 0.15 - dist * 0.025),
          });
        }
      }
    }
    return result;
  }, []);

  return (
    <>
      {lines.map((line, i) => (
        <Beam key={i} {...line} />
      ))}
    </>
  );
}

// Central pulsing nexus
function Nexus() {
  const ref = useRef();
  const ringRef = useRef();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (ref.current) {
      ref.current.rotation.y = t * 0.3;
      ref.current.rotation.x = Math.sin(t * 0.4) * 0.1;
      const pulse = 1 + Math.sin(t * 1.5) * 0.05;
      ref.current.scale.setScalar(pulse);
    }
    if (ringRef.current) {
      ringRef.current.rotation.z = t * 0.5;
    }
  });

  return (
    <group>
      <mesh ref={ref}>
        <icosahedronGeometry args={[0.45, 1]} />
        <meshPhysicalMaterial
          color="#6366f1"
          metalness={0.5}
          roughness={0}
          transparent
          opacity={0.6}
          clearcoat={1}
          emissive="#6366f1"
          emissiveIntensity={0.3}
        />
      </mesh>
      <mesh ref={ringRef}>
        <torusGeometry args={[0.65, 0.03, 8, 64]} />
        <meshBasicMaterial
          color="#a78bfa"
          transparent
          opacity={0.4}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      <pointLight position={[0, 0, 0]} intensity={1} color="#6366f1" distance={6} />
    </group>
  );
}

export default function SkillsScene() {
  return (
    <div style={{ width: "100%", height: "520px" }}>
      <Canvas
        camera={{ position: [0, 0, 8], fov: 52 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.3} />
          <pointLight position={[6, 6, 6]} intensity={0.8} color="#6366f1" />
          <pointLight position={[-6, -6, 6]} intensity={0.5} color="#a78bfa" />
          <pointLight position={[0, 4, -4]} intensity={0.4} color="#60a5fa" />

          <Stars radius={50} depth={30} count={800} factor={3} saturation={0.4} fade speed={0.3} />

          <ConstellationLines />
          <Nexus />

          {skillNodesData.map((skill) => (
            <SkillNode key={skill.name} {...skill} />
          ))}
        </Suspense>
      </Canvas>
    </div>
  );
}
