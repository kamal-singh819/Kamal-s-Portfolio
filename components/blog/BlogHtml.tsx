export function BlogHtml({ contentHtml }: { contentHtml: string }) {
  return (
    <div
      className="prose prose-zinc max-w-none prose-pre:rounded-md prose-pre:bg-zinc-950 prose-pre:p-4 prose-code:before:content-none prose-code:after:content-none"
      dangerouslySetInnerHTML={{ __html: contentHtml }}
    />
  );
}
