import type { Course } from "@/types/course";
import { API_ENDPOINTS } from "@/constants";

/**
 * Fetch public course list (for server or client).
 */
export async function getAllCourses(): Promise<Course[]> {
  try {
    const res = await fetch(API_ENDPOINTS.frontend.courses, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    const json = await res.json();
    return Array.isArray(json?.data) ? json.data : [];
  } catch {
    return [];
  }
}

/**
 * Fetch single course by slug (for server or client).
 */
export async function getCourseBySlug(slug: string): Promise<Course | null> {
  try {
    const res = await fetch(API_ENDPOINTS.frontend.courseBySlug(slug), {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json?.data ?? null;
  } catch {
    return null;
  }
}
