import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
  // Verify the requester is a logged-in dashboard user
  const supabaseAuth = await createClient();
  const { data: { user } } = await supabaseAuth.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createAdminClient();

  // Check if user is a dashboard user and get their role/branch
  const { data: dashUser } = await supabase
    .from("dashboard_users")
    .select("role, branch_id")
    .eq("id", user.id)
    .single();

  if (!dashUser) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");

  let query = supabase
    .from("orders")
    .select("*, branch:branches(name, location), items:order_items(id, name, price_aed, quantity, special_instructions)")
    .order("created_at", { ascending: false })
    .limit(200);

  // Branch managers only see their branch
  if (dashUser.role === "branch_manager" && dashUser.branch_id) {
    query = query.eq("branch_id", dashUser.branch_id);
  }

  if (status && status !== "all") {
    query = query.eq("status", status);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Dashboard orders fetch error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ orders: data ?? [] });
}

export async function PATCH(req: NextRequest) {
  // Verify logged-in dashboard user
  const supabaseAuth = await createClient();
  const { data: { user } } = await supabaseAuth.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { orderId, status } = await req.json();

  const supabase = createAdminClient();
  const { error } = await supabase
    .from("orders")
    .update({ status })
    .eq("id", orderId);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
