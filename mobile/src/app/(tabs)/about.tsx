import {
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { site, whatsappLink } from "@/lib/catalog";
import { useLang } from "@/lib/i18n";
import { radius, spacing, usePalette } from "@/lib/theme";

export default function AboutScreen() {
  const c = usePalette();
  const { lang, t, rtl, setLang } = useLang();
  const align = rtl ? ("right" as const) : ("left" as const);

  const rows: { label: string; value: string; url?: string }[] = [
    {
      label: t.about.phone,
      value: site.contact.phone,
      url: `tel:${site.contact.phone.replace(/\s/g, "")}`,
    },
    {
      label: t.about.email,
      value: site.contact.email,
      url: `mailto:${site.contact.email}`,
    },
    {
      label: t.about.instagram,
      value: `@${site.contact.instagram}`,
      url: `https://instagram.com/${site.contact.instagram}`,
    },
    { label: t.about.address, value: site.contact.address[lang] },
    { label: t.about.hours, value: site.hours[lang] },
  ];

  return (
    <ScrollView
      style={{ backgroundColor: c.canvas }}
      contentContainerStyle={styles.scroll}
    >
      <Text style={[styles.title, { color: c.ink, textAlign: align }]}>
        {t.about.title}
      </Text>

      {site.about[lang].map((paragraph) => (
        <Text
          key={paragraph.slice(0, 24)}
          style={[styles.paragraph, { color: c.muted, textAlign: align }]}
        >
          {paragraph}
        </Text>
      ))}

      <Pressable
        onPress={() => Linking.openURL(whatsappLink(""))}
        style={[styles.whatsapp, { backgroundColor: c.whatsapp }]}
      >
        <Text style={styles.whatsappText}>{t.about.whatsapp}</Text>
      </Pressable>

      <View style={[styles.rows, { borderTopColor: c.line }]}>
        {rows.map((row) => (
          <View
            key={row.label}
            style={[
              styles.row,
              { borderBottomColor: c.line },
              rtl && styles.rowReverse,
            ]}
          >
            <Text style={[styles.rowLabel, { color: c.ink }]}>{row.label}</Text>
            <Pressable
              style={styles.rowValueWrap}
              disabled={!row.url}
              onPress={() => row.url && Linking.openURL(row.url)}
            >
              <Text
                style={[
                  styles.rowValue,
                  { color: row.url ? c.accent : c.muted, textAlign: align },
                ]}
              >
                {row.value}
              </Text>
            </Pressable>
          </View>
        ))}
      </View>

      <Text style={[styles.rowLabel, { color: c.ink, textAlign: align }]}>
        {t.about.language}
      </Text>
      <View style={[styles.langRow, rtl && styles.rowReverse]}>
        {(["ar", "en"] as const).map((option) => {
          const active = option === lang;
          return (
            <Pressable
              key={option}
              onPress={() => setLang(option)}
              style={[
                styles.chip,
                {
                  backgroundColor: active ? c.accent : c.surface,
                  borderColor: active ? c.accent : c.line,
                },
              ]}
            >
              <Text
                style={{
                  color: active ? c.onAccent : c.muted,
                  fontWeight: "700",
                  fontSize: 13,
                }}
              >
                {option === "ar" ? "العربية" : "English"}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <Text style={[styles.footer, { color: c.muted }]}>
        {t.common.currencyNote}
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { padding: spacing.md, paddingBottom: spacing.xl, gap: spacing.md },
  rowReverse: { flexDirection: "row-reverse" },
  title: { fontSize: 26, fontWeight: "700" },
  paragraph: { fontSize: 14, lineHeight: 26 },
  whatsapp: {
    marginTop: spacing.sm,
    borderRadius: radius.pill,
    paddingVertical: 15,
    alignItems: "center",
  },
  whatsappText: { color: "#fff", fontSize: 14, fontWeight: "700" },
  rows: { marginTop: spacing.md, borderTopWidth: 1 },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
  },
  rowLabel: { fontSize: 14, fontWeight: "700" },
  rowValueWrap: { flex: 1 },
  rowValue: { fontSize: 14 },
  langRow: { flexDirection: "row", gap: spacing.sm },
  chip: {
    borderWidth: 1,
    borderRadius: radius.pill,
    paddingHorizontal: 18,
    paddingVertical: 8,
  },
  footer: { fontSize: 12, marginTop: spacing.lg, textAlign: "center" },
});
