import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Stars } from "@react-three/drei";
import { Suspense } from "react";
import * as THREE from "three";

// Holographic project card
function HoloCard({ position, color, delay = 0, index }) {
  const meshRef = useRef();
  const edgeRef = useRef();
  const glowRef = useRef();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(t * 0.28 + delay) * 0.18;
      meshRef.current.rotation.x = Math.cos(t * 0.2 + delay) * 0.08;
    }
    if (edgeRef.current) {
      edgeRef.current.material.opacity = 0.3 + Math.sin(t * 1.5 + delay) * 0.15;
    }
    if (glowRef.current) {
      glowRef.current.material.opacity = 0.06 + Math.sin(t * 1.2 + delay) * 0.04;
    }
  });

  return (
    <Float speed={1.4} rotationIntensity={0.25} floatIntensity={0.6}>
      <group position={position}>
        {/* Card body */}
        <mesh ref={meshRef}>
          <boxGeometry args={[2.4, 1.6, 0.06]} />
          <meshPhysicalMaterial
            color={color}
            metalness={0.1}
            roughness={0.1}
            transparent
            opacity={0.22}
            clearcoat={1}
            clearcoatRoughness={0}
            side={THREE.DoubleSide}
          />
        </mesh>
        {/* Wireframe edge glow */}
        <mesh ref={edgeRef}>
          <boxGeometry args={[2.4, 1.6, 0.06]} />
          <meshBasicMaterial
            color={color}
            wireframe
            transparent
            opacity={0.3}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
        {/* Inner glow panel */}
        <mesh ref={glowRef} position={[0, 0, 0.04]}>
          <planeGeometry args={[2.2, 1.4]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={0.06}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
        {/* Edge light lines */}
        {[-1.2, 1.2].map((x, i) => (
          <mesh key={`v${i}`} position={[x, 0, 0]}>
            <boxGeometry args={[0.008, 1.6, 0.01]} />
            <meshBasicMaterial
              color={color}
              transparent
              opacity={0.8}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
        ))}
        {[-0.8, 0.8].map((y, i) => (
          <mesh key={`h${i}`} position={[0, y, 0]}>
            <boxGeometry args={[2.4, 0.008, 0.01]} />
            <meshBasicMaterial
              color={color}
              transparent
              opacity={0.8}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
        ))}
      </group>
    </Float>
  );
}

// Central morphing energy sphere
function CentralOrb() {
  const meshRef = useRef();
  const outerRef = useRef();
  const ringRefs = useRef([]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (meshRef.current) {
      meshRef.current.rotation.y = t * 0.35;
      meshRef.current.rotation.z = t * 0.15;
    }
    if (outerRef.current) {
      const pulse = 1 + Math.sin(t * 1.8) * 0.06;
      outerRef.current.scale.setScalar(pulse);
      outerRef.current.rotation.y = -t * 0.2;
    }
    ringRefs.current.forEach((ring, i) => {
      if (ring) {
        ring.rotation.x = t * 0.4 + (i * Math.PI) / 3;
        ring.rotation.y = t * 0.25 + (i * Math.PI) / 2;
      }
    });
  });

  const ringColors = ["#6366f1", "#a78bfa", "#60a5fa"];

  return (
    <Float speed={2.2} rotationIntensity={0.4} floatIntensity={1.2}>
      <group>
        {/* Core morphing orb */}
        <mesh ref={meshRef}>
          <sphereGeometry args={[0.9, 64, 64]} />
          <MeshDistortMaterial
            color="#6366f1"
            metalness={0.4}
            roughness={0}
            transparent
            opacity={0.65}
            distort={0.45}
            speed={2.5}
            clearcoat={1}
            emissive="#6366f1"
            emissiveIntensity={0.2}
          />
        </mesh>
        {/* Outer translucent shell */}
        <mesh ref={outerRef}>
          <sphereGeometry args={[1.15, 32, 32]} />
          <meshBasicMaterial
            color="#818cf8"
            transparent
            opacity={0.06}
            side={THREE.BackSide}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
        {/* Orbiting rings */}
        {ringColors.map((color, i) => (
          <mesh
            key={i}
            ref={(el) => (ringRefs.current[i] = el)}
            rotation={[(i * Math.PI) / 3, 0, 0]}
          >
            <torusGeometry args={[1.3 + i * 0.15, 0.025, 8, 64]} />
            <meshBasicMaterial
              color={color}
              transparent
              opacity={0.35}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
        ))}
        <pointLight position={[0, 0, 0]} intensity={1.2} color="#6366f1" distance={8} />
      </group>
    </Float>
  );
}

// Floating data particles
function DataParticles() {
  const ref = useRef();
  const { positions, colors } = useMemo(() => {
    const count = 300;
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const palette = [
      new THREE.Color("#6366f1"),
      new THREE.Color("#a78bfa"),
      new THREE.Color("#60a5fa"),
    ];
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 10;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 20;
      const c = palette[i % palette.length];
      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
    }
    return { positions: pos, colors: col };
  }, []);

  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    g.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    return g;
  }, [positions, colors]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (ref.current) {
      ref.current.rotation.y = t * 0.05;
      ref.current.rotation.x = t * 0.02;
    }
  });

  return (
    <points ref={ref} geometry={geo}>
      <pointsMaterial
        size={0.05}
        vertexColors
        transparent
        opacity={0.6}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  );
}

export default function ProjectsScene() {
  return (
    <div style={{ width: "100%", height: "100%" }}>
      <Canvas
        camera={{ position: [0, 0, 7], fov: 46 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.3} />
          <pointLight position={[6, 5, 5]} intensity={0.7} color="#6366f1" />
          <pointLight position={[-5, -4, 4]} intensity={0.5} color="#a78bfa" />
          <pointLight position={[0, 3, -3]} intensity={0.4} color="#60a5fa" />

          <Stars radius={60} depth={30} count={600} factor={3} saturation={0.3} fade speed={0.2} />

          <CentralOrb />
          <DataParticles />

          <HoloCard position={[-3.2, 0.6, -1.5]} color="#6366f1" delay={0} index={0} />
          <HoloCard position={[3.2, -0.4, -1.5]} color="#a78bfa" delay={1.2} index={1} />
          <HoloCard position={[0, -1.2, -2.5]} color="#60a5fa" delay={2.4} index={2} />
        </Suspense>
      </Canvas>
    </div>
  );
}
