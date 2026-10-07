"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled ? "glass border-b border-white/10 py-3" : "bg-transparent py-5"
      )}
    >
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold tracking-tighter text-white">
          PK <span className="text-[#C5A46E]">CYCLE MART</span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-white/70">
          <Link href="/products" className="hover:text-white transition-colors">Inventory</Link>
          <Link href="/about" className="hover:text-white transition-colors">Our Ethos</Link>
          <Link href="/contact" className="hover:text-white transition-colors">Service Booking</Link>
          <Link 
            href="/products" 
            className="bg-[#C5A46E] text-black px-4 py-1.5 rounded-full text-xs font-bold hover:bg-[#C5A46E]/90 transition-all"
          >
            Explore Gear
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className="md:hidden text-white"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-navigation"
        >
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div id="mobile-navigation" className="md:hidden glass border-b border-white/10 absolute top-full left-0 right-0 py-6 px-6 flex flex-col space-y-4 animate-in slide-in-from-top duration-300">
          <Link href="/products" className="text-lg" onClick={() => setMobileMenuOpen(false)}>Inventory</Link>
          <Link href="/about" className="text-lg" onClick={() => setMobileMenuOpen(false)}>Our Ethos</Link>
          <Link href="/contact" className="text-lg" onClick={() => setMobileMenuOpen(false)}>Service Booking</Link>
        </div>
      )}
    </nav>
  );
}
