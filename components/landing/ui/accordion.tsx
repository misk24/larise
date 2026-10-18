"use client";

import { useId, useState } from "react";
import { Minus, Plus } from "lucide-react";

export interface EditorialAccordionItem {
  question: string;
  answer: string;
}

interface EditorialAccordionProps {
  items: EditorialAccordionItem[];
  className?: string;
}

export function EditorialAccordion({ items, className }: EditorialAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const instanceId = useId();

  return (
    <div className={["w-full border-t border-[#29271F]/20", className].filter(Boolean).join(" ")}>
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        const panelId = `landing-faq-${instanceId.replace(/:/g, "")}-panel-${index}`;
        const triggerId = `landing-faq-${instanceId.replace(/:/g, "")}-trigger-${index}`;

        return (
          <article key={item.question} className="border-b border-[#29271F]/15">
            <h3>
              <button
                id={triggerId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="group flex w-full items-start gap-4 py-5 text-left text-base font-medium text-[#29271F] transition-colors duration-200 hover:text-[#927653] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#A58A67] sm:py-6 sm:text-lg"
              >
                <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center text-[#8B765A]" aria-hidden="true">
                  <span
                    className={[
                      "transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
                      isOpen ? "rotate-180" : "rotate-0",
                    ].join(" ")}
                  >
                    {isOpen ? (
                      <Minus size={16} strokeWidth={1.5} />
                    ) : (
                      <Plus size={16} strokeWidth={1.5} />
                    )}
                  </span>
                </span>
                <span className="flex-1">{item.question}</span>
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={triggerId}
              aria-hidden={!isOpen}
              className={[
                "grid transition-[grid-template-rows,opacity] duration-[360ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
                "motion-reduce:transition-none",
                isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
              ].join(" ")}
            >
              <div className="min-h-0 overflow-hidden">
                <div
                  className={[
                    "max-w-2xl pb-6 pl-9 text-sm leading-7 text-[#625D51] transition-[transform] duration-[360ms] ease-[cubic-bezier(0.22,1,0.36,1)] sm:text-base sm:leading-8",
                    "motion-reduce:transition-none",
                    isOpen ? "translate-y-0" : "-translate-y-1.5",
                  ].join(" ")}
                >
                  {item.answer}
                </div>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
