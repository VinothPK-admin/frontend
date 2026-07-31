"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import Link from "next/link";
import { Compass, ShieldCheck, Zap, Wrench, ArrowRight } from "lucide-react";

const Canvas3D = dynamic(() => import("@/components/Canvas3D"), { ssr: false });
const ScrollableCycle3D = dynamic(
  () => import("@/components/Models/ScrollableCycle3D").then((mod) => mod.ScrollableCycle3D),
  { ssr: false }
);

interface StoryChapter {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  description: string;
  icon: typeof Compass;
  specs: string[];
  highlight: string;
}

const CHAPTERS: StoryChapter[] = [
  {
    id: "chapter-1",
    number: "01",
    title: "AERODYNAMIC CARBON ARCHITECTURE",
    subtitle: "Engineered for Extreme Velocity",
    description:
      "Crafted with precision-molded carbon fiber monocoque frames. Every angle is aerodynamically tuned for effortless power transfer and unmatched stability on Indian roads.",
    icon: Compass,
    specs: ["1.2 kg Ultra-Light Frame", "Internal Cable Routing", "Toray T1000 Carbon Fiber"],
    highlight: "FRAME ENGINEERING",
  },
  {
    id: "chapter-2",
    number: "02",
    title: "MAXIMUM ALL-WEATHER TRACTION",
    subtitle: "MRF & CEAT Performance Tyres",
    description:
      "Equipped with high-performance radial tyres and tubeless-ready aerospace alloy rims. Superior grip on wet asphalt, gravel, and high-speed cornering.",
    icon: Zap,
    specs: ["Tubeless-Ready Rims", "Dual-Compound Rubber", "Puncture-Resistant Belt"],
    highlight: "WHEELSET & GRIP",
  },
  {
    id: "chapter-3",
    number: "03",
    title: "PRECISION ELECTRONIC DRIVETRAIN",
    subtitle: "Shimano 12-Speed Wireless Groupset",
    description:
      "Instantaneous, hyper-precise shifting under full pedal torque. Calibrated by PK Master Techs for smooth power delivery across all steep climbs and sprints.",
    icon: ShieldCheck,
    specs: ["12-Speed Wireless Shifting", "Hydraulic Disc Brakes", "Ultra-Quiet Ceramic Pulley"],
    highlight: "DRIVETRAIN",
  },
  {
    id: "chapter-4",
    number: "04",
    title: "TOTAL TECH & SERVICE MASTERY",
    subtitle: "PK Master Service Center Backing",
    description:
      "Every PK cycle comes with total lifetime support, laser alignment, and full integration with our PK Laptop & Mobile Service Center.",
    icon: Wrench,
    specs: ["180-Day Service Guarantee", "Laser Frame Calibration", "PK Master Tech Certified"],
    highlight: "SERVICE INTEGRATION",
  },
];

