"use client";

import dynamic from "next/dynamic";

const Canvas3D = dynamic(() => import("@/components/Canvas3D"), { ssr: false });
const Cycle3D = dynamic(() => import("@/components/Models/Cycle3D").then(mod => mod.Cycle3D), { ssr: false });

export default function CycleHero({ autoRotate = true }: { autoRotate?: boolean }) {
  return (
    <Canvas3D autoRotate={autoRotate}>
      <Cycle3D />
    </Canvas3D>
  );
}
