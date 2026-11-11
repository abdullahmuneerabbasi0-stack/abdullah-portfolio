"use client";

import { useRef, type ReactNode } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { useReducedMotion } from "@/components/layout/MotionProvider";

/**
 * A rounded frame that unmasks upward when it enters the view; its contents
 * drift slightly slower than the page for a sense of depth.
 */
export function ParallaxFrame({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], reduced ? ["0%", "0%"] : ["-6%", "6%"]);
  return (
    <motion.div
      ref={ref}
      initial={{ clipPath: "inset(18% 6% 18% 6% round var(--frame-radius))", opacity: 0 }}
      whileInView={{ clipPath: "inset(0% 0% 0% 0% round var(--frame-radius))", opacity: 1 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 1.3, ease: [0.76, 0, 0.24, 1] }}
      className={`relative overflow-hidden rounded-[var(--frame-radius)] ${className}`}
    >
      <motion.div style={{ y }} className="absolute -inset-y-[7%] inset-x-0">
        <div className="absolute inset-0 transition-[scale] duration-[1.2s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]">
          {children}
        </div>
      </motion.div>
    </motion.div>
  );
}
