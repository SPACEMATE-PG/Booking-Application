import * as React from "react";
import { cn } from "@/lib/utils";

export interface CalendarProps {
  mode?: "single" | "range";
  selected?: Date | null;
  onSelect?: (date: Date | null) => void;
  disabled?: (date: Date) => boolean;
  initialFocus?: boolean;
  className?: string;
}

/**
 * Minimal Calendar wrapper used by booking flow.
 * - Renders a native date input (simple, dependency-free)
 * - Supports the props used in booking page:
 *   mode="single", selected, onSelect, disabled, initialFocus
 */
export function Calendar({
  selected = null,
  onSelect,
  disabled,
  initialFocus,
  className,
}: CalendarProps) {
  const ref = React.useRef<HTMLInputElement | null>(null);

  React.useEffect(() => {
    if (initialFocus && ref.current) {
      ref.current.focus();
    }
  }, [initialFocus]);

  const value = selected ? selected.toISOString().split("T")[0] : "";

  // If consumer provided a disabled predicate that disables dates before today,
  // we set min to today to prevent selecting past dates with native input.
  const todayISO = new Date().toISOString().split("T")[0];
  const min = disabled ? todayISO : undefined;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    if (!v) {
      onSelect?.(null);
      return;
    }
    const d = new Date(v + "T00:00:00");
    // Respect disabled predicate if provided
    if (disabled && disabled(d)) return;
    onSelect?.(d);
  };

  return (
    <input
      ref={ref}
      type="date"
      value={value}
      onChange={handleChange}
      min={min}
      className={cn(
        "w-full rounded-md border px-3 py-2 bg-background text-sm",
        className
      )}
    />
  );
}