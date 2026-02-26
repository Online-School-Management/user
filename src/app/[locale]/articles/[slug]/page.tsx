import { getArticleBySlug } from "@/services/articleService";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { CopyLinkButton } from "@/components/articles/CopyLinkButton";
import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";
import { APP_BASE_URL, SITE_NAME } from "@/constants";

type Props = { params: Promise<{ locale: string; slug: string }> };

/** Strip HTML and normalize whitespace for use in meta description / OG. */
function stripHtml(html: string, maxLength?: number): string {
  const text = html
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return maxLength != null && text.length > maxLength
    ? `${text.slice(0, maxLength).trim()}…`
    : text;
}

/** Full description for social share: excerpt or full stripped body (no truncation). */
function buildArticleDescription(article: {
  excerpt?: string | null;
  body?: string | null;
  title: string;
}): string {
  const fromExcerpt = article.excerpt?.trim();
  if (fromExcerpt) return fromExcerpt;
  if (article.body) return stripHtml(article.body);
  return `${article.title} - ${SITE_NAME}`;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const article = await getArticleBySlug(slug);
  const t = await getTranslations({ locale, namespace: "Metadata" });
  if (!article) return { title: t("articlesTitle") };
  const title = `${article.title} | ${SITE_NAME}`;
  const description = buildArticleDescription(article);

  const ogImage = article.image_url
    ? (article.image_url.startsWith("http")
        ? article.image_url
        : `${APP_BASE_URL}${article.image_url}`)
    : `${APP_BASE_URL}/og?title=${encodeURIComponent(article.title)}&subtitle=${encodeURIComponent(
        stripHtml(article.excerpt || article.body || "", 120)
      )}`;

  const publishedTime =
    article.published_at != null
      ? new Date(article.published_at).toISOString()
      : undefined;

  return buildPageMetadata(title, description, locale, `articles/${slug}`, {
    image: ogImage,
    imageAlt: article.title,
    article: {
      publishedTime,
      section: article.category ?? undefined,
    },
  });
}

export default async function ArticleDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("ArticleDetail");
  const article = await getArticleBySlug(slug);
  if (!article) notFound();

  const formatDate = (date: string | null) => {
    if (!date) return "";
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(new Date(date));
  };

  const shareUrl = `${APP_BASE_URL}/${locale}/articles/${slug}`;
  const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
  const telegramShareUrl = `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(article.title)}`;

  const shareButtonClass =
    "inline-flex items-center gap-1.5 sm:gap-2 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 sm:px-3 sm:py-2 text-xs sm:text-sm font-medium text-slate-600 shadow-sm transition-colors hover:border-primary hover:bg-slate-50 hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2";

  return (
    <div className="min-h-full min-w-0 px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <div className="mx-auto min-w-0 max-w-4xl">
        <div className="mb-6">
          <Link
            href="/articles"
            className="inline-flex items-center text-sm font-medium text-slate-600 transition-colors hover:text-primary"
          >
            {t("backToArticles")}
          </Link>
        </div>

        <article className="space-y-6">
          <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl md:text-3xl">
            {article.title}
          </h1>
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-4">
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              {article.category && (
                <span className="text-sm font-medium text-primary">{article.category}</span>
              )}
              {article.category && article.published_at && (
                <span className="text-slate-300" aria-hidden>·</span>
              )}
              {article.published_at && (
                <p className="text-sm text-slate-500">
                  {t("publishedOn")} {formatDate(article.published_at)}
                </p>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-2 sm:ml-auto">
              <a
                href={facebookShareUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={shareButtonClass}
                aria-label={t("shareOnFacebook")}
              >
                <svg className="h-4 w-4 shrink-0 fill-[#1877F2]" viewBox="0 0 24 24" aria-hidden>
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                <span>{t("shareOnFacebook")}</span>
              </a>
              <a
                href={telegramShareUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={shareButtonClass}
                aria-label={t("shareOnTelegram")}
              >
                <svg className="h-4 w-4 shrink-0 fill-[#0088cc]" viewBox="0 0 24 24" aria-hidden>
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                </svg>
                <span>{t("shareOnTelegram")}</span>
              </a>
              <CopyLinkButton />
            </div>
          </div>

          {article.image_url && (
            <div className="w-full max-w-full lg:max-w-[80%]">
              <div className="relative aspect-[2/1] w-full overflow-hidden rounded-2xl bg-slate-100">
                <img
                  src={article.image_url}
                  alt={article.title}
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          )}

          {article.body && (
            <div className="mt-8 border-t border-slate-200 pt-8">
              <div
                className="article-body min-w-0 break-words text-slate-600 [&_h1]:text-xl [&_h1]:font-bold [&_h1]:mb-2 [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:mb-2 [&_h3]:text-base [&_h3]:font-semibold [&_h3]:mb-2 [&_p]:mb-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-2 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:mb-2 [&_li]:mb-1 [&_a]:text-primary [&_a]:underline [&_a]:break-all [&_img]:max-w-full [&_img]:rounded-lg [&_pre]:overflow-x-auto [&_pre]:max-w-full"
                dangerouslySetInnerHTML={{ __html: article.body }}
              />
            </div>
          )}
        </article>
      </div>
    </div>
  );
}
