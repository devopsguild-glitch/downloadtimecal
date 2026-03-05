import { getPostsByCategory, getCategoryBySlug, getCategories, getCategorySeo, buildMetadata } from "@/lib/wordpress";
import BlogCard from "@/components/BlogCard";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export const revalidate = 60;

export async function generateStaticParams() {
  const categories = await getCategories().catch(() => []);
  return categories.map(({ slug }) => ({ slug }));
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const [category, seo] = await Promise.all([getCategoryBySlug(slug), getCategorySeo(slug)]);
  if (!category) return {};
  return buildMetadata(seo, {
    title: `${category.name} — Blog`,
    description: `Browse all posts in the ${category.name} category.`,
  });
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params;
  const [category, posts, seo] = await Promise.all([
    getCategoryBySlug(slug),
    getPostsByCategory(slug),
    getCategorySeo(slug),
  ]);

  if (!category) notFound();

  return (
    <>
      {seo?.jsonLd?.raw && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: seo.jsonLd.raw }} />
      )}
      <div>
        <div className="mb-8">
          <p className="text-sm text-blue-600 dark:text-blue-400 font-medium mb-1">Category</p>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">{category.name}</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            {category.count} post{category.count !== 1 ? "s" : ""}
          </p>
        </div>
        {posts.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">No posts found in this category.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2">
            {posts.map((post) => (
              <BlogCard key={post.slug} title={post.title} slug={post.slug}
                excerpt={post.excerpt} date={post.date} categories={post.categories} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
