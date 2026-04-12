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
 * Fetch courses by status: upcoming, in_progress, or completed.
 */
export async function getCoursesByStatus(
  status: "upcoming" | "in_progress" | "completed"
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

export type CourseFilterParams = {
  status: "upcoming" | "in_progress" | "completed";
  /** When set, server filters by subject; omit for all subjects. */
  subjectId?: number;
};

/**
 * Client-only fetch: always bypasses cache so tab / filter clicks see fresh API data.
 */
export async function fetchCoursesForFilter(params: CourseFilterParams): Promise<Course[]> {
  try {
    const search = new URLSearchParams({ status: params.status });
    if (params.subjectId != null && params.subjectId > 0) {
      search.set("subject_id", String(params.subjectId));
    }
    const url = `${API_ENDPOINTS.frontend.courses}?${search.toString()}`;
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return [];
    const json = await res.json();
    return Array.isArray(json?.data) ? json.data : [];
  } catch {
    return [];
  }
}

/** Merge upcoming + in-progress lists, deduped by course id (upcoming first). */
export function mergeUpcomingInProgressCourses(upcoming: Course[], inProgress: Course[]): Course[] {
  const seen = new Set<number>();
  const merged: Course[] = [];
  for (const c of upcoming) {
    if (!seen.has(c.id)) {
      seen.add(c.id);
      merged.push(c);
    }
  }
  for (const c of inProgress) {
    if (!seen.has(c.id)) {
      seen.add(c.id);
      merged.push(c);
    }
  }
  return merged;
}

/**
 * Upcoming + in-progress (deduped by id), optional subject filter. Used for "All classes" tab.
 */
export async function fetchUpcomingAndInProgressForFilter(params: {
  subjectId?: number;
}): Promise<Course[]> {
  const subjectId = params.subjectId;
  const [upcoming, inProgress] = await Promise.all([
    fetchCoursesForFilter({ status: "upcoming", subjectId }),
    fetchCoursesForFilter({ status: "in_progress", subjectId }),
  ]);
  return mergeUpcomingInProgressCourses(upcoming, inProgress);
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
