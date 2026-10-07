"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Product } from "@/lib/api";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
  className?: string;
  horizontal?: boolean;
}

export function ProductCard({ product, className, horizontal }: ProductCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className={cn(
        "group relative overflow-hidden rounded-3xl bg-[#121212] border border-white/5 transition-all duration-500 hover:scale-[1.02]",
        horizontal ? "flex flex-col md:flex-row h-auto md:h-96" : "flex flex-col h-[500px]",
        className
      )}
    >
      {/* Image Container */}
      <div className={cn(
        "relative overflow-hidden",
        horizontal ? "w-full md:w-2/3 h-64 md:h-full" : "w-full h-2/3"
      )}>
        <Image 
          src={product.image} 
          alt={product.name} 
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/30 transition-colors" />
      </div>

      {/* Content Container */}
      <div className={cn(
        "p-8 flex flex-col justify-center",
        horizontal ? "w-full md:w-1/3" : "w-full h-1/3"
      )}>
        <div className="flex justify-between items-start mb-2">
          <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#C5A46E]">
            {product.brand}
          </span>
          <span className="text-sm font-bold text-white/50">
            {product.price}
          </span>
        </div>
        <h3 className="text-2xl font-bold mb-4 text-white leading-tight">
          {product.name}
        </h3>
        
        {/* Specs snippet */}
        <div className="flex flex-wrap gap-2 mb-6">
          {Object.entries(product.specs).slice(0, 2).map(([key, value]) => (
            <span key={key} className="text-[9px] uppercase tracking-wider bg-white/5 px-2 py-1 rounded-md text-white/40">
              {key}: {value}
            </span>
          ))}
        </div>

        <Link 
          href={`/products/${encodeURIComponent(product.slug)}`}
          className="mt-auto text-sm font-bold text-white flex items-center space-x-2 group/link"
        >
          <span>View Details</span>
          <span className="transition-transform duration-300 group-hover/link:translate-x-1">→</span>
        </Link>
      </div>
    </motion.div>
  );
}
