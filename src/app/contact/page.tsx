import type { Metadata } from "next";
import { ContactForm } from "@/components/contact-form";
import {
  BRAND_FULL,
  GOOGLE_MAPS_URL,
  STORE_ADDRESS,
  STORE_NAME,
  STORE_RATING,
  WHATSAPP_DISPLAY,
} from "@/data/site";
import { generalInquiryMessage, whatsappHref } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Contact & Store Location",
  description:
    "Visit Subhadra Dryfruits at Balaji Complex, Vastrapur, Ahmedabad or send an inquiry on WhatsApp +91 7874306085.",
};

export default function ContactPage() {
  return (
    <div className="shell py-12 sm:py-20">
      <div className="grid gap-12 lg:grid-cols-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#6E2635]">
            Contact &amp; Store Location
          </p>
          <h1 className="mt-3 font-serif text-4xl font-medium leading-[1.05] text-ink sm:text-6xl">
            Tell Us What You Would Like.
          </h1>
          <p className="mt-5 max-w-md text-base leading-relaxed text-stone-600">
            Availability, fresh pricing and delivery are confirmed directly in chat. Write to us, or visit our retail store in Ahmedabad.
          </p>

          <div className="mt-8 rounded-2xl border border-stone-200 bg-[#fbf9f6] p-4 min-[360px]:p-5 sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-200 pb-3">
              <h2 className="font-serif text-lg font-semibold text-ink sm:text-xl">{STORE_NAME}</h2>
              <span className="rounded-full bg-[#6E2635]/10 px-2.5 py-0.5 text-xs font-semibold text-[#6E2635]">
                ★ {STORE_RATING}
              </span>
            </div>

            <address className="mt-3 not-italic text-xs leading-relaxed text-stone-600 sm:text-sm">
              <p className="font-medium text-ink">{STORE_ADDRESS.line1}</p>
              <p>{STORE_ADDRESS.line2}</p>
              <p>{STORE_ADDRESS.area}, {STORE_ADDRESS.city}</p>
              <p>{STORE_ADDRESS.state} – {STORE_ADDRESS.pincode}</p>
            </address>

            <div className="mt-4 flex flex-col gap-2 min-[400px]:flex-row min-[400px]:flex-wrap min-[400px]:items-center min-[400px]:gap-3">
              <a
                href={GOOGLE_MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#6E2635] underline underline-offset-4 hover:text-[#5A1E2B]"
              >
                Get Directions on Google Maps →
              </a>
              <span className="hidden text-stone-300 min-[400px]:inline">·</span>
              <a
                href={whatsappHref(generalInquiryMessage())}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#6E2635] underline underline-offset-4 hover:text-[#5A1E2B]"
              >
                WhatsApp: {WHATSAPP_DISPLAY}
              </a>
            </div>
          </div>

          <p className="mt-6 text-xs text-stone-500">
            Open through the week for inquiries, tasting and store visits.
          </p>
        </div>

        <ContactForm />
      </div>
    </div>
  );
}
