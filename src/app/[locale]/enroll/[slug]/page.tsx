import { getCourseBySlug } from "@/services/courseService";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { EnrollmentForm } from "@/components/enroll/EnrollmentForm";

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
    <div className="min-h-full px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <div className="mb-6">
          <Link
            href={`/courses/${course.slug}`}
            className="inline-flex items-center text-sm font-medium text-slate-600 transition-colors hover:text-primary"
          >
            {t("backToCourse")}
          </Link>
        </div>

        <h1 className="text-2xl font-medium text-slate-900">
          {t.rich("title", {
            courseName: course.title,
            course: (chunks) => <span className="font-bold text-primary">{chunks}</span>,
          })}
        </h1>

        <div className="mt-6">
          <EnrollmentForm
            courseId={course.id}
            courseTitle={course.title}
            subjectName={subjectName}
          />
        </div>
      </div>
    </div>
  );
}
