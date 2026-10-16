"use client";

import { FadeUp } from "@/components/motion";

const steps = [
  {
    number: "01",
    title: "Choose Your Theme",
    description:
      "Pilih desain yang paling sesuai dengan gaya dan cerita kalian.",
  },
  {
    number: "02",
    title: "Make It Yours",
    description:
      "Tambahkan nama, foto, cerita, detail acara, dan informasi lainnya.",
  },
  {
    number: "03",
    title: "Share Your Invitation",
    description:
      "Preview undanganmu, publish, lalu bagikan link-nya kepada tamu.",
  },
];

export function HowItWorksSection() {
  return (
    <section
      id="how-it-works"
      aria-labelledby="how-it-works-title"
      className="px-6 py-24 md:px-8 md:py-32"
    >
      <div className="mx-auto max-w-6xl">
        <FadeUp>
          <div className="max-w-2xl mb-16 md:mb-20">
            <p className="mb-4 text-xs tracking-[0.25em] uppercase text-muted-foreground">
              How It Works
            </p>

            <h2 id="how-it-works-title" className="text-balance">
              Simple from Start to Share
            </h2>

            <p className="mt-6 max-w-xl text-muted-foreground">
              Buat undanganmu dalam beberapa langkah sederhana, lalu bagikan
              kepada orang-orang yang kamu sayangi.
            </p>
          </div>
        </FadeUp>

        <div className="grid gap-0 md:grid-cols-3 md:gap-8">
          {steps.map((step, index) => (
            <FadeUp key={step.number}>
              <article
                className={[
                  "relative py-8 md:py-0",
                  index !== 0
                    ? "border-t border-border md:border-t-0 md:border-l md:pl-8"
                    : "",
                ].join(" ")}
              >
                <span className="text-sm tracking-[0.2em] text-muted-foreground">
                  {step.number}
                </span>

                <h3 className="mt-6 text-xl">{step.title}</h3>

                <p className="mt-4 max-w-sm text-muted-foreground">
                  {step.description}
                </p>

                {/* Desktop connector */}
                {index < steps.length - 1 && (
                  <span
                    aria-hidden="true"
                    className="absolute top-2 right-0 hidden h-px w-8 translate-x-full bg-border md:block"
                  />
                )}
              </article>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}
