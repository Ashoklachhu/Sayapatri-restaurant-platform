import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem, MenuItem, Branch, OrderType } from "@/types";

interface CartState {
  items: CartItem[];
  branch: Branch | null;
  orderType: OrderType;
  // Actions
  addItem: (item: MenuItem, quantity?: number, instructions?: string) => void;
  removeItem: (menuItemId: string) => void;
  updateQuantity: (menuItemId: string, quantity: number) => void;
  clearCart: () => void;
  setBranch: (branch: Branch) => void;
  setOrderType: (type: OrderType) => void;
  // Computed
  totalItems: () => number;
  subtotal: () => number;
  deliveryFee: () => number;
  total: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      branch: null,
      orderType: "delivery",

      addItem: (menuItem, quantity = 1, instructions) => {
        set((state) => {
          const existing = state.items.find(
            (i) => i.menu_item.id === menuItem.id
          );
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.menu_item.id === menuItem.id
                  ? { ...i, quantity: i.quantity + quantity }
                  : i
              ),
            };
          }
          return {
            items: [
              ...state.items,
              { menu_item: menuItem, quantity, special_instructions: instructions },
            ],
          };
        });
      },

      removeItem: (menuItemId) => {
        set((state) => ({
          items: state.items.filter((i) => i.menu_item.id !== menuItemId),
        }));
      },

      updateQuantity: (menuItemId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(menuItemId);
          return;
        }
        set((state) => ({
          items: state.items.map((i) =>
            i.menu_item.id === menuItemId ? { ...i, quantity } : i
          ),
        }));
      },

      clearCart: () => set({ items: [] }),

      setBranch: (branch) => set({ branch }),

      setOrderType: (orderType) => set({ orderType }),

      totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),

      subtotal: () =>
        get().items.reduce(
          (sum, i) => sum + i.menu_item.price_aed * i.quantity,
          0
        ),

      deliveryFee: () => {
        const { orderType, branch } = get();
        if (orderType === "pickup" || orderType === "dine_in") return 0;
        return branch?.delivery_fee_aed ?? 0;
      },

      total: () => get().subtotal() + get().deliveryFee(),
    }),
    {
      name: "sayapatri-cart-v2",
    }
  )
);
