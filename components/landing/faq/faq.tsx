"use client";

import { FadeLeft, FadeUp } from "@/components/motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { faqSection } from "./constant";

export function FAQSection() {
  return (
    <section
      id="faq"
      aria-labelledby="faq-title"
      className="px-6 py-24 md:px-8"
    >
      <div className="max-w-6xl mx-auto">
        <FadeLeft>
          <h2 id="faq-title" className="mb-16 md:text-center">
            {faqSection.title}
          </h2>
        </FadeLeft>

        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:gap-10">
          <FadeUp>
            <Accordion
              type="single"
              collapsible
              className="rounded-2xl border border-border/60 bg-card/30 px-4 md:px-6"
            >
              {faqSection.faqs.map((faq, index) => (
                <AccordionItem key={faq.question} value={`faq-${index}`}>
                  <AccordionTrigger className="text-base">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground text-base">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </FadeUp>

          <FadeUp>
            <Card className="h-full border-border/60 bg-muted/30">
              <CardContent className="p-6 md:p-8">
                <h3 className="mb-2">{faqSection.aside.title}</h3>
                <p className="text-muted-foreground mb-6">
                  {faqSection.aside.description}
                </p>
                <Button size="lg" className="rounded-full" asChild>
                  <Link href={faqSection.aside.cta.href}>
                    {faqSection.aside.cta.label}
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </FadeUp>
        </div>
      </div>
    </section>
  );
}
