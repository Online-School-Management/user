/**
 * API endpoints and app config (env-based).
 */
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export const API_ENDPOINTS = {
  frontend: {
    courses: `${API_BASE_URL}/api/v1/frontend/courses`,
    courseBySlug: (slug: string) =>
      `${API_BASE_URL}/api/v1/frontend/courses/${slug}`,
  },
} as const;
