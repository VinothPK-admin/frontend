const API_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000").replace(/\/$/, "");
const SUPABASE_URL = (process.env.NEXT_PUBLIC_SUPABASE_URL || "https://hwppnlaaiosdzmorbtyb.supabase.co").replace(/\/$/, "");
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
export const ADMIN_SESSION_KEY = "pk-cycle-admin-session";

export interface AdminSession {
  access_token: string;
  refresh_token: string;
  expires_at: number;
}

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
  price: string | null;
  price_inr: number | null;
  image: string;
  is_featured: number;
  category_id: number;
  category?: Category;
  cycle_type: string | null;
  wheel_size: string | null;
  availability: "in_stock" | "on_request" | "out_of_stock";
}

export interface ProductFilters {
  q?: string;
  brand?: string;
  cycle_type?: string;
  wheel_size?: string;
  min_price?: string;
  max_price?: string;
  availability?: string;
}

export interface CycleInventoryInput {
  name: string;
  slug?: string;
  brand: string;
  cycle_type: string;
  wheel_size: string | null;
  price_inr: number | null;
  availability: "in_stock" | "on_request" | "out_of_stock";
  image: string;
  description: string;
  specs: Record<string, string>;
}

async function adminRequest<T>(path: string, token: string, init: RequestInit = {}): Promise<T> {
  let response = await sendAdminRequest(path, token, init);
  if (response.status === 401) {
    const refreshed = await refreshAdminSession(true);
    if (refreshed) response = await sendAdminRequest(path, refreshed.access_token, init);
  }
  if (!response.ok) {
    let message = response.status === 401 ? "Your admin session expired. Sign in again." : "The inventory could not be updated.";
    try {
      const body = await response.json() as { detail?: string };
      if (body.detail) message = body.detail;
    } catch { /* Keep the safe fallback message. */ }
    throw new ApiError(message, response.status);
  }
  return response.json() as Promise<T>;
}

async function sendAdminRequest(path: string, token: string, init: RequestInit): Promise<Response> {
  try {
    const headers = new Headers(init.headers);
    headers.set("Accept", "application/json");
    headers.set("Content-Type", "application/json");
    headers.set("Authorization", `Bearer ${token}`);
    return await fetch(`${API_URL}${path}`, { ...init, headers });
  } catch {
    throw new ApiError("The admin service is unavailable. Please try again.");
  }
}

function requireSupabaseConfig() {
  if (!SUPABASE_ANON_KEY) throw new ApiError("Supabase Auth is not configured. Set NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.");
}

function readAdminSession(): AdminSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(ADMIN_SESSION_KEY);
    if (!raw) return null;
    const session = JSON.parse(raw) as AdminSession;
    return session.access_token && session.refresh_token && Number.isFinite(session.expires_at) ? session : null;
  } catch {
    return null;
  }
}

function storeAdminSession(session: AdminSession) {
  window.sessionStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(session));
}

function toAdminSession(value: { access_token: string; refresh_token: string; expires_in: number; expires_at?: number }): AdminSession {
  return {
    access_token: value.access_token,
    refresh_token: value.refresh_token,
    expires_at: value.expires_at || Math.floor(Date.now() / 1000) + value.expires_in,
  };
}

async function refreshAdminSession(force = false): Promise<AdminSession | null> {
  const current = readAdminSession();
  if (!current) return null;
  if (!force && current.expires_at > Math.floor(Date.now() / 1000) + 60) return current;
  requireSupabaseConfig();
  let response: Response;
  try {
    response = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=refresh_token`, {
      method: "POST",
      headers: { apikey: SUPABASE_ANON_KEY, "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token: current.refresh_token }),
    });
  } catch {
    throw new ApiError("Supabase Auth is temporarily unavailable.");
  }
  if (!response.ok) {
    window.sessionStorage.removeItem(ADMIN_SESSION_KEY);
    return null;
  }
  const refreshed = toAdminSession(await response.json());
  storeAdminSession(refreshed);
  return refreshed;
}

export async function getAdminAccessToken(): Promise<string | null> {
  return (await refreshAdminSession())?.access_token || null;
}

export async function adminLogin(email: string, password: string): Promise<AdminSession> {
  requireSupabaseConfig();
  let response: Response;
  try {
    response = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
      method: "POST",
      headers: { Accept: "application/json", "Content-Type": "application/json", apikey: SUPABASE_ANON_KEY },
      body: JSON.stringify({ email, password }),
    });
  } catch {
    throw new ApiError("Supabase Auth is temporarily unavailable.");
  }
  if (!response.ok) {
    let message = "Unable to sign in with Supabase Auth.";
    try {
      const body = await response.json() as { detail?: string; msg?: string; message?: string };
      if (body.detail || body.msg || body.message) message = body.detail || body.msg || body.message || message;
    } catch { /* Keep the safe fallback message. */ }
    throw new ApiError(message, response.status);
  }
  return toAdminSession(await response.json());
}

export async function adminLogout() {
  const session = readAdminSession();
  window.sessionStorage.removeItem(ADMIN_SESSION_KEY);
  if (!session || !SUPABASE_ANON_KEY) return;
  try {
    await fetch(`${SUPABASE_URL}/auth/v1/logout`, {
      method: "POST",
      headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${session.access_token}` },
    });
  } catch { /* Local sign-out is complete even if the network is offline. */ }
}

export function getAdminCycles(token: string): Promise<Product[]> {
  return adminRequest<Product[]>("/admin/cycles", token);
}

export function createAdminCycle(token: string, product: CycleInventoryInput): Promise<Product> {
  return adminRequest<Product>("/admin/cycles", token, { method: "POST", body: JSON.stringify(product) });
}

export function updateAdminCycle(token: string, id: number, product: CycleInventoryInput): Promise<Product> {
  return adminRequest<Product>(`/admin/cycles/${id}`, token, { method: "PUT", body: JSON.stringify(product) });
}

export function updateAdminCycleAvailability(token: string, id: number, availability: CycleInventoryInput["availability"]): Promise<Product> {
  return adminRequest<Product>(`/admin/cycles/${id}/availability`, token, { method: "PATCH", body: JSON.stringify({ availability }) });
}

export async function getProducts(categorySlug?: string, brand?: string, filters: ProductFilters = {}): Promise<Product[]> {
  const url = new URL(`${API_URL}/products`);
  if (categorySlug) url.searchParams.set("category_slug", categorySlug);
  if (brand) url.searchParams.set("brand", brand);
  for (const [key, value] of Object.entries(filters)) {
    if (value) url.searchParams.set(key, value);
  }
  return request<Product[]>(`${url.pathname}${url.search}`, { next: { revalidate: 60 } });
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    return await request<Product>(`/products/${encodeURIComponent(slug)}`, { next: { revalidate: 60 } });
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return null;
    throw error;
  }
}

export async function getCategories(): Promise<Category[]> {
  return request<Category[]>("/categories", { next: { revalidate: 86400 } });
}
