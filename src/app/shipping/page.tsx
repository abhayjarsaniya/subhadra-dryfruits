import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Shipping Information",
  description: "How Subhadra Dryfruits inquiries, pricing and delivery are confirmed on WhatsApp.",
};

export default function ShippingPage() {
  return (
    <div className="shell py-16 sm:py-24">
    <article className="max-w-3xl">
      <p className="font-script text-4xl text-caramel">Before it travels</p>
      <h1 className="mt-3 font-serif text-6xl text-ink">Shipping Information</h1>
      <div className="mt-8 space-y-5 leading-relaxed text-stone-600">
        <p>This website does not take payment or book a courier by itself. Delivery is arranged after your WhatsApp inquiry is confirmed.</p>
        <p>When you send an inquiry, include the products, weights and quantities you want. We reply with availability, the confirmed price, and delivery options for your address.</p>
        <p>Please check the weight and quantity in your message before sending. An inquiry becomes an order only when we accept it in the chat.</p>
        <p>
          Questions about a hamper or a delivery date can go straight to <Link href="/contact" className="underline underline-offset-4">Contact</Link>.
        </p>
      </div>
    </article>
    </div>
  );
}
