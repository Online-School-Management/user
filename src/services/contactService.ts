import { API_ENDPOINTS } from "@/constants";

export type ContactPayload = {
  name: string;
  phone: string;
  message: string;
};

type ApiErrorBody = {
  success?: boolean;
  message?: string;
  errors?: Record<string, string[]>;
};

export type SubmitContactResult =
  | { ok: true }
  | { ok: false; fieldErrors?: Record<string, string>; message?: string };

/**
 * POST public contact form to Laravel API.
 */
export async function submitContactMessage(payload: ContactPayload): Promise<SubmitContactResult> {
  try {
    const res = await fetch(API_ENDPOINTS.frontend.contact, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    const json = (await res.json().catch(() => ({}))) as ApiErrorBody;
    if (!res.ok) {
      if (res.status === 422 && json.errors) {
        const fieldErrors: Record<string, string> = {};
        for (const [key, msgs] of Object.entries(json.errors)) {
          if (Array.isArray(msgs) && msgs[0]) fieldErrors[key] = msgs[0];
        }
        return { ok: false, fieldErrors, message: json.message };
      }
      return { ok: false, message: json.message ?? "Request failed." };
    }
    return { ok: true };
  } catch {
    return { ok: false, message: "Network error." };
  }
}
