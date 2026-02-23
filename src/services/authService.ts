import { API_ENDPOINTS } from "@/constants";

export type AuthUser = {
  id: number;
  name: string;
  email: string;
  user_type: string;
  phone: string | null;
  address: string | null;
  status: string;
  student: {
    id: number;
    slug: string;
    student_id: string;
    age: number | null;
    education: string | null;
    school_type: string | null;
    school_other: string | null;
    class: string | null;
    facebook_link: string | null;
  } | null;
};

const AUTH_TOKEN_KEY = "tiptop_user_token";

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

export function getAuthToken(): string | null {
  if (!isBrowser()) return null;
  return localStorage.getItem(AUTH_TOKEN_KEY);
}

export function setAuthToken(token: string): void {
  if (!isBrowser()) return;
  localStorage.setItem(AUTH_TOKEN_KEY, token);
}

export function clearAuthToken(): void {
  if (!isBrowser()) return;
  localStorage.removeItem(AUTH_TOKEN_KEY);
}

export function buildGoogleLoginUrl(redirectTo: string): string {
  const redirectParam = encodeURIComponent(redirectTo);
  return `${API_ENDPOINTS.frontend.authGoogleRedirect}?redirect_to=${redirectParam}`;
}

export async function fetchMe(token: string): Promise<AuthUser | null> {
  try {
    const res = await fetch(API_ENDPOINTS.frontend.authMe, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    if (!res.ok) return null;

    const json = await res.json();
    return (json?.data ?? null) as AuthUser | null;
  } catch {
    return null;
  }
}

export async function logout(token: string): Promise<void> {
  try {
    await fetch(API_ENDPOINTS.frontend.authLogout, {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
  } catch {
    // Ignore logout API failure; local token is still cleared by caller.
  }
}
