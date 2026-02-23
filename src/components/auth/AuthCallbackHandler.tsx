"use client";

import { useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { clearAuthToken, setAuthToken } from "@/services/authService";

export function AuthCallbackHandler() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const auth = searchParams.get("auth");
    if (!auth) return;

    if (auth === "success") {
      const token = searchParams.get("token");
      if (token) {
        setAuthToken(token);
      }
      window.dispatchEvent(new Event("auth-changed"));
      sessionStorage.setItem("auth_status", "success");
      sessionStorage.removeItem("auth_error");
      router.replace(pathname);
      return;
    }

    if (auth === "error") {
      clearAuthToken();
      window.dispatchEvent(new Event("auth-changed"));
      const message = searchParams.get("message") ?? "Authentication failed";
      sessionStorage.setItem("auth_status", "error");
      sessionStorage.setItem("auth_error", message);
      router.replace(pathname);
    }
  }, [pathname, router, searchParams]);

  return null;
}
