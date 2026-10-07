"use client";

import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Clock } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="bg-[#050505] pt-48 pb-32 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-24">
          <div className="text-[#C5A46E] text-xs font-bold tracking-[0.4em] uppercase mb-8">Connect With Us</div>
          <h1 className="text-6xl md:text-9xl font-extrabold tracking-tighter text-white mb-8">
            REACH OUT
          </h1>
          <p className="text-xl text-white/40 max-w-2xl mx-auto font-medium">
            Whether it&apos;s a flat tyre, a broken screen, or your next premium cycle—we&apos;re here to help.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 text-center mb-32">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-8 rounded-3xl bg-white/[0.02] border border-white/5"
          >
            <MapPin className="w-8 h-8 text-[#C5A46E] mx-auto mb-6" />
            <h3 className="text-lg font-bold text-white mb-2">Visit Shop</h3>
            <a href="https://www.google.com/maps/search/?api=1&query=Main+Market+Road+7+Indian+Cycle+Hub" target="_blank" rel="noreferrer" className="text-white/50 text-sm underline-offset-4 hover:text-white hover:underline">Main Market, Road 7<br />Indian Cycle Hub · Get directions</a>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="p-8 rounded-3xl bg-white/[0.02] border border-white/5"
          >
            <Phone className="w-8 h-8 text-[#C5A46E] mx-auto mb-6" />
            <h3 className="text-lg font-bold text-white mb-2">Call Experts</h3>
            <p className="text-white/40 text-sm"><a href="tel:+919876543210" className="hover:text-white">+91 98765 43210</a><br /><a href="tel:+911234567890" className="hover:text-white">+91 12345 67890</a></p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="p-8 rounded-3xl bg-white/[0.02] border border-white/5"
          >
            <Mail className="w-8 h-8 text-[#C5A46E] mx-auto mb-6" />
            <h3 className="text-lg font-bold text-white mb-2">Email Us</h3>
            <p className="text-white/40 text-sm"><a href="mailto:service@pk.com" className="hover:text-white">service@pk.com</a><br /><a href="mailto:sales@pk.com" className="hover:text-white">sales@pk.com</a></p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="p-8 rounded-3xl bg-white/[0.02] border border-white/5"
          >
            <Clock className="w-8 h-8 text-[#C5A46E] mx-auto mb-6" />
            <h3 className="text-lg font-bold text-white mb-2">Open Hours</h3>
            <p className="text-white/40 text-sm">Mon - Sat: 9am - 8pm<br />Sun: Closed</p>
          </motion.div>
        </div>

        <div className="max-w-3xl mx-auto rounded-3xl bg-white/[0.02] border border-white/5 p-12 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Service Booking</h2>
          <p className="text-white/50 mb-8">
            Want to skip the queue? Drop a message for cycle servicing or mobile repairs and we&apos;ll schedule your slot.
          </p>
          <a href="mailto:service@pk.com?subject=Service%20booking&body=Hello%2C%20I%27d%20like%20to%20book%20a%20service.%20Please%20contact%20me%20to%20confirm%20a%20time." className="inline-block px-12 py-5 bg-[#C5A46E] text-black rounded-full font-bold hover:scale-105 transition-transform">
            Request an appointment
          </a>
        </div>
      </div>
    </div>
  );
}
