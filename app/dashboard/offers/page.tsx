"use client";

import { useEffect, useState } from "react";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import { Plus, Edit2, Trash2, Tag, Truck, Percent, BadgeDollarSign, ToggleLeft, ToggleRight } from "lucide-react";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2 } from "lucide-react";

interface Offer {
  id: string;
  title: string;
  description?: string;
  type: "percentage" | "fixed" | "free_delivery" | "item_discount";
  value: number;
  coupon_code?: string;
  min_order_aed: number;
  applicable_to: string;
  usage_limit?: number;
  usage_count: number;
  starts_at: string;
  ends_at?: string;
  is_active: boolean;
  show_banner: boolean;
  banner_color: string;
}

const TYPE_LABELS = {
  percentage: { label: "% Discount", icon: Percent, color: "bg-purple-100 text-purple-700" },
  fixed: { label: "Fixed Discount", icon: BadgeDollarSign, color: "bg-blue-100 text-blue-700" },
  free_delivery: { label: "Free Delivery", icon: Truck, color: "bg-green-100 text-green-700" },
  item_discount: { label: "Item Discount", icon: Tag, color: "bg-orange-100 text-orange-700" },
};

const EMPTY_FORM = {
  title: "",
  description: "",
  type: "percentage" as Offer["type"],
  value: "",
  coupon_code: "",
  min_order_aed: "0",
  applicable_to: "all",
  usage_limit: "",
  starts_at: new Date().toISOString().slice(0, 16),
  ends_at: "",
  is_active: true,
  show_banner: true,
  banner_color: "#C0392B",
};

