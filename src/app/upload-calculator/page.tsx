import type { Metadata } from "next";
import UploadCalculator from "@/components/UploadCalculator";
import ToolArticle from "@/components/ToolArticle";
import { getPageBySlug } from "@/lib/wordpress";

export const revalidate = 60;

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://downloadtimecal.com";
const PAGE_URL = `${BASE}/upload-calculator`;

export const metadata: Metadata = {
  title: "Upload Time Calculator — How Long Will Your Upload Take?",
  description:
    "Calculate how long any file will take to upload based on your upload speed. Supports KB, MB, GB, TB and Kbps, Mbps, Gbps. Includes presets for photos, videos, and backups.",
  keywords: [
    "upload time calculator",
    "how long to upload",
    "upload speed calculator",
    "file upload time",
    "YouTube upload time",
    "cloud backup time",
  ],
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "Upload Time Calculator — DownloadtimeCal",
    description: "Find out exactly how long your upload will take. Free, instant, no sign-up.",
    url: PAGE_URL,
    type: "website",
  },
};

const toolSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Upload Time Calculator",
  applicationCategory: "UtilitiesApplication",
  operatingSystem: "Web",
  url: PAGE_URL,
  description:
    "Calculate how long a file will take to upload based on file size and upload speed.",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  featureList: [
    "Supports KB, MB, GB, TB file sizes",
    "Supports Kbps, Mbps, Gbps upload speeds",
    "Quick presets for photos, videos, and backups",
    "Connection type upload speed reference table",
  ],
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Why is upload speed slower than download speed?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Most home internet connections are asymmetric — they prioritise download because most users consume more data than they upload. ADSL and Cable plans typically offer 10–20× lower upload than download speeds. Fiber connections are usually symmetric.",
      },
    },
    {
      "@type": "Question",
      name: "How long does it take to upload a 4K video to YouTube?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "A 1-hour 4K video is roughly 50–100 GB. On a 20 Mbps upload connection, that takes approximately 6–11 hours. On 100 Mbps it takes about 1–2 hours. Use our calculator for your exact file size and speed.",
      },
    },
    {
      "@type": "Question",
      name: "How do I calculate upload time?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Upload time (seconds) = File size in bits ÷ Upload speed in bps. Convert bytes to bits by multiplying by 8. For example, 500 MB (4,000,000,000 bits) on 20 Mbps (20,000,000 bps) = 200 seconds (3 minutes 20 seconds).",
      },
    },
    {
      "@type": "Question",
      name: "What is a good upload speed?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "For general use, 5–10 Mbps is sufficient. For uploading HD videos regularly, 25–50 Mbps is recommended. For 4K video or large cloud backups, 100 Mbps or faster makes a significant difference.",
      },
    },
  ],
};

const howToSchema = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How to Calculate Upload Time",
  description: "Calculate how long a file will take to upload using file size and upload speed.",
  step: [
    { "@type": "HowToStep", name: "Select a preset or enter file size", text: "Use a quick preset (Photo, Short video, 4K video, Backup) or type the file size and select its unit." },
    { "@type": "HowToStep", name: "Enter upload speed", text: "Enter your internet upload speed in Kbps, Mbps, or Gbps. Check your upload speed at fast.com or speedtest.net." },
    { "@type": "HowToStep", name: "Read the result", text: "The estimated upload time appears instantly in hours, minutes, and seconds." },
  ],
};

export default async function UploadCalculatorPage() {
  const article = await getPageBySlug("upload-time-calculator").catch(() => null);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(toolSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }} />
      <div>
        <UploadCalculator />
        <ToolArticle page={article} />
      </div>
    </>
  );
}
