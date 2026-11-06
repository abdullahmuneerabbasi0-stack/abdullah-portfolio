import type { Text } from "@/content/site";

/**
 * Renders content text. Placeholders get a dashed amber outline so they are
 * impossible to miss before launch.
 */
export function T({ value }: { value: Text }) {
  if (typeof value === "string") return <>{value}</>;
  return (
    <span className="placeholder px-1" title="Placeholder: replace before sharing">
      [{value.placeholder}]
    </span>
  );
}

export const isPlaceholder = (value: Text) => typeof value !== "string";
export const plain = (value: Text) => (typeof value === "string" ? value : "");
