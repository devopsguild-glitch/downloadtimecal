import type { Post, Category, WPPage, RankMathSEO } from "@/types/wordpress";

const WP_API_URL = process.env.WP_API_URL as string;

// RankMath SEO fragment — requires RankMath plugin + WPGraphQL for RankMath SEO
const SEO_FRAGMENT = `
  seo {
    title
    description
    robots
    canonicalUrl
    openGraph {
      title
      description
      image { sourceUrl }
    }
    jsonLd { raw }
  }
`;

interface FetchOptions {
  query: string;
  variables?: Record<string, unknown>;
  revalidate?: number;
}

export async function fetchWordPress<T>({
  query,
  variables = {},
  revalidate = 60,
}: FetchOptions): Promise<T> {
  const res = await fetch(WP_API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables }),
    next: { revalidate },
  });

  if (!res.ok) {
    throw new Error(`WordPress API error: ${res.status}`);
  }

  return res.json() as Promise<T>;
}

// ─── Posts ────────────────────────────────────────────────────────────────────

export async function getPosts(): Promise<Post[]> {
  const query = `
    query GetPosts {
      posts(first: 10) {
        nodes {
          title slug excerpt date
          categories { nodes { name slug } }
        }
      }
    }
  `;
  const data = await fetchWordPress<{ data: { posts: { nodes: Post[] } } }>({ query });
  return data.data.posts.nodes;
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const query = `
    query PostBySlug($slug: ID!) {
      post(id: $slug, idType: SLUG) {
        title slug content date
        categories { nodes { name slug } }
        ${SEO_FRAGMENT}
      }
    }
  `;
  const data = await fetchWordPress<{ data: { post: Post | null } }>({
    query,
    variables: { slug },
  });
  return data.data.post;
}

export async function getAllPostSlugs(): Promise<{ slug: string }[]> {
  const query = `
    query GetAllSlugs {
      posts(first: 100) { nodes { slug } }
    }
  `;
  const data = await fetchWordPress<{ data: { posts: { nodes: { slug: string }[] } } }>({ query });
  return data.data.posts.nodes;
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
  const data = await fetchWordPress<{ data: { categories: { nodes: Category[] } } }>({ query });
  return data.data.categories.nodes;
}

export async function getPostsByCategory(slug: string): Promise<Post[]> {
  const query = `
    query PostsByCategory($slug: String!) {
      posts(first: 20, where: { categoryName: $slug }) {
        nodes {
          title slug excerpt date
          categories { nodes { name slug } }
        }
      }
    }
  `;
  const data = await fetchWordPress<{ data: { posts: { nodes: Post[] } } }>({
    query,
    variables: { slug },
  });
  return data.data.posts.nodes;
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const query = `
    query GetCategory($slug: ID!) {
      category(id: $slug, idType: SLUG) {
        name slug count
        ${SEO_FRAGMENT}
      }
    }
  `;
  const data = await fetchWordPress<{ data: { category: Category | null } }>({
    query,
    variables: { slug },
  });
  return data.data.category;
}

// ─── Pages ────────────────────────────────────────────────────────────────────

export async function getPageBySlug(slug: string): Promise<WPPage | null> {
  const query = `
    query PageBySlug($slug: ID!) {
      page(id: $slug, idType: SLUG) {
        title slug content date excerpt
        ${SEO_FRAGMENT}
      }
    }
  `;
  const data = await fetchWordPress<{ data: { page: WPPage | null } }>({
    query,
    variables: { slug },
  });
  return data.data.page;
}

export async function getAllPageSlugs(): Promise<{ slug: string }[]> {
  const query = `
    query GetAllPageSlugs {
      pages(first: 100) { nodes { slug } }
    }
  `;
  const data = await fetchWordPress<{ data: { pages: { nodes: { slug: string }[] } } }>({ query });
  return data.data.pages.nodes;
}

// ─── SEO helpers ─────────────────────────────────────────────────────────────

export function buildMetadata(seo: RankMathSEO | undefined, fallback: { title: string; description?: string }) {
  const title = seo?.title || fallback.title;
  const description = seo?.description || fallback.description || "";
  const ogImage = seo?.openGraph?.image?.sourceUrl;

  return {
    title,
    description,
    robots: seo?.robots?.join(", "),
    alternates: seo?.canonicalUrl ? { canonical: seo.canonicalUrl } : undefined,
    openGraph: {
      title: seo?.openGraph?.title || title,
      description: seo?.openGraph?.description || description,
      ...(ogImage ? { images: [{ url: ogImage }] } : {}),
    },
  };
}
