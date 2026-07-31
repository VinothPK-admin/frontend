"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";

interface Canvas3DProps {
  children: React.ReactNode;
  className?: string;
  autoRotate?: boolean;
}

export default function Canvas3D({
  children,
  className = "relative h-full w-full",
  autoRotate = true,
}: Canvas3DProps) {
  return (
    <div className={className}>
      <Canvas
        gl={{
          antialias: true,
          powerPreference: "high-performance",
          toneMapping: THREE.ACESFilmicToneMapping,
        }}
        shadows={false}
        camera={{ position: [0, 0.1, 4.8], fov: 42 }}
      >
        {/* Optimized Studio Lighting setup for realistic metallic & emissive rendering */}
        <ambientLight intensity={0.8} />
        <directionalLight position={[8, 10, 6]} intensity={1.8} color="#ffffff" />
        <directionalLight position={[-8, -5, -4]} intensity={0.6} color="#C5A46E" />
        <pointLight position={[0, 4, 3]} intensity={1.2} color="#ffffff" />
        <pointLight position={[0, -3, -2]} intensity={0.5} color="#06b6d4" />

        <Suspense fallback={null}>
          <group>{children}</group>
        </Suspense>

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate={autoRotate}
          autoRotateSpeed={0.6}
        />
      </Canvas>
    </div>
  );
}
