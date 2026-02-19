/**
 * Course type from frontend API (GET /api/v1/frontend/courses).
 */
export type Course = {
  id: number;
  slug: string;
  title: string;
  subject: { id: number; name: string; slug: string } | null;
  duration: number | null;
  duration_unit: string;
  monthly_fee: number | null;
  total_fee: number | null;
  course_type: string | null;
  total_hours: number | null;
  status: string;
  start_date: string | null;
  end_date: string | null;
};
