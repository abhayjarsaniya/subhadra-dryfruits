import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { getOrderById } from "@/lib/repository";
import { formatPrice } from "@/lib/format";

type Props = {
  searchParams: Promise<{ id?: string }>;
};

export default async function OrderConfirmedPage({ searchParams }: Props) {
  const { id } = await searchParams;

  const order = id ? getOrderById(id) : null;

  return (
    <Suspense fallback={<div className="shell py-20 text-center">Loading confirmation...</div>}>
      <div className="shell py-12 sm:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 text-4xl text-emerald-600 shadow-xs">
            ✓
          </div>

          <p className="mt-5 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
            Order Successfully Placed
          </p>

          <h1 className="mt-2 font-serif text-3xl font-medium text-ink sm:text-5xl">
            Thank You for Your Order!
          </h1>

          <p className="mt-3 text-sm leading-relaxed text-stone-600 sm:text-base">
            We have received your order and are carefully preparing your fresh selection for dispatch.
          </p>

          {order && (
            <div className="mt-8 rounded-3xl border border-stone-200/80 bg-[#FAF8F6] p-6 text-left shadow-xs sm:p-8">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-200 pb-4">
                <div>
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-500">
                    Order Number
                  </span>
                  <p className="font-serif text-xl font-bold text-ink sm:text-2xl">{order.order_number}</p>
                </div>
                <div className="text-right">
                  <span className="inline-block rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">
                    Status: {order.order_status.toUpperCase()}
                  </span>
                  <p className="mt-1 text-[11px] text-stone-500">Payment: {order.payment_status.toUpperCase()}</p>
                </div>
              </div>

              {/* Items */}
              <div className="mt-5">
                <p className="text-xs font-semibold uppercase tracking-wider text-stone-500">
                  Ordered Items
                </p>
                <ul className="mt-3 divide-y divide-stone-200">
                  {order.items.map((item, idx) => (
                    <li key={idx} className="flex items-center justify-between py-3 text-sm">
                      <div className="flex items-center gap-3">
                        <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-lg border border-stone-200 bg-white">
                          <Image src={item.image} alt={item.name} fill className="object-contain p-1" sizes="44px" />
                        </div>
                        <div>
                          <p className="font-medium text-ink">{item.name}</p>
                          <p className="text-xs text-stone-500">{item.weight} × {item.qty}</p>
                        </div>
                      </div>
                      <span className="font-serif font-semibold text-ink">
                        {formatPrice(item.price * item.qty)}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Summary */}
              <div className="mt-5 space-y-1.5 border-t border-stone-200 pt-4 text-xs sm:text-sm">
                <div className="flex justify-between text-stone-600">
                  <span>Subtotal</span>
                  <span>{formatPrice(order.subtotal)}</span>
                </div>
                {order.discount_amount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-medium">
                    <span>Discount</span>
                    <span>− {formatPrice(order.discount_amount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-stone-600">
                  <span>Shipping</span>
                  <span>{order.shipping_charge === 0 ? "FREE" : formatPrice(order.shipping_charge)}</span>
                </div>
                <div className="flex justify-between border-t border-stone-200 pt-2 text-base font-bold text-ink">
                  <span>Total Amount Paid</span>
                  <span className="font-serif text-lg text-[#6E2635] sm:text-xl">
                    {formatPrice(order.total_amount)}
                  </span>
                </div>
              </div>

              {/* Delivery Address */}
              <div className="mt-6 border-t border-stone-200 pt-4 text-xs text-stone-600 sm:text-sm">
                <p className="font-semibold text-ink">Delivery Address:</p>
                <p className="mt-1">{order.customer_name} ({order.customer_phone})</p>
                <p>{order.address_line1}, {order.address_line2}</p>
                <p>{order.city}, {order.state} – {order.pincode}</p>
              </div>
            </div>
          )}

          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link
              href="/"
              className="inline-flex min-h-[48px] items-center justify-center rounded-full bg-[#6E2635] px-7 text-sm font-semibold text-white shadow-md transition hover:bg-[#5A1E2B]"
            >
              Back to Home
            </Link>
            <Link
              href="/dry-fruits"
              className="inline-flex min-h-[48px] items-center justify-center rounded-full border border-stone-300 bg-white px-7 text-sm font-semibold text-stone-700 transition hover:border-[#6E2635] hover:text-[#6E2635]"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </Suspense>
  );
}
