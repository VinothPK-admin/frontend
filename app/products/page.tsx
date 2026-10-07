import { Suspense } from "react";
import { ProductCatalog } from "./ProductCatalog";

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#050505] pt-40 text-center text-white/50">Loading catalog...</div>}>
      <ProductCatalog />
    </Suspense>
  );
}
