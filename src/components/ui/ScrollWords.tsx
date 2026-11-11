"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "motion/react";

function Word({
  children,
  range,
  progress,
  reduced,
}: {
  children: string;
  range: [number, number];
  progress: MotionValue<number>;
  reduced: boolean;
}) {
  const opacity = useTransform(progress, range, reduced ? [1, 1] : [0.16, 1]);
  return <motion.span style={{ opacity }}>{children} </motion.span>;
}

/**
 * A paragraph whose words light up one by one as it scrolls through the view.
 * With reduced motion every word is simply shown at full strength.
 */
export function ScrollWords({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const reduced = !!useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.45"] });
  const words = text.split(" ");
  return (
    <p ref={ref} className={className}>
      {words.map((w, i) => (
        <Word key={i} progress={scrollYProgress} reduced={reduced} range={[i / words.length, (i + 1) / words.length]}>
          {w}
        </Word>
      ))}
    </p>
  );
}
