/**
 * A plain flow diagram of the Studio's planned agent workflow.
 * It is labelled as a concept, not a product screenshot.
 */
export function ProjectVisual() {
  const agents = ["Front end", "Back end", "Database", "UI design", "Animation"];
  const box = "border border-line px-4 py-3";
  return (
    <figure className="border border-line p-5 sm:p-7">
      <ol className="space-y-3 text-sm">
        <li className={box}>
          <span className="label mr-3 text-accent">1</span>Client answers the questionnaire
        </li>
        <li className={box}>
          <span className="label mr-3 text-accent">2</span>Answers become a written site plan
        </li>
        <li className={box}>
          <span className="label mr-3 text-accent">3</span>Agents build from the plan
          <ul className="mt-3 flex flex-wrap gap-2">
            {agents.map((a) => (
              <li key={a} className="border border-line px-2 py-1 font-mono text-xs text-muted">
                {a}
              </li>
            ))}
          </ul>
        </li>
        <li className={box}>
          <span className="label mr-3 text-accent">4</span>Developer edits the draft. Each site gets its own dashboard.
        </li>
      </ol>
      <figcaption className="label mt-4">Concept diagram. Nothing here is built yet.</figcaption>
    </figure>
  );
}
