import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { API_ENDPOINTS } from "@/constants";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ redirect_to?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata" });
  return {
    title: t("loginTitle"),
    description: t("loginDescription"),
  };
}

export default async function LoginPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const { redirect_to } = await searchParams;
  setRequestLocale(locale);
  const t = await getTranslations("Login");
  const fallbackRedirectTo = `/${locale}`;
  const redirectTo =
    redirect_to && redirect_to.startsWith("/") ? redirect_to : fallbackRedirectTo;
  const googleLoginHref = `${API_ENDPOINTS.frontend.authGoogleRedirect}?redirect_to=${encodeURIComponent(
    redirectTo
  )}`;

  return (
    <div className="flex min-h-[calc(100dvh-8rem)] items-center bg-slate-50/50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-md">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <h1 className="text-center text-2xl font-bold text-slate-900">
            {t("title")}
          </h1>
          <p className="mt-2 text-center text-sm text-slate-600">
            {t("description")}
          </p>

          <a
            href={googleLoginHref}
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-6 py-3 text-sm font-medium text-slate-800 transition-colors hover:bg-slate-50"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
              <path
                fill="#EA4335"
                d="M12 10.2v3.9h5.5c-.2 1.3-1.5 3.9-5.5 3.9-3.3 0-6-2.7-6-6s2.7-6 6-6c1.9 0 3.1.8 3.8 1.5l2.6-2.5C16.8 3.5 14.6 2.7 12 2.7 6.9 2.7 2.7 6.9 2.7 12s4.2 9.3 9.3 9.3c5.4 0 9-3.8 9-9.1 0-.6-.1-1.1-.2-1.6H12Z"
              />
            </svg>
            {t("continueWithGoogle")}
          </a>

          <div className="my-4 flex items-center gap-3">
            <span className="h-px flex-1 bg-slate-200" />
            <span className="text-xs uppercase tracking-wide text-slate-400">
              {t("or")}
            </span>
            <span className="h-px flex-1 bg-slate-200" />
          </div>

          <button
            type="button"
            disabled
            className="inline-flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-lg border border-slate-200 bg-slate-100 px-6 py-3 text-sm font-medium text-slate-400"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
              <path
                fill="currentColor"
                d="M13.5 8H16V5h-2.5C10.5 5 9 6.8 9 9.6V12H7v3h2v4h3v-4h2.4l.6-3H12V9.9c0-1 .3-1.9 1.5-1.9Z"
              />
            </svg>
            {t("continueWithFacebook")}
          </button>
          <p className="mt-2 text-center text-xs text-slate-400">
            {t("facebookComingSoon")}
          </p>

          <p className="mt-4 text-center text-xs text-slate-500">
            Tip-Top Education
          </p>
        </div>
      </div>
    </div>
  );
}
