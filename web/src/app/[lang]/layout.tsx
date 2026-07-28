import type { Metadata } from "next";
import { Cormorant_Garamond, Tajawal } from "next/font/google";
import { notFound } from "next/navigation";
import "../globals.css";
import { CartProvider } from "@/lib/cart";
import { site } from "@/lib/catalog";
import { getDict, isLang, LANGS } from "@/lib/i18n";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";

const body = Tajawal({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "700"],
  variable: "--font-body",
  display: "swap",
});

const display = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600"],
  variable: "--font-display",
  display: "swap",
});

export function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLang(lang)) return {};
  return {
    title: {
      default: `${site.brand[lang]} — ${site.tagline[lang]}`,
      template: `%s · ${site.brand[lang]}`,
    },
    description: site.description[lang],
    openGraph: {
      title: `${site.brand[lang]} — ${site.tagline[lang]}`,
      description: site.description[lang],
      locale: lang === "ar" ? "ar_JO" : "en_JO",
      type: "website",
    },
  };
}

export default async function RootLayout({
  children,
  params,
}: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const t = getDict(lang);

  return (
    <html lang={lang} dir={t.dir}>
      <body className={`${body.variable} ${display.variable} antialiased`}>
        <CartProvider>
          <div className="flex min-h-screen flex-col">
            <SiteHeader lang={lang} />
            <main className="flex-1">{children}</main>
            <SiteFooter lang={lang} />
          </div>
        </CartProvider>
      </body>
    </html>
  );
}
