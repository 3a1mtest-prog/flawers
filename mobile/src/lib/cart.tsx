import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { deliveryFeeFor, findChoice, getProduct, priceOf } from "@/lib/catalog";
import type { CartLine, Product, ProductOptionChoice } from "@/lib/catalog";

const STORAGE_KEY = "petal.cart.v1";

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
};

const CartContext = createContext<CartContextValue | null>(null);

function lineKey(productId: string, optionId: string | null): string {
  return optionId ? `${productId}::${optionId}` : productId;
}

function parse(raw: string | null): CartLine[] {
  if (!raw) return [];
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    // Drop anything that no longer matches a real product, e.g. after the
    // catalogue changes under a returning customer.
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
    return [];
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [raw, setRaw] = useState<CartLine[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let active = true;
    AsyncStorage.getItem(STORAGE_KEY)
      .then((stored) => {
        if (!active) return;
        setRaw(parse(stored));
        setLoaded(true);
      })
      .catch(() => {
        if (active) setLoaded(true);
      });
    return () => {
      active = false;
    };
  }, []);

  // Persist after the first read, so an empty initial state never overwrites a
  // stored cart before it has loaded.
  useEffect(() => {
    if (!loaded) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(raw)).catch(() => {});
  }, [raw, loaded]);

  const add = useCallback(
    (productId: string, optionId: string | null, quantity = 1) => {
      setRaw((current) => {
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
    setRaw((current) =>
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
    setRaw((current) =>
      current.filter((l) => lineKey(l.productId, l.optionId) !== key),
    );
  }, []);

  const clear = useCallback(() => setRaw([]), []);

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
    };
  }, [raw, add, setQuantity, remove, clear]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used inside a CartProvider");
  return context;
}
