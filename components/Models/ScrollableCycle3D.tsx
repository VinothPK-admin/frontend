"use client";

import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";
import { RealisticBicycle } from "./BicycleModel";

interface ScrollableCycle3DProps {
  progress?: number; // 0 to 1
}

export function ScrollableCycle3D({ progress = 0 }: ScrollableCycle3DProps) {
  const groupRef = useRef<THREE.Group>(null);
  const [wheelRot, setWheelRot] = useState(0);

  useFrame(() => {
    if (groupRef.current) {
      // Smoothly rotate bike 360 degrees across full scroll progress + dynamic tilt
      const targetRotationY = progress * Math.PI * 2.5;
      const targetRotationX = Math.sin(progress * Math.PI * 2) * 0.15;
      const targetScale = 1.35 + Math.sin(progress * Math.PI) * 0.25;

      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRotationY, 0.08);
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetRotationX, 0.08);
      groupRef.current.scale.setScalar(THREE.MathUtils.lerp(groupRef.current.scale.x, targetScale, 0.08));

      // Wheel spin based on scroll progress
      setWheelRot(progress * Math.PI * 14);
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.3}>
      <group ref={groupRef} position={[0, -0.1, 0]}>
        <RealisticBicycle wheelRotation={wheelRot} />
      </group>
    </Float>
  );
}
