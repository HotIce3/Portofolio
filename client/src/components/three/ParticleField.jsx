import { useRef, useMemo, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

export default function ParticleField({ count = 2500 }) {
  const pointsRef = useRef();
  const mouseRef = useRef({ x: 0, y: 0 });
  const { viewport } = useThree();

  useEffect(() => {
    const onMouseMove = (e) => {
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("mousemove", onMouseMove);
    return () => window.removeEventListener("mousemove", onMouseMove);
  }, []);

  const { positions, colors, sizes } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);

    const palette = [
      new THREE.Color("#6366f1"),
      new THREE.Color("#8b5cf6"),
      new THREE.Color("#a78bfa"),
      new THREE.Color("#c084fc"),
      new THREE.Color("#60a5fa"),
      new THREE.Color("#34d399"),
      new THREE.Color("#f472b6"),
    ];

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;

      // Galaxy spiral distribution
      const arm = Math.floor(Math.random() * 3);
      const radius = Math.random() * 18 + 1;
      const spinAngle = radius * 0.5;
      const branchAngle = (arm / 3) * Math.PI * 2;
      const randomSpread = (Math.random() - 0.5) * 3 * Math.exp(-radius * 0.1);

      positions[i3] = Math.cos(branchAngle + spinAngle) * radius + randomSpread;
      positions[i3 + 1] = (Math.random() - 0.5) * 5 + randomSpread;
      positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomSpread;

      // Color biased toward center = brighter
      const mixFactor = 1 - radius / 20;
      const c1 = palette[Math.floor(Math.random() * palette.length)];
      const c2 = palette[Math.floor(Math.random() * palette.length)];
      const mixed = c1.clone().lerp(c2, Math.random());
      mixed.lerp(new THREE.Color("#ffffff"), mixFactor * 0.3);
      colors[i3] = mixed.r;
      colors[i3 + 1] = mixed.g;
      colors[i3 + 2] = mixed.b;

      sizes[i] = Math.random() * 0.05 + 0.02;
    }

    return { positions, colors, sizes };
  }, [count]);

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    geo.setAttribute("size", new THREE.BufferAttribute(sizes, 1));
    return geo;
  }, [positions, colors, sizes]);

  const material = useMemo(
    () =>
      new THREE.PointsMaterial({
        size: 0.07,
        vertexColors: true,
        transparent: true,
        opacity: 0.85,
        sizeAttenuation: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    []
  );

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (pointsRef.current) {
      // Slow galaxy rotation
      pointsRef.current.rotation.y = time * 0.04;

      // Subtle mouse parallax
      pointsRef.current.rotation.x = THREE.MathUtils.lerp(
        pointsRef.current.rotation.x,
        mouseRef.current.y * 0.08,
        0.02
      );

      // Breathing effect
      const posAttr = pointsRef.current.geometry.attributes.position;
      const arr = posAttr.array;
      for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        arr[i3 + 1] += Math.sin(time * 0.5 + i * 0.008) * 0.001;
      }
      posAttr.needsUpdate = true;
    }
  });

  return <points ref={pointsRef} geometry={geometry} material={material} />;
}
