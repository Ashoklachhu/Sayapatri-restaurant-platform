"use client";

import { motion } from "framer-motion";
import { MapPin, Clock, Phone, ArrowRight } from "lucide-react";
import Link from "next/link";

const branches = [
  {
    name: "JLT",
    fullName: "Jumeirah Lake Towers",
    address: "Cluster X, JLT, Dubai",
    phone: "+971 50 000 0001",
    hours: "10:00 AM – 11:00 PM",
    delivery: "30–45 min",
    color: "bg-brand-red",
    emoji: "🏙️",
  },
  {
    name: "Deira",
    fullName: "Al Rigga, Deira",
    address: "Al Rigga Street, Deira, Dubai",
    phone: "+971 50 000 0002",
    hours: "10:00 AM – 11:00 PM",
    delivery: "35–50 min",
    color: "bg-brand-brown",
    emoji: "🌆",
  },
  {
    name: "Marina",
    fullName: "Dubai Marina",
    address: "Marina Walk, Dubai Marina",
    phone: "+971 50 000 0003",
    hours: "10:00 AM – 12:00 AM",
    delivery: "30–45 min",
    color: "bg-brand-gold",
    emoji: "⛵",
  },
  {
    name: "Karama",
    fullName: "Karama",
    address: "Karama Shopping Complex, Dubai",
    phone: "+971 50 000 0004",
    hours: "10:00 AM – 11:00 PM",
    delivery: "25–40 min",
    color: "bg-brand-charcoal-light",
    emoji: "🏪",
  },
];

export default function BranchesSection() {
  return (
    <section id="branches" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <p className="text-brand-red text-sm font-semibold uppercase tracking-widest mb-2">
            Find Us
          </p>
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-brand-charcoal mb-4">
            4 Branches Across Dubai
          </h2>
          <p className="text-brand-brown-light max-w-lg mx-auto">
            We are never too far away. Pick your nearest branch and order in minutes.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {branches.map((branch, i) => (
            <motion.div
              key={branch.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group border border-brand-cream-dark rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300"
            >
              {/* Color header */}
              <div className={`${branch.color} p-6 text-center`}>
                <span className="text-4xl">{branch.emoji}</span>
                <h3 className="font-heading text-white font-bold text-xl mt-2">{branch.name}</h3>
                <p className="text-white/70 text-xs mt-1">{branch.fullName}</p>
              </div>

              {/* Info */}
              <div className="p-5 space-y-3">
                <div className="flex items-start gap-2 text-sm text-brand-charcoal">
                  <MapPin size={14} className="text-brand-red mt-0.5 shrink-0" />
                  <span>{branch.address}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-brand-charcoal">
                  <Phone size={14} className="text-brand-red shrink-0" />
                  <span>{branch.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-brand-charcoal">
                  <Clock size={14} className="text-brand-red shrink-0" />
                  <span>{branch.hours}</span>
                </div>
                <div className="bg-brand-cream rounded-lg px-3 py-2 text-xs text-brand-brown font-medium text-center">
                  🚴 Delivery in {branch.delivery}
                </div>

                <Link
                  href={`/menu?branch=${branch.name.toLowerCase()}`}
                  className="flex items-center justify-center gap-1 w-full bg-brand-red text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-brand-red-dark transition-colors mt-2"
                >
                  Order from {branch.name} <ArrowRight size={14} />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
