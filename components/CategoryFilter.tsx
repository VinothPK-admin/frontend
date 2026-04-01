"use client";

import { Category } from "@/lib/api";
import { cn } from "@/lib/utils";

interface CategoryFilterProps {
  categories: Category[];
  activeSlug: string | null;
  onCategoryChange: (slug: string | null) => void;
}

export function CategoryFilter({ categories, activeSlug, onCategoryChange }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap justify-center gap-4 mb-16">
      <button
        onClick={() => onCategoryChange(null)}
        className={cn(
          "px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all",
          !activeSlug 
            ? "bg-white text-black" 
            : "bg-white/5 text-white/40 hover:bg-white/10 hover:text-white"
        )}
      >
        All Gear
      </button>
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onCategoryChange(category.slug)}
          className={cn(
            "px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all",
            activeSlug === category.slug 
              ? "bg-[#C5A46E] text-black" 
              : "bg-white/5 text-white/40 hover:bg-white/10 hover:text-white"
          )}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
}
