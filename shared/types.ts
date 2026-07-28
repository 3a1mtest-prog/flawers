export type Lang = "ar" | "en";

export const LANGS: Lang[] = ["ar", "en"];

/** A string that exists in both languages. */
export type Localized = Record<Lang, string>;

export type Category = "flowers" | "paintings";

export type ProductOptionChoice = {
  id: string;
  name: Localized;
  /** Added to (or subtracted from) the base price when this choice is picked. */
  priceDelta: number;
};

export type ProductOptions = {
  label: Localized;
  choices: ProductOptionChoice[];
};

export type Product = {
  id: string;
  category: Category;
  name: Localized;
  summary: Localized;
  details: Localized;
  price: number;
  /** Empty until the shop owner drops in a real photo URL. */
  image: string;
  /** Two hex colours used to render the placeholder when `image` is empty. */
  palette: [string, string];
  badge: Localized | null;
  featured: boolean;
  inStock: boolean;
  options: ProductOptions | null;
};

export type SiteConfig = {
  brand: Localized;
  tagline: Localized;
  description: Localized;
  currency: { code: string } & Localized;
  contact: {
    whatsapp: string;
    phone: string;
    email: string;
    instagram: string;
    address: Localized;
  };
  about: Record<Lang, string[]>;
  hours: Localized;
  delivery: {
    freeOver: number;
    fee: number;
    note: Localized;
  };
};

/** One row of the cart, as persisted to storage. */
export type CartLine = {
  productId: string;
  optionId: string | null;
  quantity: number;
};
