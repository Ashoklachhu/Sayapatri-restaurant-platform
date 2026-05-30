"use client";

import { useEffect, useState } from "react";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import MenuItemModal from "@/components/dashboard/MenuItemModal";
import { Plus, Edit2, Eye, EyeOff, Trash2 } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import toast from "react-hot-toast";
import type { MenuItem, MenuCategory } from "@/types";

export default function MenuManagementPage() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<MenuItem | null>(null);

  const fetchData = async () => {
    const res = await fetch("/api/dashboard/menu");
    if (res.ok) {
      const data = await res.json();
      setItems(data.items ?? []);
      setCategories(data.categories ?? []);
    } else {
      toast.error("Failed to load menu");
    }
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const toggleAvailability = async (item: MenuItem) => {
    const res = await fetch("/api/dashboard/menu", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: item.id, is_available: !item.is_available }),
    });
    if (res.ok) {
      toast.success(`${item.name} ${!item.is_available ? "enabled" : "disabled"}`);
      fetchData();
    } else {
      toast.error("Failed to update");
    }
  };

  const deleteItem = async (item: MenuItem) => {
    if (!confirm(`Delete "${item.name}"? This cannot be undone.`)) return;
    const res = await fetch("/api/dashboard/menu", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: item.id }),
    });
    if (res.ok) {
      toast.success("Item deleted");
      fetchData();
    } else {
      toast.error("Failed to delete");
    }
  };

  const openAdd = () => { setEditItem(null); setModalOpen(true); };
  const openEdit = (item: MenuItem) => { setEditItem(item); setModalOpen(true); };

  const filtered = activeCategory === "all" ? items : items.filter((i) => i.category_id === activeCategory);

  return (
    <div className="md:pl-56">
      <DashboardSidebar />
      <MenuItemModal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditItem(null); }}
        onSaved={fetchData}
        categories={categories}
        editItem={editItem}
      />

      <main className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-heading text-2xl font-bold text-brand-charcoal">Menu Management</h1>
            <p className="text-gray-400 text-sm mt-0.5">{items.length} items across {categories.length} categories</p>
          </div>
          <button
            onClick={openAdd}
            className="flex items-center gap-2 bg-brand-red text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-brand-red-dark transition-colors"
          >
            <Plus size={16} /> Add Item
          </button>
        </div>

        {/* Category filter */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2 mb-6">
          <button
            onClick={() => setActiveCategory("all")}
            className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-all ${
              activeCategory === "all" ? "bg-brand-charcoal text-white" : "bg-white border border-gray-200 text-gray-600"
            }`}
          >
            All ({items.length})
          </button>
          {categories.map((cat) => {
            const count = items.filter((i) => i.category_id === cat.id).length;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeCategory === cat.id ? "bg-brand-charcoal text-white" : "bg-white border border-gray-200 text-gray-600"
                }`}
              >
                {cat.name} ({count})
              </button>
            );
          })}
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-48">
            <div className="animate-spin w-8 h-8 border-4 border-brand-red border-t-transparent rounded-full" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <p className="text-4xl mb-3">🍽️</p>
            <p className="font-semibold mb-4">No items yet</p>
            <button onClick={openAdd} className="bg-brand-red text-white px-6 py-2.5 rounded-xl font-semibold text-sm">
              Add First Item
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-5 py-3 font-semibold text-gray-500">Item</th>
                  <th className="text-left px-5 py-3 font-semibold text-gray-500 hidden md:table-cell">Category</th>
                  <th className="text-right px-5 py-3 font-semibold text-gray-500">Price</th>
                  <th className="text-center px-5 py-3 font-semibold text-gray-500">Status</th>
                  <th className="text-center px-5 py-3 font-semibold text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((item) => (
                  <tr key={item.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-4">
                      <p className="font-semibold text-brand-charcoal">{item.name}</p>
                      {item.name_ne && <p className="text-gray-400 text-xs">{item.name_ne}</p>}
                      <div className="flex gap-1 mt-1">
                        {item.is_vegetarian && <span className="bg-green-100 text-green-700 text-[9px] font-bold px-1.5 py-0.5 rounded-full">VEG</span>}
                        {item.is_spicy && <span className="bg-red-100 text-red-600 text-[9px] font-bold px-1.5 py-0.5 rounded-full">SPICY</span>}
                        {item.is_featured && <span className="bg-yellow-100 text-yellow-700 text-[9px] font-bold px-1.5 py-0.5 rounded-full">FEATURED</span>}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-gray-500 hidden md:table-cell">
                      {(item.category as unknown as MenuCategory)?.name ?? "—"}
                    </td>
                    <td className="px-5 py-4 text-right font-bold text-brand-red">
                      {formatCurrency(item.price_aed)}
                    </td>
                    <td className="px-5 py-4 text-center">
                      <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                        item.is_available ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-400"
                      }`}>
                        {item.is_available ? "Available" : "Hidden"}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => toggleAvailability(item)}
                          title={item.is_available ? "Hide" : "Show"}
                          className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-brand-charcoal transition-colors"
                        >
                          {item.is_available ? <Eye size={15} /> : <EyeOff size={15} />}
                        </button>
                        <button
                          onClick={() => openEdit(item)}
                          title="Edit"
                          className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-brand-charcoal transition-colors"
                        >
                          <Edit2 size={15} />
                        </button>
                        <button
                          onClick={() => deleteItem(item)}
                          title="Delete"
                          className="p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
