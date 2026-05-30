// Stripe payment reserved for future use
export async function POST() {
  return Response.json({ message: "Payment via cash only at this time." }, { status: 503 });
}
