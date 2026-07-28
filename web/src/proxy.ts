import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const LOCALES = ["ar", "en"] as const;
const DEFAULT_LOCALE = "ar";

/** Picks a locale from Accept-Language, falling back to Arabic. */
function preferredLocale(request: NextRequest): string {
  const header = request.headers.get("accept-language") ?? "";
  const wantsEnglish = header
    .split(",")
    .map((part) => part.split(";")[0].trim().toLowerCase())
    .some((tag) => tag === "en" || tag.startsWith("en-"));
  return wantsEnglish ? "en" : DEFAULT_LOCALE;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const hasLocale = LOCALES.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  );
  if (hasLocale) return;

  const url = request.nextUrl.clone();
  url.pathname = `/${preferredLocale(request)}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  // Skip Next internals and anything that looks like a static file.
  matcher: ["/((?!_next|favicon.ico|.*\\.[\\w]+$).*)"],
};
