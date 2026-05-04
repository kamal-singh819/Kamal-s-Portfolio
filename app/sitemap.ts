import type { MetadataRoute } from "next";
import { getAllBlogs } from "@/lib/blogs";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const staticRoutes = ["", "/about", "/projects", "/blogs"].map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date()
  }));
  const blogRoutes = getAllBlogs().map((blog) => ({
    url: `${siteUrl}/blog/${blog.slug}`,
    lastModified: new Date(blog.createdAt)
  }));

  return [...staticRoutes, ...blogRoutes];
}
