"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import CycleHero from "@/components/Visuals/CycleHero";

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const opacity = useTransform(scrollY, [0, 400], [1, 0]);

  return (
    <section 
      ref={containerRef}
      className="relative h-screen flex items-center justify-center overflow-hidden bg-black"
    >
      {/* Background 3D Model */}
      <motion.div 
        style={{ y: y1 }}
        className="absolute inset-0 z-0 flex items-center justify-center pt-20"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-[#050505] z-10 pointer-events-none" />
        <div className="w-full h-full max-w-5xl">
          <CycleHero autoRotate />
        </div>
      </motion.div>

      {/* Hero Content */}
      <motion.div 
        style={{ opacity }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="relative z-20 text-center px-6 max-w-4xl"
      >
        <div className="inline-block px-3 py-1 rounded-full border border-[#C5A46E]/30 bg-[#C5A46E]/10 text-[#C5A46E] text-[10px] font-bold tracking-widest uppercase mb-6">
          PK Cycle Mart & Tech Hub
        </div>
        <h1 className="text-5xl md:text-8xl font-extrabold tracking-tighter mb-6 bg-gradient-to-b from-white to-white/50 bg-clip-text text-transparent leading-[0.9]">
          PK <br /> EXCELLENCE
        </h1>
        <p className="text-xl md:text-2xl text-white/70 mb-10 font-medium leading-relaxed max-w-2xl mx-auto">
          Home of PK Cycle Mart and PK Laptop and Mobile Service Center. India&apos;s premier destination for high-end mobility and tech expertise.
        </p>
        <div className="flex flex-col md:flex-row items-center justify-center gap-4">
          <Link 
            href="/products" 
            className="w-full md:w-auto px-8 py-4 bg-[#C5A46E] text-black rounded-full font-bold hover:scale-105 transition-transform"
          >
            Explore Inventory
          </Link>
          <Link 
            href="/contact" 
            className="w-full md:w-auto px-8 py-4 bg-transparent border border-white/20 text-white rounded-full font-bold hover:bg-white/10 transition-colors"
          >
            Book a Service
          </Link>
        </div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div 
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 text-white/30"
      >
        <div className="w-6 h-10 border-2 border-white/20 rounded-full flex justify-center p-1">
          <div className="w-1 h-2 bg-white/50 rounded-full" />
        </div>
      </motion.div>
    </section>
  );
}
