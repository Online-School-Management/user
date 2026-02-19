"use client";

import { useTranslations } from "next-intl";
import type { Course } from "@/types/course";
import { CourseCard } from "./CourseCard";

type CourseGridProps = {
  courses: Course[];
};

export function CourseGrid({ courses }: CourseGridProps) {
  const t = useTranslations("CourseGrid");

  if (courses.length === 0) {
    return (
      <p className="col-span-full text-center text-slate-500 sm:col-span-2 lg:col-span-3">
        {t("empty")}
      </p>
    );
  }

  return (
    <>
      {courses.map((course) => (
        <CourseCard key={course.id} course={course} />
      ))}
    </>
  );
}
