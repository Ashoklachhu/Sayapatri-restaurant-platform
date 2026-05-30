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
  const { data } = await supabase
    .from("recommendations")
    .select(`*, recommended_item:menu_items!recommended_item_id(id, name, price_aed, image_url),
      trigger_category:menu_categories!trigger_category_id(id, name),
      trigger_item:menu_items!trigger_item_id(id, name)`)
    .order("sort_order");

  return NextResponse.json({ recommendations: data ?? [] });
}

export async function POST(req: NextRequest) {
  const dashUser = await verifyDashboardUser();
  if (!dashUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = createAdminClient();
  const body = await req.json();

  const { data, error } = await supabase.from("recommendations").insert({
    title: body.title || "You might also like",
    trigger_type: body.trigger_type,
    trigger_category_id: body.trigger_category_id || null,
    trigger_item_id: body.trigger_item_id || null,
    recommended_item_id: body.recommended_item_id,
    sort_order: body.sort_order ?? 0,
    is_active: body.is_active ?? true,
  }).select().single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ recommendation: data });
}

export async function DELETE(req: NextRequest) {
  const dashUser = await verifyDashboardUser();
  if (!dashUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = createAdminClient();
  const { id } = await req.json();
  await supabase.from("recommendations").delete().eq("id", id);
  return NextResponse.json({ success: true });
}
