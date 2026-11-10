import type { ReactNode } from "react";

/**
 * Spec-sheet section: a numbered label in a narrow left column and the
 * content on the right, separated from the previous section by a thin rule.
 */
export function Section({
  id,
  number,
  label,
  children,
}: {
  id?: string;
  number?: string;
  label: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="border-t border-line px-5 sm:px-8">
      <div className="mx-auto grid max-w-6xl gap-6 py-14 md:grid-cols-[11rem_1fr] md:gap-10 md:py-20">
        <p className="label md:pt-2">
          {number && <span className="mr-2 text-accent">{number}</span>}
          {label}
        </p>
        <div className="min-w-0">{children}</div>
      </div>
    </section>
  );
}
