"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export function Footer() {
  const t = useTranslations("Footer");
  const tCommon = useTranslations("Common");
  const year = new Date().getFullYear();

  return (
    <footer className="min-w-0 overflow-x-hidden border-t border-slate-200 bg-slate-50 px-4 py-5 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="flex w-full min-w-0 flex-col gap-3 text-xs text-slate-600 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:text-sm">
          <div className="flex min-w-0 flex-wrap items-center gap-x-2 sm:flex-nowrap sm:gap-x-3">
            <p className="shrink-0 whitespace-nowrap">{t("copyright", { year })}</p>

            <span aria-hidden className="shrink-0 text-slate-300">
              ·
            </span>

            <div className="flex shrink-0 items-center gap-2 whitespace-nowrap sm:gap-3">
              <Link
                href="/privacy"
                className="text-primary transition-colors hover:text-primary/80 hover:underline"
              >
                {t("privacy")}
              </Link>
              <span aria-hidden className="text-slate-300">
                |
              </span>
              <Link
                href="/terms"
                className="text-primary transition-colors hover:text-primary/80 hover:underline"
              >
                {t("terms")}
              </Link>
            </div>
          </div>

          <p className="self-end text-right font-medium italic leading-snug text-slate-600 text-balance sm:max-w-[min(100%,28rem)] sm:self-auto">
            {tCommon("siteTagline")}
          </p>
        </div>
      </div>
    </footer>
  );
}
