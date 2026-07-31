"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";
import { RealisticBicycle } from "./BicycleModel";

export function Cycle3D() {
  const meshRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(t / 4) * 0.4;
      meshRef.current.position.y = Math.sin(t / 2) * 0.08;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.3} floatIntensity={0.4}>
      <group ref={meshRef} scale={1.35} position={[0, 0, 0]}>
        <RealisticBicycle wheelRotation={0} />
      </group>
    </Float>
  );
}
