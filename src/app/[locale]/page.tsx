import { getCoursesByStatus } from "@/services/courseService";
import { CourseGrid } from "@/components/courses/CourseGrid";
import { UpcomingIcon, InProgressIcon, CompletedIcon } from "@/components/icons/SectionIcons";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata" });
  return buildPageMetadata(t("defaultTitle"), t("defaultDescription"), locale, "");
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Courses");
  const [upcomingCourses, inProgressCourses, completedCourses] = await Promise.all([
    getCoursesByStatus("upcoming"),
    getCoursesByStatus("in_progress"),
    getCoursesByStatus("completed"),
  ]);

  return (
    <section className="min-w-0 px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <div className="mx-auto min-w-0 max-w-6xl space-y-16">
        <div>
          <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-900 sm:text-xl">
            <UpcomingIcon />
            {t("upcomingClasses")}
          </h2>
          <div className="mt-6 grid gap-4 sm:mt-8 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <CourseGrid courses={upcomingCourses} />
          </div>
        </div>
        <div>
          <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-900 sm:text-xl">
            <InProgressIcon />
            {t("inProgressClasses")}
          </h2>
          <div className="mt-6 grid gap-4 sm:mt-8 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <CourseGrid courses={inProgressCourses} />
          </div>
        </div>
        <div>
          <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-900 sm:text-xl">
            <CompletedIcon />
            {t("completedClasses")}
          </h2>
          <div className="mt-6 grid gap-4 sm:mt-8 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <CourseGrid courses={completedCourses} />
          </div>
        </div>
      </div>
    </section>
  );
}
