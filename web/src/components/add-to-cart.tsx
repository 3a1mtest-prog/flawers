"use client";

import { useEffect, useState } from "react";
import { useCart } from "@/lib/cart";
import { formatPrice, priceOf } from "@/lib/catalog";
import { getDict } from "@/lib/i18n";
import type { Lang, Product } from "@/lib/types";

export default function AddToCart({
  product,
  lang,
}: {
  product: Product;
  lang: Lang;
}) {
  const t = getDict(lang);
  const { add } = useCart();

  // Default to the standard choice (the one priced at the base price) so the
  // preselected option matches the price shown in listings.
  const [optionId, setOptionId] = useState<string | null>(
    product.options
      ? (product.options.choices.find((c) => c.priceDelta === 0) ??
          product.options.choices[0])!.id
      : null,
  );
  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);

  // Reset the confirmation label a moment after it appears.
  useEffect(() => {
    if (!justAdded) return;
    const timer = setTimeout(() => setJustAdded(false), 2000);
    return () => clearTimeout(timer);
  }, [justAdded]);

  const unitPrice = priceOf(product, optionId);

  return (
    <div className="mt-8">
      {product.options && (
        <fieldset>
          <legend className="text-sm font-bold">
            {product.options.label[lang]}
          </legend>
          <div className="mt-3 flex flex-wrap gap-2">
            {product.options.choices.map((choice) => {
              const selected = choice.id === optionId;
              return (
                <button
                  key={choice.id}
                  type="button"
                  onClick={() => setOptionId(choice.id)}
                  aria-pressed={selected}
                  className={`rounded-full border px-4 py-2 text-sm transition-colors ${
                    selected
                      ? "border-accent bg-accent-soft font-bold text-accent"
                      : "border-line bg-surface text-muted hover:border-accent"
                  }`}
                >
                  {choice.name[lang]}
                </button>
              );
            })}
          </div>
        </fieldset>
      )}

      <div className="mt-6 flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-1 rounded-full border border-line bg-surface p-1">
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            disabled={quantity <= 1}
            aria-label="-"
            className="grid h-9 w-9 place-items-center rounded-full text-lg transition-colors hover:bg-sunk disabled:opacity-40"
          >
            −
          </button>
          <span
            aria-label={t.product.quantity}
            className="w-8 text-center text-sm font-bold"
          >
            {quantity}
          </span>
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.min(99, q + 1))}
            disabled={quantity >= 99}
            aria-label="+"
            className="grid h-9 w-9 place-items-center rounded-full text-lg transition-colors hover:bg-sunk disabled:opacity-40"
          >
            +
          </button>
        </div>

        <button
          type="button"
          disabled={!product.inStock}
          onClick={() => {
            add(product.id, optionId, quantity);
            setJustAdded(true);
          }}
          className="flex flex-1 items-center justify-center gap-2 rounded-full bg-accent px-8 py-3.5 text-sm font-bold text-on-accent transition-colors hover:bg-accent-strong disabled:cursor-not-allowed disabled:bg-muted"
        >
          {!product.inStock ? (
            t.product.soldOut
          ) : justAdded ? (
            t.product.added
          ) : (
            <>
              <span>{t.product.addToCart}</span>
              {/* Kept in its own element so the digits never reorder into the
                  surrounding Arabic text. */}
              <span className="opacity-60">·</span>
              <span>{formatPrice(unitPrice * quantity, lang)}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
