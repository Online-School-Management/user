import { getCourseBySlug } from "@/services/courseService";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { CourseEnrollCta } from "@/components/courses/CourseEnrollCta";
import { formatScheduleSummary } from "@/utils/courseFormat";
import { buildPageMetadata } from "@/lib/seo";
import { APP_BASE_URL, SITE_NAME } from "@/constants";

type Props = { params: Promise<{ locale: string; slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const course = await getCourseBySlug(slug);
  const t = await getTranslations({ locale, namespace: "Metadata" });
  if (!course) return { title: t("courseTitle") };
  const title = `${course.title} | ${SITE_NAME}`;
  const rawDescription = course.description
    ? course.description.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim()
    : "";
  const description =
    rawDescription || course.subject?.name || `${course.title} - Learn at ${SITE_NAME}`;
  const ogSubtitle = rawDescription.slice(0, 100) || course.subject?.name || "";
  const ogImage = `${APP_BASE_URL}/og?title=${encodeURIComponent(course.title)}&subtitle=${encodeURIComponent(ogSubtitle)}`;
  return buildPageMetadata(title, description, locale, `courses/${slug}`, {
    image: ogImage,
    imageAlt: course.title,
  });
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
  const formatDate = (date: string | null) => {
    if (!date) return t("unknown");
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(new Date(date));
  };

  const formatStatus = (status: string | null) => {
    if (!status) return t("unknown");
    if (status === "upcoming") return t("status_upcoming");
    if (status === "in_progress") return t("status_in_progress");
    if (status === "completed") return t("status_completed");
    if (status === "cancelled") return t("status_cancelled");
    return status;
  };

  const statusBadgeClass = (status: string | null) => {
    if (status === "upcoming") return "bg-amber-100 text-amber-700"; // warning
    if (status === "in_progress") return "bg-sky-100 text-sky-700"; // active
    if (status === "completed") return "bg-emerald-100 text-emerald-700"; // success
    if (status === "cancelled") return "bg-rose-100 text-rose-700"; // danger
    return "bg-slate-100 text-slate-700";
  };

  const formatCourseType = (courseType: string | null) => {
    if (!courseType) return t("unknown");
    if (courseType === "one_on_one") return "One-on-one";
    if (courseType === "private") return "Private";
    if (courseType === "group") return "Group";
    if (courseType === "teacher_training") return "Teacher training";
    return courseType;
  };

  return (
    <div className="min-h-full px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6">
          <Link
            href="/courses"
            className="inline-flex items-center text-sm font-medium text-slate-600 transition-colors hover:text-primary"
          >
            {t("backToClasses")}
          </Link>
        </div>

        <div className="grid gap-6 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <div className="relative mb-6 aspect-[2/1] w-full overflow-hidden rounded-2xl bg-slate-100">
              {course.image_url ? (
                <img
                  src={course.image_url}
                  alt={course.title}
                  className="h-full w-full object-cover"
                />
              ) : (
                <Image
                  src="/course-default.svg"
                  alt={course.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 1024px"
                  priority
                />
              )}
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <span className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                {subjectName}
              </span>
              <h1 className="mt-3 text-2xl font-bold text-slate-900 sm:text-3xl">
                {course.title}
              </h1>
              {course.description ? (
                <div
                  className="mt-4 text-slate-600 [&_h1]:text-xl [&_h1]:font-bold [&_h1]:mb-2 [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:mb-2 [&_h3]:text-base [&_h3]:font-semibold [&_h3]:mb-2 [&_p]:mb-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-2 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:mb-2 [&_li]:mb-1 [&_a]:text-primary [&_a]:underline [&_img]:max-w-full [&_img]:rounded"
                  dangerouslySetInnerHTML={{ __html: course.description }}
                />
              ) : (
                <p className="mt-4 text-slate-600">{t("contentComingSoon")}</p>
              )}
            </div>
          </div>

          <aside className="lg:col-span-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:sticky lg:top-20">
              <h2 className="text-lg font-semibold text-slate-900">
                {t("classInfoTitle")}
              </h2>

              <div className="mt-4 divide-y divide-slate-100 rounded-xl border border-slate-100">
                <div className="p-3">
                  <p className="text-xs font-medium text-slate-500">{t("classType")}</p>
                  <p className="mt-1 text-sm font-semibold text-slate-900">
                    {formatCourseType(course.course_type)}
                  </p>
                </div>

                <div className="p-3">
                  <p className="text-xs font-medium text-slate-500">{t("duration")}</p>
                  <p className="mt-1 text-sm font-semibold text-slate-900">
                    {course.duration != null
                      ? `${course.duration} ${durationUnit}`
                      : t("unknown")}
                  </p>
                </div>

                <div className="p-3">
                  <p className="text-xs font-medium text-slate-500">{t("startDate")}</p>
                  <p className="mt-1 text-sm font-semibold text-slate-900">
                    {formatDate(course.start_date)}
                  </p>
                </div>

                {course.schedules && course.schedules.length > 0 && (
                  <div className="p-3">
                    <p className="text-xs font-medium text-slate-500">{t("weeklySchedule")}</p>
                    <p className="mt-1 text-sm font-semibold text-slate-900">
                      {formatScheduleSummary(course.schedules)}
                    </p>
                  </div>
                )}

                <div className="p-3">
                  <p className="text-xs font-medium text-slate-500">{t("status")}</p>
                  <p
                    className={`mt-1 inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${statusBadgeClass(
                      course.status
                    )}`}
                  >
                    {formatStatus(course.status)}
                  </p>
                </div>

                <div className="p-3">
                  <p className="text-xs font-medium text-slate-500">{t("monthlyFee")}</p>
                  <p className="mt-1 text-sm font-semibold text-slate-900">
                    {course.monthly_fee != null ? (
                      course.monthly_fee === 0 ? (
                        <span className="inline-flex rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-700">
                          {t("free")}
                        </span>
                      ) : (
                        `${course.monthly_fee.toLocaleString()} MMK`
                      )
                    ) : (
                      t("unknown")
                    )}
                  </p>
                </div>

                <div className="p-3">
                  <p className="text-xs font-medium text-slate-500">{t("totalFee")}</p>
                  <p className="mt-1 text-sm font-semibold text-slate-900">
                    {course.total_fee != null ? (
                      course.total_fee === 0 ? (
                        <span className="inline-flex rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-700">
                          {t("free")}
                        </span>
                      ) : (
                        `${course.total_fee.toLocaleString()} MMK`
                      )
                    ) : (
                      t("unknown")
                    )}
                  </p>
                </div>

                {course.max_students != null && course.max_students > 0 && (
                  <div className="p-3">
                    <p className="text-xs font-medium text-slate-500">{t("maxStudents")}</p>
                    <p className="mt-1 text-sm font-semibold text-slate-900">
                      {t("maxStudentsOnly", { count: course.max_students })}
                    </p>
                  </div>
                )}

                {course.enrollment_end_date && (
                  <div className="p-3">
                    <p className="text-xs font-medium text-slate-500">{t("enrollmentEndDate")}</p>
                    <p className="mt-1 text-sm font-semibold text-red-600">
                      {formatDate(course.enrollment_end_date)}
                    </p>
                  </div>
                )}
              </div>

              {course.status !== "completed" && (
                <CourseEnrollCta
                  courseSlug={course.slug}
                  enrollmentEndDate={course.enrollment_end_date ?? undefined}
                />
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
