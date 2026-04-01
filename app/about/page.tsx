"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";

export default function AboutPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);

  return (
    <div className="bg-[#050505] pt-32">
      <section ref={containerRef} className="px-6 max-w-4xl mx-auto min-h-screen text-center">
        <motion.div style={{ opacity, scale }}>
          <div className="text-[#C5A46E] text-xs font-bold tracking-[0.4em] uppercase mb-8">Our Ethos</div>
          <h1 className="text-6xl md:text-8xl font-extrabold tracking-tighter text-white mb-12 leading-[0.9]">
            PRECISION <br /> IN MOTION.
          </h1>
          <p className="text-xl md:text-3xl text-white/50 font-medium leading-relaxed mb-24">
            At PK Cycle Mart and PK Laptop Service, we believe that whether it&apos;s a high-performance mountain bike or a mobile motherboard, excellence lies in the details. 
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-24 text-left pb-32">
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">PK Cycle Mart</h2>
            <p className="text-white/40 leading-relaxed">
              We started with a passion for wheels. Our shop offers premium Indian and international cycles, genuine spare parts, and master-level servicing. From casual riders to pro athletes, we ensure every rotation is perfect.
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">The Tyre Hub</h2>
            <p className="text-white/40 leading-relaxed">
              Authorized dealers for MRF, CEAT, Apollo, and Ralco. We don&apos;t just sell rubber; we provide safety and performance matched to your vehicle&apos;s DNA.
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">PK Laptop & Mobile Service Center</h2>
            <p className="text-white/40 leading-relaxed">
              Our electronics division handles the most delicate technology. Smartphone repairs, laptop upgrades, and specialized accessories. We bring the same workshop precision to digital gear.
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">Local Mastery</h2>
            <p className="text-white/40 leading-relaxed">
              Serving our community with honesty and expertise. One roof for your mobility and your connectivity.
            </p>
          </div>
        </div>

        <div className="mb-32 rounded-3xl overflow-hidden h-[500px] relative">
          <Image 
            src="/images/stories/apex_spares.png" 
            alt="PK Workshop" 
            fill
            className="object-cover opacity-60"
          />
          <div className="absolute inset-0 flex items-center justify-center p-12">
            <h3 className="text-4xl md:text-6xl font-black text-white text-center tracking-tighter">
              QUALITY IS NOT AN OPTION. <br /> IT&apos;S OUR FOUNDATION.
            </h3>
          </div>
        </div>
      </section>
    </div>
  );
}
