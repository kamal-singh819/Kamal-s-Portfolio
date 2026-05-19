import type { BlogPost, PaginatedBlogs } from "@/models/blog";
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

export async function getPaginatedBlogs(
  page = 1,
  pageSize = 6
): Promise<PaginatedBlogs> {
  noStore();
  const supabase = createServerSupabaseClient();
  const safePage = Number.isFinite(page) && page > 0 ? page : 1;
  const safePageSize = Number.isFinite(pageSize) && pageSize > 0 ? pageSize : 6;
  const from = (safePage - 1) * safePageSize;
  const to = from + safePageSize - 1;

  if (!supabase) {
    return {
      blogs: [],
      page: safePage,
      pageSize: safePageSize,
      total: 0,
      totalPages: 0
    };
  }

  const { data, error, count } = await supabase
    .from("blogs")
    .select("id, slug, title, description, content_html, published_at, created_at, updated_at", {
      count: "exact"
    })
    .order("published_at", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error || !data) {
    return {
      blogs: [],
      page: safePage,
      pageSize: safePageSize,
      total: 0,
      totalPages: 0
    };
  }

  const total = count ?? data.length;

  return {
    blogs: data.map((row) => mapBlog(row)),
    page: safePage,
    pageSize: safePageSize,
    total,
    totalPages: Math.ceil(total / safePageSize)
  };
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
