import { cn } from "@/lib/utils";

interface EyebrowProps {
  tone?: "light" | "dark";
  rule?: boolean;
  className?: string;
  children: React.ReactNode;
}

export function Eyebrow({ tone = "light", rule = true, className, children }: EyebrowProps) {
  return (
    <p
      className={cn(
        "mb-4 flex items-center gap-3 text-[11px] uppercase tracking-[0.24em] sm:text-xs",
        tone === "dark" ? "text-gold-soft" : "text-gold-deep",
        className,
      )}
    >
      {rule && <span aria-hidden="true" className="h-px w-8 bg-gold" />}
      {children}
    </p>
  );
}
