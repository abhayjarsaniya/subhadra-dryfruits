import Image from "next/image";
import Link from "next/link";
import { collections, productsFor } from "@/data/catalog";
import {
  GOOGLE_MAPS_URL,
  STORE_ADDRESS,
  STORE_NAME,
  STORE_RATING,
  WHATSAPP_DISPLAY,
} from "@/data/site";
import { generalInquiryMessage, whatsappHref } from "@/lib/whatsapp";
import { ProductCarousel } from "@/components/product-carousel";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";
import { InquiryLink } from "@/components/inquiry-link";

const celebrationCategories = [
  { name: "Diwali", label: "Diwali" },
  { name: "Raksha Bandhan", label: "Raksha Bandhan" },
  { name: "Wedding", label: "Wedding" },
  { name: "Birthday", label: "Birthday" },
  { name: "Anniversary", label: "Anniversary" },
  { name: "Corporate Gifting", label: "Corporate Gifting" },
  { name: "Festive", label: "Festive" },
  { name: "Custom Gift Boxes", label: "Custom Gift Boxes" },
];

const pillars = [
  {
    title: "Something Special for Every Occasion",
    text: "From quiet morning rituals to grand festival gatherings, find the right flavour and presentation.",
    icon: "✦",
  },
  {
    title: "A Little Luxury for Everyday Moments",
    text: "Mellow almonds, buttery cashews, single-origin teas and velvety chocolates for daily delight.",
    icon: "◆",
  },
  {
    title: "Thoughtfully Selected for Gifting",
    text: "Elegantly arranged celebration boxes and hampers made to leave a lasting impression.",
    icon: "✿",
  },
  {
    title: "Choose Favourites, We Do the Rest",
    text: "Select weights and quantities freely. We confirm fresh availability, pricing and doorstep delivery.",
    icon: "☎",
  },
];

