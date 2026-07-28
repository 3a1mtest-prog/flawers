import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ProductCard from "@/components/product-card";
import { byCategory } from "@/lib/catalog";
import { getDict, isLang } from "@/lib/i18n";
import type { Category } from "@/lib/types";

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/shop">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLang(lang)) return {};
  const t = getDict(lang);
  return { title: t.shop.title, description: t.shop.subtitle };
}

function parseCategory(value: string | string[] | undefined): Category | "all" {
  if (value === "flowers" || value === "paintings") return value;
  return "all";
}

export default async function ShopPage({
  params,
  searchParams,
}: PageProps<"/[lang]/shop">) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const t = getDict(lang);

  const { category: rawCategory } = await searchParams;
  const category = parseCategory(rawCategory);
  const items = byCategory(category);

  const tabs = [
    { key: "all", label: t.shop.all, href: `/${lang}/shop` },
    {
      key: "flowers",
      label: t.shop.flowers,
      href: `/${lang}/shop?category=flowers`,
    },
    {
      key: "paintings",
      label: t.shop.paintings,
      href: `/${lang}/shop?category=paintings`,
    },
  ] as const;

  return (
    <div className="mx-auto max-w-6xl px-5 py-12">
      <h1 className="font-display text-4xl font-semibold">{t.shop.title}</h1>
      <p className="mt-2 text-muted">{t.shop.subtitle}</p>

      <div className="mt-8 flex flex-wrap items-center gap-2">
        {tabs.map((tab) => (
          <Link
            key={tab.key}
            href={tab.href}
            scroll={false}
            aria-current={category === tab.key ? "page" : undefined}
            className={`rounded-full border px-5 py-2 text-sm font-bold transition-colors ${
              category === tab.key
                ? "border-accent bg-accent text-on-accent"
                : "border-line bg-surface text-muted hover:border-accent hover:text-accent"
            }`}
          >
            {tab.label}
          </Link>
        ))}
        <span className="ms-auto text-sm text-muted">
          {t.shop.count(items.length)}
        </span>
      </div>

      {items.length === 0 ? (
        <p className="mt-16 text-center text-muted">{t.shop.empty}</p>
      ) : (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((product, index) => (
            <ProductCard
              key={product.id}
              product={product}
              lang={lang}
              priority={index < 3}
            />
          ))}
        </div>
      )}
    </div>
  );
}
