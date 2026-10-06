"use client";

import { FormEvent, useMemo, useState } from "react";
import { getProduct } from "@/data/catalog";
import { inquiryMessage, whatsappHref, type CustomerDetails, type InquiryLine } from "@/lib/whatsapp";
import { useStore } from "@/components/store";

const initialDetails: CustomerDetails = {
  name: "",
  mobile: "",
  email: "",
  address: "",
  city: "Ahmedabad",
  state: "Gujarat",
  pincode: "",
  note: "",
};

function InputField({
  id,
  label,
  value,
  onChange,
  placeholder,
  required,
  type = "text",
  inputMode,
  autoComplete,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  required?: boolean;
  type?: string;
  inputMode?: "text" | "tel" | "email" | "numeric";
  autoComplete?: string;
}) {
  return (
    <label className="block text-left" htmlFor={id}>
      <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-stone-500">
        {label}
        {required ? <span className="text-[#6E2635]"> *</span> : " · optional"}
      </span>
      <input
        id={id}
        name={id}
        type={type}
        inputMode={inputMode}
        autoComplete={autoComplete}
        required={required}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="mt-1 h-11 w-full rounded-xl border border-[#e6e2dc] bg-white px-3.5 text-sm text-ink outline-none transition placeholder:text-stone-400 focus:border-[#6E2635] focus:ring-1 focus:ring-[#6E2635]"
      />
    </label>
  );
}

