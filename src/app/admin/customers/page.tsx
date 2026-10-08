"use client";

import { useEffect, useState } from "react";
import { formatPrice } from "@/lib/format";
import { Search, Users, Mail, Phone, ShoppingBag } from "lucide-react";

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchCustomers();
  }, [search]);

  async function fetchCustomers() {
    setLoading(true);
    try {
      const res = await fetch(`/api/customers?search=${encodeURIComponent(search)}`);
      const data = await res.json();
      setCustomers(Array.isArray(data) ? data : []);
    } catch {
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-bold text-ink sm:text-3xl">Customer Directory</h1>
        <p className="text-xs text-stone-500">
          Track customer spending, order histories, contact information, and shipping locations
        </p>
      </div>

      <div className="relative">
        <Search className="absolute left-3.5 top-3 h-4 w-4 text-stone-400" />
        <input
          type="text"
          placeholder="Search by customer name, mobile number, or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-10 w-full max-w-md rounded-xl border border-stone-200 bg-white pl-10 pr-4 text-xs text-ink outline-none transition focus:border-[#6E2635]"
        />
      </div>

      <div className="overflow-hidden rounded-2xl border border-stone-200/80 bg-white shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-stone-600">
            <thead className="border-b border-stone-200/80 bg-[#FAF8F6] text-[11px] font-bold uppercase tracking-wider text-stone-500">
              <tr>
                <th className="p-4">Customer Name</th>
                <th className="p-4">Contact</th>
                <th className="p-4">Primary Address</th>
                <th className="p-4">Orders Count</th>
                <th className="p-4">Total Spent</th>
                <th className="p-4">Last Order</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-10 text-center text-xs text-stone-400">
                    Loading customer data...
                  </td>
                </tr>
              ) : customers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-10 text-center text-xs text-stone-400">
                    No customers found.
                  </td>
                </tr>
              ) : (
                customers.map((c) => (
                  <tr key={c.id} className="hover:bg-stone-50/60 transition">
                    <td className="p-4">
                      <p className="font-semibold text-ink sm:text-sm">{c.name}</p>
                      <p className="text-[10px] text-stone-400 font-mono">ID: {c.id}</p>
                    </td>

                    <td className="p-4">
                      <p className="font-medium text-stone-800">{c.phone}</p>
                      {c.email && <p className="text-[11px] text-stone-400">{c.email}</p>}
                    </td>

                    <td className="p-4">
                      <p className="line-clamp-1">{c.address_line1}</p>
                      <p className="text-[11px] text-stone-400">
                        {c.city}, {c.state} {c.pincode}
                      </p>
                    </td>

                    <td className="p-4">
                      <span className="inline-block rounded-full bg-stone-100 px-2.5 py-0.5 text-xs font-bold text-stone-700">
                        {c.total_orders} orders
                      </span>
                    </td>

                    <td className="p-4">
                      <p className="font-serif font-bold text-ink sm:text-sm">{formatPrice(c.total_spent)}</p>
                    </td>

                    <td className="p-4 text-stone-400 text-[11px]">
                      {c.last_order_at ? new Date(c.last_order_at).toLocaleDateString() : "—"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
