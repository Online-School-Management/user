import { getCoursesByStatus } from "@/services/courseService";
import { CourseGrid } from "@/components/courses/CourseGrid";
import { UpcomingIcon, InProgressIcon } from "@/components/icons/SectionIcons";
import { getTranslations, setRequestLocale } from "next-intl/server";

type Props = { params: Promise<{ locale: string }> };

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Courses");
  const [upcomingCourses, inProgressCourses] = await Promise.all([
    getCoursesByStatus("upcoming"),
    getCoursesByStatus("in_progress"),
  ]);

  return (
    <section className="px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-16">
        <div>
          <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-900 sm:text-xl">
            <UpcomingIcon />
            {t("upcomingClasses")}
          </h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <CourseGrid courses={upcomingCourses} />
          </div>
        </div>
        <div>
          <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-900 sm:text-xl">
            <InProgressIcon />
            {t("inProgressClasses")}
          </h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <CourseGrid courses={inProgressCourses} />
          </div>
        </div>
      </div>
    </section>
  );
}
