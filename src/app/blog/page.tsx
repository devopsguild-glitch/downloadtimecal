import { getPosts } from "@/lib/wordpress";
import BlogCard from "@/components/BlogCard";
import type { Metadata } from "next";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Blog",
  description: "Read the latest articles and updates.",
};

export default async function BlogPage() {
  const posts = await getPosts();

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Blog</h1>
      {posts.length === 0 ? (
        <p className="text-gray-500">No posts found.</p>
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
  );
}
