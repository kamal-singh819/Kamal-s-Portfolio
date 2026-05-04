import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import type { BlogFrontmatter, BlogPost } from "@/models/blog";
import { calculateReadTime } from "@/lib/read-time";

const blogDirectory = path.join(process.cwd(), "data", "blogs");

export function getAllBlogs(): BlogPost[] {
  const filenames = fs.readdirSync(blogDirectory);

  return filenames
    .filter((filename) => filename.endsWith(".md"))
    .map((filename) => {
      const filePath = path.join(blogDirectory, filename);
      const raw = fs.readFileSync(filePath, "utf8");
      const { data, content } = matter(raw);
      const frontmatter = data as BlogFrontmatter;

      return {
        ...frontmatter,
        content,
        readTime: calculateReadTime(content)
      };
    })
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
}

export function getBlogBySlug(slug: string) {
  return getAllBlogs().find((blog) => blog.slug === slug) ?? null;
}

export function getBlogSlugs() {
  return getAllBlogs().map((blog) => blog.slug);
}
