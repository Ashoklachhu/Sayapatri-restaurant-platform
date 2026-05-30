"use client";

import { useEffect, useState } from "react";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import { Plus, Trash2, Sparkles } from "lucide-react";
import toast from "react-hot-toast";
import type { MenuItem, MenuCategory } from "@/types";

interface Recommendation {
  id: string;
  title: string;
  trigger_type: "always" | "category" | "item";
  trigger_category?: { name: string };
  trigger_item?: { name: string };
  recommended_item: { id: string; name: string; price_aed: number; image_url?: string };
  is_active: boolean;
}

export default function RecommendationsPage() {
  const [recs, setRecs] = useState<Recommendation[]>([]);
  const [items, setItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    title: "You might also like",
    trigger_type: "always" as "always" | "category" | "item",
    trigger_category_id: "",
    trigger_item_id: "",
    recommended_item_id: "",
  });
  const [saving, setSaving] = useState(false);

  const fetchAll = async () => {
    const [recsRes, menuRes] = await Promise.all([
      fetch("/api/dashboard/recommendations"),
      fetch("/api/dashboard/menu"),
    ]);
    const recsData = await recsRes.json();
    const menuData = await menuRes.json();
    setRecs(recsData.recommendations ?? []);
    setItems(menuData.items ?? []);
    setCategories(menuData.categories ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchAll(); }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.recommended_item_id) { toast.error("Select an item to recommend"); return; }
    setSaving(true);
    const res = await fetch("/api/dashboard/recommendations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      toast.success("Recommendation added!");
      setForm({ title: "You might also like", trigger_type: "always", trigger_category_id: "", trigger_item_id: "", recommended_item_id: "" });
      fetchAll();
    } else {
      const d = await res.json();
      toast.error(d.error ?? "Failed");
    }
    setSaving(false);
  };

  const deleteRec = async (id: string) => {
    await fetch("/api/dashboard/recommendations", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    toast.success("Removed");
    fetchAll();
  };

  const TRIGGER_LABELS = { always: "Always show", category: "When category in cart", item: "When item in cart" };

  return (
    <div className="md:pl-56">
      <DashboardSidebar />
      <main className="p-6">
        <div className="mb-6">
          <h1 className="font-heading text-2xl font-bold text-brand-charcoal flex items-center gap-2">
            <Sparkles size={22} className="text-brand-gold" /> Recommendations
          </h1>
          <p className="text-gray-400 text-sm mt-0.5">Suggest add-ons like drinks, water, desserts in the cart</p>
        </div>

        <div className="grid md:grid-cols-5 gap-6">
          {/* Add form */}
          <div className="md:col-span-2">
            <form onSubmit={handleAdd} className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4 sticky top-20">
              <h2 className="font-heading font-bold text-brand-charcoal">Add Recommendation</h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Section Title</label>
                <input type="text" value={form.title}
                  onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-brand-red" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Show When</label>
                <select value={form.trigger_type}
                  onChange={(e) => setForm((p) => ({ ...p, trigger_type: e.target.value as typeof form.trigger_type }))}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-brand-red">
                  <option value="always">Always (every cart)</option>
                  <option value="category">Specific category in cart</option>
                  <option value="item">Specific item in cart</option>
                </select>
              </div>

              {form.trigger_type === "category" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Trigger Category</label>
                  <select value={form.trigger_category_id}
                    onChange={(e) => setForm((p) => ({ ...p, trigger_category_id: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-brand-red">
                    <option value="">Select category...</option>
                    {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
              )}

              {form.trigger_type === "item" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Trigger Item</label>
                  <select value={form.trigger_item_id}
                    onChange={(e) => setForm((p) => ({ ...p, trigger_item_id: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-brand-red">
                    <option value="">Select item...</option>
                    {items.map((i) => <option key={i.id} value={i.id}>{i.name}</option>)}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Recommend This Item *</label>
                <select value={form.recommended_item_id}
                  onChange={(e) => setForm((p) => ({ ...p, recommended_item_id: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-brand-red" required>
                  <option value="">Select item to suggest...</option>
                  {items.map((i) => <option key={i.id} value={i.id}>{i.name} — AED {i.price_aed}</option>)}
                </select>
              </div>

              <button type="submit" disabled={saving}
                className="w-full bg-brand-red text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-brand-red-dark disabled:opacity-50 flex items-center justify-center gap-2">
                <Plus size={15} /> Add Recommendation
              </button>
            </form>
          </div>

          {/* List */}
          <div className="md:col-span-3 space-y-3">
            {loading ? (
              <div className="flex items-center justify-center h-32">
                <div className="animate-spin w-6 h-6 border-4 border-brand-red border-t-transparent rounded-full" />
              </div>
            ) : recs.length === 0 ? (
              <div className="text-center py-16 text-gray-400 bg-white rounded-2xl border border-gray-100">
                <Sparkles size={32} className="mx-auto mb-3 text-gray-200" />
                <p className="font-semibold">No recommendations yet</p>
                <p className="text-sm mt-1">Add items to suggest in the cart (drinks, desserts, etc.)</p>
              </div>
            ) : recs.map((rec) => (
              <div key={rec.id} className="bg-white rounded-2xl border border-gray-100 p-4 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl overflow-hidden bg-brand-cream shrink-0 flex items-center justify-center">
                  {rec.recommended_item.image_url
                    ? <img src={rec.recommended_item.image_url} alt="" className="w-full h-full object-cover" />
                    : <span className="text-xl">🍽️</span>}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-brand-charcoal text-sm">{rec.recommended_item.name}</p>
                  <p className="text-brand-red text-xs font-bold">AED {rec.recommended_item.price_aed}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                      {TRIGGER_LABELS[rec.trigger_type]}
                    </span>
                    {rec.trigger_category && (
                      <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">
                        {rec.trigger_category.name}
                      </span>
                    )}
                    {rec.trigger_item && (
                      <span className="text-[10px] bg-purple-50 text-purple-600 px-2 py-0.5 rounded-full">
                        {rec.trigger_item.name}
                      </span>
                    )}
                  </div>
                </div>
                <button onClick={() => deleteRec(rec.id)}
                  className="p-2 rounded-lg hover:bg-red-50 text-gray-300 hover:text-red-500 transition-colors shrink-0">
                  <Trash2 size={15} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
