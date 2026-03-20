import { NextResponse } from "next/server";
import { getOrderModel } from "@/models";
import { authenticateAdmin } from "@/lib/auth";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const auth = await authenticateAdmin();
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const Order = await getOrderModel();

    const order = await Order.findByIdAndUpdate(id, {
      status: body.status,
      notes: body.notes,
      shippingAddress: body.shippingAddress
    }, { new: true }).lean();

    if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });

    return NextResponse.json({ success: true, message: "Order updated", order });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
