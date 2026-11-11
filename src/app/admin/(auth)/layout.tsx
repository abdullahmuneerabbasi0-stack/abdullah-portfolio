export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="relative grid min-h-dvh place-items-center overflow-hidden bg-[#0a0807] px-5 py-16">
      <div aria-hidden="true" className="pointer-events-none absolute -top-1/3 left-1/2 h-[80vh] w-[120vw] -translate-x-1/2 bg-[radial-gradient(closest-side,rgb(var(--accent-rgb)/0.14),transparent)]" />
      <div className="relative w-full max-w-sm">{children}</div>
    </main>
  );
}
