import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { generateOrderNumber } from "@/lib/utils";

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

async function resolveBranchId(supabase: ReturnType<typeof createAdminClient>, branch_id: string): Promise<string | null> {
  // Already a valid UUID — use it directly
  if (UUID_REGEX.test(branch_id)) return branch_id;

  // Stale string id (e.g. "jlt") — look up by location name
  const { data } = await supabase
    .from("branches")
    .select("id")
    .ilike("location", `%${branch_id}%`)
    .limit(1)
    .single();

  return data?.id ?? null;
}

export async function POST(req: NextRequest) {
  try {
    const supabase = createAdminClient();
    const body = await req.json();

    const {
      branch_id,
      customer_name,
      customer_phone,
      customer_email,
      order_type,
      delivery_address,
      table_number,
      items,
      subtotal_aed,
      delivery_fee_aed,
      total_aed,
      payment_method = "cash",
      payment_status = "pending",
      special_instructions,
    } = body;

    // Resolve branch_id to a real UUID
    const resolvedBranchId = await resolveBranchId(supabase, branch_id);
    if (!resolvedBranchId) {
      return NextResponse.json({ error: "Invalid branch. Please select your branch again." }, { status: 400 });
    }

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        order_number: generateOrderNumber(),
        branch_id: resolvedBranchId,
        customer_name,
        customer_phone,
        customer_email: customer_email || null,
        order_type,
        delivery_address: delivery_address || null,
        table_number: table_number || null,
        subtotal_aed,
        delivery_fee_aed,
        total_aed,
        payment_method,
        payment_status,
        special_instructions: special_instructions || null,
        status: "pending",
      })
      .select()
      .single();

    if (orderError) throw orderError;

    const orderItems = items.map((item: {
      menu_item: { id: string; name: string; price_aed: number };
      quantity: number;
      special_instructions?: string;
    }) => ({
      order_id: order.id,
      // Only set menu_item_id if it's a real UUID, otherwise null (static data fallback)
      menu_item_id: UUID_REGEX.test(item.menu_item.id) ? item.menu_item.id : null,
      name: item.menu_item.name,
      price_aed: item.menu_item.price_aed,
      quantity: item.quantity,
      special_instructions: item.special_instructions || null,
    }));

    const { error: itemsError } = await supabase.from("order_items").insert(orderItems);
    if (itemsError) throw itemsError;

    return NextResponse.json({ order });
  } catch (error) {
    console.error("Order creation error:", error);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const supabase = createAdminClient();
  const { searchParams } = new URL(req.url);
  const orderId = searchParams.get("id");

  if (!orderId) return NextResponse.json({ error: "Order ID required" }, { status: 400 });

  const { data, error } = await supabase
    .from("orders")
    .select("*, branch:branches(*), items:order_items(*, menu_item:menu_items(*))")
    .eq("id", orderId)
    .single();

  if (error) return NextResponse.json({ error: "Order not found" }, { status: 404 });
  return NextResponse.json({ order: data });
}
