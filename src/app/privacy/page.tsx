import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Subhadra Dryfruits handles your inquiry. The cart stays in your browser.",
};

export default function PrivacyPage() {
  return (
    <div className="shell py-16 sm:py-24">
    <article className="max-w-3xl">
      <p className="font-script text-4xl text-leaf">Quiet by design</p>
      <h1 className="mt-3 font-serif text-6xl text-ink">Privacy Policy</h1>
      <div className="mt-8 space-y-5 leading-relaxed text-stone-600">
        <p>Subhadra Dryfruits does not ask you to create an account, and this website does not run a payment checkout.</p>
        <p>Your inquiry cart is stored in this browser only, so it is still here when you move between pages. Clearing your browser data removes it. We do not receive the cart until you choose to send it on WhatsApp.</p>
        <p>The inquiry button opens a short delivery form, then WhatsApp with a message you can read before it is sent. That message is delivered by WhatsApp under their own terms.</p>
        <p>If you write to us, we use your message to reply about products, pricing and delivery. We do not sell that conversation.</p>
      </div>
    </article>
    </div>
  );
}
