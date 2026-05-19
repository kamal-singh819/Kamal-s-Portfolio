import Link from "next/link";

type PaginationProps = {
  page: number;
  totalPages: number;
  basePath: string;
};

function pageHref(basePath: string, page: number) {
  return page === 1 ? basePath : `${basePath}?page=${page}`;
}

export function Pagination({ page, totalPages, basePath }: PaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <nav
      className="flex flex-wrap items-center justify-between gap-3 border-t border-line pt-6"
      aria-label="Blog pagination"
    >
      <Link
        href={pageHref(basePath, Math.max(1, page - 1))}
        aria-disabled={page === 1}
        className={`rounded-md border border-line px-3 py-2 text-sm font-medium ${page === 1 ? "pointer-events-none text-zinc-300" : "text-ink hover:border-zinc-400"}`}
      >
        Previous
      </Link>
      <div className="flex flex-wrap items-center gap-2">
        {pages.map((item) => (
          <Link
            key={item}
            href={pageHref(basePath, item)}
            aria-current={item === page ? "page" : undefined}
            className={`grid h-9 w-9 place-items-center rounded-md border text-sm font-medium ${item === page
                ? "border-ink bg-ink text-white"
                : "border-line bg-white text-ink hover:border-zinc-400"
              }`}
          >
            {item}
          </Link>
        ))}
      </div>
      <Link
        href={pageHref(basePath, Math.min(totalPages, page + 1))}
        aria-disabled={page === totalPages}
        className={`rounded-md border border-line px-3 py-2 text-sm font-medium ${page === totalPages ? "pointer-events-none text-zinc-300" : "text-ink hover:border-zinc-400"}`}
      >
        Next
      </Link>
    </nav>
  );
}
