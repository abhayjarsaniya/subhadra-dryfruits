import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const uid = searchParams.get("uid");

    if (!uid) {
      return NextResponse.json({ error: "Customer UID required" }, { status: 400 });
    }

    const db = getDb();
    // Query orders matching customer_uid or customer phone
    const orders = db
      .prepare(
        "SELECT * FROM orders WHERE customer_uid = ? OR customer_email = ? ORDER BY created_at DESC"
      )
      .all(uid, uid) as any[];

    const parsed = orders.map((o) => ({
      ...o,
      items: JSON.parse(o.items_json || "[]"),
    }));

    return NextResponse.json({ orders: parsed });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
