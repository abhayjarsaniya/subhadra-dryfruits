import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { getAllCustomers } from "@/lib/repository";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const isAuth = await isAdminAuthenticated(req);
  if (!isAuth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || undefined;
    const customers = getAllCustomers(search);
    return NextResponse.json(customers);
  } catch (error: any) {
    console.error("Customers GET error:", error);
    return NextResponse.json([]);
  }
}
