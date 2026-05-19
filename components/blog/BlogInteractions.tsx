"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import supabaseClient from "@/lib/supabase/client";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { useAuthStore } from "@/store/auth";
import type { Comment } from "@/models/blog";
import { AuthButton } from "@/components/blog/AuthButton";

type CommentRow = {
  id: string;
  blog_id: string;
  body: string;
  parent_id: string | null;
  created_at: string;
  users:
  | { display_name: string | null; email: string | null }
  | { display_name: string | null; email: string | null }[]
  | null;
};

function mapComment(row: CommentRow): Comment {
  const commentUser = Array.isArray(row.users) ? row.users[0] : row.users;

  return {
    id: row.id,
    blogId: row.blog_id,
    name:
      commentUser?.display_name ??
      commentUser?.email?.split("@")[0] ??
      "Reader",
    comment: row.body,
    parentId: row.parent_id,
    createdAt: row.created_at
  };
}

export function BlogInteractions({ blogId }: { blogId: string }) {
  const { user, isReady, initialize } = useAuthStore();
  const [comments, setComments] = useState<Comment[]>([]);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [likeCount, setLikeCount] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const topLevelComments = comments.filter((comment) => !comment.parentId);
  const repliesByParentId = useMemo(
    () =>
      comments.reduce<Record<string, Comment[]>>((groups, comment) => {
        if (!comment.parentId) {
          return groups;
        }

        return {
          ...groups,
          [comment.parentId]: [...(groups[comment.parentId] ?? []), comment]
        };
      }, {}),
    [comments]
  );

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    if (!hasSupabaseEnv()) {
      setError("Supabase is not configured yet.");
      return;
    }

    let isMounted = true;

    async function loadInteractions() {
      const [{ data: commentRows }, { count }] = await Promise.all([
        supabaseClient
          .from("comments")
          .select("id, blog_id, body, parent_id, created_at, users(display_name, email)")
          .eq("blog_id", blogId)
          .order("created_at", { ascending: false }),
        supabaseClient
          .from("likes")
          .select("blog_id", { count: "exact", head: true })
          .eq("blog_id", blogId)
      ]);

      if (!isMounted) {
        return;
      }

      setComments(((commentRows as CommentRow[] | null) ?? []).map(mapComment));
      setLikeCount(count ?? 0);
    }

    loadInteractions().catch(() => {
      if (isMounted) {
        setError("Could not load comments and likes.");
      }
    });

    return () => {
      isMounted = false;
    };
  }, [blogId]);

  useEffect(() => {
    async function loadLikeState() {
      if (!user || !hasSupabaseEnv()) {
        setHasLiked(false);
        return;
      }

      const { data } = await supabaseClient
        .from("likes")
        .select("blog_id")
        .eq("blog_id", blogId)
        .eq("user_id", user.id)
        .maybeSingle();

      setHasLiked(Boolean(data));
    }

    loadLikeState();
  }, [blogId, user]);

  async function toggleLike() {
    setError("");

    if (!user) {
      setError("Please log in before liking this post.");
      return;
    }

    if (hasLiked) {
      const { error: deleteError } = await supabaseClient
        .from("likes")
        .delete()
        .eq("blog_id", blogId)
        .eq("user_id", user.id);

      if (deleteError) {
        setError("Could not remove your like.");
        return;
      }

      setHasLiked(false);
      setLikeCount((current) => Math.max(0, current - 1));
      return;
    }

    const { error: insertError } = await supabaseClient
      .from("likes")
      .insert({ blog_id: blogId, user_id: user.id });

    if (insertError) {
      setError("Could not like this post.");
      return;
    }

    setHasLiked(true);
    setLikeCount((current) => current + 1);
  }

  async function handleCommentSubmit(
    event: FormEvent<HTMLFormElement>,
    parentId?: string
  ) {
    event.preventDefault();
    setError("");

    if (!user) {
      setError("Please log in before commenting.");
      return;
    }

    const form = event.currentTarget;
    const formData = new FormData(form);
    const body = String(formData.get("comment") ?? "").trim();

    if (!body) {
      setError("Please write a comment first.");
      return;
    }

    setIsSubmitting(true);
    const { data, error: insertError } = await supabaseClient
      .from("comments")
      .insert({
        blog_id: blogId,
        user_id: user.id,
        body,
        parent_id: parentId ?? null
      })
      .select("id, blog_id, body, parent_id, created_at, users(display_name, email)")
      .single();

    setIsSubmitting(false);

    if (insertError || !data) {
      setError("Could not post comment.");
      return;
    }

    setComments((current) => [mapComment(data as unknown as CommentRow), ...current]);
    setReplyingTo(null);
    form.reset();
  }

  return (
    <section className="space-y-6 border-t border-line pt-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-ink">Responses</h2>
          <p className="mt-1 text-sm text-zinc-600">
            Login is required before liking or commenting.
          </p>
        </div>
        <button
          type="button"
          onClick={toggleLike}
          disabled={!isReady}
          className={`rounded-md border px-4 py-2 text-sm font-medium ${hasLiked
              ? "border-ink bg-ink text-white"
              : "border-line bg-white text-ink"
            } disabled:opacity-60`}
        >
          {hasLiked ? "Liked" : "Like"} · {likeCount}
        </button>
      </div>

      <AuthButton />

      <form
        onSubmit={(event) => handleCommentSubmit(event)}
        className="space-y-3"
      >
        <textarea
          name="comment"
          maxLength={1000}
          rows={4}
          disabled={!user || isSubmitting}
          placeholder={user ? "Write a comment" : "Login to write a comment"}
          className="w-full rounded-md border border-line bg-white px-3 py-2 text-sm outline-none focus:border-zinc-400 disabled:cursor-not-allowed disabled:bg-zinc-50"
        />
        <button
          type="submit"
          disabled={!user || isSubmitting}
          className="rounded-md bg-ink px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Posting..." : "Post comment"}
        </button>
      </form>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      <div className="space-y-4">
        {topLevelComments.length === 0 ? (
          <p className="text-sm text-zinc-600">No comments yet.</p>
        ) : (
          topLevelComments.map((item) => (
            <article key={item.id} className="border-t border-line pt-4">
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-medium text-ink">{item.name}</h3>
                <time className="text-xs text-zinc-500">
                  {new Date(item.createdAt).toLocaleDateString()}
                </time>
              </div>
              <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-zinc-700">
                {item.comment}
              </p>
              {user ? (
                <button
                  type="button"
                  onClick={() =>
                    setReplyingTo((current) =>
                      current === item.id ? null : item.id
                    )
                  }
                  className="mt-3 text-sm font-medium text-ink underline"
                >
                  Reply
                </button>
              ) : null}

              {replyingTo === item.id ? (
                <form
                  onSubmit={(event) => handleCommentSubmit(event, item.id)}
                  className="mt-4 space-y-3 rounded-md border border-line bg-zinc-50 p-4"
                >
                  <textarea
                    name="comment"
                    maxLength={1000}
                    rows={3}
                    placeholder={`Reply to ${item.name}`}
                    className="w-full rounded-md border border-line bg-white px-3 py-2 text-sm outline-none focus:border-zinc-400"
                  />
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="rounded-md bg-ink px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
                  >
                    Post reply
                  </button>
                </form>
              ) : null}

              {repliesByParentId[item.id]?.length ? (
                <div className="mt-4 space-y-4 border-l-2 border-line pl-4">
                  {repliesByParentId[item.id].map((reply) => (
                    <article key={reply.id}>
                      <div className="flex items-center justify-between gap-3">
                        <h4 className="text-sm font-medium text-ink">
                          {reply.name}
                          <span className="font-normal text-zinc-500">
                            {" "}
                            replied to{" "}
                          </span>
                          {item.name}
                        </h4>
                        <time className="text-xs text-zinc-500">
                          {new Date(reply.createdAt).toLocaleDateString()}
                        </time>
                      </div>
                      <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-zinc-700">
                        {reply.comment}
                      </p>
                    </article>
                  ))}
                </div>
              ) : null}
            </article>
          ))
        )}
      </div>
    </section>
  );
}
