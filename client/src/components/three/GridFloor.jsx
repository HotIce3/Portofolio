import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function GridFloor() {
  const linesRef = useRef();

  const { geometry, material } = useMemo(() => {
    const points = [];
    const size = 40;
    const divisions = 40;
    const step = size / divisions;

    for (let i = -size / 2; i <= size / 2; i += step) {
      points.push(new THREE.Vector3(-size / 2, 0, i));
      points.push(new THREE.Vector3(size / 2, 0, i));
      points.push(new THREE.Vector3(i, 0, -size / 2));
      points.push(new THREE.Vector3(i, 0, size / 2));
    }

    const geo = new THREE.BufferGeometry().setFromPoints(points);
    const mat = new THREE.LineBasicMaterial({
      color: "#6366f1",
      transparent: true,
      opacity: 0.1,
      blending: THREE.AdditiveBlending,
    });

    return { geometry: geo, material: mat };
  }, []);

  useFrame((state) => {
    if (linesRef.current) {
      linesRef.current.material.opacity =
        0.08 + Math.sin(state.clock.getElapsedTime() * 0.5) * 0.03;
    }
  });

  return (
    <group position={[0, -5, 0]}>
      <lineSegments ref={linesRef} geometry={geometry} material={material} />
    </group>
  );
}
