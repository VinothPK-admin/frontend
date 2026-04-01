import Link from "next/link";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#050505] border-t border-white/10 py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div className="flex flex-col space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Explore</h4>
            <Link href="/stories" className="text-sm text-muted hover:text-white transition-colors">Latest Stories</Link>
            <Link href="/featured" className="text-sm text-muted hover:text-white transition-colors">Featured</Link>
            <Link href="/categories" className="text-sm text-muted hover:text-white transition-colors">Categories</Link>
          </div>
          <div className="flex flex-col space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Lumina</h4>
            <Link href="/about" className="text-sm text-muted hover:text-white transition-colors">Our Story</Link>
            <Link href="/craftsmanship" className="text-sm text-muted hover:text-white transition-colors">Craftsmanship</Link>
            <Link href="/careers" className="text-sm text-muted hover:text-white transition-colors">Join Us</Link>
          </div>
          <div className="flex flex-col space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Support</h4>
            <Link href="/contact" className="text-sm text-muted hover:text-white transition-colors">Contact</Link>
            <Link href="/privacy" className="text-sm text-muted hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="text-sm text-muted hover:text-white transition-colors">Terms of Use</Link>
          </div>
          <div className="flex flex-col space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Social</h4>
            <Link href="#" className="text-sm text-muted hover:text-white transition-colors">Instagram</Link>
            <Link href="#" className="text-sm text-muted hover:text-white transition-colors">Twitter</Link>
            <Link href="#" className="text-sm text-muted hover:text-white transition-colors">Vimeo</Link>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center text-xs text-muted">
          <p>© {currentYear} Lumina. Inspired by digital craftsmanship.</p>
          <p className="mt-4 md:mt-0 italic">Designed for the curious mind.</p>
        </div>
      </div>
    </footer>
  );
}
