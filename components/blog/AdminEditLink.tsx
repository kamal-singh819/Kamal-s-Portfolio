"use client";

import Link from "next/link";
import { useAuthStore } from "@/store/auth";

export function AdminEditLink() {
  const role = useAuthStore((state) => state.role);

  if (role !== "admin") {
    return null;
  }

  return (
    <Link
      href="/admin/blog"
      className="rounded-md border border-line bg-white px-3 py-2 text-sm font-medium text-ink hover:border-zinc-400"
    >
      Edit post
    </Link>
  );
}
