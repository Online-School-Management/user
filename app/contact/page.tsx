import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact | Tip-Top Education",
  description: "Get in touch with us.",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen">
      <section className="border-b border-slate-200/80 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Contact
          </h1>
          <p className="mt-4 text-lg text-slate-600">
            Have a question or want to enroll? Reach out and we'll get back to
            you.
          </p>
          <div className="mt-12 rounded-2xl border border-slate-200 bg-slate-50/50 p-8 text-center text-slate-500">
            Contact form and details will be added here.
          </div>
        </div>
      </section>
    </div>
  );
}
