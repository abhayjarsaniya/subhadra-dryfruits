"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { formatPrice } from "@/lib/format";
import { useStore } from "@/components/store";
import { getProduct, priceFor } from "@/data/catalog";

type ShippingSettings = {
  shipping_fee: number;
  free_shipping_threshold: number;
  shipping_notes: string;
  enable_cod: boolean;
};

export default function CheckoutPage() {
  const router = useRouter();
  const { lines, totalCount, clearCart, showNotice } = useStore();

  const [dbProductMap, setDbProductMap] = useState<Record<string, any>>({});
  const [shippingConfig, setShippingConfig] = useState<ShippingSettings>({
    shipping_fee: 99,
    free_shipping_threshold: 1499,
    shipping_notes: "Doorstep delivery across India in 2–4 business days.",
    enable_cod: true,
  });

  // Customer Delivery details
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [city, setCity] = useState("Ahmedabad");
  const [state, setState] = useState("Gujarat");
  const [pincode, setPincode] = useState("380015");
  const [notes, setNotes] = useState("");

  // Payment & Coupon
  const [paymentMethod, setPaymentMethod] = useState<"online" | "cod">("online");
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number } | null>(null);
  const [couponMsg, setCouponMsg] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);

  // Submission state
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data.shipping_fee != null) {
          setShippingConfig({
            shipping_fee: Number(data.shipping_fee) || 99,
            free_shipping_threshold: Number(data.free_shipping_threshold) || 1499,
            shipping_notes: data.shipping_notes || "",
            enable_cod: data.enable_cod !== false,
          });
        }
      })
      .catch(() => {});

    fetch("/api/products?limit=100")
      .then((res) => res.json())
      .then((data) => {
        if (data.products) {
          const map: Record<string, any> = {};
          for (const p of data.products) map[p.slug] = p;
          setDbProductMap(map);
        }
      })
      .catch(() => {});
  }, []);

  const items = lines
    .map((line) => {
      const dbProd = dbProductMap[line.slug];
      const localProduct = getProduct(line.slug);
      const product = dbProd || localProduct;
      if (!product) return null;

      const price = dbProd
        ? (dbProd.prices[line.weight] ?? Object.values(dbProd.prices)[0] ?? 0)
        : priceFor(localProduct!, line.weight);

      return {
        id: product.id || product.slug,
        slug: product.slug,
        name: product.name,
        image: product.image,
        weight: line.weight,
        price,
        qty: line.qty,
      };
    })
    .filter((entry): entry is NonNullable<typeof entry> => entry !== null);

  const subtotal = items.reduce((acc, it) => acc + it.price * it.qty, 0);
  const discount = appliedCoupon ? appliedCoupon.discount : 0;
  const shippingCharge = subtotal >= shippingConfig.free_shipping_threshold ? 0 : shippingConfig.shipping_fee;
  const finalTotal = Math.max(0, subtotal - discount + shippingCharge);

  async function handleApplyCoupon() {
    if (!couponCode.trim()) return;
    setCouponLoading(true);
    setCouponMsg("");
    try {
      const res = await fetch(`/api/coupons?code=${encodeURIComponent(couponCode.trim())}&subtotal=${subtotal}`);
      const data = await res.json();
      if (data.valid) {
        setAppliedCoupon({ code: couponCode.trim().toUpperCase(), discount: data.discount });
        setCouponMsg(data.message);
      } else {
        setAppliedCoupon(null);
        setCouponMsg(data.message || "Invalid coupon code");
      }
    } catch {
      setCouponMsg("Error verifying coupon");
    } finally {
      setCouponLoading(false);
    }
  }

  function handleRemoveCoupon() {
    setAppliedCoupon(null);
    setCouponCode("");
    setCouponMsg("");
  }

  async function handleSubmitOrder(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg("");

    if (items.length === 0) {
      setErrorMsg("Your cart is empty. Add products before checkout.");
      return;
    }

    if (!name.trim() || !phone.trim() || !address1.trim() || !city.trim() || !state.trim() || !pincode.trim()) {
      setErrorMsg("Please complete all required shipping fields.");
      return;
    }

    setSubmitting(true);

    try {
      // 1. Create order in Database (validates stock, deducts inventory atomically)
      const orderRes = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_name: name.trim(),
          customer_phone: phone.trim(),
          customer_email: email.trim(),
          address_line1: address1.trim(),
          address_line2: address2.trim(),
          city: city.trim(),
          state: state.trim(),
          pincode: pincode.trim(),
          delivery_notes: notes.trim(),
          coupon_code: appliedCoupon ? appliedCoupon.code : "",
          payment_method: paymentMethod,
          items,
        }),
      });

      const orderData = await orderRes.json();
      if (!orderRes.ok || !orderData.order) {
        throw new Error(orderData.error || "Failed to create order");
      }

      const createdOrder = orderData.order;

      // 2. Process Payment via Gateway
      const payRes = await fetch("/api/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: createdOrder.id,
          paymentMethod,
          simulateSuccess: true, // Seamless production-ready test gateway
        }),
      });

      const payData = await payRes.json();
      if (!payRes.ok || !payData.success) {
        throw new Error(payData.error || "Payment processing failed");
      }

      // 3. Clear shopping cart
      clearCart();
      showNotice("Order placed successfully!", "ok");

      // 4. Redirect to Order Confirmation
      router.push(`/order-confirmed?id=${createdOrder.id}`);
    } catch (err: any) {
      setErrorMsg(err.message || "An unexpected error occurred during checkout.");
      setSubmitting(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="shell py-16 text-center sm:py-24">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#FAF8F6] text-3xl text-[#6E2635]">
          🛍️
        </div>
        <h1 className="mt-4 font-serif text-3xl font-medium text-ink sm:text-4xl">Your Cart is Empty</h1>
        <p className="mt-2 text-sm text-stone-600">You don&apos;t have any products in your cart to checkout.</p>
        <div className="mt-6">
          <Link
            href="/dry-fruits"
            className="inline-flex min-h-[48px] items-center justify-center rounded-full bg-[#6E2635] px-7 text-sm font-semibold text-white shadow-md transition hover:bg-[#5A1E2B]"
          >
            Explore Collection →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="shell py-10 sm:py-16">
      <div className="border-b border-stone-200 pb-5">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#6E2635]">
          Secure Checkout
        </p>
        <h1 className="mt-2 font-serif text-3xl font-medium text-ink sm:text-5xl">
          Complete Your Order
        </h1>
        <p className="mt-1 text-sm text-stone-600">
          Fast doorstep shipping across India. Review your items and complete payment.
        </p>
      </div>

      {errorMsg && (
        <div className="mt-6 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm font-medium text-rose-700">
          ⚠️ {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmitOrder} className="mt-8 grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        {/* LEFT COLUMN: Customer Delivery Info & Payment */}
        <div className="space-y-8">
          {/* 1. Contact Information */}
          <div className="rounded-3xl border border-stone-200/80 bg-white p-6 shadow-xs sm:p-8">
            <h2 className="flex items-center gap-2 font-serif text-xl font-semibold text-ink sm:text-2xl">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#6E2635] text-xs font-bold text-white">1</span>
              <span>Contact &amp; Delivery Information</span>
            </h2>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <label className="sm:col-span-2 block">
                <span className="text-xs font-medium text-stone-600">Full Name *</span>
                <input
                  type="text"
                  required
                  placeholder="e.g. Priyanshu Shah"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 h-12 w-full rounded-xl border border-stone-200 px-4 text-sm text-ink outline-none transition focus:border-[#6E2635]"
                />
              </label>

              <label className="block">
                <span className="text-xs font-medium text-stone-600">Mobile Number *</span>
                <input
                  type="tel"
                  required
                  placeholder="e.g. 9876543210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="mt-1 h-12 w-full rounded-xl border border-stone-200 px-4 text-sm text-ink outline-none transition focus:border-[#6E2635]"
                />
              </label>

              <label className="block">
                <span className="text-xs font-medium text-stone-600">Email Address (Optional)</span>
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 h-12 w-full rounded-xl border border-stone-200 px-4 text-sm text-ink outline-none transition focus:border-[#6E2635]"
                />
              </label>

              <label className="sm:col-span-2 block">
                <span className="text-xs font-medium text-stone-600">Flat / House / Apartment &amp; Street *</span>
                <input
                  type="text"
                  required
                  placeholder="House No., Building Name, Street address"
                  value={address1}
                  onChange={(e) => setAddress1(e.target.value)}
                  className="mt-1 h-12 w-full rounded-xl border border-stone-200 px-4 text-sm text-ink outline-none transition focus:border-[#6E2635]"
                />
              </label>

              <label className="sm:col-span-2 block">
                <span className="text-xs font-medium text-stone-600">Area / Landmark</span>
                <input
                  type="text"
                  placeholder="Opposite Gokul Hospital, Near Nehru Park"
                  value={address2}
                  onChange={(e) => setAddress2(e.target.value)}
                  className="mt-1 h-12 w-full rounded-xl border border-stone-200 px-4 text-sm text-ink outline-none transition focus:border-[#6E2635]"
                />
              </label>

              <label className="block">
                <span className="text-xs font-medium text-stone-600">City *</span>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="mt-1 h-12 w-full rounded-xl border border-stone-200 px-4 text-sm text-ink outline-none transition focus:border-[#6E2635]"
                />
              </label>

              <label className="block">
                <span className="text-xs font-medium text-stone-600">State *</span>
                <input
                  type="text"
                  required
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="mt-1 h-12 w-full rounded-xl border border-stone-200 px-4 text-sm text-ink outline-none transition focus:border-[#6E2635]"
                />
              </label>

              <label className="block">
                <span className="text-xs font-medium text-stone-600">Pincode *</span>
                <input
                  type="text"
                  required
                  placeholder="380015"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  className="mt-1 h-12 w-full rounded-xl border border-stone-200 px-4 text-sm text-ink outline-none transition focus:border-[#6E2635]"
                />
              </label>

              <label className="block sm:col-span-2">
                <span className="text-xs font-medium text-stone-600">Delivery Instructions / Notes (Optional)</span>
                <textarea
                  rows={2}
                  placeholder="e.g. Please call before delivery, gift message on box..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-stone-200 p-3 text-sm text-ink outline-none transition focus:border-[#6E2635]"
                />
              </label>
            </div>
          </div>

          {/* 2. Payment Method */}
          <div className="rounded-3xl border border-stone-200/80 bg-white p-6 shadow-xs sm:p-8">
            <h2 className="flex items-center gap-2 font-serif text-xl font-semibold text-ink sm:text-2xl">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#6E2635] text-xs font-bold text-white">2</span>
              <span>Choose Payment Method</span>
            </h2>

            <div className="mt-5 space-y-3">
              <label
                className={`flex cursor-pointer items-start gap-3.5 rounded-2xl border p-4.5 transition ${
                  paymentMethod === "online"
                    ? "border-[#6E2635] bg-[#FAF8F6]"
                    : "border-stone-200 hover:border-stone-300"
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="online"
                  checked={paymentMethod === "online"}
                  onChange={() => setPaymentMethod("online")}
                  className="mt-1 text-[#6E2635]"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-ink">Online Payment (UPI, Cards, NetBanking)</span>
                    <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-800">Instant</span>
                  </div>
                  <p className="mt-1 text-xs text-stone-500">
                    Pay securely using Google Pay, PhonePe, Paytm, Debit/Credit Card or Net Banking.
                  </p>
                </div>
              </label>

              {shippingConfig.enable_cod && (
                <label
                  className={`flex cursor-pointer items-start gap-3.5 rounded-2xl border p-4.5 transition ${
                    paymentMethod === "cod"
                      ? "border-[#6E2635] bg-[#FAF8F6]"
                      : "border-stone-200 hover:border-stone-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={paymentMethod === "cod"}
                    onChange={() => setPaymentMethod("cod")}
                    className="mt-1 text-[#6E2635]"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-ink">Cash on Delivery (COD)</span>
                      <span className="text-xs text-stone-500">Pay at doorstep</span>
                    </div>
                    <p className="mt-1 text-xs text-stone-500">
                      Pay with cash or UPI QR code when our delivery partner reaches your address.
                    </p>
                  </div>
                </label>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Order Summary & Review */}
        <div className="space-y-6">
          <div className="rounded-3xl border border-stone-200/80 bg-[#FAF8F6] p-6 shadow-xs sm:p-8 lg:sticky lg:top-24">
            <h2 className="font-serif text-2xl font-semibold text-ink">Order Summary</h2>
            <p className="mt-0.5 text-xs text-stone-500">{totalCount} items in cart</p>

            {/* Item list */}
            <ul className="mt-5 divide-y divide-stone-200/70 border-y border-stone-200/70 max-h-72 overflow-y-auto">
              {items.map((it) => (
                <li key={`${it.slug}-${it.weight}`} className="flex items-center justify-between gap-3 py-3">
                  <div className="flex items-center gap-3">
                    <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-stone-200 bg-white">
                      <Image src={it.image} alt={it.name} fill className="object-contain p-1" sizes="48px" />
                    </div>
                    <div>
                      <p className="line-clamp-1 text-xs font-semibold text-ink sm:text-sm">{it.name}</p>
                      <p className="text-[11px] text-stone-500">
                        {it.weight} × {it.qty}
                      </p>
                    </div>
                  </div>
                  <span className="font-serif text-xs font-semibold text-ink sm:text-sm">
                    {formatPrice(it.price * it.qty)}
                  </span>
                </li>
              ))}
            </ul>

            {/* Coupon field */}
            <div className="mt-5">
              <span className="text-xs font-medium text-stone-600">Have a Discount Coupon?</span>
              <div className="mt-1.5 flex gap-2">
                <input
                  type="text"
                  placeholder="Enter coupon code"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  className="h-10 flex-1 rounded-xl border border-stone-300 bg-white px-3.5 text-xs uppercase text-ink outline-none transition focus:border-[#6E2635]"
                />
                {appliedCoupon ? (
                  <button
                    type="button"
                    onClick={handleRemoveCoupon}
                    className="rounded-xl border border-rose-300 bg-rose-50 px-3.5 text-xs font-semibold text-rose-700"
                  >
                    Remove
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleApplyCoupon}
                    disabled={couponLoading || !couponCode.trim()}
                    className="rounded-xl bg-[#6E2635] px-4 text-xs font-semibold text-white transition hover:bg-[#5A1E2B] disabled:opacity-50"
                  >
                    {couponLoading ? "Checking..." : "Apply"}
                  </button>
                )}
              </div>
              {couponMsg && (
                <p className={`mt-1.5 text-xs ${appliedCoupon ? "text-emerald-700 font-medium" : "text-rose-600"}`}>
                  {couponMsg}
                </p>
              )}
            </div>

            {/* Price Calculations */}
            <div className="mt-6 space-y-2.5 border-t border-stone-200/70 pt-4 text-xs sm:text-sm">
              <div className="flex justify-between text-stone-600">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-emerald-700 font-medium">
                  <span>Discount ({appliedCoupon?.code})</span>
                  <span>− {formatPrice(discount)}</span>
                </div>
              )}

              <div className="flex justify-between text-stone-600">
                <span>Delivery / Shipping</span>
                <span>
                  {shippingCharge === 0 ? (
                    <span className="font-semibold text-emerald-700">FREE</span>
                  ) : (
                    formatPrice(shippingCharge)
                  )}
                </span>
              </div>

              {shippingCharge > 0 && (
                <p className="text-[11px] text-stone-500">
                  Add {formatPrice(shippingConfig.free_shipping_threshold - subtotal)} more for Free Shipping!
                </p>
              )}

              <div className="flex justify-between border-t border-stone-200/80 pt-3 text-base font-semibold text-ink sm:text-lg">
                <span>Final Total</span>
                <span className="font-serif text-xl sm:text-2xl text-[#6E2635]">{formatPrice(finalTotal)}</span>
              </div>
            </div>

            {/* Place Order CTA */}
            <button
              type="submit"
              disabled={submitting}
              className="mt-6 flex min-h-[52px] w-full items-center justify-center gap-2 rounded-full bg-[#6E2635] px-6 py-3.5 text-sm font-semibold text-white shadow-md transition-all hover:bg-[#5A1E2B] active:scale-[0.99] disabled:opacity-50"
            >
              {submitting ? (
                <span>Processing Order...</span>
              ) : (
                <span>
                  {paymentMethod === "online" ? "Pay & Place Order" : "Place Order (Cash on Delivery)"} →
                </span>
              )}
            </button>

            <div className="mt-4 flex items-center justify-center gap-2 text-[11px] text-stone-500">
              <span>🔒 256-bit Encrypted Checkout</span>
              <span>·</span>
              <span>Direct Bank Payment</span>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
