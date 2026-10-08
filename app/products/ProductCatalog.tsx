"use client";

import { useEffect, useMemo, useState } from "react";
import { Product, Category, ProductFilters, getProducts, getCategories } from "@/lib/api";
import { ProductCard } from "@/components/ProductCard";
import { CategoryFilter } from "@/components/CategoryFilter";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const cycleFilterKeys = ["q", "cycle_type", "brand", "wheel_size", "min_price", "max_price", "availability"] as const;
const defaultCycleFilters: ProductFilters = { availability: "available" };

function filtersFromParams(params: URLSearchParams): ProductFilters {
  return Object.fromEntries(cycleFilterKeys.flatMap((key) => {
    const value = params.get(key);
    return value ? [[key, value]] : [];
  })) as ProductFilters;
}

export function ProductCatalog({ cycleOnly = false }: { cycleOnly?: boolean }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const initialCategory = searchParams.get("category");
  const [products, setProducts] = useState<Product[]>([]);
  const [facetProducts, setFacetProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategory, setActiveCategory] = useState<string | null>(cycleOnly ? "cycles" : initialCategory);
  const [filters, setFilters] = useState<ProductFilters>(() => ({
    ...defaultCycleFilters,
    ...filtersFromParams(new URLSearchParams(searchParams.toString())),
  }));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const invalidPriceRange = cycleOnly && Boolean(filters.min_price && filters.max_price && Number(filters.min_price) > Number(filters.max_price));

  useEffect(() => {
    if (cycleOnly) {
      setFilters({ ...defaultCycleFilters, ...filtersFromParams(new URLSearchParams(searchParams.toString())) });
      return;
    }
    setActiveCategory(searchParams.get("category"));
  }, [searchParams, cycleOnly]);

  function changeCategory(slug: string | null) {
    setActiveCategory(slug);
    const params = new URLSearchParams(searchParams.toString());
    if (slug) params.set("category", slug);
    else params.delete("category");
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }

  function changeCycleFilter(key: keyof ProductFilters, value: string) {
    const next = { ...filters, [key]: value };
    setFilters(next);
    const params = new URLSearchParams(searchParams.toString());
    for (const filterKey of cycleFilterKeys) {
      const filterValue = next[filterKey];
      const isDefault = filterKey === "availability" && filterValue === "available";
      if (filterValue && !isDefault) params.set(filterKey, filterValue);
      else params.delete(filterKey);
    }
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }

  function clearCycleFilters() {
    setFilters(defaultCycleFilters);
    router.replace(pathname, { scroll: false });
  }

  useEffect(() => {
    let cancelled = false;
    async function fetchData() {
      setLoading(true);
      setError(null);
      if (cycleOnly && filters.min_price && filters.max_price && Number(filters.min_price) > Number(filters.max_price)) {
        if (!cancelled) {
          setProducts([]);
          setLoading(false);
        }
        return;
      }
      try {
        if (cycleOnly) {
          const [fetchedProducts, allCycleProducts] = await Promise.all([
            getProducts("cycles", undefined, filters),
            getProducts("cycles", undefined, { availability: "available" }),
          ]);
          if (!cancelled) {
            setProducts(fetchedProducts);
            setFacetProducts(allCycleProducts);
          }
        } else {
          const [fetchedProducts, fetchedCategories] = await Promise.all([
            getProducts(activeCategory || undefined), getCategories(),
          ]);
          if (!cancelled) {
            setProducts(fetchedProducts);
            setCategories(fetchedCategories);
          }
        }
      } catch (cause) {
        if (!cancelled) setError(cause instanceof Error ? cause.message : "Unable to load the catalog.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchData();
    return () => { cancelled = true; };
  }, [activeCategory, cycleOnly, filters, retryCount]);

  const options = useMemo(() => ({
    types: [...new Set(facetProducts.map((product) => product.cycle_type).filter((value): value is string => Boolean(value)))].sort(),
    brands: [...new Set(facetProducts.map((product) => product.brand).filter(Boolean))].sort(),
    wheels: [...new Set(facetProducts.map((product) => product.wheel_size).filter((value): value is string => Boolean(value)))].sort(),
  }), [facetProducts]);

  return (
    <div className="bg-[#050505] min-h-screen pt-32 pb-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="text-[#C5A46E] text-xs font-bold tracking-[0.4em] uppercase mb-6">
            {cycleOnly ? "PK Cycle Mart" : "Expertise & Inventory"}
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter text-white mb-6">
            {cycleOnly ? "Find Your Cycle" : "The Apex Catalog"}
          </h1>
          <p className="text-xl text-white/50 max-w-2xl mx-auto font-medium">
            {cycleOnly
              ? "Explore the cycles currently listed by our shop. Filter by the details that matter for your ride."
              : "Explore our curated selection of premium cycles, high-performance tyres, and expert technology services."}
          </p>
        </div>

        {!cycleOnly && <CategoryFilter categories={categories} activeSlug={activeCategory} onCategoryChange={changeCategory} />}

        {cycleOnly && (
          <section aria-label="Filter cycles" className="mb-12 rounded-3xl border border-white/10 bg-white/[0.03] p-5 md:p-7">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <label className="sm:col-span-2 text-sm text-white/60">
                Search cycles
                <input value={filters.q || ""} onChange={(event) => changeCycleFilter("q", event.target.value)} placeholder="Name, brand, or cycle type" className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white placeholder:text-white/30" />
              </label>
              <FilterSelect label="Cycle type" value={filters.cycle_type || ""} onChange={(value) => changeCycleFilter("cycle_type", value)} options={options.types} />
              <FilterSelect label="Brand" value={filters.brand || ""} onChange={(value) => changeCycleFilter("brand", value)} options={options.brands} />
              <FilterSelect label="Wheel size" value={filters.wheel_size || ""} onChange={(value) => changeCycleFilter("wheel_size", value)} options={options.wheels} />
              <FilterSelect label="Availability" value={filters.availability || "available"} onChange={(value) => changeCycleFilter("availability", value)} showEmpty={false} options={[
                { value: "available", label: "In stock or on request" },
                { value: "in_stock", label: "In stock" },
                { value: "on_request", label: "On request" },
                { value: "out_of_stock", label: "Out of stock" },
                { value: "all", label: "All availability" },
              ]} />
              <label className="text-sm text-white/60">
                Min price (INR)
                <input type="number" min="0" step="1" inputMode="numeric" value={filters.min_price || ""} onChange={(event) => changeCycleFilter("min_price", event.target.value)} placeholder="No minimum" className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white placeholder:text-white/30" />
              </label>
              <label className="text-sm text-white/60">
                Max price (INR)
                <input type="number" min="0" step="1" inputMode="numeric" value={filters.max_price || ""} onChange={(event) => changeCycleFilter("max_price", event.target.value)} placeholder="No maximum" className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white placeholder:text-white/30" />
              </label>
            </div>
            <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-white/40">Prices are shown in Indian rupees. Ask the shop to confirm current availability.</p>
              <button type="button" onClick={clearCycleFilters} className="text-sm font-bold text-[#C5A46E] hover:text-white">Clear filters</button>
            </div>
          </section>
        )}

        {error ? (
          <div role="alert" className="py-20 text-center">
            <p className="text-white/70 mb-5">{error}</p>
            <button onClick={() => setRetryCount((count) => count + 1)} className="rounded-full bg-white px-6 py-3 text-sm font-bold text-black">Try again</button>
          </div>
        ) : loading ? (
          <div className="h-64 flex items-center justify-center text-white/40 font-bold uppercase tracking-widest text-xs" role="status">
            Loading {cycleOnly ? "cycles" : "inventory"}...
          </div>
        ) : products.length > 0 ? (
          <AnimatePresence mode="wait">
            <motion.div key={`${activeCategory || "all"}-${JSON.stringify(filters)}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product) => <ProductCard key={product.id} product={product} />)}
            </motion.div>
          </AnimatePresence>
        ) : (
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] py-20 px-6 text-center">
            <h2 className="text-2xl font-bold text-white mb-3">
              {!cycleOnly ? "No products found" : invalidPriceRange ? "Check the price range" : facetProducts.length === 0 ? "Cycle inventory is being added" : "No cycles match those filters"}
            </h2>
            <p className="mx-auto max-w-xl text-white/50">
              {!cycleOnly
                ? "Try another category or return to the full catalog."
                : invalidPriceRange
                ? "The minimum price must be less than or equal to the maximum price."
                : facetProducts.length === 0
                ? "Our live cycle listings will appear here once the shop inventory is imported. Contact the shop for current availability."
                : "Try clearing a filter or contact the shop to ask about a cycle."}
            </p>
            <div className="mt-6 flex justify-center gap-3">
              {cycleOnly && <button onClick={clearCycleFilters} className="rounded-full border border-white/20 px-5 py-3 font-bold text-white">Clear filters</button>}
              <a href="mailto:sales@pk.com?subject=Cycle%20inventory%20enquiry" className="rounded-full bg-[#C5A46E] px-5 py-3 font-bold text-black">Ask the shop</a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
  showEmpty = true,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[] | { value: string; label: string }[];
  showEmpty?: boolean;
}) {
  const normalized = options.map((option) => typeof option === "string" ? { value: option, label: option } : option);
  return (
    <label className="text-sm text-white/60">
      {label}
      <select value={value} onChange={(event) => onChange(event.target.value)} className="mt-2 w-full rounded-xl border border-white/10 bg-[#121212] px-4 py-3 text-white">
        {showEmpty && <option value="">All {label.toLowerCase()}s</option>}
        {normalized.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
      </select>
    </label>
  );
}
