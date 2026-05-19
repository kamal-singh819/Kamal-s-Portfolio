"use client";

import dynamic from "next/dynamic";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { BlogHtml } from "@/components/blog/BlogHtml";
import { AuthButton } from "@/components/blog/AuthButton";
import supabaseClient from "@/lib/supabase/client";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { useAuthStore } from "@/store/auth";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

type EditableBlog = {
  id: string;
  slug: string;
  title: string;
  description: string;
  content_html: string;
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function AdminBlogEditor() {
  const router = useRouter();
  const { user, role, isReady, initialize } = useAuthStore();
  const [blogs, setBlogs] = useState<EditableBlog[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [contentHtml, setContentHtml] = useState("");
  const [status, setStatus] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const selectedBlog = useMemo(
    () => blogs.find((blog) => blog.id === selectedId) ?? null,
    [blogs, selectedId]
  );

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    if (isReady && user && role !== "admin") {
      router.replace("/blogs");
    }
  }, [isReady, role, router, user]);

  useEffect(() => {
    async function loadBlogs() {
      if (!hasSupabaseEnv() || role !== "admin") {
        return;
      }

      const { data } = await supabaseClient
        .from("blogs")
        .select("id, slug, title, description, content_html")
        .order("updated_at", { ascending: false });

      setBlogs((data as EditableBlog[] | null) ?? []);
    }

    loadBlogs();
  }, [role]);

  useEffect(() => {
    if (!selectedBlog) {
      return;
    }

    setTitle(selectedBlog.title);
    setSlug(selectedBlog.slug);
    setDescription(selectedBlog.description);
    setContentHtml(selectedBlog.content_html);
  }, [selectedBlog]);

  function startNewPost() {
    setSelectedId("");
    setTitle("");
    setSlug("");
    setDescription("");
    setContentHtml("");
    setStatus("");
  }

  async function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("");

    if (!user || role !== "admin") {
      setStatus("Only admin users can write or update blog posts.");
      return;
    }

    const cleanTitle = title.trim();
    const cleanSlug = slugify(slug || title);
    const cleanDescription = description.trim();

    if (!cleanTitle || !cleanSlug || !cleanDescription || !contentHtml.trim()) {
      setStatus("Title, slug, description, and content are required.");
      return;
    }

    setIsSaving(true);

    const payload = {
      title: cleanTitle,
      slug: cleanSlug,
      description: cleanDescription,
      content_html: contentHtml,
      author_id: user.id,
      published_at: new Date().toISOString()
    };

    const request = selectedId
      ? supabaseClient.from("blogs").update(payload).eq("id", selectedId)
      : supabaseClient.from("blogs").insert(payload).select("id").single();

    const { data, error } = await request;
    setIsSaving(false);

    if (error) {
      setStatus(error.message);
      return;
    }

    setStatus("Blog saved.");
    const savedId =
      selectedId || (data && "id" in data ? String(data.id) : selectedId);

    const { data: refreshedBlogs } = await supabaseClient
      .from("blogs")
      .select("id, slug, title, description, content_html")
      .order("updated_at", { ascending: false });

    setBlogs((refreshedBlogs as EditableBlog[] | null) ?? []);
    setSelectedId(savedId);
  }

  if (!isReady) {
    return <p className="text-sm text-zinc-600">Checking access...</p>;
  }

  if (!user) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-semibold text-ink">Admin Blog</h1>
        <p className="text-zinc-600">Login with an admin account to continue.</p>
        <AuthButton />
      </div>
    );
  }

  if (role !== "admin") {
    return <p className="text-sm text-zinc-600">Redirecting...</p>;
  }

  return (
    <div className="relative left-1/2 w-screen max-w-6xl -translate-x-1/2 space-y-8 px-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-zinc-500">
            Admin
          </p>
          <h1 className="mt-2 text-3xl font-semibold text-ink">Blog editor</h1>
        </div>
        <AuthButton />
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <form onSubmit={handleSave} className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <select
              value={selectedId}
              onChange={(event) => setSelectedId(event.target.value)}
              className="min-w-0 flex-1 rounded-md border border-line bg-white px-3 py-2 text-sm outline-none focus:border-zinc-400"
            >
              <option value="">New blog post</option>
              {blogs.map((blog) => (
                <option key={blog.id} value={blog.id}>
                  {blog.title}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={startNewPost}
              className="rounded-md border border-line px-4 py-2 text-sm font-medium text-ink"
            >
              New
            </button>
          </div>

          <input
            value={title}
            onChange={(event) => {
              setTitle(event.target.value);
              if (!selectedId) {
                setSlug(slugify(event.target.value));
              }
            }}
            placeholder="Title"
            className="w-full rounded-md border border-line bg-white px-3 py-2 text-sm outline-none focus:border-zinc-400"
          />
          <input
            value={slug}
            onChange={(event) => setSlug(slugify(event.target.value))}
            placeholder="slug"
            className="w-full rounded-md border border-line bg-white px-3 py-2 text-sm outline-none focus:border-zinc-400"
          />
          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Description"
            rows={3}
            className="w-full rounded-md border border-line bg-white px-3 py-2 text-sm outline-none focus:border-zinc-400"
          />

          <div className="overflow-hidden rounded-md border border-line bg-white">
            <ReactQuill
              theme="snow"
              value={contentHtml}
              onChange={setContentHtml}
              modules={{
                toolbar: [
                  [{ header: [1, 2, 3, false] }],
                  ["bold", "italic", "underline", "blockquote", "code-block"],
                  [{ list: "ordered" }, { list: "bullet" }],
                  ["link"],
                  ["clean"]
                ]
              }}
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={isSaving}
              className="rounded-md bg-ink px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
            >
              {isSaving ? "Saving..." : selectedId ? "Update blog" : "Publish blog"}
            </button>
            {status ? <p className="text-sm text-zinc-600">{status}</p> : null}
          </div>
        </form>

        <aside className="min-w-0 space-y-4">
          <div className="border-b border-line pb-4">
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-zinc-500">
              Preview
            </p>
            <h2 className="mt-2 text-3xl font-semibold text-ink">
              {title || "Untitled blog post"}
            </h2>
            {description ? (
              <p className="mt-3 leading-7 text-zinc-600">{description}</p>
            ) : null}
          </div>
          <BlogHtml
            contentHtml={contentHtml || "<p>Start writing to preview the post.</p>"}
          />
        </aside>
      </div>
    </div>
  );
}
