"use client";

import { useState } from "react";
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

  return (
    <div className={["w-full border-t border-[#29271F]/20", className].filter(Boolean).join(" ")}>
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        const panelId = `landing-faq-panel-${index}`;

        return (
          <article key={item.question} className="border-b border-[#29271F]/15">
            <h3>
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="group flex w-full items-start gap-4 py-5 text-left text-base font-medium text-[#29271F] transition-colors hover:text-[#927653] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#A58A67] sm:py-6 sm:text-lg"
              >
                <span className="mt-1 flex size-5 shrink-0 items-center justify-center text-[#8B765A]" aria-hidden="true">
                  {isOpen ? <Minus size={16} strokeWidth={1.5} /> : <Plus size={16} strokeWidth={1.5} />}
                </span>
                <span className="flex-1">{item.question}</span>
              </button>
            </h3>
            <div
              id={panelId}
              hidden={!isOpen}
              className="max-w-2xl pb-6 pl-9 text-sm leading-7 text-[#625D51] sm:text-base sm:leading-8"
            >
              {item.answer}
            </div>
          </article>
        );
      })}
    </div>
  );
}
