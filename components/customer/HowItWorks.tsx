"use client";

import { motion } from "framer-motion";
import { UtensilsCrossed, ShoppingBag, Bike } from "lucide-react";

const steps = [
  {
    icon: UtensilsCrossed,
    step: "01",
    title: "Browse the Menu",
    description: "Explore our authentic Nepali dishes — from momos to Dal Bhat — and filter by branch, category, or dietary preference.",
    color: "bg-brand-gold",
  },
  {
    icon: ShoppingBag,
    step: "02",
    title: "Place Your Order",
    description: "Add items to your cart, choose delivery or pickup, and check out securely in minutes. No account needed.",
    color: "bg-brand-red",
  },
  {
    icon: Bike,
    step: "03",
    title: "Enjoy Your Meal",
    description: "Track your order in real time. Our riders deliver hot & fresh to your door, typically within 30–45 minutes.",
    color: "bg-brand-charcoal",
  },
];

export default function HowItWorks() {
  return (
    <section className="py-20 bg-brand-cream">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-brand-red text-sm font-semibold uppercase tracking-widest mb-2">
            Simple & Fast
          </p>
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-brand-charcoal mb-4">
            How It Works
          </h2>
          <p className="text-brand-brown-light max-w-lg mx-auto text-base">
            Ordering from Sayapatri is as easy as 1-2-3. Fresh Nepali food, delivered fast.
          </p>
        </motion.div>

        <div className="relative">
          {/* Connecting line */}
          <div className="hidden md:block absolute top-14 left-1/2 -translate-x-1/2 w-[60%] h-0.5 bg-gradient-to-r from-brand-gold via-brand-red to-brand-charcoal" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {steps.map((step, i) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="flex flex-col items-center text-center relative"
              >
                {/* Icon circle */}
                <div className={`${step.color} w-28 h-28 rounded-full flex items-center justify-center mb-6 shadow-lg relative z-10`}>
                  <step.icon size={40} className="text-white" />
                </div>

                {/* Step number */}
                <span className="text-brand-red/20 font-heading font-bold text-7xl absolute -top-4 left-1/2 -translate-x-1/2 select-none">
                  {step.step}
                </span>

                <h3 className="font-heading text-2xl font-bold text-brand-charcoal mb-3">
                  {step.title}
                </h3>
                <p className="text-brand-brown-light text-sm leading-relaxed max-w-xs">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
