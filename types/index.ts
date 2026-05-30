export type Branch = {
  id: string;
  name: string;
  location: string;
  address: string;
  phone: string;
  email: string;
  is_active: boolean;
  opening_time: string;
  closing_time: string;
  delivery_radius_km: number;
  minimum_order_aed: number;
  delivery_fee_aed: number;
  estimated_delivery_minutes: number;
  created_at: string;
};

export type MenuCategory = {
  id: string;
  name: string;
  name_ne?: string; // Nepali name
  description?: string;
  image_url?: string;
  sort_order: number;
  is_active: boolean;
};

export type MenuItem = {
  id: string;
  category_id: string;
  category?: MenuCategory;
  name: string;
  name_ne?: string;
  description?: string;
  description_ne?: string;
  price_aed: number;
  image_url?: string;
  is_vegetarian: boolean;
  is_vegan: boolean;
  is_spicy: boolean;
  spice_level?: 1 | 2 | 3;
  is_featured: boolean;
  is_available: boolean;
  prep_time_minutes?: number;
  allergens?: string[];
  sort_order: number;
  created_at: string;
};

export type CartItem = {
  menu_item: MenuItem;
  quantity: number;
  special_instructions?: string;
};

export type OrderType = "delivery" | "pickup" | "dine_in";

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "preparing"
  | "ready"
  | "out_for_delivery"
  | "delivered"
  | "cancelled";

export type Order = {
  id: string;
  order_number: string;
  branch_id: string;
  branch?: Branch;
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  order_type: OrderType;
  table_number?: string;
  delivery_address?: string;
  delivery_lat?: number;
  delivery_lng?: number;
  status: OrderStatus;
  items: OrderItem[];
  subtotal_aed: number;
  delivery_fee_aed: number;
  total_aed: number;
  stripe_payment_intent_id?: string;
  payment_status: "pending" | "paid" | "failed" | "refunded";
  special_instructions?: string;
  estimated_ready_at?: string;
  created_at: string;
  updated_at: string;
};

export type OrderItem = {
  id: string;
  order_id: string;
  menu_item_id: string;
  menu_item?: MenuItem;
  name: string;
  price_aed: number;
  quantity: number;
  special_instructions?: string;
};

export type DashboardUser = {
  id: string;
  email: string;
  role: "super_admin" | "branch_manager";
  branch_id?: string;
  branch?: Branch;
  full_name: string;
  created_at: string;
};
