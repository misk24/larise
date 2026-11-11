import { cn } from "@/lib/utils";
import { Eyebrow } from "./eyebrow";

interface SectionHeaderProps {
  id: string;
  eyebrow: string;
  title: string;
  accent: string;
  description: string;
  tone?: "light" | "dark";
}

export function SectionHeader({ id, eyebrow, title, accent, description, tone = "light" }: SectionHeaderProps) {
  const dark = tone === "dark";

  return (
    <div
      className={cn(
        "grid gap-7 border-b pb-10 md:grid-cols-[1fr_0.75fr] md:items-end md:gap-12 md:pb-14",
        dark ? "border-white/15" : "border-border",
      )}
    >
      <div>
        <Eyebrow tone={tone}>{eyebrow}</Eyebrow>
        <h2
          id={id}
          className="frontend-display max-w-2xl text-[clamp(2.75rem,6vw,5rem)] leading-[0.98] tracking-[-0.055em] text-balance"
        >
          {title} <span className={dark ? "text-gold-soft" : "text-gold-deep"}>{accent}</span>
        </h2>
      </div>
      <p
        className={cn(
          "max-w-lg text-base leading-7 sm:text-lg sm:leading-8 md:justify-self-end",
          dark ? "text-white/65" : "text-muted-foreground",
        )}
      >
        {description}
      </p>
    </div>
  );
}
