import type { MetadataRoute } from "next";
import { getAllPostsForSitemap, getAllPagesForSitemap, getCategories } from "@/lib/wordpress";

export const revalidate = 3600; // rebuild sitemap every hour

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://downloadtimecal.com";

const staticRoutes: MetadataRoute.Sitemap = [
  {
    url: BASE,
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: 1.0,
  },
  {
    url: `${BASE}/upload-calculator`,
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: 0.9,
  },
  {
    url: `${BASE}/bandwidth-calculator`,
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: 0.9,
  },
  {
    url: `${BASE}/blog`,
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: 0.8,
  },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, pages, categories] = await Promise.all([
    getAllPostsForSitemap().catch(() => []),
    getAllPagesForSitemap().catch(() => []),
    getCategories().catch(() => []),
  ]);

  const postUrls: MetadataRoute.Sitemap = posts.map(({ slug, modified }) => ({
    url: `${BASE}/blog/${slug}`,
    lastModified: new Date(modified),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const categoryUrls: MetadataRoute.Sitemap = categories.map(({ slug }) => ({
    url: `${BASE}/category/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  // Exclude WP pages whose slugs are tool pages (they live at their own routes)
  const toolSlugs = new Set(["download-time-calculator", "upload-time-calculator", "bandwidth-calculator"]);
  const pageUrls: MetadataRoute.Sitemap = pages
    .filter(({ slug }) => !toolSlugs.has(slug))
    .map(({ slug, modified }) => ({
      url: `${BASE}/${slug}`,
      lastModified: new Date(modified),
      changeFrequency: "monthly",
      priority: 0.5,
    }));

  return [...staticRoutes, ...postUrls, ...categoryUrls, ...pageUrls];
}
