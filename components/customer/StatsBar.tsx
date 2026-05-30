"use client";

import { motion, useInView, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect, useRef } from "react";

const stats = [
  { value: 12400, suffix: "+", label: "Orders Delivered" },
  { value: 4.8, suffix: "★", label: "Average Rating", decimals: 1 },
  { value: 4, suffix: "", label: "Branches in Dubai" },
  { value: 98, suffix: "%", label: "Customer Satisfaction" },
];

function AnimatedNumber({ value, suffix, decimals = 0 }: { value: number; suffix: string; decimals?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const motionValue = useMotionValue(0);
  const rounded = useTransform(motionValue, (v) =>
    decimals > 0 ? v.toFixed(decimals) : Math.floor(v).toLocaleString()
  );

  useEffect(() => {
    if (inView) {
      animate(motionValue, value, { duration: 2, ease: "easeOut" });
    }
  }, [inView, motionValue, value]);

  return (
    <span ref={ref} className="inline-block">
      <motion.span>{rounded}</motion.span>
      {suffix}
    </span>
  );
}

export default function StatsBar() {
  return (
    <section className="bg-brand-red py-14">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <p className="font-heading text-4xl md:text-5xl font-bold text-white mb-2">
                <AnimatedNumber value={stat.value} suffix={stat.suffix} decimals={stat.decimals} />
              </p>
              <p className="text-white/70 text-sm font-medium">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
