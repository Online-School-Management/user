import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata" });
  return {
    title: t("articlesTitle"),
    description: t("articlesDescription"),
  };
}

export default async function ArticlesPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Articles");

  return (
    <div className="min-h-full">
      <section className="border-b border-slate-200/80 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            {t("title")}
          </h1>
          <p className="mt-4 text-lg text-slate-600">{t("description")}</p>
          <div className="mt-12 rounded-2xl border border-slate-200 bg-slate-50/50 p-8 text-center text-slate-500">
            {t("empty")}
          </div>
        </div>
      </section>
    </div>
  );
}
