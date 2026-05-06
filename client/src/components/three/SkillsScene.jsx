import { useRef, useState, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Html, Billboard } from "@react-three/drei";
import { Suspense } from "react";
import * as THREE from "three";

function SkillNode({ position, name, color, scale = 1 }) {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.5;
      meshRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.3) * 0.2;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.8}>
      <group position={position}>
        <mesh
          ref={meshRef}
          scale={hovered ? scale * 1.3 : scale}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
        >
          <dodecahedronGeometry args={[0.35, 0]} />
          <meshPhysicalMaterial
            color={color}
            metalness={0.4}
            roughness={0.1}
            transparent
            opacity={hovered ? 0.95 : 0.7}
            clearcoat={1}
            emissive={color}
            emissiveIntensity={hovered ? 0.4 : 0.15}
          />
        </mesh>
        <Billboard follow lockX={false} lockY={false} lockZ={false}>
          <Html position={[0, -0.6, 0]} center>
            <div
              style={{
                color: hovered ? "#ffffff" : "#e2e8f0",
                fontSize: "14px",
                fontWeight: "bold",
                whiteSpace: "nowrap",
                textShadow: "0px 2px 4px rgba(0,0,0,0.8)",
                pointerEvents: "none",
                transition: "color 0.2s",
              }}
            >
              {name}
            </div>
          </Html>
        </Billboard>
        {hovered && (
          <pointLight position={[0, 0, 0]} intensity={0.5} color={color} distance={3} />
        )}
      </group>
    </Float>
  );
}

function ConnectionLines({ nodes }) {
  const linesRef = useRef();

  const { geometry, material } = useMemo(() => {
    const points = [];
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dist = Math.sqrt(
          Math.pow(nodes[i].position[0] - nodes[j].position[0], 2) +
          Math.pow(nodes[i].position[1] - nodes[j].position[1], 2) +
          Math.pow(nodes[i].position[2] - nodes[j].position[2], 2)
        );
        if (dist < 4) {
          points.push(
            new THREE.Vector3(...nodes[i].position),
            new THREE.Vector3(...nodes[j].position)
          );
        }
      }
    }
    const geo = new THREE.BufferGeometry().setFromPoints(points);
    const mat = new THREE.LineBasicMaterial({
      color: "#6366f1",
      transparent: true,
      opacity: 0.1,
      blending: THREE.AdditiveBlending,
    });
    return { geometry: geo, material: mat };
  }, [nodes]);

  useFrame((state) => {
    if (linesRef.current) {
      linesRef.current.material.opacity = 0.08 + Math.sin(state.clock.getElapsedTime()) * 0.04;
    }
  });

  return <lineSegments ref={linesRef} geometry={geometry} material={material} />;
}

const skillNodesData = [
  { name: "React", position: [-2.5, 1.5, 0], color: "#61DAFB" },
  { name: "Node.js", position: [2.5, 1.2, -1], color: "#339933" },
  { name: "TypeScript", position: [-1, -1.5, 0.5], color: "#3178C6" },
  { name: "PostgreSQL", position: [1.5, -1, -0.5], color: "#4169E1" },
  { name: "JavaScript", position: [0, 2, -0.5], color: "#F7DF1E" },
  { name: "Python", position: [-3, -0.5, -1], color: "#3776AB" },
  { name: "Next.js", position: [3, 0, 0.5], color: "#a78bfa" },
  { name: "Tailwind", position: [-1.5, 0.5, 1], color: "#06B6D4" },
  { name: "Docker", position: [0.5, -2.2, 0], color: "#2496ED" },
  { name: "Git", position: [-2.8, 0, 0.5], color: "#F05032" },
  { name: "MongoDB", position: [2, 2, 0.5], color: "#47A248" },
  { name: "Vue.js", position: [-0.5, 1, -1.5], color: "#4FC08D" },
];

export default function SkillsScene() {
  return (
    <div style={{ width: "100%", height: "500px" }}>
      <Canvas
        camera={{ position: [0, 0, 7], fov: 50 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.4} />
          <pointLight position={[5, 5, 5]} intensity={0.6} color="#6366f1" />
          <pointLight position={[-5, -5, 5]} intensity={0.4} color="#a78bfa" />

          <ConnectionLines nodes={skillNodesData} />

          {skillNodesData.map((skill) => (
            <SkillNode key={skill.name} {...skill} />
          ))}
        </Suspense>
      </Canvas>
    </div>
  );
}
