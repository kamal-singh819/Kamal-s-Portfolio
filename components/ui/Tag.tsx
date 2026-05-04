import type React from "react";

type TagProps = {
  children: React.ReactNode;
  variant?: "pill" | "soft";
};

export function Tag({ children, variant = "soft" }: TagProps) {
  const className =
    variant === "pill"
      ? "rounded-full border border-line bg-white px-3 py-1.5 text-sm text-zinc-700 transition hover:bg-zinc-50"
      : "rounded-md bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-700";

  return <span className={className}>{children}</span>;
}
