import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";

type Props = {
  locale: string;
};

export async function HomeHero({ locale }: Props) {
  setRequestLocale(locale);
  const t = await getTranslations("Home");
  const tCommon = await getTranslations("Common");

  return (
    <div className="relative overflow-hidden rounded-3xl border border-slate-200/90 bg-gradient-to-br from-slate-50 via-white to-brand-orange/10 px-6 py-10 shadow-sm sm:px-10 sm:py-12">
      <div
        className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-brand-orange/15 blur-3xl"
        aria-hidden
      />
      <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-xl space-y-4">
          <p className="text-xs font-semibold tracking-wide text-slate-600 sm:text-sm">
            {t.rich("heroEyebrow", {
              brand: (chunks) => (
                <span className="font-bold text-brand-orange">{chunks}</span>
              ),
              accent: (chunks) => (
                <span className="font-semibold text-primary">{chunks}</span>
              ),
            })}
          </p>
          {/* <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            {t("heroTitle")}
          </h1> */}
          <p className="hero-seq-shimmer text-base leading-relaxed text-slate-600 sm:text-lg">
            <span className="hero-seq-shimmer__text">{t("heroDescription")}</span>
            <span className="hero-seq-shimmer__glow-layer" aria-hidden>
              <span className="hero-seq-shimmer__bar hero-seq-shimmer__bar--1" />
            </span>
          </p>
          <p className="hero-seq-shimmer border-l-4 border-brand-orange/50 pl-4 text-base font-medium italic leading-relaxed text-slate-800 sm:text-lg">
            <span className="hero-seq-shimmer__text">{tCommon("siteTagline")}</span>
            <span className="hero-seq-shimmer__glow-layer" aria-hidden>
              <span className="hero-seq-shimmer__bar hero-seq-shimmer__bar--2" />
            </span>
          </p>
        </div>
        <div className="flex shrink-0 flex-col gap-3 sm:flex-row lg:flex-col">
          <Link
            href="/subjects"
            className="inline-flex items-center justify-center rounded-xl bg-primary px-6 py-3.5 text-center text-sm font-semibold text-white shadow-sm transition hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            {t("ctaExploreLearningPaths")}
          </Link>
          <Link
            href="/courses"
            className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-6 py-3.5 text-center text-sm font-semibold text-slate-800 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-300 focus:ring-offset-2"
          >
            {t("ctaBrowseCourses")}
          </Link>
        </div>
      </div>
    </div>
  );
}
