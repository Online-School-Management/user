import { API_ENDPOINTS } from "@/constants";

export type EnrollmentRequestPayload = {
  course_id: number;
  name_en: string;
  age: number;
  education: string;
  school_type: "international" | "government" | "private" | "other";
  school_other?: string;
  facebook_account: string;
  phone: string;
  town_address: string;
};

type EnrollmentSubmitResult = {
  ok: boolean;
  message?: string;
  errors?: Record<string, string[]>;
};

export type EnrollmentCheckResult = {
  ok: boolean;
  has_pending: boolean;
  course_name: string;
  course_slug: string;
};

export async function submitEnrollmentRequest(
  token: string,
  payload: EnrollmentRequestPayload
): Promise<EnrollmentSubmitResult> {
  try {
    const res = await fetch(API_ENDPOINTS.frontend.enrollmentRequests, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      return {
        ok: false,
        message: json?.message,
        errors: json?.errors,
      };
    }

    return {
      ok: true,
      message: json?.message,
    };
  } catch {
    return {
      ok: false,
      message: "Network error",
    };
  }
}

export async function checkEnrollmentRequest(
  token: string,
  courseSlug: string
): Promise<EnrollmentCheckResult> {
  try {
    const res = await fetch(
      API_ENDPOINTS.frontend.enrollmentRequestCheck(courseSlug),
      {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      return { ok: false, has_pending: false, course_name: "", course_slug: "" };
    }

    return {
      ok: true,
      has_pending: json.data?.has_pending ?? false,
      course_name: json.data?.course_name ?? "",
      course_slug: json.data?.course_slug ?? "",
    };
  } catch {
    return { ok: false, has_pending: false, course_name: "", course_slug: "" };
  }
}
