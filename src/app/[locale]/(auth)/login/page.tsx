import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import Image from "next/image";
import { API_ENDPOINTS } from "@/constants";
import { Link } from "@/i18n/navigation";

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
          <div className="space-y-6">
            <div className="space-y-4 text-center">
              <Image
                src="/tiptop-logo.svg"
                alt="Tip-Top Education"
                width={170}
                height={44}
                className="mx-auto h-9 w-auto"
                priority
              />
              <div className="space-y-1.5">
                <h1 className="text-lg font-semibold text-slate-900">Student Login</h1>
                <p className="text-sm text-slate-500">Use your Google account to continue.</p>
              </div>
            </div>

            <a
              href={googleLoginHref}
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-[#DB4437] bg-[#DB4437] px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-[#C5392D]"
            >
              <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true">
                <path
                  fill="currentColor"
                  d="M12 10.2v3.9h5.5c-.2 1.3-1.5 3.9-5.5 3.9-3.3 0-6-2.7-6-6s2.7-6 6-6c1.9 0 3.1.8 3.8 1.5l2.6-2.5C16.8 3.5 14.6 2.7 12 2.7 6.9 2.7 2.7 6.9 2.7 12s4.2 9.3 9.3 9.3c5.4 0 9-3.8 9-9.1 0-.6-.1-1.1-.2-1.6H12Z"
                />
              </svg>
              {t("continueWithGoogle")}
            </a>

            <div className="flex items-center gap-3">
              <span className="h-px flex-1 bg-slate-200" />
              <span className="text-xs uppercase tracking-wide text-slate-400">
                {t("or")}
              </span>
              <span className="h-px flex-1 bg-slate-200" />
            </div>

            <button
              type="button"
              disabled
              className="inline-flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-lg border border-[#4267B2] bg-[#4267B2] px-6 py-3 text-sm font-medium text-white opacity-90"
            >
              <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true">
                <path
                  fill="currentColor"
                  d="M13.5 8H16V5h-2.5C10.5 5 9 6.8 9 9.6V12H7v3h2v4h3v-4h2.4l.6-3H12V9.9c0-1 .3-1.9 1.5-1.9Z"
                />
              </svg>
              {t("continueWithFacebook")}
            </button>
            <p className="text-center text-xs text-slate-400">{t("facebookComingSoon")}</p>

            <div className="space-y-1.5 border-t border-slate-100 pt-4 text-center text-xs text-slate-500">
              <p>Secure sign-in with Google OAuth. We never store your Google password.</p>
              <p>
                By continuing, you agree to our{" "}
                <Link href="/terms" className="text-primary hover:underline">
                  Terms
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="text-primary hover:underline">
                  Privacy Policy
                </Link>
                .
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
