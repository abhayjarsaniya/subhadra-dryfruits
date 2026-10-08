import Link from "next/link";
import {
  BRAND,
  BRAND_FULL,
  GOOGLE_MAPS_URL,
  STORE_ADDRESS,
  STORE_NAME,
  STORE_RATING,
  WHATSAPP_DISPLAY,
} from "@/data/site";
import { generalInquiryMessage, whatsappHref } from "@/lib/whatsapp";
import { BrandMark } from "@/components/brand-mark";

const explore = [
  { href: "/", label: "Home" },
  { href: "/dry-fruits", label: "Dry Fruits" },
  { href: "/chocolates", label: "Chocolates" },
  { href: "/coffee-tea", label: "Coffee & Tea" },
  { href: "/best-sellers", label: "Best Sellers" },
  { href: "/bundles", label: "Celebration Boxes" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

const customer = [
  { href: "/checkout", label: "Instant Checkout" },
  { href: "/contact", label: "Help & Support" },
  { href: "/shipping", label: "Shipping Information" },
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms & Conditions" },
  { href: "/admin", label: "Store Admin Portal" },
];

export function Footer() {
  return (
    <footer className="border-t border-stone-200 bg-white">
      <div className="shell grid gap-8 py-10 sm:gap-10 sm:py-16 md:grid-cols-4 lg:gap-12">
        <div className="md:col-span-2">
          <BrandMark />
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-stone-600">
            {BRAND_FULL} — Premium dry fruits, chocolates, coffee, tea and celebration boxes in Ahmedabad.
          </p>

          <div className="mt-5 rounded-2xl border border-stone-100 bg-[#fbf9f6] p-4 text-xs leading-relaxed text-stone-600 sm:max-w-md">
            <div className="flex flex-wrap items-center justify-between gap-1.5 font-medium text-ink">
              <span>{STORE_NAME}</span>
              <span className="flex items-center gap-1 rounded bg-[#6E2635]/10 px-2 py-0.5 text-[11px] font-semibold text-[#6E2635]">
                ★ {STORE_RATING}
              </span>
            </div>
            <p className="mt-1 text-stone-500">{STORE_ADDRESS.full}</p>
            <div className="mt-3 flex flex-col gap-1.5 min-[380px]:flex-row min-[380px]:flex-wrap min-[380px]:items-center min-[380px]:gap-2.5">
              <a
                href={GOOGLE_MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-[#6E2635] underline underline-offset-4 hover:text-[#5A1E2B]"
              >
                Get Directions on Google Maps →
              </a>
              <span className="hidden text-stone-300 min-[380px]:inline">·</span>
              <a
                href={whatsappHref(generalInquiryMessage())}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-[#6E2635] underline underline-offset-4 hover:text-[#5A1E2B]"
              >
                {WHATSAPP_DISPLAY}
              </a>
            </div>
          </div>

          <div className="mt-5 flex gap-3">
            <a
              href={whatsappHref(generalInquiryMessage())}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-stone-200 text-stone-600 transition hover:border-[#6E2635] hover:text-[#6E2635]"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12.04 2C6.58 2 2.15 6.4 2.15 11.83c0 1.74.46 3.44 1.34 4.94L2 22l5.39-1.4a10 10 0 0 0 4.65 1.18h.01c5.46 0 9.89-4.4 9.89-9.84C21.94 6.4 17.5 2 12.04 2Zm5.76 14.04c-.24.68-1.4 1.3-1.94 1.38-.5.08-1.12.11-1.81-.11-.41-.14-.95-.31-1.63-.6-2.87-1.24-4.74-4.13-4.88-4.32-.14-.19-1.16-1.54-1.16-2.94 0-1.4.73-2.09 1-2.37.24-.28.64-.4.85-.4h.2c.2 0 .4-.02.58.02.22.04.46.24.64.64.2.46.64 1.58.7 1.7.06.12.1.26.02.42-.08.16-.12.26-.24.4-.12.14-.25.31-.36.42-.12.12-.24.24-.1.47.14.23.62 1.02 1.33 1.65.92.82 1.69 1.08 1.93 1.2.24.12.38.1.52-.06.14-.16.6-.7.76-.94.16-.24.32-.2.54-.12.22.08 1.4.66 1.64.78.24.12.4.18.46.28.06.1.06.58-.18 1.26Z" />
              </svg>
            </a>
            <a
              href={GOOGLE_MAPS_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Google Maps Location"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-stone-200 text-stone-600 transition hover:border-[#6E2635] hover:text-[#6E2635]"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polygon points="3 11 22 2 13 21 11 13 3 11"/>
              </svg>
            </a>
          </div>
        </div>

        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#6E2635]">Explore</p>
          <ul className="mt-4 space-y-2 text-sm">
            {explore.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-stone-600 transition hover:text-[#6E2635]">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#6E2635]">Customer</p>
          <ul className="mt-4 space-y-2 text-sm">
            {customer.map((link) => (
              <li key={link.label}>
                <Link href={link.href} className="text-stone-600 transition hover:text-[#6E2635]">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-stone-100 py-5 text-center text-xs tracking-wide text-stone-500">
        © {new Date().getFullYear()} {BRAND_FULL}. Product catalog &amp; WhatsApp inquiries. Indicative prices confirmed directly on WhatsApp.
      </div>
    </footer>
  );
}
