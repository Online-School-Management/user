import { getAllCourses } from "@/services/courseService";
import { CourseGrid } from "@/components/courses/CourseGrid";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata" });
  return {
    title: t("coursesTitle"),
    description: t("coursesDescription"),
  };
}

export default async function CoursesPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Courses");
  const courses = await getAllCourses();

  return (
    <section className="px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-center text-2xl font-semibold text-slate-900 sm:text-3xl">
          {t("ourCourses")}
        </h1>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <CourseGrid courses={courses} />
        </div>
      </div>
    </section>
  );
}
