import Link from "next/link";

export default function NotFound() {
  return (
    <section className="min-h-[70vh] px-6 pt-40 pb-24 flex items-center justify-center text-center">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.35em] text-[#C5A46E] mb-5">404 - Not found</p>
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-5">That page has moved.</h1>
        <p className="text-white/50 mb-8">Try the catalog to find what you need.</p>
        <Link href="/products" className="inline-block rounded-full bg-white px-6 py-3 font-bold text-black">Browse inventory</Link>
      </div>
    </section>
  );
}
