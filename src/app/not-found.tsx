import Link from "next/link";

export default function NotFound() {
  return (
    <section className="px-5 pt-36 pb-24 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <p className="label text-accent">404</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">There&apos;s no page at this address.</h1>
        <p className="mt-4 text-lg text-muted">The link may be mistyped, or the page was moved.</p>
        <Link href="/" className="link mt-8 inline-block font-medium">
          Go to the home page
        </Link>
      </div>
    </section>
  );
}
