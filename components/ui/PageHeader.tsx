import type React from "react";

type PageHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  children?: React.ReactNode;
};

export function PageHeader({
  eyebrow,
  title,
  description,
  children
}: PageHeaderProps) {
  return (
    <header className="space-y-5 border-b border-line pb-8">
      <div className="space-y-3">
        {eyebrow ? (
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-zinc-500">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="text-4xl font-bold leading-tight text-ink sm:text-5xl">
          {title}
        </h1>
        {description ? (
          <p className="max-w-2xl text-lg leading-8 text-zinc-700">
            {description}
          </p>
        ) : null}
      </div>
      {children}
    </header>
  );
}
