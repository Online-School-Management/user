import { getArticles } from "@/services/articleService";
import { ArticleGrid } from "@/components/articles/ArticleGrid";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata" });
  return buildPageMetadata(t("articlesTitle"), t("articlesDescription"), locale, "articles");
}

export default async function ArticlesPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Articles");
  const articles = await getArticles();

  return (
    <section className="min-w-0 px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <div className="mx-auto min-w-0 max-w-6xl">
        <h1 className="text-lg font-semibold text-slate-900 sm:text-xl">
          {t("title")}
        </h1>
        <p className="mt-4 text-sm text-slate-600 sm:text-base">{t("description")}</p>
        <div className="mt-8 grid gap-4 sm:mt-12 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <ArticleGrid articles={articles} />
        </div>
      </div>
    </section>
  );
}
