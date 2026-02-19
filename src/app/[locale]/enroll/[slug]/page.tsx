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
  if (!course) return { title: t("enrollTitle") };
  return {
    title: `${course.title} | Tip-Top Education`,
    description: `Enroll in ${course.title}.`,
  };
}

export default async function EnrollPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Enroll");
  const tCommon = await getTranslations("Common");
  const course = await getCourseBySlug(slug);
  if (!course) notFound();

  const subjectName = course.subject?.name ?? tCommon("course");

  return (
    <div className="min-h-screen px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-2xl font-bold text-slate-900">
          {t("inCourse")} {course.title}
        </h1>
        <p className="mt-2 text-slate-600">
          {subjectName}
          {course.monthly_fee != null &&
            ` · MMK ${course.monthly_fee.toLocaleString()}/month`}
        </p>
        <div className="mt-8 rounded-xl border border-slate-200 bg-slate-50/50 p-6 text-center text-slate-600">
          <p>{t("placeholder")}</p>
          <Link
            href={`/courses/${course.slug}`}
            className="mt-4 inline-block text-sm font-medium text-primary hover:underline"
          >
            {t("backToCourse")}
          </Link>
        </div>
      </div>
    </div>
  );
}
