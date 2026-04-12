"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export function Footer() {
  const t = useTranslations("Footer");
  const tCommon = useTranslations("Common");
  const year = new Date().getFullYear();

  return (
    <footer className="min-w-0 overflow-x-hidden border-t border-slate-200 bg-slate-50 px-4 pb-4 pt-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <p className="mb-6 text-center text-base font-medium italic leading-snug text-slate-800 sm:text-lg md:mb-8">
          {tCommon("siteTagline")}
        </p>
      </div>
      <div className="mx-auto flex min-w-0 max-w-6xl flex-col gap-2 text-sm text-slate-500 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1 text-center md:text-left">
          <p>
            <a href="tel:09988658887" className="text-primary hover:underline">
              09988658887
            </a>
            {" · "}
            <a
              href="mailto:info.tiptopeducation@gmail.com"
              className="text-primary hover:underline"
            >
              info.tiptopeducation@gmail.com
            </a>
          </p>
          <p>{t("copyright", { year })}</p>
        </div>

        <div className="flex items-center justify-center gap-4 md:justify-end">
          <Link href="/privacy" className="text-slate-600 transition-colors hover:text-primary">
            {t("privacy")}
          </Link>
          <span aria-hidden className="text-slate-300">
            |
          </span>
          <Link href="/terms" className="text-slate-600 transition-colors hover:text-primary">
            {t("terms")}
          </Link>
        </div>
      </div>
    </footer>
  );
}
