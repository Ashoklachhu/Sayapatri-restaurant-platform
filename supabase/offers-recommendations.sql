-- ============================================================
-- OFFERS, DISCOUNTS & RECOMMENDATIONS
-- Run in Supabase SQL Editor
-- ============================================================

-- ============================================================
-- OFFERS TABLE
-- ============================================================
create table offers (
  id uuid primary key default uuid_generate_v4(),
  title text not null,                        -- "Weekend Special", "Free Delivery Friday"
  description text,                           -- shown to customer
  type text not null check (type in (
    'percentage',     -- % off order total
    'fixed',          -- fixed AED off order total
    'free_delivery',  -- waive delivery fee
    'item_discount'   -- discount on specific item
  )),
  value numeric(8,2) default 0,               -- % or AED amount
  coupon_code text unique,                    -- if null = auto-apply, if set = coupon
  min_order_aed numeric(8,2) default 0,       -- minimum cart value to apply
  applicable_to text default 'all' check (applicable_to in ('all', 'category', 'item')),
  category_id uuid references menu_categories(id) on delete set null,
  item_id uuid references menu_items(id) on delete set null,
  usage_limit int,                            -- null = unlimited
  usage_count int default 0,
  starts_at timestamptz default now(),
  ends_at timestamptz,                        -- null = no expiry
  is_active boolean default true,
  show_banner boolean default true,           -- show promo banner on menu page
  banner_color text default '#C0392B',        -- banner background color
  created_at timestamptz default now()
);

-- ============================================================
-- ORDER OFFERS (track which offers were applied to orders)
-- ============================================================
create table order_offers (
  id uuid primary key default uuid_generate_v4(),
  order_id uuid references orders(id) on delete cascade,
  offer_id uuid references offers(id) on delete set null,
  coupon_code text,
  discount_aed numeric(8,2) not null,
  created_at timestamptz default now()
);

-- ============================================================
-- RECOMMENDATIONS
-- ============================================================
create table recommendations (
  id uuid primary key default uuid_generate_v4(),
  title text not null default 'You might also like',  -- section heading
  trigger_type text not null check (trigger_type in (
    'always',       -- always show these recommendations
    'category',     -- show when cart has item from this category
    'item'          -- show when specific item is in cart
  )),
  trigger_category_id uuid references menu_categories(id) on delete cascade,
  trigger_item_id uuid references menu_items(id) on delete cascade,
  recommended_item_id uuid references menu_items(id) on delete cascade not null,
  sort_order int default 0,
  is_active boolean default true,
  created_at timestamptz default now()
);

-- ============================================================
-- Add discount_aed column to orders
-- ============================================================
alter table orders add column if not exists discount_aed numeric(8,2) default 0;
alter table orders add column if not exists coupon_code text;

-- ============================================================
-- RLS POLICIES
-- ============================================================

-- Offers: public can read active ones
alter table offers enable row level security;
create policy "offers_public_read" on offers for select using (is_active = true);
create policy "offers_admin_all" on offers for all using (is_dashboard_user());

-- Order offers
alter table order_offers enable row level security;
create policy "order_offers_insert" on order_offers for insert with check (true);
create policy "order_offers_admin_read" on order_offers for select using (is_dashboard_user());

-- Recommendations: public read
alter table recommendations enable row level security;
create policy "recommendations_public_read" on recommendations for select using (is_active = true);
create policy "recommendations_admin_all" on recommendations for all using (is_dashboard_user());

-- ============================================================
-- SAMPLE OFFERS (optional — delete if not needed)
-- ============================================================
insert into offers (title, description, type, value, min_order_aed, show_banner, banner_color)
values (
  'Free Delivery on Orders Above AED 150',
  'Order AED 150 or more and get free delivery!',
  'free_delivery', 0, 150, true, '#2D6A4F'
);
