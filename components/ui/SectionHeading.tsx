import type React from "react";

type SectionHeadingProps = {
  title: string;
  description?: string;
  action?: React.ReactNode;
};

export function SectionHeading({
  title,
  description,
  action
}: SectionHeadingProps) {
  return (
    <div className="flex items-end justify-between gap-4">
      <div className="space-y-2">
        <h2 className="font-serif text-3xl font-bold text-ink">{title}</h2>
        {description ? <p className="text-zinc-600">{description}</p> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
