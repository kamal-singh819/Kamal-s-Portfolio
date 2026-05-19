import type { Metadata } from "next";
import { AdminBlogEditor } from "@/components/blog/AdminBlogEditor";

export const metadata: Metadata = {
  title: "Admin Blog",
  description: "Create and update Supabase-backed blog posts."
};

export default function AdminBlogPage() {
  return <AdminBlogEditor />;
}
