import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  updatePaymentStatus,
} from "@/lib/repository";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    // Single order lookup (can be accessed by confirmation page or admin)
    if (id) {
      const order = getOrderById(id);
      if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });
      return NextResponse.json(order);
    }

    // Admin listing orders
    const isAuth = await isAdminAuthenticated(req);
    if (!isAuth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const status = searchParams.get("status") || undefined;
    const search = searchParams.get("search") || undefined;
    const limit = searchParams.get("limit") ? Number(searchParams.get("limit")) : undefined;
    const offset = searchParams.get("offset") ? Number(searchParams.get("offset")) : undefined;

    const result = getAllOrders({ status, search, limit, offset });
    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Orders GET error:", error);
    return NextResponse.json({ orders: [], total: 0 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    if (!data.customer_name || !data.customer_phone || !data.address_line1 || !data.city || !data.state || !data.pincode) {
      return NextResponse.json({ error: "Please provide complete delivery details" }, { status: 400 });
    }

    if (!data.items || !Array.isArray(data.items) || data.items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    const { order, error } = createOrder(data);
    if (error) {
      return NextResponse.json({ error }, { status: 400 });
    }

    return NextResponse.json({ success: true, order });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const isAuth = await isAdminAuthenticated(req);
  if (!isAuth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await req.json();
    const { id, order_status, payment_status, payment_gateway_ref } = data;

    if (!id) {
      return NextResponse.json({ error: "Order ID is required" }, { status: 400 });
    }

    let updated = null;
    if (order_status) {
      updated = updateOrderStatus(id, order_status);
    }
    if (payment_status) {
      updated = updatePaymentStatus(id, payment_status, payment_gateway_ref || "");
    }

    return NextResponse.json({ success: true, order: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
