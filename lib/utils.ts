import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return `AED ${amount.toFixed(2)}`;
}

export function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 5).toUpperCase();
  return `SAY-${timestamp}-${random}`;
}

export function getOrderStatusLabel(status: string, orderType?: string): string {
  if (orderType === "dine_in") {
    const labels: Record<string, string> = {
      pending: "Order Received",
      confirmed: "Confirmed",
      preparing: "Being Prepared",
      ready: "Served at Table",
      cancelled: "Cancelled",
    };
    return labels[status] ?? status;
  }
  if (orderType === "pickup") {
    const labels: Record<string, string> = {
      pending: "Order Received",
      confirmed: "Confirmed",
      preparing: "Being Prepared",
      ready: "Ready for Pickup",
      delivered: "Collected",
      cancelled: "Cancelled",
    };
    return labels[status] ?? status;
  }
  // delivery (default)
  const labels: Record<string, string> = {
    pending: "Order Received",
    confirmed: "Confirmed",
    preparing: "Being Prepared",
    ready: "Ready",
    out_for_delivery: "Out for Delivery",
    delivered: "Delivered",
    cancelled: "Cancelled",
  };
  return labels[status] ?? status;
}

export function getStatusFlow(orderType?: string): string[] {
  if (orderType === "dine_in") {
    return ["pending", "confirmed", "preparing", "ready"];
  }
  if (orderType === "pickup") {
    return ["pending", "confirmed", "preparing", "ready", "delivered"];
  }
  return ["pending", "confirmed", "preparing", "ready", "out_for_delivery", "delivered"];
}

export function getOrderStatusColor(status: string): string {
  const colors: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    confirmed: "bg-blue-100 text-blue-800",
    preparing: "bg-orange-100 text-orange-800",
    ready: "bg-green-100 text-green-800",
    out_for_delivery: "bg-purple-100 text-purple-800",
    delivered: "bg-green-200 text-green-900",
    cancelled: "bg-red-100 text-red-800",
  };
  return colors[status] ?? "bg-gray-100 text-gray-800";
}
