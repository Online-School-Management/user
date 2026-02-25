/**
 * API endpoints and app config (env-based).
 */
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

/** Base URL for the user site (SEO, Open Graph, canonical). */
export const APP_BASE_URL =
  process.env.NEXT_PUBLIC_APP_URL ?? "https://tiptopeducation.net";

export const SITE_NAME = "Tip-Top Education";
export const DEFAULT_OG_IMAGE_PATH = "/og-default.png";

export const API_ENDPOINTS = {
  frontend: {
    courses: `${API_BASE_URL}/api/v1/frontend/courses`,
    courseBySlug: (slug: string) =>
      `${API_BASE_URL}/api/v1/frontend/courses/${slug}`,
    authGoogleRedirect: `${API_BASE_URL}/api/v1/frontend/auth/google/redirect`,
    authMe: `${API_BASE_URL}/api/v1/frontend/auth/me`,
    authLogout: `${API_BASE_URL}/api/v1/frontend/auth/logout`,
    enrollmentRequests: `${API_BASE_URL}/api/v1/frontend/enrollment-requests`,
    enrollmentRequestCheck: (courseSlug: string) =>
      `${API_BASE_URL}/api/v1/frontend/enrollment-requests/check?course_slug=${encodeURIComponent(courseSlug)}`,
  },
} as const;
