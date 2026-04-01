"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, ContactShadows, OrbitControls, Stage } from "@react-three/drei";

interface Canvas3DProps {
  children: React.ReactNode;
  className?: string;
  autoRotate?: boolean;
}

export default function Canvas3D({ children, className = "h-full w-full", autoRotate = true }: Canvas3DProps) {
  return (
    <div className={className}>
      <Canvas shadows camera={{ position: [0, 0, 5], fov: 45 }}>
        <Stage intensity={0.5} environment="city" adjustCamera={false}>
          <Suspense fallback={null}>
            <group>
              {children}
            </group>
            <Environment preset="city" />
            <ContactShadows 
              position={[0, -1.2, 0]} 
              opacity={0.4} 
              scale={10} 
              blur={2.5} 
              far={10} 
            />
          </Suspense>
        </Stage>
        <OrbitControls 
          enableZoom={false} 
          enablePan={false}
          autoRotate={autoRotate}
          autoRotateSpeed={0.5}
        />
      </Canvas>
    </div>
  );
}
