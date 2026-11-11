"use client";

import { useState } from "react";
import type { DayCount } from "@/lib/server/stats";

/**
 * Single-series daily bar chart (30 days) with a hover/focus tooltip and a
 * screen-reader table. Only real counts from the database are drawn.
 */
export function DailyBars({ data, label, unit }: { data: DayCount[]; label: string; unit: [string, string] }) {
  const [hover, setHover] = useState<number | null>(null);
  const max = Math.max(1, ...data.map((d) => d.count));
  const total = data.reduce((s, d) => s + d.count, 0);
  const W = 600;
  const H = 140;
  const gap = 2;
  const bw = W / data.length - gap;
  const fmt = (day: string) => new Date(day + "T00:00:00").toLocaleDateString(undefined, { day: "numeric", month: "short" });
  const h = hover !== null ? data[hover] : null;
  return (
    <figure>
      <div className="flex items-baseline justify-between gap-3">
        <figcaption className="text-sm text-muted">{label}</figcaption>
        <p className="text-xs text-muted">
          <span className="font-display text-2xl text-text">{total}</span> {total === 1 ? unit[0] : unit[1]} in 30 days
        </p>
      </div>
      <div className="relative mt-4">
        <svg viewBox={`0 0 ${W} ${H + 18}`} className="h-40 w-full overflow-visible" role="img" aria-label={`${label}: ${total} in the last 30 days`} onMouseLeave={() => setHover(null)}>
          {[0.5, 1].map((t) => (
            <line key={t} x1={0} x2={W} y1={H - H * t} y2={H - H * t} stroke="rgb(241 235 224 / 0.06)" strokeDasharray="2 4" />
          ))}
          <line x1={0} x2={W} y1={H} y2={H} stroke="rgb(241 235 224 / 0.15)" />
          {data.map((d, i) => {
            const bh = d.count ? Math.max(4, (d.count / max) * (H - 8)) : 0;
            const x = i * (bw + gap);
            return (
              <g key={d.day}>
                {bh > 0 && <path d={`M${x},${H} v${-(bh - 4)} q0,-4 4,-4 h${bw - 8} q4,0 4,4 v${bh - 4} z`} fill={hover === i ? "var(--accent-2)" : "var(--accent)"} opacity={hover === null || hover === i ? 1 : 0.55} />}
                <rect
                  x={x - gap / 2}
                  y={0}
                  width={bw + gap}
                  height={H}
                  fill="transparent"
                  tabIndex={0}
                  aria-label={`${fmt(d.day)}: ${d.count}`}
                  onMouseEnter={() => setHover(i)}
                  onFocus={() => setHover(i)}
                  onBlur={() => setHover(null)}
                  className="outline-none"
                />
              </g>
            );
          })}
          <text x={0} y={H + 14} fill="var(--muted)" fontSize={10}>
            {fmt(data[0].day)}
          </text>
          <text x={W} y={H + 14} fill="var(--muted)" fontSize={10} textAnchor="end">
            Today
          </text>
          <text x={W} y={10} fill="var(--muted)" fontSize={10} textAnchor="end">
            {max}
          </text>
        </svg>
        {h && hover !== null && (
          <div
            className="pointer-events-none absolute -top-2 z-10 -translate-x-1/2 -translate-y-full rounded-lg border border-white/10 bg-[#171311] px-2.5 py-1.5 text-xs whitespace-nowrap shadow-xl"
            style={{ left: `${((hover + 0.5) / data.length) * 100}%` }}
          >
            <span className="text-muted">{fmt(h.day)}</span> · <span className="font-medium">{h.count}</span> {h.count === 1 ? unit[0] : unit[1]}
          </div>
        )}
      </div>
      <table className="sr-only">
        <caption>{label}</caption>
        <tbody>
          {data.map((d) => (
            <tr key={d.day}>
              <th>{d.day}</th>
              <td>{d.count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  );
}

/** Horizontal bars for a small breakdown, with values written beside each bar. */
export function Breakdown({ rows }: { rows: { label: string; value: number }[] }) {
  const max = Math.max(1, ...rows.map((r) => r.value));
  if (!rows.length) return <p className="text-sm text-muted">No data yet.</p>;
  return (
    <ul className="space-y-3">
      {rows.map((r) => (
        <li key={r.label} title={`${r.label}: ${r.value}`}>
          <div className="flex items-baseline justify-between text-xs">
            <span className="text-text/85">{r.label}</span>
            <span className="text-muted">{r.value}</span>
          </div>
          <div className="mt-1.5 h-2 rounded-full bg-white/[0.05]">
            <div className="h-2 rounded-full bg-accent" style={{ width: `${(r.value / max) * 100}%` }} />
          </div>
        </li>
      ))}
    </ul>
  );
}
