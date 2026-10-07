"use client";

import { useState, useEffect } from "react";
import { Product, Category, getProducts, getCategories } from "@/lib/api";
import { ProductCard } from "@/components/ProductCard";
import { CategoryFilter } from "@/components/CategoryFilter";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export function ProductCatalog() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const initialCategory = searchParams.get("category");

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategory, setActiveCategory] = useState<string | null>(initialCategory);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => setActiveCategory(searchParams.get("category")), [searchParams]);

  function changeCategory(slug: string | null) {
    setActiveCategory(slug);
    const params = new URLSearchParams(searchParams.toString());
    if (slug) params.set("category", slug);
    else params.delete("category");
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }

  useEffect(() => {
    let cancelled = false;
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const [fetchedProducts, fetchedCategories] = await Promise.all([
          getProducts(activeCategory || undefined), getCategories()
        ]);
        if (!cancelled) { setProducts(fetchedProducts); setCategories(fetchedCategories); }
      } catch (cause) {
        if (!cancelled) setError(cause instanceof Error ? cause.message : "Unable to load the catalog.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchData();
    return () => { cancelled = true; };
  }, [activeCategory, retryCount]);

  return (
    <div className="bg-[#050505] min-h-screen pt-32 pb-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="text-[#C5A46E] text-xs font-bold tracking-[0.4em] uppercase mb-6">Expertise & Inventory</div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter text-white mb-6">
            The Apex Catalog
          </h1>
          <p className="text-xl text-white/50 max-w-2xl mx-auto font-medium">
            Explore our curated selection of premium cycles, high-performance tyres, and expert technology services.
          </p>
        </div>

        <CategoryFilter 
          categories={categories} 
          activeSlug={activeCategory} 
          onCategoryChange={changeCategory} 
        />

        {error ? (
          <div role="alert" className="py-20 text-center">
            <p className="text-white/70 mb-5">{error}</p>
            <button onClick={() => setRetryCount((count) => count + 1)} className="rounded-full bg-white px-6 py-3 text-sm font-bold text-black">Try again</button>
          </div>
        ) : loading ? (
          <div className="h-64 flex items-center justify-center text-white/20 font-bold uppercase tracking-widest text-xs">
            Scanning Inventory...
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div 
              key={activeCategory || "all"}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </motion.div>
          </AnimatePresence>
        )}

        {!loading && !error && products.length === 0 && (
          <div className="text-center py-24 text-white/30 italic">
            Out of stock. More inventory arriving shortly.
          </div>
        )}
      </div>
    </div>
  );
}
