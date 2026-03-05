import DownloadCalculator from "@/components/DownloadCalculator";
import ToolArticle from "@/components/ToolArticle";
import { getPageBySlug } from "@/lib/wordpress";

export const revalidate = 60;

export default async function HomePage() {
  // Create a WordPress page with slug "download-time-calculator" to populate this article
  const article = await getPageBySlug("download-time-calculator").catch(() => null);

  return (
    <div>
      <DownloadCalculator />
      <ToolArticle page={article} />
    </div>
  );
}
