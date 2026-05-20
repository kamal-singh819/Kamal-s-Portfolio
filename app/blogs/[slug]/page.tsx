import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AdminEditLink } from "@/components/blog/AdminEditLink";
import { BlogHtml } from "@/components/blog/BlogHtml";
import { PageHeader } from "@/components/ui/PageHeader";
import { getBlogBySlug } from "@/lib/blogs";

export const dynamic = "force-dynamic";

export async function generateMetadata({
    params
}: {
    params: { slug: string };
}): Promise<Metadata> {
    const blog = await getBlogBySlug(params.slug);

    if (!blog) {
        return {
            title: "Blog not found"
        };
    }

    return {
        title: blog.title,
        description: blog.description,
        alternates: {
            canonical: `/blogs/${blog.slug}`
        },
        openGraph: {
            title: blog.title,
            description: blog.description,
            type: "article",
            publishedTime: blog.createdAt,
            url: `/blogs/${blog.slug}`
        }
    };
}

export default async function BlogDetailPage({
    params
}: {
    params: { slug: string };
}) {
    const blog = await getBlogBySlug(params.slug);

    if (!blog) {
        notFound();
    }

    return (
        <article className="space-y-8">
            <PageHeader eyebrow="Article" title={blog.title} description={blog.description}>
                <div className="flex flex-wrap items-center justify-between gap-3">
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
                    <AdminEditLink />
                </div>
            </PageHeader>

            <BlogHtml contentHtml={blog.contentHtml} />
        </article>
    );
}
