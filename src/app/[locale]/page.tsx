import { getCoursesByStatus, mergeUpcomingInProgressCourses } from "@/services/courseService";
import { getSubjects } from "@/services/subjectService";
import { HomeHero } from "@/components/home/HomeHero";
import { HomeCourseTabs } from "@/components/home/HomeCourseTabs";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";

export const revalidate = 60;

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata" });
  return buildPageMetadata(t("defaultTitle"), t("defaultDescription"), locale, "");
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Home");
  const [upcomingCourses, inProgressCourses, subjects] = await Promise.all([
    getCoursesByStatus("upcoming"),
    getCoursesByStatus("in_progress"),
    getSubjects(),
  ]);
  const initialAllClassesCourses = mergeUpcomingInProgressCourses(
    upcomingCourses,
    inProgressCourses
  );

  return (
    <div className="min-w-0 px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <div className="mx-auto min-w-0 max-w-6xl space-y-10 sm:space-y-12">
        <HomeHero locale={locale} />

        <section className="min-w-0" aria-labelledby="home-classes-heading">
          <h2
            id="home-classes-heading"
            className="text-lg font-semibold tracking-tight text-slate-900 sm:text-xl"
          >
            {t("classesHeading")}
          </h2>
          <div className="mt-6 sm:mt-8">
            <HomeCourseTabs
              upcomingCourses={upcomingCourses}
              subjects={subjects}
              initialAllClassesCourses={initialAllClassesCourses}
            />
          </div>
        </section>
      </div>
    </div>
  );
}
