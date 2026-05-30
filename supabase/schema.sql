-- ============================================================
-- SAYAPATRI DATABASE SCHEMA
-- Run this in your Supabase SQL Editor
-- ============================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================================
-- BRANCHES
-- ============================================================
create table branches (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  location text not null, -- e.g. "JLT", "Deira", "Dubai Marina"
  address text not null,
  phone text not null,
  email text,
  is_active boolean default true,
  opening_time time default '10:00',
  closing_time time default '23:00',
  delivery_radius_km numeric(4,1) default 5.0,
  minimum_order_aed numeric(8,2) default 50.00,
  delivery_fee_aed numeric(8,2) default 10.00,
  estimated_delivery_minutes int default 45,
  created_at timestamptz default now()
);

-- Seed branches
insert into branches (name, location, address, phone, email) values
  ('Sayapatri JLT', 'JLT', 'Cluster X, Jumeirah Lake Towers, Dubai', '+971 50 000 0001', 'jlt@sayapatristar.com'),
  ('Sayapatri Deira', 'Deira', 'Al Rigga Street, Deira, Dubai', '+971 50 000 0002', 'deira@sayapatristar.com'),
  ('Sayapatri Dubai Marina', 'Dubai Marina', 'Marina Walk, Dubai Marina, Dubai', '+971 50 000 0003', 'marina@sayapatristar.com'),
  ('Sayapatri Karama', 'Karama', 'Karama Shopping Complex, Dubai', '+971 50 000 0004', 'karama@sayapatristar.com');

-- ============================================================
-- MENU CATEGORIES
-- ============================================================
create table menu_categories (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  name_ne text, -- Nepali name
  description text,
  image_url text,
  sort_order int default 0,
  is_active boolean default true
);

insert into menu_categories (name, name_ne, sort_order) values
  ('Starters', 'स्टार्टर', 1),
  ('Dal Bhat Sets', 'दाल भात', 2),
  ('Curries', 'तरकारी', 3),
  ('Momos', 'मोमो', 4),
  ('Grills & Tandoor', 'ग्रिल', 5),
  ('Breads', 'रोटी', 6),
  ('Rice & Noodles', 'भात र चाउमिन', 7),
  ('Drinks', 'पेय', 8),
  ('Desserts', 'मिठाई', 9);

-- ============================================================
-- MENU ITEMS
-- ============================================================
create table menu_items (
  id uuid primary key default uuid_generate_v4(),
  category_id uuid references menu_categories(id) on delete cascade,
  name text not null,
  name_ne text,
  description text,
  description_ne text,
  price_aed numeric(8,2) not null,
  image_url text,
  is_vegetarian boolean default false,
  is_vegan boolean default false,
  is_spicy boolean default false,
  spice_level int check (spice_level between 1 and 3),
  is_featured boolean default false,
  is_available boolean default true,
  prep_time_minutes int default 20,
  allergens text[],
  sort_order int default 0,
  created_at timestamptz default now()
);

-- ============================================================
-- DASHBOARD USERS (restaurant staff)
-- ============================================================
create table dashboard_users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  full_name text not null,
  role text not null check (role in ('super_admin', 'branch_manager')),
  branch_id uuid references branches(id),
  created_at timestamptz default now()
);

-- ============================================================
-- ORDERS
-- ============================================================
create table orders (
  id uuid primary key default uuid_generate_v4(),
  order_number text not null unique,
  branch_id uuid references branches(id) not null,
  customer_name text not null,
  customer_phone text not null,
  customer_email text not null,
  order_type text not null check (order_type in ('delivery', 'pickup', 'dine_in')),
  delivery_address text,
  table_number text,
  status text not null default 'pending'
    check (status in ('pending','confirmed','preparing','ready','out_for_delivery','delivered','cancelled')),
  subtotal_aed numeric(8,2) not null,
  delivery_fee_aed numeric(8,2) not null default 0,
  total_aed numeric(8,2) not null,
  payment_method text not null default 'cash' check (payment_method in ('cash', 'card')),
  payment_status text not null default 'pending'
    check (payment_status in ('pending','paid','failed','refunded')),
  special_instructions text,
  estimated_ready_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================================
-- ORDER ITEMS
-- ============================================================
create table order_items (
  id uuid primary key default uuid_generate_v4(),
  order_id uuid references orders(id) on delete cascade,
  menu_item_id uuid references menu_items(id),
  name text not null, -- snapshot at time of order
  price_aed numeric(8,2) not null,
  quantity int not null check (quantity > 0),
  special_instructions text
);

-- ============================================================
-- AUTO-UPDATE updated_at
-- ============================================================
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger orders_updated_at
  before update on orders
  for each row execute function update_updated_at();

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

-- Branches: public read
alter table branches enable row level security;
create policy "branches_public_read" on branches for select using (true);
create policy "branches_admin_all" on branches for all
  using (auth.uid() in (select id from dashboard_users where role = 'super_admin'));

-- Menu categories: public read
alter table menu_categories enable row level security;
create policy "menu_categories_public_read" on menu_categories for select using (true);
create policy "menu_categories_admin_all" on menu_categories for all
  using (auth.uid() in (select id from dashboard_users));

-- Menu items: public read
alter table menu_items enable row level security;
create policy "menu_items_public_read" on menu_items for select using (true);
create policy "menu_items_staff_write" on menu_items for all
  using (auth.uid() in (select id from dashboard_users));

-- Orders: customers can insert, staff can read/update their branch
alter table orders enable row level security;
create policy "orders_public_insert" on orders for insert with check (true);
create policy "orders_branch_manager_read" on orders for select
  using (
    auth.uid() in (
      select id from dashboard_users where role = 'super_admin'
      union
      select id from dashboard_users where branch_id = orders.branch_id
    )
  );
create policy "orders_branch_manager_update" on orders for update
  using (
    auth.uid() in (
      select id from dashboard_users where role = 'super_admin'
      union
      select id from dashboard_users where branch_id = orders.branch_id
    )
  );

-- Order items
alter table order_items enable row level security;
create policy "order_items_public_insert" on order_items for insert with check (true);
create policy "order_items_staff_read" on order_items for select
  using (
    auth.uid() in (select id from dashboard_users)
  );

-- Dashboard users: only super admin can manage
alter table dashboard_users enable row level security;
create policy "dashboard_users_self_read" on dashboard_users for select
  using (auth.uid() = id);
create policy "dashboard_users_admin_all" on dashboard_users for all
  using (auth.uid() in (select id from dashboard_users where role = 'super_admin'));

-- ============================================================
-- REALTIME (for live order updates in dashboard)
-- ============================================================
alter publication supabase_realtime add table orders;
alter publication supabase_realtime add table order_items;
