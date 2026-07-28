import { formatPrice, site } from "./catalog";
import type { Lang, Product, ProductOptionChoice } from "./types";

export type OrderLine = {
  product: Product;
  choice: ProductOptionChoice | null;
  quantity: number;
  lineTotal: number;
};

export type OrderTotals = {
  subtotal: number;
  deliveryFee: number;
  total: number;
};

export type OrderDetails = {
  name: string;
  phone: string;
  address: string;
  notes: string;
};

/** Builds the plain-text order that gets handed to WhatsApp. */
export function buildOrderMessage(
  lines: OrderLine[],
  totals: OrderTotals,
  details: OrderDetails,
  lang: Lang,
): string {
  const ar = lang === "ar";

  const rows = lines.map((line) => {
    const option = line.choice ? ` (${line.choice.name[lang]})` : "";
    return `• ${line.product.name[lang]}${option} ×${line.quantity} — ${formatPrice(
      line.lineTotal,
      lang,
    )}`;
  });

  const parts = [
    ar ? "طلب جديد 🌸" : "New order 🌸",
    "",
    ...rows,
    "",
    `${ar ? "المجموع الفرعي" : "Subtotal"}: ${formatPrice(totals.subtotal, lang)}`,
    `${ar ? "التوصيل" : "Delivery"}: ${
      totals.deliveryFee === 0
        ? ar
          ? "مجاني"
          : "Free"
        : formatPrice(totals.deliveryFee, lang)
    }`,
    `${ar ? "الإجمالي" : "Total"}: ${formatPrice(totals.total, lang)}`,
    "",
    `${ar ? "الاسم" : "Name"}: ${details.name}`,
    `${ar ? "الهاتف" : "Phone"}: ${details.phone}`,
    `${ar ? "العنوان" : "Address"}: ${details.address}`,
  ];

  if (details.notes.trim()) {
    parts.push(`${ar ? "ملاحظات" : "Notes"}: ${details.notes.trim()}`);
  }

  return parts.join("\n");
}

export function whatsappLink(message: string): string {
  return `https://wa.me/${site.contact.whatsapp}?text=${encodeURIComponent(message)}`;
}

/** Prefilled enquiry about a single product, used from product screens. */
export function productEnquiryLink(product: Product, lang: Lang): string {
  const message =
    lang === "ar"
      ? `مرحبا، بدي أسأل عن "${product.name.ar}"`
      : `Hi, I'd like to ask about "${product.name.en}"`;
  return whatsappLink(message);
}
