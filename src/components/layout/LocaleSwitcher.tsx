"use client";

import { useSearchParams } from "next/navigation";
import { useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";

type Props = {
  pathname: string;
  variant: "desktop" | "mobile";
  closeMenu?: () => void;
};

/**
 * Fallback when LocaleSwitcher is suspended (SSR/prerender). Same UI, pathname only.
 */
export function LocaleSwitcherFallback({
  pathname,
  variant,
  closeMenu,
}: Props) {
  const locale = useLocale();

  const linkClass =
    variant === "desktop"
      ? (active: boolean) =>
          active ? "font-semibold text-primary" : "hover:text-primary"
      : (active: boolean) =>
          active
            ? "bg-primary text-white"
            : "bg-slate-100 text-slate-700 hover:bg-slate-200";

  if (variant === "desktop") {
    return (
      <span className="flex items-center gap-1 text-sm text-slate-400">
        <Link href={pathname} locale="my" className={linkClass(locale === "my")}>
          မြန်မာ
        </Link>
        <span aria-hidden>|</span>
        <Link href={pathname} locale="en" className={linkClass(locale === "en")}>
          EN
        </Link>
      </span>
    );
  }

  return (
    <div className="flex gap-2">
      <Link
        href={pathname}
        locale="my"
        onClick={closeMenu}
        className={`flex-1 rounded-lg px-3 py-2.5 text-center text-sm font-medium transition-colors ${linkClass(
          locale === "my"
        )}`}
      >
        မြန်မာ
      </Link>
      <Link
        href={pathname}
        locale="en"
        onClick={closeMenu}
        className={`flex-1 rounded-lg px-3 py-2.5 text-center text-sm font-medium transition-colors ${linkClass(
          locale === "en"
        )}`}
      >
        EN
      </Link>
    </div>
  );
}

/**
 * Locale switcher that preserves search params (e.g. ?course=slug on success page).
 * Must be wrapped in Suspense because it uses useSearchParams().
 */
export function LocaleSwitcher({ pathname, variant, closeMenu }: Props) {
  const locale = useLocale();
  const searchParams = useSearchParams();
  const href =
    searchParams.toString() ? `${pathname}?${searchParams.toString()}` : pathname;

  const linkClass =
    variant === "desktop"
      ? (active: boolean) =>
          active ? "font-semibold text-primary" : "hover:text-primary"
      : (active: boolean) =>
          active
            ? "bg-primary text-white"
            : "bg-slate-100 text-slate-700 hover:bg-slate-200";

  if (variant === "desktop") {
    return (
      <span className="flex items-center gap-1 text-sm text-slate-400">
        <Link href={href} locale="my" className={linkClass(locale === "my")}>
          မြန်မာ
        </Link>
        <span aria-hidden>|</span>
        <Link href={href} locale="en" className={linkClass(locale === "en")}>
          EN
        </Link>
      </span>
    );
  }

  return (
    <div className="flex gap-2">
      <Link
        href={href}
        locale="my"
        onClick={closeMenu}
        className={`flex-1 rounded-lg px-3 py-2.5 text-center text-sm font-medium transition-colors ${linkClass(
          locale === "my"
        )}`}
      >
        မြန်မာ
      </Link>
      <Link
        href={href}
        locale="en"
        onClick={closeMenu}
        className={`flex-1 rounded-lg px-3 py-2.5 text-center text-sm font-medium transition-colors ${linkClass(
          locale === "en"
        )}`}
      >
        EN
      </Link>
    </div>
  );
}
