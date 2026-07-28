import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { CartProvider } from "@/lib/cart";
import { LangProvider } from "@/lib/i18n";
import { usePalette } from "@/lib/theme";

function Navigator() {
  const c = usePalette();

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: c.canvas },
        headerTintColor: c.ink,
        headerTitleStyle: { fontWeight: "700" },
        contentStyle: { backgroundColor: c.canvas },
      }}
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="product/[id]" options={{ title: "" }} />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <LangProvider>
        <CartProvider>
          <StatusBar style="auto" />
          <Navigator />
        </CartProvider>
      </LangProvider>
    </SafeAreaProvider>
  );
}
