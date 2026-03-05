import type { Post, Category, WPPage, RankMathSEO } from "@/types/wordpress";

const WP_API_URL = process.env.WP_API_URL ?? "";

interface FetchOptions {
  query: string;
  variables?: Record<string, unknown>;
  revalidate?: number;
}

interface GqlResponse<T> {
  data?: T;
  errors?: { message: string }[];
}

export async function fetchWordPress<T>({
  query,
  variables = {},
  revalidate = 60,
}: FetchOptions): Promise<T> {
  if (!WP_API_URL) throw new Error("WP_API_URL environment variable is not set");

  const res = await fetch(WP_API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables }),
    next: { revalidate },
  });

  if (!res.ok) throw new Error(`WordPress API error: ${res.status}`);

  const json: GqlResponse<T> = await res.json();

  if (!json.data) {
    throw new Error(
      json.errors?.map((e) => e.message).join(", ") ?? "Empty GraphQL response"
    );
  }

  return json.data;
}

// ─── Posts ────────────────────────────────────────────────────────────────────

export async function getPosts(): Promise<Post[]> {
  const query = `
    query GetPosts {
      posts(first: 10) {
        nodes { title slug excerpt date categories { nodes { name slug } } }
      }
    }
  `;
  const data = await fetchWordPress<{ posts: { nodes: Post[] } }>({ query });
  return data.posts.nodes;
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const query = `
    query PostBySlug($slug: ID!) {
      post(id: $slug, idType: SLUG) {
        title slug content date
        categories { nodes { name slug } }
      }
    }
  `;
  const data = await fetchWordPress<{ post: Post | null }>({ query, variables: { slug } });
  return data.post;
}

export async function getAllPostSlugs(): Promise<{ slug: string }[]> {
  const query = `
    query GetAllSlugs {
      posts(first: 100) { nodes { slug } }
    }
  `;
  const data = await fetchWordPress<{ posts: { nodes: { slug: string }[] } }>({ query });
  return data.posts.nodes;
}

export async function getAllPostsForSitemap(): Promise<{ slug: string; date: string; modified: string }[]> {
  const query = `
    query GetAllPostsForSitemap {
      posts(first: 100) { nodes { slug date modified } }
    }
  `;
  const data = await fetchWordPress<{ posts: { nodes: { slug: string; date: string; modified: string }[] } }>({ query });
  return data.posts.nodes;
}

export async function getAllPagesForSitemap(): Promise<{ slug: string; modified: string }[]> {
  const query = `
    query GetAllPagesForSitemap {
      pages(first: 100) { nodes { slug modified } }
    }
  `;
  const data = await fetchWordPress<{ pages: { nodes: { slug: string; modified: string }[] } }>({ query });
  return data.pages.nodes;
}

// ─── Categories ───────────────────────────────────────────────────────────────

export async function getCategories(): Promise<Category[]> {
  const query = `
    query GetCategories {
      categories(first: 50, where: { hideEmpty: true }) {
        nodes { name slug count }
      }
    }
  `;
  const data = await fetchWordPress<{ categories: { nodes: Category[] } }>({ query });
  return data.categories.nodes;
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const query = `
    query GetCategory($slug: ID!) {
      category(id: $slug, idType: SLUG) { name slug count }
    }
  `;
  const data = await fetchWordPress<{ category: Category | null }>({ query, variables: { slug } });
  return data.category;
}

export async function getPostsByCategory(slug: string): Promise<Post[]> {
  const query = `
    query PostsByCategory($slug: String!) {
      posts(first: 20, where: { categoryName: $slug }) {
        nodes { title slug excerpt date categories { nodes { name slug } } }
      }
    }
  `;
  const data = await fetchWordPress<{ posts: { nodes: Post[] } }>({ query, variables: { slug } });
  return data.posts.nodes;
}

// ─── Pages ────────────────────────────────────────────────────────────────────

export async function getPageBySlug(slug: string): Promise<WPPage | null> {
  const query = `
    query PageBySlug($slug: ID!) {
      page(id: $slug, idType: SLUG) { title slug content date excerpt }
    }
  `;
  const data = await fetchWordPress<{ page: WPPage | null }>({ query, variables: { slug } });
  return data.page;
}

export async function getAllPageSlugs(): Promise<{ slug: string }[]> {
  const query = `
    query GetAllPageSlugs {
      pages(first: 100) { nodes { slug } }
    }
  `;
  const data = await fetchWordPress<{ pages: { nodes: { slug: string }[] } }>({ query });
  return data.pages.nodes;
}

// ─── RankMath SEO (optional — requires RankMath + WPGraphQL for RankMath SEO) ─

const SEO_FIELDS = `
  seo {
    title description robots canonicalUrl
    openGraph { title description image { sourceUrl } }
    jsonLd { raw }
  }
`;

async function fetchSeo(
  type: "post" | "page" | "category",
  slug: string
): Promise<RankMathSEO | null> {
  const idType = type === "category" ? "SLUG" : "SLUG";
  const field = type === "post"
    ? `post(id: $slug, idType: SLUG)`
    : type === "page"
    ? `page(id: $slug, idType: SLUG)`
    : `category(id: $slug, idType: SLUG)`;

  const query = `
    query GetSeo($slug: ID!) {
      ${field} { ${SEO_FIELDS} }
    }
  `;

  try {
    const data = await fetchWordPress<Record<string, { seo?: RankMathSEO } | null>>({
      query,
      variables: { slug },
    });
    const node = data[type];
    return node?.seo ?? null;
  } catch {
    // RankMath WPGraphQL not active — degrade gracefully
    return null;
  }
}

export const getPostSeo      = (slug: string) => fetchSeo("post",     slug);
export const getPageSeo      = (slug: string) => fetchSeo("page",     slug);
export const getCategorySeo  = (slug: string) => fetchSeo("category", slug);

// ─── Metadata helper ─────────────────────────────────────────────────────────

export function buildMetadata(
  seo: RankMathSEO | null | undefined,
  fallback: { title: string; description?: string }
) {
  const title       = seo?.title       || fallback.title;
  const description = seo?.description || fallback.description || "";
  const ogImage     = seo?.openGraph?.image?.sourceUrl;

  return {
    title,
    description,
    ...(seo?.robots   ? { robots: seo.robots.join(", ") }           : {}),
    ...(seo?.canonicalUrl ? { alternates: { canonical: seo.canonicalUrl } } : {}),
    openGraph: {
      title:       seo?.openGraph?.title       || title,
      description: seo?.openGraph?.description || description,
      ...(ogImage ? { images: [{ url: ogImage }] } : {}),
    },
  };
}
