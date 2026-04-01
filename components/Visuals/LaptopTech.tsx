"use client";

import dynamic from "next/dynamic";

const Canvas3D = dynamic(() => import("@/components/Canvas3D"), { ssr: false });
const Laptop3D = dynamic(() => import("@/components/Models/Laptop3D").then(mod => mod.Laptop3D), { ssr: false });

export default function LaptopTech({ autoRotate = false }: { autoRotate?: boolean }) {
  return (
    <Canvas3D autoRotate={autoRotate}>
      <Laptop3D />
    </Canvas3D>
  );
}
