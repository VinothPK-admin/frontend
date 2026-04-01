import { getProducts } from "@/lib/api";
import { Hero } from "@/components/sections/Hero";
import { Featured } from "@/components/sections/Featured";
import { BrandShowcase } from "@/components/BrandShowcase";
import Link from "next/link";
import Image from "next/image";
import CycleHero from "@/components/Visuals/CycleHero";
import LaptopTech from "@/components/Visuals/LaptopTech";

export const dynamic = 'force-dynamic';

export default async function Home() {
  const products = await getProducts();
  const featuredProducts = products.filter(p => p.is_featured === 1);

  return (
    <div className="bg-[#050505]">
      <Hero />
      
      <BrandShowcase />

      <Featured products={featuredProducts.slice(0, 3)} />

      {/* Split categories section */}
      <section className="py-32 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Cycle Dept */}
          <div className="group relative h-[600px] rounded-3xl overflow-hidden">
            <Image 
              src="/images/stories/apex_cycle.png" 
              alt="Cycle Studio" 
              fill
              className="absolute inset-0 object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent z-10" />
            <div className="absolute inset-0 z-0">
               <CycleHero autoRotate={false} />
            </div>
            <div className="absolute bottom-12 left-12 right-12">
              <h3 className="text-4xl font-bold text-white mb-4">PK Cycle Mart</h3>
              <p className="text-white/60 mb-8 max-w-md font-medium">Precision-built cycles and expert spares at PK Mart.</p>
              <Link href="/products?category=cycles" className="px-6 py-3 bg-white text-black rounded-full font-bold text-sm inline-block">
                Enter Store
              </Link>
            </div>
          </div>

          {/* Tech Dept */}
          <div className="group relative h-[600px] rounded-3xl overflow-hidden">
            <Image 
              src="/images/stories/apex_tech.png" 
              alt="Tech Lab" 
              fill
              className="absolute inset-0 object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent z-10" />
            <div className="absolute inset-0 z-0">
               <LaptopTech autoRotate={false} />
            </div>
            <div className="absolute bottom-12 left-12 right-12">
              <h3 className="text-4xl font-bold text-white mb-4">PK Laptop & Mobile Service</h3>
              <p className="text-white/60 mb-8 max-w-md font-medium">Expert repairs and accessories at the PK Tech Center.</p>
              <Link href="/products?category=tech" className="px-6 py-3 bg-[#C5A46E] text-black rounded-full font-bold text-sm inline-block">
                Visit Center
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Service Highlight */}
      <section className="py-32 px-6 bg-[#121212] text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-7xl font-extrabold tracking-tighter mb-8 text-white leading-tight">
            ENGINEERED FOR THE ROAD, <br /> OPTIMIZED FOR THE DESK.
          </h2>
          <p className="text-xl text-white/40 mb-12 font-medium">
            At PK Cycle Mart and Service Center, we bring the same level of precision and craftsmanship to your vehicle as we do to your gadgets. Experience PK excellence today.
          </p>
          <Link href="/contact" className="px-10 py-5 bg-white text-black rounded-full font-bold text-lg hover:bg-white/90 transition-all inline-block">
            Book Appointment
          </Link>
        </div>
      </section>
    </div>
  );
}
