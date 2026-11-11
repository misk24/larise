import { FadeUp } from "@/components/motion";
import { cn } from "@/lib/utils";

export interface NumberedItem {
  number: string;
  title: string;
  description: string;
}

// Three editorial columns for ink (dark) sections.
export function NumberedColumns({ items }: { items: NumberedItem[] }) {
  return (
    <div className="grid gap-0 pt-4 md:grid-cols-3 md:pt-8">
      {items.map((item, index) => (
        <FadeUp key={item.number}>
          <article
            className={cn(
              "flex h-full flex-col border-b border-white/15 py-7 sm:py-9 md:border-b-0 md:py-5",
              index > 0 ? "md:border-l md:pl-7 lg:pl-10" : "md:pr-7 lg:pr-10",
              index === 1 && "lg:px-10",
            )}
          >
            <span className="text-xs tracking-[0.16em] text-gold-soft">{item.number}</span>
            <h3 className="frontend-display mt-5 text-2xl font-normal tracking-tight sm:text-3xl">{item.title}</h3>
            <p className="mt-3 max-w-sm text-sm leading-6 text-white/65 sm:text-base sm:leading-7">{item.description}</p>
          </article>
        </FadeUp>
      ))}
    </div>
  );
}
