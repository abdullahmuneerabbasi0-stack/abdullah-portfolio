import Image from "next/image";
import Link from "next/link";
import { contact, profile } from "@/content/site";
import { T } from "@/components/ui/T";
import { Reveal } from "@/components/ui/Reveal";

export function Hero() {
  return (
    <section id="top" className="px-5 pt-28 pb-14 sm:px-8 md:pt-36 md:pb-20">
      <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-[1fr_13rem] md:items-end lg:grid-cols-[1fr_15rem] lg:gap-16">
        <Reveal>
          <p className="label">
            <T value={profile.location} /> · <span className="text-accent">{profile.availability}</span>
          </p>
          <h1 className="mt-6 max-w-[20ch] text-[2.35rem] leading-[1.04] font-semibold tracking-[-0.035em] text-balance sm:text-6xl lg:text-[4.6rem]">
            {profile.headline}
          </h1>
          <p className="mt-7 max-w-[58ch] text-lg leading-relaxed text-muted sm:text-xl">{profile.intro}</p>
          <div className="mt-9 flex flex-wrap items-center gap-x-7 gap-y-4">
            {contact.email && (
              <a
                href={`mailto:${contact.email}`}
                className="bg-accent px-5 py-3 font-semibold text-bg transition hover:bg-text"
              >
                Email me
              </a>
            )}
            {profile.cv && (
              <a href={profile.cv} download className="link font-medium">
                Download CV (PDF)
              </a>
            )}
            <Link href="/#work" className="link font-medium">
              See my work
            </Link>
          </div>
        </Reveal>

        {profile.photo && (
          <Reveal delay={0.1} className="w-40 sm:w-48 md:w-full">
            <figure>
              <div className="relative aspect-[4/5] overflow-hidden border border-line">
                <Image
                  src={profile.photo}
                  alt={`Photo of ${profile.name}`}
                  fill
                  sizes="(max-width: 768px) 12rem, 15rem"
                  className="object-cover"
                  priority
                />
              </div>
              <figcaption className="label mt-3">{profile.name}</figcaption>
            </figure>
          </Reveal>
        )}
      </div>
    </section>
  );
}
