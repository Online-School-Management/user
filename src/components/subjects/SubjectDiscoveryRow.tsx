import { Link } from "@/i18n/navigation";
import { useLocale } from "next-intl";
import { ImageWithLoading } from "@/components/ImageWithLoading";
import type { Subject } from "@/types/subject";
import {
  inferSubjectGuideTags,
  normalizeSubjectHtml,
  stripHtml,
  type SubjectGuideTag,
} from "@/components/subjects/subjectUtils";

type SubjectDiscoveryRowProps = {
  subject: Subject;
  t: (key: string) => string;
};

const GUIDE_TAG_STYLES: Record<SubjectGuideTag, string> = {
  beginner: "bg-emerald-100 text-emerald-700",
  advanced: "bg-indigo-100 text-indigo-700",
  creative: "bg-fuchsia-100 text-fuchsia-700",
  jobReady: "bg-amber-100 text-amber-700",
};

const GUIDE_TAG_LABEL_KEYS: Record<SubjectGuideTag, string> = {
  beginner: "guideBeginner",
  advanced: "guideAdvanced",
  creative: "guideCreative",
  jobReady: "guideJobReady",
};

export function SubjectDiscoveryRow({ subject, t }: SubjectDiscoveryRowProps) {
  const locale = useLocale();
  const tags = inferSubjectGuideTags(subject);
  const richPreviewHtml = normalizeSubjectHtml(subject.description ?? "");
  const shortDescription = subject.short_description?.trim() ?? "";
  const fallbackDescriptionText = stripHtml(richPreviewHtml);
  const displayDescription = shortDescription || fallbackDescriptionText;
  const primaryTag = (
    locale === "my" ? subject.tag_mm : subject.tag_en
  )?.trim() || (
    locale === "my" ? subject.tag_en : subject.tag_mm
  )?.trim() || null;

  return (
    <article className="py-10 sm:py-12">
      <div className="grid items-center gap-8 lg:grid-cols-12 lg:gap-8">
        <div className="relative aspect-[16/10] w-full overflow-hidden rounded-3xl bg-slate-100 lg:col-span-5 lg:ml-auto lg:aspect-[19/9] lg:max-w-[92%]">
          {subject.image_url ? (
            <ImageWithLoading
              src={subject.image_url}
              alt={subject.name}
              wrapperClassName="absolute inset-0"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-slate-200 text-slate-400">
              <span className="text-4xl font-bold">S</span>
            </div>
          )}
        </div>

        <div className="min-w-0 lg:col-span-7 flex flex-col">
          <div className="flex items-start justify-between gap-3">
            <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl lg:text-3xl">
              {subject.name}
            </h2>
            {primaryTag ? (
              <span className="inline-flex shrink-0 rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700">
                {primaryTag}
              </span>
            ) : tags[0] ? (
              <span
                className={`inline-flex shrink-0 rounded-full px-3 py-1 text-xs font-medium ${GUIDE_TAG_STYLES[tags[0]]}`}
              >
                {t(GUIDE_TAG_LABEL_KEYS[tags[0]])}
              </span>
            ) : null}
          </div>

          {displayDescription ? (
            <p className="mt-6 text-base leading-relaxed text-slate-600 sm:text-lg">
              {displayDescription}
              {' '}
              <Link
                href={`/subjects/${subject.slug}`}
                className="inline-flex items-center gap-1 font-semibold text-primary underline-offset-2 transition hover:text-primary/90 hover:underline"
              >
                {t("readMoreInline")}
                <svg
                  aria-hidden
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4"
                >
                  <path d="M5 12h14" />
                  <path d="m13 5 7 7-7 7" />
                </svg>
              </Link>
            </p>
          ) : (
            <p className="mt-6 text-base text-slate-500 sm:text-lg">{t("descriptionComingSoon")}</p>
          )}
        </div>
      </div>
    </article>
  );
}
