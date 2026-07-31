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
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: "PK Cycle Mart & Laptop Service | Premium Tech & Mobility",
  description: "PK Cycle Mart and PK Laptop and Mobile Service Center. Expert multiserve excellence for your cycles and digital gadgets.",
  keywords: ["pk cycle mart", "pk laptop service", "mobile repair", "cycles", "tech service"],
  authors: [{ name: "PK Team" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark relative">
      <body className={`${inter.className} relative bg-[#050505] text-[#f5f5f7]`}>
        <SmoothScroll>
          <Navbar />
          <main className="relative min-h-screen">
            {children}
          </main>
          <Footer />
        </SmoothScroll>
      </body>
    </html>
  );
}
