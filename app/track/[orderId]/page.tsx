"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import Navbar from "@/components/customer/Navbar";
import { getOrderStatusLabel, getOrderStatusColor, getStatusFlow, formatCurrency } from "@/lib/utils";
import { Clock, Phone, UtensilsCrossed, Bike, ShoppingBag, CheckCircle, ChefHat, Package, Star } from "lucide-react";
import type { Order } from "@/types";

// Icons per step per flow
const STEP_ICONS: Record<string, React.ElementType> = {
  pending: CheckCircle,
  confirmed: CheckCircle,
  preparing: ChefHat,
  ready: Star,
  out_for_delivery: Bike,
  delivered: Package,
};

const DINE_IN_STEPS = [
  { key: "pending", label: "Order Received", desc: "Your order has been sent to the kitchen", emoji: "📋" },
  { key: "confirmed", label: "Confirmed", desc: "The kitchen has confirmed your order", emoji: "✅" },
  { key: "preparing", label: "Being Prepared", desc: "Our chefs are cooking your food", emoji: "👨‍🍳" },
  { key: "ready", label: "Served at Table", desc: "Your food is on its way to your table!", emoji: "🍽️" },
];

const PICKUP_STEPS = [
  { key: "pending", label: "Order Received", desc: "We've received your order", emoji: "📋" },
  { key: "confirmed", label: "Confirmed", desc: "Order confirmed — preparing soon", emoji: "✅" },
  { key: "preparing", label: "Being Prepared", desc: "Our chefs are cooking your food", emoji: "👨‍🍳" },
  { key: "ready", label: "Ready for Pickup", desc: "Your order is ready at the counter!", emoji: "🛎️" },
  { key: "delivered", label: "Collected", desc: "Enjoy your meal!", emoji: "🎉" },
];

const DELIVERY_STEPS = [
  { key: "pending", label: "Order Received", desc: "We've received your order", emoji: "📋" },
  { key: "confirmed", label: "Confirmed", desc: "Order confirmed — preparing soon", emoji: "✅" },
  { key: "preparing", label: "Being Prepared", desc: "Our chefs are cooking your food", emoji: "👨‍🍳" },
  { key: "ready", label: "Ready", desc: "Packed and ready for dispatch", emoji: "📦" },
  { key: "out_for_delivery", label: "Out for Delivery", desc: "Your rider is on the way!", emoji: "🛵" },
  { key: "delivered", label: "Delivered", desc: "Enjoy your meal!", emoji: "🎉" },
];

function getSteps(orderType?: string) {
  if (orderType === "dine_in") return DINE_IN_STEPS;
  if (orderType === "pickup") return PICKUP_STEPS;
  return DELIVERY_STEPS;
}

