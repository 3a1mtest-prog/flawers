import productsData from "./products.json";
import siteData from "./site.json";
import type {
  Category,
  Lang,
  Product,
  ProductOptionChoice,
  SiteConfig,
} from "./types";

export const products = productsData as Product[];
export const site = siteData as SiteConfig;

export function getProduct(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

export function byCategory(category: Category | "all"): Product[] {
  return category === "all"
    ? products
    : products.filter((p) => p.category === category);
}

export const featuredProducts = products.filter((p) => p.featured);

export function findChoice(
  product: Product,
  optionId: string | null,
): ProductOptionChoice | null {
  if (!optionId || !product.options) return null;
  return product.options.choices.find((c) => c.id === optionId) ?? null;
}

/** Base price plus the selected option's delta. */
export function priceOf(product: Product, optionId: string | null): number {
  return product.price + (findChoice(product, optionId)?.priceDelta ?? 0);
}

/** Lowest price a product can be bought at, used for "from X" labels. */
export function lowestPrice(product: Product): number {
  if (!product.options) return product.price;
  const deltas = product.options.choices.map((c) => c.priceDelta);
  return product.price + Math.min(...deltas);
}

export function hasPriceRange(product: Product): boolean {
  return !!product.options && product.options.choices.length > 1;
}

/** The option a product should start on: the one priced at the base price. */
export function defaultOptionId(product: Product): string | null {
  if (!product.options) return null;
  const standard = product.options.choices.find((c) => c.priceDelta === 0);
  return (standard ?? product.options.choices[0]).id;
}

const ARABIC_DIGITS = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];

/**
 * Formats an amount with the shop's currency.
 *
 * This does the digit conversion by hand rather than through `Intl` because
 * React Native's Intl support varies by platform, and the website and the app
 * have to render prices identically.
 */
export function formatPrice(amount: number, lang: Lang): string {
  const rounded = Math.round(amount * 100) / 100;
  const [whole, fraction] = rounded.toFixed(2).split(".");
  const grouped = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  const trimmed = fraction === "00" ? grouped : `${grouped}.${fraction}`;

  if (lang === "en") return `${trimmed} ${site.currency.en}`;

  const arabic = trimmed
    .split("")
    .map((char) => {
      if (char >= "0" && char <= "9") return ARABIC_DIGITS[Number(char)];
      if (char === ",") return "٬";
      if (char === ".") return "٫";
      return char;
    })
    .join("");

  return `${arabic} ${site.currency.ar}`;
}

/** Delivery is free above a threshold; below it a flat fee applies. */
export function deliveryFeeFor(subtotal: number): number {
  return subtotal === 0 || subtotal >= site.delivery.freeOver
    ? 0
    : site.delivery.fee;
}
