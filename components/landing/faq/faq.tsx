"use client";

import { FadeUp } from "@/components/motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { faqSection } from "./constant";

export function FAQSection() {
  return (
    <section
      id="faq"
      aria-labelledby="faq-title"
      className="px-6 py-24 md:px-8 md:py-32"
    >
      <div className="mx-auto max-w-4xl">
        <FadeUp>
          <div className="mb-12 text-center md:mb-16">
            <p className="mb-4 text-small uppercase tracking-[0.2em] text-muted-foreground">
              FAQ
            </p>

            <h2 id="faq-title" className="text-balance">
              {faqSection.title}
            </h2>

            <p className="mx-auto mt-5 max-w-xl text-muted-foreground">
              {faqSection.description}
            </p>
          </div>
        </FadeUp>

        <FadeUp>
          <Accordion type="single" collapsible className="w-full">
            {faqSection.faqs.map((faq, index) => (
              <AccordionItem
                key={faq.question}
                value={`faq-${index}`}
                className="border-border/70"
              >
                <AccordionTrigger className="py-6 text-left text-base font-medium hover:no-underline md:text-lg">
                  {faq.question}
                </AccordionTrigger>

                <AccordionContent className="max-w-3xl pb-6 text-base leading-relaxed text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </FadeUp>

        <FadeUp>
          <div className="mt-12 flex flex-col items-center text-center md:mt-16">
            <p className="mb-4 text-muted-foreground">
              {faqSection.aside.title}
            </p>

            <Button size="lg" className="rounded-full" asChild>
              <Link href={faqSection.aside.cta.href}>
                {faqSection.aside.cta.label}
              </Link>
            </Button>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}
