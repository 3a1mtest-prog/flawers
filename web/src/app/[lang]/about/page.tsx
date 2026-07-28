import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ProductMedia from "@/components/product-media";
import { byCategory, site } from "@/lib/catalog";
import { getDict, isLang } from "@/lib/i18n";

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/about">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLang(lang)) return {};
  return {
    title: getDict(lang).about.title,
    description: site.description[lang],
  };
}

export default async function AboutPage({
  params,
}: PageProps<"/[lang]/about">) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const t = getDict(lang);

  const showcase = [byCategory("flowers")[1], byCategory("paintings")[1]].filter(
    Boolean,
  );

  return (
    <div className="mx-auto max-w-6xl px-5 py-12">
      <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr]">
        <div>
          <h1 className="font-display text-4xl font-semibold">
            {t.about.title}
          </h1>
          <div className="mt-6 space-y-5 text-lg leading-relaxed text-muted">
            {site.about[lang].map((paragraph) => (
              <p key={paragraph.slice(0, 24)}>{paragraph}</p>
            ))}
          </div>

          <dl className="mt-10 grid gap-6 border-t border-line pt-8 sm:grid-cols-2">
            <div>
              <dt className="text-sm font-bold">{t.contact.address}</dt>
              <dd className="mt-1 text-sm text-muted">
                {site.contact.address[lang]}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-bold">{t.contact.hours}</dt>
              <dd className="mt-1 text-sm text-muted">{site.hours[lang]}</dd>
            </div>
          </dl>

          <Link
            href={`/${lang}/contact`}
            className="mt-8 inline-block rounded-full bg-accent px-7 py-3.5 text-sm font-bold text-on-accent transition-colors hover:bg-accent-strong"
          >
            {t.about.contactCta}
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
          {showcase.map((product) => (
            <div
              key={product.id}
              className="aspect-4/3 overflow-hidden rounded-3xl border border-line"
            >
              <ProductMedia product={product} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
