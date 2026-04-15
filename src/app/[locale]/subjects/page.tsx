import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getSubjects } from "@/services/subjectService";
import { SubjectDiscoveryRow } from "@/components/subjects/SubjectDiscoveryRow";
import { buildPageMetadata } from "@/lib/seo";

export const revalidate = 60;

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata" });
  return buildPageMetadata(t("subjectsTitle"), t("subjectsDescription"), locale, "subjects");
}

export default async function SubjectsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Subjects");
  const subjects = await getSubjects();

  return (
    <section className="min-w-0 px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <div className="mx-auto min-w-0 max-w-6xl">
        <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-5 shadow-sm sm:p-7">
          <h1 className="text-lg font-semibold tracking-tight text-slate-900 sm:text-xl">
            {t("title")}
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-600 sm:text-base">
            {t("description")}
          </p>
        </div>

        {subjects.length > 0 ? (
          <div className="mt-10 sm:mt-12">
            {subjects.map((subject, index) => (
              <div key={subject.id}>
                <SubjectDiscoveryRow
                  subject={subject}
                  t={t}
                />
                {index < subjects.length - 1 && (
                  <hr className="border-slate-200" />
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center sm:mt-10">
            <p className="text-sm text-slate-600 sm:text-base">{t("empty")}</p>
            <Link
              href="/courses"
              className="mt-5 inline-flex items-center justify-center rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-primary/90"
            >
              {t("browseClasses")}
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
