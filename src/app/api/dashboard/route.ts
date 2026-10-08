import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { getDashboardMetrics } from "@/lib/repository";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const isAuth = await isAdminAuthenticated(req);
  if (!isAuth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const metrics = getDashboardMetrics();
    return NextResponse.json(metrics);
  } catch (error: any) {
    console.error("Dashboard metrics error:", error);
    return NextResponse.json({
      totalSales: 0,
      todaySales: 0,
      totalOrders: 0,
      pendingOrders: 0,
      completedOrders: 0,
      totalProducts: 46,
      outOfStockProducts: 0,
      lowStockProducts: 0,
      totalCustomers: 0,
      recentOrders: [],
      bestSellers: [],
      lowStockItems: [],
    });
  }
}
