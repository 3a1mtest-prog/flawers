import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Linking,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { formatPrice, buildOrderMessage, whatsappLink, type OrderDetails } from "@/lib/catalog";
import ProductMedia from "@/components/product-media";
import { useCart } from "@/lib/cart";
import { useLang } from "@/lib/i18n";
import { radius, spacing, usePalette } from "@/lib/theme";

const EMPTY_DETAILS: OrderDetails = {
  name: "",
  phone: "",
  address: "",
  notes: "",
};

export default function CartScreen() {
  const c = usePalette();
  const router = useRouter();
  const { lang, t, rtl } = useLang();
  const { lines, subtotal, deliveryFee, total, setQuantity, remove, clear } =
    useCart();

  const [details, setDetails] = useState<OrderDetails>(EMPTY_DETAILS);

  const align = rtl ? ("right" as const) : ("left" as const);
  const complete =
    details.name.trim() !== "" &&
    details.phone.trim() !== "" &&
    details.address.trim() !== "";

  const checkout = async () => {
    if (!complete) {
      Alert.alert(t.cart.required);
      return;
    }
    const message = buildOrderMessage(
      lines,
      { subtotal, deliveryFee, total },
      details,
      lang,
    );
    const url = whatsappLink(message);
    try {
      await Linking.openURL(url);
    } catch {
      Alert.alert(t.cart.cannotOpen);
    }
  };

  if (lines.length === 0) {
    return (
      <View style={[styles.emptyWrap, { backgroundColor: c.canvas }]}>
        <Text style={[styles.emptyText, { color: c.muted }]}>{t.cart.empty}</Text>
        <Pressable
          onPress={() => router.push("/shop")}
          style={[styles.primary, { backgroundColor: c.accent }]}
        >
          <Text style={[styles.primaryText, { color: c.onAccent }]}>
            {t.cart.emptyCta}
          </Text>
        </Pressable>
      </View>
    );
  }

  const field = [
    styles.input,
    { borderColor: c.line, backgroundColor: c.surface, color: c.ink, textAlign: align },
  ];

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: c.canvas }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.scroll}>
        {lines.map((line) => (
          <View
            key={line.key}
            style={[
              styles.line,
              { borderBottomColor: c.line },
              rtl && styles.rowReverse,
            ]}
          >
            <View style={styles.thumb}>
              <ProductMedia product={line.product} radius={radius.sm} />
            </View>

            <View style={styles.lineBody}>
              <Text style={[styles.lineName, { color: c.ink, textAlign: align }]}>
                {line.product.name[lang]}
              </Text>
              {line.choice && (
                <Text style={[styles.lineMeta, { color: c.muted, textAlign: align }]}>
                  {line.choice.name[lang]}
                </Text>
              )}
              <Text style={[styles.lineMeta, { color: c.muted, textAlign: align }]}>
                {formatPrice(line.unitPrice, lang)}
              </Text>

              <View style={[styles.lineActions, rtl && styles.rowReverse]}>
                <View
                  style={[
                    styles.stepper,
                    { borderColor: c.line },
                    rtl && styles.rowReverse,
                  ]}
                >
                  <Pressable
                    onPress={() => setQuantity(line.key, line.quantity - 1)}
                    style={styles.stepButton}
                    accessibilityLabel="-"
                  >
                    <Text style={{ color: c.ink, fontSize: 18 }}>−</Text>
                  </Pressable>
                  <Text style={[styles.quantity, { color: c.ink }]}>
                    {line.quantity}
                  </Text>
                  <Pressable
                    onPress={() => setQuantity(line.key, line.quantity + 1)}
                    style={styles.stepButton}
                    accessibilityLabel="+"
                  >
                    <Text style={{ color: c.ink, fontSize: 18 }}>+</Text>
                  </Pressable>
                </View>

                <Pressable onPress={() => remove(line.key)}>
                  <Text style={{ color: c.muted, fontSize: 13 }}>
                    {t.cart.remove}
                  </Text>
                </Pressable>
              </View>
            </View>

            <Text style={[styles.lineTotal, { color: c.ink }]}>
              {formatPrice(line.lineTotal, lang)}
            </Text>
          </View>
        ))}

        <Pressable onPress={clear} style={styles.clear}>
          <Text style={{ color: c.muted, fontSize: 13, textAlign: align }}>
            {t.cart.clear}
          </Text>
        </Pressable>

        <Text style={[styles.sectionTitle, { color: c.ink, textAlign: align }]}>
          {t.cart.yourInfo}
        </Text>

        <TextInput
          value={details.name}
          onChangeText={(name) => setDetails({ ...details, name })}
          placeholder={t.cart.namePlaceholder}
          placeholderTextColor={c.muted}
          style={field}
        />
        <TextInput
          value={details.phone}
          onChangeText={(phone) => setDetails({ ...details, phone })}
          placeholder={t.cart.phonePlaceholder}
          placeholderTextColor={c.muted}
          keyboardType="phone-pad"
          style={[styles.input, { borderColor: c.line, backgroundColor: c.surface, color: c.ink }]}
        />
        <TextInput
          value={details.address}
          onChangeText={(address) => setDetails({ ...details, address })}
          placeholder={t.cart.addressPlaceholder}
          placeholderTextColor={c.muted}
          style={field}
        />
        <TextInput
          value={details.notes}
          onChangeText={(notes) => setDetails({ ...details, notes })}
          placeholder={t.cart.notesPlaceholder}
          placeholderTextColor={c.muted}
          multiline
          numberOfLines={3}
          style={[...field, styles.textarea]}
        />

        <View style={[styles.totals, { borderTopColor: c.line }]}>
          <View style={[styles.totalRow, rtl && styles.rowReverse]}>
            <Text style={{ color: c.muted }}>{t.cart.subtotal}</Text>
            <Text style={{ color: c.ink }}>{formatPrice(subtotal, lang)}</Text>
          </View>
          <View style={[styles.totalRow, rtl && styles.rowReverse]}>
            <Text style={{ color: c.muted }}>{t.cart.delivery}</Text>
            <Text style={{ color: c.ink }}>
              {deliveryFee === 0 ? t.cart.free : formatPrice(deliveryFee, lang)}
            </Text>
          </View>
          <View
            style={[
              styles.totalRow,
              styles.grandTotal,
              { borderTopColor: c.line },
              rtl && styles.rowReverse,
            ]}
          >
            <Text style={{ color: c.ink, fontWeight: "700" }}>{t.cart.total}</Text>
            <Text style={{ color: c.accent, fontWeight: "700", fontSize: 16 }}>
              {formatPrice(total, lang)}
            </Text>
          </View>
        </View>

        <Pressable
          onPress={checkout}
          style={[
            styles.primary,
            { backgroundColor: complete ? c.whatsapp : c.muted },
          ]}
        >
          <Text style={[styles.primaryText, { color: "#fff" }]}>
            {t.cart.checkout}
          </Text>
        </Pressable>

        <Text style={[styles.note, { color: c.muted }]}>
          {t.cart.checkoutNote}
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scroll: { padding: spacing.md, paddingBottom: spacing.xl, gap: spacing.sm },
  rowReverse: { flexDirection: "row-reverse" },
  emptyWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.lg,
    padding: spacing.lg,
  },
  emptyText: { fontSize: 16 },
  line: {
    flexDirection: "row",
    gap: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
  },
  thumb: { width: 64, height: 80 },
  lineBody: { flex: 1, gap: 2 },
  lineName: { fontSize: 15, fontWeight: "700" },
  lineMeta: { fontSize: 12 },
  lineActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    marginTop: spacing.sm,
  },
  lineTotal: { fontSize: 14, fontWeight: "700" },
  stepper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: radius.pill,
    padding: 2,
  },
  stepButton: { width: 28, height: 28, alignItems: "center", justifyContent: "center" },
  quantity: { width: 24, textAlign: "center", fontWeight: "700", fontSize: 13 },
  clear: { paddingVertical: spacing.sm },
  sectionTitle: { fontSize: 18, fontWeight: "700", marginTop: spacing.md },
  input: {
    borderWidth: 1,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
    fontSize: 14,
  },
  textarea: { minHeight: 84, textAlignVertical: "top" },
  totals: {
    marginTop: spacing.lg,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    gap: spacing.sm,
  },
  totalRow: { flexDirection: "row", justifyContent: "space-between" },
  grandTotal: { borderTopWidth: 1, paddingTop: spacing.sm },
  primary: {
    marginTop: spacing.lg,
    borderRadius: radius.pill,
    paddingVertical: 15,
    paddingHorizontal: spacing.xl,
    alignItems: "center",
  },
  primaryText: { fontSize: 14, fontWeight: "700" },
  note: { fontSize: 12, textAlign: "center", marginTop: spacing.sm, lineHeight: 20 },
});
