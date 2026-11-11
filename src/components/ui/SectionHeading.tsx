import { Reveal } from "./Reveal";
import { SplitText } from "./SplitText";

/** Eyebrow, serif title and optional intro. `tone` matches the section background. */
export function SectionHeading({
  eyebrow,
  title,
  intro,
  tone = "dark",
  className = "",
}: {
  eyebrow: string;
  title: string;
  intro?: string;
  tone?: "dark" | "light";
  className?: string;
}) {
  const light = tone === "light";
  return (
    <div className={`mb-14 grid gap-6 md:mb-20 md:grid-cols-12 md:items-end ${className}`}>
      <div className="md:col-span-8">
        <Reveal>
          <p className={`eyebrow mb-6 ${light ? "text-accent-ink" : "text-accent-2"}`}>{eyebrow}</p>
        </Reveal>
        <SplitText
          text={title}
          className={`font-display text-[2.6rem] leading-[1.02] font-normal tracking-[-0.01em] sm:text-6xl lg:text-7xl ${light ? "text-ink" : "text-text"}`}
        />
      </div>
      {intro && (
        <Reveal delay={0.15} className="md:col-span-4">
          <p className={`max-w-sm text-base leading-relaxed ${light ? "text-ink/65" : "text-muted"}`}>{intro}</p>
        </Reveal>
      )}
    </div>
  );
}
