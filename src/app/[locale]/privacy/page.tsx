import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { buildPageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ locale: string }> };

const title = "Privacy Policy | Tip-Top Education";
const description = "Privacy policy for Tip-Top Education.";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return buildPageMetadata(title, description, locale, "privacy");
}

export default async function PrivacyPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="min-h-full">
      <section className="border-b border-slate-200/80 px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto max-w-4xl space-y-8">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Privacy Policy for Tip-Top Education
            </h1>
            <p className="text-sm text-slate-500">Last Updated: February 23, 2026</p>
            <p className="text-sm text-slate-600">Website: https://www.tiptopeducation.net</p>
            <p className="text-sm text-slate-600">
              Contact Email: tt.tech.developer@gmail.com
            </p>
          </div>

          <p className="text-slate-700">
            At Tip-Top Education, we provide computer literacy and digital skills training for
            students aged 5 to 20 years. We are dedicated to protecting the privacy of our
            students and ensuring a safe online learning environment.
          </p>

          <div className="space-y-6 text-slate-700">
            <section className="space-y-2">
              <h2 className="text-xl font-semibold text-slate-900">1. Information Collection</h2>
              <p>We collect minimal data to provide a seamless learning experience:</p>
              <ul className="list-disc space-y-1 pl-6">
                <li>
                  Account Information: When you log in via Google, we receive your name, email
                  address, and profile picture.
                </li>
                <li>
                  Learning Activity: We track progress in computer basic lessons, typing scores,
                  and quiz results.
                </li>
              </ul>
            </section>

            <section className="space-y-2">
              <h2 className="text-xl font-semibold text-slate-900">2. How We Use Your Data</h2>
              <p>The information is used only for:</p>
              <ul className="list-disc space-y-1 pl-6">
                <li>Managing student accounts and personalizing the learning path.</li>
                <li>Recording achievements in computer literacy modules.</li>
                <li>
                  Improving our educational content for different age groups (5-20 years).
                </li>
              </ul>
            </section>

            <section className="space-y-2">
              <h2 className="text-xl font-semibold text-slate-900">
                3. Safety for Young Learners (Under 13)
              </h2>
              <p>For students under the age of 13, we ensure maximum safety:</p>
              <ul className="list-disc space-y-1 pl-6">
                <li>
                  We do not collect any offline contact information like home addresses or phone
                  numbers.
                </li>
                <li>No third-party advertisements are displayed on our platform.</li>
                <li>
                  We encourage parents to monitor the digital learning progress of their children.
                </li>
              </ul>
            </section>

            <section className="space-y-2">
              <h2 className="text-xl font-semibold text-slate-900">4. Data Deletion Policy</h2>
              <p>
                You have full control over your data. If you wish to delete your account and
                remove all personal information from our system:
              </p>
              <p>Please contact us via email at: tt.tech.developer@gmail.com</p>
              <p>
                Upon receiving your request, we will delete your account and all associated data
                within 7 business days.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-xl font-semibold text-slate-900">5. Security Measures</h2>
              <p>
                We use industry-standard security (SSL encryption and Laravel Sanctum) to protect
                your data. Your Google password is never stored on our servers.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-xl font-semibold text-slate-900">6. Contact Us</h2>
              <p>
                If you have any questions or concerns regarding this policy, please reach out to
                us:
              </p>
              <p>Email: tt.tech.developer@gmail.com</p>
              <p>Domain: tiptopeducation.net</p>
            </section>
          </div>
        </div>
      </section>
    </div>
  );
}
