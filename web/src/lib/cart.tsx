"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
} from "react";
import { deliveryFeeFor, findChoice, getProduct, priceOf } from "./catalog";
import type { CartLine, Product, ProductOptionChoice } from "./types";

export {
  buildOrderMessage,
  productEnquiryLink,
  whatsappLink,
  type OrderDetails,
} from "@shared/order";

const STORAGE_KEY = "petal.cart.v1";

/* -------------------------------------------------------------------------
 * localStorage-backed store
 *
 * The cart lives in localStorage rather than React state so that every
 * component reading it (header badge, cart page) stays in sync, including
 * across browser tabs. Snapshots are cached so `getSnapshot` keeps returning
 * the same reference until the stored string actually changes.
 * ---------------------------------------------------------------------- */

const EMPTY: CartLine[] = [];

let cachedRaw: string | null = null;
let cachedLines: CartLine[] = EMPTY;
const listeners = new Set<() => void>();

function parse(raw: string | null): CartLine[] {
  if (!raw) return EMPTY;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return EMPTY;
    // Drop anything that no longer matches a real product, e.g. after the
    // catalogue changes under a returning visitor.
    return parsed.filter((line): line is CartLine => {
      if (typeof line !== "object" || line === null) return false;
      const candidate = line as Partial<CartLine>;
      return (
        typeof candidate.productId === "string" &&
        typeof candidate.quantity === "number" &&
        candidate.quantity > 0 &&
        !!getProduct(candidate.productId)
      );
    });
  } catch {
    return EMPTY;
  }
}

function getSnapshot(): CartLine[] {
  let raw: string | null = null;
  try {
    raw = window.localStorage.getItem(STORAGE_KEY);
  } catch {
    // Storage can be blocked entirely; treat that as an empty cart.
    return EMPTY;
  }
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    cachedLines = parse(raw);
  }
  return cachedLines;
}

function getServerSnapshot(): CartLine[] {
  return EMPTY;
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  window.addEventListener("storage", listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
}

function write(next: CartLine[]): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Private-mode browsers can refuse writes; the cart just won't persist.
  }
  listeners.forEach((listener) => listener());
}

function update(updater: (current: CartLine[]) => CartLine[]): void {
  write(updater(getSnapshot()));
}

function lineKey(productId: string, optionId: string | null): string {
  return optionId ? `${productId}::${optionId}` : productId;
}

/* ------------------------------------------------------------------------- */

export type ResolvedLine = CartLine & {
  key: string;
  product: Product;
  choice: ProductOptionChoice | null;
  unitPrice: number;
  lineTotal: number;
};

type CartContextValue = {
  lines: ResolvedLine[];
  itemCount: number;
  subtotal: number;
  deliveryFee: number;
  total: number;
  add: (productId: string, optionId: string | null, quantity?: number) => void;
  setQuantity: (key: string, quantity: number) => void;
  remove: (key: string) => void;
  clear: () => void;
  /** False during server render and hydration, true once the cart is readable. */
  ready: boolean;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const raw = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const ready = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );

  const add = useCallback(
    (productId: string, optionId: string | null, quantity = 1) => {
      update((current) => {
        const key = lineKey(productId, optionId);
        const exists = current.some(
          (l) => lineKey(l.productId, l.optionId) === key,
        );
        return exists
          ? current.map((l) =>
              lineKey(l.productId, l.optionId) === key
                ? { ...l, quantity: Math.min(l.quantity + quantity, 99) }
                : l,
            )
          : [...current, { productId, optionId, quantity }];
      });
    },
    [],
  );

  const setQuantity = useCallback((key: string, quantity: number) => {
    update((current) =>
      quantity <= 0
        ? current.filter((l) => lineKey(l.productId, l.optionId) !== key)
        : current.map((l) =>
            lineKey(l.productId, l.optionId) === key
              ? { ...l, quantity: Math.min(quantity, 99) }
              : l,
          ),
    );
  }, []);

  const remove = useCallback((key: string) => {
    update((current) =>
      current.filter((l) => lineKey(l.productId, l.optionId) !== key),
    );
  }, []);

  const clear = useCallback(() => write([]), []);

  const value = useMemo<CartContextValue>(() => {
    const lines: ResolvedLine[] = raw.flatMap((line) => {
      const product = getProduct(line.productId);
      if (!product) return [];
      const unitPrice = priceOf(product, line.optionId);
      return [
        {
          ...line,
          key: lineKey(line.productId, line.optionId),
          product,
          choice: findChoice(product, line.optionId),
          unitPrice,
          lineTotal: unitPrice * line.quantity,
        },
      ];
    });

    const subtotal = lines.reduce((sum, l) => sum + l.lineTotal, 0);
    const deliveryFee = deliveryFeeFor(subtotal);

    return {
      lines,
      itemCount: lines.reduce((sum, l) => sum + l.quantity, 0),
      subtotal,
      deliveryFee,
      total: subtotal + deliveryFee,
      add,
      setQuantity,
      remove,
      clear,
      ready,
    };
  }, [raw, add, setQuantity, remove, clear, ready]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used inside a CartProvider");
  return context;
}
