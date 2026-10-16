"use client";

import { FadeUp } from "@/components/motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "Apa itu LARISÉ?",
    answer:
      "LARISÉ adalah platform undangan pernikahan digital yang membantu kamu membuat, mengatur, dan membagikan undangan secara online.",
  },
  {
    question: "Apakah undangan bisa disesuaikan?",
    answer:
      "Ya. Kamu dapat menyesuaikan informasi dan konten undangan seperti nama, foto, cerita, detail acara, dan fitur yang tersedia pada tema yang dipilih.",
  },
  {
    question: "Apakah undangan bisa dibuka lewat HP?",
    answer:
      "Bisa. Undangan LARISÉ dirancang agar nyaman dibuka melalui smartphone maupun perangkat lainnya.",
  },
  {
    question: "Bagaimana cara membagikan undangan?",
    answer:
      "Setelah undangan siap dan dipublikasikan, kamu dapat membagikan link undangan melalui WhatsApp, media sosial, atau platform lainnya.",
  },
  {
    question: "Apakah tamu bisa melakukan RSVP?",
    answer:
      "Ya. Jika fitur RSVP tersedia pada tema atau paket yang digunakan, tamu dapat mengonfirmasi kehadiran langsung melalui undangan.",
  },
  {
    question: "Apakah saya bisa mengganti tema setelah membuat undangan?",
    answer:
      "Tema dapat diganti selama undangan tetap menggunakan struktur dan fitur yang didukung oleh tema tersebut. Konten undangan akan tetap tersimpan.",
  },
];

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
              Questions, Answered
            </h2>

            <p className="mx-auto mt-5 max-w-xl text-muted-foreground">
              Hal-hal yang mungkin ingin kamu ketahui sebelum membuat undangan.
            </p>
          </div>
        </FadeUp>

        <FadeUp>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
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
      </div>
    </section>
  );
}
