import { getCourseBySlug } from "@/services/courseService";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";

type Props = { params: Promise<{ locale: string; slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const course = await getCourseBySlug(slug);
  const t = await getTranslations({ locale, namespace: "Metadata" });
  if (!course) return { title: t("courseTitle") };
  return {
    title: `${course.title} | Tip-Top Education`,
    description: course.subject?.name ?? undefined,
  };
}

export default async function CourseDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("CourseDetail");
  const tCard = await getTranslations("CourseCard");
  const course = await getCourseBySlug(slug);
  if (!course) notFound();

  const subjectName = course.subject?.name ?? tCard("subjectFallback");
  const durationUnit =
    course.duration != null
      ? course.duration === 1
        ? t("month")
        : t("months")
      : "";
  const durationLabel =
    course.duration != null
      ? `${t("duration")}: ${course.duration} ${durationUnit}`
      : null;

  return (
    <div className="min-h-screen px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6">
          <Link
            href="/courses"
            className="inline-flex items-center text-sm font-medium text-slate-600 transition-colors hover:text-primary"
          >
            {t("backToClasses")}
          </Link>
        </div>
        <span className="text-sm font-medium text-primary">{subjectName}</span>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">{course.title}</h1>
        <div className="mt-6 space-y-2 text-slate-600">
          {durationLabel && <p>{durationLabel}</p>}
          {course.monthly_fee != null && (
            <p>
              {t("monthlyFee")}: MMK {course.monthly_fee.toLocaleString()}
            </p>
          )}
          {course.total_fee != null && (
            <p>
              {t("totalFee")}: MMK {course.total_fee.toLocaleString()}
            </p>
          )}
        </div>
        <p className="mt-8 text-slate-500">{t("contentComingSoon")}</p>
        <div className="mt-10">
          <Link
            href={`/enroll/${course.slug}`}
            className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 text-sm font-medium text-white transition-colors hover:opacity-90"
          >
            {t("enrollCta")}
          </Link>
        </div>
      </div>
    </div>
  );
}
