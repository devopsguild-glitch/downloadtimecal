export interface RankMathSEO {
  title?: string;
  description?: string;
  robots?: string[];
  canonicalUrl?: string;
  openGraph?: {
    title?: string;
    description?: string;
    image?: { sourceUrl: string };
  };
  jsonLd?: {
    raw: string;
  };
}

export interface Post {
  title: string;
  slug: string;
  excerpt: string;
  date: string;
  content?: string;
  categories?: {
    nodes: Category[];
  };
  seo?: RankMathSEO;
}

export interface Category {
  name: string;
  slug: string;
  count: number;
  seo?: RankMathSEO;
}

export interface WPPage {
  title: string;
  slug: string;
  content: string;
  date: string;
  excerpt?: string;
  seo?: RankMathSEO;
}
