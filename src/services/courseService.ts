import type { Course } from "@/types/course";
import { API_ENDPOINTS } from "@/constants";

const fetchOptions = { next: { revalidate: 60 } } as const;

/**
 * Fetch public course list (for server or client).
 */
export async function getAllCourses(): Promise<Course[]> {
  try {
    const res = await fetch(API_ENDPOINTS.frontend.courses, fetchOptions);
    if (!res.ok) return [];
    const json = await res.json();
    return Array.isArray(json?.data) ? json.data : [];
  } catch {
    return [];
  }
}

/**
 * Fetch courses by status: upcoming or in_progress.
 */
export async function getCoursesByStatus(
  status: "upcoming" | "in_progress"
): Promise<Course[]> {
  try {
    const url = `${API_ENDPOINTS.frontend.courses}?status=${status}`;
    const res = await fetch(url, fetchOptions);
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
