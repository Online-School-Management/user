"use client";

import { useTranslations } from "next-intl";
import type { Article } from "@/types/article";
import { ArticleCard } from "./ArticleCard";

type ArticleGridProps = {
  articles: Article[];
};

export function ArticleGrid({ articles }: ArticleGridProps) {
  const t = useTranslations("ArticleGrid");

  if (articles.length === 0) {
    return (
      <p className="col-span-full text-center text-slate-500 sm:col-span-2 lg:col-span-3">
        {t("empty")}
      </p>
    );
  }

  return (
    <>
      {articles.map((article) => (
        <ArticleCard key={article.id} article={article} />
      ))}
    </>
  );
}
