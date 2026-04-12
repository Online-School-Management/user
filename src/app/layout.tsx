import type { Metadata } from "next";
import Script from "next/script";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { APP_BASE_URL, SITE_NAME, DEFAULT_OG_IMAGE_PATH } from "@/constants";
import { GlobalAppBackdrop } from "@/components/layout/GlobalAppBackdrop";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const defaultTitle = "Tip-Top Education";
const defaultDescription = "Computer Training School";

export const metadata: Metadata = {
  metadataBase: new URL(APP_BASE_URL),
  title: defaultTitle,
  description: defaultDescription,
  robots: { index: true, follow: true },
  alternates: { canonical: APP_BASE_URL },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: defaultTitle,
    description: defaultDescription,
    images: [{ url: DEFAULT_OG_IMAGE_PATH, width: 1200, height: 630, alt: SITE_NAME }],
  },
  twitter: {
    card: "summary_large_image",
    title: defaultTitle,
    description: defaultDescription,
    images: [DEFAULT_OG_IMAGE_PATH],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} relative flex min-h-screen flex-col antialiased`}
      >
        <GlobalAppBackdrop />
        <div className="relative z-10 flex min-h-screen min-w-0 flex-1 flex-col">
          {children}

          {/* Telegram */}
          <Script src="https://elfsightcdn.com/platform.js" async/>
          <div
            className="elfsight-app-971a4d5a-9d0d-4820-868c-23115d2e3e68"
            data-elfsight-app-lazy
          />

          {/* Messanger */}
          <Script
            src="https://elfsightcdn.com/platform.js"
            strategy="lazyOnload"
          />
          <div
            className="elfsight-app-e436f6d5-42fe-42dd-8b5a-4514df24877a"
            data-elfsight-app-lazy
          />
        </div>
      </body>
    </html>
  );
}
