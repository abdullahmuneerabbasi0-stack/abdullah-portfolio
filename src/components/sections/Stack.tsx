import { skillGroups } from "@/content/site";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";

/** What I use, and where I've actually used it. */
export function Stack() {
  return (
    <Section id="stack" number="03" label="Stack">
      <Reveal>
        <table className="w-full border-collapse text-left">
          <thead className="sr-only sm:not-sr-only">
            <tr className="border-b border-line">
              <th scope="col" className="label pb-3 font-normal">Area</th>
              <th scope="col" className="label pb-3 font-normal">Tools</th>
              <th scope="col" className="label pb-3 font-normal">Where I&apos;ve used it</th>
            </tr>
          </thead>
          <tbody>
            {skillGroups.map((g) => (
              <tr key={g.title} className="grid border-b border-line py-4 sm:table-row">
                <th scope="row" className="pr-6 align-top font-medium sm:py-4">{g.title}</th>
                <td className="mt-1 pr-6 align-top font-mono text-sm sm:py-4">{g.skills.join(", ")}</td>
                <td className="mt-1 align-top text-sm text-muted sm:py-4">{g.usedIn}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Reveal>
    </Section>
  );
}
