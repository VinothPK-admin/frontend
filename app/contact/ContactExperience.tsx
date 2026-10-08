"use client";

import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import type { ReactNode } from "react";

export default function ContactExperience({ productName }: { productName?: string }) {
  const enquiryHref = productName
    ? `mailto:sales@pk.com?subject=${encodeURIComponent(`Cycle enquiry: ${productName}`)}&body=${encodeURIComponent(`Hello, I would like to ask about ${productName}. Please confirm the current price and availability.`)}`
    : "mailto:service@pk.com?subject=Service%20booking&body=Hello%2C%20I%27d%20like%20to%20book%20a%20service.%20Please%20contact%20me%20to%20confirm%20a%20time.";

  return (
    <div className="bg-[#050505] pt-40 md:pt-48 pb-32 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <div className="text-[#C5A46E] text-xs font-bold tracking-[0.4em] uppercase mb-8">Connect With Us</div>
          <h1 className="text-5xl md:text-8xl font-extrabold tracking-tighter text-white mb-8">
            {productName ? "CYCLE ENQUIRY" : "REACH OUT"}
          </h1>
          <p className="text-xl text-white/50 max-w-2xl mx-auto font-medium">
            {productName
              ? `Send us an enquiry about ${productName} and the shop will confirm current pricing and availability.`
              : "Whether it is a flat tyre, a broken screen, or your next cycle, we are here to help."}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-center mb-24">
          <ContactCard icon={<MapPin className="w-8 h-8 text-[#C5A46E] mx-auto mb-6" />} title="Visit Shop">
            <a href="https://www.google.com/maps/search/?api=1&query=Main+Market+Road+7+Indian+Cycle+Hub" target="_blank" rel="noreferrer" className="underline-offset-4 hover:text-white hover:underline">Main Market, Road 7<br />Indian Cycle Hub - Get directions</a>
          </ContactCard>
          <ContactCard icon={<Phone className="w-8 h-8 text-[#C5A46E] mx-auto mb-6" />} title="Call Experts">
            <a href="tel:+919876543210" className="hover:text-white">+91 98765 43210</a><br />
            <a href="tel:+911234567890" className="hover:text-white">+91 12345 67890</a>
          </ContactCard>
          <ContactCard icon={<Mail className="w-8 h-8 text-[#C5A46E] mx-auto mb-6" />} title="Email Us">
            <a href="mailto:service@pk.com" className="hover:text-white">service@pk.com</a><br />
            <a href="mailto:sales@pk.com" className="hover:text-white">sales@pk.com</a>
          </ContactCard>
          <ContactCard icon={<Clock className="w-8 h-8 text-[#C5A46E] mx-auto mb-6" />} title="Open Hours">
            Mon - Sat: 9am - 8pm<br />Sun: Closed
          </ContactCard>
        </div>

        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="max-w-3xl mx-auto rounded-3xl bg-white/[0.02] border border-white/5 p-8 md:p-12 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">{productName ? `Enquire about ${productName}` : "Service Booking"}</h2>
          <p className="text-white/50 mb-8">
            {productName
              ? "Ask about this cycle, confirm its availability, or request the latest price."
              : "Send a message about cycle servicing or mobile repairs and we will help schedule your visit."}
          </p>
          <a href={enquiryHref} className="inline-block px-10 py-4 bg-[#C5A46E] text-black rounded-full font-bold hover:scale-105 transition-transform">
            {productName ? "Email this enquiry" : "Request an appointment"}
          </a>
        </motion.div>
      </div>
    </div>
  );
}

function ContactCard({ icon, title, children }: { icon: ReactNode; title: string; children: ReactNode }) {
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="p-7 rounded-3xl bg-white/[0.02] border border-white/5">
      {icon}
      <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
      <div className="text-white/50 text-sm">{children}</div>
    </motion.div>
  );
}
