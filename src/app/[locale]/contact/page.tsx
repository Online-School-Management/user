import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";
import { ContactView } from "@/components/contact/ContactView";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata" });
  return buildPageMetadata(t("contactTitle"), t("contactDescription"), locale, "contact");
}

export default async function ContactPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Contact");

  return (
    <div className="min-w-0 px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <div className="mx-auto min-w-0 max-w-6xl space-y-10 sm:space-y-12">
        <header className="min-w-0">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            {t("title")}
          </h1>
        </header>

        <ContactView />
      </div>
    </div>
  );
}
