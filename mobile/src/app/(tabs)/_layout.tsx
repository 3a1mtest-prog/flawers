import Ionicons from "@expo/vector-icons/Ionicons";
import { Tabs } from "expo-router";
import { useCart } from "@/lib/cart";
import { useLang } from "@/lib/i18n";
import { usePalette } from "@/lib/theme";

export default function TabsLayout() {
  const c = usePalette();
  const { t } = useLang();
  const { itemCount } = useCart();

  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: c.canvas },
        headerTintColor: c.ink,
        headerTitleStyle: { fontWeight: "700" },
        sceneStyle: { backgroundColor: c.canvas },
        tabBarStyle: { backgroundColor: c.surface, borderTopColor: c.line },
        tabBarActiveTintColor: c.accent,
        tabBarInactiveTintColor: c.muted,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t.tabs.home,
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="shop"
        options={{
          title: t.tabs.shop,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="flower-outline" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: t.tabs.cart,
          tabBarBadge: itemCount > 0 ? itemCount : undefined,
          tabBarBadgeStyle: { backgroundColor: c.accent, color: c.onAccent },
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="bag-outline" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="about"
        options={{
          title: t.tabs.about,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="information-circle-outline" color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}
