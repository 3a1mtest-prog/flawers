"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useCart } from "@/lib/cart";
import { site } from "@/lib/catalog";
import { getDict, otherLang } from "@/lib/i18n";
import type { Lang } from "@/lib/types";

function BagIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M6 8h12l-1 12H7L6 8Z" />
      <path d="M9.5 8V6.5a2.5 2.5 0 0 1 5 0V8" />
    </svg>
  );
}

export default function SiteHeader({ lang }: { lang: Lang }) {
  const t = getDict(lang);
  const pathname = usePathname();
  const { itemCount, ready } = useCart();
  const [open, setOpen] = useState(false);

  const links = [
    { href: `/${lang}`, label: t.nav.home },
    { href: `/${lang}/shop`, label: t.nav.shop },
    { href: `/${lang}/shop?category=flowers`, label: t.nav.flowers },
    { href: `/${lang}/shop?category=paintings`, label: t.nav.paintings },
    { href: `/${lang}/about`, label: t.nav.about },
    { href: `/${lang}/contact`, label: t.nav.contact },
  ];

  // Swap only the leading locale segment so the visitor stays on the same page.
  const swapped = pathname.replace(/^\/(ar|en)/, `/${otherLang(lang)}`);

  const isActive = (href: string) => {
    const [path] = href.split("?");
    if (path === `/${lang}`) return pathname === path;
    return pathname === path || pathname.startsWith(`${path}/`);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-canvas/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center gap-4 px-5 py-4">
        <Link
          href={`/${lang}`}
          className="flex items-baseline gap-2 font-display text-2xl leading-none font-semibold tracking-tight"
          onClick={() => setOpen(false)}
        >
          <span className="text-accent">✿</span>
          <span>{site.brand[lang]}</span>
        </Link>

        <nav className="mx-auto hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-full px-3 py-2 text-sm transition-colors hover:bg-sunk ${
                isActive(link.href) ? "text-accent" : "text-muted"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="ms-auto flex items-center gap-1 md:ms-0">
          <Link
            href={swapped}
            hrefLang={otherLang(lang)}
            className="rounded-full px-3 py-2 text-sm text-muted transition-colors hover:bg-sunk"
          >
            {t.common.switchLang}
          </Link>

          <Link
            href={`/${lang}/cart`}
            className="relative rounded-full p-2 text-ink transition-colors hover:bg-sunk"
            aria-label={t.nav.cart}
          >
            <BagIcon className="h-6 w-6" />
            {ready && itemCount > 0 && (
              <span className="absolute -top-0.5 -end-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-accent px-1 text-[11px] leading-none font-bold text-on-accent">
                {itemCount}
              </span>
            )}
          </Link>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label={t.nav.shop}
            className="rounded-full p-2 transition-colors hover:bg-sunk md:hidden"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              aria-hidden
            >
              {open ? (
                <path d="M6 6l12 12M18 6L6 18" />
              ) : (
                <path d="M4 7h16M4 12h16M4 17h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-line bg-canvas px-5 pb-4 md:hidden">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className={`block border-b border-line/60 py-3 text-sm last:border-b-0 ${
                isActive(link.href) ? "text-accent" : "text-ink"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
