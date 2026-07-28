import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CartView from "@/components/cart-view";
import { getDict, isLang } from "@/lib/i18n";

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/cart">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLang(lang)) return {};
  return { title: getDict(lang).cart.title };
}

export default async function CartPage({ params }: PageProps<"/[lang]/cart">) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const t = getDict(lang);

  return (
    <div className="mx-auto max-w-6xl px-5 py-12">
      <h1 className="font-display text-4xl font-semibold">{t.cart.title}</h1>
      <CartView lang={lang} />
    </div>
  );
}
