import { Link } from "@/i18n/navigation";
import type { Subject } from "@/types/subject";
import { ImageWithLoading } from "@/components/ImageWithLoading";
import {
  inferSubjectGuideTags,
  makeSubjectExcerpt,
  type SubjectGuideTag,
} from "@/components/subjects/subjectUtils";

type SubjectCardProps = {
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

export function SubjectCard({ subject, t }: SubjectCardProps) {
  const excerpt = makeSubjectExcerpt(subject);
  const tags = inferSubjectGuideTags(subject);

  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="relative aspect-[16/9] w-full bg-slate-100">
        {subject.image_url ? (
          <ImageWithLoading
            src={subject.image_url}
            alt={subject.name}
            wrapperClassName="absolute inset-0"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-slate-200 text-slate-400">
            <span className="text-3xl font-bold">S</span>
          </div>
        )}
      </div>
      <div className="space-y-3 p-5">
        <h2 className="text-lg font-semibold tracking-tight text-slate-900">
          {subject.name}
        </h2>
        {excerpt ? (
          <p className="line-clamp-3 text-sm leading-relaxed text-slate-600">{excerpt}</p>
        ) : (
          <p className="text-sm text-slate-500">{t("descriptionComingSoon")}</p>
        )}
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${GUIDE_TAG_STYLES[tag]}`}
            >
              {t(GUIDE_TAG_LABEL_KEYS[tag])}
            </span>
          ))}
        </div>
        <Link
          href={`/subjects/${subject.slug}`}
          className="inline-flex items-center text-sm font-semibold text-primary transition hover:text-primary/80"
        >
          {t("learnMore")} →
        </Link>
      </div>
    </article>
  );
}
