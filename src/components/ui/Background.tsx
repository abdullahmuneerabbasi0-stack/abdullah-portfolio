/** Fixed ambient glow behind the whole site. Glass needs colour behind it. */
export function Background() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="grid-bg absolute inset-0" />
      <div className="animate-float-slow absolute -top-40 left-1/2 h-[520px] w-[820px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(255_77_46/0.22),transparent)] blur-2xl" />
      <div className="animate-float-slow absolute top-[45%] -right-40 h-[480px] w-[480px] rounded-full bg-[radial-gradient(closest-side,rgb(255_122_26/0.12),transparent)] blur-2xl [animation-delay:-5s]" />
      <div className="animate-float-slow absolute bottom-[-10%] -left-40 h-[460px] w-[460px] rounded-full bg-[radial-gradient(closest-side,rgb(255_176_32/0.08),transparent)] blur-2xl [animation-delay:-9s]" />
    </div>
  );
}