export function InquiryForm() {
  const { inquiryOpen, closeInquiry, inquirySeed, lines } = useStore();
  const [details, setDetails] = useState<CustomerDetails>(initialDetails);
  const [error, setError] = useState("");

  const inquiryLines = useMemo<InquiryLine[]>(() => {
    if (inquirySeed) return inquirySeed;
    return lines
      .map((line) => {
        const product = getProduct(line.slug);
        return product ? { name: product.name, weight: line.weight, qty: line.qty } : null;
      })
      .filter((line): line is InquiryLine => line !== null);
  }, [inquirySeed, lines]);

  if (!inquiryOpen) return null;

  function set<K extends keyof CustomerDetails>(key: K, value: CustomerDetails[K]) {
    setDetails((current) => ({ ...current, [key]: value }));
  }

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    const mobile = details.mobile.replace(/\s/g, "");

    if (details.name.trim().length < 2) {
      setError("Please enter your full name.");
      return;
    }
    if (!/^[0-9+]{10,15}$/.test(mobile)) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }
    if (details.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(details.email.trim())) {
      setError("Please enter a valid email address, or leave it blank.");
      return;
    }
    if (!details.address.trim()) {
      setError("Please enter your complete delivery address.");
      return;
    }
    if (!details.city.trim() || !details.state.trim()) {
      setError("City and State are required.");
      return;
    }
    if (!/^\d{6}$/.test(details.pincode.trim())) {
      setError("Please enter a valid 6-digit pincode.");
      return;
    }

    setError("");
    const message = inquiryMessage(inquiryLines, { ...details, mobile });
    const href = whatsappHref(message);
    window.open(href, "_blank", "noopener,noreferrer");
    closeInquiry();
  }

  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center bg-ink/40 p-0 sm:items-center sm:p-4">
      <button
        type="button"
        aria-label="Close inquiry form"
        className="fixed inset-0 bg-transparent"
        onClick={closeInquiry}
      />

      <div className="relative max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-[1.6rem] bg-white p-5 shadow-2xl sm:rounded-[1.6rem] sm:p-7">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="font-serif text-3xl font-semibold leading-tight text-ink sm:text-4xl">
              Let&apos;s get your order details.
            </h2>
            <p className="mt-1.5 text-xs leading-relaxed text-stone-600 sm:text-sm">
              Just a few details so Subhadra Dryfruits knows who to prepare the inquiry for.
            </p>
          </div>
          <button
            type="button"
            onClick={closeInquiry}
            className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-stone-200 text-stone-500 transition hover:border-[#6E2635] hover:text-[#6E2635]"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Selected Items summary */}
        {inquiryLines.length > 0 ? (
          <div className="mt-4 rounded-xl border border-stone-100 bg-[#faf8f5] p-3 text-xs text-stone-600">
            <span className="font-medium text-ink">Inquiry contains {inquiryLines.length} product(s):</span>
            <ul className="mt-1.5 max-h-24 space-y-1 overflow-y-auto pr-1 text-stone-600">
              {inquiryLines.map((item, idx) => (
                <li key={idx} className="flex justify-between">
                  <span>{item.name} ({item.weight})</span>
                  <span className="font-semibold text-stone-700">Qty {item.qty}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {/* Customer Details Form */}
        <form onSubmit={onSubmit} className="mt-5 space-y-3.5">
          <InputField
            id="name"
            label="Full Name"
            required
            placeholder="Enter your name"
            autoComplete="name"
            value={details.name}
            onChange={(val) => set("name", val)}
          />

          <InputField
            id="mobile"
            label="Mobile Number"
            required
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="Enter your mobile number"
            value={details.mobile}
            onChange={(val) => set("mobile", val)}
          />

          <label className="block text-left" htmlFor="address">
            <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-stone-500">
              Delivery Address <span className="text-[#6E2635]">*</span>
            </span>
            <textarea
              id="address"
              required
              rows={2}
              value={details.address}
              placeholder="Enter your complete address"
              onChange={(e) => set("address", e.target.value)}
              className="mt-1 w-full rounded-xl border border-[#e6e2dc] bg-white p-3 text-sm text-ink outline-none transition placeholder:text-stone-400 focus:border-[#6E2635] focus:ring-1 focus:ring-[#6E2635]"
            />
          </label>

          <div className="grid grid-cols-2 gap-3">
            <InputField
              id="city"
              label="City"
              required
              placeholder="Ahmedabad"
              autoComplete="address-level2"
              value={details.city}
              onChange={(val) => set("city", val)}
            />
            <InputField
              id="state"
              label="State"
              required
              placeholder="Gujarat"
              autoComplete="address-level1"
              value={details.state}
              onChange={(val) => set("state", val)}
            />
          </div>

          <InputField
            id="pincode"
            label="Pincode"
            required
            inputMode="numeric"
            autoComplete="postal-code"
            placeholder="Enter pincode"
            value={details.pincode}
            onChange={(val) => set("pincode", val.replace(/\D/g, "").slice(0, 6))}
          />

          <InputField
            id="email"
            label="Email Address"
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="Enter your email address"
            value={details.email}
            onChange={(val) => set("email", val)}
          />

          <label className="block text-left" htmlFor="note">
            <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-stone-500">
              Additional Note · optional
            </span>
            <textarea
              id="note"
              rows={2}
              value={details.note}
              placeholder="Any special request, packing preference, or occasion?"
              onChange={(e) => set("note", e.target.value)}
              className="mt-1 w-full rounded-xl border border-[#e6e2dc] bg-white p-3 text-sm text-ink outline-none transition placeholder:text-stone-400 focus:border-[#6E2635] focus:ring-1 focus:ring-[#6E2635]"
            />
          </label>

          {error && <p className="text-xs font-medium text-[#6E2635]">{error}</p>}

          <button
            type="submit"
            className="mt-4 flex min-h-[50px] w-full items-center justify-center gap-2 rounded-full bg-[#6E2635] px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-[#5A1E2B] active:scale-[0.99]"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12.04 2C6.58 2 2.15 6.4 2.15 11.83c0 1.74.46 3.44 1.34 4.94L2 22l5.39-1.4a10 10 0 0 0 4.65 1.18h.01c5.46 0 9.89-4.4 9.89-9.84C21.94 6.4 17.5 2 12.04 2Zm5.76 14.04c-.24.68-1.4 1.3-1.94 1.38-.5.08-1.12.11-1.81-.11-.41-.14-.95-.31-1.63-.6-2.87-1.24-4.74-4.13-4.88-4.32-.14-.19-1.16-1.54-1.16-2.94 0-1.4.73-2.09 1-2.37.24-.28.64-.4.85-.4h.2c.2 0 .4-.02.58.02.22.04.46.24.64.64.2.46.64 1.58.7 1.7.06.12.1.26.02.42-.08.16-.12.26-.24.4-.12.14-.25.31-.36.42-.12.12-.24.24-.1.47.14.23.62 1.02 1.33 1.65.92.82 1.69 1.08 1.93 1.2.24.12.38.1.52-.06.14-.16.6-.7.76-.94.16-.24.32-.2.54-.12.22.08 1.4.66 1.64.78.24.12.4.18.46.28.06.1.06.58-.18 1.26Z" />
            </svg>
            <span>Send Inquiry on WhatsApp</span>
          </button>

          <p className="mt-2 text-center text-[11px] leading-tight text-stone-400">
            No account creation or password needed. Availability & final price confirmed on WhatsApp.
          </p>
        </form>
      </div>
    </div>
  );
}
