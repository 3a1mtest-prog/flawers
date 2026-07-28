import { useColorScheme } from "react-native";

export type Palette = {
  canvas: string;
  surface: string;
  sunk: string;
  ink: string;
  muted: string;
  line: string;
  accent: string;
  accentStrong: string;
  accentSoft: string;
  onAccent: string;
  whatsapp: string;
};

/** Mirrors the colour tokens in web/src/app/globals.css. */
const palettes: Record<"light" | "dark", Palette> = {
  light: {
    canvas: "#faf7f2",
    surface: "#ffffff",
    sunk: "#f3ede4",
    ink: "#211d1a",
    muted: "#6f675e",
    line: "#e7e0d6",
    accent: "#b4536b",
    accentStrong: "#8e3f55",
    accentSoft: "#f7e9ec",
    onAccent: "#ffffff",
    whatsapp: "#1da851",
  },
  dark: {
    canvas: "#15120f",
    surface: "#1e1a16",
    sunk: "#262019",
    ink: "#f3eee7",
    muted: "#a89c8e",
    line: "#322b23",
    accent: "#e08ca1",
    accentStrong: "#f0a8ba",
    accentSoft: "#2c1f24",
    onAccent: "#1c1512",
    whatsapp: "#25d366",
  },
};

export function usePalette(): Palette {
  const scheme = useColorScheme();
  return scheme === "dark" ? palettes.dark : palettes.light;
}

export const radius = { sm: 10, md: 16, lg: 24, pill: 999 };
export const spacing = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 };