export default function OffersPage() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editOffer, setEditOffer] = useState<Offer | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const fetchOffers = async () => {
    const res = await fetch("/api/dashboard/offers");
    if (res.ok) {
      const data = await res.json();
      setOffers(data.offers ?? []);
    }
    setLoading(false);
  };

  useEffect(() => { fetchOffers(); }, []);

  const set = (key: string, value: unknown) => setForm((p) => ({ ...p, [key]: value }));

  const openAdd = () => { setEditOffer(null); setForm(EMPTY_FORM); setModalOpen(true); };
  const openEdit = (offer: Offer) => {
    setEditOffer(offer);
    setForm({
      title: offer.title,
      description: offer.description ?? "",
      type: offer.type,
      value: String(offer.value),
      coupon_code: offer.coupon_code ?? "",
      min_order_aed: String(offer.min_order_aed),
      applicable_to: offer.applicable_to,
      usage_limit: offer.usage_limit ? String(offer.usage_limit) : "",
      starts_at: offer.starts_at?.slice(0, 16) ?? "",
      ends_at: offer.ends_at?.slice(0, 16) ?? "",
      is_active: offer.is_active,
      show_banner: offer.show_banner,
      banner_color: offer.banner_color,
    });
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const body = {
        ...form,
        ...(editOffer ? { id: editOffer.id } : {}),
      };
      const res = await fetch("/api/dashboard/offers", {
        method: editOffer ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast.success(editOffer ? "Offer updated!" : "Offer created!");
      setModalOpen(false);
      fetchOffers();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to save");
    }
    setSaving(false);
  };

  const toggleActive = async (offer: Offer) => {
    await fetch("/api/dashboard/offers", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: offer.id, is_active: !offer.is_active }),
    });
    fetchOffers();
  };

  const deleteOffer = async (offer: Offer) => {
    if (!confirm(`Delete "${offer.title}"?`)) return;
    await fetch("/api/dashboard/offers", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: offer.id }),
    });
    toast.success("Offer deleted");
    fetchOffers();
  };

  return (
    <div className="md:pl-56">
      <DashboardSidebar />

      {/* Modal */}
      <AnimatePresence>
        {modalOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setModalOpen(false)} className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }} className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white rounded-t-2xl">
                  <h2 className="font-heading text-xl font-bold text-brand-charcoal">
                    {editOffer ? "Edit Offer" : "Create Offer"}
                  </h2>
                  <button onClick={() => setModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full"><X size={18} /></button>
                </div>

                <form onSubmit={handleSave} className="p-6 space-y-5">
                  {/* Title & description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Offer Title *</label>
                    <input type="text" value={form.title} onChange={(e) => set("title", e.target.value)}
                      placeholder="e.g. Weekend Special 20% Off" required
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-red" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description (shown to customer)</label>
                    <input type="text" value={form.description} onChange={(e) => set("description", e.target.value)}
                      placeholder="e.g. Get 20% off on all orders this weekend!"
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-red" />
                  </div>

                  {/* Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Offer Type *</label>
                    <div className="grid grid-cols-2 gap-2">
                      {(Object.entries(TYPE_LABELS) as [Offer["type"], typeof TYPE_LABELS[keyof typeof TYPE_LABELS]][]).map(([key, config]) => (
                        <button key={key} type="button" onClick={() => set("type", key)}
                          className={`flex items-center gap-2 p-3 rounded-xl border text-sm font-medium transition-all ${
                            form.type === key ? "border-brand-red bg-brand-red/5 text-brand-red" : "border-gray-200 text-gray-600"
                          }`}>
                          <config.icon size={16} /> {config.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Value */}
                  {form.type !== "free_delivery" && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {form.type === "percentage" ? "Discount %" : "Discount (AED)"}
                        </label>
                        <input type="number" min="0" step="0.01" value={form.value} onChange={(e) => set("value", e.target.value)}
                          placeholder={form.type === "percentage" ? "20" : "15"}
                          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-red" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Min Order (AED)</label>
                        <input type="number" min="0" value={form.min_order_aed} onChange={(e) => set("min_order_aed", e.target.value)}
                          placeholder="0"
                          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-red" />
                      </div>
                    </div>
                  )}

                  {form.type === "free_delivery" && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Min Order for Free Delivery (AED)</label>
                      <input type="number" min="0" value={form.min_order_aed} onChange={(e) => set("min_order_aed", e.target.value)}
                        placeholder="150"
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-red" />
                    </div>
                  )}

                  {/* Coupon code */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Coupon Code <span className="text-gray-400 font-normal">(leave blank for auto-apply)</span>
                    </label>
                    <input type="text" value={form.coupon_code} onChange={(e) => set("coupon_code", e.target.value.toUpperCase())}
                      placeholder="e.g. SAYAPATRI20"
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-mono focus:outline-none focus:border-brand-red uppercase" />
                  </div>

                  {/* Dates */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                      <input type="datetime-local" value={form.starts_at} onChange={(e) => set("starts_at", e.target.value)}
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-red" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">End Date <span className="text-gray-400 font-normal">(optional)</span></label>
                      <input type="datetime-local" value={form.ends_at} onChange={(e) => set("ends_at", e.target.value)}
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-red" />
                    </div>
                  </div>

                  {/* Usage limit */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Usage Limit <span className="text-gray-400 font-normal">(blank = unlimited)</span></label>
                    <input type="number" min="1" value={form.usage_limit} onChange={(e) => set("usage_limit", e.target.value)}
                      placeholder="e.g. 100"
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-red" />
                  </div>

                  {/* Banner color */}
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Banner Color</label>
                      <div className="flex items-center gap-3">
                        <input type="color" value={form.banner_color} onChange={(e) => set("banner_color", e.target.value)}
                          className="w-10 h-10 rounded-lg border border-gray-200 cursor-pointer" />
                        <span className="text-sm text-gray-500">{form.banner_color}</span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={form.show_banner} onChange={(e) => set("show_banner", e.target.checked)} className="accent-brand-red w-4 h-4" />
                        <span className="text-sm font-medium text-gray-700">Show Banner</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={form.is_active} onChange={(e) => set("is_active", e.target.checked)} className="accent-brand-red w-4 h-4" />
                        <span className="text-sm font-medium text-gray-700">Active</span>
                      </label>
                    </div>
                  </div>

                  {/* Preview */}
                  {form.title && (
                    <div className="rounded-xl p-3 text-white text-sm font-medium" style={{ backgroundColor: form.banner_color }}>
                      🎉 {form.title} {form.description && `— ${form.description}`}
                    </div>
                  )}

                  <div className="flex gap-3 pt-2">
                    <button type="button" onClick={() => setModalOpen(false)}
                      className="flex-1 py-3 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50">Cancel</button>
                    <button type="submit" disabled={saving}
                      className="flex-1 py-3 bg-brand-red text-white rounded-xl text-sm font-semibold hover:bg-brand-red-dark disabled:opacity-50 flex items-center justify-center gap-2">
                      {saving ? <Loader2 size={16} className="animate-spin" /> : null}
                      {editOffer ? "Save Changes" : "Create Offer"}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <main className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-heading text-2xl font-bold text-brand-charcoal">Offers & Discounts</h1>
            <p className="text-gray-400 text-sm mt-0.5">{offers.length} offers total</p>
          </div>
          <button onClick={openAdd}
            className="flex items-center gap-2 bg-brand-red text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-brand-red-dark transition-colors">
            <Plus size={16} /> Create Offer
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-48">
            <div className="animate-spin w-8 h-8 border-4 border-brand-red border-t-transparent rounded-full" />
          </div>
        ) : offers.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <p className="text-4xl mb-3">🎁</p>
            <p className="font-semibold mb-4">No offers yet</p>
            <button onClick={openAdd} className="bg-brand-red text-white px-6 py-2.5 rounded-xl font-semibold text-sm">
              Create First Offer
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {offers.map((offer) => {
              const typeConfig = TYPE_LABELS[offer.type];
              return (
                <div key={offer.id} className={`bg-white rounded-2xl border p-5 transition-all ${offer.is_active ? "border-gray-100" : "border-gray-100 opacity-60"}`}>
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap mb-2">
                        <span className={`text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1 ${typeConfig.color}`}>
                          <typeConfig.icon size={11} /> {typeConfig.label}
                        </span>
                        {offer.coupon_code && (
                          <span className="text-xs font-mono font-bold bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                            🏷️ {offer.coupon_code}
                          </span>
                        )}
                        {!offer.coupon_code && (
                          <span className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-full font-medium">Auto-apply</span>
                        )}
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${offer.is_active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-400"}`}>
                          {offer.is_active ? "Active" : "Inactive"}
                        </span>
                      </div>
                      <h3 className="font-heading font-bold text-brand-charcoal text-lg">{offer.title}</h3>
                      {offer.description && <p className="text-gray-500 text-sm mt-0.5">{offer.description}</p>}
                      <div className="flex flex-wrap gap-3 mt-2 text-xs text-gray-400">
                        {offer.type !== "free_delivery" && <span>💰 {offer.type === "percentage" ? `${offer.value}% off` : `AED ${offer.value} off`}</span>}
                        {offer.min_order_aed > 0 && <span>Min order: AED {offer.min_order_aed}</span>}
                        {offer.ends_at && <span>Expires: {new Date(offer.ends_at).toLocaleDateString("en-AE")}</span>}
                        {offer.usage_limit && <span>Used: {offer.usage_count}/{offer.usage_limit}</span>}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => toggleActive(offer)} title={offer.is_active ? "Deactivate" : "Activate"}
                        className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                        {offer.is_active
                          ? <ToggleRight size={22} className="text-green-500" />
                          : <ToggleLeft size={22} className="text-gray-300" />}
                      </button>
                      <button onClick={() => openEdit(offer)} className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-brand-charcoal transition-colors">
                        <Edit2 size={15} />
                      </button>
                      <button onClick={() => deleteOffer(offer)} className="p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                  {/* Banner preview */}
                  {offer.show_banner && (
                    <div className="mt-3 rounded-lg px-3 py-2 text-white text-xs font-medium" style={{ backgroundColor: offer.banner_color }}>
                      🎉 {offer.title}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
