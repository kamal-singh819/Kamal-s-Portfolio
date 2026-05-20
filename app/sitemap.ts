import type { MetadataRoute } from "next";
import { getAllBlogs } from "@/lib/blogs";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const staticRoutes = ["", "/about", "/projects", "/blogs"].map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date()
  }));
  const blogs = await getAllBlogs();
  const blogRoutes = blogs.map((blog) => ({
    url: `${siteUrl}/blogs/${blog.slug}`,
    lastModified: new Date(blog.createdAt)
  }));

  return [...staticRoutes, ...blogRoutes];
}
