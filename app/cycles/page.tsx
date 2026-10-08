import { Suspense } from "react";
import { ProductCatalog } from "../products/ProductCatalog";

export default function CyclesPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#050505] pt-40 text-center text-white/50">Loading cycle shop...</div>}>
      <ProductCatalog cycleOnly />
    </Suspense>
  );
}
