const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

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
  const url = new URL(`${API_URL}/products`);
  if (categorySlug) url.searchParams.append("category_slug", categorySlug);
  if (brand) url.searchParams.append("brand", brand);
  
  const res = await fetch(url.toString(), { next: { revalidate: 3600 } });
  if (!res.ok) return [];
  return res.json();
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const res = await fetch(`${API_URL}/products/${slug}`, { next: { revalidate: 3600 } });
  if (!res.ok) return null;
  return res.json();
}

export async function getCategories(): Promise<Category[]> {
  const res = await fetch(`${API_URL}/categories`, { next: { revalidate: 86400 } });
  if (!res.ok) return [];
  return res.json();
}
