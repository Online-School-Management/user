"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { getAuthToken } from "@/services/authService";
import { checkEnrollmentRequest } from "@/services/enrollmentService";

function isEnrollmentClosedByDate(enrollmentEndDate: string | null | undefined): boolean {
  if (!enrollmentEndDate) return false;
  const today = new Date().toISOString().slice(0, 10);
  return today > enrollmentEndDate;
}

type Props = {
  courseSlug: string;
  enrollmentEndDate?: string | null;
};

type Status = "idle" | "loading" | "can_enroll" | "already_enrolled";

const buttonBaseClass =
  "inline-flex w-full items-center justify-center rounded-lg px-6 py-3 text-sm font-medium transition-colors";

export function CourseEnrollCta({ courseSlug, enrollmentEndDate }: Props) {
  const t = useTranslations("CourseDetail");
  const [status, setStatus] = useState<Status>("idle");
  const [checked, setChecked] = useState(false);

  const closedByDate = isEnrollmentClosedByDate(enrollmentEndDate);

  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      setStatus("can_enroll");
      setChecked(true);
      return;
    }

    setStatus("loading");
    checkEnrollmentRequest(token, courseSlug).then((result) => {
      if (result.ok && result.has_pending) {
        setStatus("already_enrolled");
      } else {
        setStatus("can_enroll");
      }
      setChecked(true);
    });
  }, [courseSlug]);

  if (closedByDate) {
    return (
      <div className="mt-5">
        <span
          className={`${buttonBaseClass} cursor-not-allowed border border-red-200 bg-red-50 text-red-600`}
          aria-disabled="true"
        >
          {t("enrollmentClosed")}
        </span>
      </div>
    );
  }

  if (!checked) {
    return (
      <div className="mt-5">
        <span
          className={`${buttonBaseClass} cursor-wait bg-slate-200 text-slate-500`}
          aria-hidden
        >
          {t("enrollCtaLoading")}
        </span>
      </div>
    );
  }

  if (status === "already_enrolled") {
    return (
      <div className="mt-5">
        <span
          className={`${buttonBaseClass} cursor-not-allowed border-2 border-amber-300 bg-amber-50 text-amber-800`}
          aria-disabled="true"
        >
          {t("alreadyEnrolled")}
        </span>
      </div>
    );
  }

  return (
    <div className="mt-5">
      <Link
        href={`/enroll/${courseSlug}`}
        className={`${buttonBaseClass} bg-primary text-white hover:opacity-90`}
      >
        {t("enrollCta")}
      </Link>
    </div>
  );
}
