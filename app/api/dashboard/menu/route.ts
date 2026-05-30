import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

async function verifyDashboardUser() {
  const supabaseAuth = await createClient();
  const { data: { user } } = await supabaseAuth.auth.getUser();
  if (!user) return null;
  const supabase = createAdminClient();
  const { data } = await supabase.from("dashboard_users").select("role, branch_id").eq("id", user.id).single();
  return data;
}

export async function GET() {
  const dashUser = await verifyDashboardUser();
  if (!dashUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = createAdminClient();
  const [{ data: items }, { data: categories }] = await Promise.all([
    supabase.from("menu_items").select("*, category:menu_categories(id, name)").order("sort_order"),
    supabase.from("menu_categories").select("*").order("sort_order"),
  ]);

  return NextResponse.json({ items: items ?? [], categories: categories ?? [] });
}

export async function POST(req: NextRequest) {
  const dashUser = await verifyDashboardUser();
  if (!dashUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = createAdminClient();
  const body = await req.json();

  const { data, error } = await supabase.from("menu_items").insert({
    category_id: body.category_id,
    name: body.name,
    name_ne: body.name_ne || null,
    description: body.description || null,
    price_aed: parseFloat(body.price_aed),
    image_url: body.image_url || null,
    is_vegetarian: body.is_vegetarian ?? false,
    is_vegan: body.is_vegan ?? false,
    is_spicy: body.is_spicy ?? false,
    spice_level: body.is_spicy ? (body.spice_level ?? 1) : null,
    is_featured: body.is_featured ?? false,
    is_available: body.is_available ?? true,
    prep_time_minutes: body.prep_time_minutes ? parseInt(body.prep_time_minutes) : 20,
    sort_order: body.sort_order ?? 0,
  }).select().single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ item: data });
}

export async function PATCH(req: NextRequest) {
  const dashUser = await verifyDashboardUser();
  if (!dashUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = createAdminClient();
  const body = await req.json();
  const { id, ...updates } = body;

  if (updates.price_aed) updates.price_aed = parseFloat(updates.price_aed);
  if (updates.prep_time_minutes) updates.prep_time_minutes = parseInt(updates.prep_time_minutes);
  if (!updates.is_spicy) updates.spice_level = null;

  const { data, error } = await supabase.from("menu_items").update(updates).eq("id", id).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ item: data });
}

export async function DELETE(req: NextRequest) {
  const dashUser = await verifyDashboardUser();
  if (!dashUser || dashUser.role !== "super_admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const supabase = createAdminClient();
  const { id } = await req.json();
  const { error } = await supabase.from("menu_items").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
