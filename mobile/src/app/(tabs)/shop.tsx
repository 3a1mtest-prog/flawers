import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { byCategory } from "@/lib/catalog";
import type { Category } from "@/lib/catalog";
import ProductCard from "@/components/product-card";
import { useLang } from "@/lib/i18n";
import { radius, spacing, usePalette } from "@/lib/theme";

type Filter = Category | "all";

export default function ShopScreen() {
  const c = usePalette();
  const { t, rtl } = useLang();
  const { width } = useWindowDimensions();
  const params = useLocalSearchParams<{ category?: string }>();

  const initial: Filter =
    params.category === "flowers" || params.category === "paintings"
      ? params.category
      : "all";
  const [filter, setFilter] = useState<Filter>(initial);

  // A category passed in from the home screen should win over stale local
  // state when the tab is re-entered with a new parameter.
  const [lastParam, setLastParam] = useState(params.category);
  if (params.category !== lastParam) {
    setLastParam(params.category);
    setFilter(initial);
  }

  const items = byCategory(filter);
  const cardWidth = (width - spacing.md * 3) / 2;

  const tabs: { key: Filter; label: string }[] = [
    { key: "all", label: t.shop.all },
    { key: "flowers", label: t.shop.flowers },
    { key: "paintings", label: t.shop.paintings },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: c.canvas }}>
      <View style={[styles.filters, rtl && styles.rowReverse]}>
        {tabs.map((tab) => {
          const active = tab.key === filter;
          return (
            <Pressable
              key={tab.key}
              onPress={() => setFilter(tab.key)}
              style={[
                styles.chip,
                {
                  backgroundColor: active ? c.accent : c.surface,
                  borderColor: active ? c.accent : c.line,
                },
              ]}
            >
              <Text
                style={[
                  styles.chipText,
                  { color: active ? c.onAccent : c.muted },
                ]}
              >
                {tab.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.list}
        columnWrapperStyle={[styles.column, rtl && styles.rowReverse]}
        renderItem={({ item }) => (
          <ProductCard product={item} width={cardWidth} />
        )}
        ListEmptyComponent={
          <Text style={[styles.empty, { color: c.muted }]}>{t.shop.empty}</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  rowReverse: { flexDirection: "row-reverse" },
  filters: {
    flexDirection: "row",
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  chip: {
    borderWidth: 1,
    borderRadius: radius.pill,
    paddingHorizontal: 18,
    paddingVertical: 8,
  },
  chipText: { fontSize: 13, fontWeight: "700" },
  list: { padding: spacing.md, paddingTop: 0, gap: spacing.md },
  column: { gap: spacing.md },
  empty: { textAlign: "center", marginTop: spacing.xl },
});