export default function TrackOrderPage() {
  const { orderId } = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      const res = await fetch(`/api/orders?id=${orderId}`);
      const data = await res.json();
      if (data.order) setOrder(data.order);
      setLoading(false);
    };
    fetchOrder();
    const interval = setInterval(fetchOrder, 20000);
    return () => clearInterval(interval);
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-brand-red border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center p-6">
        <div>
          <p className="text-4xl mb-4">🔍</p>
          <h2 className="font-heading text-2xl font-bold text-brand-charcoal mb-2">Order Not Found</h2>
          <p className="text-gray-400">We could not find this order.</p>
        </div>
      </div>
    );
  }

  const steps = getSteps(order.order_type);
  const flow = getStatusFlow(order.order_type);
  const currentIdx = flow.indexOf(order.status);
  const isCancelled = order.status === "cancelled";
  const isComplete = order.status === "delivered" || order.status === "ready" && order.order_type === "dine_in";

  const orderTypeConfig = {
    dine_in: { icon: <UtensilsCrossed size={18} />, label: "Dine-in", color: "bg-purple-100 text-purple-700" },
    pickup: { icon: <ShoppingBag size={18} />, label: "Pickup", color: "bg-blue-100 text-blue-700" },
    delivery: { icon: <Bike size={18} />, label: "Delivery", color: "bg-green-100 text-green-700" },
  }[order.order_type] ?? { icon: <Bike size={18} />, label: "Delivery", color: "bg-green-100 text-green-700" };

  return (
    <>
      <Navbar />
      <div className="max-w-lg mx-auto px-4 py-10">

        {/* Header */}
        <div className="text-center mb-8">
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-4 ${orderTypeConfig.color}`}>
            {orderTypeConfig.icon} {orderTypeConfig.label}
          </div>
          <h1 className="font-heading text-3xl font-bold text-brand-charcoal mb-1">
            {isCancelled ? "Order Cancelled" : isComplete ? "Enjoy Your Meal! 🎉" : "Tracking Your Order"}
          </h1>
          <p className="text-gray-400 text-sm font-mono mt-1">{order.order_number}</p>
        </div>

        {/* Cancelled state */}
        {isCancelled ? (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center mb-6">
            <p className="text-4xl mb-2">❌</p>
            <p className="font-semibold text-red-700">This order was cancelled.</p>
            <p className="text-red-500 text-sm mt-1">Please contact the restaurant for assistance.</p>
          </div>
        ) : (
          <>
            {/* Progress steps */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-5 shadow-sm">
              <div className="space-y-0">
                {steps.map((step, i) => {
                  const done = i <= currentIdx;
                  const active = i === currentIdx;
                  const Icon = STEP_ICONS[step.key] ?? CheckCircle;

                  return (
                    <div key={step.key} className="flex gap-4">
                      {/* Timeline */}
                      <div className="flex flex-col items-center">
                        <motion.div
                          animate={active ? { scale: [1, 1.15, 1] } : {}}
                          transition={{ duration: 1.5, repeat: active ? Infinity : 0 }}
                          className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border-2 transition-all ${
                            done
                              ? "bg-brand-red border-brand-red text-white"
                              : "bg-white border-gray-200 text-gray-300"
                          }`}
                        >
                          {done ? <Icon size={18} /> : <span className="text-sm font-bold text-gray-300">{i + 1}</span>}
                        </motion.div>
                        {i < steps.length - 1 && (
                          <div className={`w-0.5 h-8 my-1 transition-all ${i < currentIdx ? "bg-brand-red" : "bg-gray-100"}`} />
                        )}
                      </div>

                      {/* Content */}
                      <div className="pb-8 flex-1">
                        <div className="flex items-center gap-2 mt-2">
                          <span className={`text-sm font-bold ${done ? "text-brand-charcoal" : "text-gray-300"}`}>
                            {step.emoji} {step.label}
                          </span>
                          {active && (
                            <span className="bg-brand-red text-white text-[10px] font-bold px-2 py-0.5 rounded-full animate-pulse">
                              NOW
                            </span>
                          )}
                        </div>
                        {(done || active) && (
                          <p className={`text-xs mt-0.5 ${active ? "text-brand-brown" : "text-gray-400"}`}>
                            {step.desc}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}

        {/* Order summary */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm mb-5">
          <h3 className="font-heading font-bold text-brand-charcoal mb-4">Your Order</h3>

          {/* Context info */}
          <div className="space-y-1.5 text-sm text-gray-500 mb-4">
            {order.table_number && (
              <p>🪑 Table {order.table_number}</p>
            )}
            {order.delivery_address && (
              <p>📍 {order.delivery_address}</p>
            )}
            <p className="flex items-center gap-1.5">
              <Clock size={13} />
              {new Date(order.created_at).toLocaleString("en-AE", {
                day: "numeric", month: "short",
                hour: "2-digit", minute: "2-digit",
              })}
            </p>
            {order.customer_phone && (
              <p className="flex items-center gap-1.5">
                <Phone size={13} /> {order.customer_phone}
              </p>
            )}
          </div>

          {/* Items */}
          <div className="space-y-2 mb-4">
            {order.items?.map((item, i) => (
              <div key={i} className="flex justify-between text-sm">
                <span className="text-gray-600">{item.name} <span className="text-gray-400">×{item.quantity}</span></span>
                <span className="font-medium">{formatCurrency(item.price_aed * item.quantity)}</span>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-100 pt-3 space-y-1.5 text-sm">
            <div className="flex justify-between text-gray-500">
              <span>Subtotal</span>
              <span>{formatCurrency(order.subtotal_aed)}</span>
            </div>
            {order.delivery_fee_aed > 0 && (
              <div className="flex justify-between text-gray-500">
                <span>Delivery fee</span>
                <span>{formatCurrency(order.delivery_fee_aed)}</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-brand-charcoal text-base border-t border-gray-100 pt-2">
              <span>Total</span>
              <span className="text-brand-red">{formatCurrency(order.total_aed)}</span>
            </div>
            <p className="text-xs text-gray-400">
              💵 Pay on {order.order_type === "dine_in" ? "receipt" : order.order_type === "pickup" ? "collection" : "delivery"}
            </p>
          </div>
        </div>

        {/* Branch contact */}
        {order.branch && (
          <div className="bg-brand-cream rounded-2xl p-4 text-sm text-brand-brown text-center">
            <p className="font-semibold">{(order.branch as unknown as { name: string }).name}</p>
            <p className="text-brand-brown/70 text-xs mt-0.5">
              Questions? Call your branch directly.
            </p>
          </div>
        )}
      </div>
    </>
  );
}
