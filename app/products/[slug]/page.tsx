import { getProductBySlug, getProducts } from "@/lib/api";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ProductCard } from "@/components/ProductCard";

export const dynamic = 'force-dynamic';

interface ProductPageProps {
  params: { slug: string };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await getProductBySlug(params.slug);
  if (!product) notFound();

  const allProducts = await getProducts(product.category?.slug);
  const relatedProducts = allProducts.filter(p => p.id !== product.id).slice(0, 2);

  return (
    <div className="bg-[#050505] min-h-screen">
      {/* Product Hero */}
      <section className="relative h-[80vh] w-full overflow-hidden">
        <Image 
          src={product.image} 
          alt={product.name}
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/20 to-transparent" />
        
        <div className="absolute bottom-0 left-0 right-0 p-12 max-w-7xl mx-auto z-20">
          <div className="flex items-center space-x-4 mb-6">
            <span className="px-3 py-1 rounded-full bg-[#C5A46E] text-black text-[10px] font-bold uppercase tracking-widest">
              {product.brand}
            </span>
            <span className="text-white/40 text-sm font-medium uppercase tracking-[0.2em]">
              {product.category?.name}
            </span>
          </div>
          <h1 className="text-5xl md:text-8xl font-extrabold tracking-tighter text-white mb-6 leading-[0.9]">
            {product.name}
          </h1>
          <p className="text-2xl text-white/50 font-bold">{product.price}</p>
        </div>
      </section>

      {/* Product Details */}
      <section className="py-24 px-6 max-w-7xl mx-auto border-b border-white/5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-24">
          <div>
            <h2 className="text-3xl font-bold text-white mb-8">The Specification</h2>
            <div className="space-y-6">
              {Object.entries(product.specs).map(([key, value]) => (
                <div key={key} className="flex justify-between items-center py-4 border-b border-white/5">
                  <span className="text-white/40 uppercase text-xs font-bold tracking-widest">{key}</span>
                  <span className="text-white font-medium">{value}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col justify-center">
            <h2 className="text-3xl font-bold text-white mb-8">Performance & Mastery</h2>
            <p className="text-xl text-white/60 leading-relaxed mb-12">
              {product.description}
            </p>
            <Link 
              href="/contact" 
              className="px-10 py-5 bg-white text-black rounded-full font-bold text-center hover:scale-[1.02] transition-transform"
            >
              Inquire Now
            </Link>
          </div>
        </div>
      </section>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="py-24 px-6 max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-12">Related Gear</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {relatedProducts.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* Back Link */}
      <div className="py-24 text-center">
        <Link href="/products" className="text-white/40 hover:text-white transition-colors uppercase text-xs font-bold tracking-[0.4em]">
          Return to Catalog
        </Link>
      </div>
    </div>
  );
}
