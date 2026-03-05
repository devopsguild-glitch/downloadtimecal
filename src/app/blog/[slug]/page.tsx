import { getPostBySlug, getAllPostSlugs, buildMetadata } from "@/lib/wordpress";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";

export const revalidate = 60;

export async function generateStaticParams() {
  const slugs = await getAllPostSlugs();
  return slugs.map(({ slug }) => ({ slug }));
}

interface PageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const post = await getPostBySlug(params.slug);
  if (!post) return {};
  const fallbackDesc = post.excerpt?.replace(/<[^>]+>/g, "").slice(0, 160) ?? "";
  return buildMetadata(post.seo, { title: post.title, description: fallbackDesc });
}

export default async function BlogPostPage({ params }: PageProps) {
  const post = await getPostBySlug(params.slug);
  if (!post) notFound();

  const formatted = new Date(post.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <>
      {post.seo?.jsonLd?.raw && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: post.seo.jsonLd.raw }}
        />
      )}
      <article className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-10">
        <div className="flex items-center gap-2 flex-wrap mb-4">
          <span className="text-sm text-gray-400">{formatted}</span>
          {post.categories?.nodes.map((cat) => (
            <Link
              key={cat.slug}
              href={`/category/${cat.slug}`}
              className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full hover:bg-blue-100 transition-colors"
            >
              {cat.name}
            </Link>
          ))}
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8">{post.title}</h1>
        <div
          className="prose prose-gray max-w-none text-gray-700 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: post.content! }}
        />
      </article>
    </>
  );
}
