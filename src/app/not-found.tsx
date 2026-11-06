import Link from "next/link";

export default function NotFound() {
  return (
    <section className="grid min-h-[80dvh] place-items-center px-6 pt-24 text-center">
      <div>
        <p className="text-gradient font-display text-8xl font-bold">404</p>
        <h1 className="mt-4 font-display text-2xl font-semibold">This page doesn&apos;t exist</h1>
        <p className="mt-2 text-muted">The link may be broken or the page may have moved.</p>
        <Link href="/" className="bg-accent-gradient mt-8 inline-block rounded-xl px-6 py-3 font-semibold text-black">
          Back to home
        </Link>
      </div>
    </section>
  );
}
