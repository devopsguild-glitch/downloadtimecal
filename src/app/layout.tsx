import type { Metadata } from "next";
import "./globals.css";
import Layout from "@/components/Layout";

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://downloadtimecal.com";

export const metadata: Metadata = {
  metadataBase: new URL(BASE),
  title: {
    default: "DownloadtimeCal — Free Download, Upload & Bandwidth Calculator",
    template: "%s — DownloadtimeCal",
  },
  description:
    "Free online calculators for download time, upload time, and bandwidth. Instant results with no sign-up. Supports Kbps, Mbps, Gbps and KB, MB, GB, TB.",
  keywords: [
    "download time calculator",
    "upload time calculator",
    "bandwidth calculator",
    "internet speed calculator",
    "file transfer time",
    "how long to download",
    "Mbps to MB/s",
  ],
  authors: [{ name: "DownloadtimeCal" }],
  creator: "DownloadtimeCal",
  publisher: "DownloadtimeCal",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  openGraph: {
    type: "website",
    siteName: "DownloadtimeCal",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    site: "@downloadtimecal",
  },
  alternates: { canonical: BASE },
  // ── Google site verification ─────────────────────────────────────────────
  // Set GOOGLE_SITE_VERIFICATION in Vercel environment variables
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
};

// ── Global JSON-LD schemas ───────────────────────────────────────────────────
const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "DownloadtimeCal",
  url: BASE,
  description:
    "Free online calculators for download time, upload time, and bandwidth.",
  potentialAction: {
    "@type": "SearchAction",
    target: { "@type": "EntryPoint", urlTemplate: `${BASE}/blog?s={search_term_string}` },
    "query-input": "required name=search_term_string",
  },
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "DownloadtimeCal",
  url: BASE,
  logo: `${BASE}/icon.png`,
  sameAs: [],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Anti-flash dark mode */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');if(t==='dark'||(t===null&&window.matchMedia('(prefers-color-scheme: dark)').matches)){document.documentElement.classList.add('dark')}}catch(e){}})()`,
          }}
        />
        {/* Global structured data */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} />
      </head>
      <body className="bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white">
        <Layout>{children}</Layout>
      </body>
    </html>
  );
}
