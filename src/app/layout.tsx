import type { Metadata } from "next";
import { Cormorant_Garamond, Great_Vibes, Outfit } from "next/font/google";
import { absoluteUrl, BRAND, BRAND_FULL, siteUrl, STORE_ADDRESS, STORE_RATING } from "@/data/site";
import { CartDrawer, MobileDock, NoticeToast } from "@/components/cart-drawer";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { InquiryForm } from "@/components/inquiry-form";
import { MobileDrawer } from "@/components/mobile-drawer";
import { SearchDialog } from "@/components/search-dialog";
import { StoreProvider } from "@/components/store";
import { AuthProvider } from "@/lib/auth-context";
// Subhadra Dryfruits official website layout
import "./globals.css";

const serif = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});

const sans = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-sans",
  display: "swap",
});

const script = Great_Vibes({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-script",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${BRAND} — Premium Dry Fruits, Fresh Nuts & Celebration Gifting | Ahmedabad`,
    template: `%s · ${BRAND}`,
  },
  description:
    "Premium dry fruits, fresh nuts, artisanal chocolates, coffee, tea and festive celebration boxes from Subhadra Dryfruits, Vastrapur, Ahmedabad. Inquire directly on WhatsApp.",
  openGraph: {
    title: `${BRAND_FULL} · Ahmedabad`,
    description: "Premium dry fruits, fresh nuts, chocolates and celebration gift boxes — ordered through a simple WhatsApp inquiry.",
    images: ["/images/hero-composition.jpg"],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: BRAND_FULL,
    description: "Premium dry fruits, fresh nuts, chocolates and celebration gift boxes, ordered on WhatsApp.",
    images: ["/images/hero-composition.jpg"],
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Store",
      name: BRAND_FULL,
      url: absoluteUrl("/"),
      telephone: "+91-7874306085",
      image: absoluteUrl("/images/hero-composition.jpg"),
      description: "Premium dry fruits, chocolates, coffee, tea and celebration boxes. Orders are placed as WhatsApp inquiries.",
      address: {
        "@type": "PostalAddress",
        streetAddress: STORE_ADDRESS.line1 + ", " + STORE_ADDRESS.line2,
        addressLocality: STORE_ADDRESS.city,
        addressRegion: STORE_ADDRESS.state,
        postalCode: STORE_ADDRESS.pincode,
        addressCountry: "IN",
      },
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: "4.6",
        bestRating: "5",
      },
      areaServed: "IN",
    },
    {
      "@type": "WebSite",
      name: BRAND,
      url: absoluteUrl("/"),
      potentialAction: {
        "@type": "SearchAction",
        target: `${absoluteUrl("/search")}?q={search_term_string}`,
        "query-input": "required name=search_term_string",
      },
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable} ${script.variable}`}>
      <body className="bg-white font-sans text-ink antialiased">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
        <AuthProvider>
          <StoreProvider>
            <Header />
            <main className="pb-24 lg:pb-0">{children}</main>
            <Footer />
            <CartDrawer />
            <SearchDialog />
            <NoticeToast />
            <InquiryForm />
            <MobileDock />
            <MobileDrawer />
          </StoreProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
