import { getPostsByCategory, getCategoryBySlug, getCategories, buildMetadata } from "@/lib/wordpress";
import BlogCard from "@/components/BlogCard";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export const revalidate = 60;

export async function generateStaticParams() {
  const categories = await getCategories();
  return categories.map(({ slug }) => ({ slug }));
}

interface PageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const category = await getCategoryBySlug(params.slug);
  if (!category) return {};
  return buildMetadata(category.seo, {
    title: `${category.name} — Blog`,
    description: `Browse all posts in the ${category.name} category.`,
  });
}

export default async function CategoryPage({ params }: PageProps) {
  const [category, posts] = await Promise.all([
    getCategoryBySlug(params.slug),
    getPostsByCategory(params.slug),
  ]);

  if (!category) notFound();

  return (
    <>
      {category.seo?.jsonLd?.raw && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: category.seo.jsonLd.raw }}
        />
      )}
      <div>
        <div className="mb-8">
          <p className="text-sm text-blue-600 font-medium mb-1">Category</p>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{category.name}</h1>
          <p className="text-gray-500 mt-1">
            {category.count} post{category.count !== 1 ? "s" : ""}
          </p>
        </div>

        {posts.length === 0 ? (
          <p className="text-gray-500">No posts found in this category.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2">
            {posts.map((post) => (
              <BlogCard
                key={post.slug}
                title={post.title}
                slug={post.slug}
                excerpt={post.excerpt}
                date={post.date}
                categories={post.categories}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
