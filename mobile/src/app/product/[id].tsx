import { Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import {
  defaultOptionId,
  formatPrice,
  getProduct,
  hasPriceRange,
  lowestPrice,
  priceOf,
  site,
} from "@/lib/catalog";
import { productEnquiryLink } from "@/lib/catalog";
import ProductMedia from "@/components/product-media";
import { useCart } from "@/lib/cart";
import { useLang } from "@/lib/i18n";
import { radius, spacing, usePalette } from "@/lib/theme";

export default function ProductScreen() {
  const c = usePalette();
  const { lang, t, rtl } = useLang();
  const { add } = useCart();
  const { id } = useLocalSearchParams<{ id: string }>();

  const product = getProduct(id);
  const [optionId, setOptionId] = useState<string | null>(
    product ? defaultOptionId(product) : null,
  );
  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);

  useEffect(() => {
    if (!justAdded) return;
    const timer = setTimeout(() => setJustAdded(false), 2000);
    return () => clearTimeout(timer);
  }, [justAdded]);

  const align = rtl ? ("right" as const) : ("left" as const);

  if (!product) {
    return (
      <View style={[styles.missing, { backgroundColor: c.canvas }]}>
        <Text style={{ color: c.muted }}>404</Text>
      </View>
    );
  }

  const unitPrice = priceOf(product, optionId);

  return (
    <ScrollView
      style={{ backgroundColor: c.canvas }}
      contentContainerStyle={styles.scroll}
    >
      <Stack.Screen options={{ title: product.name[lang] }} />

      <View style={styles.media}>
        <ProductMedia product={product} radius={radius.lg} />
      </View>

      {product.badge && (
        <View
          style={[
            styles.badge,
            { backgroundColor: c.accentSoft, alignSelf: rtl ? "flex-end" : "flex-start" },
          ]}
        >
          <Text style={[styles.badgeText, { color: c.accent }]}>
            {product.badge[lang]}
          </Text>
        </View>
      )}

      <Text style={[styles.name, { color: c.ink, textAlign: align }]}>
        {product.name[lang]}
      </Text>

      <Text style={[styles.price, { color: c.accent, textAlign: align }]}>
        {hasPriceRange(product) ? `${t.product.from} ` : ""}
        {formatPrice(lowestPrice(product), lang)}
      </Text>

      <Text style={[styles.summary, { color: c.muted, textAlign: align }]}>
        {product.summary[lang]}
      </Text>

      {product.options && (
        <View style={styles.block}>
          <Text style={[styles.label, { color: c.ink, textAlign: align }]}>
            {product.options.label[lang]}
          </Text>
          <View style={[styles.choices, rtl && styles.rowReverse]}>
            {product.options.choices.map((choice) => {
              const selected = choice.id === optionId;
              return (
                <Pressable
                  key={choice.id}
                  onPress={() => setOptionId(choice.id)}
                  style={[
                    styles.chip,
                    {
                      backgroundColor: selected ? c.accentSoft : c.surface,
                      borderColor: selected ? c.accent : c.line,
                    },
                  ]}
                >
                  <Text
                    style={{
                      color: selected ? c.accent : c.muted,
                      fontWeight: selected ? "700" : "400",
                      fontSize: 13,
                    }}
                  >
                    {choice.name[lang]}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      )}

      <View style={[styles.actions, rtl && styles.rowReverse]}>
        <View style={[styles.stepper, { borderColor: c.line }, rtl && styles.rowReverse]}>
          <Pressable
            onPress={() => setQuantity((q) => Math.max(1, q - 1))}
            style={styles.stepButton}
            accessibilityLabel="-"
          >
            <Text style={[styles.stepText, { color: c.ink }]}>−</Text>
          </Pressable>
          <Text style={[styles.quantity, { color: c.ink }]}>{quantity}</Text>
          <Pressable
            onPress={() => setQuantity((q) => Math.min(99, q + 1))}
            style={styles.stepButton}
            accessibilityLabel="+"
          >
            <Text style={[styles.stepText, { color: c.ink }]}>+</Text>
          </Pressable>
        </View>

        <Pressable
          disabled={!product.inStock}
          onPress={() => {
            add(product.id, optionId, quantity);
            setJustAdded(true);
          }}
          style={[
            styles.addButton,
            { backgroundColor: product.inStock ? c.accent : c.muted },
          ]}
        >
          <Text style={[styles.addText, { color: c.onAccent }]}>
            {!product.inStock
              ? t.product.soldOut
              : justAdded
                ? t.product.added
                : `${t.product.addToCart}  ${formatPrice(unitPrice * quantity, lang)}`}
          </Text>
        </Pressable>
      </View>

      <View style={[styles.block, styles.divider, { borderTopColor: c.line }]}>
        <Text style={[styles.label, { color: c.ink, textAlign: align }]}>
          {t.product.details}
        </Text>
        <Text style={[styles.body, { color: c.muted, textAlign: align }]}>
          {product.details[lang]}
        </Text>
      </View>

      <View style={styles.block}>
        <Text style={[styles.label, { color: c.ink, textAlign: align }]}>
          {t.product.delivery}
        </Text>
        <Text style={[styles.body, { color: c.muted, textAlign: align }]}>
          {site.delivery.note[lang]}
        </Text>
      </View>

      <Pressable
        onPress={() => Linking.openURL(productEnquiryLink(product, lang))}
        style={[styles.whatsapp, { backgroundColor: c.whatsapp }]}
      >
        <Text style={styles.whatsappText}>{t.product.askAbout}</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { padding: spacing.md, paddingBottom: spacing.xl, gap: spacing.sm },
  rowReverse: { flexDirection: "row-reverse" },
  missing: { flex: 1, alignItems: "center", justifyContent: "center" },
  media: { width: "100%", aspectRatio: 4 / 5 },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.pill,
    marginTop: spacing.md,
  },
  badgeText: { fontSize: 12, fontWeight: "700" },
  name: { fontSize: 26, fontWeight: "700", marginTop: spacing.sm },
  price: { fontSize: 20, fontWeight: "700" },
  summary: { fontSize: 15, lineHeight: 26, marginTop: spacing.sm },
  block: { marginTop: spacing.lg, gap: spacing.sm },
  divider: { borderTopWidth: 1, paddingTop: spacing.lg },
  label: { fontSize: 14, fontWeight: "700" },
  body: { fontSize: 14, lineHeight: 24 },
  choices: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  chip: {
    borderWidth: 1,
    borderRadius: radius.pill,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    marginTop: spacing.lg,
  },
  stepper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: radius.pill,
    padding: 4,
  },
  stepButton: { width: 34, height: 34, alignItems: "center", justifyContent: "center" },
  stepText: { fontSize: 20 },
  quantity: { width: 28, textAlign: "center", fontWeight: "700" },
  addButton: {
    flex: 1,
    borderRadius: radius.pill,
    paddingVertical: 15,
    alignItems: "center",
  },
  addText: { fontSize: 14, fontWeight: "700" },
  whatsapp: {
    marginTop: spacing.lg,
    borderRadius: radius.pill,
    paddingVertical: 15,
    alignItems: "center",
  },
  whatsappText: { color: "#fff", fontSize: 14, fontWeight: "700" },
});
