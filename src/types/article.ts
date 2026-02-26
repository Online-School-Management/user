/**
 * Article type from frontend API (published articles only).
 */
export interface Article {
  id: number;
  slug: string;
  title: string;
  category?: string | null;
  excerpt?: string | null;
  body?: string | null;
  image_url?: string | null;
  status?: string;
  published_at?: string | null;
}
