"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { Course } from "@/types/course";
import { formatScheduleSummary } from "@/utils/courseFormat";

type CourseCardProps = {
  course: Course;
};

function formatStartDate(isoDate: string): string {
  const d = new Date(isoDate);
  const day = d.getDate();
  const month = d.toLocaleDateString("en-GB", { month: "short" });
  const year = d.getFullYear();
  return `${day}. ${month} ${year}`;
}

export function CourseCard({ course }: CourseCardProps) {
  const t = useTranslations("CourseCard");

  return (
    <Link
      href={`/courses/${course.slug}`}
      className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="relative aspect-[2/1] w-full bg-slate-100">
        {course.image_url ? (
          <img
            src={course.image_url}
            alt={course.title}
            className="h-full w-full object-cover"
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
        <span className="text-sm font-medium text-primary">
          {course.subject?.name ?? t("subjectFallback")}
        </span>
        <h3 className="mt-2 text-base font-semibold text-slate-900 sm:text-lg">
          {course.title}
        </h3>
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
