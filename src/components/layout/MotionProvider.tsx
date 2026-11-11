"use client";

import { MotionConfig } from "motion/react";
import { createContext, useContext, useState, type ReactNode } from "react";

type Intro = { ready: boolean; setReady: (v: boolean) => void };
const IntroContext = createContext<Intro>({ ready: true, setReady: () => {} });

/** True once the intro loader has lifted, so the hero can start its entrance. */
export const useIntroReady = () => useContext(IntroContext).ready;
export const useSetIntroReady = () => useContext(IntroContext).setReady;

/** Respects the visitor's "reduce motion" system setting for every animation. */
export function MotionProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  return (
    <IntroContext.Provider value={{ ready, setReady }}>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </IntroContext.Provider>
  );
}
