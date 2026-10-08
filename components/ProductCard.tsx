"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Product } from "@/lib/api";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
  className?: string;
  horizontal?: boolean;
}

export function ProductCard({ product, className, horizontal }: ProductCardProps) {
  const isCycle = product.category?.slug === "cycles";
  const displayPrice = product.price_inr != null
    ? new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(product.price_inr)
    : isCycle ? "Ask for price" : product.price || "Ask for price";

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className={cn(
        "group relative overflow-hidden rounded-3xl bg-[#121212] border border-white/5 transition-all duration-500 hover:scale-[1.02]",
        horizontal ? "flex flex-col md:flex-row h-auto md:h-96" : "flex flex-col min-h-[500px]",
        className,
      )}
    >
      <div className={cn("relative overflow-hidden", horizontal ? "w-full md:w-2/3 h-64 md:h-full" : "w-full h-64")}>
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes={horizontal ? "(max-width: 768px) 100vw, 66vw" : "(max-width: 768px) 100vw, 33vw"}
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/30 transition-colors" />
      </div>

      <div className={cn("p-7 flex flex-col", horizontal ? "w-full md:w-1/3" : "flex-1")}>
        <div className="flex justify-between items-start gap-3 mb-2">
          <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#C5A46E]">{product.brand}</span>
          <span className="text-sm font-bold text-white/70 text-right">{displayPrice}</span>
        </div>
        {isCycle && (
          <span className={`mb-3 w-fit rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${product.availability === "in_stock" ? "bg-emerald-400/10 text-emerald-300" : product.availability === "on_request" ? "bg-[#C5A46E]/10 text-[#C5A46E]" : "bg-white/10 text-white/50"}`}>
            {product.availability === "in_stock" ? "In stock" : product.availability === "on_request" ? "Available on request" : "Out of stock"}
          </span>
        )}
        <h3 className="text-2xl font-bold mb-3 text-white leading-tight">{product.name}</h3>
        {isCycle && <p className="text-sm text-white/45 mb-3">{[product.cycle_type, product.wheel_size ? `${product.wheel_size} wheel` : null].filter(Boolean).join(" · ")}</p>}

        <div className="flex flex-wrap gap-2 mb-5">
          {Object.entries(product.specs || {}).slice(0, 3).map(([key, value]) => (
            <span key={key} className="text-[9px] uppercase tracking-wider bg-white/5 px-2 py-1 rounded-md text-white/50">{key}: {value}</span>
          ))}
        </div>

        <Link href={`/products/${encodeURIComponent(product.slug)}`} className="mt-auto text-sm font-bold text-white flex items-center gap-2 group/link">
          <span>{isCycle ? "View cycle" : "View details"}</span>
          <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform duration-300 group-hover/link:translate-x-1" />
        </Link>
      </div>
    </motion.article>
  );
}
