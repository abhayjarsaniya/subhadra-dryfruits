import Image from "next/image";
import Link from "next/link";
import {
  GOOGLE_MAPS_URL,
  STORE_RATING,
} from "@/data/site";
import { ProductCarousel } from "@/components/product-carousel";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";
import {
  getAllHomepageSections,
  getAllProducts,
  getStoreSettings,
  DbProduct,
} from "@/lib/repository";
import { Product } from "@/data/catalog";

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
    title: "Fast Doorstep Delivery Across India",
    text: "Seamless online checkout with quick dispatch, complimentary express shipping on orders above ₹1,499.",
    icon: "🚚",
  },
];

function dbToCatalogProduct(db: DbProduct): Product {
  return {
    slug: db.slug,
    name: db.name,
    category: db.category_id as any,
    group: db.group_name,
    origin: db.origin,
    short: db.short,
    description: db.description,
    highlights: db.highlights,
    storage: db.storage,
    image: db.image,
    alt: db.alt,
    bestseller: db.is_bestseller,
    featured: db.is_featured,
    prices: db.prices,
    includes: db.includes,
    festival: db.festival,
    available: !db.is_out_of_stock && db.stock_qty > 0,
  };
}

export function HomePage() {
  const settings = getStoreSettings();
  const dbSections = getAllHomepageSections(false);
  const { products: allDbProducts } = getAllProducts({ activeOnly: true, limit: 250 });

  const catalogProducts = allDbProducts.map(dbToCatalogProduct);

  return (
    <div className="w-full">
      {/* Announcement Bar */}
      {settings.announcement_bar_enabled && settings.announcement_bar_text && (
        <div className="border-b border-[#6E2635]/15 bg-[#FAF8F6] py-2 text-center text-xs font-medium text-[#6E2635]">
          {settings.announcement_bar_text}
        </div>
      )}

      {/* ========================================================
          SECTION 1: HERO
          ======================================================== */}
      <section className="w-full bg-white pb-8 pt-4 sm:pb-12 sm:pt-8 lg:min-h-[calc(100vh-4.5rem)] lg:pt-8">
        <div className="shell grid items-center gap-6 sm:gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="flex flex-col animate-rise">
            {/* Eyebrow */}
            <div className="order-1 flex items-center gap-2">
              <span className="h-px w-6 bg-[#6E2635]" />
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#6E2635]">
                PREMIUM DRY FRUITS &amp; ARTISAN GIFTS
              </p>
            </div>

            {/* Main Heading */}
            <h1 className="order-2 mt-3.5 font-serif text-[2.15rem] font-medium leading-[1.1] text-ink sm:mt-4 sm:text-6xl lg:text-7xl">
              Finest Harvest, Handcrafted for Every Celebration.
            </h1>

            {/* Supporting Text */}
            <p className="order-3 mt-3 text-sm leading-relaxed text-stone-600 sm:hidden">
              Hand-picked dry fruits, gourmet chocolates, and celebration gift boxes with instant online checkout.
            </p>
            <p className="order-3 mt-5 hidden max-w-lg text-base leading-relaxed text-stone-600 sm:block sm:text-lg">
              Explore meticulously sourced dry fruits, roasted nuts, fine chocolates, teas and bespoke celebration boxes. Fast doorstep delivery across India.
            </p>

            {/* Rating Proof — Desktop */}
            <div className="order-4 mt-5 hidden sm:flex sm:items-center sm:gap-3">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-stone-200 bg-[#fbf9f6] px-3 py-1 text-xs font-medium text-stone-700">
                <span className="text-amber-500">★</span>
                <span>{STORE_RATING} Customer Rating</span>
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
                Shop Collection →
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

            {/* Mobile rating */}
            <div className="order-5 mt-5 flex flex-col gap-1.5 sm:hidden">
              <div className="inline-flex w-fit items-center gap-1.5 rounded-full border border-stone-200 bg-[#fbf9f6] px-3 py-1 text-xs font-medium text-stone-700 whitespace-nowrap">
                <span className="text-amber-500">★</span>
                <span className="whitespace-nowrap">{STORE_RATING} · Customer Favourite</span>
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
                alt="Premium assortment of dry fruits, almonds, cashews, pistachios, dates and walnuts"
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
          DYNAMIC HOMEPAGE SECTIONS (Database Driven by Admin Builder)
          ======================================================== */}
      {dbSections.map((sec, idx) => {
        const isWarmBg = idx % 2 === 0;

        let sectionProducts: Product[] = [];
        if (sec.source_type === "category") {
          sectionProducts = catalogProducts.filter((p) => p.category === sec.source_category_id);
        } else if (sec.source_type === "best-sellers") {
          sectionProducts = catalogProducts.filter((p) => p.bestseller);
        } else {
          sectionProducts = catalogProducts;
        }

        const displayed = sectionProducts.slice(0, sec.limit_count || 8);
        const targetHref = sec.source_category_id ? `/${sec.source_category_id}` : "/best-sellers";

        return (
          <section
            key={sec.id}
            className={`w-full border-t border-stone-200/60 py-10 sm:py-16 lg:py-20 ${
              isWarmBg ? "bg-[#FAF8F6]" : "bg-white"
            }`}
          >
            <div className="shell">
              <Reveal>
                <div className="max-w-2xl">
                  {sec.eyebrow && (
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#6E2635]">
                      {sec.eyebrow}
                    </p>
                  )}
                  <h2 className="mt-1.5 font-serif text-[1.75rem] font-medium leading-[1.12] text-ink sm:mt-2 sm:text-5xl sm:leading-[1.05]">
                    {sec.title}
                  </h2>
                  {sec.subtitle && (
                    <p className="mt-2 max-w-2xl text-sm leading-relaxed text-stone-600 sm:mt-3 sm:text-base">
                      {sec.subtitle}
                    </p>
                  )}
                </div>

                {sec.source_category_id === "bundles" && (
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
                )}
              </Reveal>

              <div className="mt-5 sm:mt-8">
                <ProductCarousel
                  products={displayed}
                  href={targetHref}
                  label={`${sec.label || "Explore Collection"} →`}
                />
              </div>
            </div>
          </section>
        );
      })}

      {/* ========================================================
          STORE LOCATION & LOCAL TRUST SECTION
          ======================================================== */}
      <section className="w-full border-t border-stone-200/60 bg-white py-10 sm:py-16 lg:py-20">
        <div className="shell">
          <Reveal>
            <div className="rounded-[24px] border border-[#e6e2dc] bg-[#fbf9f6] p-6 sm:rounded-[32px] sm:p-10 lg:p-12">
              <div className="grid items-center gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:gap-12">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#6E2635]">
                    Visit Our Retail Store
                  </p>
                  <h2 className="mt-2 font-serif text-2xl font-medium leading-tight text-ink sm:text-4xl lg:text-5xl">
                    Experience Freshness in Person.
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed text-stone-600 sm:text-base">
                    Taste our nuts, sample single-origin chocolate barks, or let us assist you in assembling tailor-made gift hampers.
                  </p>
                  <div className="mt-6 flex flex-wrap gap-3">
                    <a
                      href={GOOGLE_MAPS_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-[48px] items-center justify-center rounded-full bg-[#6E2635] px-6 text-sm font-semibold text-white shadow-md transition hover:bg-[#5A1E2B]"
                    >
                      Get Directions on Maps ↗
                    </a>
                    <Link
                      href="/contact"
                      className="inline-flex min-h-[48px] items-center justify-center rounded-full border border-stone-300 bg-white px-6 text-sm font-semibold text-stone-800 transition hover:border-[#6E2635] hover:text-[#6E2635]"
                    >
                      Contact Store
                    </Link>
                  </div>
                </div>

                <div className="relative flex flex-col items-center justify-center rounded-2xl border border-stone-200 bg-white p-5 text-center shadow-xs sm:rounded-3xl sm:p-7">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#fbf5f5] text-2xl text-[#6E2635]">
                    📍
                  </div>
                  <h3 className="mt-3 font-serif text-xl font-semibold text-ink sm:text-2xl">Store Location</h3>
                  <p className="mt-1 text-xs font-medium text-[#6E2635] sm:text-sm">Vastrapur, Ahmedabad</p>
                  <p className="mt-2.5 max-w-sm text-xs leading-relaxed text-stone-500">
                    Shop No. U/4, Balaji Complex, Opp. Gokul Hospital, Besides Falguni Gruh Udyog, Vastrapur. Easy parking and warm service.
                  </p>
                  <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-stone-200 bg-stone-50 px-3.5 py-1.5 text-[11px] text-stone-600 sm:text-xs">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    <span>Open all week · Online orders dispatched daily</span>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ========================================================
          BRAND PILLARS
          ======================================================== */}
      <section className="w-full border-t border-stone-200/60 bg-[#FAF8F6] py-10 sm:py-16 lg:py-20">
        <div className="shell">
          <Reveal>
            <div className="text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#6E2635]">
                Our Quality Standards
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
          FINAL CALL TO ACTION
          ======================================================== */}
      <section className="w-full border-t border-stone-200/60 bg-white py-12 text-center sm:py-20 lg:py-24">
        <div className="shell">
          <Reveal>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#6E2635]">
              Seamless Shopping Experience
            </p>
            <h2 className="mx-auto mt-2 font-serif text-[1.85rem] font-medium leading-tight text-ink sm:mt-3 sm:text-5xl lg:text-6xl">
              Choose Your Favourites. We Dispatch Right Away.
            </h2>
            <p className="mx-auto mt-2.5 max-w-lg text-sm leading-relaxed text-stone-600 sm:mt-4 sm:text-base">
              Add products with your preferred pack sizes, enter your delivery address, and pay securely online or with Cash on Delivery.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3 sm:mt-8 sm:gap-3.5">
              <Link
                href="/dry-fruits"
                className="inline-flex min-h-[50px] w-full items-center justify-center rounded-full bg-[#6E2635] px-7 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-[#5A1E2B] active:scale-[0.99] sm:w-auto"
              >
                Shop All Dry Fruits →
              </Link>
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
