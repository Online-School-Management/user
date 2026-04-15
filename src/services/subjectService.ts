import { API_ENDPOINTS } from "@/constants";
import type { Subject } from "@/types/subject";

const fetchOptions = { next: { revalidate: 60 } } as const;

export async function getSubjects(): Promise<Subject[]> {
  try {
    const res = await fetch(API_ENDPOINTS.frontend.subjects, fetchOptions);
    if (!res.ok) return [];
    const json = await res.json();
    const list: Subject[] = Array.isArray(json?.data) ? json.data : [];
    return list.sort((a, b) => {
      const ao = a.order_no ?? Number.MAX_SAFE_INTEGER;
      const bo = b.order_no ?? Number.MAX_SAFE_INTEGER;
      if (ao !== bo) return ao - bo;
      return (a.name || "").localeCompare(b.name || "");
    });
  } catch {
    return [];
  }
}

export async function getSubjectBySlug(slug: string): Promise<Subject | null> {
  const subjects = await getSubjects();
  return subjects.find((subject) => subject.slug === slug) ?? null;
}
