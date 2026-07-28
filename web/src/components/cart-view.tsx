"use client";

import Link from "next/link";
import { useState } from "react";
import {
  buildOrderMessage,
  useCart,
  whatsappLink,
  type OrderDetails,
} from "@/lib/cart";
import { formatPrice } from "@/lib/catalog";
import { getDict } from "@/lib/i18n";
import ProductMedia from "@/components/product-media";
import type { Lang } from "@/lib/types";

const EMPTY_DETAILS: OrderDetails = {
  name: "",
  phone: "",
  address: "",
  notes: "",
};

export default function CartView({ lang }: { lang: Lang }) {
  const t = getDict(lang);
  const { lines, subtotal, deliveryFee, total, setQuantity, remove, clear, ready } =
    useCart();

  const [details, setDetails] = useState<OrderDetails>(EMPTY_DETAILS);
  const [showError, setShowError] = useState(false);

  const complete =
    details.name.trim() !== "" &&
    details.phone.trim() !== "" &&
    details.address.trim() !== "";

  const handleCheckout = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (!complete) {
      event.preventDefault();
      setShowError(true);
    }
  };

  const message = buildOrderMessage(
    lines,
    { subtotal, deliveryFee, total },
    details,
    lang,
  );

  const field =
    "mt-1 w-full rounded-xl border border-line bg-surface px-4 py-3 text-sm outline-none transition-colors focus:border-accent";

  if (!ready) {
    return <div className="min-h-64" aria-busy="true" />;
  }

  if (lines.length === 0) {
    return (
      <div className="py-20 text-center">
        <p className="text-lg text-muted">{t.cart.empty}</p>
        <Link
          href={`/${lang}/shop`}
          className="mt-6 inline-block rounded-full bg-accent px-7 py-3.5 text-sm font-bold text-on-accent transition-colors hover:bg-accent-strong"
        >
          {t.cart.emptyCta}
        </Link>
      </div>
    );
  }

  return (
    <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_22rem]">
      <div>
        <ul className="divide-y divide-line border-y border-line">
          {lines.map((line) => (
            <li key={line.key} className="flex gap-4 py-5">
              <Link
                href={`/${lang}/product/${line.product.id}`}
                className="h-24 w-20 shrink-0 overflow-hidden rounded-xl border border-line bg-sunk"
              >
                <ProductMedia product={line.product} sizes="80px" />
              </Link>

              <div className="min-w-0 flex-1">
                <Link
                  href={`/${lang}/product/${line.product.id}`}
                  className="font-display text-lg font-semibold hover:text-accent"
                >
                  {line.product.name[lang]}
                </Link>
                {line.choice && (
                  <p className="text-sm text-muted">{line.choice.name[lang]}</p>
                )}
                <p className="mt-1 text-sm text-muted">
                  {formatPrice(line.unitPrice, lang)}
                </p>

                <div className="mt-3 flex items-center gap-3">
                  <div className="flex items-center gap-1 rounded-full border border-line p-1">
                    <button
                      type="button"
                      onClick={() => setQuantity(line.key, line.quantity - 1)}
                      aria-label="-"
                      className="grid h-7 w-7 place-items-center rounded-full transition-colors hover:bg-sunk"
                    >
                      −
                    </button>
                    <span className="w-7 text-center text-sm font-bold">
                      {line.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity(line.key, line.quantity + 1)}
                      aria-label="+"
                      className="grid h-7 w-7 place-items-center rounded-full transition-colors hover:bg-sunk"
                    >
                      +
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => remove(line.key)}
                    className="text-sm text-muted transition-colors hover:text-accent"
                  >
                    {t.cart.remove}
                  </button>
                </div>
              </div>

              <p className="shrink-0 text-sm font-bold">
                {formatPrice(line.lineTotal, lang)}
              </p>
            </li>
          ))}
        </ul>

        <button
          type="button"
          onClick={clear}
          className="mt-4 text-sm text-muted transition-colors hover:text-accent"
        >
          {t.cart.clear}
        </button>
      </div>

      <aside className="h-fit rounded-3xl border border-line bg-surface p-6 lg:sticky lg:top-24">
        <h2 className="font-display text-2xl font-semibold">
          {t.cart.yourInfo}
        </h2>

        <div className="mt-4 space-y-4">
          <label className="block text-sm font-bold">
            {t.cart.name}
            <input
              type="text"
              value={details.name}
              onChange={(e) =>
                setDetails({ ...details, name: e.target.value })
              }
              placeholder={t.cart.namePlaceholder}
              autoComplete="name"
              className={field}
            />
          </label>

          <label className="block text-sm font-bold">
            {t.cart.phone}
            <input
              type="tel"
              dir="ltr"
              value={details.phone}
              onChange={(e) =>
                setDetails({ ...details, phone: e.target.value })
              }
              placeholder={t.cart.phonePlaceholder}
              autoComplete="tel"
              className={`${field} text-start`}
            />
          </label>

          <label className="block text-sm font-bold">
            {t.cart.address}
            <input
              type="text"
              value={details.address}
              onChange={(e) =>
                setDetails({ ...details, address: e.target.value })
              }
              placeholder={t.cart.addressPlaceholder}
              autoComplete="street-address"
              className={field}
            />
          </label>

          <label className="block text-sm font-bold">
            {t.cart.notes}
            <textarea
              rows={3}
              value={details.notes}
              onChange={(e) =>
                setDetails({ ...details, notes: e.target.value })
              }
              placeholder={t.cart.notesPlaceholder}
              className={`${field} resize-y`}
            />
          </label>
        </div>

        <dl className="mt-6 space-y-2 border-t border-line pt-5 text-sm">
          <div className="flex justify-between">
            <dt className="text-muted">{t.cart.subtotal}</dt>
            <dd>{formatPrice(subtotal, lang)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted">{t.cart.deliveryFee}</dt>
            <dd>
              {deliveryFee === 0 ? t.cart.free : formatPrice(deliveryFee, lang)}
            </dd>
          </div>
          <div className="flex justify-between border-t border-line pt-3 text-base font-bold">
            <dt>{t.cart.total}</dt>
            <dd className="text-accent">{formatPrice(total, lang)}</dd>
          </div>
        </dl>

        {showError && !complete && (
          <p role="alert" className="mt-4 text-sm font-bold text-accent">
            {t.cart.required}
          </p>
        )}

        <a
          href={complete ? whatsappLink(message) : "#"}
          onClick={handleCheckout}
          target={complete ? "_blank" : undefined}
          rel="noreferrer noopener"
          aria-disabled={!complete}
          className={`mt-5 block rounded-full px-7 py-3.5 text-center text-sm font-bold text-white transition-colors ${
            complete
              ? "bg-whatsapp hover:opacity-90"
              : "cursor-not-allowed bg-muted"
          }`}
        >
          {t.cart.checkout}
        </a>

        <p className="mt-3 text-center text-xs leading-relaxed text-muted">
          {t.cart.checkoutNote}
        </p>
      </aside>
    </div>
  );
}
