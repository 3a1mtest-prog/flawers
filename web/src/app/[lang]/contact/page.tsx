import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { site } from "@/lib/catalog";
import { getDict, isLang } from "@/lib/i18n";

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/contact">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLang(lang)) return {};
  const t = getDict(lang);
  return { title: t.contact.title, description: t.contact.subtitle };
}

export default async function ContactPage({
  params,
}: PageProps<"/[lang]/contact">) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const t = getDict(lang);

  const rows = [
    {
      label: t.contact.phone,
      value: site.contact.phone,
      href: `tel:${site.contact.phone.replace(/\s/g, "")}`,
      ltr: true,
    },
    {
      label: t.contact.email,
      value: site.contact.email,
      href: `mailto:${site.contact.email}`,
      ltr: true,
    },
    {
      label: t.contact.instagram,
      value: `@${site.contact.instagram}`,
      href: `https://instagram.com/${site.contact.instagram}`,
      ltr: true,
    },
    {
      label: t.contact.address,
      value: site.contact.address[lang],
      href: null,
      ltr: false,
    },
    { label: t.contact.hours, value: site.hours[lang], href: null, ltr: false },
  ];

  return (
    <div className="mx-auto max-w-3xl px-5 py-12">
      <h1 className="font-display text-4xl font-semibold">{t.contact.title}</h1>
      <p className="mt-2 text-muted">{t.contact.subtitle}</p>

      <a
        href={`https://wa.me/${site.contact.whatsapp}`}
        target="_blank"
        rel="noreferrer noopener"
        className="mt-8 flex items-center justify-center gap-3 rounded-full bg-whatsapp px-7 py-4 text-sm font-bold text-white transition-opacity hover:opacity-90"
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden>
          <path d="M12 2a10 10 0 0 0-8.6 15L2 22l5.2-1.4A10 10 0 1 0 12 2Zm5.3 14.1c-.2.6-1.2 1.2-1.7 1.2-.5.1-1 .1-1.6-.1-.4-.1-.9-.3-1.5-.6-2.6-1.1-4.3-3.8-4.4-4-.1-.2-1-1.4-1-2.6 0-1.2.6-1.8.9-2.1.2-.2.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 1.9c.1.2 0 .4-.1.5l-.3.4c-.1.1-.3.3-.1.6.1.2.6 1 1.3 1.7.9.8 1.6 1 1.9 1.2.2.1.4 0 .5-.1l.7-.8c.2-.2.3-.2.5-.1l1.8.9c.3.1.4.2.5.3.1.2.1.6-.1 1.1Z" />
        </svg>
        {t.contact.whatsapp}
      </a>

      <dl className="mt-10 divide-y divide-line border-y border-line">
        {rows.map((row) => (
          <div key={row.label} className="flex gap-6 py-4">
            <dt className="w-32 shrink-0 text-sm font-bold">{row.label}</dt>
            <dd className="text-sm text-muted">
              {row.href ? (
                <a
                  href={row.href}
                  target={row.href.startsWith("http") ? "_blank" : undefined}
                  rel="noreferrer noopener"
                  dir={row.ltr ? "ltr" : undefined}
                  className="inline-block hover:text-accent"
                >
                  {row.value}
                </a>
              ) : (
                row.value
              )}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
