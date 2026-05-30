"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Priya Sharma",
    location: "JLT, Dubai",
    avatar: "PS",
    color: "bg-brand-red",
    rating: 5,
    text: "The Dal Bhat here tastes exactly like home. I've been ordering every week for 2 years and the quality never drops. Fast delivery too!",
    dish: "Dal Bhat (Full Set)",
  },
  {
    name: "Ahmed Al-Rashid",
    location: "Deira, Dubai",
    avatar: "AA",
    color: "bg-brand-gold",
    rating: 5,
    text: "Tried Nepali food for the first time at Sayapatri — now I'm obsessed with the Sekuwa platter. The spices are incredible. Highly recommend!",
    dish: "Sekuwa Platter",
  },
  {
    name: "Sunita Thapa",
    location: "Karama, Dubai",
    avatar: "ST",
    color: "bg-brand-charcoal",
    rating: 5,
    text: "Best momos in all of Dubai, no debate. The tomato achar is absolutely divine. Reminds me of the momos I had in Thamel, Kathmandu.",
    dish: "Chicken Momo",
  },
  {
    name: "Raj Poudel",
    location: "Marina, Dubai",
    avatar: "RP",
    color: "bg-green-600",
    rating: 5,
    text: "The online ordering system is so smooth. Ordered at 8pm and had hot food at my door in 35 minutes. The tracking feature is a great touch!",
    dish: "Butter Chicken Curry",
  },
  {
    name: "Maria Santos",
    location: "JLT, Dubai",
    avatar: "MS",
    color: "bg-purple-600",
    rating: 5,
    text: "My coworkers introduced me to Sayapatri and now our whole office orders from here every Friday. The thali sets are perfect for group orders.",
    dish: "Dal Bhat (Full Set)",
  },
  {
    name: "Bikash Karki",
    location: "Deira, Dubai",
    avatar: "BK",
    color: "bg-orange-600",
    rating: 5,
    text: "Amazing that they have Nepali food in Dubai that actually tastes authentic. The Gundruk soup took me straight back to my grandmother's kitchen.",
    dish: "Gundruk Soup",
  },
];

export default function Testimonials() {
  return (
    <section className="py-20 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <p className="text-brand-red text-sm font-semibold uppercase tracking-widest mb-2">
            Happy Customers
          </p>
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-brand-charcoal mb-4">
            What People Are Saying
          </h2>
          <div className="flex items-center justify-center gap-1 mb-4">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={20} className="text-brand-gold fill-brand-gold" />
            ))}
            <span className="ml-2 text-brand-brown-light text-sm font-medium">4.8 out of 5 — based on 1,200+ reviews</span>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-brand-cream rounded-2xl p-6 relative hover:shadow-md transition-shadow duration-300"
            >
              {/* Quote icon */}
              <Quote size={32} className="text-brand-red/20 absolute top-4 right-4" />

              {/* Stars */}
              <div className="flex gap-0.5 mb-4">
                {[...Array(t.rating)].map((_, j) => (
                  <Star key={j} size={14} className="text-brand-gold fill-brand-gold" />
                ))}
              </div>

              <p className="text-brand-charcoal/80 text-sm leading-relaxed mb-5 italic">
                &ldquo;{t.text}&rdquo;
              </p>

              {/* Dish tag */}
              <div className="inline-flex items-center gap-1.5 bg-brand-red/10 text-brand-red text-xs font-medium px-3 py-1 rounded-full mb-5">
                🍽️ {t.dish}
              </div>

              {/* Author */}
              <div className="flex items-center gap-3 mt-auto border-t border-brand-cream-dark pt-4">
                <div className={`${t.color} w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0`}>
                  {t.avatar}
                </div>
                <div>
                  <p className="font-semibold text-brand-charcoal text-sm">{t.name}</p>
                  <p className="text-brand-brown-light text-xs">{t.location}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
