"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Phone, Mail, MapPin, Clock, UtensilsCrossed, Bike, ShoppingBag } from "lucide-react";
import { formatCurrency, getOrderStatusLabel, getOrderStatusColor, getStatusFlow } from "@/lib/utils";
import type { Order, OrderStatus } from "@/types";

interface Props {
  order: Order | null;
  onClose: () => void;
  onUpdateStatus: (orderId: string, status: OrderStatus) => void;
}

export default function OrderDetailDrawer({ order, onClose, onUpdateStatus }: Props) {
  if (!order) return null;

  const statusFlow = getStatusFlow(order.order_type) as OrderStatus[];
  const currentIdx = statusFlow.indexOf(order.status as OrderStatus);
  const nextStatus = statusFlow[currentIdx + 1];

  const orderTypeIcon = order.order_type === "dine_in"
    ? <UtensilsCrossed size={14} />
    : order.order_type === "pickup"
    ? <ShoppingBag size={14} />
    : <Bike size={14} />;

  const orderTypeLabel = order.order_type === "dine_in" ? "Dine-in"
    : order.order_type === "pickup" ? "Pickup" : "Delivery";

  return (
    <AnimatePresence>
      {order && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 z-40"
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-lg bg-white z-50 flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <div>
                <p className="font-mono text-xs text-gray-400">{order.order_number}</p>
                <h2 className="font-heading font-bold text-brand-charcoal text-lg">Order Details</h2>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-5">
              {/* Status + type */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${getOrderStatusColor(order.status)}`}>
                  {getOrderStatusLabel(order.status)}
                </span>
                <span className="flex items-center gap-1.5 text-xs bg-gray-100 text-gray-600 px-3 py-1.5 rounded-full font-medium">
                  {orderTypeIcon} {orderTypeLabel}
                </span>
                {(order.branch as unknown as { location?: string })?.location && (
                  <span className="text-xs bg-brand-cream text-brand-brown px-3 py-1.5 rounded-full font-medium">
                    📍 {(order.branch as unknown as { location: string }).location}
                  </span>
                )}
              </div>

              {/* Progress stepper */}
              {order.status !== "cancelled" && (
                <div className="bg-gray-50 rounded-2xl p-4">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Progress</p>
                  <div className="flex items-center gap-1">
                    {statusFlow.map((s, i) => (
                      <div key={s} className="flex items-center flex-1">
                        <div className={`w-full h-1.5 rounded-full ${
                          i <= currentIdx ? "bg-brand-red" : "bg-gray-200"
                        }`} />
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-[10px] text-gray-400">Received</span>
                    <span className="text-[10px] text-gray-400">Delivered</span>
                  </div>
                </div>
              )}

              {/* Customer info */}
              <div className="bg-white border border-gray-100 rounded-2xl p-4 space-y-2">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Customer</p>
                <p className="font-semibold text-brand-charcoal text-base">{order.customer_name}</p>
                <div className="space-y-1.5 text-sm text-gray-500">
                  <p className="flex items-center gap-2">
                    <Phone size={13} className="text-brand-red" /> {order.customer_phone}
                  </p>
                  {order.customer_email && (
                    <p className="flex items-center gap-2">
                      <Mail size={13} className="text-brand-red" /> {order.customer_email}
                    </p>
                  )}
                  {order.delivery_address && (
                    <p className="flex items-start gap-2">
                      <MapPin size={13} className="text-brand-red mt-0.5 shrink-0" /> {order.delivery_address}
                    </p>
                  )}
                  {order.table_number && (
                    <p className="flex items-center gap-2">
                      🪑 Table {order.table_number}
                    </p>
                  )}
                  <p className="flex items-center gap-2">
                    <Clock size={13} className="text-brand-red" />
                    {new Date(order.created_at).toLocaleString("en-AE", {
                      day: "numeric", month: "short", year: "numeric",
                      hour: "2-digit", minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>

              {/* Order items */}
              <div className="bg-white border border-gray-100 rounded-2xl p-4">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Items Ordered</p>
                <div className="space-y-3">
                  {order.items?.map((item, i) => (
                    <div key={i} className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-brand-charcoal text-sm">{item.name}</p>
                        {item.special_instructions && (
                          <p className="text-xs text-gray-400 italic mt-0.5">"{item.special_instructions}"</p>
                        )}
                      </div>
                      <div className="text-right shrink-0 ml-4">
                        <p className="text-sm font-semibold text-brand-charcoal">
                          {formatCurrency(item.price_aed * item.quantity)}
                        </p>
                        <p className="text-xs text-gray-400">{formatCurrency(item.price_aed)} × {item.quantity}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="border-t border-gray-100 mt-4 pt-4 space-y-1.5 text-sm">
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
                  <div className="flex justify-between font-bold text-base text-brand-charcoal pt-1 border-t border-gray-100">
                    <span>Total</span>
                    <span className="text-brand-red">{formatCurrency(order.total_aed)}</span>
                  </div>
                  <p className="text-xs text-gray-400 text-right">💵 Cash on {order.order_type === "dine_in" ? "receipt" : order.order_type === "pickup" ? "collection" : "delivery"}</p>
                </div>
              </div>

              {/* Special instructions */}
              {order.special_instructions && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4">
                  <p className="text-xs font-semibold text-yellow-700 uppercase tracking-wide mb-1">Special Instructions</p>
                  <p className="text-sm text-yellow-800">{order.special_instructions}</p>
                </div>
              )}
            </div>

            {/* Action footer */}
            <div className="p-5 border-t border-gray-100 space-y-2">
              {nextStatus && order.status !== "cancelled" && (
                <button
                  onClick={() => { onUpdateStatus(order.id, nextStatus); onClose(); }}
                  className="w-full bg-brand-red text-white py-3.5 rounded-xl font-bold hover:bg-brand-red-dark transition-colors"
                >
                  Mark as {getOrderStatusLabel(nextStatus, order.order_type)} →
                </button>
              )}
              {order.status === "pending" && (
                <button
                  onClick={() => { onUpdateStatus(order.id, "cancelled"); onClose(); }}
                  className="w-full bg-gray-100 text-gray-600 py-3 rounded-xl font-semibold hover:bg-red-50 hover:text-red-600 transition-colors text-sm"
                >
                  Cancel Order
                </button>
              )}
              {order.status === "delivered" && (
                <p className="text-center text-green-600 font-semibold py-2">✓ Order Complete</p>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
