"use client";

import { FadeUp } from "@/components/motion";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { MessageCircle } from "lucide-react";

const faqs = [
  { question: "Apa itu LARISÉ?", answer: "LARISÉ adalah platform undangan pernikahan digital untuk menyusun informasi acara, membagikan cerita, dan mengirim undangan melalui satu tautan." },
  { question: "Apakah isi undangan bisa disesuaikan?", answer: "Kamu dapat menyesuaikan informasi dan konten yang tersedia, seperti nama pasangan, foto, cerita, detail acara, dan elemen lain sesuai tema yang dipilih." },
  { question: "Apakah undangan bisa dibuka lewat HP?", answer: "Bisa. Halaman undangan dirancang responsif agar nyaman dibuka melalui smartphone maupun layar yang lebih besar." },
  { question: "Bagaimana cara membagikan undangan?", answer: "Setelah undangan siap dan dipublikasikan, bagikan tautannya melalui WhatsApp, media sosial, atau kanal komunikasi pilihanmu." },
  { question: "Apakah tamu bisa melakukan RSVP?", answer: "Jika fitur RSVP tersedia pada tema atau paket yang digunakan, tamu dapat mengonfirmasi kehadiran langsung melalui halaman undangan." },
  { question: "Bisakah tema diganti setelah undangan dibuat?", answer: "Penggantian tema mengikuti struktur dan fitur yang didukung oleh tema tujuan. Sebelum mengganti, tinjau kembali tampilan dan konten agar hasilnya sesuai." },
];

export function FAQSection() {
  return (
    <section id="faq" aria-labelledby="faq-title" className="bg-[#f0ede5] px-5 py-20 text-[#29271f] sm:px-8 sm:py-28 lg:py-32">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.75fr_1.25fr] lg:gap-20">
        <FadeUp>
          <div className="lg:sticky lg:top-28 lg:self-start">
            <p className="mb-4 flex items-center gap-3 text-[10px] uppercase tracking-[0.24em] text-[#8b765a] sm:text-xs"><span className="h-px w-8 bg-[#a58a67]" />A few helpful answers</p>
            <h2 id="faq-title" className="frontend-display max-w-lg text-[clamp(2.75rem,6vw,4.5rem)] leading-[0.98] tracking-[-0.055em] text-balance">Ada yang ingin <span className="italic text-[#8b765a]">diketahui?</span></h2>
            <p className="mt-5 max-w-md text-sm leading-7 text-[#625d51] sm:text-base sm:leading-8">Jawaban singkat untuk membantu kamu memahami cara kerja undangan digital LARISÉ.</p>
            <div className="mt-8 hidden items-center gap-3 border-t border-[#29271f]/15 pt-5 text-sm text-[#625d51] sm:flex"><span className="grid size-10 place-items-center rounded-full border border-[#a58a67]/50"><MessageCircle className="size-4 text-[#8b765a]" /></span><span>Informasi jelas, sebelum mulai membuat.</span></div>
          </div>
        </FadeUp>
        <FadeUp>
          <Accordion type="single" collapsible className="w-full border-t border-[#29271f]/20">
            {faqs.map((faq, index) => (
              <AccordionItem key={faq.question} value={"faq-" + index} className="border-[#29271f]/15">
                <AccordionTrigger className="gap-4 py-5 text-left text-base font-medium text-[#29271f] hover:no-underline sm:py-6 sm:text-lg [&>svg]:text-[#8b765a]">
                  <span className="mr-2 text-xs font-normal tracking-[0.15em] text-[#8b765a]">{String(index + 1).padStart(2, "0")}</span>{faq.question}
                </AccordionTrigger>
                <AccordionContent className="max-w-2xl pb-6 pl-9 text-sm leading-7 text-[#625d51] sm:text-base sm:leading-8">{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </FadeUp>
      </div>
    </section>
  );
}