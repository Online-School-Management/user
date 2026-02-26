import type { Metadata } from "next";
import { APP_BASE_URL, SITE_NAME, DEFAULT_OG_IMAGE_PATH } from "@/constants";

export type ArticleMetadataOptions = {
  /** ISO 8601 date string (e.g. from article.published_at). */
  publishedTime?: string;
  /** ISO 8601 date string (e.g. from article.updated_at). */
  modifiedTime?: string;
  /** Article category/section for og:section. */
  section?: string;
  /** Author names for og:article:author. */
  authors?: string[];
  /** Tags for og:article:tag. */
  tags?: string[];
};

export type PageMetadataOptions = {
  /** Absolute or path image URL for og:image / twitter:image. If not set, default is used. */
  image?: string;
  /** Alt text for the OG image. */
  imageAlt?: string;
  /** Set to false to prevent search engines from indexing (e.g. for login, enroll success). */
  noIndex?: boolean;
  /** When set, uses openGraph.type 'article' and adds article-specific meta (publishedTime, section, etc.). */
  article?: ArticleMetadataOptions;
};

/**
 * Builds Next.js Metadata with Open Graph and Twitter Card for a page.
 * Use in generateMetadata() to keep SEO consistent and avoid duplication.
 *
 * @param title - Page title (e.g. "Courses | Tip-Top Education")
 * @param description - Meta description (optional)
 * @param locale - Current locale (e.g. "en", "my")
 * @param path - Path after locale, no leading slash (e.g. "", "courses", "courses/web-design", "enroll/success")
 * @param options - Optional image override and alt text
 */
/** Ensure image URL is absolute for crawlers (Facebook, Telegram, etc.). */
function toAbsoluteImageUrl(url: string): string {
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  const path = url.startsWith("/") ? url : `/${url}`;
  return `${APP_BASE_URL}${path}`;
}

export function buildPageMetadata(
  title: string,
  description: string | undefined,
  locale: string,
  path: string,
  options?: PageMetadataOptions
): Metadata {
  const url = path ? `${APP_BASE_URL}/${locale}/${path}` : `${APP_BASE_URL}/${locale}`;
  const imageUrl = toAbsoluteImageUrl(
    options?.image ?? DEFAULT_OG_IMAGE_PATH
  );
  const imageAlt = options?.imageAlt ?? SITE_NAME;
  const desc = description?.trim() || `${SITE_NAME} - Computer Training School`;
  const ogLocale = locale === "my" ? "my_MM" : "en_US";
  const alternateLocaleUrls: Record<string, string> = {};
  for (const loc of ["en", "my"]) {
    alternateLocaleUrls[loc] = path
      ? `${APP_BASE_URL}/${loc}/${path}`
      : `${APP_BASE_URL}/${loc}`;
  }

  const isArticle = options?.article != null;
  const openGraphBase = {
    title,
    description: desc,
    type: isArticle ? ("article" as const) : "website",
    url,
    locale: ogLocale,
    siteName: SITE_NAME,
    images: [{ url: imageUrl, width: 1200, height: 630, alt: imageAlt }],
  };
  const openGraph = isArticle && options.article
    ? {
        ...openGraphBase,
        type: "article" as const,
        publishedTime: options.article.publishedTime,
        modifiedTime: options.article.modifiedTime,
        section: options.article.section,
        authors: options.article.authors?.length
          ? options.article.authors
          : undefined,
        tags: options.article.tags?.length ? options.article.tags : undefined,
      }
    : openGraphBase;

  return {
    title,
    description: desc,
    alternates: {
      canonical: url,
      languages: alternateLocaleUrls,
    },
    robots: options?.noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
    openGraph,
    twitter: {
      card: "summary_large_image",
      title,
      description: desc,
      images: [imageUrl],
    },
  };
}
