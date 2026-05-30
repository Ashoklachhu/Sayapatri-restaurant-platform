"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Flame, Leaf } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import toast from "react-hot-toast";
import type { MenuItem } from "@/types";

// Static featured items — replace with Supabase fetch in production
const FEATURED_ITEMS: MenuItem[] = [
  {
    id: "1",
    category_id: "cat-momos",
    name: "Chicken Momo",
    name_ne: "चिकन मोमो",
    description: "Steamed dumplings filled with spiced minced chicken, served with tomato achar",
    price_aed: 35,
    image_url: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=400&q=80",
    is_vegetarian: false,
    is_vegan: false,
    is_spicy: true,
    spice_level: 2,
    is_featured: true,
    is_available: true,
    sort_order: 1,
    created_at: "",
  },
  {
    id: "2",
    category_id: "cat-dal-bhat",
    name: "Dal Bhat (Full Set)",
    name_ne: "दाल भात",
    description: "The soul of Nepal — lentil soup, steamed rice, seasonal vegetables, pickle & papad",
    price_aed: 55,
    image_url: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&q=80",
    is_vegetarian: true,
    is_vegan: true,
    is_spicy: false,
    is_featured: true,
    is_available: true,
    sort_order: 2,
    created_at: "",
  },
  {
    id: "3",
    category_id: "cat-grills",
    name: "Sekuwa Platter",
    name_ne: "सेकुवा",
    description: "Grilled marinated lamb skewers with Nepali spices, fresh salad & mint chutney",
    price_aed: 75,
    image_url: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&q=80",
    is_vegetarian: false,
    is_vegan: false,
    is_spicy: true,
    spice_level: 1,
    is_featured: true,
    is_available: true,
    sort_order: 3,
    created_at: "",
  },
  {
    id: "4",
    category_id: "cat-curries",
    name: "Butter Chicken Curry",
    name_ne: "बटर चिकन",
    description: "Tender chicken in a rich, creamy tomato-based sauce with aromatic spices",
    price_aed: 48,
    image_url: "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=400&q=80",
    is_vegetarian: false,
    is_vegan: false,
    is_spicy: true,
    spice_level: 1,
    is_featured: true,
    is_available: true,
    sort_order: 4,
    created_at: "",
  },
];

export default function FeaturedMenu() {
  const addItem = useCartStore((s) => s.addItem);

  const handleAdd = (item: MenuItem) => {
    addItem(item, 1);
    toast.success(`${item.name} added to cart!`);
  };

  return (
    <section id="menu-preview" className="py-20 bg-brand-cream">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <p className="text-brand-red text-sm font-semibold uppercase tracking-widest mb-2">
            Our Favourites
          </p>
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-brand-charcoal mb-4">
            Must-Try Dishes
          </h2>
          <p className="text-brand-brown-light max-w-xl mx-auto text-base leading-relaxed">
            Handpicked by our chefs — the dishes that keep our customers coming back again and again.
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {FEATURED_ITEMS.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden bg-brand-cream">
                {item.image_url ? (
                  <Image
                    src={item.image_url}
                    alt={item.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-5xl">🍽️</div>
                )}
                {/* Badges */}
                <div className="absolute top-3 left-3 flex gap-1.5">
                  {item.is_vegetarian && (
                    <span className="bg-green-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Leaf size={9} /> VEG
                    </span>
                  )}
                  {item.is_spicy && (
                    <span className="bg-brand-red text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Flame size={9} />
                      {"🌶".repeat(item.spice_level ?? 1)}
                    </span>
                  )}
                </div>
                {/* Name in Nepali */}
                {item.name_ne && (
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                    <p className="text-white/80 text-xs">{item.name_ne}</p>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="font-heading font-bold text-brand-charcoal text-lg leading-tight mb-1">
                  {item.name}
                </h3>
                <p className="text-brand-brown-light text-xs leading-relaxed mb-4 line-clamp-2">
                  {item.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="font-heading font-bold text-brand-red text-xl">
                    AED {item.price_aed}
                  </span>
                  <button
                    onClick={() => handleAdd(item)}
                    className="w-9 h-9 bg-brand-red text-white rounded-full flex items-center justify-center hover:bg-brand-red-dark transition-colors group-hover:scale-110 duration-200"
                  >
                    <ShoppingCart size={15} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link
            href="/menu"
            className="inline-flex items-center gap-2 border-2 border-brand-red text-brand-red hover:bg-brand-red hover:text-white px-8 py-3 rounded-full font-semibold transition-all duration-300"
          >
            View Full Menu →
          </Link>
        </div>
      </div>
    </section>
  );
}
