import type { Metadata } from "next";
import { BlogCard } from "@/components/BlogCard";
import { PageHeader } from "@/components/ui/PageHeader";
import { Pagination } from "@/components/ui/Pagination";
import { getPaginatedBlogs } from "@/lib/blogs";

export const metadata: Metadata = {
  title: "Blog",
  description: "Markdown articles about web development and product building."
};

export const dynamic = "force-dynamic";

type BlogsPageProps = {
  searchParams?: {
    page?: string;
  };
};

export default async function BlogsPage({ searchParams }: BlogsPageProps) {
  const page = Number(searchParams?.page ?? "1");
  const { blogs, total, totalPages } = await getPaginatedBlogs(page, 6);

  return (
    <div className="space-y-10">
      <PageHeader
        eyebrow="Writing"
        title="Blog"
        description="Medium-style engineering essays, portfolio notes, and field reports from the systems I am building."
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

      <div className="flex items-center justify-between text-sm text-zinc-500">
        <span>{total} published {total === 1 ? "post" : "posts"}</span>
      </div>

      <Pagination page={Number.isFinite(page) && page > 0 ? page : 1} totalPages={totalPages} basePath="/blogs" />
    </div>
  );
}
