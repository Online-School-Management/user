import type { Metadata } from "next";
import { APP_BASE_URL, SITE_NAME } from "@/constants";

/** Default static OG image (`public/tab1.png`) when `options.image` is missing and callers do not use `/og`. */
export const DEFAULT_OG_IMAGE_PATH = "/tab1.png";

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
 * @param title - Page title (e.g. "Courses | Tip - Top Education")
 * @param description - Meta description (optional)
 * @param locale - Current locale (e.g. "en", "my")
 * @param path - Path after locale, no leading slash (e.g. "", "courses", "courses/web-design", "enroll/success")
 * @param options - Optional image override and alt text
 */
/** Upgrade http→https for public OG images (crawlers expect https; skip localhost). */
function normalizeHttpToHttpsIfNeeded(url: string): string {
  try {
    const u = new URL(url);
    if (u.protocol !== "http:") return url;
    if (/^(localhost|127\.0\.0\.1)$/i.test(u.hostname)) return url;
    u.protocol = "https:";
    return u.toString();
  } catch {
    return url;
  }
}

/** Ensure image URL is absolute for crawlers (Facebook, Telegram, etc.). Prefer https:// for absolute URLs. */
export function toAbsoluteImageUrl(url: string): string {
  const trimmed = url.trim();
  if (!trimmed) return trimmed;
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return normalizeHttpToHttpsIfNeeded(trimmed);
  }
  const path = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
  return `${APP_BASE_URL}${path}`;
}

/** Our dynamic OG route (`/og`, `/og?...`) always renders 1200×630. External uploads should not use those dimensions. */
function isNextOgImageRoute(absoluteUrl: string): boolean {
  try {
    return new URL(absoluteUrl).pathname === "/og";
  } catch {
    return false;
  }
}

export function buildPageMetadata(
  title: string,
  description: string | undefined,
  locale: string,
  path: string,
  options?: PageMetadataOptions
): Metadata {
  const url = path ? `${APP_BASE_URL}/${locale}/${path}` : `${APP_BASE_URL}/${locale}`;
  const imageRaw = options?.image?.trim();
  /** No custom image → static default (`/tab1.png`), always passed through `toAbsoluteImageUrl`. */
  const imageUrl = toAbsoluteImageUrl(
    imageRaw && imageRaw.length > 0 ? imageRaw : DEFAULT_OG_IMAGE_PATH
  );
  const imageAlt = options?.imageAlt ?? SITE_NAME;
  const desc = description?.trim() || `${SITE_NAME} - Computer & Coding School for Kids`;
  const ogLocale = locale === "my" ? "my_MM" : "en_US";
  const alternateLocaleUrls: Record<string, string> = {};
  for (const loc of ["en", "my"]) {
    alternateLocaleUrls[loc] = path
      ? `${APP_BASE_URL}/${loc}/${path}`
      : `${APP_BASE_URL}/${loc}`;
  }

  const ogImages = isNextOgImageRoute(imageUrl)
    ? [{ url: imageUrl, width: 1200, height: 630, alt: imageAlt }]
    : [{ url: imageUrl, alt: imageAlt }];

  const isArticle = options?.article != null;
  const openGraphBase = {
    title,
    description: desc,
    type: isArticle ? ("article" as const) : "website",
    url,
    locale: ogLocale,
    siteName: SITE_NAME,
    images: ogImages,
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
