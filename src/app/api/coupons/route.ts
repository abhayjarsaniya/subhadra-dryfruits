import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { getAllCoupons, saveCoupon, deleteCoupon, validateCoupon } from "@/lib/repository";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const subtotal = searchParams.get("subtotal") ? Number(searchParams.get("subtotal")) : 0;

  // Validate coupon for checkout
  if (code) {
    const res = validateCoupon(code, subtotal);
    return NextResponse.json(res);
  }

  // Admin listing coupons
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const coupons = getAllCoupons();
  return NextResponse.json(coupons);
}

export async function POST(req: NextRequest) {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await req.json();
    if (!data.code || data.discount_value == null) {
      return NextResponse.json({ error: "Coupon code and discount value required" }, { status: 400 });
    }

    const saved = saveCoupon(data);
    return NextResponse.json({ success: true, coupon: saved });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

    const ok = deleteCoupon(id);
    return NextResponse.json({ success: ok });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
