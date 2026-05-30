"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Navbar from "@/components/customer/Navbar";
import { useCartStore } from "@/store/cartStore";
import { formatCurrency } from "@/lib/utils";
import toast from "react-hot-toast";
import { CheckCircle, Loader2, Banknote, UtensilsCrossed, Bike, ShoppingBag, Tag, X } from "lucide-react";

interface CustomerInfo {
  name: string;
  phone: string;
  email: string;
  address: string;
  table_number: string;
  instructions: string;
}

const ORDER_TYPE_LABELS: Record<string, { label: string; icon: React.ReactNode }> = {
  delivery: { label: "Delivery", icon: <Bike size={16} /> },
  pickup: { label: "Pickup", icon: <ShoppingBag size={16} /> },
  dine_in: { label: "Dine-in", icon: <UtensilsCrossed size={16} /> },
};

interface Offer {
  id: string;
  title: string;
  description?: string;
  type: "percentage" | "fixed" | "free_delivery" | "item_discount";
  value: number;
  coupon_code?: string;
  min_order_aed: number;
  banner_color: string;
  show_banner: boolean;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, branch, orderType, subtotal, deliveryFee, total, clearCart } = useCartStore();
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [orderNumber, setOrderNumber] = useState<string>("");
  const [autoOffers, setAutoOffers] = useState<Offer[]>([]);
  const [appliedOffer, setAppliedOffer] = useState<Offer | null>(null);
  const [couponInput, setCouponInput] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    name: "",
    phone: "",
    email: "",
    address: "",
    table_number: "",
    instructions: "",
  });

  useEffect(() => {
    if (items.length === 0 && !orderId) {
      router.push("/menu");
    }
  }, [items, orderId, router]);

  // Fetch auto-apply offers
  useEffect(() => {
    fetch("/api/offers")
      .then((r) => r.json())
      .then((d) => {
        const eligible = (d.offers ?? []).filter((o: Offer) => subtotal() >= o.min_order_aed);
        setAutoOffers(eligible);
        // Auto-apply best offer
        if (eligible.length > 0 && !appliedOffer) setAppliedOffer(eligible[0]);
      });
  }, []);

  const calcDiscount = (offer: Offer | null): number => {
    if (!offer) return 0;
    if (offer.type === "free_delivery") return deliveryFee();
    if (offer.type === "percentage") return Math.min((subtotal() * offer.value) / 100, subtotal());
    if (offer.type === "fixed") return Math.min(offer.value, subtotal());
    return 0;
  };

  const discount = calcDiscount(appliedOffer);
  const grandTotal = Math.max(0, total() - discount);

  const applyCoupon = async () => {
    if (!couponInput.trim()) return;
    setCouponLoading(true);
    const res = await fetch(`/api/offers?coupon=${couponInput.trim()}`);
    const data = await res.json();
    if (!res.ok) {
      toast.error(data.error ?? "Invalid coupon");
    } else {
      const offer: Offer = data.offer;
      if (subtotal() < offer.min_order_aed) {
        toast.error(`Minimum order AED ${offer.min_order_aed} required`);
      } else {
        setAppliedOffer(offer);
        toast.success(`Coupon applied! ${offer.title}`);
      }
    }
    setCouponLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!customerInfo.name || !customerInfo.phone) {
      toast.error("Please fill in your name and phone number");
      return;
    }
    if (orderType === "delivery" && !customerInfo.address) {
      toast.error("Please enter your delivery address");
      return;
    }
    if (orderType === "dine_in" && !customerInfo.table_number) {
      toast.error("Please enter your table number");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          branch_id: branch?.id ?? "00000000-0000-0000-0000-000000000001",
          customer_name: customerInfo.name,
          customer_phone: customerInfo.phone,
          customer_email: customerInfo.email,
          order_type: orderType,
          delivery_address: orderType === "delivery" ? customerInfo.address : null,
          table_number: orderType === "dine_in" ? customerInfo.table_number : null,
          items,
          subtotal_aed: subtotal(),
          delivery_fee_aed: appliedOffer?.type === "free_delivery" ? 0 : deliveryFee(),
          discount_aed: discount,
          coupon_code: appliedOffer?.coupon_code ?? null,
          total_aed: grandTotal,
          payment_method: "cash",
          payment_status: "pending",
          special_instructions: customerInfo.instructions,
        }),
      });

      const data = await res.json();
      if (data.order) {
        clearCart();
        setOrderId(data.order.id);
        setOrderNumber(data.order.order_number);
      } else {
        toast.error("Failed to place order. Please try again.");
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    }
    setLoading(false);
  };

  // ---- Success screen ----
  if (orderId) {
    return (
      <div className="min-h-screen bg-brand-cream flex items-center justify-center p-6">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-3xl p-10 text-center max-w-md shadow-xl w-full"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
          >
            <CheckCircle size={72} className="text-green-500 mx-auto mb-4" />
          </motion.div>
          <h2 className="font-heading text-3xl font-bold text-brand-charcoal mb-2">Order Placed!</h2>
          <p className="text-gray-500 mb-1">Order number</p>
          <p className="font-mono font-bold text-brand-red text-lg mb-4">{orderNumber}</p>

          <div className="bg-brand-cream rounded-2xl p-4 mb-6 text-sm text-brand-brown space-y-1">
            {orderType === "delivery" && <p>🚴 Your food is being prepared and will be delivered soon.</p>}
            {orderType === "pickup" && <p>🏃 Your order is being prepared. Please collect it from the counter.</p>}
            {orderType === "dine_in" && <p>🍽️ Your order has been sent to the kitchen. It will be served at your table.</p>}
            <p className="font-semibold mt-2">💵 Pay on {orderType === "dine_in" ? "receipt" : "delivery"}</p>
          </div>

          <div className="flex flex-col gap-3">
            <button
              onClick={() => router.push(`/track/${orderId}`)}
              className="bg-brand-red text-white px-8 py-3 rounded-full font-bold"
            >
              Track Your Order →
            </button>
            <button
              onClick={() => router.push("/menu")}
              className="text-gray-400 text-sm underline"
            >
              Order more
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  const orderTypeInfo = ORDER_TYPE_LABELS[orderType] ?? ORDER_TYPE_LABELS.delivery;

  return (
    <>
      <Navbar />
      <div className="max-w-5xl mx-auto px-6 py-10 grid md:grid-cols-5 gap-8">
        {/* Left — form */}
        <div className="md:col-span-3 space-y-5">
          <h1 className="font-heading text-3xl font-bold text-brand-charcoal">Checkout</h1>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Customer details */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
              <h3 className="font-heading font-bold text-brand-charcoal text-lg">Your Details</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    placeholder="Ahmed Al Rashid"
                    value={customerInfo.name}
                    onChange={(e) => setCustomerInfo((p) => ({ ...p, name: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-red"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                  <input
                    type="tel"
                    placeholder="+971 50 000 0000"
                    value={customerInfo.phone}
                    onChange={(e) => setCustomerInfo((p) => ({ ...p, phone: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-red"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email (optional)</label>
                <input
                  type="email"
                  placeholder="ahmed@email.com"
                  value={customerInfo.email}
                  onChange={(e) => setCustomerInfo((p) => ({ ...p, email: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-red"
                />
              </div>

              {/* Conditional fields */}
              {orderType === "delivery" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Address *</label>
                  <textarea
                    rows={2}
                    placeholder="Building name, apartment number, street, area..."
                    value={customerInfo.address}
                    onChange={(e) => setCustomerInfo((p) => ({ ...p, address: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-red resize-none"
                    required
                  />
                </div>
              )}

              {orderType === "dine_in" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Table Number *</label>
                  <input
                    type="text"
                    placeholder="e.g. Table 5"
                    value={customerInfo.table_number}
                    onChange={(e) => setCustomerInfo((p) => ({ ...p, table_number: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-red"
                    required
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Special Instructions (optional)</label>
                <textarea
                  rows={2}
                  placeholder="Dietary requirements, allergies, special requests..."
                  value={customerInfo.instructions}
                  onChange={(e) => setCustomerInfo((p) => ({ ...p, instructions: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-red resize-none"
                />
              </div>
            </div>

            {/* Offers & Coupons */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
              <h3 className="font-heading font-bold text-brand-charcoal text-lg">Offers & Discounts</h3>

              {/* Auto-applied offer banner */}
              {appliedOffer && (
                <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-xl px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Tag size={16} className="text-green-600 shrink-0" />
                    <div>
                      <p className="font-semibold text-green-800 text-sm">{appliedOffer.title}</p>
                      {discount > 0 && <p className="text-green-600 text-xs">You save {formatCurrency(discount)}</p>}
                    </div>
                  </div>
                  <button onClick={() => { setAppliedOffer(null); setCouponInput(""); }}
                    className="text-green-500 hover:text-green-700 p-1">
                    <X size={16} />
                  </button>
                </div>
              )}

              {/* Coupon input */}
              {!appliedOffer && (
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter coupon code"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), applyCoupon())}
                    className="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-sm font-mono uppercase focus:outline-none focus:border-brand-red"
                  />
                  <button type="button" onClick={applyCoupon} disabled={couponLoading || !couponInput.trim()}
                    className="bg-brand-charcoal text-white px-4 py-3 rounded-xl text-sm font-semibold hover:bg-brand-charcoal-light disabled:opacity-50 flex items-center gap-1.5">
                    {couponLoading ? <Loader2 size={14} className="animate-spin" /> : <Tag size={14} />}
                    Apply
                  </button>
                </div>
              )}

              {/* Eligible auto-offers (not yet applied) */}
              {!appliedOffer && autoOffers.length > 0 && (
                <div className="space-y-2">
                  {autoOffers.map((offer) => (
                    <button key={offer.id} type="button" onClick={() => setAppliedOffer(offer)}
                      className="w-full flex items-center gap-3 p-3 border border-dashed border-green-300 rounded-xl hover:bg-green-50 transition-colors text-left">
                      <Tag size={14} className="text-green-600 shrink-0" />
                      <div>
                        <p className="text-sm font-semibold text-green-700">{offer.title}</p>
                        {offer.description && <p className="text-xs text-green-600">{offer.description}</p>}
                      </div>
                      <span className="ml-auto text-xs text-green-600 font-medium">Apply</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Payment method */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h3 className="font-heading font-bold text-brand-charcoal text-lg mb-4">Payment</h3>
              <div className="flex items-center gap-4 bg-green-50 border border-green-200 rounded-xl p-4">
                <Banknote size={24} className="text-green-600 shrink-0" />
                <div>
                  <p className="font-semibold text-green-800">Cash on {orderType === "dine_in" ? "Receipt" : "Delivery"}</p>
                  <p className="text-green-700 text-xs mt-0.5">
                    {orderType === "dine_in"
                      ? "Pay when your bill arrives at the table"
                      : orderType === "pickup"
                      ? "Pay when you collect your order"
                      : "Pay when your order is delivered"}
                  </p>
                </div>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-red hover:bg-brand-red-dark disabled:opacity-50 text-white py-4 rounded-2xl font-bold text-base transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" /> Placing Order...
                </>
              ) : (
                `Place Order · ${formatCurrency(grandTotal)}`
              )}
            </button>
          </form>
        </div>

        {/* Right — order summary */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-2xl border border-gray-100 p-6 sticky top-20">
            <h3 className="font-heading font-bold text-brand-charcoal text-lg mb-4">Order Summary</h3>

            {/* Order type badge */}
            <div className="flex items-center gap-2 bg-brand-cream rounded-xl px-4 py-2.5 text-sm text-brand-brown mb-4">
              {orderTypeInfo.icon}
              <span>{branch?.name ?? "Branch"} · {orderTypeInfo.label}</span>
            </div>

            <div className="space-y-3 mb-4">
              {items.map((item) => (
                <div key={item.menu_item.id} className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    {item.menu_item.name}{" "}
                    <span className="text-gray-400">×{item.quantity}</span>
                  </span>
                  <span className="font-medium text-brand-charcoal">
                    {formatCurrency(item.menu_item.price_aed * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-100 pt-4 space-y-2 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal())}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Delivery</span>
                <span>{(deliveryFee() === 0 || appliedOffer?.type === "free_delivery") ? "FREE" : formatCurrency(deliveryFee())}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-600 font-medium">
                  <span className="flex items-center gap-1"><Tag size={11} /> Discount</span>
                  <span>- {formatCurrency(discount)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-base text-brand-charcoal border-t border-gray-100 pt-2">
                <span>Total</span>
                <span className="text-brand-red">{formatCurrency(grandTotal)}</span>
              </div>
            </div>

            <p className="text-center text-xs text-gray-400 mt-4">
              💵 Pay on {orderType === "dine_in" ? "receipt" : orderType === "pickup" ? "collection" : "delivery"}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
