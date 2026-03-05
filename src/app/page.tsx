import type { Metadata } from "next";
import DownloadCalculator from "@/components/DownloadCalculator";
import ToolArticle from "@/components/ToolArticle";
import { getPageBySlug } from "@/lib/wordpress";

export const revalidate = 60;

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://downloadtimecal.com";

export const metadata: Metadata = {
  title: "Download Time Calculator — How Long Will Your Download Take?",
  description:
    "Instantly calculate how long any file will take to download. Enter your file size (KB, MB, GB, TB) and internet speed (Kbps, Mbps, Gbps) for an accurate estimate.",
  keywords: [
    "download time calculator",
    "how long to download",
    "download speed calculator",
    "file download time",
    "internet speed to download time",
    "Mbps download calculator",
  ],
  alternates: { canonical: BASE },
  openGraph: {
    title: "Download Time Calculator — DownloadtimeCal",
    description: "Find out exactly how long your download will take. Free, instant, no sign-up.",
    url: BASE,
    type: "website",
  },
};

const toolSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Download Time Calculator",
  applicationCategory: "UtilitiesApplication",
  operatingSystem: "Web",
  url: BASE,
  description:
    "Calculate how long a file will take to download based on file size and internet speed.",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  featureList: [
    "Supports KB, MB, GB, TB file sizes",
    "Supports Kbps, Mbps, Gbps speeds",
    "Instant real-time calculation",
    "Connection type reference table",
  ],
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How do I calculate download time?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Download time (seconds) = File size in bits ÷ Speed in bps. Convert the file size to bits by multiplying bytes by 8. For example, a 1 GB file (8,000,000,000 bits) on a 100 Mbps (100,000,000 bps) connection takes 80 seconds.",
      },
    },
    {
      "@type": "Question",
      name: "How long does it take to download 1 GB on 100 Mbps?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "1 GB on 100 Mbps takes approximately 80 seconds (1 minute 20 seconds). The formula is: (1,000,000,000 bytes × 8 bits) ÷ 100,000,000 bps = 80 seconds.",
      },
    },
    {
      "@type": "Question",
      name: "How do I convert Mbps to MB/s?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Divide Mbps by 8 to get MB/s. For example, 100 Mbps ÷ 8 = 12.5 MB/s. This is because 1 byte equals 8 bits.",
      },
    },
    {
      "@type": "Question",
      name: "Why is my actual download slower than my internet speed?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Actual download speeds are often lower than advertised due to network congestion, server limits, Wi-Fi signal quality, and overhead from the TCP/IP protocol. Expect 60–90% of your advertised speed in practice.",
      },
    },
    {
      "@type": "Question",
      name: "How long does it take to download 10 GB on 1 Gbps?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "10 GB on 1 Gbps takes approximately 80 seconds. Formula: (10,000,000,000 × 8) ÷ 1,000,000,000 = 80 seconds.",
      },
    },
  ],
};

const howToSchema = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How to Calculate Download Time",
  description: "Calculate how long a file will take to download using file size and internet speed.",
  step: [
    { "@type": "HowToStep", name: "Enter file size", text: "Type the file size in the first field and select the unit (KB, MB, GB or TB)." },
    { "@type": "HowToStep", name: "Enter download speed", text: "Enter your internet download speed and select the unit (Kbps, Mbps or Gbps). You can find your speed at fast.com or speedtest.net." },
    { "@type": "HowToStep", name: "Read the result", text: "The estimated download time appears instantly in hours, minutes, and seconds." },
  ],
};

export default async function HomePage() {
  const article = await getPageBySlug("download-time-calculator").catch(() => null);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(toolSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }} />
      <div>
        <DownloadCalculator />
        <ToolArticle page={article} />
      </div>
    </>
  );
}
