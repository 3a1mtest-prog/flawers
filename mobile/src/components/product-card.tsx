import { useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { formatPrice, hasPriceRange, lowestPrice } from "@/lib/catalog";
import type { Product } from "@/lib/catalog";
import { useLang } from "@/lib/i18n";
import { radius, spacing, usePalette } from "@/lib/theme";
import ProductMedia from "./product-media";

export default function ProductCard({
  product,
  width,
}: {
  product: Product;
  width?: number;
}) {
  const c = usePalette();
  const router = useRouter();
  const { lang, t, rtl } = useLang();
  const align = rtl ? ("right" as const) : ("left" as const);

  // Navigated imperatively rather than through <Link asChild>, because Link
  // passes its own style down and would drop the card's width.
  return (
    <Pressable
      onPress={() => router.push(`/product/${product.id}`)}
      style={({ pressed }) => [
        styles.card,
        {
          width,
          backgroundColor: c.surface,
          borderColor: c.line,
          opacity: pressed ? 0.85 : 1,
        },
      ]}
    >
        <View style={styles.media}>
          <ProductMedia product={product} />

          {product.badge && product.inStock && (
            <View style={[styles.badge, { backgroundColor: c.surface }]}>
              <Text style={[styles.badgeText, { color: c.accent }]}>
                {product.badge[lang]}
              </Text>
            </View>
          )}

          {!product.inStock && (
            <View style={[styles.soldOut, { backgroundColor: c.canvas + "cc" }]}>
              <Text style={[styles.soldOutText, { color: c.ink }]}>
                {t.product.soldOut}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.body}>
          <Text
            numberOfLines={2}
            style={[styles.name, { color: c.ink, textAlign: align }]}
          >
            {product.name[lang]}
          </Text>
          <Text
            numberOfLines={2}
            style={[styles.summary, { color: c.muted, textAlign: align }]}
          >
            {product.summary[lang]}
          </Text>
          <Text style={[styles.price, { color: c.accent, textAlign: align }]}>
            {hasPriceRange(product) ? `${t.product.from} ` : ""}
            {formatPrice(lowestPrice(product), lang)}
          </Text>
        </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: radius.md,
    overflow: "hidden",
  },
  media: { aspectRatio: 4 / 5, width: "100%" },
  badge: {
    position: "absolute",
    top: spacing.sm,
    left: spacing.sm,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.pill,
  },
  badgeText: { fontSize: 11, fontWeight: "700" },
  soldOut: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  soldOutText: { fontWeight: "700" },
  body: { padding: spacing.md, gap: 4 },
  name: { fontSize: 16, fontWeight: "700" },
  summary: { fontSize: 12, lineHeight: 18 },
  price: { fontSize: 14, fontWeight: "700", marginTop: 4 },
});
