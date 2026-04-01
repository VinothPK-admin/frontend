"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";

export function Laptop3D() {
  const groupRef = useRef<THREE.Group>(null);
  const screenRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (screenRef.current) {
      // Gentle opening/closing or tilt
      screenRef.current.rotation.x = -Math.PI / 2 + Math.sin(t) / 10;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
      <group ref={groupRef} scale={2}>
        {/* Base */}
        <mesh position={[0, -0.05, 0]}>
          <boxGeometry args={[1.5, 0.05, 1]} />
          <meshStandardMaterial color="#333" metalness={0.8} roughness={0.2} />
        </mesh>
        
        {/* Screen Hinge Area */}
        <group position={[0, -0.025, -0.5]} ref={screenRef}>
          {/* Screen Back */}
          <mesh position={[0, 0.5, 0]}>
            <boxGeometry args={[1.5, 1, 0.02]} />
            <meshStandardMaterial color="#111" metalness={0.9} roughness={0.1} />
          </mesh>
          {/* Screen Glass */}
          <mesh position={[0, 0.5, 0.015]}>
            <planeGeometry args={[1.4, 0.9]} />
            <meshStandardMaterial 
              color="#000" 
              emissive="#C5A46E" 
              emissiveIntensity={0.1} 
              roughness={0} 
              metalness={1}
            />
          </mesh>
          {/* Logo Glow */}
          <mesh position={[0, 0.5, -0.015]}>
            <circleGeometry args={[0.1, 32]} />
            <meshStandardMaterial color="#C5A46E" emissive="#C5A46E" emissiveIntensity={5} />
          </mesh>
        </group>
        
        {/* Keyboard area detail */}
        <mesh position={[0, -0.01, 0]}>
          <boxGeometry args={[1.3, 0.01, 0.7]} />
          <meshStandardMaterial color="#222" metalness={0.2} roughness={0.8} />
        </mesh>
      </group>
    </Float>
  );
}
