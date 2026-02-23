import { API_ENDPOINTS } from "@/constants";

export type EnrollmentRequestPayload = {
  course_id: number;
  name_en: string;
  age: number;
  education: string;
  class_interest: string;
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
