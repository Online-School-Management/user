import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero - banner image with overlay text from image */}
      <section className="relative min-h-[420px] border-b border-slate-200/80 overflow-hidden sm:min-h-[480px]">
        <Image
          src="/hero-banner.png"
          alt="Tip - Top Education"
          fill
          className="object-cover object-center"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-primary/80" aria-hidden />
        <div className="relative mx-auto flex min-h-[420px] max-w-4xl flex-col items-center justify-center px-4 py-20 text-center text-white sm:min-h-[480px] sm:py-28">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Tip - Top Education
          </h1>
          <p className="mt-6 text-lg font-light sm:text-xl">
            Learn today,
            <br />
            Brighten in decoding
            <br />
            Your dreams tomorrow.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/contact"
              className="rounded-full bg-secondary px-6 py-3 text-sm font-semibold text-white shadow-sm transition-opacity hover:opacity-90"
            >
              Get in touch
            </Link>
            <Link
              href="/articles"
              className="rounded-full border-2 border-white bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/20"
            >
              Read articles
            </Link>
          </div>
          <div className="mt-12 space-y-1 text-sm">
            <p>
              <a href="tel:09988658887" className="hover:underline">
                09988658887
              </a>
            </p>
            <p>
              <a
                href="mailto:info.tiptopeducation@gmail.com"
                className="hover:underline"
              >
                info.tiptopeducation@gmail.com
              </a>
            </p>
          </div>
        </div>
      </section>

      {/* Features teaser */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center text-2xl font-semibold text-slate-900 sm:text-3xl">
            Why choose us
          </h2>
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="text-2xl font-semibold text-primary">Courses</div>
              <p className="mt-2 text-slate-600">
                Structured courses across subjects, designed for clear learning
                outcomes.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="text-2xl font-semibold text-secondary">
                Teachers
              </div>
              <p className="mt-2 text-slate-600">
                Experienced educators who support your progress every step of
                the way.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:col-span-2 lg:col-span-1">
              <div className="text-2xl font-semibold text-primary">
                Community
              </div>
              <p className="mt-2 text-slate-600">
                Learn alongside others and stay motivated with a supportive
                community.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl space-y-2 text-center text-sm text-slate-500">
          <p>
            <a href="tel:09988658887" className="text-primary hover:underline">
              09988658887
            </a>
            {" · "}
            <a
              href="mailto:info.tiptopeducation@gmail.com"
              className="text-primary hover:underline"
            >
              info.tiptopeducation@gmail.com
            </a>
          </p>
          <p>© {new Date().getFullYear()} TipTop Education. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
