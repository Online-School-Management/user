"use client";

import { useLocale } from "next-intl";
import { useEffect } from "react";

export function SetHtmlLang() {
  const locale = useLocale();

  useEffect(() => {
    document.documentElement.lang = locale === "my" ? "my" : "en";
  }, [locale]);

  return null;
}
