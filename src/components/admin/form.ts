"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useConfirm, useToast } from "./feedback";

/** Immutable update of a nested value by a dotted path such as "ctas.0.label". */
export function setIn<T>(obj: T, path: string, value: unknown): T {
  const keys = path.split(".");
  const walk = (cur: unknown, i: number): unknown => {
    const k = keys[i];
    const idx = /^\d+$/.test(k) ? Number(k) : k;
    const base = Array.isArray(cur) ? [...cur] : { ...(cur as object) };
    const next = i === keys.length - 1 ? value : walk((cur as Record<string | number, unknown>)?.[idx], i + 1);
    (base as Record<string | number, unknown>)[idx] = next;
    return base;
  };
  return walk(obj, 0) as T;
}

/**
 * Form state for an editable object. Tracks whether anything changed since
 * the last save, and warns before leaving the page with unsaved changes.
 */
export function useEditor<T>(initial: T) {
  const [value, setValue] = useState<T>(initial);
  const [saved, setSaved] = useState<string>(() => JSON.stringify(initial));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const dirty = useMemo(() => JSON.stringify(value) !== saved, [value, saved]);

  const set = useCallback((path: string, v: unknown) => {
    setValue((cur) => setIn(cur, path, v));
    setErrors((e) => {
      if (!e[path]) return e;
      const { [path]: _, ...rest } = e;
      void _;
      return rest;
    });
  }, []);

  const markSaved = useCallback((v?: T) => {
    setValue((cur) => {
      const next = v ?? cur;
      setSaved(JSON.stringify(next));
      return next;
    });
  }, []);

  const reset = useCallback(() => {
    setValue(JSON.parse(saved));
    setErrors({});
  }, [saved]);

  useUnsavedGuard(dirty);
  return { value, setValue, set, dirty, errors, setErrors, markSaved, reset };
}

/** Warns before closing the tab or following an in-app link while there are unsaved changes. */
export function useUnsavedGuard(dirty: boolean) {
  const confirm = useConfirm();
  const router = useRouter();
  const dirtyRef = useRef(dirty);
  useEffect(() => {
    dirtyRef.current = dirty;
  }, [dirty]);

  useEffect(() => {
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!dirtyRef.current) return;
      e.preventDefault();
      e.returnValue = "";
    };
    const onClick = async (e: MouseEvent) => {
      if (!dirtyRef.current || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey) return;
      const a = (e.target as HTMLElement).closest("a");
      if (!a || a.target === "_blank" || a.hasAttribute("download")) return;
      const href = a.getAttribute("href");
      if (!href || href.startsWith("#")) return;
      e.preventDefault();
      e.stopPropagation();
      const leave = await confirm({
        title: "Leave without saving?",
        body: "You have unsaved changes on this page. If you leave now, they'll be lost.",
        confirmLabel: "Leave page",
        cancelLabel: "Stay",
        danger: true,
      });
      if (leave) {
        dirtyRef.current = false;
        router.push(href);
      }
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    document.addEventListener("click", onClick, true);
    return () => {
      window.removeEventListener("beforeunload", onBeforeUnload);
      document.removeEventListener("click", onClick, true);
    };
  }, [confirm, router]);
}

type Result = { ok: boolean; message?: string; errors?: Record<string, string>; signedOut?: boolean };

/** Runs a server action with toasts, error mapping and a loading flag. */
export function useAction() {
  const toast = useToast();
  const router = useRouter();
  const [pending, setPending] = useState<string | null>(null);
  const run = useCallback(
    async <R extends Result>(key: string, fn: () => Promise<R>, opts: { onErrors?: (e: Record<string, string>) => void; quiet?: boolean } = {}): Promise<R | null> => {
      setPending(key);
      try {
        const res = await fn();
        if (res.ok) {
          if (!opts.quiet && res.message) toast(res.message, "success");
        } else {
          toast(res.message ?? "Something went wrong.", "error");
          if (res.errors) opts.onErrors?.(res.errors);
          if (res.signedOut) router.push("/admin/login");
        }
        return res;
      } catch {
        toast("Couldn't reach the server. Check your connection and try again.", "error");
        return null;
      } finally {
        setPending(null);
      }
    },
    [toast, router],
  );
  return { run, pending };
}
