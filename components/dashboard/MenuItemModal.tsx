"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import type { MenuItem, MenuCategory } from "@/types";

interface Props {
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
  categories: MenuCategory[];
  editItem?: MenuItem | null;
}

const EMPTY_FORM = {
  category_id: "",
  name: "",
  name_ne: "",
  description: "",
  price_aed: "",
  image_url: "",
  is_vegetarian: false,
  is_vegan: false,
  is_spicy: false,
  spice_level: 1,
  is_featured: false,
  is_available: true,
  prep_time_minutes: "20",
  sort_order: "0",
};

export default function MenuItemModal({ open, onClose, onSaved, categories, editItem }: Props) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editItem) {
      setForm({
        category_id: editItem.category_id,
        name: editItem.name,
        name_ne: editItem.name_ne ?? "",
        description: editItem.description ?? "",
        price_aed: String(editItem.price_aed),
        image_url: editItem.image_url ?? "",
        is_vegetarian: editItem.is_vegetarian,
        is_vegan: editItem.is_vegan,
        is_spicy: editItem.is_spicy,
        spice_level: editItem.spice_level ?? 1,
        is_featured: editItem.is_featured,
        is_available: editItem.is_available,
        prep_time_minutes: String(editItem.prep_time_minutes ?? 20),
        sort_order: String(editItem.sort_order),
      });
    } else {
      setForm(EMPTY_FORM);
    }
  }, [editItem, open]);

  const set = (key: string, value: unknown) => setForm((p) => ({ ...p, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.price_aed || !form.category_id) {
      toast.error("Name, category and price are required");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/dashboard/menu", {
        method: editItem ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editItem ? { id: editItem.id, ...form } : form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast.success(editItem ? "Item updated!" : "Item added!");
      onSaved();
      onClose();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to save");
    }
    setLoading(false);
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-100 sticky top-0 bg-white rounded-t-2xl">
                <h2 className="font-heading text-xl font-bold text-brand-charcoal">
                  {editItem ? "Edit Menu Item" : "Add New Item"}
                </h2>
                <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                  <select
                    value={form.category_id}
                    onChange={(e) => set("category_id", e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-red"
                    required
                  >
                    <option value="">Select category...</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                {/* Name */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name (English) *</label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => set("name", e.target.value)}
                      placeholder="Chicken Momo"
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-red"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name (Nepali)</label>
                    <input
                      type="text"
                      value={form.name_ne}
                      onChange={(e) => set("name_ne", e.target.value)}
                      placeholder="चिकन मोमो"
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-red"
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    rows={2}
                    value={form.description}
                    onChange={(e) => set("description", e.target.value)}
                    placeholder="Brief description of the dish..."
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-red resize-none"
                  />
                </div>

                {/* Price + Prep time */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price (AED) *</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={form.price_aed}
                      onChange={(e) => set("price_aed", e.target.value)}
                      placeholder="35.00"
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-red"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Prep Time (min)</label>
                    <input
                      type="number"
                      min="1"
                      value={form.prep_time_minutes}
                      onChange={(e) => set("prep_time_minutes", e.target.value)}
                      placeholder="20"
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-red"
                    />
                  </div>
                </div>

                {/* Image URL */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                  <input
                    type="url"
                    value={form.image_url}
                    onChange={(e) => set("image_url", e.target.value)}
                    placeholder="https://..."
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-red"
                  />
                </div>

                {/* Toggles */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[
                    { key: "is_vegetarian", label: "🌿 Vegetarian" },
                    { key: "is_vegan", label: "🌱 Vegan" },
                    { key: "is_spicy", label: "🌶️ Spicy" },
                    { key: "is_featured", label: "⭐ Featured" },
                    { key: "is_available", label: "✅ Available" },
                  ].map(({ key, label }) => (
                    <label key={key} className="flex items-center gap-2 cursor-pointer p-3 border border-gray-200 rounded-xl hover:border-brand-red transition-colors">
                      <input
                        type="checkbox"
                        checked={form[key as keyof typeof form] as boolean}
                        onChange={(e) => set(key, e.target.checked)}
                        className="accent-brand-red w-4 h-4"
                      />
                      <span className="text-sm font-medium text-gray-700">{label}</span>
                    </label>
                  ))}
                </div>

                {/* Spice level */}
                {form.is_spicy && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Spice Level</label>
                    <div className="flex gap-3">
                      {[1, 2, 3].map((level) => (
                        <button
                          key={level}
                          type="button"
                          onClick={() => set("spice_level", level)}
                          className={`flex-1 py-2 rounded-xl text-sm font-medium border transition-all ${
                            form.spice_level === level
                              ? "bg-brand-red text-white border-brand-red"
                              : "border-gray-200 text-gray-600"
                          }`}
                        >
                          {"🌶️".repeat(level)}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Footer */}
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 py-3 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 py-3 bg-brand-red text-white rounded-xl text-sm font-semibold hover:bg-brand-red-dark disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {loading ? <Loader2 size={16} className="animate-spin" /> : null}
                    {editItem ? "Save Changes" : "Add Item"}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
