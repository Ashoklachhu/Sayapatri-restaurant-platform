"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Minus, ShoppingBag, Trash2, Sparkles } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useCartStore } from "@/store/cartStore";
import { formatCurrency } from "@/lib/utils";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import type { MenuItem } from "@/types";

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

interface RecommendedItem {
  id: string;
  recommended_item: MenuItem;
  title: string;
}

export default function CartDrawer({ open, onClose }: CartDrawerProps) {
  const { items, updateQuantity, removeItem, subtotal, deliveryFee, total, orderType, branch, addItem } = useCartStore();
  const [recommendations, setRecommendations] = useState<RecommendedItem[]>([]);

  // Fetch recommendations based on cart contents
  useEffect(() => {
    if (!open || items.length === 0) return;
    const categoryIds = Array.from(new Set(items.map((i) => i.menu_item.category_id))).filter(Boolean);
    const itemIds = items.map((i) => i.menu_item.id);
    const params = new URLSearchParams();
    if (categoryIds.length) params.set("categoryIds", categoryIds.join(","));
    if (itemIds.length) params.set("itemIds", itemIds.join(","));

    fetch(`/api/recommendations?${params}`)
      .then((r) => r.json())
      .then((d) => {
        // Filter out items already in cart
        const cartIds = new Set(items.map((i) => i.menu_item.id));
        setRecommendations((d.recommendations ?? []).filter((r: RecommendedItem) => !cartIds.has(r.recommended_item.id)).slice(0, 4));
      })
      .catch(() => {});
  }, [open, items]);

  const handleAddRecommended = (item: MenuItem) => {
    addItem(item, 1);
    toast.success(`${item.name} added!`);
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white z-50 flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <ShoppingBag size={20} className="text-brand-red" />
                <h2 className="font-heading font-bold text-brand-charcoal text-xl">Your Order</h2>
                {items.length > 0 && (
                  <span className="bg-brand-red text-white text-xs font-bold px-2 py-0.5 rounded-full">
                    {items.reduce((s, i) => s + i.quantity, 0)}
                  </span>
                )}
              </div>
              <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Branch & order type info */}
            {branch && (
              <div className="px-5 py-3 bg-brand-cream text-sm text-brand-brown flex items-center justify-between">
                <span>
                  📍 {branch.name} ·{" "}
                  {orderType === "delivery" ? "🚴 Delivery" : orderType === "pickup" ? "🏃 Pickup" : "🍽️ Dine-in"}
                </span>
                <Link href="/menu" onClick={onClose} className="text-brand-red text-xs font-medium underline">Change</Link>
              </div>
            )}

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <ShoppingBag size={48} className="text-gray-200 mb-4" />
                  <p className="font-heading text-xl text-brand-charcoal font-bold mb-2">Your cart is empty</p>
                  <p className="text-gray-400 text-sm mb-6">Add some delicious dishes to get started!</p>
                  <button onClick={onClose} className="bg-brand-red text-white px-6 py-2.5 rounded-full font-semibold text-sm">
                    Browse Menu
                  </button>
                </div>
              ) : (
                <>
                  {/* Cart items */}
                  {items.map((item) => (
                    <div key={item.menu_item.id} className="flex gap-4 items-start">
                      <div className="flex-1">
                        <p className="font-semibold text-brand-charcoal text-sm">{item.menu_item.name}</p>
                        {item.special_instructions && (
                          <p className="text-gray-400 text-xs mt-0.5 italic">"{item.special_instructions}"</p>
                        )}
                        <p className="text-brand-red font-bold text-sm mt-1">
                          {formatCurrency(item.menu_item.price_aed * item.quantity)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.menu_item.id, item.quantity - 1)}
                          className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center hover:border-brand-red hover:text-brand-red transition-colors"
                        >
                          {item.quantity === 1 ? <Trash2 size={12} /> : <Minus size={12} />}
                        </button>
                        <span className="w-5 text-center font-bold text-sm">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.menu_item.id, item.quantity + 1)}
                          className="w-7 h-7 rounded-full bg-brand-red text-white flex items-center justify-center hover:bg-brand-red-dark transition-colors"
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                    </div>
                  ))}

                  {/* Recommendations */}
                  {recommendations.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <p className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                        <Sparkles size={12} className="text-brand-gold" />
                        {recommendations[0]?.title ?? "You might also like"}
                      </p>
                      <div className="space-y-2">
                        {recommendations.map((rec) => (
                          <div key={rec.id} className="flex items-center gap-3 bg-brand-cream rounded-xl p-2.5">
                            <div className="w-10 h-10 rounded-lg overflow-hidden bg-white shrink-0">
                              {rec.recommended_item.image_url ? (
                                <Image src={rec.recommended_item.image_url} alt={rec.recommended_item.name} width={40} height={40} className="object-cover w-full h-full" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-lg">🍽️</div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-semibold text-brand-charcoal truncate">{rec.recommended_item.name}</p>
                              <p className="text-brand-red text-xs font-bold">AED {rec.recommended_item.price_aed}</p>
                            </div>
                            <button
                              onClick={() => handleAddRecommended(rec.recommended_item)}
                              className="w-7 h-7 bg-brand-red text-white rounded-full flex items-center justify-center hover:bg-brand-red-dark transition-colors shrink-0"
                            >
                              <Plus size={13} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Summary + Checkout */}
            {items.length > 0 && (
              <div className="border-t border-gray-100 p-5 space-y-3">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-brand-charcoal">
                    <span>Subtotal</span>
                    <span>{formatCurrency(subtotal())}</span>
                  </div>
                  <div className="flex justify-between text-brand-charcoal">
                    <span>Delivery fee</span>
                    <span>{deliveryFee() === 0 ? "FREE" : formatCurrency(deliveryFee())}</span>
                  </div>
                  <div className="flex justify-between font-bold text-base text-brand-charcoal border-t border-gray-100 pt-2">
                    <span>Total</span>
                    <span className="text-brand-red">{formatCurrency(total())}</span>
                  </div>
                </div>
                <Link
                  href="/checkout"
                  onClick={onClose}
                  className="block w-full bg-brand-red hover:bg-brand-red-dark text-white text-center py-4 rounded-2xl font-bold text-base transition-colors"
                >
                  Proceed to Checkout →
                </Link>
                <p className="text-center text-xs text-gray-400">💵 Cash on {orderType === "dine_in" ? "receipt" : "delivery/collection"}</p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
