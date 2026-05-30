"use client";

import { useEffect, useState, useCallback } from "react";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import OrderDetailDrawer from "@/components/dashboard/OrderDetailDrawer";
import { getOrderStatusLabel, getOrderStatusColor, getStatusFlow, formatCurrency } from "@/lib/utils";
import { RefreshCw, Clock, Phone, ChevronRight } from "lucide-react";
import toast from "react-hot-toast";
import type { Order, OrderStatus } from "@/types";

const TABS: Array<{ key: OrderStatus | "all"; label: string }> = [
  { key: "all", label: "All" },
  { key: "pending", label: "Pending" },
  { key: "confirmed", label: "Confirmed" },
  { key: "preparing", label: "Preparing" },
  { key: "out_for_delivery", label: "Out for Delivery" },
  { key: "delivered", label: "Delivered" },
];

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<OrderStatus | "all">("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const fetchOrders = useCallback(async () => {
    try {
      const res = await fetch("/api/dashboard/orders");
      if (!res.ok) {
        const err = await res.json();
        console.error("Fetch error:", err);
        toast.error("Failed to load orders");
        return;
      }
      const data = await res.json();
      setOrders(data.orders ?? []);
    } catch (e) {
      console.error(e);
      toast.error("Network error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 30000); // poll every 30s
    return () => clearInterval(interval);
  }, [fetchOrders]);

  const updateStatus = async (orderId: string, status: OrderStatus) => {
    const res = await fetch("/api/dashboard/orders", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId, status }),
    });
    if (res.ok) {
      toast.success("Order updated!");
      fetchOrders();
    } else {
      toast.error("Failed to update status");
    }
  };

  const filtered = filter === "all" ? orders : orders.filter((o) => o.status === filter);

  return (
    <div className="md:pl-56">
      <DashboardSidebar />
      <OrderDetailDrawer
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
        onUpdateStatus={updateStatus}
      />
      <main className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-heading text-2xl font-bold text-brand-charcoal">Orders</h1>
            <p className="text-gray-400 text-sm mt-0.5">{orders.length} total orders</p>
          </div>
          <button
            onClick={fetchOrders}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-brand-red transition-colors"
          >
            <RefreshCw size={15} /> Refresh
          </button>
        </div>

        {/* Status filter tabs */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2 mb-6">
          {TABS.map((tab) => {
            const count = tab.key === "all"
              ? orders.length
              : orders.filter((o) => o.status === tab.key).length;
            return (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key)}
                className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-1.5 ${
                  filter === tab.key
                    ? "bg-brand-charcoal text-white"
                    : "bg-white border border-gray-200 text-gray-600 hover:border-brand-red"
                }`}
              >
                {tab.label}
                {count > 0 && (
                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                    filter === tab.key ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500"
                  }`}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Orders list */}
        {loading ? (
          <div className="flex items-center justify-center h-48">
            <div className="animate-spin w-8 h-8 border-4 border-brand-red border-t-transparent rounded-full" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <p className="text-4xl mb-3">📋</p>
            <p className="font-semibold">No orders here</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((order) => {
              const statusFlow = getStatusFlow(order.order_type) as OrderStatus[];
              const currentIdx = statusFlow.indexOf(order.status as OrderStatus);
              const nextStatus = statusFlow[currentIdx + 1];

              return (
                <div
                  key={order.id}
                  className="bg-white rounded-2xl border border-gray-100 p-5 hover:border-brand-red/30 hover:shadow-sm transition-all cursor-pointer"
                  onClick={() => setSelectedOrder(order)}
                >
                  <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="font-heading font-bold text-brand-charcoal">
                          {order.order_number}
                        </span>
                        <span className={`text-xs font-bold px-2 py-1 rounded-full ${getOrderStatusColor(order.status)}`}>
                          {getOrderStatusLabel(order.status)}
                        </span>
                        <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded-full capitalize">
                          {order.order_type === "dine_in" ? "🍽️ Dine-in" : order.order_type === "pickup" ? "🏃 Pickup" : "🚴 Delivery"}
                        </span>
                        {order.branch && (
                          <span className="text-xs bg-brand-cream text-brand-brown px-2 py-1 rounded-full">
                            📍 {(order.branch as unknown as { location: string }).location ?? ""}
                          </span>
                        )}
                      </div>
                      <p className="font-semibold text-brand-charcoal">{order.customer_name}</p>
                      <div className="flex flex-wrap items-center gap-4 mt-1 text-xs text-gray-400">
                        <span className="flex items-center gap-1">
                          <Phone size={11} /> {order.customer_phone}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock size={11} />
                          {new Date(order.created_at).toLocaleString("en-AE", {
                            day: "numeric", month: "short",
                            hour: "2-digit", minute: "2-digit",
                          })}
                        </span>
                        {order.table_number && (
                          <span>🪑 Table {order.table_number}</span>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-heading font-bold text-brand-red text-xl">
                        {formatCurrency(order.total_aed)}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">💵 Cash</p>
                      <p className="text-xs text-brand-red mt-1 flex items-center justify-end gap-0.5">
                        View details <ChevronRight size={12} />
                      </p>
                      {order.delivery_address && (
                        <p className="text-xs text-gray-400 mt-1 max-w-xs text-right">
                          📍 {order.delivery_address}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Items */}
                  <div className="bg-gray-50 rounded-xl p-3 mb-4 text-sm text-gray-600 space-y-1">
                    {order.items?.map((item, i) => (
                      <div key={i} className="flex justify-between">
                        <span>{item.name} × {item.quantity}</span>
                        <span>{formatCurrency(item.price_aed * item.quantity)}</span>
                      </div>
                    ))}
                  </div>

                  {/* Actions — stop propagation so clicking buttons doesn't open drawer */}
                  <div className="flex flex-wrap gap-2" onClick={(e) => e.stopPropagation()}>
                    {nextStatus && order.status !== "cancelled" && (
                      <button
                        onClick={() => updateStatus(order.id, nextStatus)}
                        className="bg-brand-red text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-brand-red-dark transition-colors"
                      >
                        Mark as {getOrderStatusLabel(nextStatus, order.order_type)} →
                      </button>
                    )}
                    {order.status === "pending" && (
                      <button
                        onClick={() => updateStatus(order.id, "cancelled")}
                        className="bg-gray-100 text-gray-600 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-red-50 hover:text-red-600 transition-colors"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
