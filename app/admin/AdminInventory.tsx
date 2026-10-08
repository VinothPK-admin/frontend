"use client";

import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { ArrowLeft, Bike, LogOut, Pencil, Plus, RefreshCw, Save, X } from "lucide-react";
import Link from "next/link";
import {
  adminLogin,
  adminLogout,
  ADMIN_SESSION_KEY,
  ApiError,
  createAdminCycle,
  CycleInventoryInput,
  getAdminCycles,
  getAdminAccessToken,
  Product,
  updateAdminCycle,
  updateAdminCycleAvailability,
} from "@/lib/api";

const emptyDraft: CycleDraft = {
  name: "", slug: "", brand: "", cycle_type: "", wheel_size: "", price_inr: "",
  availability: "in_stock", image: "", description: "", specs: "",
};

interface CycleDraft {
  name: string;
  slug: string;
  brand: string;
  cycle_type: string;
  wheel_size: string;
  price_inr: string;
  availability: CycleInventoryInput["availability"];
  image: string;
  description: string;
  specs: string;
}

export default function AdminInventory() {
  const [ready, setReady] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [draft, setDraft] = useState<CycleDraft>(emptyDraft);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    getAdminAccessToken().then(setToken).catch(() => setToken(null)).finally(() => setReady(true));
  }, []);

  useEffect(() => {
    if (!token) return;
    let cancelled = false;
    setLoading(true);
    getAdminCycles(token).then((items) => {
      if (!cancelled) { setProducts(items); setError(null); }
    }).catch((cause: unknown) => {
      if (cancelled) return;
      if (cause instanceof ApiError && cause.status === 401) signOut();
      setError(cause instanceof Error ? cause.message : "Could not load cycle inventory.");
    }).finally(() => {
      if (!cancelled) setLoading(false);
    });
    return () => { cancelled = true; };
  }, [token]);

  function signOut() {
    void adminLogout();
    setToken(null);
    setProducts([]);
    setEditingId(null);
    setDraft(emptyDraft);
  }

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const result = await adminLogin(email, password);
      window.sessionStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(result));
      setPassword("");
      setToken(result.access_token);
      setNotice("Signed in. Inventory changes are saved to the live catalog.");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to sign in.");
    } finally {
      setBusy(false);
    }
  }

  function beginEdit(product: Product) {
    setEditingId(product.id);
    setDraft({
      name: product.name,
      slug: product.slug,
      brand: product.brand,
      cycle_type: product.cycle_type || "",
      wheel_size: product.wheel_size || "",
      price_inr: product.price_inr?.toString() || "",
      availability: product.availability,
      image: product.image,
      description: product.description || "",
      specs: Object.entries(product.specs || {}).map(([key, value]) => `${key}: ${value}`).join("\n"),
    });
    setError(null);
    setNotice(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function resetForm() {
    setEditingId(null);
    setDraft(emptyDraft);
  }

  function parseSpecs(value: string): Record<string, string> {
    const specs: Record<string, string> = {};
    value.split("\n").forEach((line) => {
      const separator = line.indexOf(":");
      if (separator < 1) return;
      const key = line.slice(0, separator).trim();
      const specValue = line.slice(separator + 1).trim();
      if (key && specValue) specs[key] = specValue;
    });
    return specs;
  }

  async function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!token) return;
    const price = draft.price_inr.trim() ? Number(draft.price_inr) : null;
    if (price !== null && (!Number.isInteger(price) || price < 0)) {
      setError("Enter a whole-number price in rupees, or leave it blank.");
      return;
    }
    const payload: CycleInventoryInput = {
      name: draft.name.trim(),
      ...(draft.slug.trim() ? { slug: draft.slug.trim() } : {}),
      brand: draft.brand.trim(),
      cycle_type: draft.cycle_type.trim(),
      wheel_size: draft.wheel_size.trim() || null,
      price_inr: price,
      availability: draft.availability,
      image: draft.image.trim(),
      description: draft.description.trim(),
      specs: parseSpecs(draft.specs),
    };
    setBusy(true);
    setError(null);
    setNotice(null);
    try {
      if (editingId === null) {
        await createAdminCycle(token, payload);
        setNotice("Cycle added to the catalog.");
      } else {
        await updateAdminCycle(token, editingId, payload);
        setNotice("Cycle details updated.");
      }
      resetForm();
      setProducts(await getAdminCycles(token));
    } catch (cause) {
      if (cause instanceof ApiError && cause.status === 401) signOut();
      setError(cause instanceof Error ? cause.message : "Could not save this cycle.");
    } finally {
      setBusy(false);
    }
  }

  async function changeAvailability(product: Product, availability: CycleInventoryInput["availability"]) {
    if (!token) return;
    setBusy(true);
    setError(null);
    setNotice(null);
    try {
      const updated = await updateAdminCycleAvailability(token, product.id, availability);
      setProducts((items) => items.map((item) => item.id === updated.id ? updated : item));
      setNotice(`${product.name} is now ${availability.replace(/_/g, " ")}.`);
    } catch (cause) {
      if (cause instanceof ApiError && cause.status === 401) signOut();
      setError(cause instanceof Error ? cause.message : "Could not update availability.");
    } finally {
      setBusy(false);
    }
  }

  if (!ready) return <main className="min-h-screen bg-[#050505]" />;

  if (!token) {
    return (
      <main className="min-h-screen bg-[#050505] px-6 pt-40 pb-24">
        <section className="mx-auto max-w-md rounded-3xl border border-white/10 bg-white/[0.03] p-8 md:p-10">
          <Link href="/" className="mb-8 inline-flex items-center gap-2 text-sm text-white/50 hover:text-white"><ArrowLeft size={16} /> Storefront</Link>
          <Bike className="mb-5 h-9 w-9 text-[#C5A46E]" />
          <h1 className="mb-3 text-3xl font-bold text-white">Admin sign in</h1>
          <p className="mb-8 text-sm text-white/50">Sign in to manage the cycle products shown in the public shop.</p>
          {error && <p role="alert" className="mb-5 rounded-xl border border-red-400/20 bg-red-400/10 p-3 text-sm text-red-200">{error}</p>}
          <form onSubmit={handleLogin} className="space-y-5">
            <label className="block text-sm text-white/70">Admin email
              <input required type="email" autoComplete="username" value={email} onChange={(event) => setEmail(event.target.value)} className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white" />
            </label>
            <label className="block text-sm text-white/70">Password
              <input required type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white" />
            </label>
            <button disabled={busy} className="w-full rounded-full bg-[#C5A46E] px-5 py-3 font-bold text-black disabled:opacity-50">{busy ? "Signing in..." : "Sign in"}</button>
          </form>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#050505] px-4 pt-32 pb-24 md:px-6">
      <div className="mx-auto max-w-7xl">
        <header className="mb-10 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.35em] text-[#C5A46E]">PK Cycle Mart</p>
            <h1 className="text-4xl font-extrabold tracking-tight text-white md:text-6xl">Cycle inventory</h1>
            <p className="mt-3 text-white/50">Changes here update the public cycle catalog.</p>
          </div>
          <div className="flex gap-3">
            <button onClick={() => token && getAdminCycles(token).then(setProducts).catch((cause: unknown) => setError(cause instanceof Error ? cause.message : "Could not refresh inventory."))} className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-sm font-bold text-white"><RefreshCw size={15} /> Refresh</button>
            <button onClick={signOut} className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-sm font-bold text-white"><LogOut size={15} /> Sign out</button>
          </div>
        </header>

        {(error || notice) && <p role={error ? "alert" : "status"} className={`mb-6 rounded-xl border p-4 text-sm ${error ? "border-red-400/20 bg-red-400/10 text-red-200" : "border-emerald-400/20 bg-emerald-400/10 text-emerald-200"}`}>{error || notice}</p>}

        <section className="mb-12 rounded-3xl border border-white/10 bg-white/[0.03] p-6 md:p-8">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-white">{editingId === null ? "Add a cycle" : "Edit cycle"}</h2>
              <p className="mt-1 text-sm text-white/45">Image paths must point to a file under <code>/images/cycles/</code>.</p>
            </div>
            {editingId !== null && <button onClick={resetForm} className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-white"><X size={16} /> Cancel edit</button>}
          </div>
          <form onSubmit={handleSave} className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <TextField label="Product name" value={draft.name} onChange={(value) => setDraft({ ...draft, name: value })} required />
            <TextField label="Brand" value={draft.brand} onChange={(value) => setDraft({ ...draft, brand: value })} required />
            <TextField label="Cycle type" value={draft.cycle_type} onChange={(value) => setDraft({ ...draft, cycle_type: value })} placeholder="Use the shop's type name" required />
            <TextField label="Wheel size" value={draft.wheel_size} onChange={(value) => setDraft({ ...draft, wheel_size: value })} placeholder="Optional" />
            <TextField label="Price in INR" value={draft.price_inr} onChange={(value) => setDraft({ ...draft, price_inr: value })} placeholder="Blank means ask for price" type="number" min="0" step="1" />
            <TextField label="Product slug" value={draft.slug} onChange={(value) => setDraft({ ...draft, slug: value })} placeholder="Leave blank to generate" />
            <TextField label="Image path" value={draft.image} onChange={(value) => setDraft({ ...draft, image: value })} placeholder="/images/cycles/product.jpg" required />
            <label className="block text-sm text-white/70">Availability
              <select value={draft.availability} onChange={(event) => setDraft({ ...draft, availability: event.target.value as CycleDraft["availability"] })} className="mt-2 w-full rounded-xl border border-white/10 bg-[#121212] px-4 py-3 text-white">
                <option value="in_stock">In stock</option><option value="on_request">On request</option><option value="out_of_stock">Out of stock</option>
              </select>
            </label>
            <label className="block text-sm text-white/70 sm:col-span-2 lg:col-span-3">Description
              <textarea rows={3} value={draft.description} onChange={(event) => setDraft({ ...draft, description: event.target.value })} className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white" />
            </label>
            <label className="block text-sm text-white/70 sm:col-span-2 lg:col-span-3">Specifications <span className="text-white/40">(one “name: value” per line)</span>
              <textarea rows={4} value={draft.specs} onChange={(event) => setDraft({ ...draft, specs: event.target.value })} placeholder={"Frame: Steel\nGears: 7 speed"} className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 font-mono text-sm text-white" />
            </label>
            <div className="sm:col-span-2 lg:col-span-3">
              <button disabled={busy} className="inline-flex items-center gap-2 rounded-full bg-[#C5A46E] px-6 py-3 font-bold text-black disabled:opacity-50">{editingId === null ? <Plus size={17} /> : <Save size={17} />}{busy ? "Saving..." : editingId === null ? "Add cycle" : "Save changes"}</button>
            </div>
          </form>
        </section>

        <section>
          <div className="mb-5 flex items-end justify-between gap-3">
            <div><h2 className="text-2xl font-bold text-white">All cycle listings</h2><p className="mt-1 text-sm text-white/45">{products.length} products, including out-of-stock listings.</p></div>
            {loading && <span role="status" className="text-sm text-white/50">Loading...</span>}
          </div>
          {products.length === 0 && !loading ? (
            <div className="rounded-2xl border border-white/10 p-8 text-center text-white/50">No cycle listings yet. Add the first product above.</div>
          ) : (
            <div className="space-y-3">
              {products.map((product) => (
                <article key={product.id} className="grid grid-cols-1 gap-4 rounded-2xl border border-white/10 bg-white/[0.02] p-4 md:grid-cols-[1fr_auto_auto] md:items-center">
                  <div className="min-w-0">
                    <h3 className="font-bold text-white">{product.name}</h3>
                    <p className="mt-1 text-sm text-white/45">{product.brand} · {product.cycle_type}{product.wheel_size ? ` · ${product.wheel_size} wheel` : ""} · {product.price_inr == null ? "Ask for price" : `₹${new Intl.NumberFormat("en-IN").format(product.price_inr)}`}</p>
                    <p className="mt-1 truncate text-xs text-white/30">{product.slug} · {product.image}</p>
                  </div>
                  <label className="text-xs text-white/50">Availability
                    <select disabled={busy} value={product.availability} onChange={(event) => changeAvailability(product, event.target.value as CycleInventoryInput["availability"])} className="mt-1 block rounded-lg border border-white/10 bg-[#121212] px-3 py-2 text-sm text-white">
                      <option value="in_stock">In stock</option><option value="on_request">On request</option><option value="out_of_stock">Out of stock</option>
                    </select>
                  </label>
                  <button onClick={() => beginEdit(product)} className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 px-4 py-2 text-sm font-bold text-white"><Pencil size={14} /> Edit</button>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

function TextField({
  label, value, onChange, placeholder, required = false, type = "text", min, step,
}: {
  label: string; value: string; onChange: (value: string) => void; placeholder?: string;
  required?: boolean; type?: string; min?: string; step?: string;
}) {
  return (
    <label className="block text-sm text-white/70">{label}
      <input type={type} min={min} step={step} required={required} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white placeholder:text-white/30" />
    </label>
  );
}
