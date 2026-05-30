"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function StorySection() {
  return (
    <section id="about" className="py-20 bg-brand-charcoal text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
        {/* Images */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="relative"
        >
          <div className="relative h-[400px] rounded-2xl overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800&q=80"
              alt="Sayapatri kitchen"
              fill
              className="object-cover"
            />
          </div>
          {/* Floating quote */}
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="absolute -bottom-6 -right-6 bg-brand-gold text-brand-charcoal rounded-2xl p-5 w-52 shadow-xl"
          >
            <p className="font-heading text-2xl font-bold">Since 2018</p>
            <p className="text-xs mt-1 text-brand-charcoal/70">Serving authentic Nepali flavours in Dubai</p>
          </motion.div>
        </motion.div>

        {/* Text */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <p className="text-brand-gold text-sm font-semibold uppercase tracking-widest mb-3">
            Our Story
          </p>
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
            From the Himalayas <br />to Your Table
          </h2>
          <div className="space-y-4 text-brand-cream/70 leading-relaxed">
            <p>
              Sayapatri was born out of a simple longing — the taste of home. Our founders,
              having moved to Dubai from Kathmandu, wanted to share the warmth of Nepali
              hospitality with their new home.
            </p>
            <p>
              Named after the marigold flower (sayapatri) that adorns every Nepali festival
              and celebration, our restaurants carry that same spirit of joy and togetherness.
            </p>
            <p>
              Every recipe is passed down through generations. Every ingredient is chosen with
              care. Every meal is cooked with the same love as if it were made for family.
            </p>
          </div>

          {/* Values */}
          <div className="grid grid-cols-3 gap-4 mt-8">
            {[
              { emoji: "🌿", label: "Fresh Ingredients" },
              { emoji: "👨‍🍳", label: "Expert Chefs" },
              { emoji: "🏔️", label: "Authentic Recipes" },
            ].map((v) => (
              <div key={v.label} className="text-center p-3 bg-white/5 rounded-xl border border-white/10">
                <span className="text-2xl">{v.emoji}</span>
                <p className="text-xs text-brand-cream/60 mt-2">{v.label}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
