export type Subject = {
  id: number;
  name: string;
  slug: string;
  image_url?: string | null;
  description?: string | null;
  short_description?: string | null;
  tag_en?: string | null;
  tag_mm?: string | null;
  order_no?: number | null;
};
