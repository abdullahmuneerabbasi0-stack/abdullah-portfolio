"use client";

import { MotionConfig, useReducedMotion as useSystemReducedMotion } from "motion/react";
import { createContext, useContext, useState, type ReactNode } from "react";

type Intro = { ready: boolean; setReady: (v: boolean) => void };
const IntroContext = createContext<Intro>({ ready: true, setReady: () => {} });
const MinimalContext = createContext(false);
const TransitionsContext = createContext(true);

/** Whether route changes get the curtain transition (admin setting). */
export const usePageTransitions = () => useContext(TransitionsContext);

/** True once the intro loader has lifted, so the hero can start its entrance. */
export const useIntroReady = () => useContext(IntroContext).ready;
export const useSetIntroReady = () => useContext(IntroContext).setReady;

/**
 * True when motion should be kept to a minimum: either the visitor asked for
 * reduced motion in their system settings, or the site owner chose "minimal"
 * animations in the admin panel.
 */
export function useReducedMotion() {
  const system = useSystemReducedMotion();
  const minimal = useContext(MinimalContext);
  return !!system || minimal;
}

/** Respects the visitor's "reduce motion" setting (and the admin's choice) for every animation. */
export function MotionProvider({
  children,
  minimal = false,
  pageTransitions = true,
}: {
  children: ReactNode;
  minimal?: boolean;
  pageTransitions?: boolean;
}) {
  const [ready, setReady] = useState(false);
  return (
    <IntroContext.Provider value={{ ready, setReady }}>
      <MinimalContext.Provider value={minimal}>
        <TransitionsContext.Provider value={pageTransitions && !minimal}>
          <MotionConfig reducedMotion={minimal ? "always" : "user"}>{children}</MotionConfig>
        </TransitionsContext.Provider>
      </MinimalContext.Provider>
    </IntroContext.Provider>
  );
}
