import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SmoothScroll } from "@/components/SmoothScroll";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"] });

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "PK Cycle Mart & Tech Hub | Cycles, Tyres & Repairs",
  description: "Shop cycles, tyres, spare parts, and book laptop or mobile repairs with PK Cycle Mart & Tech Hub.",
  keywords: ["pk cycle mart", "pk laptop service", "mobile repair", "cycles", "tech service"],
  authors: [{ name: "PK Team" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-[#050505] text-[#f5f5f7]`}>
        <SmoothScroll>
          <Navbar />
          <main className="min-h-screen">
            {children}
          </main>
          <Footer />
        </SmoothScroll>
      </body>
    </html>
  );
}
