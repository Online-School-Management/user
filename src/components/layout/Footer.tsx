"use client";

import { useTranslations } from "next-intl";

export function Footer() {
  const t = useTranslations("Footer");
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-200 bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-2 text-center text-sm text-slate-500">
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
    </footer>
  );
}
