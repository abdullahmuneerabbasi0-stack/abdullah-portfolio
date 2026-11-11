"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { usePageTransitions } from "@/components/layout/MotionProvider";

// The first render is covered by the intro loader, so only later
// navigations get the curtain transition.
let firstRender = true;

/** Wraps every page so route changes get a short curtain wipe and fade-in. */
export default function Template({ children }: { children: React.ReactNode }) {
  const enabled = usePageTransitions();
  const [initial] = useState(() => !firstRender);
  const animateIn = initial && enabled;
  useEffect(() => {
    firstRender = false;
  }, []);
  return (
    <>
      {animateIn && (
        <motion.div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 z-[75] origin-top bg-accent"
          initial={{ scaleY: 1 }}
          animate={{ scaleY: 0 }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
        />
      )}
      <motion.div
        initial={animateIn ? { opacity: 0 } : false}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.25 }}
      >
        {children}
      </motion.div>
    </>
  );
}
