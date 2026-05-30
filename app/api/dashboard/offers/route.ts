import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

async function verifyDashboardUser() {
  const supabaseAuth = await createClient();
  const { data: { user } } = await supabaseAuth.auth.getUser();
  if (!user) return null;
  const supabase = createAdminClient();
  const { data } = await supabase.from("dashboard_users").select("role").eq("id", user.id).single();
  return data;
}

export async function GET() {
  const dashUser = await verifyDashboardUser();
  if (!dashUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("offers")
    .select("*, category:menu_categories(name), item:menu_items(name)")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ offers: data ?? [] });
}

export async function POST(req: NextRequest) {
  const dashUser = await verifyDashboardUser();
  if (!dashUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = createAdminClient();
  const body = await req.json();

  const { data, error } = await supabase.from("offers").insert({
    title: body.title,
    description: body.description || null,
    type: body.type,
    value: parseFloat(body.value ?? 0),
    coupon_code: body.coupon_code?.toUpperCase() || null,
    min_order_aed: parseFloat(body.min_order_aed ?? 0),
    applicable_to: body.applicable_to ?? "all",
    category_id: body.category_id || null,
    item_id: body.item_id || null,
    usage_limit: body.usage_limit ? parseInt(body.usage_limit) : null,
    starts_at: body.starts_at || new Date().toISOString(),
    ends_at: body.ends_at || null,
    is_active: body.is_active ?? true,
    show_banner: body.show_banner ?? true,
    banner_color: body.banner_color ?? "#C0392B",
  }).select().single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ offer: data });
}

export async function PATCH(req: NextRequest) {
  const dashUser = await verifyDashboardUser();
  if (!dashUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = createAdminClient();
  const body = await req.json();
  const { id, ...updates } = body;
  if (updates.coupon_code) updates.coupon_code = updates.coupon_code.toUpperCase();

  const { data, error } = await supabase.from("offers").update(updates).eq("id", id).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ offer: data });
}

export async function DELETE(req: NextRequest) {
  const dashUser = await verifyDashboardUser();
  if (!dashUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = createAdminClient();
  const { id } = await req.json();
  const { error } = await supabase.from("offers").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
