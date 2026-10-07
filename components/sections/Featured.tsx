"use client";

import Link from "next/link";
import { Product } from "@/lib/api";
import { ProductCard } from "../ProductCard";

interface FeaturedProps {
  products: Product[];
  inventoryUnavailable?: boolean;
}

export function Featured({ products, inventoryUnavailable = false }: FeaturedProps) {
  return (
    <section className="py-24 px-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-end mb-12">
        <div>
          <div className="text-[#C5A46E] text-xs font-bold tracking-[0.3em] uppercase mb-4">Curated Selection</div>
          <h2 className="text-4xl md:text-6xl font-extrabold tracking-tighter mb-4 text-white">
            Apex Spotlight
          </h2>
          <p className="text-white/50 text-lg md:text-xl font-medium">Engineered for performance, designed for life.</p>
        </div>
        <Link href="/products" className="hidden md:block text-sm font-bold text-[#C5A46E] hover:underline">
          View full inventory
        </Link>
      </div>

      {inventoryUnavailable ? (
        <p role="status" className="rounded-3xl border border-white/10 bg-white/[0.03] p-10 text-center text-white/60">Inventory is temporarily unavailable. Please try again later or contact the store.</p>
      ) : products.length === 0 ? (
        <p className="rounded-3xl border border-white/10 bg-white/[0.03] p-10 text-center text-white/60">Featured products will appear here soon.</p>
      ) : <div className="space-y-8">
        {products.slice(0, 1).map((product) => (
          <ProductCard key={product.id} product={product} horizontal />
        ))}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {products.slice(1, 3).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>}
    </section>
  );
}
