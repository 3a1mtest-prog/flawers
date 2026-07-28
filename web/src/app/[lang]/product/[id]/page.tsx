import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { productEnquiryLink } from "@shared/order";
import AddToCart from "@/components/add-to-cart";
import ProductCard from "@/components/product-card";
import ProductMedia from "@/components/product-media";
import {
  formatPrice,
  getProduct,
  hasPriceRange,
  lowestPrice,
  products,
  site,
} from "@/lib/catalog";
import { getDict, isLang, LANGS } from "@/lib/i18n";

export function generateStaticParams() {
  return LANGS.flatMap((lang) =>
    products.map((product) => ({ lang, id: product.id })),
  );
}

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/product/[id]">): Promise<Metadata> {
  const { lang, id } = await params;
  const product = getProduct(id);
  if (!isLang(lang) || !product) return {};
  return {
    title: product.name[lang],
    description: product.summary[lang],
  };
}

export default async function ProductPage({
  params,
}: PageProps<"/[lang]/product/[id]">) {
  const { lang, id } = await params;
  if (!isLang(lang)) notFound();

  const product = getProduct(id);
  if (!product) notFound();

  const t = getDict(lang);
  const related = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 3);

  return (
    <div className="mx-auto max-w-6xl px-5 py-10">
      <Link
        href={`/${lang}/shop`}
        className="text-sm text-muted transition-colors hover:text-accent"
      >
        <span className="rtl:hidden">←</span>
        <span className="ltr:hidden">→</span> {t.product.back}
      </Link>

      <div className="mt-6 grid gap-10 lg:grid-cols-2">
        <div className="aspect-4/5 overflow-hidden rounded-3xl border border-line bg-sunk">
          <ProductMedia
            product={product}
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </div>

        <div>
          {product.badge && (
            <span className="inline-block rounded-full bg-accent-soft px-3 py-1 text-xs font-bold text-accent">
              {product.badge[lang]}
            </span>
          )}

          <h1 className="mt-3 font-display text-4xl leading-tight font-semibold">
            {product.name[lang]}
          </h1>

          <p className="mt-4 text-2xl font-bold text-accent">
            {hasPriceRange(product) && (
              <span className="me-1 text-base font-normal text-muted">
                {t.product.from}
              </span>
            )}
            {formatPrice(lowestPrice(product), lang)}
          </p>

          <p className="mt-5 text-lg leading-relaxed text-muted">
            {product.summary[lang]}
          </p>

          <AddToCart product={product} lang={lang} />

          <div className="mt-10 space-y-6 border-t border-line pt-6">
            <section>
              <h2 className="text-sm font-bold">{t.product.details}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {product.details[lang]}
              </p>
            </section>

            <section>
              <h2 className="text-sm font-bold">{t.product.delivery}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {site.delivery.note[lang]}
              </p>
            </section>

            <a
              href={productEnquiryLink(product, lang)}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-block text-sm font-bold text-accent hover:underline"
            >
              {t.product.askAbout} →
            </a>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-20">
          <h2 className="font-display text-3xl font-semibold">
            {t.product.related}
          </h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((item) => (
              <ProductCard key={item.id} product={item} lang={lang} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
