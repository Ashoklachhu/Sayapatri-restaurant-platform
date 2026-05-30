"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import { TrendingUp, ShoppingBag, DollarSign, Users } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import type { Order } from "@/types";

export default function AnalyticsPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from("orders")
        .select("*, items:order_items(*)")
        .gte("created_at", new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());
      if (data) setOrders(data as unknown as Order[]);
      setLoading(false);
    };
    fetch();
  }, []);

  const totalRevenue = orders.filter((o) => o.payment_status === "paid").reduce((s, o) => s + o.total_aed, 0);
  const totalOrders = orders.length;
  const avgOrder = totalOrders > 0 ? totalRevenue / totalOrders : 0;
  const deliveryOrders = orders.filter((o) => o.order_type === "delivery").length;

  const stats = [
    { label: "Revenue (30d)", value: formatCurrency(totalRevenue), icon: DollarSign, color: "bg-green-50 text-green-600" },
    { label: "Orders (30d)", value: totalOrders, icon: ShoppingBag, color: "bg-blue-50 text-blue-600" },
    { label: "Avg Order Value", value: formatCurrency(avgOrder), icon: TrendingUp, color: "bg-purple-50 text-purple-600" },
    { label: "Delivery Orders", value: `${deliveryOrders} (${totalOrders ? Math.round(deliveryOrders / totalOrders * 100) : 0}%)`, icon: Users, color: "bg-orange-50 text-orange-600" },
  ];

  return (
    <div className="md:pl-56">
      <DashboardSidebar />
      <main className="p-6">
        <div className="mb-6">
          <h1 className="font-heading text-2xl font-bold text-brand-charcoal">Analytics</h1>
          <p className="text-gray-400 text-sm mt-0.5">Last 30 days</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-48">
            <div className="animate-spin w-8 h-8 border-4 border-brand-red border-t-transparent rounded-full" />
          </div>
        ) : (
          <>
            {/* Stats grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {stats.map((stat) => (
                <div key={stat.label} className="bg-white rounded-2xl border border-gray-100 p-5">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${stat.color}`}>
                    <stat.icon size={20} />
                  </div>
                  <p className="font-heading font-bold text-2xl text-brand-charcoal">{stat.value}</p>
                  <p className="text-gray-400 text-sm mt-1">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Recent orders table */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <h2 className="font-heading font-bold text-brand-charcoal mb-4">Recent Orders</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-gray-400 border-b border-gray-100">
                      <th className="pb-3 font-medium">Order #</th>
                      <th className="pb-3 font-medium">Customer</th>
                      <th className="pb-3 font-medium">Type</th>
                      <th className="pb-3 font-medium text-right">Total</th>
                      <th className="pb-3 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody className="space-y-2">
                    {orders.slice(0, 10).map((order) => (
                      <tr key={order.id} className="border-b border-gray-50">
                        <td className="py-3 font-mono text-xs text-gray-500">{order.order_number}</td>
                        <td className="py-3 font-medium text-brand-charcoal">{order.customer_name}</td>
                        <td className="py-3 text-gray-400 capitalize">{order.order_type}</td>
                        <td className="py-3 text-right font-bold text-brand-red">{formatCurrency(order.total_aed)}</td>
                        <td className="py-3">
                          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full capitalize">
                            {order.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
