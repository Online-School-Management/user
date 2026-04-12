"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { Course } from "@/types/course";
import { formatScheduleSummary } from "@/utils/courseFormat";
import { ImageWithLoading } from "@/components/ImageWithLoading";

type CourseCardProps = {
  course: Course;
};

function courseStatusBadgeClass(status: string): string {
  switch (status) {
    case "upcoming":
      return "bg-sky-100 text-sky-800 ring-1 ring-sky-200/80";
    case "in_progress":
      return "bg-amber-100 text-amber-900 ring-1 ring-amber-200/80";
    case "completed":
      return "bg-emerald-100 text-emerald-900 ring-1 ring-emerald-200/80";
    case "cancelled":
      return "bg-slate-100 text-slate-700 ring-1 ring-slate-200/80";
    default:
      return "bg-slate-100 text-slate-600 ring-1 ring-slate-200/70";
  }
}

function formatStartDate(isoDate: string): string {
  const d = new Date(isoDate);
  const day = d.getDate();
  const month = d.toLocaleDateString("en-GB", { month: "short" });
  const year = d.getFullYear();
  return `${day}. ${month} ${year}`;
}

export function CourseCard({ course }: CourseCardProps) {
  const t = useTranslations("CourseCard");
  const tDetail = useTranslations("CourseDetail");

  const statusLabel = (() => {
    switch (course.status) {
      case "upcoming":
        return tDetail("status_upcoming");
      case "in_progress":
        return tDetail("status_in_progress");
      case "completed":
        return tDetail("status_completed");
      case "cancelled":
        return tDetail("status_cancelled");
      default:
        return course.status ? course.status.replace(/_/g, " ") : tDetail("unknown");
    }
  })();

  return (
    <Link
      href={`/courses/${course.slug}`}
      className="flex flex-col overflow-hidden rounded-2xl border border-white/40 bg-white/60 shadow-sm backdrop-blur-xl transition-shadow hover:shadow-md"
    >
      <div className="relative aspect-[2/1] w-full bg-slate-100">
        {course.image_url ? (
          <ImageWithLoading
            src={course.image_url}
            alt={course.title}
            wrapperClassName="absolute inset-0"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <Image
            src="/course-default.svg"
            alt={course.title}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        )}
      </div>
      <div className="flex flex-1 flex-col p-4 sm:p-6">
        <span className="text-base font-medium text-primary sm:text-lg">
          {course.subject?.name ?? t("subjectFallback")}
        </span>
        <div className="mt-2 flex min-w-0 items-start justify-between gap-2">
          <h3 className="min-w-0 flex-1 text-sm font-semibold leading-snug text-slate-900 line-clamp-2">
            {course.title}
          </h3>
          <span
            className={`shrink-0 rounded-full px-2 py-0.5 text-center text-[11px] font-semibold leading-tight sm:text-xs ${courseStatusBadgeClass(course.status)}`}
          >
            {statusLabel}
          </span>
        </div>
        <div className="mt-3 flex flex-1 flex-col gap-1.5 text-sm text-slate-600">
          {course.duration != null && (
            <p className="flex min-w-0 flex-wrap items-baseline gap-1">
              <span className="min-w-[7rem] shrink-0 font-medium text-slate-700">{t("duration")}</span>
              <span className="min-w-0 break-words">: {course.duration} {course.duration_unit === "day" ? (course.duration === 1 ? t("day") : t("days")) : (course.duration === 1 ? t("month") : t("months"))}</span>
            </p>
          )}
          {course.monthly_fee != null && (
            <p className="flex min-w-0 flex-wrap items-baseline gap-1">
              <span className="min-w-[7rem] shrink-0 font-medium text-slate-700">{t("fee")}</span>
              <span className="min-w-0 break-words">
                : {course.monthly_fee === 0 ? (
                  <span className="inline-flex rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-700">
                    {t("free")}
                  </span>
                ) : (
                  <>{course.monthly_fee.toLocaleString()} MMK {t("perMonth")}</>
                )}
              </span>
            </p>
          )}
          {course.start_date && (
            <p className="flex min-w-0 flex-wrap items-baseline gap-1">
              <span className="min-w-[7rem] shrink-0 font-medium text-slate-700">{t("startDate")}</span>
              <span className="min-w-0 break-words">: {formatStartDate(course.start_date)}</span>
            </p>
          )}
          {course.schedules && course.schedules.length > 0 && (
            <p className="flex min-w-0 flex-wrap items-baseline gap-1">
              <span className="min-w-[7rem] shrink-0 font-medium text-slate-700">{t("weeklySchedule")}</span>
              <span className="min-w-0 break-words">: {formatScheduleSummary(course.schedules)}</span>
            </p>
          )}
        </div>
        <span className="mt-4 text-sm font-medium text-primary">
          {t("viewDetails")}
        </span>
      </div>
    </Link>
  );
}
