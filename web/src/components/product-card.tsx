import Link from "next/link";
import { formatPrice, hasPriceRange, lowestPrice } from "@/lib/catalog";
import { getDict } from "@/lib/i18n";
import type { Lang, Product } from "@/lib/types";
import ProductMedia from "./product-media";

export default function ProductCard({
  product,
  lang,
  priority = false,
}: {
  product: Product;
  lang: Lang;
  priority?: boolean;
}) {
  const t = getDict(lang);

  return (
    <Link
      href={`/${lang}/product/${product.id}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-line bg-surface transition-shadow hover:shadow-lg hover:shadow-black/5"
    >
      <div className="relative aspect-4/5 overflow-hidden bg-sunk">
        <div className="h-full w-full transition-transform duration-500 group-hover:scale-105">
          <ProductMedia product={product} priority={priority} />
        </div>

        {product.badge && product.inStock && (
          <span className="absolute top-3 start-3 rounded-full bg-surface/95 px-3 py-1 text-[11px] font-bold text-accent shadow-sm">
            {product.badge[lang]}
          </span>
        )}

        {!product.inStock && (
          <span className="absolute inset-0 grid place-items-center bg-canvas/70 text-sm font-bold text-ink backdrop-blur-[2px]">
            {t.product.soldOut}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="font-display text-xl leading-snug font-semibold">
          {product.name[lang]}
        </h3>
        <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-muted">
          {product.summary[lang]}
        </p>
        <p className="mt-3 text-sm font-bold text-accent">
          {hasPriceRange(product) && (
            <span className="me-1 font-normal text-muted">
              {t.product.from}
            </span>
          )}
          {formatPrice(lowestPrice(product), lang)}
        </p>
      </div>
    </Link>
  );
}
