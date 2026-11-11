"use client";

import { useEffect, useRef } from "react";

/**
 * Fixed backdrop behind the dark sections: a warm glow plus slowly drifting
 * specks of dust drawn on a canvas. The canvas pauses when the tab is hidden
 * and is skipped entirely for visitors who prefer reduced motion.
 */
export function Background({ particles = true, glow = true }: { particles?: boolean; glow?: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx || !particles) return;
    const speck = getComputedStyle(document.documentElement).getPropertyValue("--text").trim() || "#f1ebe0";
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    let w = 0;
    let h = 0;
    type P = { x: number; y: number; r: number; vx: number; vy: number; a: number; t: number };
    let parts: P[] = [];

    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.round(Math.min(90, (w * h) / 16000));
      parts = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.1 + 0.3,
        vx: (Math.random() - 0.5) * 0.08,
        vy: -(Math.random() * 0.12 + 0.02),
        a: Math.random() * 0.5 + 0.15,
        t: Math.random() * Math.PI * 2,
      }));
    };

    let raf = 0;
    const tick = () => {
      ctx.clearRect(0, 0, w, h);
      for (const p of parts) {
        p.x += p.vx;
        p.y += p.vy;
        p.t += 0.01;
        if (p.y < -4) p.y = h + 4;
        if (p.x < -4) p.x = w + 4;
        if (p.x > w + 4) p.x = -4;
        ctx.globalAlpha = p.a * (0.6 + 0.4 * Math.sin(p.t));
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = speck;
        ctx.fill();
      }
      raf = requestAnimationFrame(tick);
    };

    const onVisibility = () => {
      cancelAnimationFrame(raf);
      if (!document.hidden) raf = requestAnimationFrame(tick);
    };

    resize();
    raf = requestAnimationFrame(tick);
    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [particles]);

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {glow && <div className="absolute -top-1/3 left-1/2 h-[80vh] w-[120vw] -translate-x-1/2 bg-[radial-gradient(closest-side,rgb(var(--accent-rgb)/0.12),transparent)]" />}
      {particles && <canvas ref={ref} className="absolute inset-0 h-full w-full" />}
    </div>
  );
}
