import { Link, useRouter } from "expo-router";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { byCategory, featuredProducts, site } from "@/lib/catalog";
import ProductCard from "@/components/product-card";
import ProductMedia from "@/components/product-media";
import { useLang } from "@/lib/i18n";
import { radius, spacing, usePalette } from "@/lib/theme";

export default function HomeScreen() {
  const c = usePalette();
  const router = useRouter();
  const { lang, t, rtl, setLang } = useLang();
  const { width } = useWindowDimensions();

  const align = rtl ? ("right" as const) : ("left" as const);
  const cardWidth = Math.min((width - spacing.md * 3) / 2, 220);
  const categories = [
    { key: "flowers" as const, label: t.home.browseFlowers },
    { key: "paintings" as const, label: t.home.browsePaintings },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: c.canvas }} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={[styles.topRow, rtl && styles.rowReverse]}>
          <Text style={[styles.brand, { color: c.ink }]}>
            <Text style={{ color: c.accent }}>✿ </Text>
            {site.brand[lang]}
          </Text>
          <Pressable
            onPress={() => setLang(lang === "ar" ? "en" : "ar")}
            style={[styles.langButton, { borderColor: c.line }]}
          >
            <Text style={{ color: c.muted, fontSize: 13 }}>
              {lang === "ar" ? "English" : "العربية"}
            </Text>
          </Pressable>
        </View>

        <Text style={[styles.kicker, { color: c.accent, textAlign: align }]}>
          {t.home.kicker}
        </Text>
        <Text style={[styles.tagline, { color: c.ink, textAlign: align }]}>
          {site.tagline[lang]}
        </Text>
        <Text style={[styles.description, { color: c.muted, textAlign: align }]}>
          {site.description[lang]}
        </Text>

        <View style={[styles.categoryRow, rtl && styles.rowReverse]}>
          {categories.map((category) => {
            const sample = byCategory(category.key)[0];
            return (
              <Pressable
                key={category.key}
                onPress={() =>
                  router.push({
                    pathname: "/shop",
                    params: { category: category.key },
                  })
                }
                style={[styles.categoryCard, { borderColor: c.line }]}
              >
                {sample && <ProductMedia product={sample} />}
                <View style={styles.categoryOverlay}>
                  <Text style={styles.categoryLabel}>{category.label}</Text>
                </View>
              </Pressable>
            );
          })}
        </View>

        <View style={[styles.sectionHeader, rtl && styles.rowReverse]}>
          <Text style={[styles.sectionTitle, { color: c.ink }]}>
            {t.home.featured}
          </Text>
          <Link href="/shop" style={[styles.seeAll, { color: c.accent }]}>
            {t.home.seeAll}
          </Link>
        </View>

        <View style={[styles.grid, rtl && styles.rowReverse]}>
          {featuredProducts.slice(0, 4).map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              width={cardWidth}
            />
          ))}
        </View>

        <Text style={[styles.note, { color: c.muted, textAlign: align }]}>
          {site.delivery.note[lang]}
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scroll: { padding: spacing.md, paddingBottom: spacing.xl, gap: spacing.sm },
  rowReverse: { flexDirection: "row-reverse" },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  brand: { fontSize: 22, fontWeight: "700" },
  langButton: {
    borderWidth: 1,
    borderRadius: radius.pill,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  kicker: {
    marginTop: spacing.md,
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  tagline: { fontSize: 28, fontWeight: "700", lineHeight: 38 },
  description: { fontSize: 14, lineHeight: 24 },
  categoryRow: { flexDirection: "row", gap: spacing.md, marginTop: spacing.md },
  categoryCard: {
    flex: 1,
    height: 130,
    borderWidth: 1,
    borderRadius: radius.md,
    overflow: "hidden",
    justifyContent: "flex-end",
  },
  categoryOverlay: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    justifyContent: "flex-end",
    padding: spacing.md,
    backgroundColor: "rgba(0,0,0,0.28)",
  },
  categoryLabel: { color: "#fff", fontSize: 20, fontWeight: "700" },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "space-between",
    marginTop: spacing.lg,
  },
  sectionTitle: { fontSize: 20, fontWeight: "700" },
  seeAll: { fontSize: 14, fontWeight: "700" },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.md,
    marginTop: spacing.sm,
  },
  note: { marginTop: spacing.lg, fontSize: 13, lineHeight: 22 },
});
