import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Articles | Tip-Top Education",
  description: "Articles and resources for students and learners.",
};

export default function ArticlesPage() {
  return (
    <div className="min-h-screen">
      <section className="border-b border-slate-200/80 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Articles
          </h1>
          <p className="mt-4 text-lg text-slate-600">
            Tips, guides, and updates for your learning journey. More content
            coming soon.
          </p>
          <div className="mt-12 rounded-2xl border border-slate-200 bg-slate-50/50 p-8 text-center text-slate-500">
            No articles yet. Check back later.
          </div>
        </div>
      </section>
    </div>
  );
}
