import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import type { Lang } from "@/lib/catalog";

const STORAGE_KEY = "petal.lang.v1";

export const strings = {
  ar: {
    tabs: { home: "الرئيسية", shop: "المتجر", cart: "السلة", about: "عنّا" },
    home: {
      kicker: "استوديو زهور وفن",
      featured: "مختارات هذا الأسبوع",
      browseFlowers: "الزهور",
      browsePaintings: "اللوحات",
      seeAll: "شوف الكل",
    },
    shop: {
      title: "المتجر",
      all: "الكل",
      flowers: "زهور",
      paintings: "لوحات",
      empty: "ما في قطع بهذا التصنيف حالياً.",
    },
    product: {
      addToCart: "أضف إلى السلة",
      added: "تمت الإضافة ✓",
      soldOut: "غير متوفر حالياً",
      askAbout: "اسأل عن هالقطعة على واتساب",
      from: "يبدأ من",
      details: "التفاصيل",
      delivery: "التوصيل",
      quantity: "الكمية",
    },
    cart: {
      title: "السلة",
      empty: "سلتك فاضية.",
      emptyCta: "روح تصفّح المتجر",
      remove: "احذف",
      clear: "فضّي السلة",
      subtotal: "المجموع الفرعي",
      delivery: "التوصيل",
      free: "مجاني",
      total: "الإجمالي",
      yourInfo: "معلوماتك",
      name: "الاسم",
      phone: "رقم الهاتف",
      address: "العنوان",
      notes: "ملاحظات (اختياري)",
      namePlaceholder: "اسمك الكامل",
      phonePlaceholder: "07…",
      addressPlaceholder: "المنطقة، الشارع، رقم البناية",
      notesPlaceholder: "وقت مفضّل للتسليم، رسالة على البطاقة…",
      checkout: "أرسل الطلب على واتساب",
      checkoutNote: "بنفتحلك واتساب وفيه تفاصيل طلبك جاهزة — بس ابعت الرسالة.",
      required: "لازم تعبّي الاسم والهاتف والعنوان.",
      cannotOpen: "ما قدرنا نفتح واتساب على هالجهاز.",
    },
    about: {
      title: "عن الاستوديو",
      hours: "أوقات الدوام",
      address: "العنوان",
      phone: "الهاتف",
      email: "البريد",
      instagram: "إنستغرام",
      whatsapp: "راسلنا على واتساب",
      language: "اللغة",
    },
    common: { back: "رجوع", currencyNote: "الأسعار بالدينار الأردني." },
  },
  en: {
    tabs: { home: "Home", shop: "Shop", cart: "Cart", about: "About" },
    home: {
      kicker: "Flower & art studio",
      featured: "This week's picks",
      browseFlowers: "Flowers",
      browsePaintings: "Paintings",
      seeAll: "See all",
    },
    shop: {
      title: "Shop",
      all: "All",
      flowers: "Flowers",
      paintings: "Paintings",
      empty: "Nothing in this category right now.",
    },
    product: {
      addToCart: "Add to cart",
      added: "Added ✓",
      soldOut: "Currently unavailable",
      askAbout: "Ask about this piece on WhatsApp",
      from: "From",
      details: "Details",
      delivery: "Delivery",
      quantity: "Quantity",
    },
    cart: {
      title: "Cart",
      empty: "Your cart is empty.",
      emptyCta: "Go browse the shop",
      remove: "Remove",
      clear: "Clear cart",
      subtotal: "Subtotal",
      delivery: "Delivery",
      free: "Free",
      total: "Total",
      yourInfo: "Your details",
      name: "Name",
      phone: "Phone",
      address: "Address",
      notes: "Notes (optional)",
      namePlaceholder: "Your full name",
      phonePlaceholder: "07…",
      addressPlaceholder: "Area, street, building number",
      notesPlaceholder: "Preferred delivery time, card message…",
      checkout: "Send order on WhatsApp",
      checkoutNote: "We'll open WhatsApp with your order written out — just hit send.",
      required: "Please fill in your name, phone and address.",
      cannotOpen: "Couldn't open WhatsApp on this device.",
    },
    about: {
      title: "About the studio",
      hours: "Opening hours",
      address: "Address",
      phone: "Phone",
      email: "Email",
      instagram: "Instagram",
      whatsapp: "Message us on WhatsApp",
      language: "Language",
    },
    common: { back: "Back", currencyNote: "Prices are in Jordanian dinars." },
  },
} as const;

export type Strings = (typeof strings)["ar"];

type LangContextValue = {
  lang: Lang;
  t: Strings;
  /** True when text should flow right to left. */
  rtl: boolean;
  setLang: (lang: Lang) => void;
};

const LangContext = createContext<LangContextValue | null>(null);

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("ar");

  useEffect(() => {
    let active = true;
    AsyncStorage.getItem(STORAGE_KEY)
      .then((stored) => {
        if (active && (stored === "ar" || stored === "en")) setLangState(stored);
      })
      .catch(() => {
        // Storage unavailable; the default language stands.
      });
    return () => {
      active = false;
    };
  }, []);

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    AsyncStorage.setItem(STORAGE_KEY, next).catch(() => {});
  }, []);

  return (
    <LangContext.Provider
      value={{
        lang,
        t: strings[lang] as Strings,
        rtl: lang === "ar",
        setLang,
      }}
    >
      {children}
    </LangContext.Provider>
  );
}

export function useLang(): LangContextValue {
  const context = useContext(LangContext);
  if (!context) throw new Error("useLang must be used inside a LangProvider");
  return context;
}
