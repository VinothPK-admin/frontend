import { supabase } from "./supabase";

const API_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000").replace(/\/$/, "");

export interface Category {
  id: number;
  name: string;
  slug: string;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  brand: string;
  description: string;
  specs: Record<string, string>;
  price: string;
  image: string;
  is_featured: number;
  category_id: number;
  category?: Category;
}

export async function getProducts(categorySlug?: string, brand?: string): Promise<Product[]> {
  // Try querying Supabase client directly if configured
  if (supabase) {
    try {
      let query = supabase.from("products").select("*, category:categories(*)");
      if (brand) query = query.eq("brand", brand);
      if (categorySlug) {
        const { data: catData } = await supabase.from("categories").select("id").eq("slug", categorySlug).single();
        if (catData) {
          query = query.eq("category_id", catData.id);
        }
      }
      const { data, error } = await query;
      if (!error && data) return data as Product[];
    } catch (err) {
      console.error("Supabase direct query failed, falling back to API:", err);
    }
  }

  // Fallback to FastAPI backend endpoint
  try {
    const url = new URL(`${API_URL}/products`);
    if (categorySlug) url.searchParams.append("category_slug", categorySlug);
    if (brand) url.searchParams.append("brand", brand);
    
    const res = await fetch(url.toString(), { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    return res.json();
  } catch (error) {
    console.error("Fetch error in getProducts:", error);
    return [];
  }
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*, category:categories(*)")
        .eq("slug", slug)
        .single();
      if (!error && data) return data as Product;
    } catch (err) {
      console.error("Supabase direct query failed, falling back to API:", err);
    }
  }

  try {
    const res = await fetch(`${API_URL}/products/${slug}`, { next: { revalidate: 3600 } });
    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    console.error("Fetch error in getProductBySlug:", error);
    return null;
  }
}

export async function getCategories(): Promise<Category[]> {
  if (supabase) {
    try {
      const { data, error } = await supabase.from("categories").select("*");
      if (!error && data) return data as Category[];
    } catch (err) {
      console.error("Supabase direct query failed, falling back to API:", err);
    }
  }

  try {
    const res = await fetch(`${API_URL}/categories`, { next: { revalidate: 86400 } });
    if (!res.ok) return [];
    return res.json();
  } catch (error) {
    console.error("Fetch error in getCategories:", error);
    return [];
  }
}

