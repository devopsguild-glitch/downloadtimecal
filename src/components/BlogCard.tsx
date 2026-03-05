import Link from "next/link";
import type { Post } from "@/types/wordpress";

type BlogCardProps = Pick<Post, "title" | "slug" | "excerpt" | "date" | "categories">;

export default function BlogCard({ title, slug, excerpt, date, categories }: BlogCardProps) {
  const formatted = new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <article className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center gap-2 flex-wrap mb-2">
        <span className="text-xs text-gray-400">{formatted}</span>
        {categories?.nodes.map((cat) => (
          <Link
            key={cat.slug}
            href={`/category/${cat.slug}`}
            className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full hover:bg-blue-100 transition-colors"
          >
            {cat.name}
          </Link>
        ))}
      </div>
      <h2 className="text-xl font-semibold text-gray-900 mb-3">
        <Link href={`/blog/${slug}`} className="hover:text-blue-600 transition-colors">
          {title}
        </Link>
      </h2>
      <div
        className="text-gray-600 text-sm line-clamp-3 mb-4"
        dangerouslySetInnerHTML={{ __html: excerpt }}
      />
      <Link href={`/blog/${slug}`} className="text-sm text-blue-600 font-medium hover:underline">
        Read more &rarr;
      </Link>
    </article>
  );
}
