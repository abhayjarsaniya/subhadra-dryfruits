"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { formatPrice } from "@/lib/format";
import { adminFetch } from "@/lib/admin-client";
import {
  TrendingUp,
  ShoppingBag,
  Package,
  AlertTriangle,
  RefreshCw,
  Plus,
  SlidersHorizontal,
  ArrowRight,
} from "lucide-react";

type DashboardData = {
  totalSales: number;
  todaySales: number;
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  totalProducts: number;
  outOfStockProducts: number;
  lowStockProducts: number;
  totalCustomers: number;
  recentOrders: Array<{
    id: string;
    order_number: string;
    customer_name: string;
    customer_phone: string;
    payment_method: string;
    order_status: string;
    total_amount: number;
    items: any[];
  }>;
  bestSellers: any[];
  lowStockItems: Array<{
    id: string;
    name: string;
    group_name: string;
    sku: string;
    stock_qty: number;
  }>;
};

export default function AdminDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  async function fetchDashboard() {
    try {
      const res = await adminFetch("/api/dashboard");
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (e) {
      console.error("Failed to load dashboard metrics:", e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    fetchDashboard();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchDashboard();
  };

  const d = data || {
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
  };

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold text-ink sm:text-3xl">Executive Dashboard</h1>
          <p className="text-xs text-stone-500">Real-time database store metrics, stock status, and recent orders</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="inline-flex items-center gap-1.5 rounded-xl border border-stone-200 bg-white px-3 py-2 text-xs font-semibold text-stone-700 hover:bg-stone-50 disabled:opacity-50"
            title="Refresh metrics"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? "animate-spin text-[#6E2635]" : ""}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
          <Link
            href="/admin/products"
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#6E2635] px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-[#5A1E2B]"
          >
            <Plus className="h-3.5 w-3.5" />
            Add Product
          </Link>
          <Link
            href="/admin/sections"
            className="inline-flex items-center gap-1.5 rounded-xl border border-stone-200 bg-white px-3.5 py-2 text-xs font-semibold text-stone-700 hover:bg-stone-50"
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
            Homepage
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
          {loading ? (
            <div className="mt-3 h-8 w-28 animate-pulse rounded-md bg-stone-100" />
          ) : (
            <>
              <p className="mt-2 font-serif text-2xl font-bold text-ink">{formatPrice(d.totalSales)}</p>
              <p className="mt-1 text-[11px] text-stone-400">Today: {formatPrice(d.todaySales)}</p>
            </>
          )}
        </div>

        {/* Total Orders */}
        <div className="rounded-2xl border border-stone-200/80 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-stone-500">Orders Received</span>
            <span className="rounded-lg bg-blue-50 p-2 text-blue-600">
              <ShoppingBag className="h-4 w-4" />
            </span>
          </div>
          {loading ? (
            <div className="mt-3 h-8 w-20 animate-pulse rounded-md bg-stone-100" />
          ) : (
            <>
              <p className="mt-2 font-serif text-2xl font-bold text-ink">{d.totalOrders}</p>
              <div className="mt-1 flex items-center gap-2 text-[11px]">
                <span className="font-semibold text-amber-600">{d.pendingOrders} pending</span>
                <span>·</span>
                <span className="text-emerald-700">{d.completedOrders} completed</span>
              </div>
            </>
          )}
        </div>

        {/* Active Products */}
        <div className="rounded-2xl border border-stone-200/80 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-stone-500">Catalog Products</span>
            <span className="rounded-lg bg-purple-50 p-2 text-purple-600">
              <Package className="h-4 w-4" />
            </span>
          </div>
          {loading ? (
            <div className="mt-3 h-8 w-16 animate-pulse rounded-md bg-stone-100" />
          ) : (
            <>
              <p className="mt-2 font-serif text-2xl font-bold text-ink">{d.totalProducts}</p>
              <p className="mt-1 text-[11px] text-stone-400">Scalable to 250+ products</p>
            </>
          )}
        </div>

        {/* Inventory Warning */}
        <div className="rounded-2xl border border-stone-200/80 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-stone-500">Stock Alerts</span>
            <span className="rounded-lg bg-amber-50 p-2 text-amber-600">
              <AlertTriangle className="h-4 w-4" />
            </span>
          </div>
          {loading ? (
            <div className="mt-3 h-8 w-16 animate-pulse rounded-md bg-stone-100" />
          ) : (
            <>
              <p className="mt-2 font-serif text-2xl font-bold text-ink">
                {d.lowStockProducts + d.outOfStockProducts}
              </p>
              <div className="mt-1 flex items-center gap-2 text-[11px]">
                <span className="font-semibold text-rose-600">{d.outOfStockProducts} out of stock</span>
                <span>·</span>
                <span className="text-amber-700">{d.lowStockProducts} low</span>
              </div>
            </>
          )}
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
            {loading ? (
              <div className="space-y-4 py-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="space-y-2">
                      <div className="h-4 w-28 animate-pulse rounded bg-stone-100" />
                      <div className="h-3 w-40 animate-pulse rounded bg-stone-50" />
                    </div>
                    <div className="h-5 w-16 animate-pulse rounded bg-stone-100" />
                  </div>
                ))}
              </div>
            ) : d.recentOrders.length === 0 ? (
              <p className="py-8 text-center text-xs text-stone-400">No orders received yet.</p>
            ) : (
              d.recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between py-3.5">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-bold text-ink">{order.order_number}</p>
                      <span className="rounded-full bg-stone-100 px-2 py-0.5 text-[10px] font-semibold text-stone-600">
                        {order.payment_method.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-xs text-stone-500">{order.customer_name} ({order.customer_phone})</p>
                    <p className="text-[10px] text-stone-400">{order.items?.length || 0} items</p>
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
            {loading ? (
              <div className="space-y-4 py-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="space-y-2">
                      <div className="h-4 w-32 animate-pulse rounded bg-stone-100" />
                      <div className="h-3 w-48 animate-pulse rounded bg-stone-50" />
                    </div>
                    <div className="h-5 w-16 animate-pulse rounded bg-stone-100" />
                  </div>
                ))}
              </div>
            ) : d.lowStockItems.length === 0 ? (
              <p className="py-8 text-center text-xs text-emerald-700">All products are healthy in stock!</p>
            ) : (
              d.lowStockItems.map((prod) => (
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