export function HomePage() {
  const dry = productsFor("dry-fruits").slice(0, 8);
  const chocolates = productsFor("chocolates");
  const brews = productsFor("coffee-tea");
  const loved = productsFor("best-sellers").slice(0, 8);
  const bundles = productsFor("bundles");

  return (
    <div className="w-full">
      {/* ========================================================
          SECTION 1: HERO (WHITE)
          ======================================================== */}
      <section className="w-full bg-white pb-8 pt-4 sm:pb-12 sm:pt-8 lg:min-h-[calc(100vh-4.5rem)] lg:pt-8">
        <div className="shell grid items-center gap-6 sm:gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="flex flex-col animate-rise">
            {/* Eyebrow */}
            <div className="order-1 flex items-center gap-2">
              <span className="h-px w-6 bg-[#6E2635]" />
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#6E2635]">
                SUBHADRA DRYFRUITS · AHMEDABAD
              </p>
            </div>

            {/* Main Heading */}
            <h1 className="order-2 mt-3.5 font-serif text-[2.15rem] font-medium leading-[1.1] text-ink sm:mt-4 sm:text-6xl lg:text-7xl">
              Finest Dry Fruits, Handcrafted for Every Celebration.
            </h1>

            {/* Supporting Text - Short on Mobile, Full on Desktop */}
            <p className="order-3 mt-3 text-sm leading-relaxed text-stone-600 sm:hidden">
              Hand-picked dry fruits, gourmet chocolates, and celebration gift boxes for your family occasions.
            </p>
            <p className="order-3 mt-5 hidden max-w-lg text-base leading-relaxed text-stone-600 sm:block sm:text-lg">
              Explore meticulously sourced dry fruits, roasted nuts, fine chocolates, teas and celebration boxes from Subhadra Dryfruits.
            </p>

            {/* Rating Proof — Desktop: Single Row Before CTAs */}
            <div className="order-4 mt-5 hidden sm:flex sm:items-center sm:gap-3">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-stone-200 bg-[#fbf9f6] px-3 py-1 text-xs font-medium text-stone-700">
                <span className="text-amber-500">★</span>
                <span>{STORE_RATING} Google Rating</span>
              </div>
              <span className="text-xs text-stone-400">·</span>
              <span className="text-xs text-stone-500">Balaji Complex, Vastrapur</span>
            </div>

            {/* CTAs */}
            <div className="order-4 mt-5 flex flex-col gap-2.5 sm:order-5 sm:mt-8 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3.5">
              <Link
                href="/dry-fruits"
                className="inline-flex min-h-[50px] w-full items-center justify-center rounded-full bg-[#6E2635] px-7 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-[#5A1E2B] active:scale-[0.99] sm:w-auto"
              >
                Explore Collection →
              </Link>
              <a
                href={GOOGLE_MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[50px] w-full items-center justify-center rounded-full border border-stone-300 bg-white px-6 py-3 text-sm font-semibold text-stone-800 transition hover:border-[#6E2635] hover:text-[#6E2635] active:scale-[0.99] sm:w-auto"
              >
                Visit Our Store →
              </a>
            </div>

            {/* Rating Proof & Address — Mobile: 2 Separate Distinct Rows After CTAs */}
            <div className="order-5 mt-5 flex flex-col gap-1.5 sm:hidden">
              <div className="inline-flex w-fit items-center gap-1.5 rounded-full border border-stone-200 bg-[#fbf9f6] px-3 py-1 text-xs font-medium text-stone-700 whitespace-nowrap">
                <span className="text-amber-500">★</span>
                <span className="whitespace-nowrap">{STORE_RATING} · Customer Favourite (Google Rating)</span>
              </div>
              <p className="text-xs text-stone-500 pl-1 whitespace-nowrap">
                Balaji Complex, Vastrapur · Ahmedabad
              </p>
            </div>
          </div>

          {/* Hero Visual */}
          <div className="relative">
            <div className="relative mx-auto aspect-[4/3] w-full max-w-xl overflow-hidden rounded-[24px] border border-[#e6e2dc] bg-white p-2.5 shadow-[0_16px_40px_-24px_rgba(110,38,53,0.22)] sm:rounded-[28px] sm:p-3 lg:max-w-none">
              <Image
                src="/images/hero-composition.jpg"
                alt="Premium assortment of dry fruits, almonds, cashews, pistachios, dates and walnuts from Subhadra Dryfruits Ahmedabad"
                fill
                priority
                className="object-contain p-1.5 sm:p-2"
                sizes="(max-width: 1024px) 100vw, 48vw"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          SECTION 2: BUNDLES & CELEBRATION BOXES (WARM NEUTRAL #FAF8F6)
          ======================================================== */}
      <section className="w-full border-t border-stone-200/60 bg-[#FAF8F6] py-10 sm:py-16 lg:py-20">
        <div className="shell">
          <Reveal>
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#6E2635]">
                MADE FOR MOMENTS THAT MATTER
              </p>
              <h2 className="mt-1.5 font-serif text-[1.75rem] font-medium leading-[1.12] text-ink sm:mt-2 sm:text-5xl sm:leading-[1.05]">
                Celebrate With a Box They&apos;ll Remember.
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-stone-600 sm:mt-3 sm:text-base">
                Bring together premium dry fruits, chocolates, coffee, tea and thoughtful surprises in beautifully curated celebration boxes.
              </p>
            </div>

            {/* Celebration Categories Pills — Hidden on Mobile, Shown on Desktop */}
            <div className="mt-6 hidden sm:flex flex-wrap gap-2">
              {celebrationCategories.map((cat) => (
                <Link
                  key={cat.name}
                  href={`/bundles?group=${encodeURIComponent(cat.name)}`}
                  className="rounded-full border border-stone-200 bg-white px-3.5 py-1.5 text-xs font-medium text-stone-700 transition hover:border-[#6E2635] hover:text-[#6E2635]"
                >
                  {cat.label}
                </Link>
              ))}
            </div>
          </Reveal>

          <div className="mt-5 sm:mt-8">
            <ProductCarousel products={bundles} href="/bundles" label="Explore All Celebration Boxes →" />
          </div>
        </div>
      </section>

      {/* ========================================================
          SECTION 3: DRY FRUITS COLLECTION (WHITE)
          ======================================================== */}
      <section id="collections" className="w-full border-t border-stone-200/60 bg-white py-10 sm:py-16 lg:py-20">
        <div className="shell">
          <Reveal>
            <SectionHeading
              accent="almond"
              eyebrow={collections["dry-fruits"].eyebrow}
              title={collections["dry-fruits"].title}
              text="Clean Californian almonds, sweet Indian cashews, Iranian pistachios and plump dates graded for pure natural flavour."
            />
          </Reveal>
          <div className="mt-5 sm:mt-8">
            <ProductCarousel products={dry} href="/dry-fruits" label="Explore All Dry Fruits →" />
          </div>
        </div>
      </section>

      {/* ========================================================
          SECTION 4: BEST SELLERS / CUSTOMER FAVOURITES (WARM NEUTRAL #FAF8F6)
          ======================================================== */}
      <section className="w-full border-t border-stone-200/60 bg-[#FAF8F6] py-10 sm:py-16 lg:py-20">
        <div className="shell">
          <Reveal>
            <SectionHeading
              accent="gold"
              eyebrow="Customer Favourites"
              title="The Products Everyone Keeps Coming Back For."
              text="If you only have a minute, these are the signature selections our Ahmedabad customers love best."
            />
          </Reveal>
          <div className="mt-5 sm:mt-8">
            <ProductCarousel products={loved} href="/best-sellers" label="Explore All Best Sellers →" />
          </div>
        </div>
      </section>

      {/* ========================================================
          SECTION 5: CHOCOLATES (WHITE)
          ======================================================== */}
      <section className="w-full border-t border-stone-200/60 bg-white py-10 sm:py-16 lg:py-20">
        <div className="shell">
          <Reveal>
            <SectionHeading
              accent="cocoa"
              eyebrow={collections.chocolates.eyebrow}
              title={collections.chocolates.title}
              text="A softer kind of luxury. Handcrafted dark bark, creamy milk pralines, and gift boxes made for sweet moments."
            />
          </Reveal>
          <div className="mt-5 sm:mt-8">
            <ProductCarousel products={chocolates} href="/chocolates" label="Explore All Chocolates →" />
          </div>
        </div>
      </section>

      {/* ========================================================
          SECTION 6: COFFEE & TEA (WARM NEUTRAL #FAF8F6)
          ======================================================== */}
      <section className="w-full border-t border-stone-200/60 bg-[#FAF8F6] py-10 sm:py-16 lg:py-20">
        <div className="shell">
          <Reveal>
            <SectionHeading
              accent="caramel"
              eyebrow={collections["coffee-tea"].eyebrow}
              title={collections["coffee-tea"].title}
              text="Filter coffee for the traditional tumbler. Darjeeling first flush and Kashmiri kahwa for the quiet cup."
            />
          </Reveal>
          <div className="mt-5 sm:mt-8">
            <ProductCarousel products={brews} href="/coffee-tea" label="Explore All Coffee & Tea →" />
          </div>
        </div>
      </section>

      {/* ========================================================
          SECTION 7: REAL STORE / LOCAL TRUST (WHITE)
          ======================================================== */}
      <section className="w-full border-t border-stone-200/60 bg-white py-10 sm:py-16 lg:py-20">
        <div className="shell">
          <Reveal>
            <div className="overflow-hidden rounded-[2rem] border border-[#e6e2dc] bg-[#FAF8F6] p-5 min-[360px]:p-6 sm:p-10 lg:p-14">
              <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#6E2635]">
                    Find Us in Ahmedabad
                  </p>
                  <h2 className="mt-2 font-serif text-[1.75rem] font-medium leading-[1.12] text-ink sm:mt-3 sm:text-5xl sm:leading-tight">
                    Good Things Are Even Better When You Can See Them Yourself.
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed text-stone-600 sm:text-base">
                    Walk in to experience our complete assortment of dry fruits, mukhwas, celebration gift boxes and festive hampers in person.
                  </p>

                  <div className="mt-6 w-full h-auto min-h-0 rounded-2xl border border-stone-200 bg-white p-4 min-[360px]:p-5 sm:p-6 shadow-xs">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-100 pb-3 sm:pb-3.5">
                      <h3 className="font-serif text-base min-[360px]:text-lg font-semibold text-ink sm:text-xl">{STORE_NAME}</h3>
                      <span className="shrink-0 rounded-full bg-[#6E2635]/10 px-2.5 py-1 text-xs font-semibold text-[#6E2635]">
                        ★ {STORE_RATING} ★
                      </span>
                    </div>
                    <address className="mt-3.5 not-italic text-xs leading-relaxed text-stone-600 sm:text-sm space-y-1">
                      <p className="font-medium text-ink">{STORE_ADDRESS.line1}</p>
                      <p>{STORE_ADDRESS.line2}</p>
                      <p>{STORE_ADDRESS.area}, {STORE_ADDRESS.city}</p>
                      <p>{STORE_ADDRESS.state} – {STORE_ADDRESS.pincode}</p>
                      <div className="mt-3.5 pt-3 border-t border-stone-100 flex flex-wrap items-center gap-1.5 text-xs text-stone-500 sm:text-sm">
                        <span className="font-medium text-ink">Phone / WhatsApp:</span>
                        <a
                          href={whatsappHref(generalInquiryMessage())}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-semibold text-[#6E2635] hover:underline"
                        >
                          {WHATSAPP_DISPLAY}
                        </a>
                      </div>
                    </address>
                  </div>

                  <div className="mt-5 flex flex-col gap-2.5 sm:mt-6 sm:flex-row sm:flex-wrap sm:gap-3">
                    <a
                      href={GOOGLE_MAPS_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-[50px] w-full items-center justify-center gap-2 rounded-full bg-[#6E2635] px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-[#5A1E2B] active:scale-[0.99] sm:w-auto"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <polygon points="3 11 22 2 13 21 11 13 3 11"/>
                      </svg>
                      Get Directions →
                    </a>
                    <a
                      href={whatsappHref(generalInquiryMessage())}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-[50px] w-full items-center justify-center gap-2 rounded-full border border-stone-300 bg-white px-6 py-3 text-sm font-semibold text-stone-800 transition hover:border-[#6E2635] hover:text-[#6E2635] active:scale-[0.99] sm:w-auto"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                        <path d="M12.04 2C6.58 2 2.15 6.4 2.15 11.83c0 1.74.46 3.44 1.34 4.94L2 22l5.39-1.4a10 10 0 0 0 4.65 1.18h.01c5.46 0 9.89-4.4 9.89-9.84C21.94 6.4 17.5 2 12.04 2Zm5.76 14.04c-.24.68-1.4 1.3-1.94 1.38-.5.08-1.12.11-1.81-.11-.41-.14-.95-.31-1.63-.6-2.87-1.24-4.74-4.13-4.88-4.32-.14-.19-1.16-1.54-1.16-2.94 0-1.4.73-2.09 1-2.37.24-.28.64-.4.85-.4h.2c.2 0 .4-.02.58.02.22.04.46.24.64.64.2.46.64 1.58.7 1.7.06.12.1.26.02.42-.08.16-.12.26-.24.4-.12.14-.25.31-.36.42-.12.12-.24.24-.1.47.14.23.62 1.02 1.33 1.65.92.82 1.69 1.08 1.93 1.2.24.12.38.1.52-.06.14-.16.6-.7.76-.94.16-.24.32-.2.54-.12.22.08 1.4.66 1.64.78.24.12.4.18.46.28.06.1.06.58-.18 1.26Z" />
                      </svg>
                      WhatsApp Us →
                    </a>
                  </div>
                </div>

                {/* Store illustration card / location highlight */}
                <div className="relative flex w-full h-auto min-h-0 flex-col items-center justify-center rounded-2xl border border-stone-200 bg-white p-5 text-center shadow-xs sm:rounded-3xl sm:p-7 sm:aspect-[4/3] lg:aspect-auto">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#fbf5f5] text-xl text-[#6E2635] sm:h-16 sm:w-16 sm:text-2xl">
                    📍
                  </div>
                  <h3 className="mt-3 font-serif text-xl font-semibold text-ink sm:mt-4 sm:text-2xl">Store Location</h3>
                  <p className="mt-1 text-xs font-medium text-[#6E2635] sm:text-sm">Vastrapur, Ahmedabad</p>
                  <p className="mt-2.5 max-w-sm text-xs leading-relaxed text-stone-500">
                    Shop No. U/4, Balaji Complex, Opp. Gokul Hospital, Besides Falguni Gruh Udyog, Vastrapur. Easy parking and warm service.
                  </p>
                  <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-stone-200 bg-stone-50 px-3.5 py-1.5 text-[11px] text-stone-600 sm:px-4 sm:py-2 sm:text-xs">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    <span>Open all week for inquiries &amp; visits</span>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ========================================================
          SECTION 8: BRAND PILLARS / WHY CHOOSE US (WARM NEUTRAL #FAF8F6)
          ======================================================== */}
      <section className="w-full border-t border-stone-200/60 bg-[#FAF8F6] py-10 sm:py-16 lg:py-20">
        <div className="shell">
          <Reveal>
            <div className="text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#6E2635]">
                The Subhadra Dryfruits Standard
              </p>
              <h2 className="mt-1.5 font-serif text-[1.75rem] font-medium leading-[1.12] text-ink sm:mt-2 sm:text-5xl sm:leading-tight">
                From Everyday Snacking to Special Celebrations.
              </h2>
              <p className="mx-auto mt-2 max-w-xl text-sm text-stone-600 sm:mt-3 sm:text-base">
                Thoughtfully selected for gifting and sharing, prepared with meticulous attention to detail.
              </p>
            </div>
          </Reveal>

          <div className="mt-6 grid gap-3 sm:mt-10 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
            {pillars.map((item, index) => (
              <Reveal key={item.title} delay={index * 70}>
                <div className="flex h-full flex-col rounded-2xl border border-stone-200/70 bg-white p-5 transition hover:border-[#6E2635]/30 sm:p-6">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#FAF8F6] font-serif text-base text-[#6E2635] shadow-xs sm:h-11 sm:w-11 sm:text-lg">
                    {item.icon}
                  </span>
                  <h3 className="mt-3 font-serif text-lg font-medium text-ink sm:mt-4 sm:text-xl">{item.title}</h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-stone-600 sm:mt-2 sm:text-sm">{item.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================
          SECTION 9: FINAL INQUIRY CALL TO ACTION (WHITE)
          ======================================================== */}
      <section className="w-full border-t border-stone-200/60 bg-white py-12 text-center sm:py-20 lg:py-24">
        <div className="shell">
          <Reveal>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#6E2635]">
              Product Catalog &amp; WhatsApp Inquiries
            </p>
            <h2 className="mx-auto mt-2 font-serif text-[1.85rem] font-medium leading-tight text-ink sm:mt-3 sm:text-5xl lg:text-6xl">
              Choose Your Favourites. We&apos;ll Take Care of the Rest.
            </h2>
            <p className="mx-auto mt-2.5 max-w-lg text-sm leading-relaxed text-stone-600 sm:mt-4 sm:text-base">
              Select weights and add as many items as you wish (up to 10 per single product). Review your list and share delivery details directly with the store owner on WhatsApp.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3 sm:mt-8 sm:gap-3.5">
              <InquiryLink className="inline-flex min-h-[50px] w-full items-center justify-center rounded-full bg-[#6E2635] px-7 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-[#5A1E2B] active:scale-[0.99] sm:w-auto">
                Send Inquiry on WhatsApp →
              </InquiryLink>
              <Link
                href="/bundles"
                className="inline-flex min-h-[50px] w-full items-center justify-center rounded-full border border-stone-300 bg-white px-6 py-3 text-sm font-semibold text-stone-800 transition hover:border-[#6E2635] hover:text-[#6E2635] active:scale-[0.99] sm:w-auto"
              >
                Explore Celebration Boxes
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
