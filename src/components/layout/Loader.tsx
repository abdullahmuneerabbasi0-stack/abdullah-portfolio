"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useSetIntroReady } from "./MotionProvider";

const ease = [0.76, 0, 0.24, 1] as const;
const KEY = "intro-seen";

/**
 * A short intro curtain shown once per visit. Repeat visits in the same tab
 * session, and visitors who prefer reduced motion, skip straight to the page.
 */
export function Loader({ enabled = true, name }: { enabled?: boolean; name: string }) {
  const setReady = useSetIntroReady();
  const [show, setShow] = useState(enabled);
  const [play, setPlay] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let seen = false;
    try {
      seen = sessionStorage.getItem(KEY) === "1";
    } catch {}
    const finish = () => {
      try {
        sessionStorage.setItem(KEY, "1");
      } catch {}
      setShow(false);
      setReady(true);
      document.documentElement.style.overflow = "";
    };
    if (!enabled || reduced || seen) {
      const raf = requestAnimationFrame(finish);
      return () => cancelAnimationFrame(raf);
    }
    const raf = requestAnimationFrame(() => setPlay(true));
    document.documentElement.style.overflow = "hidden";
    const t = setTimeout(finish, 1500);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(t);
      document.documentElement.style.overflow = "";
    };
  }, [setReady, enabled]);

  const words = name.split(" ");

  if (!enabled && !show) return null;
  return (
    <>
      <noscript>
        <style>{`[data-loader]{display:none!important}`}</style>
      </noscript>
      <AnimatePresence>
        {show && (
          <motion.div
            data-loader
            aria-hidden="true"
            className="fixed inset-0 z-[80] flex items-center justify-center bg-bg"
            initial={{ clipPath: "inset(0% 0% 0% 0%)" }}
            exit={{ clipPath: "inset(0% 0% 100% 0%)", transition: { duration: 0.9, ease } }}
          >
            <div className="text-center">
              <p className="flex gap-[0.25em] overflow-hidden font-display text-4xl text-text sm:text-6xl">
                {words.map((w, i) => (
                  <motion.span
                    key={w}
                    className="inline-block"
                    initial={{ y: "110%" }}
                    animate={play ? { y: "0%" } : undefined}
                    transition={{ duration: 0.9, delay: 0.1 + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                  >
                    {i === words.length - 1 ? <em className="text-accent-2">{w}</em> : w}
                  </motion.span>
                ))}
              </p>
              <motion.span
                className="mx-auto mt-5 block h-px w-40 origin-left bg-accent"
                initial={{ scaleX: 0 }}
                animate={play ? { scaleX: 1 } : undefined}
                transition={{ duration: 1.1, delay: 0.2, ease }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
