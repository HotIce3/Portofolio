import { useRef, useMemo, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

const vertexShader = /* glsl */ `
  attribute float size;
  attribute vec3 customColor;
  uniform float uTime;
  varying vec3 vColor;
  void main() {
    vColor = customColor;
    vec3 pos = position;
    pos.y += sin(uTime * 0.5 + position.x * 0.3 + position.z * 0.3) * 0.12;
    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_PointSize = size * (200.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const fragmentShader = /* glsl */ `
  varying vec3 vColor;
  void main() {
    float d = length(gl_PointCoord - vec2(0.5));
    if (d > 0.5) discard;
    float alpha = 1.0 - smoothstep(0.2, 0.5, d);
    gl_FragColor = vec4(vColor, alpha * 0.85);
  }
`;

export default function ParticleField({ count = 2500 }) {
  const pointsRef = useRef();
  const mouseRef = useRef({ x: 0, y: 0 });

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
      const arm = Math.floor(Math.random() * 3);
      const radius = Math.random() * 18 + 1;
      const spinAngle = radius * 0.5;
      const branchAngle = (arm / 3) * Math.PI * 2;
      const randomSpread = (Math.random() - 0.5) * 3 * Math.exp(-radius * 0.1);

      positions[i3] = Math.cos(branchAngle + spinAngle) * radius + randomSpread;
      positions[i3 + 1] = (Math.random() - 0.5) * 5 + randomSpread;
      positions[i3 + 2] =
        Math.sin(branchAngle + spinAngle) * radius + randomSpread;

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
    geo.setAttribute("customColor", new THREE.BufferAttribute(colors, 3));
    geo.setAttribute("size", new THREE.BufferAttribute(sizes, 1));
    return geo;
  }, [positions, colors, sizes]);

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms: { uTime: { value: 0 } },
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    [],
  );

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    material.uniforms.uTime.value = time;
    if (pointsRef.current) {
      pointsRef.current.rotation.y = time * 0.04;
      pointsRef.current.rotation.x = THREE.MathUtils.lerp(
        pointsRef.current.rotation.x,
        mouseRef.current.y * 0.08,
        0.02,
      );
    }
  });

  return <points ref={pointsRef} geometry={geometry} material={material} />;
}
