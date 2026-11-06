/**
 * A stylised concept illustration of the Studio's agent workflow.
 * It is clearly labelled as a concept, not a product screenshot.
 */
export function ProjectVisual() {
  const agents = ["Frontend", "Backend", "Database", "UI/UX", "Animation"];
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-5 overflow-hidden bg-[radial-gradient(circle_at_50%_40%,rgb(255_77_46/0.18),transparent_65%)] p-8">
      <div className="glass rounded-xl px-4 py-2.5 text-center text-sm">
        <p className="font-mono text-[10px] uppercase tracking-widest text-muted">Client</p>
        <p className="font-semibold">Requirements discovery</p>
      </div>
      <div className="h-6 w-px bg-gradient-to-b from-accent-2 to-transparent" />
      <div className="bg-accent-gradient rounded-xl px-5 py-2.5 text-center text-sm font-semibold text-black shadow-lg shadow-accent/30">
        AI project plan
      </div>
      <div className="flex flex-wrap justify-center gap-2">
        {agents.map((a) => (
          <span key={a} className="rounded-lg border border-accent-2/30 bg-black/40 px-2.5 py-1.5 font-mono text-[11px] text-accent-3">
            {a} agent
          </span>
        ))}
      </div>
      <div className="h-6 w-px bg-gradient-to-b from-accent-2 to-transparent" />
      <div className="glass rounded-xl px-4 py-2.5 text-center text-sm">
        <p className="font-semibold">Client website + dashboard</p>
        <p className="font-mono text-[10px] uppercase tracking-widest text-muted">isolated per client</p>
      </div>
      <p className="absolute right-3 bottom-3 rounded bg-black/50 px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-muted">
        Concept diagram
      </p>
    </div>
  );
}
