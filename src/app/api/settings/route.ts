import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { getStoreSettings, saveStoreSettings } from "@/lib/repository";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const settings = getStoreSettings();
    // Safe public subset if unauthenticated or full if admin
    const isAuth = await isAdminAuthenticated(req);
    if (!isAuth) {
      return NextResponse.json({
        shipping_fee: settings.shipping_fee,
        free_shipping_threshold: settings.free_shipping_threshold,
        shipping_notes: settings.shipping_notes,
        currency_symbol: settings.currency_symbol,
        enable_cod: settings.enable_cod,
        announcement_bar_enabled: settings.announcement_bar_enabled,
        announcement_bar_text: settings.announcement_bar_text,
      });
    }
    return NextResponse.json(settings);
  } catch (error: any) {
    console.error("Settings GET error:", error);
    return NextResponse.json({
      shipping_fee: 99,
      free_shipping_threshold: 1499,
      shipping_notes: "Standard fast doorstep delivery across India in 2–4 business days.",
      currency_symbol: "₹",
      enable_cod: true,
      announcement_bar_enabled: true,
      announcement_bar_text: "Complimentary express shipping on all orders above ₹1,499 · Fresh harvest guaranteed",
    });
  }
}

export async function POST(req: NextRequest) {
  const isAuth = await isAdminAuthenticated(req);
  if (!isAuth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await req.json();
    const saved = saveStoreSettings(data);
    return NextResponse.json({ success: true, settings: saved });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
