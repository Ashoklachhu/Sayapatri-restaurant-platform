-- ============================================================
-- FIX: Infinite recursion in dashboard_users RLS policies
-- Run this in Supabase SQL Editor
-- ============================================================

-- Step 1: Drop the recursive policies
drop policy if exists "dashboard_users_admin_all" on dashboard_users;
drop policy if exists "orders_branch_manager_read" on orders;
drop policy if exists "orders_branch_manager_update" on orders;
drop policy if exists "order_items_staff_read" on order_items;
drop policy if exists "menu_categories_admin_all" on menu_categories;
drop policy if exists "menu_items_staff_write" on menu_items;
drop policy if exists "branches_admin_all" on branches;

-- Step 2: Create security definer helpers (bypass RLS when checking roles)
create or replace function is_super_admin()
returns boolean
language sql
security definer
stable
as $$
  select exists (
    select 1 from dashboard_users
    where id = auth.uid() and role = 'super_admin'
  );
$$;

create or replace function is_dashboard_user()
returns boolean
language sql
security definer
stable
as $$
  select exists (
    select 1 from dashboard_users
    where id = auth.uid()
  );
$$;

create or replace function user_branch_id()
returns uuid
language sql
security definer
stable
as $$
  select branch_id from dashboard_users
  where id = auth.uid()
  limit 1;
$$;

-- Step 3: Re-create policies using the helper functions

-- dashboard_users
create policy "dashboard_users_admin_all" on dashboard_users for all
  using (is_super_admin());

-- branches
create policy "branches_admin_all" on branches for all
  using (is_super_admin());

-- menu_categories
create policy "menu_categories_admin_all" on menu_categories for all
  using (is_dashboard_user());

-- menu_items
create policy "menu_items_staff_write" on menu_items for all
  using (is_dashboard_user());

-- orders: branch managers see their branch, super admin sees all
create policy "orders_branch_manager_read" on orders for select
  using (
    is_super_admin()
    or (is_dashboard_user() and branch_id = user_branch_id())
  );

create policy "orders_branch_manager_update" on orders for update
  using (
    is_super_admin()
    or (is_dashboard_user() and branch_id = user_branch_id())
  );

-- order_items: any dashboard user can read
create policy "order_items_staff_read" on order_items for select
  using (is_dashboard_user());
