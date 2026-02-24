"use client";

import { FormEvent, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { usePathname, useSearchParams } from "next/navigation";
import {
  buildGoogleLoginUrl,
  clearAuthToken,
  fetchMe,
  getAuthToken,
  logout,
} from "@/services/authService";
import {
  submitEnrollmentRequest,
  type EnrollmentRequestPayload,
} from "@/services/enrollmentService";

type Props = {
  courseId: number;
  courseTitle: string;
  subjectName: string;
};

const CLASS_OPTIONS = [
  "Computer Science",
  "Scratch",
  "3D Modeling",
  "Mobile App Creation",
  "Python",
  "Web Design",
] as const;

export function EnrollmentForm({ courseId, courseTitle, subjectName }: Props) {
  const t = useTranslations("Enroll");
  const tLogin = useTranslations("Login");
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isAuthSuccessCallback = searchParams.get("auth") === "success";

  // Keep server/client initial render deterministic to avoid hydration mismatch.
  const [token, setToken] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState<boolean>(true);
  const [isAuthTransitionPending, setIsAuthTransitionPending] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    const params = new URLSearchParams(window.location.search);
    return (
      params.get("auth") === "success" ||
      sessionStorage.getItem("auth_status") === "success"
    );
  });
  const [authMessage, setAuthMessage] = useState<string | null>(() => {
    if (typeof window === "undefined") return null;

    const authStatus = sessionStorage.getItem("auth_status");
    const authError = sessionStorage.getItem("auth_error");
    sessionStorage.removeItem("auth_status");
    sessionStorage.removeItem("auth_error");

    if (authStatus === "success") {
      return "LOGIN_SUCCESS_MESSAGE";
    }
    if (authStatus === "error" && authError) {
      return `LOGIN_ERROR:${authError}`;
    }
    return null;
  });

  const [nameEn, setNameEn] = useState("");
  const [age, setAge] = useState("");
  const [education, setEducation] = useState("");
  const [classInterest, setClassInterest] = useState<string>("Computer Science");
  const [schoolType, setSchoolType] = useState<
    "international" | "government" | "private" | "other"
  >("international");
  const [schoolOther, setSchoolOther] = useState("");
  const [facebookAccount, setFacebookAccount] = useState("");
  const [phone, setPhone] = useState("");
  const [townAddress, setTownAddress] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [pendingMessage, setPendingMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  const resolvedAuthMessage =
    authMessage === "LOGIN_SUCCESS_MESSAGE"
      ? t("loginSuccess")
      : authMessage?.startsWith("LOGIN_ERROR:")
        ? `${t("loginFailed")}: ${authMessage.replace("LOGIN_ERROR:", "")}`
        : authMessage;

  useEffect(() => {
    if (!isAuthTransitionPending) return;

    // Prevent endless loading if callback/token resolution fails.
    const timeout = window.setTimeout(() => {
      setIsAuthTransitionPending(false);
    }, 2500);

    return () => window.clearTimeout(timeout);
  }, [isAuthTransitionPending]);

  useEffect(() => {
    let active = true;

    const syncAuthState = async () => {
      if (!active) return;
      setAuthLoading(true);

      const storedToken = getAuthToken();
      if (!storedToken) {
        if (isAuthSuccessCallback || isAuthTransitionPending) {
          // OAuth callback is still being processed; keep loading to avoid flashing login UI.
          setAuthLoading(true);
          return;
        }
        if (!active) return;
        setToken(null);
        setAuthLoading(false);
        return;
      }

      if (!active) return;
      setToken(storedToken);

      const user = await fetchMe(storedToken);
      if (!active) return;

      if (!user) {
        clearAuthToken();
        setToken(null);
        setIsAuthTransitionPending(false);
        setAuthLoading(false);
        return;
      }

      setNameEn(user.name ?? "");
      setPhone(user.phone ?? "");
      setTownAddress(user.address ?? "");
      setAge(user.student?.age != null ? String(user.student.age) : "");
      setEducation(user.student?.education ?? "");
      setFacebookAccount(user.student?.facebook_link ?? "");
      if (
        user.student?.class &&
        CLASS_OPTIONS.includes(user.student.class as (typeof CLASS_OPTIONS)[number])
      ) {
        setClassInterest(user.student.class);
      }
      if (
        user.student?.school_type &&
        ["international", "government", "private", "other"].includes(user.student.school_type)
      ) {
        setSchoolType(
          user.student.school_type as "international" | "government" | "private" | "other"
        );
      }
      if (user.student?.school_other) setSchoolOther(user.student.school_other);
      setIsAuthTransitionPending(false);
      setAuthLoading(false);
    };

    syncAuthState();
    window.addEventListener("auth-changed", syncAuthState);

    return () => {
      active = false;
      window.removeEventListener("auth-changed", syncAuthState);
    };
  }, [isAuthSuccessCallback, isAuthTransitionPending]);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!token) return;

    setSubmitting(true);
    setSuccessMessage(null);
    setErrorMessage(null);
    setPendingMessage(null);
    setFieldErrors({});

    const payload: EnrollmentRequestPayload = {
      course_id: courseId,
      name_en: nameEn.trim(),
      age: Number(age),
      education: education.trim(),
      class_interest: classInterest,
      school_type: schoolType,
      school_other: schoolType === "other" ? schoolOther.trim() : undefined,
      facebook_account: facebookAccount.trim(),
      phone: phone.trim(),
      town_address: townAddress.trim(),
    };

    const result = await submitEnrollmentRequest(token, payload);
    setSubmitting(false);

    if (result.ok) {
      setSuccessMessage(result.message ?? t("submitSuccess"));
      setErrorMessage(null);
      setPendingMessage(t("pendingNotice"));
      return;
    }

    const duplicatePendingMessage = result.errors?.course_id?.[0];
    if (duplicatePendingMessage && duplicatePendingMessage.toLowerCase().includes("pending")) {
      setPendingMessage(t("alreadyPendingNotice"));
      setErrorMessage(null);
      return;
    }

    setErrorMessage(result.message ?? t("submitFailed"));
    setFieldErrors(result.errors ?? {});
  }

  async function onLogout() {
    if (!token) return;
    await logout(token);
    clearAuthToken();
    setToken(null);
    setAuthMessage(t("loggedOut"));
    setSuccessMessage(null);
    setErrorMessage(null);
    setPendingMessage(null);
    setFieldErrors({});
  }

  if (authLoading || isAuthTransitionPending) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2 sm:col-span-2">
            <div className="h-4 w-28 rounded bg-slate-200" />
            <div className="h-10 w-full rounded-lg bg-slate-200" />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <div className="h-4 w-24 rounded bg-slate-200" />
            <div className="h-10 w-full rounded-lg bg-slate-200" />
          </div>

          <div className="space-y-2 sm:col-span-2">
            <div className="h-4 w-36 rounded bg-slate-200" />
            <div className="h-10 w-full rounded-lg bg-slate-200" />
          </div>

          <div className="space-y-2">
            <div className="h-4 w-16 rounded bg-slate-200" />
            <div className="h-10 w-full rounded-lg bg-slate-200" />
          </div>
          <div className="space-y-2">
            <div className="h-4 w-20 rounded bg-slate-200" />
            <div className="h-10 w-full rounded-lg bg-slate-200" />
          </div>

          <div className="space-y-2">
            <div className="h-4 w-14 rounded bg-slate-200" />
            <div className="h-10 w-full rounded-lg bg-slate-200" />
          </div>
          <div className="space-y-2">
            <div className="h-4 w-20 rounded bg-slate-200" />
            <div className="h-10 w-full rounded-lg bg-slate-200" />
          </div>

          <div className="space-y-2 sm:col-span-2">
            <div className="h-4 w-36 rounded bg-slate-200" />
            <div className="h-10 w-full rounded-lg bg-slate-200" />
          </div>

          <div className="space-y-2">
            <div className="h-4 w-24 rounded bg-slate-200" />
            <div className="h-10 w-full rounded-lg bg-slate-200" />
          </div>
          <div className="space-y-2">
            <div className="h-4 w-28 rounded bg-slate-200" />
            <div className="h-10 w-full rounded-lg bg-slate-200" />
          </div>
        </div>

        <div className="flex flex-wrap gap-3 pt-1">
          <div className="h-10 w-40 rounded-lg bg-slate-200" />
          <div className="h-10 w-28 rounded-lg bg-slate-200" />
        </div>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-slate-700">{t("needGoogleLogin")}</p>
        <div className="mx-auto mt-4 w-full max-w-sm">
          <a
            href={buildGoogleLoginUrl(pathname)}
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-[#DB4437] bg-[#DB4437] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#C5392D]"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
              <path
                fill="currentColor"
                d="M12 10.2v3.9h5.5c-.2 1.3-1.5 3.9-5.5 3.9-3.3 0-6-2.7-6-6s2.7-6 6-6c1.9 0 3.1.8 3.8 1.5l2.6-2.5C16.8 3.5 14.6 2.7 12 2.7 6.9 2.7 2.7 6.9 2.7 12s4.2 9.3 9.3 9.3c5.4 0 9-3.8 9-9.1 0-.6-.1-1.1-.2-1.6H12Z"
              />
            </svg>
            {t("continueWithGoogle")}
          </a>

          <div className="my-4 flex items-center gap-3">
            <span className="h-px flex-1 bg-slate-200" />
            <span className="text-xs uppercase tracking-wide text-slate-400">
              {tLogin("or")}
            </span>
            <span className="h-px flex-1 bg-slate-200" />
          </div>

          <button
            type="button"
            disabled
            className="inline-flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-lg border border-[#4267B2] bg-[#4267B2] px-5 py-2.5 text-sm font-medium text-white opacity-90"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
              <path
                fill="currentColor"
                d="M13.5 8H16V5h-2.5C10.5 5 9 6.8 9 9.6V12H7v3h2v4h3v-4h2.4l.6-3H12V9.9c0-1 .3-1.9 1.5-1.9Z"
              />
            </svg>
            {tLogin("continueWithFacebook")}
          </button>
          <p className="mt-2 text-center text-xs text-slate-400">
            {tLogin("facebookComingSoon")}
          </p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {resolvedAuthMessage && (
        <div className="rounded-lg border border-sky-200 bg-sky-50 px-4 py-3 text-sm text-sky-700">
          {resolvedAuthMessage}
        </div>
      )}
      {successMessage && (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {successMessage}
        </div>
      )}
      {pendingMessage && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
          {pendingMessage}
        </div>
      )}
      {errorMessage && (
        <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {errorMessage}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="sm:col-span-2">
          <span className="mb-1 block text-sm font-medium text-slate-700">{t("courseName")}</span>
          <input
            value={courseTitle}
            disabled
            className="w-full rounded-lg border border-slate-200 bg-slate-100 px-3 py-2 text-slate-700"
          />
        </label>

        <label className="sm:col-span-2">
          <span className="mb-1 block text-sm font-medium text-slate-700">
            {t("subjectName")}
          </span>
          <input
            value={subjectName}
            disabled
            className="w-full rounded-lg border border-slate-200 bg-slate-100 px-3 py-2 text-slate-700"
          />
        </label>

        <label className="sm:col-span-2">
          <span className="mb-1 block text-sm font-medium text-slate-700">{t("nameEn")}</span>
          <input
            value={nameEn}
            onChange={(e) => setNameEn(e.target.value)}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-900 outline-none ring-primary/30 focus:ring"
            required
          />
          {fieldErrors.name_en?.[0] && (
            <span className="mt-1 block text-xs text-rose-600">{fieldErrors.name_en[0]}</span>
          )}
        </label>

        <label>
          <span className="mb-1 block text-sm font-medium text-slate-700">{t("age")}</span>
          <input
            type="number"
            min={1}
            value={age}
            onChange={(e) => setAge(e.target.value)}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-900 outline-none ring-primary/30 focus:ring"
            required
          />
          {fieldErrors.age?.[0] && (
            <span className="mt-1 block text-xs text-rose-600">{fieldErrors.age[0]}</span>
          )}
        </label>

        <label>
          <span className="mb-1 block text-sm font-medium text-slate-700">{t("education")}</span>
          <input
            value={education}
            onChange={(e) => setEducation(e.target.value)}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-900 outline-none ring-primary/30 focus:ring"
            required
          />
          {fieldErrors.education?.[0] && (
            <span className="mt-1 block text-xs text-rose-600">{fieldErrors.education[0]}</span>
          )}
        </label>

        <label>
          <span className="mb-1 block text-sm font-medium text-slate-700">{t("class")}</span>
          <select
            value={classInterest}
            onChange={(e) => setClassInterest(e.target.value)}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-900 outline-none ring-primary/30 focus:ring"
            required
          >
            {CLASS_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          {fieldErrors.class_interest?.[0] && (
            <span className="mt-1 block text-xs text-rose-600">
              {fieldErrors.class_interest[0]}
            </span>
          )}
        </label>

        <label>
          <span className="mb-1 block text-sm font-medium text-slate-700">{t("school")}</span>
          <select
            value={schoolType}
            onChange={(e) =>
              setSchoolType(
                e.target.value as "international" | "government" | "private" | "other"
              )
            }
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-900 outline-none ring-primary/30 focus:ring"
            required
          >
            <option value="international">{t("schoolInternational")}</option>
            <option value="government">{t("schoolGovernment")}</option>
            <option value="private">{t("schoolPrivate")}</option>
            <option value="other">{t("schoolOther")}</option>
          </select>
          {fieldErrors.school_type?.[0] && (
            <span className="mt-1 block text-xs text-rose-600">{fieldErrors.school_type[0]}</span>
          )}
        </label>

        {schoolType === "other" && (
          <label className="sm:col-span-2">
            <span className="mb-1 block text-sm font-medium text-slate-700">
              {t("schoolOtherValue")}
            </span>
            <input
              value={schoolOther}
              onChange={(e) => setSchoolOther(e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-900 outline-none ring-primary/30 focus:ring"
              required
            />
            {fieldErrors.school_other?.[0] && (
              <span className="mt-1 block text-xs text-rose-600">{fieldErrors.school_other[0]}</span>
            )}
          </label>
        )}

        <label className="sm:col-span-2">
          <span className="mb-1 block text-sm font-medium text-slate-700">
            {t("facebookAccount")}
          </span>
          <input
            value={facebookAccount}
            onChange={(e) => setFacebookAccount(e.target.value)}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-900 outline-none ring-primary/30 focus:ring"
            required
          />
          {fieldErrors.facebook_account?.[0] && (
            <span className="mt-1 block text-xs text-rose-600">
              {fieldErrors.facebook_account[0]}
            </span>
          )}
        </label>

        <label>
          <span className="mb-1 block text-sm font-medium text-slate-700">{t("phone")}</span>
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-900 outline-none ring-primary/30 focus:ring"
            required
          />
          {fieldErrors.phone?.[0] && (
            <span className="mt-1 block text-xs text-rose-600">{fieldErrors.phone[0]}</span>
          )}
        </label>

        <label>
          <span className="mb-1 block text-sm font-medium text-slate-700">{t("townAddress")}</span>
          <input
            value={townAddress}
            onChange={(e) => setTownAddress(e.target.value)}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-900 outline-none ring-primary/30 focus:ring"
            required
          />
          {fieldErrors.town_address?.[0] && (
            <span className="mt-1 block text-xs text-rose-600">{fieldErrors.town_address[0]}</span>
          )}
        </label>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? t("submitting") : t("submit")}
        </button>
        <button
          type="button"
          onClick={onLogout}
          className="inline-flex items-center justify-center rounded-lg border border-slate-300 px-6 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
        >
          {t("logout")}
        </button>
      </div>
    </form>
  );
}
