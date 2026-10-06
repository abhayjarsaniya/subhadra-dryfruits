export const BRAND = "Subhadra Dryfruits";
export const BRAND_FULL = "Subhadra Dryfruits";
export const STORE_NAME = "Subhadra Dryfruits";

export const STORE_ADDRESS = {
  line1: "Shop No. U/4, Balaji Complex",
  line2: "Opp. Gokul Hospital, Beside Falguni Gruh Udyog, Nehru Park, Sardar Chowk",
  area: "Vastrapur",
  city: "Ahmedabad",
  state: "Gujarat",
  pincode: "380015",
  full: "Shop No. U/4, Balaji Complex, Opp. Gokul Hospital, Beside Falguni Gruh Udyog, Nehru Park, Sardar Chowk, Vastrapur, Ahmedabad, Gujarat 380015",
};

export const STORE_RATING = "4.8 ★";

export const WHATSAPP_DISPLAY = "+91 7874306085";
export const WHATSAPP_E164 = "917874306085";

export const GOOGLE_MAPS_URL =
  "https://www.google.com/maps/search/?api=1&query=Subhadra+Dry+Fruits,+Balaji+Complex,+Vastrapur,+Ahmedabad,+Gujarat+380015";

export const MAX_QTY_PER_PRODUCT = 10;
export const MAX_QTY_MESSAGE = "Maximum quantity reached (10 per product).";

export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export function absoluteUrl(path: string) {
  return new URL(path, siteUrl).toString();
}
