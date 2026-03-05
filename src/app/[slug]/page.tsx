import { getPageBySlug, getAllPageSlugs, buildMetadata } from "@/lib/wordpress";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export const revalidate = 60;

export async function generateStaticParams() {
  const pages = await getAllPageSlugs();
  return pages.map(({ slug }) => ({ slug }));
}

interface PageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const page = await getPageBySlug(params.slug);
  if (!page) return {};
  const fallbackDesc = page.excerpt?.replace(/<[^>]+>/g, "").slice(0, 160) ?? "";
  return buildMetadata(page.seo, { title: page.title, description: fallbackDesc });
}

export default async function WordPressPage({ params }: PageProps) {
  const page = await getPageBySlug(params.slug);
  if (!page) notFound();

  return (
    <>
      {page.seo?.jsonLd?.raw && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: page.seo.jsonLd.raw }}
        />
      )}
      <article className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-10">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8">{page.title}</h1>
        <div
          className="prose prose-gray max-w-none text-gray-700 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: page.content }}
        />
      </article>
    </>
  );
}
