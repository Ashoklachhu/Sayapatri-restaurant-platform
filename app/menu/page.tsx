"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { ShoppingCart, Flame, Leaf, Search } from "lucide-react";
import Navbar from "@/components/customer/Navbar";
import Footer from "@/components/customer/Footer";
import CartDrawer from "@/components/customer/CartDrawer";
import { useCartStore } from "@/store/cartStore";
import { formatCurrency } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import toast from "react-hot-toast";
import type { MenuItem, MenuCategory, Branch } from "@/types";



export default function MenuPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [vegOnly, setVegOnly] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [menuLoading, setMenuLoading] = useState(true);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const [orderType, setOrderType] = useState<"delivery" | "pickup" | "dine_in">("delivery");

  const { addItem, totalItems, setBranch, setOrderType: setStoreOrderType } = useCartStore();

  useEffect(() => { setMounted(true); }, []);

  // Fetch menu items and categories from Supabase
  useEffect(() => {
    const supabase = createClient();
    Promise.all([
      supabase.from("menu_items").select("*, category:menu_categories(id,name)").eq("is_available", true).order("sort_order"),
      supabase.from("menu_categories").select("*").eq("is_active", true).order("sort_order"),
    ]).then(([{ data: items }, { data: cats }]) => {
      setMenuItems((items as MenuItem[]) ?? []);
      setCategories((cats as MenuCategory[]) ?? []);
      setMenuLoading(false);
    });
  }, []);

  // Fetch branches from Supabase
  useEffect(() => {
    const supabase = createClient();
    supabase.from("branches").select("*").eq("is_active", true).order("name")
      .then(({ data }) => {
        if (data && data.length > 0) {
          setBranches(data as Branch[]);
          setSelectedBranch(data[0] as Branch);
        }
      });
  }, []);

  useEffect(() => {
    if (selectedBranch) setBranch(selectedBranch);
    setStoreOrderType(orderType);
  }, [selectedBranch, orderType, setBranch, setStoreOrderType]);

  const filtered = menuItems.filter((item) => {
    if (!item.is_available) return false;
    if (activeCategory !== "all" && item.category_id !== activeCategory) return false;
    if (vegOnly && !item.is_vegetarian) return false;
    if (search && !item.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const handleAdd = (item: MenuItem) => {
    addItem(item, 1);
    toast.success(`${item.name} added!`);
    setCartOpen(true);
  };

  const cartCount = totalItems();

  return (
    <>
      <Navbar />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />

      {/* Page header */}
      <div className="bg-brand-charcoal text-white py-12">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-brand-gold text-sm font-semibold uppercase tracking-widest mb-2">Our Menu</p>
          <h1 className="font-heading text-4xl md:text-5xl font-bold mb-6">Order Online</h1>

          {/* Branch + Order type selector */}
          <div className="flex flex-wrap gap-4 items-center">
            {/* Order type toggle */}
            <div className="flex bg-white/10 rounded-xl p-1 gap-1">
              {([
                { key: "delivery", label: "🚴 Delivery" },
                { key: "pickup", label: "🏃 Pickup" },
                { key: "dine_in", label: "🍽️ Dine-in" },
              ] as const).map((type) => (
                <button
                  key={type.key}
                  onClick={() => setOrderType(type.key)}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                    orderType === type.key
                      ? "bg-brand-red text-white"
                      : "text-white/60 hover:text-white"
                  }`}
                >
                  {type.label}
                </button>
              ))}
            </div>

            {/* Branch selector */}
            <select
              value={selectedBranch?.id ?? ""}
              onChange={(e) => {
                const b = branches.find((b) => b.id === e.target.value);
                if (b) setSelectedBranch(b);
              }}
              className="bg-white/10 text-white border border-white/20 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-brand-gold"
            >
              {branches.map((b) => (
                <option key={b.id} value={b.id} className="text-black">
                  📍 {b.location}
                </option>
              ))}
            </select>

            {orderType === "delivery" && selectedBranch && (
              <span className="text-white/60 text-sm">
                ~{selectedBranch.estimated_delivery_minutes} min · AED {selectedBranch.delivery_fee_aed} delivery fee
              </span>
            )}
            {orderType === "dine_in" && (
              <span className="text-white/60 text-sm">
                🍽️ Order from your table · Pay on delivery
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Search + filter bar */}
        <div className="flex flex-wrap gap-3 mb-8 items-center">
          <div className="relative flex-1 min-w-48">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search dishes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand-red"
            />
          </div>
          <button
            onClick={() => setVegOnly(!vegOnly)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all ${
              vegOnly
                ? "bg-green-500 border-green-500 text-white"
                : "border-gray-200 text-gray-600 hover:border-green-500 hover:text-green-600"
            }`}
          >
            <Leaf size={14} />
            Veg Only
          </button>
        </div>

        {/* Category tabs */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-4 mb-8">
          {[{ id: "all", name: "All Items" }, ...categories].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`whitespace-nowrap px-5 py-2 rounded-full text-sm font-semibold transition-all ${
                activeCategory === cat.id
                  ? "bg-brand-charcoal text-white"
                  : "bg-brand-cream text-brand-charcoal hover:bg-brand-cream-dark"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Menu grid */}
        {menuLoading && (
          <div className="flex items-center justify-center h-48">
            <div className="animate-spin w-8 h-8 border-4 border-brand-red border-t-transparent rounded-full" />
          </div>
        )}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-5 mb-20">
          {filtered.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-brand-red/20 hover:shadow-lg transition-all duration-300"
            >
              <div className="relative h-32 sm:h-44 overflow-hidden bg-brand-cream">
                {item.image_url ? (
                  <Image
                    src={item.image_url}
                    alt={item.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl">
                    🍽️
                  </div>
                )}
                <div className="absolute top-2 left-2 flex gap-1">
                  {item.is_vegetarian && (
                    <span className="bg-green-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                      <Leaf size={8} /> VEG
                    </span>
                  )}
                  {item.is_spicy && (
                    <span className="bg-brand-red text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                      <Flame size={8} />
                    </span>
                  )}
                </div>
              </div>
              <div className="p-2.5 sm:p-4">
                <div className="mb-1">
                  <h3 className="font-heading font-bold text-brand-charcoal leading-tight text-sm sm:text-base">{item.name}</h3>
                  {item.name_ne && <p className="text-brand-gold text-[10px] sm:text-xs">{item.name_ne}</p>}
                </div>
                <p className="text-gray-500 text-[10px] sm:text-xs leading-relaxed mb-2 sm:mb-4 line-clamp-2">{item.description}</p>
                <div className="flex items-center justify-between">
                  <span className="font-heading font-bold text-brand-red text-sm sm:text-lg">AED {item.price_aed}</span>
                  <button
                    onClick={() => handleAdd(item)}
                    className="flex items-center gap-1 bg-brand-red text-white px-2 py-1.5 sm:px-3 sm:py-2 rounded-xl text-[10px] sm:text-xs font-semibold hover:bg-brand-red-dark transition-colors"
                  >
                    <ShoppingCart size={13} /> Add
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {!menuLoading && filtered.length === 0 && (
          <div className="text-center py-20">
            <p className="text-4xl mb-4">🍽️</p>
            <p className="font-heading text-xl text-brand-charcoal font-bold mb-2">
              {menuItems.length === 0 ? "Menu coming soon!" : "No dishes found"}
            </p>
            <p className="text-gray-400">
              {menuItems.length === 0 ? "We are adding our menu items. Check back soon." : "Try a different search or category"}
            </p>
          </div>
        )}
      </div>

      {/* Floating cart button (mobile) */}
      {mounted && cartCount > 0 && (
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30 md:hidden"
        >
          <button
            onClick={() => setCartOpen(true)}
            className="flex items-center gap-3 bg-brand-charcoal text-white px-6 py-4 rounded-2xl shadow-xl font-semibold"
          >
            <ShoppingCart size={18} />
            View Cart ({cartCount})
          </button>
        </motion.div>
      )}

      <Footer />
    </>
  );
}
