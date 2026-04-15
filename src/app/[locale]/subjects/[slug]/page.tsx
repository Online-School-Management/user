import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { buildPageMetadata } from "@/lib/seo";
import { getSubjectBySlug } from "@/services/subjectService";
import { getCoursesByStatus, mergeUpcomingInProgressCourses } from "@/services/courseService";
import { CourseCard } from "@/components/courses/CourseCard";
import { SubjectRichContent } from "@/components/subjects/SubjectRichContent";

export const revalidate = 60;

type Props = { params: Promise<{ locale: string; slug: string }> };

function stripHtml(input: string): string {
  return input.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata" });
  const subject = await getSubjectBySlug(slug);

  if (!subject) {
    return buildPageMetadata(t("subjectsTitle"), t("subjectsDescription"), locale, "subjects");
  }

  const rawDescription = (subject.description ?? "")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  const description = rawDescription || t("subjectDetailDescriptionFallback");
  const title = `${subject.name} | ${t("subjectsTitle")}`;

  return buildPageMetadata(title, description, locale, `subjects/${slug}`, {
    image: subject.image_url ?? undefined,
    imageAlt: subject.name,
  });
}

export default async function SubjectDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Subjects");

  const [subject, upcomingCourses, inProgressCourses] = await Promise.all([
    getSubjectBySlug(slug),
    getCoursesByStatus("upcoming"),
    getCoursesByStatus("in_progress"),
  ]);

  if (!subject) notFound();

  const summary = subject.short_description?.trim() || t("subjectDetailLead");
  const subjectTag =
    locale === "my"
      ? subject.tag_mm?.trim() || subject.tag_en?.trim() || ""
      : subject.tag_en?.trim() || subject.tag_mm?.trim() || "";
  const availableCourses = mergeUpcomingInProgressCourses(upcomingCourses, inProgressCourses).filter(
    (course) => course.subject?.slug === subject.slug
  );

  return (
    <div className="min-w-0 px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <div className="mx-auto min-w-0 max-w-6xl space-y-6 sm:space-y-8 lg:space-y-10">
        <div>
          <Link
            href="/subjects"
            className="inline-flex items-center text-sm font-medium text-slate-600 transition-colors hover:text-primary"
          >
            {t("backToSubjects")}
          </Link>
        </div>

        <header className="flex flex-wrap items-center gap-2 sm:gap-3">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            {subject.name}
          </h1>
          {subjectTag ? (
            <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary sm:text-sm">
              {subjectTag}
            </span>
          ) : null}
        </header>

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="grid items-center gap-6 p-4 sm:p-5 lg:grid-cols-12 lg:gap-8 lg:p-6">
            {subject.image_url ? (
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 shadow-[0_10px_30px_-18px_rgba(15,23,42,0.45)] lg:col-span-5">
                <img
                  src={subject.image_url}
                  alt={subject.name}
                  className="h-full max-h-[24rem] w-full object-cover lg:max-h-none"
                />
              </div>
            ) : null}
            <div className={`${subject.image_url ? "lg:col-span-7" : "lg:col-span-12"} min-w-0`}>
              <p className="text-sm leading-relaxed text-slate-600 sm:text-base">
                {summary}
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <h2 className="text-lg font-semibold text-slate-900 sm:text-xl">{t("aboutSubject")}</h2>
          {(subject.description ?? "").trim() ? (
            <div className="mt-4">
              <SubjectRichContent html={subject.description ?? ""} />
            </div>
          ) : (
            <p className="mt-4 text-sm text-slate-600 sm:text-base">{t("descriptionComingSoon")}</p>
          )}
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <h2 className="text-lg font-semibold text-slate-900 sm:text-xl">
            {locale === "my" ? (
              <>
                <span className="text-primary">{subject.name}</span> အတွက် ရရှိနိုင်သော အတန်းများ
              </>
            ) : (
              <>
                Available classes for <span className="text-primary">{subject.name}</span>
              </>
            )}
          </h2>

          {availableCourses.length > 0 ? (
            <div className="mt-6 grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
              {availableCourses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          ) : (
            <div className="mt-6 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
              <p className="text-sm text-slate-600 sm:text-base">{t("noAvailableClasses")}</p>
              <Link
                href="/contact"
                className="mt-4 inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800 transition hover:bg-slate-50"
              >
                {t("contactForNextBatch")}
              </Link>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
