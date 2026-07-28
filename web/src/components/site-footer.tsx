import Link from "next/link";
import { site } from "@/lib/catalog";
import { getDict } from "@/lib/i18n";
import type { Lang } from "@/lib/types";

export default function SiteFooter({ lang }: { lang: Lang }) {
  const t = getDict(lang);
  const year = new Date().getFullYear();

  return (
    <footer className="mt-24 border-t border-line bg-sunk/50">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div className="sm:col-span-2 lg:col-span-1">
          <p className="flex items-baseline gap-2 font-display text-2xl font-semibold">
            <span className="text-accent">✿</span>
            {site.brand[lang]}
          </p>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted">
            {site.tagline[lang]}
          </p>
        </div>

        <div>
          <h2 className="text-sm font-bold">{t.common.quickLinks}</h2>
          <ul className="mt-4 space-y-2 text-sm text-muted">
            <li>
              <Link href={`/${lang}/shop`} className="hover:text-accent">
                {t.nav.shop}
              </Link>
            </li>
            <li>
              <Link
                href={`/${lang}/shop?category=flowers`}
                className="hover:text-accent"
              >
                {t.nav.flowers}
              </Link>
            </li>
            <li>
              <Link
                href={`/${lang}/shop?category=paintings`}
                className="hover:text-accent"
              >
                {t.nav.paintings}
              </Link>
            </li>
            <li>
              <Link href={`/${lang}/about`} className="hover:text-accent">
                {t.nav.about}
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-sm font-bold">{t.contact.title}</h2>
          <ul className="mt-4 space-y-2 text-sm text-muted">
            <li dir="ltr" className="ltr:text-start rtl:text-end">
              {site.contact.phone}
            </li>
            <li>
              <a
                href={`mailto:${site.contact.email}`}
                className="hover:text-accent"
              >
                {site.contact.email}
              </a>
            </li>
            <li>{site.contact.address[lang]}</li>
          </ul>
        </div>

        <div>
          <h2 className="text-sm font-bold">{t.contact.hours}</h2>
          <p className="mt-4 text-sm leading-relaxed text-muted">
            {site.hours[lang]}
          </p>
          <a
            href={`https://instagram.com/${site.contact.instagram}`}
            target="_blank"
            rel="noreferrer noopener"
            dir="ltr"
            className="mt-4 inline-block text-sm text-accent hover:underline"
          >
            @{site.contact.instagram}
          </a>
        </div>
      </div>

      <div className="border-t border-line">
        <div className="mx-auto flex max-w-6xl flex-col gap-1 px-5 py-6 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {site.brand[lang]}. {t.common.rights}
          </p>
          <p>{t.common.currencyNote}</p>
        </div>
      </div>
    </footer>
  );
}
