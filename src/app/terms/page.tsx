import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms",
  description: "Terms for browsing Subhadra Dryfruits and sending a WhatsApp inquiry.",
};

export default function TermsPage() {
  return (
    <div className="shell py-16 sm:py-24">
    <article className="max-w-3xl">
      <p className="font-script text-4xl text-gold">Plainly stated</p>
      <h1 className="mt-3 font-serif text-6xl text-ink">Terms</h1>
      <div className="mt-8 space-y-5 leading-relaxed text-stone-600">
        <p>Prices shown on this website are indicative. The price, availability and delivery charge are confirmed in your WhatsApp conversation before anything is treated as an order.</p>
        <p>Sending an inquiry does not reserve stock. An order exists when we accept it on WhatsApp.</p>
        <p>You can add up to ten different products in one inquiry. Quantities of those products can still be changed.</p>
        <p>Photographs show the style and character of each product. Natural foods vary a little in colour and size from batch to batch.</p>
        <p>Please store dry fruits, chocolates, coffee and tea as described on each product page once they reach you.</p>
      </div>
    </article>
    </div>
  );
}
