import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Stars } from "@react-three/drei";
import { Suspense } from "react";
import * as THREE from "three";

function WavePlane() {
  const meshRef = useRef();
  const posRef = useRef();

  const { geometry } = useMemo(() => {
    const geo = new THREE.PlaneGeometry(20, 20, 60, 60);
    return { geometry: geo };
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (meshRef.current) {
      const posAttr = meshRef.current.geometry.attributes.position;
      const arr = posAttr.array;
      const count = posAttr.count;
      for (let i = 0; i < count; i++) {
        const x = arr[i * 3];
        const z = arr[i * 3 + 1];
        arr[i * 3 + 2] =
          Math.sin(x * 0.5 + t * 0.8) * 0.3 +
          Math.sin(z * 0.4 + t * 0.6) * 0.25 +
          Math.sin((x + z) * 0.3 + t) * 0.15;
      }
      posAttr.needsUpdate = true;
    }
  });

  return (
    <mesh ref={meshRef} geometry={geometry} rotation={[-Math.PI / 2, 0, 0]} position={[0, -3, 0]}>
      <meshBasicMaterial
        color="#6366f1"
        wireframe
        transparent
        opacity={0.08}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}

function FloatingEnvelopes() {
  const envelopes = useMemo(() =>
    Array.from({ length: 5 }, (_, i) => ({
      position: [
        (Math.random() - 0.5) * 12,
        (Math.random() - 0.5) * 6,
        (Math.random() - 0.5) * 8 - 3,
      ],
      speed: 0.4 + Math.random() * 0.6,
      delay: i * 1.2,
      color: ["#6366f1", "#a78bfa", "#60a5fa", "#34d399", "#f472b6"][i],
    })), []
  );

  return (
    <>
      {envelopes.map((env, i) => (
        <FloatEnvelope key={i} {...env} />
      ))}
    </>
  );
}

function FloatEnvelope({ position, speed, delay, color }) {
  const ref = useRef();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (ref.current) {
      ref.current.rotation.y = t * 0.3 * speed + delay;
      ref.current.rotation.x = Math.sin(t * 0.4 + delay) * 0.2;
    }
  });

  return (
    <Float speed={speed * 1.5} rotationIntensity={0.3} floatIntensity={1}>
      <group ref={ref} position={position}>
        {/* Envelope body */}
        <mesh>
          <boxGeometry args={[0.8, 0.55, 0.04]} />
          <meshPhysicalMaterial
            color={color}
            transparent
            opacity={0.25}
            clearcoat={1}
            metalness={0.1}
          />
        </mesh>
        {/* Envelope flap lines */}
        <mesh>
          <boxGeometry args={[0.8, 0.55, 0.04]} />
          <meshBasicMaterial
            color={color}
            wireframe
            transparent
            opacity={0.4}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
        <pointLight position={[0, 0, 0]} intensity={0.3} color={color} distance={2} />
      </group>
    </Float>
  );
}

export default function ContactScene() {
  return (
    <div style={{ width: "100%", height: "100%", position: "absolute", inset: 0 }}>
      <Canvas
        camera={{ position: [0, 0, 8], fov: 50 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.2} />
          <pointLight position={[5, 5, 5]} intensity={0.6} color="#6366f1" />
          <pointLight position={[-5, -3, 3]} intensity={0.4} color="#a78bfa" />

          <Stars radius={60} depth={30} count={500} factor={3} saturation={0.3} fade speed={0.2} />

          <WavePlane />
          <FloatingEnvelopes />
        </Suspense>
      </Canvas>
    </div>
  );
}
