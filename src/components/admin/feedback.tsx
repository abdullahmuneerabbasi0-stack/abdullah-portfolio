"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { AlertTriangle, CheckCircle2, Info, X, XCircle } from "lucide-react";
import { Button, cx } from "./ui";

// Toasts ----------------------------------------------------------------------------

type Tone = "success" | "error" | "info";
type Toast = { id: number; tone: Tone; message: string };
type ToastFn = (message: string, tone?: Tone) => void;

const ToastContext = createContext<ToastFn>(() => {});
export const useToast = () => useContext(ToastContext);

// Confirm dialogs -----------------------------------------------------------------------

type ConfirmOptions = { title: string; body?: ReactNode; confirmLabel?: string; cancelLabel?: string; danger?: boolean };
type ConfirmFn = (o: ConfirmOptions) => Promise<boolean>;
const ConfirmContext = createContext<ConfirmFn>(async () => false);
export const useConfirm = () => useContext(ConfirmContext);

export function FeedbackProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const nextId = useRef(1);
  const toast = useCallback<ToastFn>((message, tone = "success") => {
    const id = nextId.current++;
    setToasts((t) => [...t.slice(-3), { id, tone, message }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), tone === "error" ? 7000 : 4000);
  }, []);

  const [dialog, setDialog] = useState<(ConfirmOptions & { resolve: (v: boolean) => void }) | null>(null);
  const confirm = useCallback<ConfirmFn>((o) => new Promise((resolve) => setDialog({ ...o, resolve })), []);
  const close = (v: boolean) => {
    dialog?.resolve(v);
    setDialog(null);
  };

  return (
    <ToastContext.Provider value={toast}>
      <ConfirmContext.Provider value={confirm}>
        {children}
        <div aria-live="polite" className="pointer-events-none fixed right-4 bottom-4 z-[200] flex w-[min(24rem,calc(100vw-2rem))] flex-col gap-2">
          <AnimatePresence initial={false}>
            {toasts.map((t) => (
              <motion.div
                key={t.id}
                layout
                initial={{ opacity: 0, y: 16, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, x: 40 }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                role={t.tone === "error" ? "alert" : "status"}
                className={cx(
                  "pointer-events-auto flex items-start gap-3 rounded-xl border bg-[#171311]/95 p-3.5 text-sm shadow-2xl backdrop-blur",
                  t.tone === "error" ? "border-red-400/30" : t.tone === "info" ? "border-white/10" : "border-emerald-400/25",
                )}
              >
                {t.tone === "error" ? (
                  <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-300" />
                ) : t.tone === "info" ? (
                  <Info className="mt-0.5 h-4 w-4 shrink-0 text-accent-2" />
                ) : (
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-300" />
                )}
                <p className="flex-1 leading-relaxed text-text/90">{t.message}</p>
                <button type="button" aria-label="Dismiss" onClick={() => setToasts((x) => x.filter((y) => y.id !== t.id))} className="text-muted hover:text-text">
                  <X className="h-4 w-4" />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        <Modal open={!!dialog} onClose={() => close(false)} labelledBy="confirm-title" size="sm">
          {dialog && (
            <div className="p-6">
              <div className="flex items-start gap-4">
                <span className={cx("grid h-10 w-10 shrink-0 place-items-center rounded-xl", dialog.danger ? "bg-red-500/15 text-red-300" : "bg-accent/15 text-accent-2")}>
                  <AlertTriangle className="h-5 w-5" />
                </span>
                <div>
                  <h2 id="confirm-title" className="text-base font-semibold">
                    {dialog.title}
                  </h2>
                  {dialog.body && <div className="mt-1.5 text-sm leading-relaxed text-muted">{dialog.body}</div>}
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-2">
                <Button variant="ghost" onClick={() => close(false)}>
                  {dialog.cancelLabel ?? "Cancel"}
                </Button>
                <Button variant={dialog.danger ? "danger" : "primary"} onClick={() => close(true)} autoFocus>
                  {dialog.confirmLabel ?? "Confirm"}
                </Button>
              </div>
            </div>
          )}
        </Modal>
      </ConfirmContext.Provider>
    </ToastContext.Provider>
  );
}

/** Accessible modal: traps focus loosely, closes on Escape and backdrop click. */
export function Modal({
  open,
  onClose,
  children,
  labelledBy,
  size = "md",
}: {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  labelledBy?: string;
  size?: "sm" | "md" | "lg" | "xl";
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const prev = document.activeElement as HTMLElement | null;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab" && ref.current) {
        const els = ref.current.querySelectorAll<HTMLElement>('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        const list = [...els].filter((el) => !el.hasAttribute("disabled"));
        if (!list.length) return;
        const first = list[0];
        const last = list[list.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    const t = setTimeout(() => {
      const auto = ref.current?.querySelector<HTMLElement>("[autofocus], input, button");
      auto?.focus();
    }, 30);
    document.body.style.overflow = "hidden";
    return () => {
      clearTimeout(t);
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      prev?.focus?.();
    };
  }, [open, onClose]);

  const widths = { sm: "max-w-md", md: "max-w-xl", lg: "max-w-3xl", xl: "max-w-5xl" };
  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-[150] flex items-end justify-center p-0 sm:items-center sm:p-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />
          <motion.div
            ref={ref}
            role="dialog"
            aria-modal="true"
            aria-labelledby={labelledBy}
            initial={{ y: 24, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 24, opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className={cx(
              "relative max-h-[92dvh] w-full overflow-y-auto rounded-t-2xl border border-white/10 bg-[#141110] shadow-2xl sm:rounded-2xl",
              widths[size],
            )}
          >
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
