/**
 * Course fetching (for client components). Uses service; can add SWR/React Query later.
 */
import { getAllCourses } from "@/services/courseService";
import { useCallback, useState } from "react";
import type { Course } from "@/types/course";

export function useCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchCourses = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllCourses();
      setCourses(data);
      return data;
    } catch (e) {
      setError(e instanceof Error ? e : new Error("Failed to fetch courses"));
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  return { courses, loading, error, fetchCourses };
}
