"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { Course } from "@/types/course";

type CourseCardProps = {
  course: Course;
};

export function CourseCard({ course }: CourseCardProps) {
  const t = useTranslations("CourseCard");

  return (
    <Link
      href={`/courses/${course.slug}`}
      className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="relative aspect-[16/9] w-full bg-slate-100">
        <Image
          src="/course-default.svg"
          alt=""
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
      </div>
      <div className="flex flex-1 flex-col p-6">
        <span className="text-sm font-medium text-primary">
          {course.subject?.name ?? t("subjectFallback")}
        </span>
        <h3 className="mt-2 text-lg font-semibold text-slate-900">
          {course.title}
        </h3>
        <div className="mt-3 flex flex-1 flex-col gap-1 text-sm text-slate-600">
          {course.duration != null && (
            <span>
              {course.duration} {course.duration_unit}
              {course.duration !== 1 ? "s" : ""}
            </span>
          )}
          {course.monthly_fee != null && (
            <span>MMK {course.monthly_fee.toLocaleString()}/month</span>
          )}
        </div>
        <span className="mt-4 text-sm font-medium text-primary">
          {t("viewDetails")}
        </span>
      </div>
    </Link>
  );
}
