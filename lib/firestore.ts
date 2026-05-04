import {
  addDoc,
  collection,
  getDocs,
  query,
  serverTimestamp,
  where
} from "firebase/firestore";
import { getDb } from "@/lib/firebase";
import type { Comment } from "@/models/blog";

export async function createComment(input: {
  blogSlug: string;
  name: string;
  comment: string;
  parentId?: string | null;
}): Promise<Comment> {
  const createdAt = new Date().toISOString();
  const docRef = await addDoc(collection(getDb(), "comments"), {
    blogSlug: input.blogSlug,
    name: input.name,
    comment: input.comment,
    parentId: input.parentId ?? null,
    createdAt: serverTimestamp()
  });

  console.log({ docRef });

  return {
    id: docRef.id,
    blogSlug: input.blogSlug,
    name: input.name,
    comment: input.comment,
    parentId: input.parentId ?? null,
    createdAt
  };
}

export async function getComments(blogSlug: string): Promise<Comment[]> {
  const commentsQuery = query(
    collection(getDb(), "comments"),
    where("blogSlug", "==", blogSlug)
  );
  const snapshot = await getDocs(commentsQuery);

  return snapshot.docs
    .map((commentDoc) => {
      const data = commentDoc.data();
      const createdAt =
        typeof data.createdAt?.toDate === "function"
          ? data.createdAt.toDate().toISOString()
          : new Date().toISOString();

      return {
        id: commentDoc.id,
        blogSlug: data.blogSlug,
        name: data.name,
        comment: data.comment,
        parentId: typeof data.parentId === "string" ? data.parentId : null,
        createdAt
      };
    })
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
}
