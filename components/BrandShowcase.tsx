"use client";



const BRANDS = ["MRF", "CEAT", "APOLLO", "RALCO", "SHIMANO", "TREK", "APPLE"];

export function BrandShowcase() {
  return (
    <section className="py-12 bg-black overflow-hidden whitespace-nowrap border-y border-white/5">
      <div className="inline-block animate-marquee">
        {BRANDS.concat(BRANDS).map((brand, i) => (
          <span 
            key={i} 
            className="inline-block text-3xl md:text-6xl font-black text-white/10 hover:text-[#C5A46E]/40 transition-colors px-12 tracking-tighter"
          >
            {brand}
          </span>
        ))}
      </div>
      
      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          display: inline-block;
          animation: marquee 30s linear infinite;
        }
      `}</style>
    </section>
  );
}
