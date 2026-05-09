import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function GridFloor() {
  const gridRef = useRef();
  const pulseRingRef = useRef();

  // Primary grid
  const { geometry: gridGeo, material: gridMat } = useMemo(() => {
    const points = [];
    const size = 50;
    const divisions = 30;
    const step = size / divisions;

    for (let i = -size / 2; i <= size / 2; i += step) {
      points.push(new THREE.Vector3(-size / 2, 0, i));
      points.push(new THREE.Vector3(size / 2, 0, i));
      points.push(new THREE.Vector3(i, 0, -size / 2));
      points.push(new THREE.Vector3(i, 0, size / 2));
    }

    const geo = new THREE.BufferGeometry().setFromPoints(points);
    const mat = new THREE.LineBasicMaterial({
      color: "#4f46e5",
      transparent: true,
      opacity: 0.12,
      blending: THREE.AdditiveBlending,
    });

    return { geometry: geo, material: mat };
  }, []);

  // Pulsing radial rings
  const rings = useMemo(() => {
    return [2, 5, 9, 14, 20].map((radius) => {
      const pts = [];
      const segs = 64;
      for (let i = 0; i <= segs; i++) {
        const angle = (i / segs) * Math.PI * 2;
        pts.push(new THREE.Vector3(Math.cos(angle) * radius, 0, Math.sin(angle) * radius));
      }
      const geo = new THREE.BufferGeometry().setFromPoints(pts);
      const mat = new THREE.LineBasicMaterial({
        color: "#6366f1",
        transparent: true,
        opacity: 0.15,
        blending: THREE.AdditiveBlending,
      });
      return { geo, mat, radius };
    });
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (gridRef.current) {
      gridRef.current.material.opacity = 0.08 + Math.sin(t * 0.6) * 0.04;
    }
    // Animate ring opacities with stagger
    rings.forEach(({ mat }, i) => {
      mat.opacity = 0.08 + Math.sin(t * 0.8 + i * 1.2) * 0.07;
    });
  });

  return (
    <group position={[0, -4.5, 0]}>
      <lineSegments ref={gridRef} geometry={gridGeo} material={gridMat} />
      {rings.map(({ geo, mat, radius }, i) => (
        <line key={i} geometry={geo} material={mat} />
      ))}
    </group>
  );
}
