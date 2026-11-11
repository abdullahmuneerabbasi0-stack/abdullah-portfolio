import { Fragment, type ReactNode } from "react";
import { getSiteData, resolveImage } from "@/lib/server/site-data";
import type { SectionKey } from "@/lib/content/types";
import { sectionHasContent } from "@/components/site/nav";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Skills } from "@/components/sections/Skills";
import { Services } from "@/components/sections/Services";
import { Projects } from "@/components/sections/Projects";
import { Testimonials } from "@/components/sections/Testimonials";
import { Education } from "@/components/sections/Education";
import { Contact } from "@/components/sections/Contact";

export default async function Home() {
  const data = await getSiteData();
  const render: Record<SectionKey, (s: (typeof data.layout.sections)[number]) => ReactNode> = {
    hero: () => <Hero hero={data.hero} photo={resolveImage(data, data.hero.photo, data.hero.photoAlt)} />,
    about: (s) => <About section={s} about={data.about} projectCount={data.projects.length} />,
    skills: (s) => <Skills section={s} groups={data.skillGroups} interests={data.about.interests} />,
    services: (s) => <Services section={s} services={data.services} images={data.images} />,
    projects: (s) => <Projects section={s} projects={data.projects} images={data.images} />,
    testimonials: (s) => <Testimonials section={s} items={data.testimonials} images={data.images} />,
    education: (s) => <Education section={s} education={data.about.education} certifications={data.about.certifications} />,
    contact: (s) => (
      <Contact
        section={s}
        contact={data.contact}
        cv={data.hero.cv}
        formAvailable={data.source === "database" && data.contact.form.enabled}
      />
    ),
  };
  return (
    <>
      {data.layout.sections
        .filter((s) => s.enabled && sectionHasContent(data, s.key))
        .map((s) => (
          <Fragment key={s.key}>
            {render[s.key](s)}
          </Fragment>
        ))}
    </>
  );
}
