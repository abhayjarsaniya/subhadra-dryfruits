import { WHATSAPP_E164 } from "@/data/site";

export type InquiryLine = {
  name: string;
  weight: string;
  qty: number;
};

export type CustomerDetails = {
  name: string;
  mobile: string;
  email: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  note: string;
};

export function inquiryMessage(lines: InquiryLine[], customer: CustomerDetails): string {
  const productList = lines.length
    ? lines
        .map(
          (line, index) =>
            `${index + 1}. ${line.name} — ${line.weight} × ${line.qty}\n   Weight: ${line.weight}\n   Quantity: ${line.qty}`,
        )
        .join("\n\n")
    : "No products selected yet.";

  return `Hello Subhadra Dryfruits,

I would like to inquire about the following products:

${productList}

Customer Details

Name: ${customer.name.trim()}
Mobile: ${customer.mobile.trim()}
Email: ${customer.email.trim() || "—"}
Address: ${customer.address.trim()}
City: ${customer.city.trim()}
State: ${customer.state.trim()}
Pincode: ${customer.pincode.trim()}

Note:
${customer.note.trim() || "—"}

Please share the final availability, pricing and delivery details.

Thank you.`;
}

export function generalInquiryMessage(): string {
  return `Hello Subhadra Dryfruits,

I would like to inquire about your premium dry fruits, chocolates, coffee, tea and celebration boxes.

Please share availability and pricing details.

Thank you.`;
}

export function whatsappHref(message: string): string {
  return `https://wa.me/${WHATSAPP_E164}?text=${encodeURIComponent(message)}`;
}
