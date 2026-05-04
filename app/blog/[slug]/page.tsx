import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Comments } from "@/components/Comments";
import { MarkdownRenderer } from "@/components/MarkdownRenderer";
import { PageHeader } from "@/components/ui/PageHeader";
import { getAllBlogs, getBlogBySlug } from "@/lib/blogs";

export function generateStaticParams() {
  return getAllBlogs().map((blog) => ({ slug: blog.slug }));
}

export function generateMetadata({
  params
}: {
  params: { slug: string };
}): Metadata {
  const blog = getBlogBySlug(params.slug);

  if (!blog) {
    return {
      title: "Blog not found"
    };
  }

  return {
    title: blog.title,
    description: blog.description,
    alternates: {
      canonical: `/blog/${blog.slug}`
    },
    openGraph: {
      title: blog.title,
      description: blog.description,
      type: "article",
      publishedTime: blog.createdAt,
      url: `/blog/${blog.slug}`
    }
  };
}

export default async function BlogDetailPage({
  params
}: {
  params: { slug: string };
}) {
  const blog = getBlogBySlug(params.slug);

  if (!blog) {
    notFound();
  }

  return (
    <article className="space-y-8">
      <PageHeader eyebrow="Article" title={blog.title} description={blog.description}>
        <div className="flex flex-wrap items-center gap-2 text-sm text-zinc-500">
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
      </PageHeader>

      <MarkdownRenderer content={blog.content} />
      {/* <Comments slug={blog.slug} /> */}
    </article>
  );
}
