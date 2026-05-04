"use client";

import { FormEvent, useEffect, useState } from "react";
import { createComment, getComments } from "@/lib/firestore";
import type { Comment } from "@/models/blog";

function CommentForm({
  buttonLabel,
  isPending,
  onSubmit,
  placeholder = "Write a comment"
}: {
  buttonLabel: string;
  isPending: boolean;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  placeholder?: string;
}) {
  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <input
        name="name"
        maxLength={80}
        placeholder="Your name"
        className="w-full rounded-md border border-line bg-white px-3 py-2 text-sm outline-none focus:border-zinc-400"
      />
      <textarea
        name="comment"
        maxLength={1000}
        rows={4}
        placeholder={placeholder}
        className="w-full rounded-md border border-line bg-white px-3 py-2 text-sm outline-none focus:border-zinc-400"
      />
      <button
        type="submit"
        disabled={isPending}
        className="rounded-md bg-ink px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? "Posting..." : buttonLabel}
      </button>
    </form>
  );
}

export function Comments({ slug }: { slug: string }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [error, setError] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const topLevelComments = comments.filter((comment) => !comment.parentId);
  const repliesByParentId = comments.reduce<Record<string, Comment[]>>(
    (groups, comment) => {
      if (!comment.parentId) {
        return groups;
      }

      return {
        ...groups,
        [comment.parentId]: [...(groups[comment.parentId] ?? []), comment]
      };
    },
    {}
  );

  useEffect(() => {
    let isMounted = true;

    async function loadComments() {
      try {
        const loadedComments = await getComments(slug);
        console.log(loadComments);

        if (isMounted) {
          setComments(loadedComments);
        }
      } catch {
        if (isMounted) {
          setError("Could not load comments.");
        }
      }
    }

    loadComments();

    return () => {
      isMounted = false;
    };
  }, [slug]);

  console.log({ comments });

  function handleSubmit(event: FormEvent<HTMLFormElement>, parentId?: string) {
    event.preventDefault();
    setError("");

    const form = event.currentTarget;
    const formData = new FormData(form);
    const name = String(formData.get("name") ?? "").trim();
    const comment = String(formData.get("comment") ?? "").trim();

    if (!name || !comment) {
      setError("Please add your name and comment.");
      return;
    }

    setIsSubmitting(true);

    async function submitComment() {
      const parent = parentId
        ? comments.find((item) => item.id === parentId)
        : null;

      if (parentId && (!parent || parent.parentId)) {
        setError("Replies can only be added to top-level comments.");
        return;
      }

      const newComment = await createComment({
        blogSlug: slug,
        name,
        comment,
        parentId: parentId ?? null
      });

      setComments((current) => [newComment, ...current]);
      setReplyingTo(null);
      form.reset();
    }

    submitComment()
      .catch(() => {
        setError("Could not post comment.");
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  }

  return (
    <section className="space-y-6 border-t border-line pt-8">
      <h2 className="text-2xl font-semibold text-ink">Comments</h2>

      <CommentForm
        buttonLabel="Post comment"
        isPending={isSubmitting}
        onSubmit={(event) => handleSubmit(event)}
      />
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
              <button
                type="button"
                onClick={() =>
                  setReplyingTo((current) => (current === item.id ? null : item.id))
                }
                className="mt-3 text-sm font-medium text-ink underline"
              >
                Reply
              </button>

              {replyingTo === item.id ? (
                <div className="mt-4 rounded-lg border border-line bg-zinc-50 p-4">
                  <p className="mb-3 text-sm text-zinc-600">
                    Replying to <span className="font-medium text-ink">{item.name}</span>
                  </p>
                  <CommentForm
                    buttonLabel="Post reply"
                    isPending={isSubmitting}
                    placeholder={`Reply to ${item.name}`}
                    onSubmit={(event) => handleSubmit(event, item.id)}
                  />
                </div>
              ) : null}

              {repliesByParentId[item.id]?.length ? (
                <div className="mt-4 space-y-4 border-l-2 border-line pl-4">
                  {repliesByParentId[item.id].map((reply) => (
                    <article key={reply.id}>
                      <div className="flex items-center justify-between gap-3">
                        <h4 className="text-sm font-medium text-ink">
                          {reply.name}
                          <span className="font-normal text-zinc-500"> replied to </span>
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
