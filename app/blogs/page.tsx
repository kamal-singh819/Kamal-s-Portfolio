import type { Metadata } from "next";
import { BlogCard } from "@/components/BlogCard";
import { PageHeader } from "@/components/ui/PageHeader";
import { getAllBlogs } from "@/lib/blogs";

export const metadata: Metadata = {
  title: "Blog",
  description: "Markdown articles about web development and product building."
};

export default function BlogsPage() {
  const blogs = getAllBlogs();

  return (
    <div className="space-y-10">
      <PageHeader
        eyebrow="Writing"
        title="Blog"
        description="Notes on backend systems, web development, product engineering, and the ideas I want to remember."
      />

      <div className="space-y-6">
        {blogs.map((blog) => (
          <BlogCard key={blog.slug} blog={blog} />
        ))}
      </div>
    </div>
  );
}
