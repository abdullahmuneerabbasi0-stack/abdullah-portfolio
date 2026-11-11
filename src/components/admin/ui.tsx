"use client";

import {
  forwardRef,
  useId,
  type ButtonHTMLAttributes,
  type InputHTMLAttributes,
  type ReactNode,
  type SelectHTMLAttributes,
  type TextareaHTMLAttributes,
} from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";

import { cx } from "./cx";
export { cx };

type Variant = "primary" | "secondary" | "ghost" | "danger";
const variants: Record<Variant, string> = {
  primary: "bg-accent text-ink hover:bg-accent-2 shadow-[0_8px_24px_-12px_rgb(var(--accent-rgb)/0.8)]",
  secondary: "border border-white/10 bg-white/[0.04] text-text hover:bg-white/[0.08] hover:border-white/20",
  ghost: "text-muted hover:bg-white/[0.06] hover:text-text",
  danger: "border border-red-400/25 bg-red-500/10 text-red-300 hover:bg-red-500/20",
};

type BtnProps = ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; loading?: boolean; icon?: ReactNode; size?: "sm" | "md" };

export const Button = forwardRef<HTMLButtonElement, BtnProps>(function Button(
  { variant = "secondary", loading, icon, size = "md", className, children, disabled, ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={cx(
        "inline-flex items-center justify-center gap-2 rounded-xl font-medium whitespace-nowrap transition-all duration-200 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50",
        size === "sm" ? "h-8 px-3 text-xs" : "h-10 px-4 text-sm",
        variants[variant],
        className,
      )}
      {...rest}
    >
      {loading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : icon}
      {children}
    </button>
  );
});

export function ButtonLink({ href, variant = "secondary", icon, children, className, external }: { href: string; variant?: Variant; icon?: ReactNode; children: ReactNode; className?: string; external?: boolean }) {
  const cls = cx("inline-flex h-10 items-center justify-center gap-2 rounded-xl px-4 text-sm font-medium whitespace-nowrap transition-all duration-200", variants[variant], className);
  return external ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
      {icon}
      {children}
    </a>
  ) : (
    <Link href={href} className={cls}>
      {icon}
      {children}
    </Link>
  );
}

const control =
  "w-full rounded-xl border border-white/10 bg-black/30 px-3.5 text-sm text-text placeholder:text-muted/50 transition-colors focus:border-accent/60 focus:bg-black/40 focus:outline-none focus:ring-2 focus:ring-accent/20 aria-[invalid=true]:border-red-400/60";

export function Field({
  label,
  hint,
  error,
  children,
  className,
  htmlFor,
  aside,
}: {
  label: string;
  hint?: ReactNode;
  error?: string;
  children: ReactNode;
  className?: string;
  htmlFor?: string;
  aside?: ReactNode;
}) {
  return (
    <div className={cx("space-y-1.5", className)}>
      <div className="flex items-baseline justify-between gap-3">
        <label htmlFor={htmlFor} className="text-[0.8rem] font-medium text-text/90">
          {label}
        </label>
        {aside}
      </div>
      {children}
      {error ? (
        <p className="text-xs text-red-300" role="alert">
          {error}
        </p>
      ) : hint ? (
        <p className="text-xs leading-relaxed text-muted">{hint}</p>
      ) : null}
    </div>
  );
}

type TextProps = { label: string; hint?: ReactNode; error?: string; value: string; onChange: (v: string) => void; className?: string } & Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "value" | "onChange"
>;

export function TextField({ label, hint, error, value, onChange, className, maxLength, ...rest }: TextProps) {
  const id = useId();
  return (
    <Field
      label={label}
      hint={hint}
      error={error}
      className={className}
      htmlFor={id}
      aside={maxLength && value.length > maxLength * 0.8 ? <span className="text-[0.7rem] text-muted">{value.length}/{maxLength}</span> : undefined}
    >
      <input id={id} value={value} onChange={(e) => onChange(e.target.value)} aria-invalid={!!error} maxLength={maxLength} className={cx(control, "h-10")} {...rest} />
    </Field>
  );
}

type AreaProps = { label: string; hint?: ReactNode; error?: string; value: string; onChange: (v: string) => void; className?: string } & Omit<
  TextareaHTMLAttributes<HTMLTextAreaElement>,
  "value" | "onChange"
>;

export function TextArea({ label, hint, error, value, onChange, className, rows = 3, maxLength, ...rest }: AreaProps) {
  const id = useId();
  return (
    <Field
      label={label}
      hint={hint}
      error={error}
      className={className}
      htmlFor={id}
      aside={maxLength && value.length > maxLength * 0.8 ? <span className="text-[0.7rem] text-muted">{value.length}/{maxLength}</span> : undefined}
    >
      <textarea id={id} value={value} rows={rows} maxLength={maxLength} onChange={(e) => onChange(e.target.value)} aria-invalid={!!error} className={cx(control, "resize-y py-2.5 leading-relaxed")} {...rest} />
    </Field>
  );
}