export function CycleStoryScroll() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (latest) => {
      setScrollProgress(latest);

      // Determine active chapter index based on scroll percentage (0 to 1)
      const index = Math.min(
        CHAPTERS.length - 1,
        Math.floor(latest * CHAPTERS.length)
      );
      setActiveChapterIndex(index);
    });

    return () => unsubscribe();
  }, [scrollYProgress]);

  // Motion transforms for visual depth
  const modelY = useTransform(scrollYProgress, [0, 1], [0, 40]);
  const bgOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 0.95, 0.8]);

  const activeChapter = CHAPTERS[activeChapterIndex];
  const IconComponent = activeChapter.icon;

  return (
    <section ref={containerRef} className="relative h-[400vh] bg-[#050505] text-white">
      {/* Sticky Fullscreen Container */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">
        {/* Ambient Radial Background */}
        <motion.div
          style={{ opacity: bgOpacity }}
          className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#C5A46E]/15 via-black/90 to-[#050505]"
        />

        {/* Story Progress HUD Line on Right Side */}
        <div className="absolute right-8 top-1/2 -translate-y-1/2 z-30 hidden md:flex flex-col items-center gap-6">
          <div className="text-[10px] font-mono tracking-widest text-[#C5A46E] uppercase rotate-90 mb-4 origin-center">
            STORY PROGRESS
          </div>
          <div className="w-[2px] h-48 bg-white/10 relative rounded-full overflow-hidden">
            <motion.div
              className="absolute top-0 left-0 w-full bg-[#C5A46E] rounded-full"
              style={{ height: `${scrollProgress * 100}%` }}
            />
          </div>
          <div className="flex flex-col gap-3">
            {CHAPTERS.map((ch, idx) => (
              <button
                key={ch.id}
                onClick={() => {
                  if (containerRef.current) {
                    const targetY =
                      containerRef.current.offsetTop +
                      (idx / (CHAPTERS.length - 1)) *
                        (containerRef.current.offsetHeight - window.innerHeight);
                    window.scrollTo({ top: targetY, behavior: "smooth" });
                  }
                }}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  idx === activeChapterIndex
                    ? "bg-[#C5A46E] scale-125 shadow-[0_0_12px_rgba(197,164,110,0.8)]"
                    : "bg-white/20 hover:bg-white/50"
                }`}
                aria-label={`Jump to ${ch.title}`}
              />
            ))}
          </div>
        </div>

        {/* 3D Cycle Canvas (Center Stage) */}
        <motion.div
          style={{ y: modelY }}
          className="absolute inset-0 z-10 flex items-center justify-center pointer-events-auto"
        >
          <div className="w-full h-full max-w-6xl mx-auto px-4">
            <Canvas3D autoRotate={false}>
              <ScrollableCycle3D progress={scrollProgress} />
            </Canvas3D>
          </div>
        </motion.div>

        {/* Storytelling Floating Card Overlay (Bottom Left) */}
        <div className="absolute left-6 md:left-16 bottom-12 z-30 max-w-xl w-full pr-6 md:pr-0 pointer-events-none">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeChapter.id}
              initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -30, filter: "blur(8px)" }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="pointer-events-auto p-8 rounded-3xl bg-black/60 border border-white/10 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.8)]"
            >
              {/* Category Pill */}
              <div className="flex items-center gap-3 mb-4">
                <span className="p-2 rounded-xl bg-[#C5A46E]/20 text-[#C5A46E]">
                  <IconComponent className="w-4 h-4" />
                </span>
                <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#C5A46E]">
                  CHAPTER {activeChapter.number} // {activeChapter.highlight}
                </span>
              </div>

              {/* Title & Subtitle */}
              <h2 className="text-2xl md:text-4xl font-extrabold tracking-tight text-white mb-2 leading-tight">
                {activeChapter.title}
              </h2>
              <p className="text-sm font-semibold text-[#C5A46E] mb-4">
                {activeChapter.subtitle}
              </p>

              {/* Description */}
              <p className="text-sm text-white/70 leading-relaxed font-normal mb-6">
                {activeChapter.description}
              </p>

              {/* Specs Pills */}
              <div className="flex flex-wrap gap-2 mb-6">
                {activeChapter.specs.map((spec, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 text-xs font-medium bg-white/5 border border-white/10 rounded-full text-white/80"
                  >
                    {spec}
                  </span>
                ))}
              </div>

              {/* Interactive Action Links */}
              <div className="flex items-center gap-4 pt-2 border-t border-white/10">
                <Link
                  href="/products?category=cycles"
                  className="px-6 py-3 bg-[#C5A46E] text-black font-bold text-xs rounded-full hover:bg-[#d5b57e] transition-all flex items-center gap-2"
                >
                  Explore PK Cycles
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <Link
                  href="/contact"
                  className="px-6 py-3 bg-transparent border border-white/20 text-white font-bold text-xs rounded-full hover:bg-white/10 transition-all"
                >
                  Book Service
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Floating Top Badge */}
        <div className="absolute top-12 left-6 md:left-16 z-30 pointer-events-none">
          <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
            <div className="w-2 h-2 rounded-full bg-[#C5A46E] animate-pulse" />
            <span className="text-xs font-bold tracking-widest text-white/80 uppercase">
              PK MART STORY EXPERIENCE // SCROLL TO DISCOVER
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
