import type { BlogPost } from "@/models/blog";
import { calculateReadTime } from "@/lib/read-time";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { unstable_noStore as noStore } from "next/cache";

type BlogRow = {
  id: string;
  slug: string;
  title: string;
  description: string;
  content_html: string;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

function mapBlog(row: BlogRow): BlogPost {
  const contentHtml = row.content_html ?? "";
  const plainContent = contentHtml.replace(/<[^>]+>/g, " ");

  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    description: row.description,
    content: plainContent,
    contentHtml,
    createdAt: row.published_at ?? row.created_at,
    updatedAt: row.updated_at,
    readTime: calculateReadTime(plainContent)
  };
}

export async function getAllBlogs(): Promise<BlogPost[]> {
  noStore();
  const supabase = createServerSupabaseClient();

  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("blogs")
    .select("id, slug, title, description, content_html, published_at, created_at, updated_at")
    .order("published_at", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false });

  if (error || !data) {
    return [];
  }

  return data.map((row) => mapBlog(row));
}

export async function getBlogBySlug(slug: string) {
  noStore();
  const supabase = createServerSupabaseClient();

  if (!supabase) {
    return null;
  }

  const { data, error } = await supabase
    .from("blogs")
    .select("id, slug, title, description, content_html, published_at, created_at, updated_at")
    .eq("slug", slug)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return mapBlog(data);
}

export async function getBlogSlugs() {
  const blogs = await getAllBlogs();
  return blogs.map((blog) => blog.slug);
}
