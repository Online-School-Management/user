"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { Article } from "@/types/article";

type ArticleCardProps = {
  article: Article;
};

export function ArticleCard({ article }: ArticleCardProps) {
  const t = useTranslations("ArticleCard");

  return (
    <Link
      href={`/articles/${article.slug}`}
      className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="relative aspect-[2/1] w-full bg-slate-100">
        {article.image_url ? (
          <img
            src={article.image_url}
            alt={article.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-slate-200">
            <span className="text-4xl font-bold text-slate-400">A</span>
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-4 sm:p-6">
        {article.category && (
          <span className="text-sm font-medium text-primary">
            {article.category}
          </span>
        )}
        <h3 className="mt-2 line-clamp-2 text-base font-semibold text-slate-900 sm:text-lg">
          {article.title}
        </h3>
        {article.excerpt && (
          <p className="mt-2 line-clamp-3 text-sm text-slate-600">
            {article.excerpt}
          </p>
        )}
        <span className="mt-4 text-sm font-medium text-primary">
          {t("readMore")}
        </span>
      </div>
    </Link>
  );
}