export function SelectField<T extends string>({
  label,
  hint,
  error,
  value,
  onChange,
  options,
  className,
  ...rest
}: {
  label: string;
  hint?: ReactNode;
  error?: string;
  value: T;
  onChange: (v: T) => void;
  options: readonly (T | { value: T; label: string })[];
  className?: string;
} & Omit<SelectHTMLAttributes<HTMLSelectElement>, "value" | "onChange">) {
  const id = useId();
  return (
    <Field label={label} hint={hint} error={error} className={className} htmlFor={id}>
      <select id={id} value={value} onChange={(e) => onChange(e.target.value as T)} className={cx(control, "h-10 appearance-none bg-[length:12px] bg-[right_0.9rem_center] bg-no-repeat pr-9")} style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 12'%3E%3Cpath d='M3 4.5l3 3 3-3' fill='none' stroke='%23a69c8f' stroke-width='1.5'/%3E%3C/svg%3E\")" }} {...rest}>
        {options.map((o) => {
          const v = typeof o === "string" ? o : o.value;
          return (
            <option key={v} value={v} className="bg-surface">
              {typeof o === "string" ? o : o.label}
            </option>
          );
        })}
      </select>
    </Field>
  );
}

export function Switch({
  checked,
  onChange,
  label,
  description,
  disabled,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  description?: ReactNode;
  disabled?: boolean;
}) {
  const id = useId();
  return (
    <div className={cx("flex items-start justify-between gap-4", disabled && "opacity-60")}>
      <div>
        <label htmlFor={id} className="text-sm font-medium text-text/90">
          {label}
        </label>
        {description && <p className="mt-0.5 text-xs leading-relaxed text-muted">{description}</p>}
      </div>
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={cx(
          "relative mt-0.5 inline-flex h-6 w-11 shrink-0 items-center rounded-full border transition-colors duration-300",
          checked ? "border-accent/60 bg-accent" : "border-white/10 bg-white/10",
        )}
      >
        <span className={cx("inline-block h-4.5 w-4.5 rounded-full bg-white shadow transition-transform duration-300", checked ? "translate-x-[22px]" : "translate-x-[3px]")} />
      </button>
    </div>
  );
}

export function Card({ title, description, children, className, actions }: { title?: string; description?: ReactNode; children: ReactNode; className?: string; actions?: ReactNode }) {
  return (
    <section className={cx("rounded-2xl border border-white/[0.07] bg-surface/70 p-5 shadow-[0_1px_0_0_rgb(255_255_255/0.03)_inset] sm:p-6", className)}>
      {(title || actions) && (
        <header className="mb-5 flex flex-wrap items-start justify-between gap-3">
          <div>
            {title && <h2 className="text-[0.95rem] font-semibold text-text">{title}</h2>}
            {description && <p className="mt-1 max-w-2xl text-xs leading-relaxed text-muted">{description}</p>}
          </div>
          {actions}
        </header>
      )}
      {children}
    </section>
  );
}

export function Badge({ tone = "neutral", children, className }: { tone?: "neutral" | "success" | "warning" | "accent" | "danger"; children: ReactNode; className?: string }) {
  const tones = {
    neutral: "border-white/10 bg-white/[0.04] text-muted",
    success: "border-emerald-400/25 bg-emerald-400/10 text-emerald-300",
    warning: "border-amber-400/25 bg-amber-400/10 text-amber-200",
    accent: "border-accent/30 bg-accent/10 text-accent-3",
    danger: "border-red-400/25 bg-red-400/10 text-red-300",
  };
  return <span className={cx("inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[0.7rem] font-medium", tones[tone], className)}>{children}</span>;
}

export function PageHeader({ title, description, actions, eyebrow }: { title: string; description?: ReactNode; actions?: ReactNode; eyebrow?: string }) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        {eyebrow && <p className="mb-2 text-[0.7rem] font-medium tracking-[0.22em] text-accent-2 uppercase">{eyebrow}</p>}
        <h1 className="font-display text-4xl leading-none tracking-[-0.01em] sm:text-[2.75rem]">{title}</h1>
        {description && <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

export function EmptyState({ icon, title, description, action }: { icon: ReactNode; title: string; description: ReactNode; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 px-6 py-16 text-center">
      <span className="grid h-12 w-12 place-items-center rounded-2xl border border-white/10 bg-white/[0.03] text-accent-2">{icon}</span>
      <h3 className="mt-4 font-display text-2xl">{title}</h3>
      <p className="mt-1.5 max-w-sm text-sm text-muted">{description}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return <div className={cx("animate-pulse rounded-xl bg-white/[0.05]", className)} />;
}
