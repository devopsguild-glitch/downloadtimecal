import type { Metadata } from "next";
import BandwidthCalculator from "@/components/BandwidthCalculator";
import ToolArticle from "@/components/ToolArticle";
import { getPageBySlug } from "@/lib/wordpress";

export const revalidate = 60;

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://downloadtimecal.com";
const PAGE_URL = `${BASE}/bandwidth-calculator`;

export const metadata: Metadata = {
  title: "Bandwidth Calculator — Required Speed & Data Usage",
  description:
    "Calculate the internet speed you need to transfer a file in a given time, or find out how much data any connection will use over a period. Free and instant.",
  keywords: [
    "bandwidth calculator",
    "required internet speed",
    "data usage calculator",
    "how much bandwidth do I need",
    "internet speed for streaming",
    "network bandwidth calculator",
  ],
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "Bandwidth Calculator — DownloadtimeCal",
    description: "Calculate required bandwidth or total data usage. Free, instant, no sign-up.",
    url: PAGE_URL,
    type: "website",
  },
};

const toolSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Bandwidth Calculator",
  applicationCategory: "UtilitiesApplication",
  operatingSystem: "Web",
  url: PAGE_URL,
  description:
    "Calculate the minimum bandwidth needed to transfer a file in a given time, or calculate total data usage at a given speed.",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  featureList: [
    "Required speed calculator",
    "Data usage calculator",
    "Supports all speed and size units",
    "Connection type comparison table",
  ],
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What bandwidth do I need for 4K streaming?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Netflix recommends 25 Mbps for 4K Ultra HD streaming. YouTube 4K requires around 20 Mbps. For multiple simultaneous 4K streams, 50–100 Mbps is recommended.",
      },
    },
    {
      "@type": "Question",
      name: "How do I calculate required bandwidth?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Required bandwidth (bps) = File size in bits ÷ Transfer time in seconds. For example, to transfer 4 GB in 30 minutes: (4,000,000,000 × 8) ÷ 1800 = 17,777,778 bps ≈ 17.78 Mbps.",
      },
    },
    {
      "@type": "Question",
      name: "What is the difference between bandwidth and internet speed?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Bandwidth is the maximum data capacity of a connection (like a pipe's diameter), while speed is how fast data actually flows through it. In practice the terms are often used interchangeably to mean download/upload rate in Mbps.",
      },
    },
    {
      "@type": "Question",
      name: "How much data does streaming use per hour?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "At 100 Mbps continuously for 1 hour: (100,000,000 × 3600) ÷ 8 = 45 GB. In practice streaming services compress video, so actual usage is much lower — Netflix 4K uses about 7 GB per hour, HD uses about 3 GB per hour.",
      },
    },
  ],
};

const howToSchema = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How to Calculate Required Bandwidth",
  description: "Find the minimum internet speed needed to transfer a file in a specific time.",
  step: [
    { "@type": "HowToStep", name: "Select mode", text: "Choose 'Required Speed' to find the bandwidth needed, or 'Data Usage' to calculate total data transferred." },
    { "@type": "HowToStep", name: "Enter values", text: "For Required Speed: enter file size and desired transfer time. For Data Usage: enter connection speed and duration." },
    { "@type": "HowToStep", name: "Read the result", text: "The required bandwidth or total data used is shown instantly." },
  ],
};

export default async function BandwidthCalculatorPage() {
  const article = await getPageBySlug("bandwidth-calculator").catch(() => null);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(toolSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }} />
      <div>
        <BandwidthCalculator />
        <ToolArticle page={article} />
      </div>
    </>
  );
}
