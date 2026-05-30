"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Star, Clock, MapPin } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative min-h-[92vh] flex items-center overflow-hidden bg-brand-charcoal">
      {/* Background image with overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=1800&q=80')`,
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-brand-charcoal/95 via-brand-charcoal/75 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-brand-charcoal/60 via-transparent to-transparent" />

      {/* Decorative gold line */}
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-transparent via-brand-gold to-transparent" />

      <div className="relative max-w-7xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 bg-brand-gold/20 border border-brand-gold/40 text-brand-gold px-4 py-1.5 rounded-full text-sm font-medium mb-6"
          >
            <Star size={14} fill="currentColor" />
            Authentic Nepali Cuisine · Dubai
          </motion.div>

          <h1 className="font-heading text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6">
            A Taste of{" "}
            <span className="text-brand-gold relative">
              Nepal
              <svg
                className="absolute -bottom-2 left-0 w-full"
                viewBox="0 0 200 8"
                fill="none"
              >
                <path
                  d="M0 6 Q50 0 100 6 Q150 12 200 6"
                  stroke="#D4A017"
                  strokeWidth="2"
                  fill="none"
                />
              </svg>
            </span>
            <br />
            in the Heart of Dubai
          </h1>

          <p className="text-brand-cream/80 text-lg leading-relaxed mb-8 max-w-lg">
            From hearty Dal Bhat sets to melt-in-your-mouth momos — every dish tells a story
            of our mountains, our culture, and our love for food.
          </p>

          {/* Stats */}
          <div className="flex items-center gap-6 mb-10">
            {[
              { icon: MapPin, label: "4 Branches", sub: "Across Dubai" },
              { icon: Clock, label: "45 min", sub: "Avg. Delivery" },
              { icon: Star, label: "4.8 ★", sub: "Customer Rating" },
            ].map(({ icon: Icon, label, sub }) => (
              <div key={label} className="text-center">
                <p className="text-white font-bold text-lg font-heading">{label}</p>
                <p className="text-brand-cream/50 text-xs">{sub}</p>
              </div>
            ))}
          </div>

          {/* CTAs */}
          <div className="flex flex-wrap gap-4">
            <Link
              href="/menu"
              className="group flex items-center gap-2 bg-brand-red hover:bg-brand-red-dark text-white px-8 py-4 rounded-full font-semibold text-base transition-all duration-300 hover:shadow-lg hover:shadow-brand-red/30"
            >
              Order Now
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/#menu-preview"
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 px-8 py-4 rounded-full font-semibold text-base transition-all duration-300 backdrop-blur-sm"
            >
              View Menu
            </Link>
          </div>
        </motion.div>

        {/* Right side — floating cards */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="hidden md:flex flex-col gap-4 items-end"
        >
          {/* Live order card */}
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 w-64"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-white/80 text-xs font-medium">Live Order</span>
            </div>
            <p className="text-white font-semibold text-sm">Dal Bhat Set (Full)</p>
            <p className="text-brand-cream/60 text-xs mt-1">JLT Branch · 32 min away</p>
            <div className="mt-3 bg-brand-gold/20 rounded-lg px-3 py-1.5 text-brand-gold text-xs font-medium text-center">
              Being Prepared 🍲
            </div>
          </motion.div>

          {/* Popular dish card */}
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="bg-brand-red/90 backdrop-blur-md border border-brand-red-light/30 rounded-2xl p-4 w-56"
          >
            <p className="text-white/70 text-xs mb-1">🔥 Most Ordered</p>
            <p className="text-white font-heading font-bold text-lg">Chicken Momo</p>
            <p className="text-white/80 text-sm mt-1">AED 35</p>
          </motion.div>

          {/* Free delivery card */}
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            className="bg-brand-gold text-brand-charcoal rounded-2xl p-4 w-52 font-semibold text-sm text-center"
          >
            🚀 Free Delivery
            <p className="font-normal text-xs mt-1 text-brand-charcoal/70">on orders above AED 150</p>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-5 h-8 border-2 border-white/30 rounded-full flex items-start justify-center pt-1.5">
          <div className="w-1 h-2 bg-white/50 rounded-full" />
        </div>
      </motion.div>
    </section>
  );
}
