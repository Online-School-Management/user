"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { getAuthToken } from "@/services/authService";
import { checkEnrollmentRequest } from "@/services/enrollmentService";

const CACHE_KEY_PREFIX = "enroll_success_";

function getCacheKey(slug: string) {
  return `${CACHE_KEY_PREFIX}${slug}`;
}

type Status = "loading" | "success" | "not_found" | "unauthenticated";

export function EnrollSuccessContent() {
  const t = useTranslations("Enroll");
  const searchParams = useSearchParams();
  const courseSlug = searchParams.get("course") ?? "";

  const [status, setStatus] = useState<Status>("loading");
  const [courseName, setCourseName] = useState("");

  useEffect(() => {
    if (!courseSlug) {
      setStatus("not_found");
      return;
    }

    const token = getAuthToken();
    if (!token) {
      setStatus("unauthenticated");
      return;
    }

    // Use cached success data when switching locale so we don't refetch
    if (typeof window !== "undefined") {
      try {
        const cached = sessionStorage.getItem(getCacheKey(courseSlug));
        if (cached) {
          const { courseName: name } = JSON.parse(cached) as {
            courseName: string;
            courseSlug: string;
          };
          if (name) {
            setCourseName(name);
            setStatus("success");
            return;
          }
        }
      } catch {
        // ignore invalid cache
      }
    }

    let active = true;
    checkEnrollmentRequest(token, courseSlug).then((result) => {
      if (!active) return;
      if (result.ok && result.has_pending) {
        setCourseName(result.course_name);
        setStatus("success");
        if (typeof window !== "undefined") {
          sessionStorage.setItem(
            getCacheKey(courseSlug),
            JSON.stringify({
              courseName: result.course_name,
              courseSlug: result.course_slug,
            })
          );
        }
      } else {
        setStatus("not_found");
      }
    });

    return () => {
      active = false;
    };
  }, [courseSlug]);

  if (status === "loading") {
    return (
      <div className="min-h-full px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl">
          <div className="animate-pulse rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex flex-col items-center gap-4">
              <div className="h-14 w-14 rounded-full bg-slate-200" />
              <div className="h-5 w-48 rounded bg-slate-200" />
              <div className="h-4 w-64 rounded bg-slate-200" />
            </div>
            <div className="mt-8 flex justify-center gap-3">
              <div className="h-10 w-36 rounded-lg bg-slate-200" />
              <div className="h-10 w-28 rounded-lg bg-slate-200" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (status === "not_found" || status === "unauthenticated") {
    return (
      <div className="min-h-full px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-slate-600">
            {status === "unauthenticated"
              ? t("needGoogleLogin")
              : t("submitFailed")}
          </p>
          <div className="mt-6">
            <Link
              href="/courses"
              className="inline-flex items-center justify-center rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
            >
              {t("successBackCourses")}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-6 text-2xl font-bold text-primary">{courseName}</h1>

        <div className="rounded-2xl border border-emerald-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-col items-center text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
              <svg viewBox="0 0 24 24" className="h-7 w-7" aria-hidden="true">
                <path
                  fill="currentColor"
                  d="M9.55 18.2 4.8 13.45l1.4-1.4 3.35 3.35 8.25-8.25 1.4 1.4L9.55 18.2Z"
                />
              </svg>
            </div>
            <p className="text-slate-600">{t("pendingNoticeMm")}</p>
            <p className="mt-1 text-sm font-medium text-primary">
              {t("successForCourse", { courseName })}
            </p>
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/courses"
              className="inline-flex items-center justify-center rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
              onClick={() =>
                typeof window !== "undefined" &&
                sessionStorage.removeItem(getCacheKey(courseSlug))
              }
            >
              {t("successBackCourses")}
            </Link>
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:border-primary/30 hover:text-primary"
              onClick={() =>
                typeof window !== "undefined" &&
                sessionStorage.removeItem(getCacheKey(courseSlug))
              }
            >
              {t("successGoHome")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
