import type { Metadata } from "next";
import { APP_BASE_URL, SITE_NAME, DEFAULT_OG_IMAGE_PATH } from "@/constants";

export type PageMetadataOptions = {
  /** Absolute or path image URL for og:image / twitter:image. If not set, default is used. */
  image?: string;
  /** Alt text for the OG image. */
  imageAlt?: string;
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
export function buildPageMetadata(
  title: string,
  description: string | undefined,
  locale: string,
  path: string,
  options?: PageMetadataOptions
): Metadata {
  const url = path ? `${APP_BASE_URL}/${locale}/${path}` : `${APP_BASE_URL}/${locale}`;
  const imageUrl = options?.image ?? `${APP_BASE_URL}${DEFAULT_OG_IMAGE_PATH}`;
  const imageAlt = options?.imageAlt ?? SITE_NAME;

  return {
    title,
    description: description ?? undefined,
    openGraph: {
      title,
      description: description ?? undefined,
      type: "website",
      url,
      siteName: SITE_NAME,
      images: [{ url: imageUrl, width: 1200, height: 630, alt: imageAlt }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: description ?? undefined,
      images: [imageUrl],
    },
  };
}
