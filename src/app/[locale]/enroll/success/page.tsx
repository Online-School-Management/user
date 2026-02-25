import type { Metadata } from "next";
import { Suspense } from "react";
import { setRequestLocale } from "next-intl/server";
import { EnrollSuccessContent } from "@/components/enroll/EnrollSuccessContent";

type Props = { params: Promise<{ locale: string }> };

export const metadata: Metadata = {
  title: "Enrollment Submitted | Tip-Top Education",
  description: "Enrollment request submitted successfully.",
};

function EnrollSuccessFallback() {
  return (
    <div className="min-h-full px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl">
        <div className="animate-pulse rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-col items-center gap-4">
            <div className="h-14 w-14 rounded-full bg-slate-200" />
            <div className="h-5 w-48 rounded bg-slate-200" />
            <div className="h-4 w-64 rounded bg-slate-200" />
          </div>
          <div className="mt-8 flex justify-center gap-3">
            <div className="h-10 w-36 rounded-lg bg-slate-200" />
            <div className="h-10 w-28 rounded-lg bg-slate-200" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default async function EnrollmentSuccessPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <Suspense fallback={<EnrollSuccessFallback />}>
      <EnrollSuccessContent />
    </Suspense>
  );
}
