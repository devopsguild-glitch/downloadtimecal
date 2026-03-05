import { getPageBySlug, getAllPageSlugs, getPageSeo, buildMetadata } from "@/lib/wordpress";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export const revalidate = 60;

export async function generateStaticParams() {
  const pages = await getAllPageSlugs().catch(() => []);
  return pages.map(({ slug }) => ({ slug }));
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const [page, seo] = await Promise.all([getPageBySlug(slug).catch(() => null), getPageSeo(slug)]);
  if (!page) return {};
  const fallbackDesc = page.excerpt?.replace(/<[^>]+>/g, "").slice(0, 160) ?? "";
  return buildMetadata(seo, { title: page.title, description: fallbackDesc });
}

export default async function WordPressPage({ params }: PageProps) {
  const { slug } = await params;
  const [page, seo] = await Promise.all([getPageBySlug(slug).catch(() => null), getPageSeo(slug)]);
  if (!page) notFound();

  return (
    <>
      {seo?.jsonLd?.raw && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: seo.jsonLd.raw }} />
      )}
      <article className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm p-6 sm:p-10">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-8">{page.title}</h1>
        <div
          className="prose prose-gray dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: page.content }}
        />
      </article>
    </>
  );
}
