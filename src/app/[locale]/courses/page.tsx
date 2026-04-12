import { getCoursesByStatus } from "@/services/courseService";
import { getSubjects } from "@/services/subjectService";
import { HomeCourseTabs } from "@/components/home/HomeCourseTabs";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";

export const revalidate = 60;

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata" });
  return buildPageMetadata(t("coursesTitle"), t("coursesDescription"), locale, "courses");
}

export default async function CoursesPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const tHome = await getTranslations({ locale, namespace: "Home" });
  const [upcomingCourses, subjects] = await Promise.all([
    getCoursesByStatus("upcoming"),
    getSubjects(),
  ]);

  return (
    <div className="min-w-0 px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <div className="mx-auto min-w-0 max-w-6xl space-y-10 sm:space-y-12">
        <section className="min-w-0" aria-labelledby="courses-classes-heading">
          <h1
            id="courses-classes-heading"
            className="text-lg font-semibold tracking-tight text-slate-900 sm:text-xl"
          >
            {tHome("classesHeading")}
          </h1>
          <div className="mt-6 sm:mt-8">
            <HomeCourseTabs
              upcomingCourses={upcomingCourses}
              page="courses"
              subjects={subjects}
            />
          </div>
        </section>
      </div>
    </div>
  );
}
