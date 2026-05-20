import Link from "next/link";
import type { BlogPost } from "@/models/blog";

type BlogCardProps = {
  blog: Pick<BlogPost, "slug" | "title" | "description" | "createdAt" | "readTime">;
};

export function BlogCard({ blog }: BlogCardProps) {
  return (
    <article className="border-t border-line pt-6">
      <Link href={`/blogs/${blog.slug}`} className="group block space-y-2">
        <h2 className="text-2xl font-semibold text-ink group-hover:underline">
          {blog.title}
        </h2>
        <p className="leading-7 text-zinc-700">{blog.description}</p>
        <div className="flex flex-wrap gap-2 text-sm text-zinc-500">
          <time dateTime={blog.createdAt}>
            {new Date(blog.createdAt).toLocaleDateString("en", {
              month: "long",
              day: "numeric",
              year: "numeric"
            })}
          </time>
          <span>-</span>
          <span>{blog.readTime}</span>
        </div>
      </Link>
    </article>
  );
}
