"use client";

import { FormEvent, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
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
  const pathname = usePathname();
  const initialToken = getAuthToken();

  const [token, setToken] = useState<string | null>(initialToken);
  const [authLoading, setAuthLoading] = useState<boolean>(initialToken !== null);
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
    if (!token) {
      return;
    }

    fetchMe(token)
      .then((user) => {
        if (!user) return;
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
      })
      .finally(() => setAuthLoading(false));
  }, [token]);

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

  if (authLoading) {
    return <p className="text-slate-600">{t("checkingAuth")}</p>;
  }

  if (!token) {
    return (
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
        <p className="text-slate-700">{t("needGoogleLogin")}</p>
        <a
          href={buildGoogleLoginUrl(pathname)}
          className="mt-4 inline-flex items-center justify-center rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
        >
          {t("continueWithGoogle")}
        </a>
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
