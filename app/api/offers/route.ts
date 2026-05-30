import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

// GET /api/offers — fetch active auto-apply offers (for banners)
// GET /api/offers?coupon=CODE — validate a coupon code
export async function GET(req: NextRequest) {
  const supabase = createAdminClient();
  const { searchParams } = new URL(req.url);
  const coupon = searchParams.get("coupon");

  const now = new Date().toISOString();

  if (coupon) {
    // Validate specific coupon
    const { data, error } = await supabase
      .from("offers")
      .select("*")
      .eq("coupon_code", coupon.toUpperCase())
      .eq("is_active", true)
      .lte("starts_at", now)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: "Invalid or expired coupon code" }, { status: 404 });
    }

    // Check expiry
    if (data.ends_at && new Date(data.ends_at) < new Date()) {
      return NextResponse.json({ error: "This coupon has expired" }, { status: 400 });
    }

    // Check usage limit
    if (data.usage_limit && data.usage_count >= data.usage_limit) {
      return NextResponse.json({ error: "This coupon has reached its usage limit" }, { status: 400 });
    }

    return NextResponse.json({ offer: data });
  }

  // Return all active auto-apply offers (no coupon code required)
  const { data } = await supabase
    .from("offers")
    .select("*")
    .eq("is_active", true)
    .is("coupon_code", null)
    .lte("starts_at", now)
    .or(`ends_at.is.null,ends_at.gte.${now}`);

  return NextResponse.json({ offers: data ?? [] });
}
