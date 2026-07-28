import Link from "next/link";
import { notFound } from "next/navigation";
import ProductCard from "@/components/product-card";
import ProductMedia from "@/components/product-media";
import { byCategory, featuredProducts, site } from "@/lib/catalog";
import { getDict, isLang } from "@/lib/i18n";

export default async function HomePage({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const t = getDict(lang);

  const flowerSample = byCategory("flowers")[0];
  const paintingSample = byCategory("paintings")[0];

  const steps = [
    { title: t.home.step1Title, body: t.home.step1Body },
    { title: t.home.step2Title, body: t.home.step2Body },
    { title: t.home.step3Title, body: t.home.step3Body },
  ];

  return (
    <>
      {/* Hero */}
      <section className="border-b border-line bg-linear-to-b from-accent-soft/60 to-canvas">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-16 lg:grid-cols-2 lg:py-24">
          <div>
            <p className="text-sm font-bold tracking-widest text-accent uppercase">
              {t.home.heroKicker}
            </p>
            <h1 className="mt-4 font-display text-5xl leading-[1.1] font-semibold text-balance sm:text-6xl">
              {site.tagline[lang]}
            </h1>
            <p className="mt-5 max-w-lg text-lg leading-relaxed text-muted">
              {site.description[lang]}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href={`/${lang}/shop`}
                className="rounded-full bg-accent px-7 py-3.5 text-sm font-bold text-on-accent transition-colors hover:bg-accent-strong"
              >
                {t.home.heroCta}
              </Link>
              <Link
                href={`/${lang}/shop?category=paintings`}
                className="rounded-full border border-line bg-surface px-7 py-3.5 text-sm font-bold transition-colors hover:border-accent hover:text-accent"
              >
                {t.home.heroSecondary}
              </Link>
            </div>
            <p className="mt-6 text-sm text-muted">{site.delivery.note[lang]}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {flowerSample && (
              <div className="aspect-3/4 overflow-hidden rounded-3xl border border-line">
                <ProductMedia product={flowerSample} priority />
              </div>
            )}
            {paintingSample && (
              <div className="mt-10 aspect-3/4 overflow-hidden rounded-3xl border border-line">
                <ProductMedia product={paintingSample} priority />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-6xl px-5 py-16">
        <h2 className="font-display text-3xl font-semibold">
          {t.home.categories}
        </h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {(
            [
              {
                key: "flowers",
                label: t.nav.flowers,
                blurb: t.home.flowersBlurb,
                sample: flowerSample,
              },
              {
                key: "paintings",
                label: t.nav.paintings,
                blurb: t.home.paintingsBlurb,
                sample: paintingSample,
              },
            ] as const
          ).map((entry) => (
            <Link
              key={entry.key}
              href={`/${lang}/shop?category=${entry.key}`}
              className="group relative flex h-56 items-end overflow-hidden rounded-3xl border border-line"
            >
              {entry.sample && (
                <div className="absolute inset-0 transition-transform duration-500 group-hover:scale-105">
                  <ProductMedia product={entry.sample} />
                </div>
              )}
              <div className="relative w-full bg-linear-to-t from-black/65 to-transparent p-6 pt-16 text-white">
                <h3 className="font-display text-3xl font-semibold">
                  {entry.label}
                </h3>
                <p className="mt-1 text-sm text-white/85">{entry.blurb}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured */}
      <section className="mx-auto max-w-6xl px-5 pb-16">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="font-display text-3xl font-semibold">
            {t.home.featured}
          </h2>
          <p className="text-sm text-muted">{t.home.featuredNote}</p>
        </div>
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {featuredProducts.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} lang={lang} />
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="border-y border-line bg-sunk/50">
        <div className="mx-auto max-w-6xl px-5 py-16">
          <h2 className="font-display text-3xl font-semibold">
            {t.home.steps}
          </h2>
          <ol className="mt-8 grid gap-8 sm:grid-cols-3">
            {steps.map((step, index) => (
              <li key={step.title}>
                <span className="grid h-10 w-10 place-items-center rounded-full bg-accent text-sm font-bold text-on-accent">
                  {new Intl.NumberFormat(lang === "ar" ? "ar-EG" : "en").format(
                    index + 1,
                  )}
                </span>
                <h3 className="mt-4 text-lg font-bold">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {step.body}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Story */}
      <section className="mx-auto max-w-3xl px-5 py-20 text-center">
        <h2 className="font-display text-4xl font-semibold text-balance">
          {t.home.storyTitle}
        </h2>
        <p className="mt-5 text-lg leading-relaxed text-muted">
          {site.description[lang]}
        </p>
        <Link
          href={`/${lang}/about`}
          className="mt-8 inline-block rounded-full border border-line bg-surface px-7 py-3.5 text-sm font-bold transition-colors hover:border-accent hover:text-accent"
        >
          {t.home.storyCta}
        </Link>
      </section>
    </>
  );
}
