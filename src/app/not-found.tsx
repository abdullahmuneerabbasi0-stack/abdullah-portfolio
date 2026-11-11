import { Pill } from "@/components/ui/Pill";

export default function NotFound() {
  return (
    <section className="grid min-h-[80dvh] place-items-center px-6 pt-24 text-center">
      <div>
        <p className="font-display text-[9rem] leading-none italic text-accent-2">404</p>
        <h1 className="mt-4 font-display text-4xl">This page doesn&apos;t exist</h1>
        <p className="mt-3 text-muted">The link may be broken or the page may have moved.</p>
        <Pill href="/" variant="solid" className="mt-10">
          Back to home
        </Pill>
      </div>
    </section>
  );
}
