import { NextRequest, NextResponse } from "next/server";
import { getOrderById, updatePaymentStatus } from "@/lib/repository";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { orderId, paymentMethod, paymentDetails, simulateSuccess } = await req.json();

    if (!orderId) {
      return NextResponse.json({ error: "Order ID required" }, { status: 400 });
    }

    const order = getOrderById(orderId);
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Cash on Delivery
    if (paymentMethod === "cod") {
      const updated = updatePaymentStatus(orderId, "pending", "COD");
      return NextResponse.json({
        success: true,
        paymentStatus: "pending",
        order: updated,
        message: "Order placed successfully with Cash on Delivery",
      });
    }

    // Simulated Online Payment Gateway (UPI / Card / NetBanking)
    if (simulateSuccess !== false) {
      const gatewayRef = `TXN_${Date.now()}_${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
      const updated = updatePaymentStatus(orderId, "paid", gatewayRef);

      return NextResponse.json({
        success: true,
        paymentStatus: "paid",
        transactionId: gatewayRef,
        order: updated,
        message: "Payment processed successfully",
      });
    } else {
      updatePaymentStatus(orderId, "failed", "FAILED_USER_OR_DECLINED");
      return NextResponse.json({
        success: false,
        paymentStatus: "failed",
        error: "Payment declined or cancelled by bank",
      }, { status: 400 });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
