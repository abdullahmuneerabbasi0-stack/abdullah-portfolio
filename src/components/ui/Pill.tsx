import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";

type Variant = "solid" | "outline" | "outline-ink" | "copper" | "ink";

const variants: Record<Variant, string> = {
  solid: "bg-bone text-ink before:bg-accent",
  copper: "bg-accent text-ink before:bg-bone",
  outline: "border border-text/30 text-text before:bg-bone [&:hover>span]:text-ink",
  "outline-ink": "border border-ink/25 text-ink before:bg-ink [&:hover>span]:text-bone",
  ink: "bg-ink text-bone before:bg-accent [&:hover>span]:text-ink",
};

/**
 * Rounded pill button used across the site. On hover a fill rises from the
 * bottom and the arrow nudges up and to the right.
 */
export function Pill({
  href,
  children,
  variant = "solid",
  icon,
  external,
  download,
  className = "",
}: {
  href: string;
  children: ReactNode;
  variant?: Variant;
  icon?: ReactNode | false;
  external?: boolean;
  download?: boolean;
  className?: string;
}) {
  const cls = `group relative isolate inline-flex items-center gap-2.5 overflow-hidden rounded-full px-6 py-3.5 text-[0.8rem] font-medium uppercase tracking-[0.14em] transition-colors duration-500 before:absolute before:inset-0 before:-z-10 before:translate-y-full before:rounded-full before:transition-transform before:duration-500 before:ease-[cubic-bezier(0.22,1,0.36,1)] hover:before:translate-y-0 ${variants[variant]} ${className}`;
  const inner = (
    <span className="relative inline-flex items-center gap-2.5 transition-colors duration-500">
      {children}
      {icon !== false && (
        <span className="inline-flex transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
          {icon ?? <ArrowUpRight className="h-4 w-4" aria-hidden="true" />}
        </span>
      )}
    </span>
  );
  if (external || download)
    return (
      <a
        href={href}
        className={cls}
        {...(download ? { download: true } : { target: "_blank", rel: "noopener noreferrer" })}
      >
        {inner}
      </a>
    );
  return (
    <Link href={href} className={cls}>
      {inner}
    </Link>
  );
}
