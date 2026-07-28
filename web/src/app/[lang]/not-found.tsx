import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-md px-5 py-32 text-center">
      <p className="font-display text-6xl font-semibold text-accent">404</p>
      <p className="mt-4 text-lg text-muted">
        هاي الصفحة مش موجودة · This page doesn&apos;t exist
      </p>
      <div className="mt-8 flex justify-center gap-3">
        <Link
          href="/ar"
          className="rounded-full bg-accent px-6 py-3 text-sm font-bold text-on-accent transition-colors hover:bg-accent-strong"
        >
          الرئيسية
        </Link>
        <Link
          href="/en"
          className="rounded-full border border-line bg-surface px-6 py-3 text-sm font-bold transition-colors hover:border-accent hover:text-accent"
        >
          Home
        </Link>
      </div>
    </div>
  );
}
