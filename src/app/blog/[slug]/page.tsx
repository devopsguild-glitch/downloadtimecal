import { getPostBySlug, getAllPostSlugs, getPostSeo, buildMetadata } from "@/lib/wordpress";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";

export const revalidate = 60;

export async function generateStaticParams() {
  const slugs = await getAllPostSlugs().catch(() => []);
  return slugs.map(({ slug }) => ({ slug }));
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const [post, seo] = await Promise.all([getPostBySlug(slug).catch(() => null), getPostSeo(slug)]);
  if (!post) return {};
  const fallbackDesc = post.excerpt?.replace(/<[^>]+>/g, "").slice(0, 160) ?? "";
  return buildMetadata(seo, { title: post.title, description: fallbackDesc });
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const [post, seo] = await Promise.all([getPostBySlug(slug).catch(() => null), getPostSeo(slug)]);
  if (!post) notFound();

  const formatted = new Date(post.date).toLocaleDateString("en-US", {
    year: "numeric", month: "long", day: "numeric",
  });

  return (
    <>
      {seo?.jsonLd?.raw && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: seo.jsonLd.raw }} />
      )}
      <article className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm p-6 sm:p-10">
        <div className="flex items-center gap-2 flex-wrap mb-4">
          <span className="text-sm text-gray-400">{formatted}</span>
          {post.categories?.nodes.map((cat) => (
            <Link key={cat.slug} href={`/category/${cat.slug}`}
              className="text-xs bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors">
              {cat.name}
            </Link>
          ))}
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-8">{post.title}</h1>
        <div
          className="prose prose-gray dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: post.content ?? "" }}
        />
      </article>
    </>
  );
}
