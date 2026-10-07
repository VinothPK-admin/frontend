import Link from "next/link";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#050505] border-t border-white/10 py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div className="flex flex-col space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Explore</h4>
            <Link href="/products" className="text-sm text-muted hover:text-white transition-colors">All inventory</Link>
            <Link href="/products?category=cycles" className="text-sm text-muted hover:text-white transition-colors">Cycles</Link>
            <Link href="/products?category=tech" className="text-sm text-muted hover:text-white transition-colors">Tech</Link>
          </div>
          <div className="flex flex-col space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">PK Multiserve</h4>
            <Link href="/about" className="text-sm text-muted hover:text-white transition-colors">Our story</Link>
            <Link href="/products" className="text-sm text-muted hover:text-white transition-colors">Our services</Link>
            <Link href="/contact" className="text-sm text-muted hover:text-white transition-colors">Visit or contact us</Link>
          </div>
          <div className="flex flex-col space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Support</h4>
            <Link href="/contact" className="text-sm text-muted hover:text-white transition-colors">Contact</Link>
            <a href="mailto:service@pk.com" className="text-sm text-muted hover:text-white transition-colors">Email service</a>
            <a href="tel:+919876543210" className="text-sm text-muted hover:text-white transition-colors">Call the shop</a>
          </div>
          <div className="flex flex-col space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Our stores</h4>
            <span className="text-sm text-muted">PK Cycle Mart</span>
            <span className="text-sm text-muted">PK Laptop &amp; Mobile Service</span>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center text-xs text-muted">
          <p>&copy; {currentYear} PK Cycle Mart &amp; Tech Hub.</p>
          <p className="mt-4 md:mt-0">Cycles, tyres, repairs, and technology.</p>
        </div>
      </div>
    </footer>
  );
}
