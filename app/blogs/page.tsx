import type { Metadata } from "next";
import { BlogCard } from "@/components/BlogCard";
import { PageHeader } from "@/components/ui/PageHeader";
import { getAllBlogs } from "@/lib/blogs";

export const metadata: Metadata = {
  title: "Blog",
  description: "Markdown articles about web development and product building."
};

export const dynamic = "force-dynamic";

export default async function BlogsPage() {
  const blogs = await getAllBlogs();

  return (
    <div className="space-y-10">
      <PageHeader
        eyebrow="Writing"
        title="Blog"
        description="Notes on backend systems, web development, product engineering, and the ideas I want to remember."
      />

      <div className="space-y-6">
        {blogs.length ? (
          blogs.map((blog) => <BlogCard key={blog.slug} blog={blog} />)
        ) : (
          <p className="text-sm leading-6 text-zinc-600">
            No blog posts are published yet.
          </p>
        )}
      </div>
    </div>
  );
}
