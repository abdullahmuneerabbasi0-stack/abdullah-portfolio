/**
 * A stylised concept illustration of the Studio's agent workflow.
 * It is clearly labelled as a concept, not a product screenshot.
 */
export function ProjectVisual() {
  const agents = ["Frontend", "Backend", "Database", "UI/UX", "Animation"];
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 overflow-hidden bg-[radial-gradient(circle_at_50%_35%,rgb(217_138_92/0.22),transparent_60%),linear-gradient(180deg,#1d1916,#0c0a09)] p-8">
      <div className="rounded-2xl border border-line bg-bg/60 px-5 py-3 text-center text-sm backdrop-blur">
        <p className="text-[10px] uppercase tracking-[0.22em] text-muted">Client</p>
        <p className="font-display text-lg">Requirements discovery</p>
      </div>
      <div className="h-6 w-px bg-gradient-to-b from-accent to-transparent" />
      <div className="rounded-full bg-accent px-6 py-2.5 text-center font-display text-lg italic text-ink">AI project plan</div>
      <div className="flex max-w-md flex-wrap justify-center gap-2">
        {agents.map((a) => (
          <span key={a} className="rounded-full border border-accent/30 bg-black/40 px-3 py-1.5 text-[11px] uppercase tracking-[0.12em] text-accent-3">
            {a} agent
          </span>
        ))}
      </div>
      <div className="h-6 w-px bg-gradient-to-b from-accent to-transparent" />
      <div className="rounded-2xl border border-line bg-bg/60 px-5 py-3 text-center text-sm backdrop-blur">
        <p className="font-display text-lg">Client website + dashboard</p>
        <p className="text-[10px] uppercase tracking-[0.22em] text-muted">isolated per client</p>
      </div>
      <p className="absolute right-4 bottom-4 rounded-full bg-black/50 px-3 py-1 text-[10px] uppercase tracking-[0.22em] text-muted">
        Concept diagram
      </p>
    </div>
  );
}

/** A typographic poster used as cover art for projects without screenshots. */
export function ProjectPoster({ title, category, technologies, index }: { title: string; category: string; technologies: string[]; index: number }) {
  return (
    <div className="absolute inset-0 flex flex-col justify-between overflow-hidden bg-[radial-gradient(circle_at_80%_10%,rgb(217_138_92/0.28),transparent_55%),linear-gradient(160deg,#211c18,#0c0a09_70%)] p-7 sm:p-9">
      <div className="flex items-start justify-between text-[10px] uppercase tracking-[0.22em] text-muted">
        <span>{category}</span>
        <span className="font-display text-base normal-case italic tracking-normal text-accent-2">No. 0{index}</span>
      </div>
      <p className="font-display text-5xl leading-[0.95] sm:text-6xl">
        {title.split(" ").map((w, i) => (
          <span key={i} className={i % 2 ? "italic text-accent-2" : ""}>
            {w}{" "}
          </span>
        ))}
      </p>
      <p className="text-[11px] uppercase tracking-[0.16em] text-text/55">{technologies.join(" · ")}</p>
    </div>
  );
}
