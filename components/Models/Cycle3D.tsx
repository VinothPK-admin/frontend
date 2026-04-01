"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";

export function Cycle3D() {
  const meshRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(t / 4) / 4;
      meshRef.current.position.y = Math.sin(t / 2) / 10;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <group ref={meshRef} scale={1.5}>
        {/* Frame - Abstract High Tech Skeleton */}
        <mesh position={[0, 0, 0]} rotation={[0, 0, Math.PI / 4]}>
          <boxGeometry args={[0.1, 1.5, 0.1]} />
          <meshStandardMaterial color="#C5A46E" metalness={1} roughness={0.1} />
        </mesh>
        <mesh position={[-0.4, -0.4, 0]} rotation={[0, 0, -Math.PI / 4]}>
          <boxGeometry args={[0.1, 1.2, 0.1]} />
          <meshStandardMaterial color="#C5A46E" metalness={1} roughness={0.1} />
        </mesh>

        {/* Wheels */}
        <group position={[-0.8, -0.8, 0]}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.5, 0.05, 16, 100]} />
            <meshStandardMaterial color="#333" metalness={0.5} roughness={0.7} />
          </mesh>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
             <torusGeometry args={[0.48, 0.01, 16, 100]} />
             <meshStandardMaterial color="#C5A46E" emissive="#C5A46E" emissiveIntensity={2} />
          </mesh>
        </group>

        <group position={[0.8, -0.2, 0]}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.5, 0.05, 16, 100]} />
            <meshStandardMaterial color="#333" metalness={0.5} roughness={0.7} />
          </mesh>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
             <torusGeometry args={[0.48, 0.01, 16, 100]} />
             <meshStandardMaterial color="#C5A46E" emissive="#C5A46E" emissiveIntensity={2} />
          </mesh>
        </group>

        {/* Handlebars */}
        <mesh position={[0.5, 0.5, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.04, 0.04, 0.6]} />
          <meshStandardMaterial color="#222" metalness={0.9} roughness={0.2} />
        </mesh>
      </group>
    </Float>
  );
}
