import BandwidthCalculator from "@/components/BandwidthCalculator";
import ToolArticle from "@/components/ToolArticle";
import { getPageBySlug } from "@/lib/wordpress";
import type { Metadata } from "next";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Bandwidth Calculator",
  description:
    "Calculate the internet speed you need to transfer a file in a given time, or find out how much data you will use at a given speed.",
};

export default async function BandwidthCalculatorPage() {
  // Create a WordPress page with slug "bandwidth-calculator" to populate this article
  const article = await getPageBySlug("bandwidth-calculator").catch(() => null);

  return (
    <div>
      <BandwidthCalculator />
      <ToolArticle page={article} />
    </div>
  );
}
