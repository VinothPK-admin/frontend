const API_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000").replace(/\/$/, "");

export class ApiError extends Error {
  constructor(message: string, public readonly status?: number) {
    super(message);
    this.name = "ApiError";
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${API_URL}${path}`, init);
  } catch {
    throw new ApiError("The store is temporarily unreachable. Please try again shortly.");
  }
  if (!response.ok) {
    if (response.status === 404) throw new ApiError("The requested item could not be found.", 404);
    throw new ApiError("We could not load the store data. Please try again.", response.status);
  }
  return response.json() as Promise<T>;
}

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
  if (categorySlug) url.searchParams.set("category_slug", categorySlug);
  if (brand) url.searchParams.set("brand", brand);
  return request<Product[]>(`${url.pathname}${url.search}`, { next: { revalidate: 3600 } });
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    return await request<Product>(`/products/${encodeURIComponent(slug)}`, { next: { revalidate: 3600 } });
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return null;
    throw error;
  }
}

export async function getCategories(): Promise<Category[]> {
  return request<Category[]>("/categories", { next: { revalidate: 86400 } });
}
