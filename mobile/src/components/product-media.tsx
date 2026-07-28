import { LinearGradient } from "expo-linear-gradient";
import { Image, StyleSheet, Text, View } from "react-native";
import type { Product } from "@/lib/catalog";

/**
 * Product imagery. Until the shop owner adds a real photo URL to
 * shared/products.json this renders the product's gradient with a glyph that
 * matches the category, so lists never show blank or broken images.
 */
export default function ProductMedia({
  product,
  radius = 0,
}: {
  product: Product;
  radius?: number;
}) {
  if (product.image) {
    return (
      <Image
        source={{ uri: product.image }}
        style={[styles.fill, { borderRadius: radius }]}
        resizeMode="cover"
        accessibilityLabel={product.name.en}
      />
    );
  }

  return (
    <LinearGradient
      colors={product.palette}
      start={{ x: 0.15, y: 0 }}
      end={{ x: 0.85, y: 1 }}
      style={[styles.fill, styles.center, { borderRadius: radius }]}
    >
      <View style={styles.center}>
        <Text style={styles.glyph}>
          {product.category === "flowers" ? "✿" : "❖"}
        </Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  fill: { width: "100%", height: "100%" },
  center: { alignItems: "center", justifyContent: "center" },
  glyph: { fontSize: 56, color: "rgba(255,255,255,0.5)" },
});
