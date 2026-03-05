import type { WPPage } from "@/types/wordpress";

interface Props {
  page: WPPage | null;
}

export default function ToolArticle({ page }: Props) {
  if (!page) return null;

  return (
    <article className="mt-10 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 sm:p-10">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">{page.title}</h2>
      <div
        className="prose prose-gray dark:prose-invert max-w-none"
        dangerouslySetInnerHTML={{ __html: page.content }}
      />
    </article>
  );
}
