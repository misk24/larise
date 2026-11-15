"use client";

import { MonitorIcon, MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";
import { cn } from "@/lib/utils";

const options = [
  { value: "light", label: "Terang", Icon: SunIcon },
  { value: "dark", label: "Gelap", Icon: MoonIcon },
  { value: "system", label: "Sistem", Icon: MonitorIcon },
] as const;

// The stored theme only exists in the browser, so nothing is checked until after hydration.
const subscribe = () => () => {};

export function ThemeToggle({ showLabels = false, className }: { showLabels?: boolean; className?: string }) {
  const { theme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(subscribe, () => true, () => false);

  return (
    <div role="radiogroup" aria-label="Tema tampilan" className={cn("inline-flex rounded-[4px] border border-fg/20 p-0.5", className)}>
      {options.map(({ value, label, Icon }) => {
        const selected = mounted && theme === value;
        return (
          <button
            key={value}
            type="button"
            role="radio"
            aria-checked={selected}
            aria-label={showLabels ? undefined : label}
            onClick={() => setTheme(value)}
            className={cn(
              "inline-flex min-h-9 min-w-9 flex-1 items-center justify-center gap-2 rounded-[3px] px-2.5 text-xs transition-colors duration-200",
              selected ? "bg-fg text-background" : "text-fg/70 hover:text-fg",
            )}
          >
            <Icon aria-hidden="true" className="size-4" />
            {showLabels && <span>{label}</span>}
          </button>
        );
      })}
    </div>
  );
}
