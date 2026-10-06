"use client";

import { useState } from "react";
import { WHATSAPP_DISPLAY } from "@/data/site";
import { whatsappHref } from "@/lib/whatsapp";

export function ContactForm() {
  const [name, setName] = useState("");
  const [note, setNote] = useState("");

  const message = `Hello Subhadra Dryfruits,

I would like to inquire about your products.

Name: ${name.trim() || "—"}

Message:
${note.trim() || "Please share product availability, pricing and gifting options."}

Thank you.`;

  return (
    <form
      className="rounded-[2rem] border border-[#e6e2dc] bg-[#fbf9f6] p-6 shadow-sm sm:p-8"
      onSubmit={(event) => {
        event.preventDefault();
        window.open(whatsappHref(message), "_blank", "noopener,noreferrer");
      }}
    >
      <h3 className="font-serif text-2xl font-medium text-ink">Quick Inquiry Note</h3>
      <p className="mt-1 text-xs text-stone-500">
        Leave your name and a brief note to start a conversation with the store on WhatsApp ({WHATSAPP_DISPLAY}).
      </p>

      <label className="mt-5 block text-left" htmlFor="contact-name">
        <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-stone-500">
          Your Name
        </span>
        <input
          id="contact-name"
          value={name}
          placeholder="Enter your name"
          onChange={(event) => setName(event.target.value)}
          className="mt-1 h-12 w-full rounded-xl border border-stone-200 bg-white px-4 text-sm text-ink outline-none transition focus:border-[#6E2635]"
        />
      </label>

      <label className="mt-4 block text-left" htmlFor="contact-note">
        <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-stone-500">
          Your Inquiry / Question
        </span>
        <textarea
          id="contact-note"
          required
          rows={5}
          value={note}
          placeholder="What would you like to inquire about? (Dry fruits, gift hampers, bulk orders, festival boxes, custom packaging...)"
          onChange={(event) => setNote(event.target.value)}
          className="mt-1 w-full rounded-xl border border-stone-200 bg-white p-4 text-sm text-ink outline-none transition focus:border-[#6E2635]"
        />
      </label>

      <button
        type="submit"
        className="mt-6 flex min-h-[50px] w-full items-center justify-center gap-2 rounded-full bg-[#6E2635] px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-[#5A1E2B] active:scale-[0.99]"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M12.04 2C6.58 2 2.15 6.4 2.15 11.83c0 1.74.46 3.44 1.34 4.94L2 22l5.39-1.4a10 10 0 0 0 4.65 1.18h.01c5.46 0 9.89-4.4 9.89-9.84C21.94 6.4 17.5 2 12.04 2Zm5.76 14.04c-.24.68-1.4 1.3-1.94 1.38-.5.08-1.12.11-1.81-.11-.41-.14-.95-.31-1.63-.6-2.87-1.24-4.74-4.13-4.88-4.32-.14-.19-1.16-1.54-1.16-2.94 0-1.4.73-2.09 1-2.37.24-.28.64-.4.85-.4h.2c.2 0 .4-.02.58.02.22.04.46.24.64.64.2.46.64 1.58.7 1.7.06.12.1.26.02.42-.08.16-.12.26-.24.4-.12.14-.25.31-.36.42-.12.12-.24.24-.1.47.14.23.62 1.02 1.33 1.65.92.82 1.69 1.08 1.93 1.2.24.12.38.1.52-.06.14-.16.6-.7.76-.94.16-.24.32-.2.54-.12.22.08 1.4.66 1.64.78.24.12.4.18.46.28.06.1.06.58-.18 1.26Z" />
        </svg>
        <span>Send Inquiry on WhatsApp</span>
      </button>

      <p className="mt-3 text-center text-[11px] text-stone-400">
        Direct chat with the Subhadra Dryfruits team. No automated bots.
      </p>
    </form>
  );
}
