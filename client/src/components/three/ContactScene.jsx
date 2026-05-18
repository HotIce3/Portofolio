import React, { Suspense, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import FloatingGeometry from "./FloatingGeometry";
import { useSceneQuality } from "./useSceneQuality";

const ContactScene = () => {
  const { isLowPower } = useSceneQuality();

  const starsCount = useMemo(() => (isLowPower ? 2000 : 5000), [isLowPower]);

  return (
    <div className="absolute inset-0 -z-10 bg-slate-950">
      <Canvas
        shadows={!isLowPower}
        camera={{ position: [0, 0, 15], fov: 45 }}
        gl={{
          antialias: !isLowPower,
          powerPreference: isLowPower ? "low-power" : "high-performance",
          alpha: true,
        }}
        dpr={isLowPower ? 1 : [1, 2]}
      >
        <color attach="background" args={["#020617"]} />
        <Suspense fallback={null}>
          <ambientLight intensity={0.2} />
          <pointLight position={[5, 5, 5]} intensity={0.6} color="#6366f1" />
          <pointLight position={[-5, -3, 3]} intensity={0.4} color="#a78bfa" />

          <Stars
            radius={isLowPower ? 44 : 60}
            depth={isLowPower ? 18 : 30}
            count={starsCount}
            factor={isLowPower ? 2 : 3}
            saturation={0.3}
            fade
            speed={isLowPower ? 0.12 : 0.2}
          />

          <FloatingGeometry type="waves" compact={isLowPower} />
          <FloatingGeometry type="envelopes" compact={isLowPower} />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default ContactScene;
