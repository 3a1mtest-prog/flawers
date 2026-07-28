import type { Product } from "@/lib/types";

/**
 * Product imagery. Until the shop owner adds a real photo URL to
 * `shared/products.json`, this renders a per-product gradient with a motif that
 * matches the category, so the grid never shows broken or missing images.
 */
export default function ProductMedia({
  product,
  className = "",
  sizes = "(max-width: 768px) 100vw, 33vw",
  priority = false,
}: {
  product: Product;
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  const [from, to] = product.palette;

  if (product.image) {
    return (
      // Photos are supplied by the shop owner as arbitrary remote URLs, so this
      // deliberately uses a plain <img> rather than next/image's optimiser.
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={product.image}
        alt={product.name.en}
        sizes={sizes}
        loading={priority ? "eager" : "lazy"}
        className={`h-full w-full object-cover ${className}`}
      />
    );
  }

  return (
    <div
      aria-hidden
      className={`relative h-full w-full ${className}`}
      style={{ background: `linear-gradient(150deg, ${from} 0%, ${to} 100%)` }}
    >
      <svg
        viewBox="0 0 120 120"
        className="absolute inset-0 h-full w-full text-white/45"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
      >
        {product.category === "flowers" ? (
          <g>
            <path d="M60 96V54" strokeLinecap="round" />
            <path d="M60 74c-9 0-16-5-18-13 9-2 16 3 18 13Z" />
            <path d="M60 82c9 0 16-5 18-13-9-2-16 3-18 13Z" />
            {[0, 60, 120, 180, 240, 300].map((angle) => (
              <ellipse
                key={angle}
                cx="60"
                cy="34"
                rx="7"
                ry="14"
                transform={`rotate(${angle} 60 48)`}
              />
            ))}
            <circle cx="60" cy="48" r="5" />
          </g>
        ) : (
          <g>
            <rect x="26" y="24" width="68" height="72" rx="2" />
            <rect x="34" y="32" width="52" height="56" rx="1" />
            <path d="M34 74l14-16 11 12 9-10 18 20" strokeLinejoin="round" />
            <circle cx="72" cy="46" r="5" />
          </g>
        )}
      </svg>
    </div>
  );
}
