import { redirect } from "next/navigation";
import Link from "next/link";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { getDashboardMetrics } from "@/lib/repository";
import { formatPrice } from "@/lib/format";
import {
  TrendingUp,
  ShoppingBag,
  Clock,
  Package,
  AlertTriangle,
  Users,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) {
    redirect("/admin/login");
  }

  const data = getDashboardMetrics();

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold text-ink sm:text-3xl">Executive Dashboard</h1>
          <p className="text-xs text-stone-500">Real-time database store metrics, stock status, and recent orders</p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/admin/products"
            className="inline-flex items-center gap-2 rounded-xl bg-[#6E2635] px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-[#5A1E2B]"
          >
            + Add Product
          </Link>
          <Link
            href="/admin/sections"
            className="inline-flex items-center gap-2 rounded-xl border border-stone-200 bg-white px-4 py-2 text-xs font-semibold text-stone-700 hover:bg-stone-50"
          >
            Customize Homepage
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Sales */}
        <div className="rounded-2xl border border-stone-200/80 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-stone-500">Total Sales</span>
            <span className="rounded-lg bg-emerald-50 p-2 text-emerald-600">
              <TrendingUp className="h-4 w-4" />
            </span>
          </div>
          <p className="mt-2 font-serif text-2xl font-bold text-ink">{formatPrice(data.totalSales)}</p>
          <p className="mt-1 text-[11px] text-stone-400">Today: {formatPrice(data.todaySales)}</p>
        </div>

        {/* Total Orders */}
        <div className="rounded-2xl border border-stone-200/80 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-stone-500">Orders Received</span>
            <span className="rounded-lg bg-blue-50 p-2 text-blue-600">
              <ShoppingBag className="h-4 w-4" />
            </span>
          </div>
          <p className="mt-2 font-serif text-2xl font-bold text-ink">{data.totalOrders}</p>
          <div className="mt-1 flex items-center gap-2 text-[11px]">
            <span className="font-semibold text-amber-600">{data.pendingOrders} pending</span>
            <span>·</span>
            <span className="text-emerald-700">{data.completedOrders} completed</span>
          </div>
        </div>

        {/* Active Products */}
        <div className="rounded-2xl border border-stone-200/80 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-stone-500">Catalog Products</span>
            <span className="rounded-lg bg-purple-50 p-2 text-purple-600">
              <Package className="h-4 w-4" />
            </span>
          </div>
          <p className="mt-2 font-serif text-2xl font-bold text-ink">{data.totalProducts}</p>
          <p className="mt-1 text-[11px] text-stone-400">Scalable to 250+ products</p>
        </div>

        {/* Inventory Warning */}
        <div className="rounded-2xl border border-stone-200/80 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-stone-500">Stock Alerts</span>
            <span className="rounded-lg bg-amber-50 p-2 text-amber-600">
              <AlertTriangle className="h-4 w-4" />
            </span>
          </div>
          <p className="mt-2 font-serif text-2xl font-bold text-ink">
            {data.lowStockProducts + data.outOfStockProducts}
          </p>
          <div className="mt-1 flex items-center gap-2 text-[11px]">
            <span className="font-semibold text-rose-600">{data.outOfStockProducts} out of stock</span>
            <span>·</span>
            <span className="text-amber-700">{data.lowStockProducts} low</span>
          </div>
        </div>
      </div>

      {/* Two Column Grid: Recent Orders & Stock Warnings */}
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Recent Orders Card */}
        <div className="rounded-3xl border border-stone-200/80 bg-white p-6 shadow-xs">
          <div className="flex items-center justify-between border-b border-stone-100 pb-4">
            <div>
              <h2 className="font-serif text-lg font-bold text-ink">Recent Orders</h2>
              <p className="text-xs text-stone-400">Latest online and COD store inquiries</p>
            </div>
            <Link href="/admin/orders" className="text-xs font-semibold text-[#6E2635] hover:underline">
              View All →
            </Link>
          </div>

          <div className="mt-4 divide-y divide-stone-100">
            {data.recentOrders.length === 0 ? (
              <p className="py-8 text-center text-xs text-stone-400">No orders received yet.</p>
            ) : (
              data.recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between py-3.5">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-bold text-ink">{order.order_number}</p>
                      <span className="rounded-full bg-stone-100 px-2 py-0.5 text-[10px] font-semibold text-stone-600">
                        {order.payment_method.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-xs text-stone-500">{order.customer_name} ({order.customer_phone})</p>
                    <p className="text-[10px] text-stone-400">{order.items.length} items</p>
                  </div>
                  <div className="text-right">
                    <p className="font-serif text-sm font-bold text-ink">{formatPrice(order.total_amount)}</p>
                    <span
                      className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                        order.order_status === "confirmed"
                          ? "bg-blue-50 text-blue-700"
                          : order.order_status === "delivered"
                          ? "bg-emerald-50 text-emerald-700"
                          : order.order_status === "cancelled"
                          ? "bg-rose-50 text-rose-700"
                          : "bg-amber-50 text-amber-700"
                      }`}
                    >
                      {order.order_status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Low Stock Watchlist */}
        <div className="rounded-3xl border border-stone-200/80 bg-white p-6 shadow-xs">
          <div className="flex items-center justify-between border-b border-stone-100 pb-4">
            <div>
              <h2 className="font-serif text-lg font-bold text-ink">Inventory Watchlist</h2>
              <p className="text-xs text-stone-400">Products requiring re-ordering or out of stock</p>
            </div>
            <Link href="/admin/products" className="text-xs font-semibold text-[#6E2635] hover:underline">
              Manage Stock →
            </Link>
          </div>

          <div className="mt-4 divide-y divide-stone-100">
            {data.lowStockItems.length === 0 ? (
              <p className="py-8 text-center text-xs text-emerald-700">All products are healthy in stock!</p>
            ) : (
              data.lowStockItems.map((prod) => (
                <div key={prod.id} className="flex items-center justify-between py-3">
                  <div>
                    <p className="text-xs font-semibold text-ink">{prod.name}</p>
                    <p className="text-[11px] text-stone-500">Group: {prod.group_name} · SKU: {prod.sku}</p>
                  </div>
                  <div className="text-right">
                    <span
                      className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-bold ${
                        prod.stock_qty <= 0
                          ? "bg-rose-100 text-rose-700"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {prod.stock_qty <= 0 ? "Out of Stock" : `${prod.stock_qty} left`}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
