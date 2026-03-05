import UploadCalculator from "@/components/UploadCalculator";
import ToolArticle from "@/components/ToolArticle";
import { getPageBySlug } from "@/lib/wordpress";
import type { Metadata } from "next";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Upload Time Calculator",
  description:
    "Calculate how long it will take to upload any file based on your upload speed. Supports KB, MB, GB, TB and Kbps, Mbps, Gbps.",
};

export default async function UploadCalculatorPage() {
  // Create a WordPress page with slug "upload-time-calculator" to populate this article
  const article = await getPageBySlug("upload-time-calculator").catch(() => null);

  return (
    <div>
      <UploadCalculator />
      <ToolArticle page={article} />
    </div>
  );
}
