You are building a **Next.js headless application template**.

The goal is to create a reusable base where:

* The **application UI lives in Next.js**
* The **blog content is managed by WordPress (headless CMS)**

WordPress is already installed and exposes a GraphQL API.

GraphQL endpoint:

https://YOUR_WORDPRESS_DOMAIN/graphql

The Next.js app will be deployed on **Vercel**.

For now the application only needs:

1. One tool page (Download Time Calculator)
2. A blog powered by WordPress

TECH STACK

Next.js 14+ using App Router
Typescript
TailwindCSS
WordPress with WPGraphQL
Deployment ready for Vercel

PROJECT STRUCTURE

Create the following structure:

src
app
app/page.tsx
app/blog/page.tsx
app/blog/[slug]/page.tsx

components
components/Layout.tsx
components/Navbar.tsx
components/DownloadCalculator.tsx
components/BlogCard.tsx

lib
lib/wordpress.ts

types
types/wordpress.ts

ENVIRONMENT VARIABLES

Use:

.env.local

Add:

WP_API_URL=https://YOUR_WORDPRESS_DOMAIN/graphql

WORDPRESS API CLIENT

Create a reusable helper:

src/lib/wordpress.ts

The helper should:

* send POST requests to the GraphQL endpoint
* accept query and variables
* return JSON data
* support Next.js caching with revalidate

DOWNLOAD TIME CALCULATOR

The homepage (/) should contain a **Download Time Calculator tool**.

Create a component:

components/DownloadCalculator.tsx

The calculator should allow users to input:

File Size
Internet Speed

Support units:

File Size
KB
MB
GB
TB

Speed
Kbps
Mbps
Gbps

The calculator must compute the estimated download time and display:

Seconds
Minutes
Hours

Use React state to update the result instantly when inputs change.

BLOG PAGE

Create:

/blog

This page fetches posts from WordPress using GraphQL.

Query:

query GetPosts {
posts(first: 10) {
nodes {
title
slug
excerpt
date
}
}
}

Display:

* title
* excerpt
* link to blog post page

BLOG POST PAGE

Create dynamic route:

/blog/[slug]

Fetch post using slug.

Query:

query PostBySlug($slug: ID!) {
post(id: $slug, idType: SLUG) {
title
content
date
}
}

Render HTML content using dangerouslySetInnerHTML.

STATIC GENERATION

Enable incremental static regeneration.

Use:

revalidate = 60

Also implement:

generateStaticParams()

to prebuild blog post pages.

LAYOUT

Create a shared layout.

Layout includes:

Navbar
Main content area
Footer

Navbar should contain links:

Home
Blog

TAILWIND STYLING

Use TailwindCSS for simple clean styling.

The calculator should be centered and visually clear.

DEPLOYMENT

The project must run correctly when deployed on Vercel.

Server-side fetching should be used to avoid CORS issues.

DELIVERABLE

Generate the full working Next.js project including all files and components described above.
