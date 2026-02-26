import type { Article } from "@/types/article";
import { API_ENDPOINTS } from "@/constants";

const fetchOptions = { next: { revalidate: 60 } } as const;

/**
 * Fetch published articles for the user site.
 */
export async function getArticles(params?: {
  category?: string;
  per_page?: number;
}): Promise<Article[]> {
  try {
    const search = params
      ? new URLSearchParams(
          Object.entries(params).filter(([, v]) => v != null) as [string, string][]
        ).toString()
      : "";
    const url = search ? `${API_ENDPOINTS.frontend.articles}?${search}` : API_ENDPOINTS.frontend.articles;
    const res = await fetch(url, fetchOptions);
    if (!res.ok) return [];
    const json = await res.json();
    return Array.isArray(json?.data) ? json.data : [];
  } catch {
    return [];
  }
}

/**
 * Fetch a single published article by slug.
 */
export async function getArticleBySlug(slug: string): Promise<Article | null> {
  try {
    const res = await fetch(API_ENDPOINTS.frontend.articleBySlug(slug), {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json?.data ?? null;
  } catch {
    return null;
  }
}
