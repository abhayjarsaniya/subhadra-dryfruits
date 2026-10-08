"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { formatPrice } from "@/lib/format";
import { Search, Filter, Eye, X, CheckCircle, Clock, Truck, Ban } from "lucide-react";
import { adminFetch } from "@/lib/admin-client";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [activeOrder, setActiveOrder] = useState<any | null>(null);

  useEffect(() => {
    fetchOrders();
  }, [search, statusFilter]);

  async function fetchOrders() {
    setLoading(true);
    try {
      const res = await adminFetch(
        `/api/orders?status=${statusFilter}&search=${encodeURIComponent(search)}`
      );
      const data = await res.json();
      setOrders(data.orders || []);
      setTotal(data.total || 0);
    } catch {
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdateStatus(orderId: string, order_status: string) {
    try {
      const res = await adminFetch("/api/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: orderId, order_status }),
      });
      if (res.ok) {
        fetchOrders();
        if (activeOrder && activeOrder.id === orderId) {
          setActiveOrder((prev: any) => ({ ...prev, order_status }));
        }
      }
    } catch {}
  }

  async function handleUpdatePayment(orderId: string, payment_status: string) {
    try {
      const res = await adminFetch("/api/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: orderId, payment_status }),
      });
      if (res.ok) {
        fetchOrders();
        if (activeOrder && activeOrder.id === orderId) {
          setActiveOrder((prev: any) => ({ ...prev, payment_status }));
        }
      }
    } catch {}
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold text-ink sm:text-3xl">Order Management</h1>
          <p className="text-xs text-stone-500">
            Fulfill orders, track payments, manage lifecycle: Pending → Confirmed → Shipped → Delivered
          </p>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col gap-3 rounded-2xl border border-stone-200 bg-white p-4 shadow-xs sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-stone-400" />
          <input
            type="text"
            placeholder="Search by order ID, customer name, or phone number..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-10 w-full rounded-xl border border-stone-200 pl-10 pr-4 text-xs text-ink outline-none transition focus:border-[#6E2635]"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-stone-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-10 rounded-xl border border-stone-200 bg-white px-3 text-xs font-medium text-stone-700 outline-none focus:border-[#6E2635]"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="processing">Processing</option>
            <option value="packed">Packed</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
            <option value="refunded">Refunded</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="overflow-hidden rounded-2xl border border-stone-200/80 bg-white shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-stone-600">
            <thead className="border-b border-stone-200/80 bg-[#FAF8F6] text-[11px] font-bold uppercase tracking-wider text-stone-500">
              <tr>
                <th className="p-4">Order #</th>
                <th className="p-4">Customer Details</th>
                <th className="p-4">Items</th>
                <th className="p-4">Total Amount</th>
                <th className="p-4">Payment</th>
                <th className="p-4">Fulfillment Status</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="p-10 text-center text-xs text-stone-400">
                    Loading orders...
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-10 text-center text-xs text-stone-400">
                    No orders found.
                  </td>
                </tr>
              ) : (
                orders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-stone-50/60 transition">
                    <td className="p-4">
                      <p className="font-bold text-ink">{ord.order_number}</p>
                      <p className="text-[10px] text-stone-400">{new Date(ord.created_at).toLocaleDateString()}</p>
                    </td>

                    <td className="p-4">
                      <p className="font-semibold text-stone-800">{ord.customer_name}</p>
                      <p className="text-[11px] text-stone-500">{ord.customer_phone}</p>
                      <p className="text-[10px] text-stone-400">{ord.city}, {ord.state}</p>
                    </td>

                    <td className="p-4">
                      <p className="font-medium text-stone-700">{ord.items.length} items</p>
                      <p className="text-[10px] text-stone-400 line-clamp-1">
                        {ord.items.map((i: any) => `${i.name} (${i.qty})`).join(", ")}
                      </p>
                    </td>

                    <td className="p-4">
                      <p className="font-serif font-bold text-ink sm:text-sm">{formatPrice(ord.total_amount)}</p>
                      <span className="text-[10px] uppercase text-stone-400">{ord.payment_method}</span>
                    </td>

                    <td className="p-4">
                      <select
                        value={ord.payment_status}
                        onChange={(e) => handleUpdatePayment(ord.id, e.target.value)}
                        className={`rounded-lg px-2 py-1 text-[11px] font-semibold border ${
                          ord.payment_status === "paid"
                            ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                            : ord.payment_status === "refunded"
                            ? "bg-purple-50 text-purple-800 border-purple-200"
                            : "bg-amber-50 text-amber-800 border-amber-200"
                        }`}
                      >
                        <option value="pending">Pending</option>
                        <option value="paid">Paid</option>
                        <option value="failed">Failed</option>
                        <option value="refunded">Refunded</option>
                      </select>
                    </td>

                    <td className="p-4">
                      <select
                        value={ord.order_status}
                        onChange={(e) => handleUpdateStatus(ord.id, e.target.value)}
                        className="rounded-lg border border-stone-200 bg-white px-2 py-1 text-[11px] font-semibold text-stone-700 outline-none"
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="processing">Processing</option>
                        <option value="packed">Packed</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled (Restore Stock)</option>
                        <option value="refunded">Refunded</option>
                      </select>
                    </td>

                    <td className="p-4 text-right">
                      <button
                        type="button"
                        onClick={() => setActiveOrder(ord)}
                        className="inline-flex items-center gap-1 rounded-lg border border-stone-200 px-2.5 py-1 text-xs font-semibold text-stone-600 hover:bg-stone-50 hover:text-[#6E2635]"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        <span>View</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Modal */}
      {activeOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/50 p-4 backdrop-blur-xs">
          <div className="relative max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl sm:p-8">
            <div className="flex items-center justify-between border-b border-stone-100 pb-4">
              <div>
                <h2 className="font-serif text-xl font-bold text-ink sm:text-2xl">
                  Order #{activeOrder.order_number}
                </h2>
                <p className="text-xs text-stone-500">Placed on {new Date(activeOrder.created_at).toLocaleString()}</p>
              </div>
              <button
                type="button"
                onClick={() => setActiveOrder(null)}
                className="rounded-full p-2 text-stone-400 hover:bg-stone-100 hover:text-stone-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-5 space-y-6">
              {/* Customer and shipping details */}
              <div className="grid gap-4 rounded-2xl border border-stone-100 bg-[#FAF8F6] p-4 text-xs sm:grid-cols-2">
                <div>
                  <p className="font-bold text-stone-700">Customer Info</p>
                  <p className="mt-1 font-semibold text-ink">{activeOrder.customer_name}</p>
                  <p className="text-stone-600">Phone: {activeOrder.customer_phone}</p>
                  {activeOrder.customer_email && <p className="text-stone-600">Email: {activeOrder.customer_email}</p>}
                </div>
                <div>
                  <p className="font-bold text-stone-700">Shipping Address</p>
                  <p className="mt-1 text-stone-600">
                    {activeOrder.address_line1}, {activeOrder.address_line2}
                  </p>
                  <p className="text-stone-600">
                    {activeOrder.city}, {activeOrder.state} – {activeOrder.pincode}
                  </p>
                  {activeOrder.delivery_notes && (
                    <p className="mt-1 font-medium text-amber-700">Note: {activeOrder.delivery_notes}</p>
                  )}
                </div>
              </div>

              {/* Items List */}
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-stone-500">Ordered Items</p>
                <ul className="mt-3 divide-y divide-stone-100 border-y border-stone-100">
                  {activeOrder.items.map((it: any, idx: number) => (
                    <li key={idx} className="flex items-center justify-between py-3 text-xs sm:text-sm">
                      <div className="flex items-center gap-3">
                        <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-lg border border-stone-200 bg-white">
                          <Image src={it.image} alt={it.name} fill className="object-contain p-1" sizes="44px" />
                        </div>
                        <div>
                          <p className="font-semibold text-ink">{it.name}</p>
                          <p className="text-[11px] text-stone-500">{it.weight} × {it.qty}</p>
                        </div>
                      </div>
                      <span className="font-serif font-bold text-ink">{formatPrice(it.price * it.qty)}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Calculations */}
              <div className="space-y-1.5 text-xs text-stone-600">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>{formatPrice(activeOrder.subtotal)}</span>
                </div>
                {activeOrder.discount_amount > 0 && (
                  <div className="flex justify-between font-semibold text-emerald-700">
                    <span>Discount ({activeOrder.coupon_code || "Coupon"}):</span>
                    <span>− {formatPrice(activeOrder.discount_amount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Shipping Fee:</span>
                  <span>{activeOrder.shipping_charge === 0 ? "FREE" : formatPrice(activeOrder.shipping_charge)}</span>
                </div>
                <div className="flex justify-between border-t border-stone-200 pt-2 text-sm font-bold text-ink">
                  <span>Total Paid / Payable:</span>
                  <span className="font-serif text-base text-[#6E2635]">
                    {formatPrice(activeOrder.total_amount)}
                  </span>
                </div>
              </div>

              {/* Status Update Quick Buttons */}
              <div className="rounded-2xl border border-stone-200 bg-white p-4">
                <p className="text-xs font-semibold text-stone-700">Quick Workflow Update</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {["confirmed", "processing", "packed", "shipped", "delivered", "cancelled"].map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => handleUpdateStatus(activeOrder.id, st)}
                      className={`rounded-lg px-3 py-1.5 text-xs font-semibold uppercase transition ${
                        activeOrder.order_status === st
                          ? "bg-[#6E2635] text-white"
                          : "border border-stone-200 bg-stone-50 text-stone-600 hover:bg-stone-100"
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
