import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Spinner } from "@/components/ui/Spinner";

type ButtonVariant = "primary" | "secondary" | "ghost";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  isLoading?: boolean;
  variant?: ButtonVariant;
};

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-ink text-white hover:bg-zinc-800",
  secondary: "border border-line bg-white text-ink hover:border-zinc-400",
  ghost: "text-ink hover:bg-zinc-100"
};

export function Button({
  children,
  className = "",
  disabled,
  isLoading = false,
  type = "button",
  variant = "primary",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      className={`inline-flex min-h-10 items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-60 ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {isLoading ? <Spinner size="sm" /> : null}
      <span>{children}</span>
    </button>
  );
}
