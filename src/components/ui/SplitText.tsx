"use client";

import { motion } from "motion/react";
import type { ElementType } from "react";

const ease = [0.22, 1, 0.36, 1] as const;

/**
 * Headline that rises word by word out of a mask. Words wrapped in *asterisks*
 * are set in italic copper. The full sentence is exposed to screen readers once.
 */
export function SplitText({
  text,
  as: Tag = "h2",
  className,
  delay = 0,
  play,
}: {
  text: string;
  as?: ElementType;
  className?: string;
  delay?: number;
  /** Drive the animation manually; when omitted it plays on scroll into view. */
  play?: boolean;
}) {
  const words = text.split(" ");
  const trigger =
    play === undefined
      ? { whileInView: "show", viewport: { once: true, margin: "-10% 0px" } }
      : { animate: play ? "show" : "hidden" };
  return (
    <Tag className={className}>
      <span className="sr-only">{text.replace(/\*/g, "")}</span>
      <motion.span aria-hidden="true" initial="hidden" {...trigger} className="block">
        {words.map((w, i) => {
          const em = w.startsWith("*");
          const clean = w.replace(/\*/g, "");
          return (
            <span key={i} className="inline-block overflow-hidden pb-[0.12em] align-bottom leading-[inherit]">
              <motion.span
                className={`inline-block ${em ? "text-accent-2 italic" : ""}`}
                variants={{ hidden: { y: "110%" }, show: { y: "0%" } }}
                transition={{ duration: 1, delay: delay + i * 0.05, ease }}
              >
                {clean}
                {i < words.length - 1 ? " " : ""}
              </motion.span>
            </span>
          );
        })}
      </motion.span>
    </Tag>
  );
}
