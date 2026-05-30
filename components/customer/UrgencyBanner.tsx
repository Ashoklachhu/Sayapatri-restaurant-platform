"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Clock } from "lucide-react";

export default function UrgencyBanner() {
  return (
    <section className="bg-brand-red py-12">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left"
        >
          <div>
            <p className="text-white/80 text-sm font-medium uppercase tracking-widest mb-1">
              Walk-in? No need to wait!
            </p>
            <h3 className="font-heading text-white text-3xl md:text-4xl font-bold">
              Book Your Table Online
            </h3>
            <p className="text-white/70 mt-2">
              Reserve in 30 seconds. Skip the queue. Your table will be ready when you arrive.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 shrink-0">
            <div className="flex items-center gap-3 bg-white/10 border border-white/20 rounded-2xl px-5 py-3">
              <Clock size={20} className="text-white" />
              <div className="text-left">
                <p className="text-white font-bold text-sm">Average wait</p>
                <p className="text-white/60 text-xs">Walk-in: 20–35 min</p>
                <p className="text-white/60 text-xs">Booked: 0 min ✓</p>
              </div>
            </div>
            <Link
              href="/menu"
              className="bg-white text-brand-red font-bold px-8 py-4 rounded-2xl text-base hover:bg-brand-cream transition-colors whitespace-nowrap"
            >
              Order & Reserve →
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
