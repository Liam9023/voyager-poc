"use client";

/**
 * A real booking deep link — always opens in a new tab (items 7 & 8). Never labelled with
 * the underlying provider (CLAUDE.md rule 3: provider invisibility).
 */
export default function BookLink({
  href,
  onBook,
  label = "Book",
  className = "",
}: {
  href: string;
  onBook?: () => void;
  label?: string;
  className?: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={onBook}
      className={`inline-flex shrink-0 items-center gap-1 rounded-lg bg-accent px-3 py-1 text-[10px] font-bold text-white transition-colors hover:bg-accent-dark ${className}`}
    >
      {label} ↗
    </a>
  );
}
