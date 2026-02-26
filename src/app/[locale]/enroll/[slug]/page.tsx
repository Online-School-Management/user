import { getCourseBySlug } from "@/services/courseService";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { EnrollmentForm } from "@/components/enroll/EnrollmentForm";
import { buildPageMetadata } from "@/lib/seo";
import { APP_BASE_URL, SITE_NAME } from "@/constants";

type Props = { params: Promise<{ locale: string; slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const course = await getCourseBySlug(slug);
  const t = await getTranslations({ locale, namespace: "Metadata" });
  if (!course) return { title: t("enrollTitle") };
  const title = `${course.title} | ${SITE_NAME}`;
  const description = `Enroll in ${course.title}.`;
  const ogImage = `${APP_BASE_URL}/og?title=${encodeURIComponent(course.title)}&subtitle=${encodeURIComponent(`Enroll now`)}`;
  return buildPageMetadata(title, description, locale, `enroll/${slug}`, {
    image: ogImage,
    imageAlt: course.title,
  });
}

function isEnrollmentClosed(enrollmentEndDate: string | null | undefined): boolean {
  if (!enrollmentEndDate) return false;
  const today = new Date().toISOString().slice(0, 10);
  return today > enrollmentEndDate;
}

export default async function EnrollPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Enroll");
  const tCommon = await getTranslations("Common");
  const course = await getCourseBySlug(slug);
  if (!course) notFound();

  const subjectName = course.subject?.name ?? tCommon("course");
  const closed = isEnrollmentClosed(course.enrollment_end_date);

  return (
    <div className="min-h-full min-w-0 px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <div className="mx-auto min-w-0 max-w-3xl">
        <div className="mb-6">
          <Link
            href={`/courses/${course.slug}`}
            className="inline-flex items-center text-sm font-medium text-slate-600 transition-colors hover:text-primary"
          >
            {t("backToCourse")}
          </Link>
        </div>

        <h1 className="text-xl font-medium text-slate-900 sm:text-2xl">
          {t.rich("title", {
            courseName: course.title,
            course: (chunks) => (
              <span className="font-bold text-primary">{chunks}</span>
            ),
          })}
        </h1>

        {closed ? (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-6 shadow-sm">
            <p className="text-red-600 font-medium">{t("enrollmentClosedMessage")}</p>
            <Link
              href={`/courses/${course.slug}`}
              className="mt-4 inline-flex text-sm font-medium text-primary hover:underline"
            >
              {t("enrollmentClosedBack")}
            </Link>
          </div>
        ) : (
          <div className="mt-6">
            <EnrollmentForm
              courseId={course.id}
              courseSlug={course.slug}
              courseTitle={course.title}
              subjectName={subjectName}
            />
          </div>
        )}
      </div>
    </div>
  );
}
