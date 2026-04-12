import { API_ENDPOINTS } from "@/constants";
import type { Subject } from "@/types/subject";

const fetchOptions = { next: { revalidate: 60 } } as const;

export async function getSubjects(): Promise<Subject[]> {
  try {
    const res = await fetch(API_ENDPOINTS.frontend.subjects, fetchOptions);
    if (!res.ok) return [];
    const json = await res.json();
    return Array.isArray(json?.data) ? json.data : [];
  } catch {
    return [];
  }
}
