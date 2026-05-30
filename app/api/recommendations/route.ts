import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

// GET /api/recommendations?categoryIds=id1,id2&itemIds=id1,id2
export async function GET(req: NextRequest) {
  const supabase = createAdminClient();
  const { searchParams } = new URL(req.url);
  const categoryIds = searchParams.get("categoryIds")?.split(",").filter(Boolean) ?? [];
  const itemIds = searchParams.get("itemIds")?.split(",").filter(Boolean) ?? [];

  const { data } = await supabase
    .from("recommendations")
    .select("*, recommended_item:menu_items!recommended_item_id(id, name, price_aed, image_url, is_vegetarian, is_spicy, description)")
    .eq("is_active", true)
    .or([
      "trigger_type.eq.always",
      categoryIds.length ? `and(trigger_type.eq.category,trigger_category_id.in.(${categoryIds.join(",")}))` : null,
      itemIds.length ? `and(trigger_type.eq.item,trigger_item_id.in.(${itemIds.join(",")}))` : null,
    ].filter(Boolean).join(","));

  // Deduplicate by recommended_item_id
  const seen = new Set<string>();
  const unique = (data ?? []).filter((r) => {
    if (seen.has(r.recommended_item_id)) return false;
    seen.add(r.recommended_item_id);
    return true;
  });

  return NextResponse.json({ recommendations: unique });
}
