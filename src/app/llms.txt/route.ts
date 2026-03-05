import { getPosts } from "@/lib/wordpress";

export const revalidate = 3600;

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://downloadtimecal.com";

export async function GET() {
  const posts = await getPosts().catch(() => []);

  const postLines = posts
    .map((p) => {
      const excerpt = p.excerpt?.replace(/<[^>]+>/g, "").slice(0, 120).trim() ?? "";
      return `- [${p.title}](${BASE}/blog/${p.slug})${excerpt ? `: ${excerpt}` : ""}`;
    })
    .join("\n");

  const body = `# DownloadtimeCal

> Free online calculators for download time, upload time, and bandwidth. Instant results, no sign-up required.

## Tools

- [Download Time Calculator](${BASE}/): Estimate how long any file will take to download. Supports KB, MB, GB, TB and Kbps, Mbps, Gbps. Formula: time = file_size_in_bits ÷ speed_in_bps.
- [Upload Time Calculator](${BASE}/upload-calculator): Calculate upload time for any file size and upload speed. Includes quick presets for photos, videos, and backups.
- [Bandwidth Calculator](${BASE}/bandwidth-calculator): Find the minimum internet speed needed to transfer a file in a given time, or calculate total data usage over a period.

## Blog

- [Blog Index](${BASE}/blog): Articles about internet speeds, file transfer time, and networking concepts.
${postLines}

## Site Pages

- [About Us](${BASE}/about-us)
- [Contact Us](${BASE}/contact-us)
- [Privacy Policy](${BASE}/privacy-policy)

## Key Facts

- All calculators run entirely in the browser — no data is sent to any server.
- Formula used: Download/Upload Time (seconds) = (File Size in bytes × 8) ÷ Speed in bps
- 1 byte = 8 bits. Internet speeds are in bits (Mbps), file sizes are in bytes (MB/GB).
- Sitemap: ${BASE}/sitemap.xml
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  });
}
